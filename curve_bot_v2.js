// BUGGYRAZ
const {
  OperationType,
  VariableType,
  ConnectionState,
  AllowFlags,
  Direction,
  CollisionFlags,
  CameraFollow,
  BackgroundType,
  GamePlayState,
  BanEntryType,
  Callback,
  Utils,
  Room,
  Replay,
  Query,
  Library,
  RoomConfig,
  Plugin,
  Renderer,
  Errors,
  Language,
  EventFactory,
  Impl,
} = require("node-haxball")()
const fs = require("fs")

/*
 ▄████▄   ▒█████   ███▄    █   █████▒██▓  ▄████
▒██▀ ▀█  ▒██▒  ██▒ ██ ▀█   █ ▓██   ▒▓██▒ ██▒ ▀█▒
▒▓█    ▄ ▒██░  ██▒▓██  ▀█ ██▒▒████ ░▒██▒▒██░▄▄▄░
▒▓▓▄ ▄██▒▒██   ██░▓██▒  ▐▌██▒░▓█▒  ░░██░░▓█  ██▓
▒ ▓███▀ ░░ ████▓▒░▒██░   ▓██░░▒█░   ░██░░▒▓███▀▒
░ ░▒ ▒  ░░ ▒░▒░▒░ ░ ▒░   ▒ ▒  ▒ ░   ░▓   ░▒   ▒
  ░  ▒     ░ ▒ ▒░ ░ ░░   ░ ▒░ ░      ▒ ░  ░   ░
░        ░ ░ ░ ▒     ░   ░ ░  ░ ░    ▒ ░░ ░   ░
░ ░          ░ ░           ░         ░        ░
░
*/
//------------------------ ROOM CONFIG -----------------------------------------
const HEADLESS_TOKEN = process.argv[2] // 0 = node, 1 = index.js, 2 = token (https://www.haxball.com/headlesstoken)

const EMO = "🍉"
const ROOM_NAME = `${EMO} 🟢 FUT X4 • CURVE • LOB-SHOT 🟢`
const MAX_PLAYER_NUMBER = 12

const IS_PUBLIC = true
const TIME_LIMIT = 0
const SCORE_LIMIT = 0
let needToLockTeams = true

const testGE = true // Leave true if you want to see a cool goal effect
let GOAL_TEXT = "HELLYEAH"

//------------------------ KIT CONFIG -----------------------------------------
const kitsInfo =
  "[0] City, [1] Real (Alt), [2] Fener, [3] Galata, [4] Beşiktaş, [5] Kocaeli, [6] Barça, [7] Manu, [8] Inter, [9] Paris, [10] Miami, [11] Al Nassr, [12] Milan, [13] Liverpool, [14] Dortmund, [15] Chelsea, [16] Juventus, [17] Leverkusen, [18] Roma, [19] Bursa, [20] Spain, [21] Portugal, [22] Spain (A), [23] Eyüp, [24] Paris (A), [25] Real (Alt2), [26] Real" // VIP's can see this with !s or !shirts command
const dbKits = [
  [{ t: "⛵CITY" }, { a: 90, c0: 0xffffff, c1: 0x4dc9ff, c2: 0x1da6e0 }],
  [{ t: "👑REAL (ALT)" }, { a: 90, c0: 0x000000, c1: 0xffa200, c2: 0xffa200 }],
  [
    { t: "🐤FB" },
    { a: 0, c0: 0xffffff, c1: 0xffed00, c2: 0x163962, c3: 0xffed00 },
  ],
  [{ t: "🦁GS" }, { a: 600, c0: 0x000000, c1: 0xa90432, c2: 0xfdb912 }],
  [
    { t: "🦅BJK" },
    { a: 0, c0: 0xff0000, c1: 0xffffff, c2: 0x000000, c3: 0xffffff },
  ],
  [
    { t: "🏞️KOCAELİ" },
    { a: 0, c0: 0xffffff, c1: 0x008f39, c2: 0x000000, c3: 0x008f39 },
  ],
  [{ t: "🏐BARÇA" }, { a: 0, c0: 0xedbb00, c1: 0x004d98, c2: 0xdb0030 }],
  [{ t: "🔱MANU" }, { a: 0, c0: 0xffffff, c1: 0xda291c }],
  [
    { t: "⚽INTER" },
    { a: 0, c0: 0xffffff, c1: 0x010e80, c2: 0x000000, c3: 0x010e80 },
  ],
  [
    { t: "🗼PSG" },
    { a: 0, c0: 0xffffff, c1: 0x004170, c2: 0xda291c, c3: 0x004170 },
  ],
  [{ t: "🌴MIAMI" }, { a: 0, c0: 0x231f20, c1: 0xf7b5cd }],
  [{ t: "🐪AL NASSR" }, { a: 0, c0: 0x0048a0, c1: 0xfedd00 }],
  [
    { t: "🔴MILAN" },
    { a: 0, c0: 0xffffff, c1: 0xfb090b, c2: 0x000000, c3: 0xfb090b },
  ],
  [{ t: "🐦‍🔥LIVERPOOL" }, { a: 90, c0: 0xffffff, c1: 0xc8102e, c2: 0xb30e29 }],
  [
    { t: "🐝DORTMUND" },
    { a: 45, c0: 0xffffff, c1: 0xfde100, c2: 0x000000, c3: 0xfde100 },
  ],
  [{ t: "🥶CHELSEA" }, { a: 0, c0: 0xffffff, c1: 0x034694 }],
  [{ t: "🦓JUVENTUS" }, { a: 0, c0: 0x757575, c1: 0xffffff, c2: 0x000000 }],
  [
    { t: "💊LEVERKUSEN" },
    { a: 45, c0: 0x8a1514, c1: 0x000000, c2: 0xe32221, c3: 0x000000 },
  ],
  [{ t: "🏛️ROMA" }, { a: 45, c0: 0xf0bc42, c1: 0x8e1f2f }],
  [
    { t: "🐊BURSA" },
    { a: 0, c0: 0xffffff, c1: 0xdbdbdb, c2: 0x007738, c3: 0xdbdbdb },
  ],
  [{ t: "💃🏽SPAIN" }, { a: 0, c0: 0xf9c705, c1: 0xf63a3e }],
  [{ t: "🚋PORTUGAL" }, { a: 60, c0: 0xfcb507, c1: 0xe42518, c2: 0x0d6938 }],
  [{ t: "💃🏽SPAIN (AWAY)" }, { a: 0, c0: 0xe73e34, c1: 0xf7f4bc }],
  [
    { t: "🕌EYÜP" },
    { a: 0, c0: 0x3a2a4d, c1: 0xf4d800, c2: 0x6e5092, c3: 0xf4d800 },
  ],
  [
    { t: "🗼PSG (AWAY)" },
    { a: 60, c0: 0x871911, c1: 0xffffff, c2: 0xda291c, c3: 0xffffff },
  ],
  [
    { t: "👑REAL (ALT 2)" },
    { a: 90, c0: 0xffffff, c1: 0x7851a9, c2: 0x7851a9 },
  ],
  [{ t: "👑REAL" }, { a: 90, c0: 0xfebe10, c1: 0xffffff, c2: 0xffffff }],
]
let homeTeam = Math.floor(Math.random() * dbKits.length)
let awayTeam
do awayTeam = Math.floor(Math.random() * dbKits.length)
while (homeTeam === awayTeam)

//------------------------ ABILITY CONFIG -----------------------------------------
const CURVED_SHOT_MULTIPLIER = 0.25 // Multiplies the ball's curve for curved shots
const CURVED_SHOT_DURATION = 1.6 // Curved shot duration in seconds
let ENABLE_SPRINT_AND_SLIDE = true
let ENABLE_BANANA = true
let ENABLE_POW_AND_ULTI = true

//------------------------ STADIUM CONFIG -----------------------------------------
const STADIUM_PATH_F = "fx4.hbs" // Make sure your custom stadium have enough discs for slider-bar

