# Flesh and Blood additional-cost card inventory

_Snapshot generated from authored card modules on 2026-09-13._

## Scope and classification

- Source: `packages/cards/src/cards/index.ts` and each exported card's authored `base.abilities` / `base.keywords`.
- Optional means an authored additional-cost play effect has `optional: true`, or the card has the Boost, Fusion, Scrap, or Beat Chest keyword. Those keywords are optional additional costs under CR 8.3.9, 8.3.17, 8.3.32, and 8.3.33.
- Mandatory means an authored additional-cost play effect does not have `optional: true`. A mixed or alternative payment shape can still be mandatory even when the player chooses how to pay it.
- CR 5.1.3b requires optional additional costs to be declared while playing the card; CR 5.4.4a defines an additional-cost ability as optional when its cost uses “may.”
- Crank and Heave are excluded: they are optional abilities, but the Comprehensive Rules do not classify them as additional costs.
- This is an implementation inventory, not a claim about every printed FAB card. Cards not yet represented by authored executable definitions are outside this snapshot.

## Summary

| Classification                       | Unique card names | Pitch-specific identities |
| ------------------------------------ | ----------------: | ------------------------: |
| Optional additional cost             |               134 |                       320 |
| Mandatory additional cost            |                50 |                        98 |
| Both classifications on one identity |                 0 |                         0 |

Pitch variants use R = red, Y = yellow, B = blue, and — = no pitch color.

## Optional additional costs

### Beat Chest — optionally discard a card with 6 or more power

| Card                | Pitch variants | Slugs                                                                               |
| ------------------- | -------------- | ----------------------------------------------------------------------------------- |
| Assault And Battery | R/Y/B          | `assault-and-battery-blue`, `assault-and-battery-red`, `assault-and-battery-yellow` |
| Bare Destruction    | R              | `bare-destruction-red`                                                              |
| Bare Swing          | R/Y            | `bare-swing-red`, `bare-swing-yellow`                                               |
| Bonebreaker Bellow  | R/Y/B          | `bonebreaker-bellow-blue`, `bonebreaker-bellow-red`, `bonebreaker-bellow-yellow`    |
| Pound Town          | R/Y/B          | `pound-town-blue`, `pound-town-red`, `pound-town-yellow`                            |
| Rawhide Rumble      | R/Y/B          | `rawhide-rumble-blue`, `rawhide-rumble-red`, `rawhide-rumble-yellow`                |
| Smell Fear          | Y/B            | `smell-fear-blue`, `smell-fear-yellow`                                              |

### Boost — optionally banish the top card of the deck

