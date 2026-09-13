# Fixture card implementation inventory

Generated: 2026-08-13T08:11:24.259Z

Scope: every unique hero / arena / main-deck printing named by the 17 tournament text fixtures. Practice seats are synthetic and excluded.

Coverage rule: a printing is **behavior-tested** only if it has a sibling `<file>.test.ts` or is the `describe('name (CODE)')` subject of an engine proven suite. Being imported as pitch/block fodder in deck-QA does **not** count.

Review rule: mass-generated modules are **unreviewed** unless the source has a `hand-authored` / `Model notes` marker or a real behavior test that forced a human to read the printed text.

## Summary

| Metric                          | Count |
| ------------------------------- | ----: |
| Fixtures                        |    17 |
| Unique names                    |   424 |
| Unique printings (name + pitch) |   454 |
| Catalog resolved                |   454 |
| Card module present             |   454 |
| Hand-authored marker            |   116 |
| Sibling behavior test           |   372 |
| Proven-suite subject            |    90 |
| Behavior-tested (either)        |   454 |
| Mentioned only (not coverage)   |     0 |
| No test at all                  |     0 |

### Status counts

| Status                      | Meaning                                      | Count |
| --------------------------- | -------------------------------------------- | ----: |
| reviewed-tested             | hand-authored **and** behavior test          |   116 |
| generated-tested            | generated module, sibling/proven test exists |   338 |
| reviewed-untested           | hand-authored, no behavior test              |     0 |
| generated-mentioned         | generated; imported as fodder only           |     0 |
| generated-untested          | generated; never reviewed; no test           |     0 |
| missing-module / unresolved | identity or source gap                       |     0 |

## Per fixture

| Fixture                                | Printings | Behavior-tested | Mentioned only | Untested |
| -------------------------------------- | --------: | --------------: | -------------: | -------: |
| cc-edinburgh-1st-gravy-bones           |        41 |              41 |              0 |        0 |
| cc-edinburgh-3rd-tuffnut               |        36 |              36 |              0 |        0 |
| cc-edinburgh-5th-vynnset               |        36 |              36 |              0 |        0 |
| cc-edinburgh-5th-jarl                  |        38 |              38 |              0 |        0 |
| cc-edinburgh-5th-fang                  |        35 |              35 |              0 |        0 |
| sa-edinburgh-1st-briar                 |        35 |              35 |              0 |        0 |
| sa-edinburgh-2nd-oscilio               |        34 |              34 |              0 |        0 |
| sa-edinburgh-5th-blaze                 |        35 |              35 |              0 |        0 |
| sa-edinburgh-5th-fai                   |        33 |              33 |              0 |        0 |
| cc-las-vegas-1st-kassai                |        39 |              39 |              0 |        0 |
| cc-las-vegas-3rd-dorinthea             |        40 |              40 |              0 |        0 |
| cc-las-vegas-5th-teklovossen           |        37 |              37 |              0 |        0 |
| cc-2026-08-11-zyggy-starlight          |        26 |              26 |              0 |        0 |
| cc-yan-pedroni-vynnset                 |        38 |              38 |              0 |        0 |
| cc-2026-08-11-aurora-legacy-of-tempest |        29 |              29 |              0 |        0 |
| cc-guilherme-coutinho-rhinar           |        39 |              39 |              0 |        0 |
| cc-konrad-weiss-oscilio                |        38 |              38 |              0 |        0 |

## generated-tested (338)