/*
    ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
    ║                                          C O N F I G     E N D                                           ║
    ╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/

const originalLog = console.log
console.log = function (...args) {
  const now = new Date()
  const timeString = now.toLocaleTimeString()
  originalLog.call(console, `[${timeString}]`, ...args)
}

/*
 ▒█████  ▄▄▄█████▓ ██░ ██ ▓█████  ██▀███
▒██▒  ██▒▓  ██▒ ▓▒▓██░ ██▒▓█   ▀ ▓██ ▒ ██▒
▒██░  ██▒▒ ▓██░ ▒░▒██▀▀██░▒███   ▓██ ░▄█ ▒
▒██   ██░░ ▓██▓ ░ ░▓█ ░██ ▒▓█  ▄ ▒██▀▀█▄
░ ████▓▒░  ▒██▒ ░ ░▓█▒░██▓░▒████▒░██▓ ▒██▒
░ ▒░▒░▒░   ▒ ░░    ▒ ░░▒░▒░░ ▒░ ░░ ▒▓ ░▒▓░
  ░ ▒ ▒░     ░     ▒ ░▒░ ░ ░ ░  ░  ░▒ ░ ▒░
░ ░ ░ ▒    ░       ░  ░░ ░   ░     ░░   ░
    ░ ░            ░  ░  ░   ░  ░   ░

*/
var stadiumF
fs.readFile(STADIUM_PATH_F, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err)
    return
  }
  stadiumF = JSON.parse(data)
})
let stadiumWidth = 900
const emojiAtt = "⚠️"
const emojiQuest = "❓"
const emojiInfo = "ℹ️"
const emojiSucces = "✅"
const colorAtt = 0xf6de16
const colorInfo = 0x00ffff
const colorSucces = 0x66ff00
const colorBlue = 0x00a6ed
const colorRed = 0xff486e
const colorDiscord = 0xc493ff
const colorWhite = 0xffffff
const controlsString = `${emojiQuest} Dribble for CURVE, LOB, and AUTO-POWER. In Curve mode, when the bar fills, you can perform a HARD-POWER shot, and when the ball turns blue, you can perform an ULTIMATE STRIKE where you can control the ball while it moves. Since no one can touch the ball during a Lob, it won't be a goal until the ball lands. For SLIDE, hold X and release when your avatar's shoe appears; for SPRINT, hold X without releasing.`
const helpString = `${EMO} !controls ${EMO} c l a (curve, lob-shot, auto-power) ${EMO} !op (toggle op-mode) ${EMO} !sl (turn on/off slide) ${EMO} !kits (see and change kits)`
const discordString = `For bot and map requests --> Discord: buggyraz`
const annoList = [{ s: discordString, c: colorDiscord }]
let annoIndex = 0
const Team = { SPECTATORS: 0, RED: 1, BLUE: 2 }
var currentStartDisc = 9 // Make sure you edited this disc id for your custom map
var currentStartDiscL = 104 // Make sure you edited this disc id for your custom map
var AFKSet = new Set()
const Role = { PLAYER: 0, VIP: 1, VIP_PLUS: 2, MOD: 3, MASTER: 4 }
const NotifSound = { NONE: 0, CHAT: 1, MENTION: 2 }
let isPausedNow = false
function getTeamCounts(room) {
  const players = room.players.filter((p) => !AFKSet.has(p.id))
  return {
    all: players,
    red: players.filter((p) => p.team.id === Team.RED),
    blue: players.filter((p) => p.team.id === Team.BLUE),
    specs: players.filter((p) => p.team.id === Team.SPECTATORS),
  }
}
function convertSecondsToTime(seconds) {
  const minutes = Math.floor(seconds / 60) // Get the number of minutes
  const remainingSeconds = Math.floor(seconds % 60) // Truncate decimals from remaining seconds
  const formattedTime = `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}` // Format as "MM:SS"
  return formattedTime
}
function sendAnnoOnJoin(playerId, room) {
  setTimeout(() => {
    room.sendAnnouncement(
      helpString,
      playerId,
      colorSucces,
      "bold",
      NotifSound.NONE,
    )
  }, 1200)
  room.sendAnnouncement(
    discordString,
    playerId,
    colorDiscord,
    "bold",
    NotifSound.NONE,
  )
}
let annoTimer = null
function sendAnnos(room) {
  if (annoList.length === 0) {
    console.error("Duyuru listesi boş!")
    return
  }
  if (annoTimer !== null) return
  function loop() {
    const anno = annoList[annoIndex]
    const annoString = anno.s
    const annoColor = anno.c
    room.sendAnnouncement(
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      null,
      annoColor,
      "bold",
      NotifSound.NONE,
    )
    room.sendAnnouncement(
      `${annoString}`,
      null,
      annoColor,
      "bold",
      NotifSound.NONE,
    )
    room.sendAnnouncement(
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      null,
      annoColor,
      "bold",
      NotifSound.NONE,
    )
    annoIndex = (annoIndex + 1) % annoList.length
    annoTimer = setTimeout(loop, 3 * 60 * 1000)
  }
  loop()
}
/*
    ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
    ║                                           O T H E R     E N D                                            ║
    ╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/

/*
 ▄▄▄       ▄▄▄▄    ██▓ ██▓     ██▓▄▄▄█████▓▓██   ██▓
▒████▄    ▓█████▄ ▓██▒▓██▒    ▓██▒▓  ██▒ ▓▒ ▒██  ██▒
▒██  ▀█▄  ▒██▒ ▄██▒██▒▒██░    ▒██▒▒ ▓██░ ▒░  ▒██ ██░
░██▄▄▄▄██ ▒██░█▀  ░██░▒██░    ░██░░ ▓██▓ ░   ░ ▐██▓░
 ▓█   ▓██▒░▓█  ▀█▓░██░░██████▒░██░  ▒██▒ ░   ░ ██▒▓░
 ▒▒   ▓▒█░░▒▓███▀▒░▓  ░ ▒░▓  ░░▓    ▒ ░░      ██▒▒▒
  ▒   ▒▒ ░▒░▒   ░  ▒ ░░ ░ ▒  ░ ▒ ░    ░     ▓██ ░▒░
  ░   ▒    ░    ░  ▒ ░  ░ ░    ▒ ░  ░       ▒ ▒ ░░
      ░  ░ ░       ░      ░  ░ ░            ░ ░
                ░                           ░ ░
*/
const touchState = {
  touchingPlayerId: null,
  touchStartTime: null,
  lastTouchDuration: 0,
  lastTouchedPlayerName: null,
  lastTouchedPlayerId: null,
  lastDribbledPlayerId: null,
  lastOpenedBarPlayerId: null,
  lastKickedPlayerId: null,
  secondLastTouchedPlayerId: null,
  secondLastTouchedPlayerName: null,
  thirdLastTouchedPlayerId: null,
  thirdLastTouchedPlayerName: null,
}
const curveState = {
  isCurving: false,
  curveStartTime: null,
  curveDirection: null,
  initialXspeed: 0,
  initialYspeed: 0,
  ballGravityX: 0,
  ballGravityY: 0,
  curveDuration: CURVED_SHOT_DURATION,
}
const ultiState = {
  isUlti: false,
  ultiStartTime: null,
  ultiPlayer: null,
}
let IS_ANY_ACTIVE_EFFECT = false
let touchType = null
let allResetted = false
let velocity = { xspeed: 0, yspeed: 0 }
let fixedBarFirstVis = false
let fixedBarPowerVis = false
let cf = {
  kick: 64,
  score: 128,
  ball: 193,
  red: 2,
  blue: 4,
  c0: 268435456,
  c1: 536870912,
  c2: 1073741824,
  c3: -2147483648,
}
const firstTimeThreshold = 0.35
const powerTimeThreshold = 2.25
const powerLobTimeThreshold = 2.25
const ultiTimeThresholdStart = 3.25
const lobShotState = {
  isLobShot: false,
  lobShotStartTime: null,
  lobShotWantedTime: firstTimeThreshold,
  lobShotDuration: 1.4,
}
const normalBallRadius = 6.4
const peakScale = normalBallRadius * 3
const peakHeight = 40
function handleLobShotState(room) {
  const elapsedLobTime = (Date.now() - lobShotState.lobShotStartTime) / 1000
  if (elapsedLobTime < lobShotState.lobShotDuration) {
    if (!IS_ANY_ACTIVE_EFFECT) {
      resetLobShotState() // Stop the curve
      Utils.runAfterGameTick(() => {
        room.setDiscProperties(0, {
          radius: normalBallRadius,
          cGroup: cf.ball,
          damping: 0.99,
          xgravity: 0,
          ygravity: 0,
        }) // Check if the ball's speed or direction has changed abruptly
      })
      return
    } else {
      const progress = elapsedLobTime / lobShotState.lobShotDuration // 0.0 - 1.0
      if (progress >= 1) {
        resetLobShotState()
        IS_ANY_ACTIVE_EFFECT = false
        Utils.runAfterGameTick(() => {
          room.setDiscProperties(0, {
            radius: normalBallRadius,
            cGroup: cf.ball,
            damping: 0.99,
            xgravity: 0,
            ygravity: 0,
          })
        })
        return
      }
      const z = 4 * peakHeight * progress * (1 - progress)
      const scaledRadius =
        normalBallRadius + (z / peakHeight) * (peakScale - normalBallRadius)
      const b = room.getBall(true)
      Utils.runAfterGameTick(() => {
        room.setDiscProperties(0, { damping: 0.994, radius: scaledRadius })
        setTimeout(() => {
          if (IS_ANY_ACTIVE_EFFECT && lobShotState.isLobShot)
            room.setDiscProperties(0, { cGroup: cf.c3 })
        }, 75)
      })
    }
  } else {
    resetLobShotState() // End the curve effect naturally
    IS_ANY_ACTIVE_EFFECT = false
    const bs = room.getBall(true).speed
    Utils.runAfterGameTick(() => {
      room.setDiscProperties(0, {
        radius: normalBallRadius,
        cGroup: cf.ball,
        damping: 0.99,
        xgravity: 0,
        ygravity: 0,
        xspeed: bs.x * 0.8,
        yspeed: bs.y * 0.8,
      })
    })
    return
  }
}
function resetLobShotState() {
  lobShotState.isLobShot = false
  lobShotState.lobShotStartTime = null
}
const CDSprintDurX = 10
const CDSprintDurXWingers = 6
const CDSlideDur = 20
const CDSlideDurDefenders = 15
const slideFrictionDur = 1
function resetSSS(room) {
  const ps = room.players
  for (i = 0; i < ps.length; i++) {
    if (!room.getPlayer(ps[i].id)) return
    ps[i].lastSprintDur = null
    ps[i].pressingXStartTime = null
    ps[i].lastSprintTime = null
    ps[i].lastSprintDur = null
    ps[i].lastSlideTime = null
    ps[i].isSprinting = null
    ps[i].isSliding = null
    ps[i].sprintStartTime = null
  }
}
function handleSprintState(player, room) {
  const now = Date.now()
  const isSpeedThresholdOkay =
    Math.abs(player.disc.speed.x) + Math.abs(player.disc.speed.y) >= 0.5
  const gravityMap = {
    17: { ygravity: -0.06 },
    29: { ygravity: -0.06 },
    18: { ygravity: 0.06 },
    30: { ygravity: 0.06 },
    20: { xgravity: -0.06 },
    23: { xgravity: -0.06 },
    24: { xgravity: 0.06 },
    27: { xgravity: 0.06 },
    21: { xgravity: -0.033, ygravity: -0.033 },
    22: { xgravity: -0.033, ygravity: 0.033 },
    25: { xgravity: 0.033, ygravity: -0.033 },
    26: { xgravity: 0.033, ygravity: 0.033 },
  }
  const speedMap = {
    17: { yspeed: -4 },
    29: { yspeed: -4 },
    18: { yspeed: 4 },
    30: { yspeed: 4 },
    20: { xspeed: -4 },
    23: { xspeed: -4 },
    24: { xspeed: 4 },
    27: { xspeed: 4 },
    21: { xspeed: -2.2, yspeed: -2.2 },
    22: { xspeed: -2.2, yspeed: 2.2 },
    25: { xspeed: 2.2, yspeed: -2.2 },
    26: { xspeed: 2.2, yspeed: 2.2 },
  }
  const props = player.op ? speedMap[player.input] : gravityMap[player.input]
  if (props) {
    Utils.runAfterGameTick(() => {
      room.setPlayerDiscProperties(player.id, props)
    })
  }
  const durLimit = player.op ? 10000 : 1000
  if (!isSpeedThresholdOkay || now - player.sprintStartTime >= durLimit) {
    player.lastSprintDur = now - player.sprintStartTime
    player.lastSprintTime = now
    player.isSprinting = false
    if ((!player.vip || !player.ca) && player.pos != 0)
      room.setPlayerAvatar(player.id, String(player.pos), true)
    else if (player.ca) room.setPlayerAvatar(player.id, player.ca, true)
    else room.setPlayerAvatar(player.id, player.avatar, true)
    Utils.runAfterGameTick(() => {
      room.setPlayerDiscProperties(player.id, { xgravity: 0, ygravity: 0 })
    })
    player.sprintStartTime = null
    room.setPlayerAvatar(player.id, "⌛", true)
    setTimeout(
      () => {
        if (player.isSprinting) return
        room.setPlayerAvatar(player.id, "🔋", true)
        setTimeout(() => {
          if (player.isSprinting) return
          if ((!player.vip || !player.ca) && player.pos != 0)
            room.setPlayerAvatar(player.id, String(player.pos), true)
          else if (player.ca) room.setPlayerAvatar(player.id, player.ca, true)
          else room.setPlayerAvatar(player.id, player.avatar, true)
        }, 500)
      },
      player.lastSprintDur *
        (player.pos === 7 || player.pos === 11
          ? CDSprintDurXWingers
          : CDSprintDurX),
    )
  }
}
function handleSlideFriction(player, room) {
  Utils.runAfterGameTick(async () => {
    room.setPlayerDiscProperties(player.id, {
      xspeed: player.disc.speed.x * 0.9,
      yspeed: player.disc.speed.y * 0.9,
    })
  })
}
let firstSlideLineTime = null
let secondSlideLineTime = null
function handleSlideState(player, room) {
  const now = Date.now() // Cache Date.now()
  const playerDisc = player.disc
  if (!playerDisc) return
  const vx = playerDisc.speed.x || 0
  const vy = playerDisc.speed.y || 0
  const magnitude = Math.sqrt(vx * vx + vy * vy)
  if (magnitude > 0.01) {
    const directionX = vx / magnitude
    const directionY = vy / magnitude
    const gravityStrength = 0.8
    const props = {
      xgravity: directionX * gravityStrength,
      ygravity: directionY * gravityStrength,
    }
    const px = playerDisc.pos.x
    const py = playerDisc.pos.y
    const slideLength = 50
    const spacing = 12
    const forwardOffset = 10
    const dx = directionX
    const dy = directionY
    const nx = -dy
    const ny = dx
    const baseX = px + dx * forwardOffset
    const baseY = py + dy * forwardOffset
    const line1Start = {
      x: baseX + nx * spacing,
      y: baseY + ny * spacing,
    }
    const line1End = {
      x: line1Start.x + dx * slideLength,
      y: line1Start.y + dy * slideLength,
    }
    const line2Start = {
      x: baseX - nx * spacing,
      y: baseY - ny * spacing,
    }
    const line2End = {
      x: line2Start.x + dx * slideLength,
      y: line2Start.y + dy * slideLength,
    }
    Utils.runAfterGameTick(() => {
      room.setPlayerDiscProperties(player.id, props)
      if (
        firstSlideLineTime === null ||
        (secondSlideLineTime != null &&
          firstSlideLineTime < secondSlideLineTime)
      ) {
        room.setDiscProperties(96, line1Start)
        room.setDiscProperties(97, line1End)
        room.setDiscProperties(98, line2Start)
        room.setDiscProperties(99, line2End)
        firstSlideLineTime = Date.now()
      } else {
        room.setDiscProperties(100, line1Start)
        room.setDiscProperties(101, line1End)
        room.setDiscProperties(102, line2Start)
        room.setDiscProperties(103, line2End)
        secondSlideLineTime = Date.now()
      }
    })
  }
  player.lastSlideTime = now
  setTimeout(() => {
    Utils.runAfterGameTick(async () => {
      room.setPlayerDiscProperties(player.id, { xgravity: 0, ygravity: 0 })
    })
  }, 100)
  setTimeout(() => {
    player.slideStartTime = null
    room.setPlayerAvatar(player.id, "⌛", true)
    player.CDForSlide = true
    player.isSlideFriction = true
    player.isSliding = false
    setTimeout(() => {
      player.isSlideFriction = false
    }, 1000 * slideFrictionDur)
    setTimeout(
      () => {
        player.CDForSlide = false
        if (player.isSliding) return
        room.setPlayerAvatar(player.id, "🔋", true)
        setTimeout(() => {
          if (player.isSliding) return
          if ((!player.vip || !player.ca) && player.pos != 0)
            room.setPlayerAvatar(player.id, String(player.pos), true)
          else if (player.ca) room.setPlayerAvatar(player.id, player.ca, true)
          else room.setPlayerAvatar(player.id, player.avatar, true)
        }, 500)
      },
      (player.pos === 1 || player.pos === 4 || player.pos === 5
        ? CDSlideDurDefenders
        : CDSlideDur) * 1000,
    )
  }, 400)
}
function handleKickState(player, room) {
  const now = Date.now()
  const holdDuration = player.pressingXStartTime
    ? now - player.pressingXStartTime
    : 0
  const isCoolDownDoneSlide = player.lastSlideTime
    ? now - player.lastSlideTime >
      (player.pos === 1 || player.pos === 4 || player.pos === 5
        ? CDSlideDurDefenders
        : CDSlideDur) *
        1000
    : true
  const isCoolDownDoneSprint = player.lastSprintTime
    ? now - player.lastSprintTime >
      player.lastSprintDur *
        (player.pos === 7 || player.pos === 11
          ? CDSprintDurXWingers
          : CDSprintDurX)
    : true
  const isSpeedThresholdOkay =
    Math.abs(player.disc.speed.x) + Math.abs(player.disc.speed.y) >= 0.5
  if (!(holdDuration === 0 && player.isKicking)) player.lhd = holdDuration
  if (
    player.isKicking &&
    !player.isSliding &&
    holdDuration >= 1600 &&
    isSpeedThresholdOkay &&
    isCoolDownDoneSlide &&
    isCoolDownDoneSprint
  ) {
    player.isSprinting = true
    player.sprintStartTime = now
    room.setPlayerAvatar(player.id, "⚡", true)
  } else if (
    player.es &&
    player.isKicking &&
    holdDuration === 0 &&
    !player.isSprinting &&
    player.lhd >= 600 &&
    isSpeedThresholdOkay &&
    isCoolDownDoneSlide &&
    isCoolDownDoneSprint
  ) {
    player.isSliding = true
    player.slideStartTime = now
    room.setPlayerAvatar(player.id, "💨", true)
    handleSlideState(player, room)
  } else if (
    player.es &&
    player.isKicking &&
    !player.isSliding &&
    !player.isSprinting &&
    holdDuration >= 600 &&
    isSpeedThresholdOkay &&
    isCoolDownDoneSlide &&
    isCoolDownDoneSprint
  ) {
    room.setPlayerAvatar(player.id, "👟", true)
  } else if (
    isCoolDownDoneSlide &&
    isCoolDownDoneSprint &&
    (player.headlessAvatar === "👟" ||
      player.headlessAvatar === "💨" ||
      player.headlessAvatar === "⚡" ||
      player.headlessAvatar === "🔋" ||
      player.headlessAvatar === "⌛")
  ) {
    if ((!player.vip || !player.ca) && player.pos != 0)
      room.setPlayerAvatar(player.id, String(player.pos), true)
    else if (player.ca) room.setPlayerAvatar(player.id, player.ca, true)
    else room.setPlayerAvatar(player.id, player.avatar, true)
  }
  if (holdDuration === 0 && player.headlessAvatar === "👟") {
    if ((!player.vip || !player.ca) && player.pos != 0)
      room.setPlayerAvatar(player.id, String(player.pos), true)
    else if (player.ca) room.setPlayerAvatar(player.id, player.ca, true)
    else room.setPlayerAvatar(player.id, player.avatar, true)
  }
}
function handleTouchState(room, lastDribbledPlayerId) {
  const now = Date.now()
  if (touchState.touchingPlayerId !== lastDribbledPlayerId) {
    touchState.touchingPlayerId = lastDribbledPlayerId // Optimized touch state handling logic
    touchState.touchStartTime = now // Start new touch
  }
  touchState.lastTouchDuration = (now - touchState.touchStartTime) / 1000 // Duration in seconds
  const player = room.getPlayer(lastDribbledPlayerId)
  const ability = player.e
  if (!isPausedNow) {
    const playerDiscProps = room.getPlayerDisc(lastDribbledPlayerId)
    const playerX = playerDiscProps.pos.x // Cache player disc properties
    const playerY = playerDiscProps.pos.y
    const playerNx = playerDiscProps.speed.x
    const playerNy = playerDiscProps.speed.y
    const speedMultiplier = 1.05
    const playerSpeedX = playerNx * speedMultiplier
    const playerSpeedY = playerNy * speedMultiplier
    Utils.runAfterGameTick(() => {
      if (
        touchState.lastTouchDuration > ultiTimeThresholdStart &&
        ENABLE_POW_AND_ULTI &&
        ability === "curve"
      ) {
        room.setDiscProperties(0, { color: 0x0000ff })
      } else {
        room.setDiscProperties(0, { color: 0xffffff })
      }
      if (
        touchState.lastTouchDuration > firstTimeThreshold &&
        !fixedBarFirstVis
      ) {
        touchState.lastOpenedBarPlayerId = player.id
        if (ability == "curve") {
          room.setDiscProperties(currentStartDisc, {
            x: playerX - 28,
            y: playerY - 25,
          }) // Update disc positions
          room.setDiscProperties(currentStartDisc + 2, {
            x: playerX - 28,
            y: playerY - 25,
          })
          room.setDiscProperties(currentStartDisc + 1, {
            x: playerX + 28,
            y: playerY - 25,
          })
        } else if (ability == "lob") {
          if (ENABLE_BANANA) {
            room.setDiscProperties(currentStartDiscL, {
              x: playerX - 28,
              y: playerY - 25,
            }) // Update disc positions
            room.setDiscProperties(currentStartDiscL + 2, {
              x: playerX - 28,
              y: playerY - 25,
            })
            room.setDiscProperties(currentStartDiscL + 1, {
              x: playerX + 28,
              y: playerY - 25,
            })
          } else {
            room.setDiscProperties(currentStartDisc, {
              x: playerX,
              y: playerY - 40,
            }) // Update disc positions
            room.setDiscProperties(currentStartDisc + 2, {
              x: playerX + 6,
              y: playerY - 25,
            })
            room.setDiscProperties(currentStartDisc + 1, {
              x: playerX - 6,
              y: playerY - 25,
            })
          }
        } else {
          room.setDiscProperties(currentStartDisc, {
            x: playerX - 20,
            y: playerY - 25,
          }) // Update disc positions
          room.setDiscProperties(currentStartDisc + 2, {
            x: playerX - 20,
            y: playerY - 25,
          })
          room.setDiscProperties(currentStartDisc + 1, {
            x: playerX + 20,
            y: playerY - 25,
          })
        }
        fixedBarFirstVis = true
      } else if (
        touchState.lastTouchDuration > firstTimeThreshold &&
        fixedBarFirstVis
      ) {
        if (ENABLE_BANANA && ability == "lob") {
          room.setDiscProperties(currentStartDiscL, {
            xspeed: playerSpeedX,
            yspeed: playerSpeedY,
          }) // Update disc speeds
          room.setDiscProperties(currentStartDiscL + 2, {
            xspeed: playerSpeedX,
            yspeed: playerSpeedY,
          })
          room.setDiscProperties(currentStartDiscL + 1, {
            xspeed: playerSpeedX,
            yspeed: playerSpeedY,
          })
        } else {
          room.setDiscProperties(currentStartDisc, {
            xspeed: playerSpeedX,
            yspeed: playerSpeedY,
          }) // Update disc speeds
          room.setDiscProperties(currentStartDisc + 2, {
            xspeed: playerSpeedX,
            yspeed: playerSpeedY,
          })
          room.setDiscProperties(currentStartDisc + 1, {
            xspeed: playerSpeedX,
            yspeed: playerSpeedY,
          })
        }
      }
      if (
        ability == "curve" &&
        touchState.lastTouchDuration > firstTimeThreshold &&
        fixedBarFirstVis &&
        touchState.lastTouchDuration < powerTimeThreshold
      )
        room.setDiscProperties(currentStartDisc + 2, {
          xspeed: playerSpeedX + 0.45,
        }) // Update disc speeds BUNU DENE
      else if (
        ability == "curve" &&
        ENABLE_POW_AND_ULTI &&
        touchState.lastTouchDuration > powerTimeThreshold &&
        fixedBarFirstVis &&
        !fixedBarPowerVis
      ) {
        const startDisc = room.getDisc(currentStartDisc)
        room.setDiscProperties(currentStartDisc + 2, {
          x: startDisc.pos.x,
          y: startDisc.pos.y,
        })
        fixedBarPowerVis = true
      } else if (
        ENABLE_BANANA &&
        ability == "lob" &&
        touchState.lastTouchDuration > firstTimeThreshold &&
        fixedBarFirstVis &&
        touchState.lastTouchDuration < powerTimeThreshold
      )
        room.setDiscProperties(currentStartDiscL + 2, {
          xspeed: playerSpeedX + 0.45,
        }) // Update disc speeds BUNU DENE
      else if (
        ENABLE_BANANA &&
        ability == "lob" &&
        touchState.lastTouchDuration > powerTimeThreshold &&
        fixedBarFirstVis &&
        !fixedBarPowerVis
      ) {
        room.setDiscProperties(currentStartDiscL, {
          x: playerX,
          y: playerY - 40,
        }) // Update disc positions
        room.setDiscProperties(currentStartDiscL + 2, {
          x: playerX + 6,
          y: playerY - 25,
        })
        room.setDiscProperties(currentStartDiscL + 1, {
          x: playerX - 6,
          y: playerY - 25,
        })
        fixedBarPowerVis = true
      } else if (
        ENABLE_BANANA &&
        ability == "none" &&
        touchState.lastTouchDuration > firstTimeThreshold &&
        fixedBarFirstVis &&
        touchState.lastTouchDuration < powerTimeThreshold
      ) {
        room.setDiscProperties(currentStartDisc + 1, {
          xspeed: playerSpeedX + 0.1,
        })
        room.setDiscProperties(currentStartDisc, { xspeed: playerSpeedX - 0.1 })
        room.setDiscProperties(currentStartDisc + 2, {
          xspeed: playerSpeedX - 0.1,
        })
      } else if (
        ENABLE_BANANA &&
        ability == "none" &&
        touchState.lastTouchDuration > powerTimeThreshold &&
        fixedBarFirstVis &&
        !fixedBarPowerVis
      ) {
        fixedBarPowerVis = true
      }
    })
  }
  allResetted = false
}
function resetTouchState(room) {
  touchState.touchingPlayerId = null
  touchState.touchStartTime = null
  touchState.lastDribbledPlayerId = null
  const ball = room.getBall()
  Utils.runAfterGameTick(() => {
    for (i = currentStartDisc; i < currentStartDisc + 3; i++)
      if (room.getDisc(currentStartDisc))
        room.setDiscProperties(i, {
          x: room.getDisc(currentStartDisc).pos.x,
          y: room.getDisc(currentStartDisc).pos.y,
          xspeed: 0,
          yspeed: 0,
        })
      else room.setDiscProperties(i, { x: 0, y: 0, xspeed: 0, yspeed: 0 })
    if (ENABLE_BANANA) {
      for (i = currentStartDiscL; i < currentStartDiscL + 3; i++)
        if (room.getDisc(currentStartDiscL))
          room.setDiscProperties(i, {
            x: room.getDisc(currentStartDiscL).pos.x,
            y: room.getDisc(currentStartDiscL).pos.y,
            xspeed: 0,
            yspeed: 0,
          })
        else room.setDiscProperties(i, { x: 0, y: 0, xspeed: 0, yspeed: 0 })
    }
  })
  fixedBarFirstVis = false
  fixedBarPowerVis = false
  allResetted = true
}
function handleUltiState(room) {
  const elapsedTime = (Date.now() - ultiState.ultiStartTime) / 1000
  if (
    elapsedTime <= 2.2 ||
    ultiState.ultiPlayer !== touchState.lastTouchedPlayerId ||
    !room.getPlayer(ultiState.ultiPlayer)
  ) {
    if (!IS_ANY_ACTIVE_EFFECT) {
      resetUltiState() // Check if the ball's speed or direction has changed abruptly
      Utils.runAfterGameTick(() => {
        room.setDiscProperties(0, {
          xgravity: 0,
          ygravity: 0,
          radius: normalBallRadius,
          cGroup: cf.ball,
          damping: 0.99,
        })
      })
      return
    }
    let gravity = {
      x: 0,
      y: 0,
    }
    const playerInput = room.getPlayer(ultiState.ultiPlayer).input
    const ball = room.getBall(true)
    const negativeX = [7, 4, 6, 5]
    const positiveX = [8, 11, 9, 10]
    const negativeY = [1, 13, 5, 9]
    const positiveY = [2, 14, 6, 10]
    if (negativeX.includes(playerInput))
      gravity.x = -0.24 / Math.max(Math.abs(ball.speed.x), 1)
    else if (positiveX.includes(playerInput))
      gravity.x = 0.24 / Math.max(Math.abs(ball.speed.x), 1)
    if (negativeY.includes(playerInput))
      gravity.y = -0.24 / Math.max(Math.abs(ball.speed.y), 1)
    else if (positiveY.includes(playerInput))
      gravity.y = 0.24 / Math.max(Math.abs(ball.speed.y), 1)
    Utils.runAfterGameTick(() => {
      room.setDiscProperties(0, {
        xgravity: gravity.x,
        ygravity: gravity.y,
      })
    })
  } else {
    resetUltiState()
    IS_ANY_ACTIVE_EFFECT = false
    Utils.runAfterGameTick(() => {
      room.setDiscProperties(0, {
        xgravity: 0,
        ygravity: 0,
        radius: normalBallRadius,
        cGroup: cf.ball,
        damping: 0.99,
      })
    })
  }
}
function handleCurveState(room) {
  const elapsedTime = (Date.now() - curveState.curveStartTime) / 1000 // Time since curve started
  if (elapsedTime <= curveState.curveDuration) {
    const increasingFactor =
      (Math.min(elapsedTime * 3, 0.7) * (1 + curveState.curveIntensity * 4)) /
      curveState.curveDuration
    const curveEffect = {
      x: curveState.curveDirection.x * 0.1 * increasingFactor, // Apply the curve effect
      y: curveState.curveDirection.y * 0.1 * increasingFactor,
    }
    velocity.xspeed = curveEffect.x
    velocity.yspeed = curveEffect.y
    if (!IS_ANY_ACTIVE_EFFECT) {
      // Check if the ball's speed or direction has changed abruptly
      resetCurveState() // Stop the curve
      Utils.runAfterGameTick(() => {
        room.setDiscProperties(0, {
          xgravity: 0,
          ygravity: 0,
          radius: normalBallRadius,
          cGroup: cf.ball,
          damping: 0.99,
        })
      })
      return
    }
    curveState.ballGravityX = velocity.xspeed * 0.5
    curveState.ballGravityY = -velocity.yspeed * 0.5
    Utils.runAfterGameTick(() => {
      room.setDiscProperties(0, {
        xgravity: curveState.ballGravityX,
        ygravity: curveState.ballGravityY,
      }) // Apply new velocity
    })
  } else {
    resetCurveState() // End the curve effect naturally
    IS_ANY_ACTIVE_EFFECT = false
    Utils.runAfterGameTick(() => {
      room.setDiscProperties(0, {
        xgravity: 0,
        ygravity: 0,
        radius: normalBallRadius,
        cGroup: cf.ball,
        damping: 0.99,
      })
    })
  }
}
function calculateDistance(pos1, pos2) {
  const dx = pos1.x - pos2.x
  const dy = pos1.y - pos2.y
  const distanceSquared = dx * dx + dy * dy // Cache squared distance
  return Math.sqrt(distanceSquared)
}
function isClosestPlayerTouchingBall(posBall, closestPlayer) {
  const TOUCH_DISTANCE = 25
  if (!closestPlayer || !closestPlayer.pos) return 0 // Early return if no player
  const distance = calculateDistance(posBall, closestPlayer.pos) // Determine touch type based on player position at below
  if (distance > TOUCH_DISTANCE) return 0 // Early return if not touching // Player is below the ball (touching from downside)
  if (
    (closestPlayer.pos.y > posBall.y && closestPlayer.pos.x > posBall.x) ||
    (closestPlayer.pos.y < posBall.y && closestPlayer.pos.x < posBall.x)
  )
    return 1
  return 2 // Player is above the ball (touching from upside)
}
function isMovingRightOfPerpendicular(player, ball) {
  const dx = ball.x - player.disc.pos.x
  const dy = ball.y - player.disc.pos.y
  let playerInputX
  let playerInputY
  let realInput
  const negativeX = [7, 4, 6, 5, 20, 21, 22, 23]
  const positiveX = [8, 11, 9, 10, 24, 25, 26, 27]
  const negativeY = [1, 13, 5, 9, 17, 21, 25, 29]
  const positiveY = [2, 14, 6, 10, 18, 22, 26, 30]
  const notr = [12, 28, 3, 19, 15, 31]
  if (notr.includes(player.input)) realInput = player.rpi
  else realInput = player.input
  if (negativeX.includes(realInput)) playerInputX = -1
  else if (positiveX.includes(realInput)) playerInputX = 1
  if (negativeY.includes(realInput)) playerInputY = -1
  else if (positiveY.includes(realInput)) playerInputY = 1
  if (playerInputX === undefined) playerInputX = 0
  if (playerInputY === undefined) playerInputY = 0
  const velocityX = playerInputX
  const velocityY = playerInputY
  const dirX = dx
  const dirY = dy
  const normalX = -dirY
  const normalY = dirX
  const dot = velocityX * normalX + velocityY * normalY
  return dot > 0
}
function calculateCurveEffectDirection(ball, player) {
  const kickDirection = {
    x: ball.x - player.disc.pos.x,
    y: ball.y - player.disc.pos.y,
  }
  const magnitudeSquared = kickDirection.x ** 2 + kickDirection.y ** 2
  if (magnitudeSquared === 0) return { x: 0, y: 0 } // Avoid division by zero
  const magnitude = Math.sqrt(magnitudeSquared)
  const directionForAngle = isMovingRightOfPerpendicular(player, ball)
  const directionMultiplier = directionForAngle ? 1 : -1
  return {
    x: (kickDirection.y / magnitude) * directionMultiplier,
    y: (kickDirection.x / magnitude) * directionMultiplier,
  }
}
function resetCurveState() {
  curveState.isCurving = false
  curveState.curveStartTime = null
  curveState.curveDirection = null
  curveState.curveIntensity = 0
  curveState.ballGravityX = 0
  curveState.ballGravityY = 0
}
function resetUltiState() {
  ultiState.isUlti = false
  ultiState.ultiStartTime = null
  ultiState.ultiPlayer = null
}
let isShot = false
let lId, sId, prevLId, tId
function updateLastTouchedPlayer(playerId, room) {
  if (playerId !== touchState.lastTouchedPlayerId) {
    if (
      touchState.lastTouchedPlayerId != null &&
      room.getPlayer(touchState.lastTouchedPlayerId) != null
    ) {
      if (
        touchState.secondLastTouchedPlayerId != null &&
        room.getPlayer(touchState.secondLastTouchedPlayerId) != null
      ) {
        touchState.thirdLastTouchedPlayerId =
          touchState.secondLastTouchedPlayerId
        touchState.thirdLastTouchedPlayerName = room.getPlayer(
          touchState.thirdLastTouchedPlayerId,
        ).name
      }
      touchState.secondLastTouchedPlayerId = touchState.lastTouchedPlayerId
      touchState.secondLastTouchedPlayerName = room.getPlayer(
        touchState.secondLastTouchedPlayerId,
      ).name
    }
    touchState.lastTouchedPlayerId = playerId
    touchState.lastTouchedPlayerName = room.getPlayer(
      touchState.lastTouchedPlayerId,
    ).name
    touchState.lastDribbledPlayerId = touchState.lastTouchedPlayerId
    if (lId) prevLId = lId
    lId = room.getPlayer(touchState.lastTouchedPlayerId)
      ? room.getPlayer(touchState.lastTouchedPlayerId)
      : null
    sId = room.getPlayer(touchState.secondLastTouchedPlayerId)
      ? room.getPlayer(touchState.secondLastTouchedPlayerId)
      : null
    tId = room.getPlayer(touchState.thirdLastTouchedPlayerId)
      ? room.getPlayer(touchState.thirdLastTouchedPlayerId)
      : null
    if (
      tId &&
      sId &&
      lId &&
      sId.team.id !== tId.team.id &&
      lId.id !== sId.id &&
      lId.team.id === sId.team.id
    ) {
      sId.topc++
    }
    if (!lId || !sId || lId.id === sId.id || isShot || lId === prevLId) return
    const lIdT = lId.team.id
    const sIdT = sId.team.id
    if (lIdT === sIdT) {
      sId.ap++
    }
  }
}
function resetLastTouchedPlayer() {
  touchState.secondLastTouchedPlayerId = null
  touchState.secondLastTouchedPlayerName = null
  touchState.lastTouchedPlayerId = null
  touchState.lastTouchedPlayerName = null
  touchState.lastDribbledPlayerId = null
}