| Card                 | Pitch variants | Slugs                                                                                  |
| -------------------- | -------------- | -------------------------------------------------------------------------------------- |
| Big Bertha           | R/Y/B          | `big-bertha-blue`, `big-bertha-red`, `big-bertha-yellow`                               |
| Blast Rig            | R              | `blast-rig-red`                                                                        |
| Bull Bar             | R/Y/B          | `bull-bar-blue`, `bull-bar-red`, `bull-bar-yellow`                                     |
| Combustible Courier  | R/Y/B          | `combustible-courier-blue`, `combustible-courier-red`, `combustible-courier-yellow`    |
| Crankshaft           | R/Y/B          | `crankshaft-blue`, `crankshaft-red`, `crankshaft-yellow`                               |
| Data Link            | R/Y/B          | `data-link-blue`, `data-link-red`, `data-link-yellow`                                  |
| Dive Through Data    | R/Y/B          | `dive-through-data-blue`, `dive-through-data-red`, `dive-through-data-yellow`          |
| Dumpster Dive        | R/Y/B          | `dumpster-dive-blue`, `dumpster-dive-red`, `dumpster-dive-yellow`                      |
| Expedite             | R/Y/B          | `expedite-blue`, `expedite-red`, `expedite-yellow`                                     |
| Fast And Furious     | R              | `fast-and-furious-red`                                                                 |
| Fender Bender        | R/Y/B          | `fender-bender-blue`, `fender-bender-red`, `fender-bender-yellow`                      |
| Full Tilt            | R/Y/B          | `full-tilt-blue`, `full-tilt-red`, `full-tilt-yellow`                                  |
| Gas Guzzler          | R/Y/B          | `gas-guzzler-blue`, `gas-guzzler-red`, `gas-guzzler-yellow`                            |
| Heart Wrencher       | R/Y/B          | `heart-wrencher-blue`, `heart-wrencher-red`, `heart-wrencher-yellow`                   |
| Heavy Metal Hardcore | R/Y/B          | `heavy-metal-hardcore-blue`, `heavy-metal-hardcore-red`, `heavy-metal-hardcore-yellow` |
| Heist                | R              | `heist-red`                                                                            |
| High Speed Impact    | R/Y/B          | `high-speed-impact-blue`, `high-speed-impact-red`, `high-speed-impact-yellow`          |
| Jump Start           | R/Y/B          | `jump-start-blue`, `jump-start-red`, `jump-start-yellow`                               |
| Lay Waste            | R/Y/B          | `lay-waste-blue`, `lay-waste-red`, `lay-waste-yellow`                                  |
| Metex                | R/Y/B          | `metex-blue`, `metex-red`, `metex-yellow`                                              |
| Out Pace             | R/Y/B          | `out-pace-blue`, `out-pace-red`, `out-pace-yellow`                                     |
| Over Loop            | R/Y/B          | `over-loop-blue`, `over-loop-red`, `over-loop-yellow`                                  |
| Panel Beater         | R/Y/B          | `panel-beater-blue`, `panel-beater-red`, `panel-beater-yellow`                         |
| Pedal To The Metal   | R/Y/B          | `pedal-to-the-metal-blue`, `pedal-to-the-metal-red`, `pedal-to-the-metal-yellow`       |
| Pulsewave Harpoon    | R              | `pulsewave-harpoon-red`                                                                |
| Razzle Dazzle        | R/Y/B          | `razzle-dazzle-blue`, `razzle-dazzle-red`, `razzle-dazzle-yellow`                      |
| Rev Up               | R/Y/B          | `rev-up-blue`, `rev-up-red`, `rev-up-yellow`                                           |
| Scramble Pulse       | R/Y/B          | `scramble-pulse-blue`, `scramble-pulse-red`, `scramble-pulse-yellow`                   |
| Spring A Leak        | R/Y/B          | `spring-a-leak-blue`, `spring-a-leak-red`, `spring-a-leak-yellow`                      |
| Sprocket Rocket      | R/Y/B          | `sprocket-rocket-blue`, `sprocket-rocket-red`, `sprocket-rocket-yellow`                |
| Steel Street Hoons   | B              | `steel-street-hoons-blue`                                                              |
| T Bone               | R/Y/B          | `t-bone-blue`, `t-bone-red`, `t-bone-yellow`                                           |
| Teklo Trebuchet 2000 | B              | `teklo-trebuchet-2000-blue`                                                            |
| Throttle             | R/Y/B          | `throttle-blue`, `throttle-red`, `throttle-yellow`                                     |
| Twin Drive           | R              | `twin-drive-red`                                                                       |
| Under Loop           | R/Y/B          | `under-loop-blue`, `under-loop-red`, `under-loop-yellow`                               |
| Zero To Fifty        | R/Y/B          | `zero-to-fifty-blue`, `zero-to-fifty-red`, `zero-to-fifty-yellow`                      |
| Zero To Sixty        | R/Y/B          | `zero-to-sixty-blue`, `zero-to-sixty-red`, `zero-to-sixty-yellow`                      |
| Zipper Hit           | R/Y/B          | `zipper-hit-blue`, `zipper-hit-red`, `zipper-hit-yellow`                               |
| Zoom In              | R/Y/B          | `zoom-in-blue`, `zoom-in-red`, `zoom-in-yellow`                                        |

### Fusion — optionally reveal the required Elemental card(s) from hand

