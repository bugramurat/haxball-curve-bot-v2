# Haxball Curve Bot v2
Haxball curve bot with slider-bar (Also including Lob-shot, Power-shot, Controllable-shot and Slide/Sprint abilities) with node-haxball API.
<br><br>

## Preview
![preview](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3VhNnp1ZzI5djUycXU0NDY5ZzRpNXBmeTJpcmV1b21xcG5oNzlnayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0ybbkT6wrH94PYXFNV/giphy.gif)

## How to run
Run this to **download** this project *(or download manually and go to your project-folder path)*:
```
git clone https://github.com/bugramurat/haxball-curve-bot-v2.git
cd haxball-curve-bot-v2
```
Install dependecies:
```
npm install
npm install node-haxball
```
**Paste your token** while executing *curve_bot_v2.js* file in your cmd and run the bot *(https://www.haxball.com/headlesstoken)*:
```
node curve_bot.js HEADLESS_TOKEN
```
<br><br>
Type **!claim** in your Haxball room to claim admin.
<br><br><br><br>
(You can adjust your room's name and other settings in *curve_bot_v2.js* file. You can use this bot with custom maps but you must create **extra discs and their joints** for *slider-bar* and arrange their **ID's** in *curve_bot_v2.js* file.)

## Abilities
- CURVE: Curved-shot until bar fills, hard-power-shot with fulfilled bar, Controllable-shot when ball is blue.
- LOB-SHOT: Lob-shot until bar fills, curved-lob-shot with fulfilled (triangle) bar (simply cross with curve).
- AUTO-POWER-SHOT: Auto-power-shot when you facing towards to opponent goal and enough close to it.
- CONTROLLABLE-SHOT: Dribble ball in Curve mode until ball turns to blue, after shooting control the ball with arrow-keys.
<br><br>
*Additional describing:*
<br><br>
You can choose your shot-modes in game, **every player has their own shot-modes.** Also every player can turn on/off their slide abilities.
<br><br>
Dribble for **Curve, Lob-shot,** and **Auto-power-shot**. In Curve mode, when the bar fills, you can perform a **Hard-power-shot**, and when the ball turns blue, you can perform an **Controllable-shot** where you can control the ball while it moves. Since no one can touch the ball during a Lob, it won't be a goal until the ball lands. For **Slide**, hold X and release when your avatar's shoe appears; for **Sprint**, hold X without releasing.


## Libraries
- node-haxball

<br></br>
*For further information: bugramurat4444@gmail.com or discord: buggyraz*
