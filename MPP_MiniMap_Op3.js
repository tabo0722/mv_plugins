//=============================================================================
// MPP_MiniMap_Op3.js
//=============================================================================
// Copyright (c) 2018 - 2022 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MV MZ
 * @plugindesc 自動生成されるミニマップのタイルの色を変更することができます。
 * @author 木星ペンギン
 * @url
 * 
 * @base MPP_MiniMap
 * @orderAfter MPP_MiniMap
 *
 * @help [version 1.0.0]
 * - このプラグインはRPGツクールMVおよびMZ用です。
 * - 自動生成されるミニマップのタイルの色を変更することができます。
 *  
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠は半角)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 * 
 *  @param ----- Field Type
 *      @text ----- フィールドタイプ
 * 
 *  @param Land Color
 *      @text 陸地の色
 *      @default 224,224,224,1.0
 *      @parent ----- Field Type
 *
 *  @param Sea Color
 *      @text 深海の色
 *      @default 0,0,0,0.5
 *      @parent ----- Field Type
 *
 *  @param Ford Color
 *      @text 浅瀬・沼の色
 *      @default 64,64,64,0.75
 *      @parent ----- Field Type
 *
 *  @param Mountain Color
 *      @text 山の色
 *      @default 128,128,128,1.0
 *      @parent ----- Field Type
 *
 *  @param Hill Color
 *      @text 丘の色
 *      @default 160,160,160,1.0
 *      @parent ----- Field Type
 *
 *  @param Forest Color
 *      @text 森の色
 *      @default 192,192,192,1.0
 *      @parent ----- Field Type
 *
 *  @param ----- Area Type
 *      @text ----- エリアタイプ
 * 
 *  @param River Color
 *      @text 水辺（通行不可）の色
 *      @default 128,128,128,0.5
 *      @parent ----- Area Type
 *
 *  @param Shallow Color
 *      @text 水辺（通行可能）の色
 *      @default 160,160,160,0.75
 *      @parent ----- Area Type
 *
 *  @param Ladder Color
 *      @text 梯子の色
 *      @default 160,160,160,1.0
 *      @parent ----- Area Type
 *
 *  @param Bush Color
 *      @text 茂みの色
 *      @default 192,192,192,1.0
 *      @parent ----- Area Type
 *
 *  @param Counter Color
 *      @text カウンターの色
 *      @default 160,160,160,0.5
 *      @parent ----- Area Type
 * 
 *  @param Wall Color
 *      @text 通行不可タイルの色
 *      @default 64,64,64,0.25
 *      @parent ----- Area Type
 *
 *  @param Floor Color
 *      @text 通行可能タイルの色
 *      @default 224,224,224,1.0
 *      @parent ----- Area Type
 *
 */

(() => {
    'use strict';

    const pluginName = 'MPP_MiniMap_Op3';
    
    // Plugin Parameters
    const parameters = PluginManager.parameters(pluginName);
    const convertColor = name => `rgba(${parameters[name]})`;
    const param_Colors = {
        // ----- Field Type
        Land:convertColor('Land Color'),
        Sea:convertColor('Sea Color'),
        Ford:convertColor('Ford Color'),
        Mountain:convertColor('Mountain Color'),
        Hill:convertColor('Hill Color'),
        Forest:convertColor('Forest Color'),
        // ----- Area Type
        River:convertColor('River Color'),
        Shallow:convertColor('Shallow Color'),
        Ladder:convertColor('Ladder Color'),
        Bush:convertColor('Bush Color'),
        Counter:convertColor('Counter Color'),
        Wall:convertColor('Wall Color'),
        Floor:convertColor('Floor Color')
    };

    //-----------------------------------------------------------------------------
    // MinimapImage

    MinimapImage.tileColors = function() {
        return param_Colors;
    };

})();