| Card                    | Pitch variants | Slugs                                                                                        |
| ----------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| Aether Icevein          | R/Y/B          | `aether-icevein-blue`, `aether-icevein-red`, `aether-icevein-yellow`                         |
| Arcanic Shockwave       | R/Y/B          | `arcanic-shockwave-blue`, `arcanic-shockwave-red`, `arcanic-shockwave-yellow`                |
| Awakening               | B              | `awakening-blue`                                                                             |
| Biting Gale             | R/Y/B          | `biting-gale-blue`, `biting-gale-red`, `biting-gale-yellow`                                  |
| Blizzard Bolt           | R/Y/B          | `blizzard-bolt-blue`, `blizzard-bolt-red`, `blizzard-bolt-yellow`                            |
| Blossoming Spellblade   | R              | `blossoming-spellblade-red`                                                                  |
| Brain Freeze            | R/Y/B          | `brain-freeze-blue`, `brain-freeze-red`, `brain-freeze-yellow`                               |
| Bramble Spark           | R/Y/B          | `bramble-spark-blue`, `bramble-spark-red`, `bramble-spark-yellow`                            |
| Buzz Bolt               | R/Y/B          | `buzz-bolt-blue`, `buzz-bolt-red`, `buzz-bolt-yellow`                                        |
| Chilling Icevein        | R/Y/B          | `chilling-icevein-blue`, `chilling-icevein-red`, `chilling-icevein-yellow`                   |
| Cold Wave               | R/Y/B          | `cold-wave-blue`, `cold-wave-red`, `cold-wave-yellow`                                        |
| Dazzling Crescendo      | R/Y/B          | `dazzling-crescendo-blue`, `dazzling-crescendo-red`, `dazzling-crescendo-yellow`             |
| Emerging Avalanche      | R/Y/B          | `emerging-avalanche-blue`, `emerging-avalanche-red`, `emerging-avalanche-yellow`             |
| Encase                  | R              | `encase-red`                                                                                 |
| Endless Winter          | R              | `endless-winter-red`                                                                         |
| Entangle                | R/Y/B          | `entangle-blue`, `entangle-red`, `entangle-yellow`                                           |
| Entwine Earth           | R/Y/B          | `entwine-earth-blue`, `entwine-earth-red`, `entwine-earth-yellow`                            |
| Entwine Ice             | R/Y/B          | `entwine-ice-blue`, `entwine-ice-red`, `entwine-ice-yellow`                                  |
| Entwine Lightning       | R/Y/B          | `entwine-lightning-blue`, `entwine-lightning-red`, `entwine-lightning-yellow`                |
| Explosive Growth        | R/Y/B          | `explosive-growth-blue`, `explosive-growth-red`, `explosive-growth-yellow`                   |
| Exposed To The Elements | B              | `exposed-to-the-elements-blue`                                                               |
| Flake Out               | R/Y/B          | `flake-out-blue`, `flake-out-red`, `flake-out-yellow`                                        |
| Flashfreeze             | R              | `flashfreeze-red`                                                                            |
| Flicker Wisp            | Y              | `flicker-wisp-yellow`                                                                        |
| Force Of Nature         | B              | `force-of-nature-blue`                                                                       |
| Frazzle                 | R/Y/B          | `frazzle-blue`, `frazzle-red`, `frazzle-yellow`                                              |
| Freezing Point          | R              | `freezing-point-red`                                                                         |
| Frost Lock              | B              | `frost-lock-blue`                                                                            |
| Frozen To Death         | B              | `frozen-to-death-blue`                                                                       |
| Fulminate               | Y              | `fulminate-yellow`                                                                           |
| Glacial Footsteps       | R/Y/B          | `glacial-footsteps-blue`, `glacial-footsteps-red`, `glacial-footsteps-yellow`                |
| Ice Eternal             | B              | `ice-eternal-blue`                                                                           |
| Ice Storm               | R              | `ice-storm-red`                                                                              |
| Icebind                 | R/Y/B          | `icebind-blue`, `icebind-red`, `icebind-yellow`                                              |
| Inspire Lightning       | R/Y/B          | `inspire-lightning-blue`, `inspire-lightning-red`, `inspire-lightning-yellow`                |
| Light It Up             | Y              | `light-it-up-yellow`                                                                         |
| Mulch                   | R/Y/B          | `mulch-blue`, `mulch-red`, `mulch-yellow`                                                    |
| Oaken Old               | R              | `oaken-old-red`                                                                              |
| Polar Cap               | R/Y/B          | `polar-cap-blue`, `polar-cap-red`, `polar-cap-yellow`                                        |
| Rites Of Lightning      | R/Y/B          | `rites-of-lightning-blue`, `rites-of-lightning-red`, `rites-of-lightning-yellow`             |
| Rites Of Replenishment  | R/Y/B          | `rites-of-replenishment-blue`, `rites-of-replenishment-red`, `rites-of-replenishment-yellow` |
| Sigil Of Permafrost     | R/Y/B          | `sigil-of-permafrost-blue`, `sigil-of-permafrost-red`, `sigil-of-permafrost-yellow`          |
| Snap Shot               | R/Y/B          | `snap-shot-blue`, `snap-shot-red`, `snap-shot-yellow`                                        |
| Snow Under              | R/Y/B          | `snow-under-blue`, `snow-under-red`, `snow-under-yellow`                                     |
| Stir The Wildwood       | R/Y/B          | `stir-the-wildwood-blue`, `stir-the-wildwood-red`, `stir-the-wildwood-yellow`                |
| Strength Of Sequoia     | R/Y/B          | `strength-of-sequoia-blue`, `strength-of-sequoia-red`, `strength-of-sequoia-yellow`          |
| Succumb To Winter       | R/Y/B          | `succumb-to-winter-blue`, `succumb-to-winter-red`, `succumb-to-winter-yellow`                |
| Turn Timber             | R/Y/B          | `turn-timber-blue`, `turn-timber-red`, `turn-timber-yellow`                                  |
| Vela Flash              | R/Y/B          | `vela-flash-blue`, `vela-flash-red`, `vela-flash-yellow`                                     |

