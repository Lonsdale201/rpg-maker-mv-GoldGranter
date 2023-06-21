//=============================================================================
// INDIE_GoldGranter.js
//=============================================================================

/*:
* @plugindesc Gold granter System
* @author Soczó Kristóf
* @help
* 
//=============================================================================
// Descritpion
//=============================================================================
* The plugin allows you to give Gold to the player, at set intervals (this is repeated continuously).
* In addition to the interval, you can also control the amount of gold you give,
* and you can optionally set whether or not you give gold 
* during dialogue, battle, and menu. You can also set criteria, such as which maps
* you get the gold on, or whether you need to turn on Switcher to start giving gold. 
* Optionally, you can specify that it should start giving it to us when the game starts.
* 
* We can also display a Gold Window so we don't have to navigate to the menu to know how much we have.
* You can specify the maximum amount of gold that the player can have, and if 
* you want you can add a starting gold (saving the creation of an unnecessary event).
*
* It also has a notification system that you can enable, so a small window will pop up 
* when you have gold (it currently pops up for all gold events).
* There are also several plugin commands you can use, so you can override plugin settings at any time.
* 
//=============================================================================
// Plugin Commands
//=============================================================================
*
*  - StartGoldGiving (cant overwite thr switcher at the moment)
*  - StopGoldGiving 
*  - SetGoldAmount 500  (just change the number value)
*  - SetMaxGold 1000 (just change the number value)
*  - AddMapID 4 (will not owerwrite exiting maps), 
*  - ClearAllMapIDs
*  - EnableNotifications 
*  - DisableNotifications
*  - SetGoldInterval 30 (just change the number value)
* 
//=============================================================================
// Contact
//=============================================================================
*
*  Discord: lonsdale201 
*  Github: https://github.com/Lonsdale201
*
* ==============================================================================
* Changelog
* 
* 1.0 initial release
* 
* ==============================================================================
*
* @param Gold Setup
*
* @param EnableAtGameStart
* @text Enable at game start
* @parent Gold Setup
* @type boolean
* @default true
* @desc enable the gold system when the game starting
*
* @param GoldAmount
* @text Gold Amount
* @parent Gold Setup
* @type number
* @default 100
* @desc Here you can determine how much Gold the player should receive. 
* 
* @param MaxGoldPlayer
* @text Max gold 
* @parent Gold Setup
* @type number
* @default 10000
* @desc Enter the maximum amount of gold a player can have in the game . 0 for "unlimited"
*
* @param GoldInterval
* @text Gold Interval(s)
* @parent Gold Setup
* @type number
* @default 5
* @desc Here you can specify how many seconds it takes to get gold.
*
* @param GoldIMapIDs
* @text Map IDs
* @parent Gold Setup
* @type text
* @desc Enter the map IDs, separated by commas, or leave blank if all are allowed
*
* @param SwitchToActiveGold
* @text Switcher Active Gold
* @parent Gold Setup
* @type switch
* @desc Select if you want to use Switcher operator for gold gain. The selected switcher going to OFF will stop the gold gain
*
* @param PauseDuringDialog
* @text Pause in Dialog
* @parent Gold Setup
* @type boolean
* @default true
* @desc If you want, you can suspend the script while there is an active dialogue.
*
* @param PauseDuringMenu
* @text Pause in the Menu
* @parent Gold Setup
* @type boolean
* @default true
* @desc If you want, you can suspend the script while the player in the main menu
*
* @param PauseDuringBattle
* @text Pause in the Battle
* @parent Gold Setup
* @type boolean
* @default true
* @desc If you want, you can suspend the script while the player in the battlefield
*
* @param Display
*
* @param DisplayGoldOnScreen
* @text Display Gold on screen
* @parent Display
* @type boolean
* @default false
* @desc Display the gold on the screen
*
* @param WindowPosX
* @text Window position X axis
* @parent Display
* @type number
* @default 10
* @desc Change the full gold window position X-axis
*
* @param WindowPosY
* @text Window position Y axis
* @parent Display
* @type number
* @default 10
* @desc Change the full gold window position Y-axis
*
* @param GoldSepThousands
* @text Thousand separator
* @parent Display
* @type boolean
* @default false
* @desc Enable or disabe the thousand separator
* 
* @param Notifications
*
* @param NotificationEnable
* @text Show Gold notification
* @parent Notifications
* @type boolean
* @default false
* @desc Enable or disabe the gold notification system
*
* @param NotificationGoldThousandSeparator
* @text Thousand separator
* @parent Notifications
* @type boolean
* @default true
* @desc Enable or disabe the thousand separator
*
* @param NotificationXposition
* @text Window position X axis
* @parent Notifications
* @type number
* @default 10
* @desc Set a custom X position for the notification window
*
* @param NotificationYposition
* @text Window position Y axis
* @parent Notifications
* @type number
* @default 10
* @desc Set a custom Y position for the notification window
*
* @param Others
* 
* @param StarterGold
* @text Starter gold
* @parent Others
* @type number
* @default 0
* @desc If you want, you set a starter gold. When game start player automatice have this amount of money, or set 0 for disable.
*
*/

