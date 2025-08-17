var VETBEC_BattleManager_processActionSequence = BattleManager.processActionSequence;
BattleManager.processActionSequence = function(actionName, actionArgs) {
  // THROW - syntax in action sequence is throw: target, type.  E.g. throw: targets, before
  if (actionName === 'THROW') {
    return this.actionThrow(actionArgs);
  }
  // WAIT FOR THROW - syntax in action sequence is wait for throw
  if (actionName === 'WAIT FOR THROW') {
    return this.actionWaitForThrow();
  }
  return VETBEC_BattleManager_processActionSequence.call(this,
    actionName, actionArgs);
};

BattleManager.actionThrow = function(actionArgs) {
    if (!$gameSystem.isSideView()) return true;
   
    var targets = this.makeActionTargets(actionArgs[0]);
    //Call the startThrow function in VE_ThrowableObjects
    targets.forEach(function(target) {
        BattleManager._logWindow.startThrow(BattleManager._subject, BattleManager._action, target, actionArgs[1]);
    });
   
    return true;
};

BattleManager.actionWaitForThrow = function() {
    this._logWindow.waitForThrowFinish();
    return false;
};

Spriteset_Battle.prototype.isAnyoneThrowing = function() {
    //check every throwableobject for every battler, and see if it has duration > 0 or delay > 0
    return this.battlerSprites().some(function(sprite) {
        return sprite._throwableObjects.some(function(throwsprite) {
            return throwsprite.isPlaying();
        });
    });
};

var VETBEC_Window_BattleLog_updateWaitMode = Window_BattleLog.prototype.updateWaitMode;
Window_BattleLog.prototype.updateWaitMode = function() {
    if (this._waitMode === 'throw') {
      if (this._spriteset.isAnyoneThrowing()) return true;
    }
    return VETBEC_Window_BattleLog_updateWaitMode.call(this);
};

//This function name used to avoid clashing with waitForThrow in VE_ThrowableObjects
Window_BattleLog.prototype.waitForThrowFinish = function() {
    this.setWaitMode('throw');
};