### Optionally banish a card from hand

| Card                | Pitch variants | Slugs                                                                               |
| ------------------- | -------------- | ----------------------------------------------------------------------------------- |
| Consuming Aftermath | R/Y/B          | `consuming-aftermath-blue`, `consuming-aftermath-red`, `consuming-aftermath-yellow` |

### Optionally banish a card matching the power restriction from graveyard

| Card                | Pitch variants | Slugs                                                                               |
| ------------------- | -------------- | ----------------------------------------------------------------------------------- |
| Looking For A Scrap | R/Y/B          | `looking-for-a-scrap-blue`, `looking-for-a-scrap-red`, `looking-for-a-scrap-yellow` |

### Optionally banish a card named Nimblism from graveyard

| Card          | Pitch variants | Slugs                                                             |
| ------------- | -------------- | ----------------------------------------------------------------- |
| Nimble Strike | R/Y/B          | `nimble-strike-blue`, `nimble-strike-red`, `nimble-strike-yellow` |

### Optionally banish a card named Phoenix Flame from graveyard

| Card      | Pitch variants | Slugs           |
| --------- | -------------- | --------------- |
| Burn Away | R              | `burn-away-red` |

### Optionally banish a card named Sloggism from graveyard

| Card               | Pitch variants | Slugs                                                                            |
| ------------------ | -------------- | -------------------------------------------------------------------------------- |
| Regurgitating Slog | R/Y/B          | `regurgitating-slog-blue`, `regurgitating-slog-red`, `regurgitating-slog-yellow` |

### Optionally banish a card with blood-debt from hand

| Card            | Pitch variants | Slugs                  |
| --------------- | -------------- | ---------------------- |
| Shadow Of Ursur | B              | `shadow-of-ursur-blue` |

### Optionally charge a card

| Card                 | Pitch variants | Slugs                                                                         |
| -------------------- | -------------- | ----------------------------------------------------------------------------- |
| Beaming Bravado      | R/Y/B          | `beaming-bravado-blue`, `beaming-bravado-red`, `beaming-bravado-yellow`       |
| Beckoning Light      | R              | `beckoning-light-red`                                                         |
| Bolt Of Courage      | R/Y/B          | `bolt-of-courage-blue`, `bolt-of-courage-red`, `bolt-of-courage-yellow`       |
| Bravery Of The Blade | R              | `bravery-of-the-blade-red`                                                    |
| Cross The Line       | R/Y/B          | `cross-the-line-blue`, `cross-the-line-red`, `cross-the-line-yellow`          |
| Engulfing Light      | R/Y/B          | `engulfing-light-blue`, `engulfing-light-red`, `engulfing-light-yellow`       |
| Express Lightning    | R/Y/B          | `express-lightning-blue`, `express-lightning-red`, `express-lightning-yellow` |
| Glaring Impact       | R/Y/B          | `glaring-impact-blue`, `glaring-impact-red`, `glaring-impact-yellow`          |
| Light The Way        | R/Y/B          | `light-the-way-blue`, `light-the-way-red`, `light-the-way-yellow`             |
| Saving Grace         | Y              | `saving-grace-yellow`                                                         |
| Spirit Of War        | R              | `spirit-of-war-red`                                                           |
| Take Flight          | R/Y/B          | `take-flight-blue`, `take-flight-red`, `take-flight-yellow`                   |

