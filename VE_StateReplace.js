/*
 * ==============================================================================
 * ** Victor Engine MV - State Replace
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.03.01 > First release.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - State Replace'] = '1.00';

var VictorEngine = VictorEngine || {};
VictorEngine.StateReplace = VictorEngine.StateReplace || {};

(function() {

	VictorEngine.StateReplace.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.StateReplace.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - State Replace', 'VE - Basic Module', '1.12');
	};

	VictorEngine.StateReplace.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function(name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.StateReplace.requiredPlugin.call(this, name, required, version)
		};
	};
	
})();

/*:
 * ------------------------------------------------------------------------------
 * @plugindesc v1.00 - 一番下に配置Replaces the state being inflicted with another.
 * @author Victor Sant
 *
 * ------------------------------------------------------------------------------
 * @help 
 * 一番下に配置（replacecode内のaddstateはVictorEngine.StateReplace.addStateに置換される（これより下のプラグインが反映されない））
 * ------------------------------------------------------------------------------
 * States Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <replace state add: X>
 *   When the state with this tag is applied, instead, apply the state on listed.
 *     X: state Id.
 *
 * ---------------
 *
 *  <replace state remove: X>
 *   When the state with this tag is applied, instead, remove the state listed.
 *     X: state Id.
 *
 * ---------------
 *
 *  <replace state code>
 *   code
 *  </replace state code>
 *   When the state with this tag is applied, instead, execute a script code.
 *     code : script code to be executed
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  - State Add
 *  When the action successfully apply the original state, all the new states
 *  changes are applied at once, unless the target is immune to the new state
 *  (with the trait 'State Resist').
 *  The % resistance granted by the trait 'State Rate' is ignored, even if it's
 *  value is 0%, wich otherwise would also make the state always miss.
 *  You can use this to make the action bypass the State Rete of an state.
 *
 *  Notice that actions with hit type 'Certain Hit' ignores the 'State Rate', so
 *  they will apply the state replace unless the tartget is immune to them.
 *
 *  The original state is not added, it is replaced by the new effects from the
 *  tags. If you want to add the original state, use the 
 *
 * ---------------
 *
 *  - State Remove
 *  The state is removed only if the original state hits. This is different from
 *  adding a state remove on the action effect box. On the effect box, the state
 *  will be removed no matter if other states hit or miss.
 *
 * ---------------
 *
 *  - State Code
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "b" for the target, "v[x]" for variable and "item" for the item
 *  object.
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <replace state code>
 *   v[5]++;
 *  </replace state code>
 *  Increase the variable 5 by 1 when the state hit
 *
 * ---------------
 *
 *  <replace state code>
 *   if (!a.isStateAffected(7) &&
 *       !a.isStateAffected(8) &&
 *       !a.isStateAffected(9)) {
 *       a.addState(7);
 *   } else if (a.isStateAffected(7)) {
 *       a.removeState(7);
 *       a.addState(8);
 *   } else if (a.isStateAffected(8)) {
 *       a.removeState(8);
 *       a.addState(9);
 *   }
 *  </replace state code>
 *   this is an example of progressive state.
 *   it makes the state 7 evolve into state 8 and then state 9. (rage, confusion
 *   and charm by default in RPG Maker).
 *   If the target none of the states 7, 8 or 9, it appiles the state 7.
 *   If the target is under the state 7, it removes it and apply the state 8.
 *   If the target is under the state 8, it removes it and apply the state 9.
 *
 * ------------------------------------------------------------------------------
 */

(function() {
	
	//=============================================================================
	// VictorEngine
	//=============================================================================
	
	VictorEngine.StateReplace.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function(data, index) {
		VictorEngine.StateReplace.loadNotetagsValues.call(this, data, index);
		if (this.objectSelection(index, ['state'])) VictorEngine.StateReplace.loadNotes(data);
	};
		
	VictorEngine.StateReplace.loadNotes = function(data) {
		data.stateReplace = data.stateReplace || {};
		data.stateReplace.add  = data.stateReplace.add  || [];
		data.stateReplace.rmv  = data.stateReplace.rmv  || [];
		data.stateReplace.code = data.stateReplace.code || [];
		this.processNotes(data);

	};
	
	VictorEngine.StateReplace.processNotes = function(data) {
		var match;
		var regex1 = new RegExp('<replace state add[ ]*:[ ]*(\\d+)[ ]*>', 'gi');
		var regex2 = new RegExp('<replace state remove[ ]*:[ ]*(\\d+)[ ]*>', 'gi');
		var regex3 = VictorEngine.getNotesValues('replace state code');
		while ((match = regex1.exec(data.note)) !== null) { data.stateReplace.add.push(Number(match[1])) };
		while ((match = regex2.exec(data.note)) !== null) { data.stateReplace.rmv.push(Number(match[1])) };
		while ((match = regex3.exec(data.note)) !== null) { data.stateReplace.code.push(match[1].trim()) };
		var result = data.stateReplace;
		data.stateReplace.isStateReplace = result.add.length > 0 || result.rmv.length > 0 || result.code.length > 0;
	};
	
	//=============================================================================
	// Game_Battler
	//=============================================================================
	
	VictorEngine.StateReplace.addState = Game_Battler.prototype.addState;
	Game_Battler.prototype.addState = function(stateId) {
		if (this.isStateReplace(stateId)){
			if (this.isStateAddable(stateId)) {
				this.removeReplaceStates(stateId);
				this.addReplaceStates(stateId);
				this.codeReplaceStates(stateId);
			}
		} else {
			VictorEngine.StateReplace.addState.call(this, stateId);
		}
	};
	
	Game_Battler.prototype.isStateReplace = function(stateId) {
		var state = $dataStates[stateId];
		return state && state.stateReplace.isStateReplace;
	};
	
	Game_Battler.prototype.removeReplaceStates = function(stateId) {
		var states = $dataStates[stateId].stateReplace.rmv;
		states.forEach(function(state) { this.removeState(state) }, this);
	};
	
	Game_Battler.prototype.addReplaceStates = function(stateId) {
		var states = $dataStates[stateId].stateReplace.add;
		states.forEach(function(state) { VictorEngine.StateReplace.addState.call(this, state) }, this);
	};
	
	Game_Battler.prototype.codeReplaceStates = function(stateId) {
		var states = $dataStates[stateId].stateReplace.code;
        var a = this;
        var v = $gameVariables._data;
		var alias = 'VictorEngine.StateReplace.addState.call(this,'
		var regex = new RegExp('(?:this|a).addState\\(', 'gi');
		states.forEach(function(code) { eval(code.replace(regex, alias)) }, this);
	};
	
})();