# Rpg Maker MV - GoldGranter Plugin
This RPG MAKER MV - This plugin can modify the gold system with various way.

  The plugin allows you to give Gold to the player, at set intervals (this is repeated continuously).
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

## How to setup?

Just download the INDIE_GoldGranter.js file, and use the rpg maker mv plugin manager to add it, and switch to ON.

** Plugin Commands: **

- StartGoldGiving (cant overwite thr switcher at the moment)
*  - StopGoldGiving 
*  - SetGoldAmount 500  (just change the number value)
*  - SetMaxGold 1000 (just change the number value)
*  - AddMapID 4 (will not owerwrite exiting maps), 
*  - ClearAllMapIDs
*  - EnableNotifications 
*  - DisableNotifications
*  - SetGoldInterval 30 (just change the number value)



### Changelog
1.0 Initial release