### Optionally charge any number of cards

| Card              | Pitch variants | Slugs                      |
| ----------------- | -------------- | -------------------------- |
| V Of The Vanguard | Y              | `v-of-the-vanguard-yellow` |

### Optionally destroy a card named Gold

| Card           | Pitch variants | Slugs                   |
| -------------- | -------------- | ----------------------- |
| The Golden Son | Y              | `the-golden-son-yellow` |

### Optionally destroy any number of cards matching the printed restriction

| Card                    | Pitch variants | Slugs                         |
| ----------------------- | -------------- | ----------------------------- |
| Cash Out                | B              | `cash-out-blue`               |
| Knick Knack Bric A Brac | R              | `knick-knack-bric-a-brac-red` |

### Optionally pay 1 resource

| Card | Pitch variants | Slugs                                  |
| ---- | -------------- | -------------------------------------- |
| Hurl | R/Y/B          | `hurl-blue`, `hurl-red`, `hurl-yellow` |

### Optionally pay 3 resources

| Card           | Pitch variants | Slugs                |
| -------------- | -------------- | -------------------- |
| Barbed Barrage | R              | `barbed-barrage-red` |

### Optionally pay 4 resources

| Card             | Pitch variants | Slugs                                                                      |
| ---------------- | -------------- | -------------------------------------------------------------------------- |
| Staunch Response | R/Y/B          | `staunch-response-blue`, `staunch-response-red`, `staunch-response-yellow` |

### Optionally pay X resources

| Card         | Pitch variants | Slugs               |
| ------------ | -------------- | ------------------- |
| Lord Of Wind | B              | `lord-of-wind-blue` |

### Optionally put a card from hand on top of the deck

| Card         | Pitch variants | Slugs                                                          |
| ------------ | -------------- | -------------------------------------------------------------- |
| Seek Horizon | R/Y/B          | `seek-horizon-blue`, `seek-horizon-red`, `seek-horizon-yellow` |

### Optionally reveal a card matching the printed restriction from hand

| Card     | Pitch variants | Slugs                                              |
| -------- | -------------- | -------------------------------------------------- |
| Belittle | R/Y/B          | `belittle-blue`, `belittle-red`, `belittle-yellow` |

### Optionally reveal all cards matching the type restriction from hand

| Card               | Pitch variants | Slugs                     |
| ------------------ | -------------- | ------------------------- |
| Rouse The Ancients | B              | `rouse-the-ancients-blue` |

### Scrap — optionally banish an item or equipment from the graveyard

| Card               | Pitch variants | Slugs                                                                      |
| ------------------ | -------------- | -------------------------------------------------------------------------- |
| Crash Site Salvage | Y              | `crash-site-salvage-yellow`                                                |
| Hydraulic Press    | R/Y/B          | `hydraulic-press-blue`, `hydraulic-press-red`, `hydraulic-press-yellow`    |
| Junkyard Dogg      | R/Y/B          | `junkyard-dogg-blue`, `junkyard-dogg-red`, `junkyard-dogg-yellow`          |
| Scrap Compactor    | R/Y/B          | `scrap-compactor-blue`, `scrap-compactor-red`, `scrap-compactor-yellow`    |
| Scrap Harvester    | R/Y/B          | `scrap-harvester-blue`, `scrap-harvester-red`, `scrap-harvester-yellow`    |
| Scrap Hopper       | R/Y/B          | `scrap-hopper-blue`, `scrap-hopper-red`, `scrap-hopper-yellow`             |
| Scrap Prospector   | R/Y/B          | `scrap-prospector-blue`, `scrap-prospector-red`, `scrap-prospector-yellow` |
| Scrap Trader       | R              | `scrap-trader-red`                                                         |
| Speed Demon        | R              | `speed-demon-red`                                                          |

## Mandatory additional costs

### banish 3 cards from graveyard