| Printing                           | Code   | Module                                                     |  Decks | Notes                                                 |
| ---------------------------------- | ------ | ---------------------------------------------------------- | -----: | ----------------------------------------------------- | --- | -------------- |
| Absorb in Aether (red)             | ARC123 | ARC/defense-reactions/ARC123-absorb-in-aether-red.ts       |      1 | 1 sibling it(); 1 sibling todo                        |
| Adaptive Alpha Mold                | SUP253 | SUP/equipments/SUP253-adaptive-alpha-mold.ts               |      1 | 2 sibling it(); 1 sibling todo                        |
| Adaptive Dissolver                 | ROS246 | ROS/equipments/ROS246-adaptive-dissolver.ts                |      1 | 2 sibling it(); 1 sibling todo                        |
| Aether Ironweave                   | CHN005 | CHN/equipments/CHN005-aether-ironweave.ts                  |      1 | proven subject                                        |
| Agile Windup (yellow)              | HVY164 | HVY/actions/HVY164-agile-windup-yellow.ts                  |      1 | 2 sibling it()                                        |
| Amnesia (red)                      | OUT183 | OUT/actions/OUT183-amnesia-red.ts                          |      1 | 2 sibling it(); 1 sibling todo                        |
| Arcane Polarity (red)              | ROS231 | ROS/instants/ROS231-arcane-polarity-red.ts                 |      4 | 2 sibling it()                                        |
| Arcane Seeds // Life (red)         | FLR013 | FLR/instants/FLR013-arcane-seeds-life-red.ts               |      1 | 2 sibling it()                                        |
| Arcbane Grasp (blue)               | OMN236 | OMN/equipments/OMN236-arcbane-grasp-blue.ts                |      1 | 2 sibling it(); 1 sibling todo                        |
| Astral Bridge (red)                | OMN098 | OMN/instants/OMN098-astral-bridge-red.ts                   |      1 | 2 sibling it(); 1 sibling todo                        |
| Aurora, Legacy of Tempest          | OMN047 | OMN/heroes/OMN047-aurora-legacy-of-tempest.ts              |      1 | proven subject                                        |
| Authority of Ataya (blue)          | SUP000 | SUP/resources/SUP000-authority-of-ataya-blue.ts            |      1 | 2 sibling it()                                        |
| Avast Ye! (blue)                   | AGB025 | AGB/actions/AGB025-avast-ye-blue.ts                        |      1 | 4 sibling it()                                        |
| Backside of the Blade (blue)       | AHA019 | AHA/attack-reactions/AHA019-backside-of-the-blade-blue.ts  |      1 | 2 sibling it()                                        |
| Balance of Justice                 | HVY195 | HVY/equipments/HVY195-balance-of-justice.ts                |      5 | proven subject                                        |
| Barkskin of the Millennium Tree    | ROS028 | ROS/equipments/ROS028-barkskin-of-the-millennium-tree.ts   |      1 | proven subject                                        |
| Base of the Mountain               | MPG113 | MPG/equipments/MPG113-base-of-the-mountain.ts              |      1 | 2 sibling it(); 1 sibling todo                        |
| Battlefront Bastion (blue)         | AKO019 | AKO/actions/AKO019-battlefront-bastion-blue.ts             |      1 | 2 sibling it(); 1 sibling todo                        |
| Battlefront Bastion (red)          | ENG007 | ENG/actions/ENG007-battlefront-bastion-red.ts              |      1 | 3 sibling it()                                        |
| Battlefront Bastion (yellow)       | ENG012 | ENG/actions/ENG012-battlefront-bastion-yellow.ts           |      1 | 3 sibling it()                                        |
| Beat of the Ironsong (blue)        | SUP251 | SUP/attack-reactions/SUP251-beat-of-the-ironsong-blue.ts   |      1 | 2 sibling it()                                        |
| Beaten Trackers                    | DYN006 | DYN/equipments/DYN006-beaten-trackers.ts                   |      1 | 2 sibling it()                                        |
| Blade Beckoner Boots               | HNT219 | HNT/equipments/HNT219-blade-beckoner-boots.ts              |      2 | proven subject                                        |
| Blade Beckoner Gauntlets           | FNG005 | FNG/equipments/FNG005-blade-beckoner-gauntlets.ts          |      1 | proven subject                                        |
| Blade Beckoner Plating             | CIN004 | CIN/equipments/CIN004-blade-beckoner-plating.ts            |      1 | proven subject                                        |
| Blade Flurry (red)                 | HVY101 | HVY/attack-reactions/HVY101-blade-flurry-red.ts            |      2 | 2 sibling it()                                        |
| Blade Runner (blue)                | EVR062 | EVR/attack-reactions/EVR062-blade-runner-blue.ts           |      1 | 2 sibling it()                                        |
| Blade Runner (red)                 | EVR060 | EVR/attack-reactions/EVR060-blade-runner-red.ts            |      1 | 2 sibling it()                                        |
| Blast Rig (red)                    | PEN064 | PEN/actions/PEN064-blast-rig-red.ts                        |      1 | 3 sibling it()                                        |
| Blaze, Firemind                    | HER117 | HER/heroes/HER117-blaze-firemind.ts                        |      1 | 5 sibling it()                                        |
| Blink (blue)                       | ELE176 | ELE/instants/ELE176-blink-blue.ts                          |      1 | 2 sibling it()                                        |
| Blitz Kicks                        | AZS006 | AZS/equipments/AZS006-blitz-kicks.ts                       |      1 | proven subject                                        |
| Blood Follows Blade (yellow)       | SUP252 | SUP/attack-reactions/SUP252-blood-follows-blade-yellow.ts  |      1 | 2 sibling it()                                        |
| Blood in the Water (red)           | SEA047 | SEA/defense-reactions/SEA047-blood-in-the-water-red.ts     |      1 | 1 sibling it(); 1 sibling todo                        |
| Blood Scent                        | TCC080 | TCC/equipments/TCC080-blood-scent.ts                       |      1 | proven subject                                        |
| Bloodied Oval                      | BET003 | BET/equipments/BET003-bloodied-oval.ts                     |      2 | proven subject                                        |
| Bloodrush Bellow (yellow)          | WTR007 | WTR/actions/WTR007-bloodrush-bellow-yellow.ts              |      1 | 2 sibling it()                                        |
| Blossom of Spring                  | DVR004 | DVR/equipments/DVR004-blossom-of-spring.ts                 |      1 | 3 sibling it(); proven subject                        |
| Blunten (yellow)                   | PEN049 | PEN/blocks/PEN049-blunten-yellow.ts                        |      2 | 2 sibling it()                                        |
| Boots of Omnis Ward                | OMN204 | OMN/equipments/OMN204-boots-of-omnis-ward.ts               |      1 | 2 sibling it(); 2 sibling todo                        |
| Boulder Drop (red)                 | APS008 | APS/actions/APS008-boulder-drop-red.ts                     |      1 | 2 sibling it()                                        |
| Brand with Cinderclaw (red)        | FAI020 | FAI/actions/FAI020-brand-with-cinderclaw-red.ts            |      1 | 2 sibling it(); 1 sibling todo                        |
| Brand with Cinderclaw (yellow)     | UPR061 | UPR/actions/UPR061-brand-with-cinderclaw-yellow.ts         |      1 | 2 sibling it(); 1 sibling todo                        |
| Braveforge Bracers                 | WTR116 | WTR/equipments/WTR116-braveforge-bracers.ts                |      3 | proven subject                                        |
| Breaking Point (red)               | UPR093 | UPR/actions/UPR093-breaking-point-red.ts                   |      1 | 3 sibling it()                                        |
| Briar                              | ELE063 | ELE/heroes/ELE063-briar.ts                                 |      1 | 7 sibling it(); proven subject                        |
| Brothers in Arms (blue)            | UPR205 | UPR/actions/UPR205-brothers-in-arms-blue.ts                |      1 | 2 sibling it()                                        |
| Burn Up // Shock (red)             | AUA017 | AUA/instants/AUA017-burn-up-shock-red.ts                   |      1 | 2 sibling it(); 1 sibling todo                        |
| Burning Blade Dance (red)          | CIN009 | CIN/actions/CIN009-burning-blade-dance-red.ts              |      1 | 6 sibling it()                                        |
| Call to the Grave (blue)           | ROS218 | ROS/actions/ROS218-call-to-the-grave-blue.ts               |      1 | 2 sibling it()                                        |
| Cap of Quick Thinking              | AST003 | AST/equipments/AST003-cap-of-quick-thinking.ts             |      1 | proven subject                                        |
| Carrion Crown                      | PEN152 | PEN/equipments/PEN152-carrion-crown.ts                     |      1 | proven subject                                        |
| Cheating Scoundrel (red)           | PEN169 | PEN/actions/PEN169-cheating-scoundrel-red.ts               |      1 | 6 sibling it()                                        |
| Chum, Friendly First Mate (yellow) | SEA050 | SEA/actions/SEA050-chum-friendly-first-mate-yellow.ts      |      1 | 2 sibling it(); 1 sibling todo                        |
| Cindering Foresight (red)          | CRU165 | CRU/actions/CRU165-cindering-foresight-red.ts              |      1 | 3 sibling it()                                        |
| Cindering Foresight (yellow)       | CRU166 | CRU/actions/CRU166-cindering-foresight-yellow.ts           |      1 | 3 sibling it()                                        |
| Cintari Saber                      | CRU079 | CRU/weapons/CRU079-cintari-saber.ts                        |      1 | proven subject                                        |
| Cleave (red)                       | DYN071 | DYN/actions/DYN071-cleave-red.ts                           |      1 | 8 sibling it()                                        |
| Cloud Cover (red)                  | PEN246 | PEN/instants/PEN246-cloud-cover-red.ts                     |      2 | 2 sibling it()                                        |
| Cogwerx Base Legs                  | EVO017 | EVO/equipments/EVO017-cogwerx-base-legs.ts                 |      1 | proven subject                                        |
| Comeback Kicks                     | PEN288 | PEN/equipments/PEN288-comeback-kicks.ts                    |      1 | proven subject                                        |
| Comet Collision (red)              | OMN109 | OMN/actions/OMN109-comet-collision-red.ts                  |      2 | 3 sibling it()                                        |
| Command and Conquer (red)          | ARC159 | ARC/actions/ARC159-command-and-conquer-red.ts              |      2 | 2 sibling it(); 1 sibling todo                        |
| Compass of Sunken Depths           | AGB003 | AGB/equipments/AGB003-compass-of-sunken-depths.ts          |      1 | 2 sibling it()                                        |
| Consign to Cosmos                  |        | Shock (yellow)                                             | SEA259 | SEA/instants/SEA259-consign-to-cosmos-shock-yellow.ts | 1   | 4 sibling it() |
| Constella Contemplation (yellow)   | OMN130 | OMN/instants/OMN130-constella-contemplation-yellow.ts      |      2 | 2 sibling it(); 1 sibling todo                        |
| Constella Flowslide (yellow)       | OMN131 | OMN/instants/OMN131-constella-flowslide-yellow.ts          |      1 | 2 sibling it(); 1 sibling todo                        |
| Constella Uplift (yellow)          | OMN132 | OMN/instants/OMN132-constella-uplift-yellow.ts             |      2 | 2 sibling it(); 1 sibling todo                        |
| Constella Waves                    | OMN097 | OMN/equipments/OMN097-constella-waves.ts                   |      1 | proven subject                                        |
| Core Reaction (red)                | OMN103 | OMN/instants/OMN103-core-reaction-red.ts                   |      1 | 2 sibling it()                                        |
| Cosmic Duality (blue)              | AZS021 | AZS/actions/AZS021-cosmic-duality-blue.ts                  |      1 | 3 sibling it()                                        |
| Cosmic Flare (red)                 | OMN187 | OMN/instants/OMN187-cosmic-flare-red.ts                    |      1 | 2 sibling it()                                        |
| Crowd Goes Wild (yellow)           | SUP019 | SUP/actions/SUP019-crowd-goes-wild-yellow.ts               |      1 | 3 sibling it()                                        |
| Crown of Dominion                  | DYN234 | DYN/equipments/DYN234-crown-of-dominion.ts                 |      1 | proven subject                                        |
| Crown of Everbloom                 | PEN215 | PEN/equipments/PEN215-crown-of-everbloom.ts                |      1 | proven subject                                        |
| Crown of Providence                | UPR182 | UPR/equipments/UPR182-crown-of-providence.ts               |      6 | proven subject                                        |
| Crucible of Aetherweave            | ARC115 | ARC/weapons/ARC115-crucible-of-aetherweave.ts              |      1 | 2 sibling it()                                        |
| Cull (red)                         | HNT259 | HNT/actions/HNT259-cull-red.ts                             |      2 | 3 sibling it()                                        |
| Dampen (red)                       | UPR170 | UPR/actions/UPR170-dampen-red.ts                           |      1 | 1 sibling it(); 2 sibling todo                        |
| Dawnblade                          | TEA003 | TEA/weapons/TEA003-dawnblade.ts                            |      1 | proven subject                                        |
| Dead Threads                       | SEA080 | SEA/equipments/SEA080-dead-threads.ts                      |      1 | proven subject                                        |
| Deadwood Dirge (red)               | FLR014 | FLR/actions/FLR014-deadwood-dirge-red.ts                   |      2 | 3 sibling it()                                        |
| Deathly Delight (red)              | DTD143 | DTD/actions/DTD143-deathly-delight-red.ts                  |      2 | 3 sibling it(); 1 sibling todo                        |
| Deathly Wail (blue)                | DTD148 | DTD/actions/DTD148-deathly-wail-blue.ts                    |      2 | 3 sibling it(); 1 sibling todo                        |
| Deathly Wail (red)                 | DTD146 | DTD/actions/DTD146-deathly-wail-red.ts                     |      2 | 3 sibling it(); 1 sibling todo                        |
| Deathly Wail (yellow)              | DTD147 | DTD/actions/DTD147-deathly-wail-yellow.ts                  |      2 | 3 sibling it(); 1 sibling todo                        |
| Decimator Great Axe                | DTD205 | DTD/weapons/DTD205-decimator-great-axe.ts                  |      1 | proven subject                                        |
| Deep Recesses of Existence (blue)  | PEN190 | PEN/actions/PEN190-deep-recesses-of-existence-blue.ts      |      2 | 3 sibling it(); 1 sibling todo                        |
| Dig In (yellow)                    | SUP037 | SUP/actions/SUP037-dig-in-yellow.ts                        |      1 | 2 sibling it(); 1 sibling todo                        |
| Display Loyalty (red)              | CIN010 | CIN/actions/CIN010-display-loyalty-red.ts                  |      1 | 3 sibling it(); proven subject                        |
| Dorinthea Ironsong                 | TEA001 | TEA/heroes/TEA001-dorinthea-ironsong.ts                    |      1 | 2 sibling it()                                        |
| Dragon Power (blue)                | CIN023 | CIN/actions/CIN023-dragon-power-blue.ts                    |      1 | 1 sibling it(); 1 sibling todo                        |
| Draw Swords (red)                  | HVY121 | HVY/actions/HVY121-draw-swords-red.ts                      |      1 | proven subject                                        |
| Dyadic Carapace                    | DTD211 | DTD/equipments/DTD211-dyadic-carapace.ts                   |      2 | 2 sibling it()                                        |
| Ebon Fold                          | CHN004 | CHN/equipments/CHN004-ebon-fold.ts                         |      1 | proven subject                                        |
| Echoflash (yellow)                 | OMN099 | OMN/instants/OMN099-echoflash-yellow.ts                    |      1 | 2 sibling it(); 1 sibling todo                        |
| Electrostatic Discharge (red)      | AUA018 | AUA/instants/AUA018-electrostatic-discharge-red.ts         |      3 | 2 sibling it()                                        |
| Eloquent Eulogy (red)              | MST237 | MST/actions/MST237-eloquent-eulogy-red.ts                  |      2 | 3 sibling todo                                        |
| Emeritus Scolding (blue)           | EVR127 | EVR/actions/EVR127-emeritus-scolding-blue.ts               |      1 | 3 sibling it()                                        |
| Emeritus Scolding (red)            | EVR125 | EVR/actions/EVR125-emeritus-scolding-red.ts                |      1 | 2 sibling it()                                        |
| Emeritus Scolding (yellow)         | EVR126 | EVR/actions/EVR126-emeritus-scolding-yellow.ts             |      1 | 2 sibling it()                                        |
| Envelop in Darkness (red)          | DTD149 | DTD/actions/DTD149-envelop-in-darkness-red.ts              |      2 | 2 sibling it(); 1 sibling todo                        |
| Erase Face (red)                   | UPR187 | UPR/actions/UPR187-erase-face-red.ts                       |      1 | 3 sibling it()                                        |
| Even Bigger Than That! (red)       | EVR173 | EVR/instants/EVR173-even-bigger-than-that-red.ts           |      1 | 2 sibling it(); 1 sibling todo                        |
| Everbloom // Life (blue)           | SEA258 | SEA/instants/SEA258-everbloom-life-blue.ts                 |      1 | 2 sibling it(); 1 sibling todo                        |
| Evo Beta Base Arms (blue)          | PEN070 | PEN/equipments/PEN070-evo-beta-base-arms-blue.ts           |      1 | 2 sibling it(); 1 sibling todo                        |
| Evo Beta Base Head (blue)          | PEN068 | PEN/equipments/PEN068-evo-beta-base-head-blue.ts           |      1 | 2 sibling it(); 1 sibling todo                        |
| Evo Beta Base Legs (blue)          | PEN071 | PEN/equipments/PEN071-evo-beta-base-legs-blue.ts           |      1 | 2 sibling it(); 1 sibling todo                        |
| Evo Recall (blue)                  | MST228 | MST/equipments/MST228-evo-recall-blue.ts                   |      1 | proven subject                                        |
| Evo Speedslip (blue)               | MST231 | MST/equipments/MST231-evo-speedslip-blue.ts                |      1 | 2 sibling it(); 1 sibling todo                        |
| Evo Steel Soul Memory (blue)       | EVO026 | EVO/equipments/EVO026-evo-steel-soul-memory-blue.ts        |      1 | 2 sibling it()                                        |
| Eye of Ophidia (blue)              | ARC000 | ARC/resources/ARC000-eye-of-ophidia-blue.ts                |      2 | 2 sibling it()                                        |
| Face Purgatory                     | ROS114 | ROS/equipments/ROS114-face-purgatory.ts                    |      3 | proven subject                                        |
| Fai                                | FAI001 | FAI/heroes/FAI001-fai.ts                                   |      1 | 6 sibling it(); proven subject                        |
| Fang, Dracai of Blades             | HNT098 | HNT/heroes/HNT098-fang-dracai-of-blades.ts                 |      1 | proven subject                                        |
| Fasting Carcass (blue)             | PEN200 | PEN/actions/PEN200-fasting-carcass-blue.ts                 |      1 | 2 sibling it()                                        |
| Fasting Carcass (red)              | PEN198 | PEN/actions/PEN198-fasting-carcass-red.ts                  |      1 | 2 sibling it()                                        |
| Fatal Engagement (blue)            | HVY111 | HVY/attack-reactions/HVY111-fatal-engagement-blue.ts       |      1 | 2 sibling it()                                        |
| Fate Foreseen (red)                | ARC200 | ARC/defense-reactions/ARC200-fate-foreseen-red.ts          |      3 | 2 sibling it()                                        |
| Fearless Confrontation (blue)      | MPG128 | MPG/actions/MPG128-fearless-confrontation-blue.ts          |      1 | 3 sibling it()                                        |
| Felling of the Crown (red)         | ROS031 | ROS/actions/ROS031-felling-of-the-crown-red.ts             |      1 | 3 sibling it()                                        |
| Felling Swing (blue)               | DYN084 | DYN/actions/DYN084-felling-swing-blue.ts                   |      1 | 3 sibling it()                                        |
| Felling Swing (red)                | DYN082 | DYN/actions/DYN082-felling-swing-red.ts                    |      1 | 3 sibling it()                                        |
| Fiddler's Green (red)              | AGB013 | AGB/blocks/AGB013-fiddler-s-green-red.ts                   |      2 | 2 sibling it()                                        |
| Fire Tenet: Strike First (red)     | CIN012 | CIN/actions/CIN012-fire-tenet-strike-first-red.ts          |      1 | 2 sibling it()                                        |
| Fire that Burns Within (red)       | PEN255 | PEN/actions/PEN255-fire-that-burns-within-red.ts           |      1 | 2 sibling it(); 1 sibling todo                        |
| Firewall (red)                     | TCC019 | TCC/blocks/TCC019-firewall-red.ts                          |      1 | 2 sibling it()                                        |
| Flail of Agony                     | DTD135 | DTD/weapons/DTD135-flail-of-agony.ts                       |      2 | 2 sibling it()                                        |
| Flash Bolt (red)                   | OMN106 | OMN/instants/OMN106-flash-bolt-red.ts                      |      1 | 2 sibling it()                                        |
| Fleeing Starbreeze (blue)          | AZS027 | AZS/instants/AZS027-fleeing-starbreeze-blue.ts             |      1 | 2 sibling it()                                        |
| Flicker Trick (red)                | DTD218 | DTD/defense-reactions/DTD218-flicker-trick-red.ts          |      1 | 2 sibling it()                                        |
| Flittering Charge (red)            | AUA008 | AUA/actions/AUA008-flittering-charge-red.ts                |      4 | 2 sibling it()                                        |
| Foreboding Bolt (blue)             | CRU170 | CRU/actions/CRU170-foreboding-bolt-blue.ts                 |      1 | 3 sibling it()                                        |
| Fractal Creation (blue)            | OMN040 | OMN/actions/OMN040-fractal-creation-blue.ts                |      1 | 3 sibling it()                                        |
| Frozen to Death (blue)             | AJV020 | AJV/actions/AJV020-frozen-to-death-blue.ts                 |      1 | 2 sibling it()                                        |
| Fruits of the Forest (blue)        | FLR022 | FLR/actions/FLR022-fruits-of-the-forest-blue.ts            |      1 | 2 sibling it()                                        |
| Funeral Moon (red)                 | DTD140 | DTD/actions/DTD140-funeral-moon-red.ts                     |      2 | 3 sibling it(); 1 sibling todo                        |
| Fyendal's Fighting Spirit (red)    | UPR194 | UPR/actions/UPR194-fyendal-s-fighting-spirit-red.ts        |      2 | 3 sibling it()                                        |
| Fyendal's Spring Tunic             | WTR150 | WTR/equipments/WTR150-fyendal-s-spring-tunic.ts            |      8 | proven subject                                        |
| Garland of Spring                  | SUP212 | SUP/equipments/SUP212-garland-of-spring.ts                 |      1 | proven subject                                        |
| Gauntlets of the Boreal Domain     | AJV006 | AJV/equipments/AJV006-gauntlets-of-the-boreal-domain.ts    |      1 | proven subject                                        |
| Gauntlets of Tyrannical Rex        | SUP125 | SUP/equipments/SUP125-gauntlets-of-tyrannical-rex.ts       |      2 | proven subject                                        |
| Ghost Protocol: Architect (red)    | PEN062 | PEN/actions/PEN062-ghost-protocol-architect-red.ts         |      1 | proven subject                                        |
| Ghost Protocol: Mainframe (blue)   | PEN063 | PEN/actions/PEN063-ghost-protocol-mainframe-blue.ts        |      1 | 1 sibling todo                                        |
| Gleam of the Blade (red)           | AHA008 | AHA/attack-reactions/AHA008-gleam-of-the-blade-red.ts      |      1 | 2 sibling it(); 1 sibling todo                        |
| Glint the Quicksilver (blue)       | WTR118 | WTR/attack-reactions/WTR118-glint-the-quicksilver-blue.ts  |      2 | 3 sibling it()                                        |
| Glistening Steelblade (yellow)     | DVR008 | DVR/actions/DVR008-glistening-steelblade-yellow.ts         |      1 | 2 sibling it(); 1 sibling todo                        |
| Gloves of Astral Sanctuary         | OMN211 | OMN/equipments/OMN211-gloves-of-astral-sanctuary.ts        |      1 | proven subject                                        |
| Gold-Baited Hook                   | SEA125 | SEA/equipments/SEA125-gold-baited-hook.ts                  |      1 | 4 sibling it(); proven subject                        |
| Golden Tipple (blue)               | AGB021 | AGB/actions/AGB021-golden-tipple-blue.ts                   |      1 | 3 sibling it()                                        |
| Gone in a Flash (red)              | ROS076 | ROS/actions/ROS076-gone-in-a-flash-red.ts                  |      1 | 3 sibling it()                                        |
| Gravy Bones, Shipwrecked Looter    | AGB001 | AGB/heroes/AGB001-gravy-bones-shipwrecked-looter.ts        |      1 | 2 sibling it()                                        |
| Grimoire of Fellingsong            | PEN092 | PEN/equipments/PEN092-grimoire-of-fellingsong.ts           |      2 | proven subject                                        |
| Grimoire of the Haunt              | DTD136 | DTD/equipments/DTD136-grimoire-of-the-haunt.ts             |      2 | proven subject                                        |
| Haze Bending (blue)                | EVR141 | EVR/actions/EVR141-haze-bending-blue.ts                    |      1 | 2 sibling it()                                        |
| Heart of Fyendal (blue)            | WTR000 | WTR/resources/WTR000-heart-of-fyendal-blue.ts              |      1 | 2 sibling it()                                        |
| Heavy Metal Hardcore (red)         | PEN072 | PEN/actions/PEN072-heavy-metal-hardcore-red.ts             |      1 | 1 sibling todo                                        |
| Helm of Astral Sanctuary           | OMN209 | OMN/equipments/OMN209-helm-of-astral-sanctuary.ts          |      1 | proven subject                                        |
| Helm of Might and Magic            | PEN093 | PEN/equipments/PEN093-helm-of-might-and-magic.ts           |      1 | 3 sibling it()                                        |
| High Current Currency (blue)       | PEN323 | PEN/actions/PEN323-high-current-currency-blue.ts           |      1 | 2 sibling it()                                        |
| Hit and Run (blue)                 | CRU093 | CRU/actions/CRU093-hit-and-run-blue.ts                     |      2 | proven subject                                        |
| Hot on Their Heels (red)           | CIN014 | CIN/actions/CIN014-hot-on-their-heels-red.ts               |      1 | 3 sibling it()                                        |
| Hot Streak                         | HVY095 | HVY/weapons/HVY095-hot-streak.ts                           |      1 | proven subject                                        |
| In the Swing (red)                 | EVR063 | EVR/attack-reactions/EVR063-in-the-swing-red.ts            |      1 | 2 sibling it()                                        |
| Invert Existence (blue)            | MON158 | MON/instants/MON158-invert-existence-blue.ts               |      1 | 1 sibling it(); 2 sibling todo                        |
| Iris of Reality                    | MON088 | MON/weapons/MON088-iris-of-reality.ts                      |      1 | 2 sibling it()                                        |
| Ironsong Response (red)            | WTR132 | WTR/attack-reactions/WTR132-ironsong-response-red.ts       |      1 | 2 sibling it()                                        |
| Jagged Edge (red)                  | HNT116 | HNT/attack-reactions/HNT116-jagged-edge-red.ts             |      1 | 2 sibling it()                                        |
| Jarl Vetreiði                      | AJV001 | AJV/heroes/AJV001-jarl-vetrei-i.ts                         |      1 | 5 sibling it()                                        |
| Kassai of the Golden Sand          | HVY090 | HVY/heroes/HVY090-kassai-of-the-golden-sand.ts             |      1 | 3 sibling it()                                        |
| Kunai of Retribution               | CIN002 | CIN/weapons/CIN002-kunai-of-retribution.ts                 |      1 | proven subject                                        |
| Legacy of Ikaru (blue)             | ASR026 | ASR/attack-reactions/ASR026-legacy-of-ikaru-blue.ts        |      1 | 2 sibling it()                                        |
| Lightning Greaves                  | ROS071 | ROS/equipments/ROS071-lightning-greaves.ts                 |      1 | proven subject                                        |
| Lightning Press (red)              | ELE183 | ELE/instants/ELE183-lightning-press-red.ts                 |      4 | 2 sibling it()                                        |
| Loot the Hold (blue)               | AGB028 | AGB/actions/AGB028-loot-the-hold-blue.ts                   |      1 | 3 sibling it()                                        |
| Lunar Mirage (red)                 | PEN127 | PEN/actions/PEN127-lunar-mirage-red.ts                     |      1 | proven subject                                        |
| Machinations of Dominion (blue)    | ROS118 | ROS/actions/ROS118-machinations-of-dominion-blue.ts        |      1 | 2 sibling it()                                        |
| Mage Master Boots                  | ARC154 | ARC/equipments/ARC154-mage-master-boots.ts                 |      3 | proven subject                                        |
| Mask of the Swarming Claw          | PEN030 | PEN/equipments/PEN030-mask-of-the-swarming-claw.ts         |      1 | proven subject                                        |
| Mauvrion Skies (red)               | CRU145 | CRU/actions/CRU145-mauvrion-skies-red.ts                   |      1 | 3 sibling it()                                        |
| Monstrous Veil                     | HVY010 | HVY/equipments/HVY010-monstrous-veil.ts                    |      1 | proven subject                                        |
| Murderous Rabble (blue)            | AGB023 | AGB/actions/AGB023-murderous-rabble-blue.ts                |      1 | 3 sibling it()                                        |
| Nasty Surprise (blue)              | HVY207 | HVY/actions/HVY207-nasty-surprise-blue.ts                  |      1 | 2 sibling it(); 1 sibling todo                        |
| Nimblism (red)                     | WTR218 | WTR/actions/WTR218-nimblism-red.ts                         |      2 | 3 sibling it()                                        |
| Nip at the Heels (blue)            | HNT239 | HNT/attack-reactions/HNT239-nip-at-the-heels-blue.ts       |      2 | 2 sibling it()                                        |
| Nourishing Emptiness (red)         | MON246 | MON/actions/MON246-nourishing-emptiness-red.ts             |      1 | 2 sibling it()                                        |
| Nourishing Glow (blue)             | OMN038 | OMN/instants/OMN038-nourishing-glow-blue.ts                |      1 | 2 sibling it()                                        |
| Oaken Old (red)                    | ELE005 | ELE/actions/ELE005-oaken-old-red.ts                        |      1 | 4 sibling it()                                        |
| Oblivion (blue)                    | DTD142 | DTD/instants/DTD142-oblivion-blue.ts                       |      2 | 2 sibling it()                                        |
| Old Knocker                        | SEA182 | SEA/equipments/SEA182-old-knocker.ts                       |      1 | 3 sibling it()                                        |
| Oscilio                            | OSC001 | OSC/heroes/OSC001-oscilio.ts                               |      1 | 5 sibling it()                                        |
| Oscilio, Constella Intelligence    | ROS019 | ROS/heroes/ROS019-oscilio-constella-intelligence.ts        |      1 | 2 sibling it()                                        |
| Outland Skirmish (red)             | EVR066 | EVR/actions/EVR066-outland-skirmish-red.ts                 |      1 | 3 sibling it(); 1 sibling todo                        |
| Overcrowded (blue)                 | SUP216 | SUP/actions/SUP216-overcrowded-blue.ts                     |      1 | 3 sibling todo                                        |
| Overpower (blue)                   | WTR125 | WTR/attack-reactions/WTR125-overpower-blue.ts              |      2 | proven subject                                        |
| Phantasmaclasm (red)               | MON091 | MON/actions/MON091-phantasmaclasm-red.ts                   |      1 | proven subject                                        |
| Phoenix Flame (red)                | FAI008 | FAI/actions/FAI008-phoenix-flame-red.ts                    |      1 | 3 sibling it(); 1 sibling todo                        |
| Pierce Reality (blue)              | EVR143 | EVR/actions/EVR143-pierce-reality-blue.ts                  |      1 | 3 sibling it()                                        |
| Pilfer the Tomb (blue)             | PEN329 | PEN/instants/PEN329-pilfer-the-tomb-blue.ts                |      1 | 2 sibling it()                                        |
| Pillar of Unity                    | PEN047 | PEN/equipments/PEN047-pillar-of-unity.ts                   |      1 | proven subject                                        |
| Plow Under (yellow)                | ROS032 | ROS/actions/ROS032-plow-under-yellow.ts                    |      1 | 2 sibling it(); 1 sibling todo                        |
| Pouncing Paws                      | TCC082 | TCC/equipments/TCC082-pouncing-paws.ts                     |      1 | proven subject                                        |
| Prismatic Leyline (yellow)         | MST193 | MST/actions/MST193-prismatic-leyline-yellow.ts             |      1 | 3 sibling it()                                        |
| Provoke (blue)                     | HNT117 | HNT/attack-reactions/HNT117-provoke-blue.ts                |      2 | 2 sibling todo                                        |
| Pulse of Isenloft (blue)           | ELE114 | ELE/defense-reactions/ELE114-pulse-of-isenloft-blue.ts     |      1 | 2 sibling it()                                        |
| Pulsewave Harpoon (red)            | DYN090 | DYN/actions/DYN090-pulsewave-harpoon-red.ts                |      1 | 3 sibling todo                                        |
| Puncture (red)                     | DYN079 | DYN/attack-reactions/DYN079-puncture-red.ts                |      1 | 2 sibling it()                                        |
| Putrid Stirrings (red)             | DTD161 | DTD/actions/DTD161-putrid-stirrings-red.ts                 |      1 | 3 sibling it(); 1 sibling todo                        |
| Quick Succession (red)             | OMN083 | OMN/actions/OMN083-quick-succession-red.ts                 |      2 | 3 sibling it()                                        |
| Quick Succession (yellow)          | OMN084 | OMN/actions/OMN084-quick-succession-yellow.ts              |      2 | 3 sibling it()                                        |
| Quickdodge Flexors                 | HNT215 | HNT/equipments/HNT215-quickdodge-flexors.ts                |      1 | proven subject                                        |
| Raise an Army (yellow)             | HVY105 | HVY/actions/HVY105-raise-an-army-yellow.ts                 |      1 | 3 sibling it()                                        |
| Rampart of the Ram's Head          | ELE203 | ELE/equipments/ELE203-rampart-of-the-ram-s-head.ts         |      1 | proven subject                                        |
| Ravenous Meataxe                   | LEV003 | LEV/weapons/LEV003-ravenous-meataxe.ts                     |      1 | proven subject                                        |
| Ravenous Rabble (red)              | ARC191 | ARC/actions/ARC191-ravenous-rabble-red.ts                  |      6 | 3 sibling it()                                        |
| Reckless Stampede (red)            | SUP127 | SUP/actions/SUP127-reckless-stampede-red.ts                |      1 | 2 sibling it()                                        |
| Reckless Swing (blue)              | WTR008 | WTR/defense-reactions/WTR008-reckless-swing-blue.ts        |      1 | 2 sibling it()                                        |
| Reduce to Runechant (red)          | ARC088 | ARC/defense-reactions/ARC088-reduce-to-runechant-red.ts    |      2 | 2 sibling it()                                        |
| Refraction Bolters                 | TEA007 | TEA/equipments/TEA007-refraction-bolters.ts                |      1 | proven subject                                        |
| Remembrance (yellow)               | WTR163 | WTR/instants/WTR163-remembrance-yellow.ts                  |      1 | 2 sibling it()                                        |
| Rhinar, Reckless Rampage           | RNR001 | RNR/heroes/RNR001-rhinar-reckless-rampage.ts               |      1 | 2 sibling it()                                        |
| Riches of Trōpal-Dhani (yellow)    | SEA000 | SEA/resources/SEA000-riches-of-tr-pal-dhani-yellow.ts      |      2 | 2 sibling it()                                        |
| Riggermortis (yellow)              | AGB018 | AGB/actions/AGB018-riggermortis-yellow.ts                  |      1 | 2 sibling it()                                        |
| Rip Off the Top (yellow)           | PEN008 | PEN/actions/PEN008-rip-off-the-top-yellow.ts               |      1 | 3 sibling it()                                        |
| Ripple Away (blue)                 | HVY209 | HVY/actions/HVY209-ripple-away-blue.ts                     |      2 | 1 sibling it(); 1 sibling todo                        |
| Rise from the Ashes (red)          | FAI009 | FAI/actions/FAI009-rise-from-the-ashes-red.ts              |      1 | 3 sibling it()                                        |
| Rockyard Rodeo (blue)              | PEN322 | PEN/actions/PEN322-rockyard-rodeo-blue.ts                  |      1 | 1 sibling it(); 1 sibling todo                        |
| Rok                                | DYN005 | DYN/weapons/DYN005-rok.ts                                  |      1 | 2 sibling it(); 1 sibling todo                        |
| Rootbound Carapace (red)           | FLR011 | FLR/defense-reactions/FLR011-rootbound-carapace-red.ts     |      1 | 2 sibling it()                                        |
| Run Through (yellow)               | DVR013 | DVR/attack-reactions/DVR013-run-through-yellow.ts          |      1 | 2 sibling it(); 1 sibling todo                        |
| Rush of Power (red)                | OMN068 | OMN/actions/OMN068-rush-of-power-red.ts                    |      1 | 2 sibling it()                                        |
| Saltwater Swell (blue)             | SEA143 | SEA/actions/SEA143-saltwater-swell-blue.ts                 |      1 | 3 sibling it()                                        |
| Saltwater Swell (red)              | SEA141 | SEA/actions/SEA141-saltwater-swell-red.ts                  |      1 | 3 sibling it()                                        |
| Sand Sketched Plan (blue)          | WTR009 | WTR/actions/WTR009-sand-sketched-plan-blue.ts              |      1 | 2 sibling it(); 1 sibling todo                        |
| Savage Feast (red)                 | RNR010 | RNR/actions/RNR010-savage-feast-red.ts                     |      1 | 2 sibling it(); 1 sibling todo                        |
| Savage Sash                        | AKO004 | AKO/equipments/AKO004-savage-sash.ts                       |      1 | 3 sibling it(); proven subject                        |
| Sawbones, Dock Hand (yellow)       | AGB019 | AGB/actions/AGB019-sawbones-dock-hand-yellow.ts            |      1 | 1 sibling it(); 1 sibling todo                        |
| Scabskin Leathers                  | WTR004 | WTR/equipments/WTR004-scabskin-leathers.ts                 |      2 | 3 sibling it()                                        |
| Scooba, Salty Sea Dog (yellow)     | SEA061 | SEA/actions/SEA061-scooba-salty-sea-dog-yellow.ts          |      1 | 3 sibling it()                                        |
| Scorpio, Comet Tail                | OMN049 | OMN/weapons/OMN049-scorpio-comet-tail.ts                   |      1 | 2 sibling it()                                        |
| Scowling Flesh Bag                 | DTD200 | DTD/equipments/DTD200-scowling-flesh-bag.ts                |      2 | proven subject                                        |
| Scuttle Toes                       | PEN155 | PEN/equipments/PEN155-scuttle-toes.ts                      |      1 | 2 sibling it()                                        |
| Sea Legs (yellow)                  | SEA187 | SEA/actions/SEA187-sea-legs-yellow.ts                      |      1 | 2 sibling it()                                        |
| Searing Emberblade                 | FAI002 | FAI/weapons/FAI002-searing-emberblade.ts                   |      1 | 2 sibling it()                                        |
| Seeker's Mitts                     | OUT177 | OUT/equipments/OUT177-seeker-s-mitts.ts                    |      1 | proven subject                                        |
| Shadow Puppetry (red)              | MON193 | MON/actions/MON193-shadow-puppetry-red.ts                  |      2 | 2 sibling it()                                        |
| Sharpen Steel (red)                | TEA014 | TEA/actions/TEA014-sharpen-steel-red.ts                    |      1 | 2 sibling it()                                        |
| Sharpened Senses (yellow)          | HNT118 | HNT/actions/HNT118-sharpened-senses-yellow.ts              |      1 | 1 sibling it(); 1 sibling todo                        |
| Shelter from the Storm (red)       | HNT222 | HNT/defense-reactions/HNT222-shelter-from-the-storm-red.ts |      5 | 2 sibling it()                                        |
| Show of Strength (red)             | SUP128 | SUP/actions/SUP128-show-of-strength-red.ts                 |      1 | 2 sibling it(); 1 sibling todo                        |
| Sigil of Solace (red)              | WTR173 | WTR/instants/WTR173-sigil-of-solace-red.ts                 |      5 | 2 sibling it()                                        |
| Sigil of Suffering (red)           | ELE227 | ELE/defense-reactions/ELE227-sigil-of-suffering-red.ts     |      1 | 2 sibling it()                                        |
| Sigil of Suffering (yellow)        | ELE228 | ELE/defense-reactions/ELE228-sigil-of-suffering-yellow.ts  |      1 | 2 sibling it()                                        |
| Singing Steelblade (yellow)        | WTR121 | WTR/attack-reactions/WTR121-singing-steelblade-yellow.ts   |      1 | 2 sibling it(); 1 sibling todo                        |
| Singularity (red)                  | EVO010 | EVO/actions/EVO010-singularity-red.ts                      |      1 | 2 sibling it()                                        |
| Sink Below (red)                   | WTR215 | WTR/defense-reactions/WTR215-sink-below-red.ts             |      5 | 2 sibling it()                                        |
| Sirens of Safe Harbor (blue)       | SEA228 | SEA/actions/SEA228-sirens-of-safe-harbor-blue.ts           |      1 | 2 sibling it()                                        |
| Sizzle (red)                       | AUR014 | AUR/actions/AUR014-sizzle-red.ts                           |      1 | 3 sibling it()                                        |
| Skera Strapping                    | PEN004 | PEN/equipments/PEN004-skera-strapping.ts                   |      1 | proven subject                                        |
| Skullhorn                          | CRU006 | CRU/equipments/CRU006-skullhorn.ts                         |      1 | 3 sibling it()                                        |
| Skyward Serenade (yellow)          | AST023 | AST/actions/AST023-skyward-serenade-yellow.ts              |      1 | 2 sibling it()                                        |
| Sledge of Anvilheim                | CRU024 | CRU/weapons/CRU024-sledge-of-anvilheim.ts                  |      1 | proven subject                                        |
| Snapdragon Scalers                 | RNR007 | RNR/equipments/RNR007-snapdragon-scalers.ts                |      1 | proven subject                                        |
| Song of Sinew (yellow)             | SUP134 | SUP/actions/SUP134-song-of-sinew-yellow.ts                 |      2 | 2 sibling it()                                        |
| Spellbound Creepers                | ELE224 | ELE/equipments/ELE224-spellbound-creepers.ts               |      2 | 2 sibling it(); 1 sibling todo                        |
| Spellfire Cloak                    | UPR167 | UPR/equipments/UPR167-spellfire-cloak.ts                   |      1 | proven subject                                        |
| Splatter Skull (red)               | ROS243 | ROS/actions/ROS243-splatter-skull-red.ts                   |      1 | 1 sibling it(); 1 sibling todo                        |
| Spoils of War (red)                | CRU084 | CRU/actions/CRU084-spoils-of-war-red.ts                    |      2 | 2 sibling it()                                        |
| Sprout Strength (red)              | PEN222 | PEN/actions/PEN222-sprout-strength-red.ts                  |      1 | 3 sibling it()                                        |
| Stalagmite, Bastion of Isenloft    | EVR018 | EVR/equipments/EVR018-stalagmite-bastion-of-isenloft.ts    |      1 | proven subject                                        |
| Star Fall                          | AUR002 | AUR/weapons/AUR002-star-fall.ts                            |      1 | 2 sibling it()                                        |
| Static Shock (red)                 | AUR012 | AUR/actions/AUR012-static-shock-red.ts                     |      1 | 2 sibling it()                                        |
| Staunch Response (red)             | WTR051 | WTR/defense-reactions/WTR051-staunch-response-red.ts       |      1 | 2 sibling todo                                        |
| Steel Street Enforcement (blue)    | EVO060 | EVO/blocks/EVO060-steel-street-enforcement-blue.ts         |      1 | 2 sibling it()                                        |
| Steelblade Shunt (blue)            | WTR128 | WTR/defense-reactions/WTR128-steelblade-shunt-blue.ts      |      1 | 2 sibling it()                                        |
| Steelblade Shunt (red)             | TEA011 | TEA/defense-reactions/TEA011-steelblade-shunt-red.ts       |      1 | 2 sibling it()                                        |
| Steelblade Shunt (yellow)          | WTR127 | WTR/defense-reactions/WTR127-steelblade-shunt-yellow.ts    |      1 | 2 sibling it()                                        |
| Steelblade Supremacy (red)         | WTR119 | WTR/actions/WTR119-steelblade-supremacy-red.ts             |      1 | 3 sibling it()                                        |
| Stonewall Gauntlet                 | MST190 | MST/equipments/MST190-stonewall-gauntlet.ts                |      1 | proven subject                                        |
| Stormshard (red)                   | OMN190 | OMN/instants/OMN190-stormshard-red.ts                      |      1 | 2 sibling todo                                        |
| Strike Twice (red)                 | PEN238 | PEN/actions/PEN238-strike-twice-red.ts                     |      1 | 2 sibling it(); 1 sibling todo                        |
| Strongest Survive (yellow)         | SUP136 | SUP/actions/SUP136-strongest-survive-yellow.ts             |      1 | 1 sibling it(); 1 sibling todo                        |
| Sunken Treasure (blue)             | SEA133 | SEA/blocks/SEA133-sunken-treasure-blue.ts                  |      1 | 2 sibling it()                                        |
| Swiftstrike Bracers                | SEA183 | SEA/equipments/SEA183-swiftstrike-bracers.ts               |      1 | proven subject                                        |
| Swiftwater Sloop (red)             | SEA166 | SEA/actions/SEA166-swiftwater-sloop-red.ts                 |      1 | 2 sibling it()                                        |
| Swing Big (red)                    | EVR002 | EVR/actions/EVR002-swing-big-red.ts                        |      1 | 1 sibling it(); 1 sibling todo                        |
| Swordmaster's Shine (red)          | PEN048 | PEN/attack-reactions/PEN048-swordmaster-s-shine-red.ts     |      1 | 2 sibling it(); 1 sibling todo                        |
| Synapse Sparkcap                   | PEN057 | PEN/equipments/PEN057-synapse-sparkcap.ts                  |      1 | proven subject                                        |
| T-Bone (blue)                      | EVR075 | EVR/actions/EVR075-t-bone-blue.ts                          |      1 | 1 sibling it(); 1 sibling todo                        |
| T-Bone (red)                       | EVR073 | EVR/actions/EVR073-t-bone-red.ts                           |      1 | 1 sibling it(); 1 sibling todo                        |
| Talismanic Lens                    | ARC151 | ARC/equipments/ARC151-talismanic-lens.ts                   |      2 | proven subject                                        |
| Tear Asunder (blue)                | ELE205 | ELE/actions/ELE205-tear-asunder-blue.ts                    |      1 | 2 sibling it()                                        |
| Tear Limb from Limb (blue)         | MON222 | MON/actions/MON222-tear-limb-from-limb-blue.ts             |      1 | 2 sibling it(); 1 sibling todo                        |
| Tearing Shuko                      | DYN046 | DYN/equipments/DYN046-tearing-shuko.ts                     |      1 | proven subject                                        |
| Teklo Foundry Heart                | ARC004 | ARC/equipments/ARC004-teklo-foundry-heart.ts               |      1 | proven subject                                        |
| Teklo Leveler                      | EVO009 | EVO/weapons/EVO009-teklo-leveler.ts                        |      1 | 3 sibling it()                                        |
| Teklo Trebuchet 2000 (blue)        | PEN066 | PEN/actions/PEN066-teklo-trebuchet-2000-blue.ts            |      1 | 1 sibling it(); 1 sibling todo                        |
| Teklovossen, Esteemed Magnate      | EVO007 | EVO/heroes/EVO007-teklovossen-esteemed-magnate.ts          |      1 | 3 sibling it()                                        |
| Tempestuous Kiss (red)             | OMN051 | OMN/actions/OMN051-tempestuous-kiss-red.ts                 |      1 | 2 sibling it()                                        |
| Terminator Tank (red)              | EVO055 | EVO/actions/EVO055-terminator-tank-red.ts                  |      1 | 3 sibling it()                                        |
| That All You Got? (yellow)         | UPR189 | UPR/defense-reactions/UPR189-that-all-you-got-yellow.ts    |      1 | 2 sibling it()                                        |
| Thick Hide Hunter (yellow)         | HNT246 | HNT/actions/HNT246-thick-hide-hunter-yellow.ts             |      2 | 1 sibling it()                                        |
| Tip the Barkeep (blue)             | SEA132 | SEA/actions/SEA132-tip-the-barkeep-blue.ts                 |      1 | 3 sibling it()                                        |
| Titan's Fist                       | ELE202 | ELE/weapons/ELE202-titan-s-fist.ts                         |      1 | 4 sibling it(); proven subject                        |
| Tough as a Rok (blue)              | PEN285 | PEN/actions/PEN285-tough-as-a-rok-blue.ts                  |      1 | 2 sibling it()                                        |
| Tough Smashup (blue)               | SUP048 | SUP/actions/SUP048-tough-smashup-blue.ts                   |      1 | 2 sibling it()                                        |
| Tough Smashup (yellow)             | SUP047 | SUP/actions/SUP047-tough-smashup-yellow.ts                 |      1 | 2 sibling it()                                        |
| Tuffnut, Bumbling Hulkster         | SUP001 | SUP/heroes/SUP001-tuffnut-bumbling-hulkster.ts             |      1 | 2 sibling it(); 1 sibling todo                        |
| Twinkle Toes                       | OSC006 | OSC/equipments/OSC006-twinkle-toes.ts                      |      1 | proven subject                                        |
| Twinning Blade (yellow)            | CRU082 | CRU/attack-reactions/CRU082-twinning-blade-yellow.ts       |      1 | 1 sibling it()                                        |
| Unexpected Backhand (yellow)       | SUP162 | SUP/actions/SUP162-unexpected-backhand-yellow.ts           |      1 | 2 sibling it()                                        |
| Unflinching Foothold               | PEN318 | PEN/equipments/PEN318-unflinching-foothold.ts              |      1 | proven subject                                        |
| Unsheathed (red)                   | ROS248 | ROS/actions/ROS248-unsheathed-red.ts                       |      2 | 2 sibling it()                                        |
| Unyielding Grip                    | PEN317 | PEN/equipments/PEN317-unyielding-grip.ts                   |      1 | proven subject                                        |
| Valiant Dynamo                     | MON107 | MON/equipments/MON107-valiant-dynamo.ts                    |      1 | 2 sibling it(); 1 sibling todo                        |
| Vengeful Apparition (blue)         | ENG022 | ENG/actions/ENG022-vengeful-apparition-blue.ts             |      1 | 2 sibling it(); 1 sibling todo                        |
| Vexing Quillhand                   | EVR103 | EVR/equipments/EVR103-vexing-quillhand.ts                  |      2 | proven subject                                        |
| Vigorous Smashup (blue)            | SUP166 | SUP/actions/SUP166-vigorous-smashup-blue.ts                |      1 | 2 sibling it()                                        |
| Vigorous Smashup (red)             | SUP164 | SUP/actions/SUP164-vigorous-smashup-red.ts                 |      1 | 2 sibling it()                                        |
| Vigorous Smashup (yellow)          | SUP165 | SUP/actions/SUP165-vigorous-smashup-yellow.ts              |      2 | 2 sibling it()                                        |
| Voltbound Duality (red)            | OMN077 | OMN/actions/OMN077-voltbound-duality-red.ts                |      1 | 3 sibling it()                                        |
| Voltic Vanguard                    | PEN240 | PEN/equipments/PEN240-voltic-vanguard.ts                   |      1 | proven subject                                        |
| Volzar, Meteor Storm               | OMN096 | OMN/weapons/OMN096-volzar-meteor-storm.ts                  |      2 | 2 sibling it()                                        |
| Vynnset, Iron Maiden               | DTD133 | DTD/heroes/DTD133-vynnset-iron-maiden.ts                   |      2 | 2 sibling it(); proven subject                        |
| Wailer Humperdinck (yellow)        | SEA052 | SEA/actions/SEA052-wailer-humperdinck-yellow.ts            |      1 | 3 sibling it()                                        |
| War Machine (red)                  | EVO056 | EVO/actions/EVO056-war-machine-red.ts                      |      1 | 3 sibling it()                                        |
| Warmonger's Diplomacy (blue)       | DTD230 | DTD/actions/DTD230-warmonger-s-diplomacy-blue.ts           |      2 | 2 sibling todo                                        |
| Warrior's Valor (blue)             | TEA025 | TEA/actions/TEA025-warrior-s-valor-blue.ts                 |      1 | 2 sibling it()                                        |
| Warrior's Valor (red)              | WTR129 | WTR/actions/WTR129-warrior-s-valor-red.ts                  |      1 | 2 sibling it()                                        |
| Weave Lightning (red)              | ELE180 | ELE/actions/ELE180-weave-lightning-red.ts                  |      1 | 3 sibling it()                                        |
| Widespread Annihilation (blue)     | DTD137 | DTD/actions/DTD137-widespread-annihilation-blue.ts         |      2 | 3 sibling it(); 1 sibling todo                        |
| Widespread Destruction (yellow)    | DTD138 | DTD/actions/DTD138-widespread-destruction-yellow.ts        |      2 | 3 sibling it(); 1 sibling todo                        |
| Widespread Ruin (red)              | DTD139 | DTD/actions/DTD139-widespread-ruin-red.ts                  |      2 | 3 sibling it(); 1 sibling todo                        |
| Wind Up the Crowd (blue)           | SUP006 | SUP/actions/SUP006-wind-up-the-crowd-blue.ts               |      1 | 2 sibling it()                                        |
| Wrecker Romp (blue)                | RNR023 | RNR/actions/RNR023-wrecker-romp-blue.ts                    |      2 | 2 sibling it()                                        |
| Zero to Sixty (red)                | ARC026 | ARC/actions/ARC026-zero-to-sixty-red.ts                    |      1 | 2 sibling it()                                        |
| Zipper Hit (red)                   | ARC029 | ARC/actions/ARC029-zipper-hit-red.ts                       |      1 | proven subject                                        |
| Zyggy Starlight                    | AZS001 | AZS/heroes/AZS001-zyggy-starlight.ts                       |      1 | 2 sibling it()                                        |

