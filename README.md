# Rpg Maker MV - GoldGranter Plugin
This RPG MAKER MV - plugin can modify the gold system with various way.

  The plugin allows you to give Gold to the player, at set intervals (this is repeated continuously).
* In addition to the interval, you can also control the amount of gold you give,
* and you can optionally set whether or not you give gold 
* during dialogue, battle, and menu. You can also set criteria, such as which maps
* you get the gold on, or whether you need to turn on Switcher to start giving gold. 
* Optionally, you can specify that it should start giving it to us when the game starts.
* You can select to play an SE sound when the player gain a gold. (only the one received by my plugin.)
* 
* We can also display a Gold Window so we don't have to navigate to the menu to know how much we have.
* You can specify the maximum amount of gold that the player can have, and if 
* you want you can add a starting gold (saving the creation of an unnecessary event).
*
* It also has a notification system that you can enable, so a small window will pop up 
* when you have gold (it currently pops up for all gold events). (better to use only for debug)
* New Encounter gold control system - You can decide during encounters what happens , you pay + you fight
* You pay, but you don't fight
* You only fight if you don't have enough money (no money loss)
* You can set the amount and whether you want to use this system.
* There are also several plugin commands you can use, so you can override plugin settings at any time.
* You can set a cheat key command to get instant money when you press it. Switchable, adjustable key command and amount.

## How to setup?

Just download the **INDIE_GoldGranter.js** file, paste it in your project folder /js/plugins and use the rpg maker mv plugin manager to add it, and switch to ON.

**Plugin Commands:**

  - StartGoldGiving (cant overwite thr switcher at the moment)
  - StopGoldGiving 
  - SetGoldAmount 500  (just change the number value)
  - SetMaxGold 1000 (just change the number value)
  - AddMapID 4 (will not owerwrite exiting maps) (just change the id, if multiple use comma separate like 1,10,20)
  - ClearAllMapIDs
  - EnableNotifications 
  - DisableNotifications
  - SetGoldInterval 30 (just change the number value)
  - HideGoldScreen
  - ShowGoldScreen


**Script calls:**

getGoldInterval() you can use like getGoldInterval() > 3 for the conditional branch. (this just example operation)

**Dynamic Message Commands:**

/g[5] where the g = the amount of gold that player have, and the [5] where can add color to the text.

/in[2] where the in = the interval when the player gain a gold, and [2] where can add color to the text.

/am[5] where the am = the amount of gold that player will gain, and the [5] where can add color to the text.

### FAQ

**1, Can i change the window graphic for the notification and and the gold on screen?**
Not yet, will ad this within the next versions later..

**2, The StartGoldGiving cant start the gold giving system.**
At the moment if you are using  The  "switcher Ative gold" parameter the StartGoldGiving cant overwrite. Will fix it in the next version.

**3 if I use another plugin to maximize the gold that the player may have, what do I need to set here?**
Just set The Max gold parameter to 0.

**4, The plugin Notification system react all gold changes?**
At the moment yes. In a future version will add a new settings for the notifications like, only with the Plugin notif,  or everyting, and or just increase, and for decrease too.
At the moment the notification system better use only for debugging.


### Changelog

1.4.0
New Debug (cheat commands)
Fix the "ClearAllMapIDs" Plugin command, and better handling the mapIDs

1.3.0

Add two new Plugincommand: HideGoldScreen ShowGoldScreen
New encounter pay for it system
Encounter Conditions system: you can select what happen if player meet an encounter 
- Enable / Disable mode
- Set amount
- Conditions:
- Always paid and battle
- Paid and bypass the battle
- Battle if not have enough gold

Buf fixes:

Fixed the issue when player enter a battle, but enabled the "Pause During battle" 
Nevertheless, the player still got the gold in the background. So Fixed it.
Complete rewrited the Pause timing system to better handling the pause / continue timing system

1.2.0
 
New Play Se parameter when player gain a gold. 
New Scrip call: getGoldInterval() you can use like getGoldInterval() > 3 for the conditional branch.
Added three Message commands:

/g[5] where the g = the amount of gold that player have, and the [5] where can add color to the text.
/in[2] where the in = the interval when the player gain a gold, and [2] where can add color to the text.
/am[5] where the am = the amount of gold that player will gain, and the [5] where can add color to the text.

Bug fixes:
Resolved the isse, when gold amount decreased, the notification show a double operator (+-)
Resolved the issue, when the decreased gold equal to player gold, show a bad informations in the popup

1.0 Initial release