| Card                                 | Pitch variants | Slugs                                                                                                                                  |
| ------------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Boneyard Marauder                    | R/Y/B          | `boneyard-marauder-blue`, `boneyard-marauder-red`, `boneyard-marauder-yellow`                                                          |
| Convulsions From The Bellows Of Hell | R/Y/B          | `convulsions-from-the-bellows-of-hell-blue`, `convulsions-from-the-bellows-of-hell-red`, `convulsions-from-the-bellows-of-hell-yellow` |
| Dread Screamer                       | R/Y/B          | `dread-screamer-blue`, `dread-screamer-red`, `dread-screamer-yellow`                                                                   |
| Endless Maw                          | R/Y/B          | `endless-maw-blue`, `endless-maw-red`, `endless-maw-yellow`                                                                            |
| Hungering Slaughterbeast             | R/Y/B          | `hungering-slaughterbeast-blue`, `hungering-slaughterbeast-red`, `hungering-slaughterbeast-yellow`                                     |
| Shadowrealm Horror                   | R              | `shadowrealm-horror-red`                                                                                                               |
| Unworldly Bellow                     | R/Y/B          | `unworldly-bellow-blue`, `unworldly-bellow-red`, `unworldly-bellow-yellow`                                                             |
| Writhing Beast Hulk                  | R/Y/B          | `writhing-beast-hulk-blue`, `writhing-beast-hulk-red`, `writhing-beast-hulk-yellow`                                                    |

### banish 3 cards from soul

| Card                | Pitch variants | Slugs                        |
| ------------------- | -------------- | ---------------------------- |
| Celestial Cataclysm | Y              | `celestial-cataclysm-yellow` |

### banish 6 cards from graveyard

| Card         | Pitch variants | Slugs               |
| ------------ | -------------- | ------------------- |
| Soul Harvest | B              | `soul-harvest-blue` |

### banish a card from hand

| Card                           | Pitch variants | Slugs                                                                                                                |
| ------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------- |
| Elemental Strike               | R              | `elemental-strike-red`                                                                                               |
| Expendable Limbs               | B              | `expendable-limbs-blue`                                                                                              |
| Harbinger Of Destruction       | R              | `harbinger-of-destruction-red`                                                                                       |
| Ram Raider                     | R/Y/B          | `ram-raider-blue`, `ram-raider-red`, `ram-raider-yellow`                                                             |
| Shaden Scream                  | R/Y/B          | `shaden-scream-blue`, `shaden-scream-red`, `shaden-scream-yellow`                                                    |
| Shaden Swing                   | R/Y/B          | `shaden-swing-blue`, `shaden-swing-red`, `shaden-swing-yellow`                                                       |
| Tribute To Demolition          | R/Y/B          | `tribute-to-demolition-blue`, `tribute-to-demolition-red`, `tribute-to-demolition-yellow`                            |
| Tribute To The Legions Of Doom | R/Y/B          | `tribute-to-the-legions-of-doom-blue`, `tribute-to-the-legions-of-doom-red`, `tribute-to-the-legions-of-doom-yellow` |

### banish all cards from hand

| Card                  | Pitch variants | Slugs                        |
| --------------------- | -------------- | ---------------------------- |
| Blood Dripping Frenzy | B              | `blood-dripping-frenzy-blue` |

### banish any number of cards matching the power restriction from hand

| Card    | Pitch variants | Slugs         |
| ------- | -------------- | ------------- |
| No Fear | R              | `no-fear-red` |

### banish X cards from soul

| Card              | Pitch variants | Slugs                      |
| ----------------- | -------------- | -------------------------- |
| Beacon Of Victory | Y              | `beacon-of-victory-yellow` |

### banish X cards matching the type restriction from graveyard

| Card           | Pitch variants | Slugs                 |
| -------------- | -------------- | --------------------- |
| Hyper Scrapper | B              | `hyper-scrapper-blue` |

### choose one of: destroy a card matching the type restriction; discard a card matching the type restriction

| Card             | Pitch variants | Slugs                  |
| ---------------- | -------------- | ---------------------- |
| Tome Of Necrosis | R              | `tome-of-necrosis-red` |

### destroy X cards named Gold

| Card                   | Pitch variants | Slugs                         |
| ---------------------- | -------------- | ----------------------------- |
| Raise An Army          | Y              | `raise-an-army-yellow`        |
| Visit The Golden Anvil | B              | `visit-the-golden-anvil-blue` |

### destroy X cards named Hyper Driver