/*
    ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
    ║                                         A B I L I T Y     E N D                                          ║
    ╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/

/*
 ██▀███   ▒█████   ▒█████   ███▄ ▄███▓
▓██ ▒ ██▒▒██▒  ██▒▒██▒  ██▒▓██▒▀█▀ ██▒
▓██ ░▄█ ▒▒██░  ██▒▒██░  ██▒▓██    ▓██░
▒██▀▀█▄  ▒██   ██░▒██   ██░▒██    ▒██
░██▓ ▒██▒░ ████▓▒░░ ████▓▒░▒██▒   ░██▒
░ ▒▓ ░▒▓░░ ▒░▒░▒░ ░ ▒░▒░▒░ ░ ▒░   ░  ░
  ░▒ ░ ▒░  ░ ▒ ▒░   ░ ▒ ▒░ ░  ░      ░
  ░░   ░ ░ ░ ░ ▒  ░ ░ ░ ▒  ░      ░
   ░         ░ ░      ░ ░         ░

*/
function onError(error, playerId) {
  console.log(playerId, error)
}
Room.create(
  {
    name: ROOM_NAME,
    showInRoomList: IS_PUBLIC,
    maxPlayerCount: MAX_PLAYER_NUMBER,
    token: HEADLESS_TOKEN,
    noPlayer: true,
    unlimitedPlayerCount: true,
    onError: onError,
  },
  {
    onError: (error, playerId) => {
      console.log(playerId, error)
    },
    onOpen: (room) => {
      room.onAfterRoomLink = (roomLink) => {
        const now = new Date()
        console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`)
        ROOM_LINK = roomLink
        console.log(roomLink)
        if (room.players.length === 0) {
          if (needToLockTeams) {
            room.lockTeams()
            needToLockTeams = false
          }
          room.setScoreLimit(SCORE_LIMIT)
          room.setTimeLimit(TIME_LIMIT)
          stadFCmd()
          dbKits[homeTeam]
            .slice(1, 2)
            .forEach((k) =>
              k.c3 !== undefined
                ? room.setTeamColors(Team.RED, k.a, k.c0, k.c1, k.c2, k.c3)
                : k.c2 !== undefined
                  ? room.setTeamColors(Team.RED, k.a, k.c0, k.c1, k.c2)
                  : room.setTeamColors(Team.RED, k.a, k.c0, k.c1),
            )
          dbKits[awayTeam]
            .slice(1, 2)
            .forEach((k) =>
              k.c3 !== undefined
                ? room.setTeamColors(Team.BLUE, k.a, k.c0, k.c1, k.c2, k.c3)
                : k.c2 !== undefined
                  ? room.setTeamColors(Team.BLUE, k.a, k.c0, k.c1, k.c2)
                  : room.setTeamColors(Team.BLUE, k.a, k.c0, k.c1),
            )
          sendAnnos(room)
        }
      }

      /*
             ▄████▄   ▒█████   ███▄ ▄███▓ ███▄ ▄███▓ ▄▄▄       ███▄    █ ▓█████▄   ██████
            ▒██▀ ▀█  ▒██▒  ██▒▓██▒▀█▀ ██▒▓██▒▀█▀ ██▒▒████▄     ██ ▀█   █ ▒██▀ ██▌▒██    ▒
            ▒▓█    ▄ ▒██░  ██▒▓██    ▓██░▓██    ▓██░▒██  ▀█▄  ▓██  ▀█ ██▒░██   █▌░ ▓██▄
            ▒▓▓▄ ▄██▒▒██   ██░▒██    ▒██ ▒██    ▒██ ░██▄▄▄▄██ ▓██▒  ▐▌██▒░▓█▄   ▌  ▒   ██▒
            ▒ ▓███▀ ░░ ████▓▒░▒██▒   ░██▒▒██▒   ░██▒ ▓█   ▓██▒▒██░   ▓██░░▒████▓ ▒██████▒▒
            ░ ░▒ ▒  ░░ ▒░▒░▒░ ░ ▒░   ░  ░░ ▒░   ░  ░ ▒▒   ▓▒█░░ ▒░   ▒ ▒  ▒▒▓  ▒ ▒ ▒▓▒ ▒ ░
              ░  ▒     ░ ▒ ▒░ ░  ░      ░░  ░      ░  ▒   ▒▒ ░░ ░░   ░ ▒░ ░ ▒  ▒ ░ ░▒  ░ ░
            ░        ░ ░ ░ ▒  ░      ░   ░      ░     ░   ▒      ░   ░ ░  ░ ░  ░ ░  ░  ░
            ░ ░          ░ ░         ░          ░         ░  ░         ░    ░          ░
            ░                                                             ░
      */
      function getCommand(commandStr) {
        if (commands.hasOwnProperty(commandStr)) return commandStr
        for (const [key, value] of Object.entries(commands))
          for (let alias of value.aliases) if (alias == commandStr) return key
        return false
      }
      function helpCmd(player) {
        room.sendAnnouncement(
          helpString,
          player.id,
          colorSucces,
          "normal",
          NotifSound.NONE,
        )
      }
      function controlsCmd(player) {
        room.sendAnnouncement(
          controlsString,
          player.id,
          colorInfo,
          "small",
          NotifSound.NONE,
        )
      }
      function changeSlideStatePlayerSpecialCmd(player) {
        if (!player.es) {
          player.es = true
          room.sendAnnouncement(
            `${emojiSucces} Slide ability enabled.`,
            player.id,
            colorSucces,
            "small",
            NotifSound.NONE,
          )
        } else {
          player.es = false
          room.sendAnnouncement(
            `${emojiSucces} Slide ability disabled.`,
            player.id,
            colorSucces,
            "small",
            NotifSound.NONE,
          )
        }
        return
      }
      function changeOPModeStatePlayerSpecialCmd(player) {
        if (!player.op) {
          player.op = true
          room.sendAnnouncement(
            `${emojiSucces} OP-mode ability enabled.`,
            player.id,
            colorSucces,
            "small",
            NotifSound.NONE,
          )
        } else {
          player.op = false
          room.sendAnnouncement(
            `${emojiSucces} OP-mode ability disabled.`,
            player.id,
            colorSucces,
            "small",
            NotifSound.NONE,
          )
        }
        return
      }
      function setCurveAbility(player) {
        if (player.e === "curve") {
          room.sendAnnouncement(
            `${emojiAtt} Curve ability selected already.`,
            player.id,
            colorAtt,
            "small",
            NotifSound.NONE,
          )
          return
        }
        setSpecialAbility(player, "curve", "Curve")
      }
      function setLobAbility(player) {
        if (player.e === "lob") {
          room.sendAnnouncement(
            `${emojiAtt} Lob-shot ability selected already.`,
            player.id,
            colorAtt,
            "small",
            NotifSound.NONE,
          )
          return
        }
        setSpecialAbility(player, "lob", "Lob-shot")
      }
      function setNoneAbility(player) {
        if (player.e === "none") {
          room.sendAnnouncement(
            `${emojiAtt} Auto-powershot selected already.`,
            player.id,
            colorAtt,
            "small",
            NotifSound.NONE,
          )
          return
        }
        setSpecialAbility(player, "none", "Auto-powershot")
      }
      function setSpecialAbility(player, abilityValue, abilityLabel) {
        try {
          player.e = abilityValue
          const msg =
            abilityValue === "none"
              ? `${emojiSucces} Successfully selected Auto-powershot ability!`
              : `${emojiSucces} Successfully selected ${abilityLabel} ability!`
          room.sendAnnouncement(
            msg,
            player.id,
            colorSucces,
            "small",
            NotifSound.NONE,
          )
        } catch (err) {
          console.error(err)
        } finally {
        }
      }
      function dcCmd(player) {
        room.sendAnnouncement(
          discordString,
          player.id,
          colorDiscord,
          "bold",
          NotifSound.NONE,
        )
      }
      function leaveCmd(player) {
        const hour = new Date().getHours()
        let message
        if (hour >= 6 && hour < 18) message = "Good day, see you again."
        else if (hour >= 18 && hour < 23)
          message = "Good evening, see you again."
        else message = "Good night, see you again."
        room.kickPlayer(player.id, message, false)
      }
      function seeKitsCmd(player) {
        room.sendAnnouncement(
          `${kitsInfo}`,
          player.id,
          colorInfo,
          "small",
          NotifSound.NONE,
        )
        room.sendAnnouncement(
          `${emojiInfo} To change kits, use !kr <kit_no> (Red) | !kb <kit_no> (Blue)`,
          player.id,
          colorInfo,
          "small",
          NotifSound.NONE,
        )
      }
      function changeRedKitCmd(player, message) {
        if (message.length < 2) {
          room.sendAnnouncement(
            `${emojiAtt} Kit number must be between 0 and ${dbKits.length}.`,
            player.id,
            colorAtt,
            "bold",
            NotifSound.NONE,
          )
          return
        }
        const msgArray = message.split(/ +/).slice(1)
        if (msgArray.length < 1) {
          room.sendAnnouncement(
            `${emojiAtt} Kit number must be between 0 and ${dbKits.length}.`,
            player.id,
            colorAtt,
            "bold",
            NotifSound.NONE,
          )
          return
        }
        if (msgArray[0].length > 0) {
          if (msgArray[0] < dbKits.length && msgArray[0] >= 0) {
            const kit = msgArray[0]
            if (awayTeam == kit) {
              room.sendAnnouncement(
                `${emojiAtt} You cannot assign the same kit to both teams.`,
                player.id,
                colorAtt,
                "bold",
                NotifSound.NONE,
              )
              return
            }
            homeTeam = kit
            dbKits[kit]
              .slice(1, 2)
              .forEach((k) =>
                k.c3 !== undefined
                  ? room.setTeamColors(Team.RED, k.a, k.c0, k.c1, k.c2, k.c3)
                  : k.c2 !== undefined
                    ? room.setTeamColors(Team.RED, k.a, k.c0, k.c1, k.c2)
                    : room.setTeamColors(Team.RED, k.a, k.c0, k.c1),
              )
            room.sendAnnouncement(
              `${emojiSucces} ${player.name}, assigned the ${dbKits[kit][0].t} kit for red team.`,
              null,
              colorSucces,
              "small",
              NotifSound.NONE,
            )
          } else
            room.sendAnnouncement(
              `${emojiAtt} Kit number must be between 0 and ${dbKits.length}.`,
              player.id,
              colorAtt,
              "bold",
              NotifSound.NONE,
            )
        }
      }
      function changeBlueKitCmd(player, message) {
        if (message.length < 2) {
          room.sendAnnouncement(
            `${emojiAtt} Kit number must be between 0 and ${dbKits.length}.`,
            player.id,
            colorAtt,
            "bold",
            NotifSound.NONE,
          )
          return
        }
        const msgArray = message.split(/ +/).slice(1)
        if (msgArray.length < 1) {
          room.sendAnnouncement(
            `${emojiAtt} Kit number must be between 0 and ${dbKits.length}.`,
            player.id,
            colorAtt,
            "bold",
            NotifSound.NONE,
          )
          return
        }
        if (msgArray && msgArray[0] && msgArray[0].length > 0) {
          if (msgArray[0] < dbKits.length && msgArray[0] >= 0) {
            const kit = msgArray[0]
            if (homeTeam == kit) {
              room.sendAnnouncement(
                `${emojiAtt} You cannot assign the same kit to both teams.`,
                player.id,
                colorAtt,
                "bold",
                NotifSound.NONE,
              )
              return
            }
            awayTeam = kit
            dbKits[kit]
              .slice(1, 2)
              .forEach((k) =>
                k.c3 !== undefined
                  ? room.setTeamColors(Team.BLUE, k.a, k.c0, k.c1, k.c2, k.c3)
                  : k.c2 !== undefined
                    ? room.setTeamColors(Team.BLUE, k.a, k.c0, k.c1, k.c2)
                    : room.setTeamColors(Team.BLUE, k.a, k.c0, k.c1),
              )
            room.sendAnnouncement(
              `${emojiSucces} ${player.name}, assigned the ${dbKits[kit][0].t} kit for blue team.`,
              null,
              colorSucces,
              "small",
              NotifSound.NONE,
            )
          } else
            room.sendAnnouncement(
              `${emojiAtt} Kit number must be between 0 and ${dbKits.length}.`,
              player.id,
              colorAtt,
              "bold",
              NotifSound.NONE,
            )
        }
      }
      function stadFCmd() {
        room.stopGame()
        room.setCurrentStadium(
          Utils.parseStadium(JSON.stringify(stadiumF), console.log),
        )
      }
      function claimAdminCmd(player) {
        room.setPlayerAdmin(player.id, true)
        room.sendAnnouncement(
          `${emojiSucces} ${player.name} is now an admin.`,
          null,
          colorSucces,
          "small",
          NotifSound.NONE,
        )
      }
      const commands = {
        help: {
          aliases: ["commands"],
          roles: Role.PLAYER,
          desc: true,
          function: helpCmd,
        },
        controls: {
          aliases: [],
          roles: Role.PLAYER,
          desc: true,
          function: controlsCmd,
        },
        dc: {
          aliases: ["discord"],
          roles: Role.PLAYER,
          desc: true,
          function: dcCmd,
        },
        bb: {
          aliases: ["bye"],
          roles: Role.PLAYER,
          desc: true,
          function: leaveCmd,
        },
        sl: {
          aliases: ["slide"],
          roles: Role.PLAYER,
          desc: true,
          function: changeSlideStatePlayerSpecialCmd,
        },
        op: {
          aliases: [],
          roles: Role.PLAYER,
          desc: true,
          function: changeOPModeStatePlayerSpecialCmd,
        },
        kits: {
          aliases: ["shirts"],
          roles: Role.PLAYER,
          desc: true,
          function: seeKitsCmd,
        },
        kr: {
          aliases: [],
          roles: Role.PLAYER,
          desc: true,
          function: changeRedKitCmd,
        },
        kb: {
          aliases: [],
          roles: Role.PLAYER,
          desc: true,
          function: changeBlueKitCmd,
        },
        claim: {
          aliases: [],
          roles: Role.PLAYER,
          desc: true,
          function: claimAdminCmd,
        },
      }
      /*
            ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
            ║                                        C O M M A N D S     E N D                                         ║
            ╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
      */

      room.onPlayerSyncChange = function (playerId, value) {
        if (!value) {
          const player = room.getPlayer(playerId)
          player.syncCount += 1
          console.log("SYNC CHANGED", player.name, player.syncCount)
        }
      }
      room.onPlayerObjectCreated = async function (pObj) {
        pObj.lhd = 0
        pObj.lbkt = 0
        pObj.e = "curve"
        pObj.syncCount = 0
        pObj.pos = 0
        pObj.es = true
        pObj.op = false
        setTimeout(async () => {
          try {
            pObj.vip = 1
            pObj.mod = 1
            if (pObj.vip) {
              pObj.ca = null
              pObj.aa = 0
              pObj.aas = 0
            }
          } catch (err) {
            console.error(err)
          } finally {
          }
        }, 1000)
        try {
          pObj.e = "curve"
        } catch (err) {
          console.error(err)
        }
      }
      room.onOperationReceived = (type, message) => {
        switch (type) {
          case OperationType.SendInput: {
            const player = room.getPlayer(message.byId)
            if (player.ib || player.ipb || player.ige) message.input = 0
            return true
          }
          case OperationType.SendChat: {
            const msg = message.text
            const player = room.getPlayer(message.byId)
            if (msg[0][0] == "!") {
              const parts = msg.replace("!", "").split(" ")
              let command = getCommand(parts[0].toLowerCase())
              const commandRoles = commands[command]?.roles
              const playerRoles = [Role.PLAYER]
              if (command && playerRoles.includes(commandRoles)) {
                commands[command].function(player, msg)
              } else
                setTimeout(function () {
                  room.sendAnnouncement(
                    `${emojiAtt} Command is invalid. !help`,
                    player.id,
                    colorAtt,
                    "bold",
                    NotifSound.NONE,
                  )
                }, 200)
              return false
            }
            if (
              msg.length > 0 &&
              (msg.toLowerCase() === "c" ||
                msg.toLowerCase() === "l" ||
                msg.toLowerCase() === "a")
            ) {
              switch (msg.toLowerCase()) {
                case "c":
                  setCurveAbility(player)
                  break
                case "l":
                  setLobAbility(player)
                  break
                case "a":
                  setNoneAbility(player)
                  break
                default:
                  break
              }
              return false
            }
            room.sendAnnouncement(
              `${player.name}: ${msg}`,
              null,
              colorWhite,
              "normal",
              NotifSound.CHAT,
            )
            return false
          }
          default:
            return true
        }
      }
      const letterMap = {
        A: [
          [
            { x: -5, y: 5 },
            { x: 0, y: -5 },
          ],
          [
            { x: 0, y: -5 },
            { x: 5, y: 5 },
          ],
          [
            { x: -3, y: 0 },
            { x: 3, y: 0 },
          ],
        ],
        B: [
          [
            { x: -5, y: -5 },
            { x: -5, y: 5 },
          ],
          [
            { x: -5, y: -5 },
            { x: 3, y: -2 },
          ],
          [
            { x: 3, y: -2 },
            { x: -5, y: 0 },
          ],
          [
            { x: -5, y: 0 },
            { x: 3, y: 2 },
          ],
          [
            { x: 3, y: 2 },
            { x: -5, y: 5 },
          ],
        ],
        C: [
          [
            { x: 5, y: -5 },
            { x: -5, y: -5 },
          ],
          [
            { x: -5, y: -5 },
            { x: -5, y: 5 },
          ],
          [
            { x: -5, y: 5 },
            { x: 5, y: 5 },
          ],
        ],
        D: [
          [
            { x: -5, y: -5 },
            { x: -5, y: 5 },
          ],
          [
            { x: -5, y: -5 },
            { x: 2, y: -5 },
          ],
          [
            { x: 2, y: -5 },
            { x: 5, y: -2 },
          ],
          [
            { x: 5, y: -2 },
            { x: 5, y: 2 },
          ],
          [
            { x: 5, y: 2 },
            { x: 2, y: 5 },
          ],
          [
            { x: 2, y: 5 },
            { x: -5, y: 5 },
          ],
        ],
        E: [
          [
            { x: 5, y: -5 },
            { x: -5, y: -5 },
          ],
          [
            { x: -5, y: -5 },
            { x: -5, y: 5 },
          ],
          [
            { x: -5, y: 5 },
            { x: 5, y: 5 },
          ],
          [
            { x: -5, y: 0 },
            { x: 3, y: 0 },
          ],
        ],
        F: [
          [
            { x: -5, y: -5 },
            { x: -5, y: 5 },
          ],
          [
            { x: -5, y: -5 },
            { x: 5, y: -5 },
          ],
          [
            { x: -5, y: 0 },
            { x: 3, y: 0 },
          ],
        ],
        G: [
          [
            { x: 5, y: -5 },
            { x: -5, y: -5 },
          ],
          [
            { x: -5, y: -5 },
            { x: -5, y: 5 },
          ],
          [
            { x: -5, y: 5 },
            { x: 5, y: 5 },
          ],
          [
            { x: 5, y: 5 },
            { x: 5, y: 0 },
          ],
          [
            { x: 1, y: 0 },
            { x: 5, y: 0 },
          ],
        ],
        H: [
          [
            { x: -5, y: -5 },
            { x: -5, y: 5 },
          ],
          [
            { x: 5, y: -5 },
            { x: 5, y: 5 },
          ],
          [
            { x: -5, y: 0 },
            { x: 5, y: 0 },
          ],
        ],
        I: [
          [
            { x: 0, y: -5 },
            { x: 0, y: 5 },
          ],
        ],
        J: [
          [
            { x: 5, y: -5 },
            { x: 5, y: 3 },
          ],
          [
            { x: 5, y: 3 },
            { x: 3, y: 5 },
          ],
          [
            { x: 3, y: 5 },
            { x: -1, y: 5 },
          ],
          [
            { x: -1, y: 5 },
            { x: -3, y: 3 },
          ],
          [
            { x: -3, y: 3 },
            { x: -3, y: 2 },
          ],
        ],
        K: [
          [
            { x: -5, y: -5 },
            { x: -5, y: 5 },
          ],
          [
            { x: -5, y: 0 },
            { x: 3, y: -5 },
          ],
          [
            { x: -5, y: 0 },
            { x: 3, y: 5 },
          ],
        ],
        L: [
          [
            { x: -5, y: -5 },
            { x: -5, y: 5 },
          ],
          [
            { x: -5, y: 5 },
            { x: 5, y: 5 },
          ],
        ],
        M: [
          [
            { x: -5, y: 5 },
            { x: -5, y: -5 },
          ],
          [
            { x: -5, y: -5 },
            { x: 0, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 5, y: -5 },
          ],
          [
            { x: 5, y: -5 },
            { x: 5, y: 5 },
          ],
        ],
        N: [
          [
            { x: -5, y: 5 },
            { x: -5, y: -5 },
          ],
          [
            { x: -5, y: 5 },
            { x: 5, y: -5 },
          ],
          [
            { x: 5, y: -5 },
            { x: 5, y: 5 },
          ],
        ],
        O: [
          [
            { x: -5, y: -5 },
            { x: 5, y: -5 },
          ],
          [
            { x: 5, y: -5 },
            { x: 5, y: 5 },
          ],
          [
            { x: 5, y: 5 },
            { x: -5, y: 5 },
          ],
          [
            { x: -5, y: 5 },
            { x: -5, y: -5 },
          ],
        ],
        P: [
          [
            { x: -5, y: 5 },
            { x: -5, y: -5 },
          ],
          [
            { x: -5, y: -5 },
            { x: 3, y: -5 },
          ],
          [
            { x: 3, y: -5 },
            { x: 5, y: -3 },
          ],
          [
            { x: 5, y: -3 },
            { x: -5, y: -3 },
          ],
        ],
        R: [
          [
            { x: -5, y: 5 },
            { x: -5, y: -5 },
          ],
          [
            { x: -5, y: -5 },
            { x: 3, y: -5 },
          ],
          [
            { x: 3, y: -5 },
            { x: 5, y: -3 },
          ],
          [
            { x: 5, y: -3 },
            { x: -5, y: -3 },
          ],
          [
            { x: -5, y: -3 },
            { x: 5, y: 5 },
          ],
        ],
        S: [
          [
            { x: 5, y: -5 },
            { x: -5, y: -5 },
          ],
          [
            { x: -5, y: -5 },
            { x: -5, y: 0 },
          ],
          [
            { x: -5, y: 0 },
            { x: 5, y: 0 },
          ],
          [
            { x: 5, y: 0 },
            { x: 5, y: 5 },
          ],
          [
            { x: 5, y: 5 },
            { x: -5, y: 5 },
          ],
        ],
        T: [
          [
            { x: -5, y: -5 },
            { x: 5, y: -5 },
          ],
          [
            { x: 0, y: -5 },
            { x: 0, y: 5 },
          ],
        ],
        U: [
          [
            { x: -5, y: -5 },
            { x: -5, y: 3 },
          ],
          [
            { x: -5, y: 3 },
            { x: 5, y: 3 },
          ],
          [
            { x: 5, y: 3 },
            { x: 5, y: -5 },
          ],
        ],
        V: [
          [
            { x: -5, y: -5 },
            { x: 0, y: 5 },
          ],
          [
            { x: 0, y: 5 },
            { x: 5, y: -5 },
          ],
        ],
        Y: [
          [
            { x: -5, y: -5 },
            { x: 0, y: 0 },
          ],
          [
            { x: 5, y: -5 },
            { x: 0, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 0, y: 5 },
          ],
        ],
        Z: [
          [
            { x: -5, y: -5 },
            { x: 5, y: -5 },
          ],
          [
            { x: 5, y: -5 },
            { x: -5, y: 5 },
          ],
          [
            { x: -5, y: 5 },
            { x: 5, y: 5 },
          ],
        ],
        X: [
          [
            { x: -5, y: -5 },
            { x: 5, y: 5 },
          ],
          [
            { x: -5, y: 5 },
            { x: 5, y: -5 },
          ],
        ],
        " ": [],
      }
      function drawText(
        text,
        centerX = 0,
        centerY = 0,
        spacing = 15,
        discStartId = 12,
        scale = 1,
        maxDiscId = 87,
      ) {
        let discId = discStartId
        const upperText = text.toUpperCase()
        const totalWidth = upperText.length * spacing * scale
        const startX = centerX - totalWidth / 4
        let offsetX = 0
        Utils.runAfterGameTick(() => {
          for (const char of text.toUpperCase()) {
            const segments = letterMap[char]
            if (!segments) {
              offsetX += spacing * scale
              continue
            }
            for (const seg of segments) {
              if (discId + 1 > maxDiscId) {
                console.warn("Disc ID limit exceeded.")
                return
              }
              const p1 = seg[0]
              const p2 = seg[1]
              room.setDiscProperties(discId, {
                x: startX + offsetX + p1.x * scale * 0.6,
                y: centerY + p1.y * scale,
              })
              discId++
              room.setDiscProperties(discId, {
                x: startX + offsetX + p2.x * scale * 0.6,
                y: centerY + p2.y * scale,
              })
              discId++
            }
            offsetX += spacing * scale * 0.6
          }
        })
        setTimeout(() => {
          discId = discStartId
          Utils.runAfterGameTick(() => {
            for (const char of text.toUpperCase()) {
              const segments = letterMap[char]
              for (const seg of segments) {
                if (discId + 1 > maxDiscId) {
                  console.warn("Disc ID limit exceeded.")
                  return
                }
                room.setDiscProperties(discId, {
                  x: -1000,
                  y: -1000,
                })
                discId++
                room.setDiscProperties(discId, {
                  x: -1000,
                  y: -1000,
                })
                discId++
              }
            }
          })
        }, 5 * 1000)
      }
      function replaceTurkishChars(text) {
        const map = {
          Ç: "C",
          Ğ: "G",
          İ: "I",
          I: "I",
          Ö: "O",
          Ş: "S",
          Ü: "U",
          ç: "C",
          ğ: "G",
          ı: "I",
          i: "I",
          ö: "O",
          ş: "S",
          ü: "U",
        }
        return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => map[c] || c)
      }
      let testGEgp,
        testGEfirstE = false,
        testGErotationAngle = 0
      function testGoalEffectOrbit() {
        const ps = getTeamCounts(room)
        const rps = ps.red
        const bps = ps.blue
        const centerPlayer = room.getPlayer(testGEgp?.id)
        if (
          !centerPlayer ||
          !centerPlayer.disc?.pos ||
          !centerPlayer.disc?.speed
        )
          return
        const otps = centerPlayer.team.id === Team.RED ? bps : rps
        const gpsx = centerPlayer.disc.speed.x
        const gpsy = centerPlayer.disc.speed.y
        const cx = centerPlayer.disc.pos.x
        const cy = centerPlayer.disc.pos.y
        const radius = 60 * 2
        const rotationSpeed = 0.05
        const angleStep = (2 * Math.PI) / otps.length
        if (!testGEfirstE) {
          testGEfirstE = true
          for (let i = 0; i < otps.length; i++) {
            otps[i].ige = true
            const p = room.getPlayer(otps[i].id)
            if (p) {
              const angle = testGErotationAngle + i * angleStep
              const mx = cx + radius * Math.cos(angle)
              const my = cy + radius * Math.sin(angle)
              room.setPlayerDiscProperties(otps[i].id, { x: mx, y: my })
            }
          }
        } else {
          for (let i = 0; i < otps.length; i++) {
            const p = room.getPlayer(otps[i].id)
            if (p) {
              const angle = testGErotationAngle + i * angleStep
              const dx = Math.cos(angle)
              const dy = Math.sin(angle)
              const tx = -dy
              const ty = dx
              const rx = tx * radius * rotationSpeed
              const ry = ty * radius * rotationSpeed
              room.setPlayerDiscProperties(p.id, {
                xspeed: gpsx + rx,
                yspeed: gpsy + ry,
              })
            }
          }
          testGErotationAngle += rotationSpeed
        }
      }
      function resetTGEO() {
        testGEgp = null
        testGEfirstE = false
        testGErotationAngle = 0
        const ps = getTeamCounts(room)
        const aps = ps.all
        for (let i = 0; i < aps.length; i++) aps[i].ige = false
      }
      room.onTeamGoal = function (team) {
        lastScoredTeam = team
        const ball = room.getBall(true)
        touchState.touchingPlayerId = null
        touchState.touchStartTime = null
        allResetted = true
        resetCurveState() // End the curve effect naturally
        IS_ANY_ACTIVE_EFFECT = false
        const ballSpeed = Math.sqrt(ball.speed.x ** 2 + ball.speed.y ** 2) // Maintain the ball's current speed magnitude
        const elapsedTime = convertSecondsToTime(room.timeElapsed)
        let goalPlayer = room.getPlayer(touchState.lastTouchedPlayerId)
          ? room.getPlayer(touchState.lastTouchedPlayerId)
          : "someone who left room"
        goalPlayer.vip = 5
        goalPlayer.goalT = GOAL_TEXT
        let isOG = goalPlayer?.team?.id !== team
        let checkForAssist = false
        if (
          isOG &&
          touchState.lastKickedPlayerId !== touchState.lastTouchedPlayerId
        ) {
          goalPlayer = room.getPlayer(touchState.lastKickedPlayerId)
            ? room.getPlayer(touchState.lastKickedPlayerId)
            : "someone who left room"
          isOG = goalPlayer ? goalPlayer.team.id !== team : false
          checkForAssist = true
        }
        const speedText = `${(ballSpeed * 12).toFixed(1)} km/h`
        const assistText =
          checkForAssist &&
          touchState.secondLastTouchedPlayerId ===
            touchState.lastKickedPlayerId &&
          touchState.thirdLastTouchedPlayerId
            ? `・(👟 ${touchState.thirdLastTouchedPlayerName})`
            : touchState.secondLastTouchedPlayerId
              ? `・(👟 ${touchState.secondLastTouchedPlayerName})`
              : null
        const goalType = isOG ? "🤡" : "⚽"
        const teamColor = team == Team.RED ? colorRed : colorBlue
        let goalText = isOG ? "scored an own goal!" : "scored a goal!"
        let isOGA = false
        let assistPlayer = null
        if (touchState.secondLastTouchedPlayerId && !isOG) {
          assistPlayer =
            checkForAssist &&
            touchState.secondLastTouchedPlayerId ===
              touchState.lastKickedPlayerId
              ? room.getPlayer(touchState.thirdLastTouchedPlayerId)
              : room.getPlayer(touchState.secondLastTouchedPlayerId)
          if (assistPlayer != null) {
            isOGA = assistPlayer.team.id != team
          }
        }
        const distanceText = `${touchType === 0 ? lastKickedBallDistance.toFixed(1) : lastTouchedBallDistance.toFixed(1)} m`
        const fullGoalText = `${goalType} ${goalPlayer.name} ${goalText} (${elapsedTime})・🚀 (${speedText})${!isOG ? `・(${distanceText})` : ""}${!isOG && !isOGA && assistText ? assistText : ""}`
        room.sendAnnouncement(
          fullGoalText,
          null,
          teamColor,
          "bold",
          NotifSound.MENTION,
        )
        const celebEffectWay = team == 1 ? -1 : 1
        Utils.runAfterGameTick(() => {
          for (i = currentStartDisc; i < currentStartDisc + 3; i++)
            room.setDiscProperties(i, { x: 0, y: 0, xspeed: 0, yspeed: 0 })
          if (ENABLE_BANANA) {
            for (i = currentStartDiscL; i < currentStartDiscL + 3; i++)
              room.setDiscProperties(i, { x: 0, y: 0, xspeed: 0, yspeed: 0 })
          }
          fixedBarFirstVis = false
          fixedBarPowerVis = false
          room.setDiscProperties(0, {
            xgravity: 0,
            ygravity: 0,
            radius: normalBallRadius,
            cGroup: cf.ball,
            damping: 0.99,
          })
          if (goalPlayer) {
            if (goalPlayer.vip && !isOG) {
              if (goalPlayer.vip >= 2) {
                const testGoalText = goalPlayer.goalT
                const testStartDiscId = 12
                const MAX_DISCS = 87
                const allowedChars = Object.keys(letterMap)
                function getDiscCountForChar(char) {
                  if (char === " ") return 0
                  const lines = letterMap[char]
                  return lines ? lines.length * 2 : 0
                }
                function getFittingText(inputText, maxDiscs) {
                  let discTotal = 0
                  let finalText = ""
                  const normalizedText = replaceTurkishChars(
                    inputText.toUpperCase(),
                  )
                  for (let char of normalizedText) {
                    if (char !== " " && !allowedChars.includes(char)) continue
                    const charDiscCount = getDiscCountForChar(char)
                    if (discTotal + charDiscCount > maxDiscs) break
                    finalText += char
                    discTotal += charDiscCount
                  }
                  return finalText
                }
                const filteredText = getFittingText(testGoalText, MAX_DISCS)
                drawText(filteredText, 0, 0, 12, testStartDiscId, 6)
              }
              room.setDiscProperties(0, { radius: 31, color: 0x39e600 })
              room.setPlayerDiscProperties(goalPlayer.id, { radius: 100 })
              const players = room.players.filter(
                (player) => !AFKSet.has(player.id),
              )
              if (!testGE) {
                for (i = 0; i < players.length; i++)
                  room.setPlayerDiscProperties(players[i].id, {
                    xspeed: celebEffectWay * 30,
                  })
              } else {
                testGEgp = goalPlayer
              }
            }
          }
          if (
            touchState.secondLastTouchedPlayerId &&
            assistPlayer !== null &&
            !isOG &&
            !isOGA
          ) {
            if (assistPlayer && assistPlayer.vip >= 2)
              room.setPlayerDiscProperties(assistPlayer.id, { radius: 60 })
          }
        })
        setTimeout(() => {
          resetLastTouchedPlayer()
        }, 1000)
      }
      room.onPlayerInputChange = function (id, value) {
        const player = room.getPlayer(id)
        if (
          player.team.id === 0 ||
          player.auth === "fake-auth-do-not-believe-it"
        )
          return
        if (player.pi === undefined) player.pi = 0
        if (player.rpi === undefined) player.rpi = 0
        const notr = [12, 28, 3, 19, 15, 31]
        if (!notr.includes(player.pi)) player.rpi = player.pi
        player.pi = value
        const now = Date.now()
        const isPressingX = value >= 16
        player.secondLastXPressTimeCanBeNull = player.pressingXStartTime
        if (isPressingX && !player.isSprinting && !player.pressingXStartTime)
          player.pressingXStartTime = now
        else if (player.isSprinting && !isPressingX) {
          player.lastSprintDur = now - player.sprintStartTime
          player.lastSprintTime = now
          player.isSprinting = false
          Utils.runAfterGameTick(() => {
            room.setPlayerDiscProperties(player.id, {
              xgravity: 0,
              ygravity: 0,
            })
          })
          player.sprintStartTime = null
          player.pressingXStartTime = null
          room.setPlayerAvatar(player.id, "⌛", true)
          setTimeout(() => {
            if (player.isSprinting) return
            room.setPlayerAvatar(player.id, "🔋", true)
            setTimeout(() => {
              if (player.isSprinting) return
              if ((!player.vip || !player.ca) && player.pos != 0)
                room.setPlayerAvatar(player.id, String(player.pos), true)
              else if (player.ca)
                room.setPlayerAvatar(player.id, player.ca, true)
              else room.setPlayerAvatar(player.id, player.avatar, true)
            }, 500)
          }, player.lastSprintDur * 5)
        } else if (!isPressingX) player.pressingXStartTime = null
        if (player.pressingXStartTime) {
          if (player.lastXPressTime != player.pressingXStartTime)
            player.secondLastXPressTime = player.lastXPressTime
          player.lastXPressTime = now
        }
      }
      room.onPlayerJoin = async function (player) {
        logPlayerJoin(player)
        await sendJoinAnnouncements(player)
      }
      function logPlayerJoin(player) {
        console.log(
          `\`🟩 F: ${player.flag} | N: ${player.name} joined the room.\``,
        )
      }
      async function sendJoinAnnouncements(player) {
        setTimeout(() => sendAnnoOnJoin(player.id, room), 1000)
        setTimeout(async () => {
          if (!room.getPlayer(player.id)) return
        }, 1600)
      }
      room.onPlayerLeave = async function (player) {
        logPlayerLeave(player)
      }
      function logPlayerLeave(player) {
        console.log(`\`🟥 ${player.name} leaved the room.\``)
      }
      let lastKickedBallDistance
      let lastTouchedBallDistance
      room.onPlayerBallKick = function (playerId) {
        const lastTouchDuration = touchState.lastTouchDuration || 0 // Default to 0 if no touch
        touchState.lastKickedPlayerId = playerId
        const player = room.getPlayer(playerId)
        if (player.auth === "fake-auth-do-not-believe-it") return
        updateLastTouchedPlayer(playerId, room)
        touchState.lastTouchDuration = 0 // Reset touch duration
        if (player.vip) {
          Utils.runAfterGameTick(() => {
            room.setDiscProperties(0, { color: player.colB })
            setTimeout(() => {
              room.setDiscProperties(0, { color: 0xffffff })
            }, 2000)
          })
        } else {
          Utils.runAfterGameTick(() => {
            room.setDiscProperties(0, { color: 0xffffff })
          })
        }
        const ball = room.getBall(true)
        const ballX = ball.pos.x
        const ballY = ball.pos.y
        const ballSpeed = ball.speed
        const ballPos = ball.pos
        const realStadiumWidth = 13
        const dx =
          (player.team.id == Team.RED ? 1 : -1) * realStadiumWidth -
          ballPos.x * (realStadiumWidth / stadiumWidth)
        const dy = 0 - ballPos.y * (realStadiumWidth / stadiumWidth)
        lastKickedBallDistance = Math.sqrt(dx * dx + dy * dy)
        player.tlts = 1
        switch (player.e) {
          case "curve":
            let canPower = false
            if (
              ENABLE_POW_AND_ULTI &&
              lastTouchDuration > powerTimeThreshold + 0.1 &&
              lastTouchDuration < ultiTimeThresholdStart
            )
              canPower = true
            if (
              ENABLE_POW_AND_ULTI &&
              canPower &&
              touchState.lastTouchedPlayerId == playerId &&
              touchState.lastOpenedBarPlayerId == playerId
            ) {
              IS_ANY_ACTIVE_EFFECT = true
              player.tlts = 5
              const powerIntensity = 1 + 0.4
              Utils.runAfterGameTick(() => {
                room.setDiscProperties(0, {
                  xspeed: ballSpeed.x * powerIntensity,
                  yspeed: ballSpeed.y * powerIntensity,
                })
              })
            } else if (
              ENABLE_POW_AND_ULTI &&
              lastTouchDuration > ultiTimeThresholdStart &&
              touchState.lastTouchedPlayerId == playerId &&
              touchState.lastOpenedBarPlayerId == playerId
            ) {
              IS_ANY_ACTIVE_EFFECT = true
              player.tlts = 6
              ultiState.isUlti = true
              ultiState.ultiStartTime = Date.now()
              ultiState.ultiPlayer = touchState.lastTouchedPlayerId
              const powerIntensity =
                1 +
                Math.min(lastTouchDuration * CURVED_SHOT_MULTIPLIER * 0.5, 0.3)
              Utils.runAfterGameTick(() => {
                room.setDiscProperties(0, {
                  xspeed: ballSpeed.x * powerIntensity,
                  yspeed: ballSpeed.y * powerIntensity,
                })
              })
            } else if (
              !canPower &&
              lastTouchDuration > firstTimeThreshold &&
              touchState.lastTouchedPlayerId == playerId &&
              touchState.lastOpenedBarPlayerId == playerId
            ) {
              const curveDirection = calculateCurveEffectDirection(
                { x: ballX, y: ballY, ...ball },
                room.getPlayer(playerId),
              )
              IS_ANY_ACTIVE_EFFECT = true
              player.tlts = 4
              curveState.isCurving = true
              curveState.curveStartTime = Date.now()
              curveState.curveDirection = curveDirection // Store the curve direction
              curveState.curveIntensity = Math.min(
                lastTouchDuration * CURVED_SHOT_MULTIPLIER * 0.9,
                0.8,
              ) // Scale intensity by touch duration
              const powerIntensity =
                1 +
                Math.min(lastTouchDuration * CURVED_SHOT_MULTIPLIER * 0.6, 0.6)
              Utils.runAfterGameTick(() => {
                room.setDiscProperties(0, {
                  xspeed: ballSpeed.x * powerIntensity,
                  yspeed: ballSpeed.y * powerIntensity,
                })
              })
            } else {
              resetCurveState()
              resetUltiState()
              IS_ANY_ACTIVE_EFFECT = false
              Utils.runAfterGameTick(() => {
                room.setDiscProperties(0, {
                  xgravity: 0,
                  ygravity: 0,
                  radius: normalBallRadius,
                  cGroup: cf.ball,
                  damping: 0.99,
                })
              })
            }
            break
          case "lob":
            let canCurve = false
            if (
              ENABLE_BANANA &&
              lastTouchDuration > powerLobTimeThreshold + 0.1
            )
              canCurve = true
            if (
              ENABLE_BANANA &&
              canCurve &&
              touchState.lastTouchedPlayerId == playerId &&
              touchState.lastOpenedBarPlayerId == playerId
            ) {
              const curveDirection = calculateCurveEffectDirection(
                { x: ballX, y: ballY, ...ball },
                room.getPlayer(playerId),
              )
              IS_ANY_ACTIVE_EFFECT = true
              player.tlts = 7
              lobShotState.lobShotStartTime = Date.now()
              lobShotState.isLobShot = true
              curveState.isCurving = true
              curveState.curveStartTime = Date.now()
              curveState.curveDirection = curveDirection // Store the curve direction
              curveState.curveIntensity = Math.min(
                lastTouchDuration * CURVED_SHOT_MULTIPLIER * 0.8,
                0.7,
              ) // Scale intensity by touch duration
              const powerIntensity =
                0.4 +
                Math.min(lastTouchDuration * CURVED_SHOT_MULTIPLIER * 0.8, 0.7)
              Utils.runAfterGameTick(() => {
                room.setDiscProperties(0, {
                  xspeed: ballSpeed.x * powerIntensity,
                  yspeed: ballSpeed.y * powerIntensity,
                })
              })
            } else if (
              lastTouchDuration > firstTimeThreshold &&
              touchState.lastTouchedPlayerId == playerId
            ) {
              IS_ANY_ACTIVE_EFFECT = true
              player.tlts = 3
              lobShotState.lobShotStartTime = Date.now()
              lobShotState.isLobShot = true
              if (ENABLE_BANANA) {
                const powerIntensity =
                  0.7 +
                  Math.min(
                    lastTouchDuration * CURVED_SHOT_MULTIPLIER * 0.8,
                    0.7,
                  )
                Utils.runAfterGameTick(() => {
                  room.setDiscProperties(0, {
                    xspeed: ballSpeed.x * powerIntensity,
                    yspeed: ballSpeed.y * powerIntensity,
                  })
                })
              }
            } else {
              resetLobShotState()
              IS_ANY_ACTIVE_EFFECT = false
              Utils.runAfterGameTick(() => {
                room.setDiscProperties(0, {
                  xgravity: 0,
                  ygravity: 0,
                  radius: normalBallRadius,
                  cGroup: cf.ball,
                  damping: 0.99,
                })
              })
            }
            break
          case "none":
            const team = ballSpeed.x <= 0 ? Team.RED : Team.BLUE
            const isPAtCorrectPos = true
            const goals = room.stadium.goals
            if (!goals) return
            const goal = goals.filter((g) => g.team.id === team)[0].p0
            const goalX = goal.x
            const shotGap = 175
            const goalYBottom = Math.abs(goal.y) + shotGap
            const goalYTop = -Math.abs(goal.y) - shotGap
            const tNone = (goalX - ballX) / ballSpeed.x
            const predictedYNone = ballY + ballSpeed.y * tNone
            const isShotNone =
              predictedYNone <= goalYBottom && predictedYNone >= goalYTop
            if (
              isPAtCorrectPos &&
              player.team.id !== team &&
              isShotNone &&
              lastTouchDuration > firstTimeThreshold &&
              touchState.lastTouchedPlayerId == playerId
            ) {
              player.tlts = 2
              const aps = room.players.filter((p) => !AFKSet.has(p.id))
              const powerIntensityRAW = aps.length > 9 ? 1.8 : 1.45
              const powerIntensity =
                powerIntensityRAW +
                Math.min(lastTouchDuration * CURVED_SHOT_MULTIPLIER * 0.8, 0.7)
              Utils.runAfterGameTick(() => {
                room.setDiscProperties(0, {
                  xspeed: ballSpeed.x * powerIntensity,
                  yspeed: ballSpeed.y * powerIntensity,
                })
              })
            }
          default:
            break
        }
      } // Check if the ball (discId 0) collided with a segment
      room.onAfterCollisionDiscVsSegment = (
        discId,
        discPlayerId,
        segmentId,
      ) => {
        if (
          discId === 0 &&
          segmentId !== null &&
          ((curveState.isCurving && !lobShotState.isLobShot) ||
            ultiState.isUlti)
        )
          IS_ANY_ACTIVE_EFFECT = false
        const aps = room.players.filter((p) => !AFKSet.has(p.id))
        if (
          discId === 0 &&
          (segmentId === 12 || segmentId === 13) &&
          lobShotState.isLobShot
        ) {
          room.sendAnnouncement(
            `${emojiInfo} TOP ÜST DİREKTE PATLADI.`,
            null,
            colorInfo,
            "small",
            NotifSound.MENTION,
          )
        }
      }
      room.onCollisionDiscVsDisc = (
        discId1,
        discPlayerId1,
        discId2,
        discPlayerId2,
      ) => {
        if (discId1 !== 0 && discId2 !== 0) return // Ignore collisions not involving the ball
        const isBallFirst = discId1 === 0 // Determine which disc is the ball and which is the player
        const playerId = isBallFirst ? discPlayerId2 : discPlayerId1
        if (room.getPlayer(playerId)) {
          updateLastTouchedPlayer(playerId, room)
          if (touchState.lastTouchDuration < firstTimeThreshold)
            IS_ANY_ACTIVE_EFFECT = false // Reset active effects if the touch duration is too short
          const player = room.getPlayer(playerId)
          if (player.isSliding) player.lbkt = Date.now()
          const ball = room.getBall(true)
          const ballPos = ball.pos
          const dx =
            (player.team.id == Team.RED ? 1 : -1) *
              (stadiumWidth * (20 / 900)) -
            ballPos.x * (20 / 900)
          const dy = 0 - ballPos.y * (20 / 900)
          lastTouchedBallDistance = Math.sqrt(dx * dx + dy * dy)
        }
      }
      room.onGameStop = function () {
        touchState.touchingPlayerId = null
        touchState.touchStartTime = null
        touchState.lastOpenedBarPlayerId = null
        touchState.lastKickedPlayerId = null
        Utils.runAfterGameTick(() => {
          for (i = currentStartDisc; i < currentStartDisc + 3; i++)
            room.setDiscProperties(i, { x: 0, y: 0, xspeed: 0, yspeed: 0 })
          if (ENABLE_BANANA) {
            for (i = currentStartDiscL; i < currentStartDiscL + 3; i++)
              room.setDiscProperties(i, { x: 0, y: 0, xspeed: 0, yspeed: 0 })
          }
        })
        fixedBarFirstVis = false
        fixedBarPowerVis = false
        allResetted = true
        resetCurveState() // End the curve effect naturally
        resetLobShotState()
        resetUltiState()
        resetTGEO()
        firstSlideLineTime = null
        secondSlideLineTime = null
        firstSprayLineTime = null
        secondSprayLineTime = null
        IS_ANY_ACTIVE_EFFECT = false
        Utils.runAfterGameTick(() => {
          room.setDiscProperties(0, {
            xgravity: 0,
            ygravity: 0,
            color: 0xffffff,
            radius: normalBallRadius,
            cGroup: cf.ball,
            damping: 0.99,
          })
        })
      }
      room.onGameStart = async function () {
        shot = [0, 0, 0, 0]
        goals = []
        outOfBoundsTime = 0
        ballOutTime = null
        isBallOut = false
        firstSlideLineTime = null
        secondSlideLineTime = null
        firstSprayLineTime = null
        secondSprayLineTime = null
        resetSSS(room) // Handle player resets
        isPausedNow = false
        lastScoredTeam = null
      }
      room.onPositionsReset = function () {
        touchState.touchingPlayerId = null // Reset touch state and effects
        touchState.touchStartTime = null
        setTimeout(() => resetLastTouchedPlayer(), 1000)
        resetTGEO()
        Utils.runAfterGameTick(() => {
          for (let i = currentStartDisc; i < currentStartDisc + 3; i++) {
            room.setDiscProperties(i, { x: 0, y: 0, xspeed: 0, yspeed: 0 }) // Handle bar visibility
          }
          if (ENABLE_BANANA) {
            for (let i = currentStartDiscL; i < currentStartDiscL + 3; i++) {
              room.setDiscProperties(i, { x: 0, y: 0, xspeed: 0, yspeed: 0 })
            }
          }
        })
        fixedBarFirstVis = false
        fixedBarPowerVis = false
        allResetted = true // Reset game state flags
        resetCurveState()
        IS_ANY_ACTIVE_EFFECT = false
        Utils.runAfterGameTick(() => {
          room.setDiscProperties(0, {
            color: 0xffffff, // Reset ball properties
            xgravity: 0,
            ygravity: 0,
            radius: normalBallRadius,
            cGroup: cf.ball,
            damping: 0.99,
          })
        })
      }
      room.onGameTick = async function () {
        const lastTouchPObj =
          room.getPlayer(touchState.lastTouchedPlayerId) || null
        if (lastTouchPObj) {
          const ball = room.getBall()
          touchType = isClosestPlayerTouchingBall(ball.pos, lastTouchPObj.disc)
        } else touchType = null
        if (touchType)
          handleTouchState(room, touchState.lastTouchedPlayerId) // Optimized touch state handling
        else if (!allResetted && lastTouchPObj) {
          resetTouchState(room)
          touchState.lastTouchDuration = 0
          touchType = null
        }
        if (curveState.isCurving) handleCurveState(room) // Optimized curve state handling and Optimized disc color reset at below
        if (ultiState.isUlti) handleUltiState(room) // Optimized curve state handling and Optimized disc color reset at below
        if (lobShotState.isLobShot) handleLobShotState(room) // Optimized curve state handling and Optimized disc color reset at below
        if (ENABLE_SPRINT_AND_SLIDE) {
          const ps = room.players.filter((p) => p.team.id !== Team.SPECTATORS)
          ps.filter((p) => p.isSprinting).forEach((p) =>
            handleSprintState(p, room),
          )
          ps.filter((p) => !p.isSprinting).forEach((p) =>
            handleKickState(p, room),
          )
          ps.filter((p) => p.isSlideFriction).forEach((p) =>
            handleSlideFriction(p, room),
          )
        }
        if (testGEgp != null) testGoalEffectOrbit()
        if (parseInt(process.argv[3]) !== 1) return
        const ps = room.players.filter((p) => p.ib || p.ipb || p.ige)
        if (ps) ps.forEach((p) => room.fakeSendPlayerInput(0, p.id))
      }
    },
  },
)
/*
    ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
    ║                                            R O O M     E N D                                             ║
    ╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