## reviewed-tested (116)

| Printing                         | Code   | Module                                                  | Decks | Notes                                 |
| -------------------------------- | ------ | ------------------------------------------------------- | ----: | ------------------------------------- |
| Aether Spindle (blue)            | ARC128 | ARC/actions/ARC128-aether-spindle-blue.ts               |     1 | 2 sibling it(); 1 sibling todo        |
| Aether Spindle (red)             | ARC126 | ARC/actions/ARC126-aether-spindle-red.ts                |     1 | 2 sibling it(); 1 sibling todo        |
| Aethersling (red)                | OMN134 | OMN/actions/OMN134-aethersling-red.ts                   |     2 | 2 sibling it(); 1 sibling todo        |
| Aetherstorm Wellingtons          | PEN110 | PEN/equipments/PEN110-aetherstorm-wellingtons.ts        |     1 | 2 sibling it()                        |
| Aggressive Pounce (red)          | PEN009 | PEN/actions/PEN009-aggressive-pounce-red.ts             |     1 | 2 sibling todo                        |
| Alpha Instinct (blue)            | ARR022 | ARR/actions/ARR022-alpha-instinct-blue.ts               |     1 | 2 sibling it()                        |
| Anka, Drag Under (yellow)        | AGB014 | AGB/actions/AGB014-anka-drag-under-yellow.ts            |     1 | 1 sibling it(); 2 sibling todo        |
| Arc Lightning (yellow)           | ROS010 | ROS/actions/ROS010-arc-lightning-yellow.ts              |     1 | 2 sibling it(); 1 sibling todo        |
| Arcane Lantern                   | EVR155 | EVR/equipments/EVR155-arcane-lantern.ts                 |     1 | 2 sibling it()                        |
| Arcane Twining (blue)            | ROS188 | ROS/actions/ROS188-arcane-twining-blue.ts               |     1 | 2 sibling it()                        |
| Arcanic Shockwave (red)          | ELE073 | ELE/actions/ELE073-arcanic-shockwave-red.ts             |     1 | 2 sibling it(); 1 sibling todo        |
| Autumn's Touch (blue)            | ELE130 | ELE/actions/ELE130-autumn-s-touch-blue.ts               |     1 | empty functional text; 2 sibling it() |
| Back Alley Breakline (blue)      | ARC178 | ARC/actions/ARC178-back-alley-breakline-blue.ts         |     1 | 2 sibling it(); 1 sibling todo        |
| Bare Fangs (red)                 | EVR008 | EVR/actions/EVR008-bare-fangs-red.ts                    |     1 | 2 sibling it()                        |
| Beast Within (yellow)            | CRU007 | CRU/actions/CRU007-beast-within-yellow.ts               |     1 | 2 sibling it(); 1 sibling todo        |
| Beseech the Demigon (red)        | DTD187 | DTD/actions/DTD187-beseech-the-demigon-red.ts           |     2 | 2 sibling it()                        |
| Blade Beckoner Helm              | HNT216 | HNT/equipments/HNT216-blade-beckoner-helm.ts            |     2 | proven subject                        |
| Blaze Headlong (red)             | FAI010 | FAI/actions/FAI010-blaze-headlong-red.ts                |     1 | 2 sibling it()                        |
| Blizzard (blue)                  | ELE147 | ELE/instants/ELE147-blizzard-blue.ts                    |     1 | 1 sibling it(); 1 sibling todo        |
| Blood on Her Hands (yellow)      | EVR055 | EVR/actions/EVR055-blood-on-her-hands-yellow.ts         |     1 | 3 sibling todo                        |
| Bracers of Belief                | ARC153 | ARC/equipments/ARC153-bracers-of-belief.ts              |     1 | proven subject                        |
| Buckwild (blue)                  | SUP145 | SUP/actions/SUP145-buckwild-blue.ts                     |     1 | 2 sibling it()                        |
| Buckwild (red)                   | SUP143 | SUP/actions/SUP143-buckwild-red.ts                      |     1 | 2 sibling it()                        |
| Buckwild (yellow)                | SUP144 | SUP/actions/SUP144-buckwild-yellow.ts                   |     2 | 2 sibling it()                        |
| Channel Iceloch Glaze (blue)     | PEN229 | PEN/actions/PEN229-channel-iceloch-glaze-blue.ts        |     1 | 3 sibling it(); 1 sibling todo        |
| Channel Lake Frigid (blue)       | ELE146 | ELE/actions/ELE146-channel-lake-frigid-blue.ts          |     1 | 3 sibling it()                        |
| Chromatic Refinement (red)       | OMN193 | OMN/instants/OMN193-chromatic-refinement-red.ts         |     1 | 2 sibling it(); 1 sibling todo        |
| Cogwerx Base Chest               | EVO015 | EVO/equipments/EVO015-cogwerx-base-chest.ts             |     1 | 2 sibling it()                        |
| Colors of Aria (red)             | PEN206 | PEN/actions/PEN206-colors-of-aria-red.ts                |     1 | 1 sibling it(); 2 sibling todo        |
| Conqueror of the High Seas (red) | SEA130 | SEA/actions/SEA130-conqueror-of-the-high-seas-red.ts    |     1 | 3 sibling it(); 1 sibling todo        |
| Crumble to Eternity (blue)       | AJV018 | AJV/actions/AJV018-crumble-to-eternity-blue.ts          |     1 | 3 sibling it()                        |
| Current Funnel (blue)            | ROS074 | ROS/actions/ROS074-current-funnel-blue.ts               |     1 | 1 sibling it(); 2 sibling todo        |
| Dauntless (red)                  | CRU085 | CRU/actions/CRU085-dauntless-red.ts                     |     1 | 2 sibling it(); 1 sibling todo        |
| Dream Weavers                    | MON090 | MON/equipments/MON090-dream-weavers.ts                  |     1 | proven subject                        |
| Ebbing Arcstride (blue)          | AZS022 | AZS/actions/AZS022-ebbing-arcstride-blue.ts             |     1 | 2 sibling it()                        |
| Ebbing Arcstride (red)           | AZS008 | AZS/actions/AZS008-ebbing-arcstride-red.ts              |     1 | 2 sibling it()                        |
| Electrolyze (red)                | OMN163 | OMN/actions/OMN163-electrolyze-red.ts                   |     1 | 3 sibling it()                        |
| Enflame the Firebrand (red)      | PEN250 | PEN/actions/PEN250-enflame-the-firebrand-red.ts         |     1 | 3 sibling it()                        |
| Enlightened Strike (red)         | WTR159 | WTR/actions/WTR159-enlightened-strike-red.ts            |     4 | 3 sibling todo                        |
| Entwine Lightning (red)          | ELE100 | ELE/actions/ELE100-entwine-lightning-red.ts             |     3 | 2 sibling it()                        |
| Evo Beta Base Chest (blue)       | PEN069 | PEN/equipments/PEN069-evo-beta-base-chest-blue.ts       |     1 | 2 sibling it(); 1 sibling todo        |
| Evo Steel Soul Controller (blue) | EVO028 | EVO/equipments/EVO028-evo-steel-soul-controller-blue.ts |     1 | proven subject                        |
| Evo Steel Soul Processor (blue)  | EVO027 | EVO/equipments/EVO027-evo-steel-soul-processor-blue.ts  |     1 | 2 sibling it()                        |
| Evo Steel Soul Tower (blue)      | EVO029 | EVO/equipments/EVO029-evo-steel-soul-tower-blue.ts      |     1 | 3 sibling it()                        |
| Fabricate (red)                  | EVO146 | EVO/instants/EVO146-fabricate-red.ts                    |     1 | 2 sibling it()                        |
| Flittering Spike (red)           | OMN166 | OMN/actions/OMN166-flittering-spike-red.ts              |     1 | 2 sibling it()                        |
| Flowstate Embodiment (red)       | OMN146 | OMN/actions/OMN146-flowstate-embodiment-red.ts          |     1 | 3 sibling it()                        |
| Fry (red)                        | AUR008 | AUR/actions/AUR008-fry-red.ts                           |     1 | 3 sibling it()                        |
| Goblet of Bloodrun Wine (blue)   | HVY133 | HVY/actions/HVY133-goblet-of-bloodrun-wine-blue.ts      |     1 | 2 sibling it()                        |
| Good Natured Brutality (yellow)  | SUP004 | SUP/actions/SUP004-good-natured-brutality-yellow.ts     |     1 | 2 sibling it()                        |
| Grains of Bloodspill             | HVY097 | HVY/equipments/HVY097-grains-of-bloodspill.ts           |     2 | proven subject                        |
| Grasp of the Arknight            | ARC078 | ARC/equipments/ARC078-grasp-of-the-arknight.ts          |     2 | proven subject                        |
| Harness Lightning (red)          | AUR013 | AUR/actions/AUR013-harness-lightning-red.ts             |     1 | 3 sibling it()                        |
| Heart of Ice                     | ELE144 | ELE/equipments/ELE144-heart-of-ice.ts                   |     1 | proven subject                        |
| Hulk Up (blue)                   | PEN293 | PEN/actions/PEN293-hulk-up-blue.ts                      |     1 | 2 sibling it()                        |
| Imposing Visage (blue)           | EVR022 | EVR/actions/EVR022-imposing-visage-blue.ts              |     1 | 2 sibling todo                        |
| Ironsong Determination (yellow)  | WTR122 | WTR/actions/WTR122-ironsong-determination-yellow.ts     |     1 | 2 sibling it()                        |
| Jack Be Nimble (red)             | SEA201 | SEA/actions/SEA201-jack-be-nimble-red.ts                |     1 | 2 sibling it(); 1 sibling todo        |
| Jaws of Victory (red)            | SUP005 | SUP/actions/SUP005-jaws-of-victory-red.ts               |     1 | 2 sibling it()                        |
| Jittery Bones (blue)             | AGB022 | AGB/actions/AGB022-jittery-bones-blue.ts                |     1 | 2 sibling todo                        |
| Kabuto of Imperial Authority     | HNT115 | HNT/equipments/HNT115-kabuto-of-imperial-authority.ts   |     3 | proven subject                        |
| Last Ditch Effort (blue)         | WTR161 | WTR/actions/WTR161-last-ditch-effort-blue.ts            |     2 | 2 sibling it()                        |
| Lava Burst (red)                 | DRO010 | DRO/actions/DRO010-lava-burst-red.ts                    |     1 | 2 sibling todo                        |
| Lava Vein Loyalty (red)          | FAI015 | FAI/actions/FAI015-lava-vein-loyalty-red.ts             |     1 | 1 sibling it(); 1 sibling todo        |
| Lightning Surge (red)            | ELE189 | ELE/actions/ELE189-lightning-surge-red.ts               |     4 | 2 sibling it()                        |
| Loan Shark (yellow)              | SEA131 | SEA/actions/SEA131-loan-shark-yellow.ts                 |     1 | 3 sibling it(); 1 sibling todo        |
| Malefic Incantation (red)        | FLR015 | FLR/actions/FLR015-malefic-incantation-red.ts           |     2 | 2 sibling it()                        |
| Malefic Incantation (yellow)     | ROS131 | ROS/actions/ROS131-malefic-incantation-yellow.ts        |     2 | 2 sibling it()                        |
| Mangle (red)                     | CRU026 | CRU/actions/CRU026-mangle-red.ts                        |     1 | 3 sibling it()                        |
| Maximum Velocity (red)           | ARC008 | ARC/actions/ARC008-maximum-velocity-red.ts              |     1 | 2 sibling todo                        |
| Meteoric Impact (red)            | OMN118 | OMN/actions/OMN118-meteoric-impact-red.ts               |     2 | 2 sibling todo                        |
| Miraging Metamorph (red)         | EVR139 | EVR/actions/EVR139-miraging-metamorph-red.ts            |     1 | 2 sibling it()                        |
| Mordred Tide (red)               | ARC081 | ARC/actions/ARC081-mordred-tide-red.ts                  |     1 | 2 sibling todo                        |
| Nimby (red)                      | SEA220 | SEA/actions/SEA220-nimby-red.ts                         |     1 | 3 sibling it()                        |
| No Hero Stands Alone (yellow)    | SUP020 | SUP/actions/SUP020-no-hero-stands-alone-yellow.ts       |     1 | 3 sibling todo                        |
| Nucleus Aetherbolt (red)         | OMN135 | OMN/actions/OMN135-nucleus-aetherbolt-red.ts            |     1 | 2 sibling it(); 1 sibling todo        |
| Nullrune Boots                   | ARC158 | ARC/equipments/ARC158-nullrune-boots.ts                 |     1 | 2 sibling it()                        |
| Nullrune Gloves                  | ARC157 | ARC/equipments/ARC157-nullrune-gloves.ts                |     3 | 2 sibling it()                        |
| Nullrune Hood                    | ARC155 | ARC/equipments/ARC155-nullrune-hood.ts                  |     5 | 2 sibling it()                        |
| Oasis Respite (red)              | DRO027 | DRO/instants/DRO027-oasis-respite-red.ts                |     1 | 2 sibling it()                        |
| Oath of Loyalty (red)            | HNT149 | HNT/actions/HNT149-oath-of-loyalty-red.ts               |     1 | 1 sibling it(); 2 sibling todo        |
| Painful Premonition (blue)       | PEN116 | PEN/actions/PEN116-painful-premonition-blue.ts          |     1 | 3 sibling it()                        |
| Path of Same Ends (red)          | OMN065 | OMN/actions/OMN065-path-of-same-ends-red.ts             |     2 | 3 sibling it()                        |
| Photon Splicing (blue)           | ROS206 | ROS/actions/ROS206-photon-splicing-blue.ts              |     1 | 3 sibling it()                        |
| Portside Exchange (blue)         | AGB029 | AGB/actions/AGB029-portside-exchange-blue.ts            |     1 | 3 sibling it()                        |
| Predatory Plating                | PEN003 | PEN/equipments/PEN003-predatory-plating.ts              |     1 | proven subject                        |
| Pulping (red)                    | MON223 | MON/actions/MON223-pulping-red.ts                       |     1 | 3 sibling it()                        |
| Revel in Runeblood (red)         | EVR106 | EVR/actions/EVR106-revel-in-runeblood-red.ts            |     2 | 2 sibling it(); 1 sibling todo        |
| Rising Resentment (red)          | UPR075 | UPR/actions/UPR075-rising-resentment-red.ts             |     1 | 2 sibling it()                        |
| Ronin Renegade (red)             | FAI019 | FAI/actions/FAI019-ronin-renegade-red.ts                |     1 | 3 sibling it()                        |
| Ruby Amulet (blue)               | SEA196 | SEA/actions/SEA196-ruby-amulet-blue.ts                  |     1 | 2 sibling it()                        |
| Runeblood Incantation (red)      | EVR107 | EVR/actions/EVR107-runeblood-incantation-red.ts         |     2 | 3 sibling it()                        |
| Scar for a Scar (red)            | IRA009 | IRA/actions/IRA009-scar-for-a-scar-red.ts               |     6 | 2 sibling it()                        |
| Second Strike (red)              | AUA016 | AUA/actions/AUA016-second-strike-red.ts                 |     4 | 2 sibling it()                        |
| Send Packing (yellow)            | HVY012 | HVY/actions/HVY012-send-packing-yellow.ts               |     2 | 1 sibling it(); 1 sibling todo        |
| Shimmers of Silver (blue)        | EVR140 | EVR/actions/EVR140-shimmers-of-silver-blue.ts           |     1 | 1 sibling it(); 1 sibling todo        |
| Shock Charmers                   | ELE173 | ELE/equipments/ELE173-shock-charmers.ts                 |     1 | proven subject                        |
| Sigil of Brilliance (yellow)     | ROS022 | ROS/instants/ROS022-sigil-of-brilliance-yellow.ts       |     1 | 2 sibling it(); 1 sibling todo        |
| Skyzyk (red)                     | AST013 | AST/actions/AST013-skyzyk-red.ts                        |     1 | 1 sibling it(); 1 sibling todo        |
| Slice and Dice (red)             | EVR057 | EVR/actions/EVR057-slice-and-dice-red.ts                |     1 | 1 sibling it(); 1 sibling todo        |
| Slice and Dice (yellow)          | EVR058 | EVR/actions/EVR058-slice-and-dice-yellow.ts             |     1 | 1 sibling it(); 1 sibling todo        |
| Snapback (red)                   | CRU174 | CRU/actions/CRU174-snapback-red.ts                      |     2 | 3 sibling it()                        |
| Snatch (red)                     | WTR167 | WTR/actions/WTR167-snatch-red.ts                        |     5 | 2 sibling it()                        |
| Sonata Galaxia (red)             | HVY251 | HVY/actions/HVY251-sonata-galaxia-red.ts                |     2 | 2 sibling it(); 1 sibling todo        |
| Spears of Surreality (blue)      | MON103 | MON/actions/MON103-spears-of-surreality-blue.ts         |     1 | 3 sibling it()                        |
| Spears of Surreality (red)       | MON101 | MON/actions/MON101-spears-of-surreality-red.ts          |     1 | 3 sibling it()                        |
| Succumb to Temptation (yellow)   | ROS119 | ROS/actions/ROS119-succumb-to-temptation-yellow.ts      |     2 | 1 sibling it(); 3 sibling todo        |
| Tear Through the Portal (red)    | DTD190 | DTD/actions/DTD190-tear-through-the-portal-red.ts       |     1 | 2 sibling it(); 1 sibling todo        |
| Trot Along (blue)                | HNT240 | HNT/actions/HNT240-trot-along-blue.ts                   |     2 | 2 sibling it()                        |
| Turn to Mindfire (red)           | OMN136 | OMN/actions/OMN136-turn-to-mindfire-red.ts              |     1 | 2 sibling it()                        |
| Twin Drive (red)                 | EVO142 | EVO/actions/EVO142-twin-drive-red.ts                    |     1 | 2 sibling it()                        |
| Voltic Bolt (blue)               | ARC149 | ARC/actions/ARC149-voltic-bolt-blue.ts                  |     1 | 2 sibling it()                        |
| Voltic Bolt (red)                | ARC147 | ARC/actions/ARC147-voltic-bolt-red.ts                   |     1 | 2 sibling it()                        |
| Whisper of the Oracle (blue)     | ARC217 | ARC/actions/ARC217-whisper-of-the-oracle-blue.ts        |     1 | 3 sibling it()                        |
| Whisper of the Oracle (red)      | ARC215 | ARC/actions/ARC215-whisper-of-the-oracle-red.ts         |     1 | 3 sibling it()                        |
| Wild Ride (red)                  | EVR011 | EVR/actions/EVR011-wild-ride-red.ts                     |     1 | 1 sibling it(); 2 sibling todo        |