var INDIE = INDIE || {};
INDIE.GoldGranter = INDIE.GoldGranter || {};

(function($) {
    "use strict";

    //=============================================================================
    // ** Gold System Setup
    //=============================================================================

    $.Parameters = PluginManager.parameters('INDIE_GoldGranter');

    $.Gold = {
        enabled: ($.Parameters['EnableAtGameStart'].toLowerCase() === 'true'),
        MaxGoldPlayer: Number($.Parameters['MaxGoldPlayer']) || 10000,
        switchToActiveGold: Number($.Parameters['SwitchToActiveGold']) || 0,
        amount: Number($.Parameters['GoldAmount']),
        interval: Number($.Parameters['GoldInterval']),
        pauseDuringDialog: ($.Parameters['PauseDuringDialog'].toLowerCase() === 'true'),
        pauseDuringMenu: ($.Parameters['PauseDuringMenu'].toLowerCase() === 'true'),
        pauseDuringBattle: ($.Parameters['PauseDuringBattle'].toLowerCase() === 'true'),
        mapIDs: ($.Parameters['GoldIMapIDs'] === "" ? [] : $.Parameters['GoldIMapIDs'].split(',').map(Number)), // responsible for GoldIMapIDs parameter
        DisplayGoldOnScreen: ($.Parameters['DisplayGoldOnScreen'].toLowerCase() === 'true'), // Display Gold on screen
        GoldSepThousands: ($.Parameters['GoldSepThousands'].toLowerCase() === 'true'), // Thousand separator
        WindowPosX: Number($.Parameters['WindowPosX']) || 10,
        WindowPosY: Number($.Parameters['WindowPosY']) || 10,
        NotificationXposition: Number($.Parameters['NotificationXposition']) || 10, 
        NotificationYposition: Number($.Parameters['NotificationYposition']) || 10, 
        NotificationGoldThousandSeparator: ($.Parameters['NotificationGoldThousandSeparator'].toLowerCase() === 'true'),
        NotificationEnable: ($.Parameters['NotificationEnable'].toLowerCase() === 'true'),
        hitMaxGold: false, // Track if the player has hit maximum gold
        forceStart: false, // force start status
        shouldAddStarterGold: false,
        StarterGold: Number($.Parameters['StarterGold']),
        previousGold: 0, // Track the previous amount of gold
        StarterGoldAdded: false // starter gold function
    };

    //=============================================================================
    // ** Max Gold for Player
    //=============================================================================

    var _Game_Party_gold = Game_Party.prototype.gold;
Game_Party.prototype.gold = function() {
    if ($.Gold.MaxGoldPlayer !== 0) {
        return Math.min(_Game_Party_gold.call(this), $.Gold.MaxGoldPlayer);
    } else {
        return _Game_Party_gold.call(this);
    }
};


    if ($.Gold.enabled && !$.Gold.pauseDuringDialog && !$.Gold.pauseDuringMenu && !$.Gold.pauseDuringBattle && !$.Gold.isOnGoldIMapIDs && $gameParty.gold() < $.Gold.MaxGoldPlayer) {
        // increment counter
        $.Gold.currentCounter += 1;
        
        // if the counter reaches the interval...
        if ($.Gold.currentCounter >= $.Gold.interval) {
            // ... reset the counter
            $.Gold.currentCounter = 0;
            // ... and increment the gold count
            $gameParty.gainGold($.Gold.amount);
        }
    }
// ez tuti jooo!
    var _Game_Party_gainGold = Game_Party.prototype.gainGold;
Game_Party.prototype.gainGold = function(amount) {
    _Game_Party_gainGold.call(this, amount);
    // If the gold amount has not changed, do not show the notification
    if (SceneManager._scene._goldNotificationWindow && $.Gold.StarterGoldAdded && $gameParty.gold() != $.Gold.previousGold) {
        SceneManager._scene._goldNotificationWindow.open();
        SceneManager._scene._goldNotificationWindow.refresh(amount);
    }
};






    //=============================================================================
    // ** Switch Observer
    //=============================================================================
    
    var _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value) {
        _Game_Switches_setValue.call(this, switchId, value);
        
        // Check if the changed switch is the one we are observing
        if (switchId === $.Gold.switchToActiveGold) {
            if (value) {
                $.Gold.enabled = true; // Enable gold giving
                $.startGoldGiving();
            } else {
                $.stopGoldGiving();
            }
        }
    };



    //=============================================================================
    // ** Gold System Operations & include force Plugin commands
    //=============================================================================

    $.startGoldGiving = function() {
        // Start gold giving only if there is no active switch or the switch is on
        if (this.Gold.switchToActiveGold === 0 || ($gameSwitches && $gameSwitches.value(this.Gold.switchToActiveGold))) {
            // If there's no active switch or forceStart is true, use the original conditions
            if ((this.Gold.enabled && this.isOnAllowedMap() || this.Gold.forceStart) && !this._goldGivingTimeout) {
                if(this._goldGivingTimeout) {
                    clearTimeout(this._goldGivingTimeout);
                }
    
                var elapsed = this.Gold.elapsed || 0;
                var delay = this.Gold.interval * 1000 - elapsed;
                this._goldGivingStartTime = new Date().getTime();
                this._goldGivingTimeout = setTimeout(this.giveGold.bind(this), delay);
            }
        }  
    };
    

    $.giveGold = function() {
        var oldGold = $gameParty.gold();
        if ((this.isOnAllowedMap() || this.Gold.forceStart) && ($gameParty.gold() < this.Gold.MaxGoldPlayer || this.Gold.MaxGoldPlayer === 0)) {
            // Only give gold if the player has not just hit maximum gold
            if (!this.Gold.hitMaxGold) {
                $gameParty.gainGold(this.Gold.amount);
            }
        }
        
        // Update the previous gold amount
        this.Gold.previousGold = oldGold;
    
        this._goldGivingTimeout = null;
        this.startGoldGiving();
    };
    

    $.pauseGoldGiving = function() {
        if(this._goldGivingTimeout !== null) {
            var currentTime = new Date().getTime();
            var elapsed = currentTime - this._goldGivingStartTime;
            this.Gold.elapsed = elapsed;
            clearTimeout(this._goldGivingTimeout);
            this._goldGivingTimeout = null;
        }
    };

    $.stopGoldGiving = function() {
        this.Gold.enabled = false;
        this.Gold.forceStart = false;
        if(this._goldGivingTimeout !== null) {
            clearTimeout(this._goldGivingTimeout);
            this._goldGivingTimeout = null;
        }
    };

    
    
    //=============================================================================
    // ** Check If Player is on an allowed map
    //=============================================================================

    $.isOnAllowedMap = function() {
        if (this.Gold.mapIDs.length === 0) return true;

        var currentMapId = $gameMap.mapId();
        return this.Gold.mapIDs.includes(currentMapId);
    };

   

    //=============================================================================
    // ** Plugin Commands
    //=============================================================================

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        if(command === 'StartGoldGiving') {
            // Set forceStart to true, so the gold giving will start even if the switch is off
            $.Gold.forceStart = true;
            // If a map ID is specified in the plugin command, override the mapIDs array with it
            if (args[0]) {
                $.Gold.mapIDs = [Number(args[0])];
            }
            $.startGoldGiving();
        } 
        else if(command === 'StopGoldGiving') {
            $.Gold.forceStart = false;
            $.stopGoldGiving();
        } 
        else if(command === 'SetGoldAmount') {
            // Check if a valid number was given as an argument
            if(args[0] && !isNaN(args[0])) {
                $.Gold.amount = Number(args[0]);
            }
        }
        else if(command === 'SetMaxGold') {
            // Check if a valid number was given as an argument
            if(args[0] && !isNaN(args[0])) {
                $.Gold.MaxGoldPlayer = Number(args[0]);
            }
        }
        else if(command === 'AddMapID') {
            // Check if a valid number was given as an argument
            if(args[0] && !isNaN(args[0])) {
                // Add the new Map ID to the existing list without overwriting the existing ones
                $.Gold.mapIDs.push(Number(args[0]));
            }
        }
        else if(command === 'ClearAllMapIDs') {
            // Clear the mapIDs array
            $.Gold.mapIDs = [];
        }
        if (command === 'EnableNotifications') {
            $.Gold.NotificationEnable = true;
            // if extist remove
            if (SceneManager._scene._goldNotificationWindow) {
                SceneManager._scene._goldNotificationWindow.hide();
            }
            // create a new window
            SceneManager._scene.createGoldNotificationWindow();
        } else if (command === 'DisableNotifications') {
            $.Gold.NotificationEnable = false;
            // Tdelete the notif if exixst
            if (SceneManager._scene._goldNotificationWindow) {
                SceneManager._scene._goldNotificationWindow.hide();
            }
        }
        else if(command === 'SetGoldInterval') {
            // Check if a valid number was given as an argument
            if(args[0] && !isNaN(args[0])) {
                $.Gold.interval = Number(args[0]);
            }
        } 
        
    };



    //=============================================================================
    // ** Scene_Map Operations
    //=============================================================================

    var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);
    // If there's no active switch, start the gold giving as originally intended
    if ($.Gold.switchToActiveGold === 0 && $.Gold.enabled) {
        $.startGoldGiving();
        }
    };

    var _Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
    _Scene_Map_initialize.call(this);
    // If there's no active switch, start the gold giving as originally intended
    if ($.Gold.switchToActiveGold === 0 && $.Gold.enabled) {
        $.startGoldGiving();
        }
    };


    //=============================================================================
    // ** Dialog Control - Pause and Resume
    //=============================================================================

    var _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        _Window_Message_update.call(this);

        if($.Gold.pauseDuringDialog) {
            if(this.isOpen() && this.active) {
                $.pauseGoldGiving();
            } else {
                $.startGoldGiving();
            }
        }
    };

    //=============================================================================
    // ** Menu Control - Pause and Resume
    //=============================================================================

    var _Scene_Menu_start = Scene_Menu.prototype.start;
    Scene_Menu.prototype.start = function() {
        _Scene_Menu_start.call(this);
        if($.Gold.pauseDuringMenu) {
            $.pauseGoldGiving();
        }
    };

    var _Scene_Menu_terminate = Scene_Menu.prototype.terminate;
    Scene_Menu.prototype.terminate = function() {
        _Scene_Menu_terminate.call(this);
        if($.Gold.pauseDuringMenu) {
            $.startGoldGiving();
        }
    };

    //=============================================================================
    // ** Battle Control - Pause and Resume
    //=============================================================================

    var _Scene_Battle_start = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function() {
        _Scene_Battle_start.call(this);
        if($.Gold.pauseDuringBattle) {
            $.pauseGoldGiving();
        }
    };

    var _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        _Scene_Battle_terminate.call(this);
        if($.Gold.pauseDuringBattle) {
            $.startGoldGiving();
        }
    };


    //=============================================================================
    // ** Starter gold system
    //=============================================================================

    var _DataManager_setupNewGame = DataManager.setupNewGame;

    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        if($.Gold.StarterGold > 0) {
            $.Gold.shouldAddStarterGold = true;
        } else {
            // if the starter gold is 0, mark it as already added
            $.Gold.StarterGoldAdded = true;
        }
    };

    var _SceneManager_goto = SceneManager.goto;
    SceneManager.goto = function(sceneClass) {
        if(sceneClass === Scene_Title) {
            $.Gold.StarterGoldAdded = false;
            $gameParty._gold = 0; // Reset the gold amount
        }
        _SceneManager_goto.call(this, sceneClass);
    };

    var _Scene_Map_start = Scene_Map.prototype.start;

    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        this.createGoldNotificationWindow();
        if ($.Gold.shouldAddStarterGold) {
            $gameParty.gainGold($.Gold.StarterGold);
            $.Gold.StarterGoldAdded = true;
            $.Gold.shouldAddStarterGold = false;
        }
    };

    //=============================================================================
    // ** Goldscreen display system
    //=============================================================================

    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        if ($.Gold.DisplayGoldOnScreen) {
            this.createGoldWindow();
        }
    };
    
    Scene_Map.prototype.createGoldWindow = function() {
        this._goldWindow = new Window_Gold(0, 0);
        this._goldWindow.x = $.Gold.WindowPosX;
        this._goldWindow.y = $.Gold.WindowPosY;
        this.addWindow(this._goldWindow);
    };
    
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if ($.Gold.DisplayGoldOnScreen && this._goldWindow) {
            this._goldWindow.refresh();
        }
    };
    
    function Window_Gold() {
        this.initialize.apply(this, arguments);
    }
    
    Window_Gold.prototype = Object.create(Window_Base.prototype);
    Window_Gold.prototype.constructor = Window_Gold;
    
    Window_Gold.prototype.initialize = function(x, y) {
        var width = this.windowWidth();
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };
    
    Window_Gold.prototype.windowWidth = function() {
        return 155;
    };
    
    Window_Gold.prototype.windowHeight = function() {
        return this.fittingHeight(0.65);
    };
    
    Window_Gold.prototype.refresh = function() {
        var x = this.textPadding() + 1; // increased padding
        var y = (this.windowHeight() - this.lineHeight()) / 2 - 20; // moved the text up
        var width = this.contents.width - this.textPadding() * 4;
        this.contents.clear();
        this.drawCurrencyValue(this.value(), this.currencyUnit(), x, y, width); // added y here
    };
    
    Window_Gold.prototype.value = function() {
        var gold = $gameParty.gold();
        if ($.Gold.GoldSepThousands) {
            return gold.toLocaleString('en-US'); // 
        } else {
            return gold;
        }
    };
    
    
    Window_Gold.prototype.currencyUnit = function() {
        return TextManager.currencyUnit;
    };
    
    Window_Gold.prototype.open = function() {
        this.refresh();
        Window_Base.prototype.open.call(this);
    };
    
    Window_Gold.prototype.drawCurrencyValue = function(value, unit, x, y, width) {
        this.contents.fontSize = 22; // font size
        this.resetTextColor();
        this.drawText(value, x, y, width - this.textWidth(" " + unit), 'right');
        this.changeTextColor(this.systemColor());
        this.drawText(unit, x, y, width, 'right');
        this.contents.fontSize = 28; // restore to default size
    };


  
    //=============================================================================
    // ** Gold Notification System
    //=============================================================================


    function INDIE_GoldNotificationWindow() {
        this.initialize.apply(this, arguments);
    }

    INDIE_GoldNotificationWindow.prototype = Object.create(Window_Base.prototype);
    INDIE_GoldNotificationWindow.prototype.constructor = INDIE_GoldNotificationWindow;

    INDIE_GoldNotificationWindow.prototype.initialize = function() {
        var width = this.windowWidth();
        var height = this.windowHeight();
        var x = Graphics.boxWidth - width - ($.Gold.NotificationXposition || 10); // Takes into account the set X position
        var y = Graphics.boxHeight - height - ($.Gold.NotificationYposition || 10); // Takes into account the set Y position
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.opacity = 0; 
        this.contentsOpacity = 0;
        this._showCount = 0;
        this._fontSize = 15; // Setting the font size
        this._textOffsetX = 0; // Setting the text offset on the x axis
        this._textOffsetY = -11; // Setting the text offset on the y axis
    };

    INDIE_GoldNotificationWindow.prototype.windowWidth = function() {
        return 120; // Window width
    };

    INDIE_GoldNotificationWindow.prototype.windowHeight = function() {
        return 50; // Window height
    };

    INDIE_GoldNotificationWindow.prototype.update = function() {
        if (this._showCount > 0) {
            this.contentsOpacity += 16;
            this.opacity += 16; // Increasing the window opacity until it becomes completely opaque
            this._showCount--;
        } else {
            this.contentsOpacity -= 16;
            this.opacity -= 16; // Decreasing the window opacity until it becomes completely transparent
        }
    };

    INDIE_GoldNotificationWindow.prototype.open = function(text) {
        this.refresh(text);
        this._showCount = 150;
    };

    INDIE_GoldNotificationWindow.prototype.refresh = function(amount) {
        this.contents.clear();
        var currencyUnit = $dataSystem.currencyUnit;

        if (amount !== undefined && $.Gold.NotificationGoldThousandSeparator) {
            amount = Number(amount).toLocaleString('en-US');
        }

        var amountStr = "+" + amount + " " + currencyUnit;
        this.contents.fontSize = this._fontSize; // Set the font size
        this.drawText(amountStr, this._textOffsetX, this._textOffsetY, this.width - this.padding - 20, 'center'); // Apply the text offset
    };



    // Function to format number with commas
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    Scene_Map.prototype.createGoldNotificationWindow = function() {
        if ($.Gold.NotificationEnable) { // Check the notificationenable parameter state
            this._goldNotificationWindow = new INDIE_GoldNotificationWindow();
            this.addWindow(this._goldNotificationWindow);
        }
    };

    INDIE_GoldNotificationWindow.prototype.loadWindowskin = function() {
        this.windowskin = ImageManager.loadSystem('Window'); // Loading the default window skin sorry.
    };

    // not necessary
    var _Game_Interpreter_command125 = Game_Interpreter.prototype.command125;

    Game_Interpreter.prototype.command125 = function() {
        var value = this.operateValue(this._params[0], this._params[1], this._params[2]);
        
        if ($gameParty.gold() + value > $.Gold.MaxGoldPlayer) {
            value = $.Gold.MaxGoldPlayer - $gameParty.gold();
        }
        
        var oldGold = $gameParty.gold();
        $gameParty.gainGold(value);
        var newGold = $gameParty.gold();

        if (newGold > oldGold && $.Gold.NotificationEnable) { 
            SceneManager._scene._goldNotificationWindow.open(value);
        }

        return true;
    };




})(INDIE.GoldGranter);