| Card     | Pitch variants | Slugs             |
| -------- | -------------- | ----------------- |
| Moonshot | Y              | `moonshot-yellow` |

### destroy X cards named Runechant

| Card            | Pitch variants | Slugs                  |
| --------------- | -------------- | ---------------------- |
| Sonata Dystopia | B              | `sonata-dystopia-blue` |

### discard a card at random

| Card                   | Pitch variants | Slugs                                                                                        |
| ---------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| Alpha Rampage          | R              | `alpha-rampage-red`                                                                          |
| Barraging Big Horn     | R/Y/B          | `barraging-big-horn-blue`, `barraging-big-horn-red`, `barraging-big-horn-yellow`             |
| Bloodrush Bellow       | Y              | `bloodrush-bellow-yellow`                                                                    |
| Breakneck Battery      | R/Y/B          | `breakneck-battery-blue`, `breakneck-battery-red`, `breakneck-battery-yellow`                |
| Madcap Charger         | R/Y/B          | `madcap-charger-blue`, `madcap-charger-red`, `madcap-charger-yellow`                         |
| Madcap Muscle          | R/Y/B          | `madcap-muscle-blue`, `madcap-muscle-red`, `madcap-muscle-yellow`                            |
| Primeval Bellow        | R/Y/B          | `primeval-bellow-blue`, `primeval-bellow-red`, `primeval-bellow-yellow`                      |
| Reckless Swing         | B              | `reckless-swing-blue`                                                                        |
| Savage Beatdown        | R              | `savage-beatdown-red`                                                                        |
| Savage Feast           | R/Y/B          | `savage-feast-blue`, `savage-feast-red`, `savage-feast-yellow`                               |
| Savage Swing           | R/Y/B          | `savage-swing-blue`, `savage-swing-red`, `savage-swing-yellow`                               |
| Swing Fist Think Later | R/Y/B          | `swing-fist-think-later-blue`, `swing-fist-think-later-red`, `swing-fist-think-later-yellow` |
| Wrecker Romp           | R/Y/B          | `wrecker-romp-blue`, `wrecker-romp-red`, `wrecker-romp-yellow`                               |

### discard a card named Goldfin Harpoon

| Card            | Pitch variants | Slugs                    |
| --------------- | -------------- | ------------------------ |
| Favorable Winds | Y              | `favorable-winds-yellow` |

### discard a card named Phoenix Flame

| Card                   | Pitch variants | Slugs                        |
| ---------------------- | -------------- | ---------------------------- |
| Art Of The Phoenix War | R              | `art-of-the-phoenix-war-red` |

### pay all of: destroy up to 3 cards matching the type restriction; discard up to 3 cards matching the type restriction

| Card            | Pitch variants | Slugs                    |
| --------------- | -------------- | ------------------------ |
| Forsaken Strike | Y              | `forsaken-strike-yellow` |

### pay the calculated amount resources

| Card               | Pitch variants | Slugs                       |
| ------------------ | -------------- | --------------------------- |
| Overwhelming Swing | Y              | `overwhelming-swing-yellow` |

### put a card from arsenal on the bottom of the deck

| Card              | Pitch variants | Slugs                    |
| ----------------- | -------------- | ------------------------ |
| Seeds Of Tomorrow | B              | `seeds-of-tomorrow-blue` |
| Tome Of Harvests  | B              | `tome-of-harvests-blue`  |

### put a card from hand into the specified deck position

| Card     | Pitch variants | Slugs                                              |
| -------- | -------------- | -------------------------------------------------- |
| Submerge | R/Y/B          | `submerge-blue`, `submerge-red`, `submerge-yellow` |

### reveal a card matching the cost restriction from hand

| Card                         | Pitch variants | Slugs                                                                                                          |
| ---------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------- |
| Demolition Crew              | R/Y/B          | `demolition-crew-blue`, `demolition-crew-red`, `demolition-crew-yellow`                                        |
| Flock Of The Feather Walkers | R/Y/B          | `flock-of-the-feather-walkers-blue`, `flock-of-the-feather-walkers-red`, `flock-of-the-feather-walkers-yellow` |

### tap X cards named Seismic Surge

| Card          | Pitch variants | Slugs               |
| ------------- | -------------- | ------------------- |
| Seismic Shift | R              | `seismic-shift-red` |
