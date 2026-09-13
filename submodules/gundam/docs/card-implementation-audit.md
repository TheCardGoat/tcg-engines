# Card Implementation Audit

Generated from `packages/cards/src/cards/**/*.ts` and matching card tests.

## Summary

- Total card definitions scanned: 1110
- Reminder/setup-only card definitions excluded: 127
- Cards with effect text still needing implementation or verification: 199
- Cards with effect text but empty `effects: []`: 5
- Cards with parsed effect shells that contain `directives: []`: 8
- Cards with todo/skip tests: 0
- Cards with effect text and no matching test file: 198

## Missing Work By Mechanic

| Bucket | Cards |
| pilot pairing/link resident effects | 39 |
| conditional branches/replacements | 32 |
| blocker or attack redirection | 28 |
| dedicated runtime scenario missing | 25 |
| link timing triggers | 21 |
| trash recursion or trash-count conditions | 13 |
| destroyed triggers | 11 |
| command burst dispatch | 9 |
| place/use EX Resource | 6 |
| damage prevention/reduction | 5 |
| deck reveal/mill conditions | 5 |
| unclassified parser gap | 2 |
| zone cost modifiers | 2 |
| support ability plumbing | 1 |

## Missing Work By Set

| Set | Cards |
| GD05 | 112 |
| EB01 | 79 |
| ST10 | 8 |

## Missing Work By Type

| Type | Cards |
| unit | 115 |
| pilot | 35 |
| command | 34 |
| base | 15 |

## Card List

| Card | Type | Bucket | Evidence |
| [EB01-001 Gundam Astray Red Frame Custom (EX)](../packages/cards/src/cards/eb01/unit/001-gundam-astray-red-frame-custom-ex.ts) | unit | trash recursion or trash-count conditions | no test file<br>timing: activate:main |
| [EB01-002 Hi-Nu Gundam (EX)](../packages/cards/src/cards/eb01/unit/002-hi-nu-gundam-ex.ts) | unit | link timing triggers | no test file<br>timing: attack, deploy |
| [EB01-003 Narrative Gundam A-Packs (EX)](../packages/cards/src/cards/eb01/unit/003-narrative-gundam-a-packs-ex.ts) | unit | pilot pairing/link resident effects | empty effects |
| [EB01-004 Gundam Barbatos Lupus Rex (EX)](../packages/cards/src/cards/eb01/unit/004-gundam-barbatos-lupus-rex-ex.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: whenHealed |
| [EB01-005 Zeta Gundam Ⅲ P2 Type](../packages/cards/src/cards/eb01/unit/005-zeta-gundam-p2-type.ts) | unit | dedicated runtime scenario missing | no test file<br>timing: deploy |
| [EB01-006 Gundam Astray Gold Frame Amatsu](../packages/cards/src/cards/eb01/unit/006-gundam-astray-gold-frame-amatsu.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: deploy |
| [EB01-008 Gundam Delta Kai](../packages/cards/src/cards/eb01/unit/008-gundam-delta-kai.ts) | unit | trash recursion or trash-count conditions | no test file<br>timing: deploy |
| [EB01-009 Gundam Full Armor (Thunderbolt) (EX)](../packages/cards/src/cards/eb01/unit/009-gundam-full-armor-thunderbolt-ex.ts) | unit | dedicated runtime scenario missing | no test file<br>timing: deploy |
| [EB01-010 Gundam Barbatos 6th Form](../packages/cards/src/cards/eb01/unit/010-gundam-barbatos-6th-form.ts) | unit | trash recursion or trash-count conditions | no test file<br>timing: deploy |
| [EB01-013 Red Gundam(0085)](../packages/cards/src/cards/eb01/unit/013-red-gundam-0085.ts) | unit | conditional branches/replacements | no test file<br>timing: attack |
| [EB01-014 Gouf Vijayanta](../packages/cards/src/cards/eb01/unit/014-gouf-vijayanta.ts) | unit | dedicated runtime scenario missing | no test file |
| [EB01-015 Prototype Asshimar TR-3 "Kehaar"](../packages/cards/src/cards/eb01/unit/015-prototype-asshimar-tr-3-kehaar.ts) | unit | destroyed triggers | no test file<br>timing: destroyed |
| [EB01-017 Haro](../packages/cards/src/cards/eb01/unit/017-haro.ts) | unit | destroyed triggers | no test file<br>timing: destroyed |
| [EB01-018 Gundam Astray Blue Frame Second L](../packages/cards/src/cards/eb01/unit/018-gundam-astray-blue-frame-second-l.ts) | unit | dedicated runtime scenario missing | no test file<br>timing: attack |
| [EB01-019 Gundam Pixy](../packages/cards/src/cards/eb01/unit/019-gundam-pixy.ts) | unit | conditional branches/replacements | no test file<br>timing: attack |
| [EB01-020 Gundam Mk-Ⅲ](../packages/cards/src/cards/eb01/unit/020-gundam-mk.ts) | unit | link timing triggers | no test file<br>timing: activate:action |
| [EB01-021 Build Strike Gundam (Full Package) (EX)](../packages/cards/src/cards/eb01/unit/021-build-strike-gundam-full-package-ex.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: whenPaired |
| [EB01-022 Gundam Exia (EX)](../packages/cards/src/cards/eb01/unit/022-gundam-exia-ex.ts) | unit | pilot pairing/link resident effects | no test file |
| [EB01-023 Le Cygne (EX)](../packages/cards/src/cards/eb01/unit/023-le-cygne-ex.ts) | unit | deck reveal/mill conditions | no test file<br>timing: attack |
| [EB01-024 GQuuuuuuX (Omega Psycommu)](../packages/cards/src/cards/eb01/unit/024-gquuuuuux-omega-psycommu.ts) | unit | blocker or attack redirection | no test file<br>timing: attack |
| [EB01-025 Tallgeese Ⅱ](../packages/cards/src/cards/eb01/unit/025-tallgeese.ts) | unit | place/use EX Resource | no test file<br>timing: deploy |
| [EB01-027 Tallgeese](../packages/cards/src/cards/eb01/unit/027-tallgeese.ts) | unit | trash recursion or trash-count conditions | no test file<br>timing: deploy |
| [EB01-028 Gundam Plutone](../packages/cards/src/cards/eb01/unit/028-gundam-plutone.ts) | unit | conditional branches/replacements | no test file |
| [EB01-029 Gundam Astaroth Rinascimento (EX)](../packages/cards/src/cards/eb01/unit/029-gundam-astaroth-rinascimento-ex.ts) | unit | blocker or attack redirection | no test file<br>timing: deploy |
| [EB01-030 Big-Rang](../packages/cards/src/cards/eb01/unit/030-big-rang.ts) | unit | deck reveal/mill conditions | no test file<br>timing: deploy |
| [EB01-031 Oggo](../packages/cards/src/cards/eb01/unit/031-oggo.ts) | unit | blocker or attack redirection | no test file |
| [EB01-033 Taurus (Sanc Kingdom)](../packages/cards/src/cards/eb01/unit/033-taurus-sanc-kingdom.ts) | unit | dedicated runtime scenario missing | no test file<br>timing: activate:action |
| [EB01-034 Gundam Lfrith Ur](../packages/cards/src/cards/eb01/unit/034-gundam-lfrith-ur.ts) | unit | link timing triggers | no test file<br>timing: whenLinked |
| [EB01-035 Gundam Lfrith Thorn](../packages/cards/src/cards/eb01/unit/035-gundam-lfrith-thorn.ts) | unit | unclassified parser gap | empty effects<br>no test file |
| [EB01-036 Darilbalde](../packages/cards/src/cards/eb01/unit/036-darilbalde.ts) | unit | dedicated runtime scenario missing | no test file |
| [EB01-037 Zudah Unit 1](../packages/cards/src/cards/eb01/unit/037-zudah-unit-1.ts) | unit | blocker or attack redirection | no test file |
| [EB01-038 G-Self](../packages/cards/src/cards/eb01/unit/038-g-self.ts) | unit | place/use EX Resource | no test file<br>timing: deploy |
| [EB01-039 Rising Freedom Gundam](../packages/cards/src/cards/eb01/unit/039-rising-freedom-gundam.ts) | unit | conditional branches/replacements | empty effects<br>no test file |
| [EB01-040 Gundam Epyon](../packages/cards/src/cards/eb01/unit/040-gundam-epyon.ts) | unit | conditional branches/replacements | no test file<br>timing: deploy |
| [EB01-041 Strike Freedom Gundam (EX)](../packages/cards/src/cards/eb01/unit/041-strike-freedom-gundam-ex.ts) | unit | conditional branches/replacements | empty directives<br>no test file<br>timing: deploy |
| [EB01-042 Psycho Haro (EX)](../packages/cards/src/cards/eb01/unit/042-psycho-haro-ex.ts) | unit | blocker or attack redirection | no test file<br>timing: attack |
| [EB01-043 Blue Destiny Unit-1 (EX)](../packages/cards/src/cards/eb01/unit/043-blue-destiny-unit-1-ex.ts) | unit | blocker or attack redirection | no test file<br>timing: attack |
| [EB01-044 Justice Gundam (EX)](../packages/cards/src/cards/eb01/unit/044-justice-gundam-ex.ts) | unit | blocker or attack redirection | no test file<br>timing: deploy |
| [EB01-045 Psycho Zaku (EX)](../packages/cards/src/cards/eb01/unit/045-psycho-zaku-ex.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: whenPaired |
| [EB01-046 Striker Custom (EX)](../packages/cards/src/cards/eb01/unit/046-striker-custom-ex.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: attack |
| [EB01-047 Casval's Gundam](../packages/cards/src/cards/eb01/unit/047-casval-s-gundam.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: whenPaired |
| [EB01-049 Pale Rider (Ground Heavy Equipment Type)](../packages/cards/src/cards/eb01/unit/049-pale-rider-ground-heavy-equipment-type.ts) | unit | blocker or attack redirection | no test file |
| [EB01-050 Saikoro Gundam](../packages/cards/src/cards/eb01/unit/050-saikoro-gundam.ts) | unit | trash recursion or trash-count conditions | no test file<br>timing: attack |
| [EB01-052 Hildolfr](../packages/cards/src/cards/eb01/unit/052-hildolfr.ts) | unit | conditional branches/replacements | no test file<br>timing: deploy |
| [EB01-055 Dom Gross Beil](../packages/cards/src/cards/eb01/unit/055-dom-gross-beil.ts) | unit | conditional branches/replacements | no test file |
| [EB01-057 Gundam Geminass 02](../packages/cards/src/cards/eb01/unit/057-gundam-geminass-02.ts) | unit | conditional branches/replacements | no test file<br>timing: deploy |
| [EB01-058 Extreme Gundam](../packages/cards/src/cards/eb01/unit/058-extreme-gundam.ts) | unit | blocker or attack redirection | no test file |
| [EB01-059 Psycho Zaku](../packages/cards/src/cards/eb01/unit/059-psycho-zaku.ts) | unit | link timing triggers | no test file<br>timing: attack |
| [EB01-060 Gundam Aquarius](../packages/cards/src/cards/eb01/unit/060-gundam-aquarius.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: whenPaired |
| [EB01-061 Ellis Claude](../packages/cards/src/cards/eb01/pilot/061-ellis-claude.ts) | pilot | pilot pairing/link resident effects | no test file<br>timing: burst, whenPaired |
| [EB01-062 Jona Basta](../packages/cards/src/cards/eb01/pilot/062-jona-basta.ts) | pilot | conditional branches/replacements | no test file<br>timing: attack, burst |
| [EB01-063 Io Fleming](../packages/cards/src/cards/eb01/pilot/063-io-fleming.ts) | pilot | pilot pairing/link resident effects | no test file<br>timing: burst |
| [EB01-064 Rondo Gina Sahaku](../packages/cards/src/cards/eb01/pilot/064-rondo-gina-sahaku.ts) | pilot | pilot pairing/link resident effects | no test file<br>timing: burst |
| [EB01-065 Meir Siva](../packages/cards/src/cards/eb01/pilot/065-meir-siva.ts) | pilot | link timing triggers | no test file<br>timing: burst, whenLinked |
| [EB01-066 Reiji](../packages/cards/src/cards/eb01/pilot/066-reiji.ts) | pilot | blocker or attack redirection | no test file<br>timing: burst, whenPaired |
| [EB01-067 Asuna Elmarit](../packages/cards/src/cards/eb01/pilot/067-asuna-elmarit.ts) | pilot | pilot pairing/link resident effects | no test file<br>timing: burst, whenPaired |
| [EB01-068 Chall Acustica](../packages/cards/src/cards/eb01/pilot/068-chall-acustica.ts) | pilot | pilot pairing/link resident effects | no test file<br>timing: burst, destroyed |
| [EB01-069 Beside Pain](../packages/cards/src/cards/eb01/pilot/069-beside-pain.ts) | pilot | blocker or attack redirection | no test file<br>timing: attack, burst |
| [EB01-070 Daryl Lorenz](../packages/cards/src/cards/eb01/pilot/070-daryl-lorenz.ts) | pilot | link timing triggers | no test file<br>timing: activate:action, burst |
| [EB01-071 Ittou Tsurugi](../packages/cards/src/cards/eb01/pilot/071-ittou-tsurugi.ts) | pilot | link timing triggers | no test file<br>timing: burst |
| [EB01-072 Yuu Kajima](../packages/cards/src/cards/eb01/pilot/072-yuu-kajima.ts) | pilot | blocker or attack redirection | no test file<br>timing: burst, whenPaired |
| [EB01-073 Character Requests](../packages/cards/src/cards/eb01/command/073-character-requests.ts) | command | command burst dispatch | no test file<br>timing: burst, main |
| [EB01-074 Eternal Road](../packages/cards/src/cards/eb01/command/074-eternal-road.ts) | command | command burst dispatch | no test file<br>timing: action, burst, main |
| [EB01-075 Fierce Enemy Assault](../packages/cards/src/cards/eb01/command/075-fierce-enemy-assault.ts) | command | conditional branches/replacements | no test file<br>timing: action, main |
| [EB01-076 Gerbera Straight](../packages/cards/src/cards/eb01/command/076-gerbera-straight.ts) | command | dedicated runtime scenario missing | no test file<br>timing: action, main |
| [EB01-077 Master League Begins](../packages/cards/src/cards/eb01/command/077-master-league-begins.ts) | command | blocker or attack redirection | empty directives<br>no test file<br>timing: action, burst |
| [EB01-078 Premium Unit Assembly](../packages/cards/src/cards/eb01/command/078-premium-unit-assembly.ts) | command | deck reveal/mill conditions | no test file<br>timing: main |
| [EB01-079 Modification](../packages/cards/src/cards/eb01/command/079-modification.ts) | command | dedicated runtime scenario missing | no test file<br>timing: main |
| [EB01-080 Sturm Faust](../packages/cards/src/cards/eb01/command/080-sturm-faust.ts) | command | blocker or attack redirection | no test file<br>timing: action, main |
| [EB01-081 MAP Weapon](../packages/cards/src/cards/eb01/command/081-map-weapon.ts) | command | command burst dispatch | empty directives<br>no test file<br>timing: action, burst, main |
| [EB01-082 Warship Cruise](../packages/cards/src/cards/eb01/command/082-warship-cruise.ts) | command | command burst dispatch | empty directives<br>no test file<br>timing: action, burst |
| [EB01-083 SP Conversion Chips](../packages/cards/src/cards/eb01/command/083-sp-conversion-chips.ts) | command | conditional branches/replacements | no test file<br>timing: action |
| [EB01-084 30cm Cannon (APFSDS Round)](../packages/cards/src/cards/eb01/command/084-30cm-cannon-apfsds-round.ts) | command | blocker or attack redirection | no test file<br>timing: action, main |
| [EB01-085 Kudelia Aina Bernstein & Isaribi](../packages/cards/src/cards/eb01/base/085-kudelia-aina-bernstein-isaribi.ts) | base | dedicated runtime scenario missing | no test file<br>timing: burst, deploy |
| [EB01-086 Kycilia Zabi & Gwazine](../packages/cards/src/cards/eb01/base/086-kycilia-zabi-gwazine.ts) | base | pilot pairing/link resident effects | no test file<br>timing: burst, deploy, whenLinked |
| [EB01-087 Marina Ismail & Ptolemaios 2](../packages/cards/src/cards/eb01/base/087-marina-ismail-ptolemaios-2.ts) | base | conditional branches/replacements | no test file<br>timing: burst, deploy |
| [EB01-088 Miorine Rembran & Academy Ship](../packages/cards/src/cards/eb01/base/088-miorine-rembran-academy-ship.ts) | base | dedicated runtime scenario missing | no test file<br>timing: burst, deploy |
| [EB01-089 Lacus Clyne & Eternal](../packages/cards/src/cards/eb01/base/089-lacus-clyne-eternal.ts) | base | dedicated runtime scenario missing | no test file<br>timing: burst, deploy |
| [EB01-090 Tiffa Adill & Freeden](../packages/cards/src/cards/eb01/base/090-tiffa-adill-freeden.ts) | base | conditional branches/replacements | no test file<br>timing: burst, deploy |
| [GD05-001 V2 Gundam](../packages/cards/src/cards/gd05/unit/001-v2-gundam.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: activate:main |
| [GD05-002 Strike Freedom Gundam](../packages/cards/src/cards/gd05/unit/002-strike-freedom-gundam.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: attack, deploy |
| [GD05-003 Waldfeld's Murasame](../packages/cards/src/cards/gd05/unit/003-waldfeld-s-murasame.ts) | unit | destroyed triggers | no test file<br>timing: destroyed |
| [GD05-004 Akatsuki (Oowashi)](../packages/cards/src/cards/gd05/unit/004-akatsuki-oowashi.ts) | unit | link timing triggers | no test file<br>timing: whenLinked |
| [GD05-006 Hashmal](../packages/cards/src/cards/gd05/unit/006-hashmal.ts) | unit | pilot pairing/link resident effects | no test file |
| [GD05-007 Asshimar](../packages/cards/src/cards/gd05/unit/007-asshimar.ts) | unit | pilot pairing/link resident effects | no test file |
| [GD05-008 Dijeh](../packages/cards/src/cards/gd05/unit/008-dijeh.ts) | unit | zone cost modifiers | no test file |
| [GD05-011 Calamity Gundam & Raider Gundam](../packages/cards/src/cards/gd05/unit/011-calamity-gundam-raider-gundam.ts) | unit | conditional branches/replacements | no test file<br>timing: deploy |
| [GD05-012 Forbidden Gundam](../packages/cards/src/cards/gd05/unit/012-forbidden-gundam.ts) | unit | link timing triggers | no test file<br>timing: whenLinked |
| [GD05-015 M1 Astray Shrike](../packages/cards/src/cards/gd05/unit/015-m1-astray-shrike.ts) | unit | dedicated runtime scenario missing | no test file<br>timing: deploy |
| [GD05-016 Murasame](../packages/cards/src/cards/gd05/unit/016-murasame.ts) | unit | unclassified parser gap | empty effects<br>no test file |
| [GD05-017 Nu Gundam](../packages/cards/src/cards/gd05/unit/017-nu-gundam.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: whenPaired |
| [GD05-018 Gundam Calibarn](../packages/cards/src/cards/gd05/unit/018-gundam-calibarn.ts) | unit | place/use EX Resource | no test file<br>timing: deploy |
| [GD05-019 Re-GZ](../packages/cards/src/cards/gd05/unit/019-re-gz.ts) | unit | destroyed triggers | no test file<br>timing: destroyed |
| [GD05-020 Nu Gundam](../packages/cards/src/cards/gd05/unit/020-nu-gundam.ts) | unit | place/use EX Resource | no test file<br>timing: deploy |
| [GD05-021 Gundam AGE-2 Double Bullet](../packages/cards/src/cards/gd05/unit/021-gundam-age-2-double-bullet.ts) | unit | damage prevention/reduction | no test file<br>timing: activate:action |
| [GD05-022 Gundam Schwarzette](../packages/cards/src/cards/gd05/unit/022-gundam-schwarzette.ts) | unit | trash recursion or trash-count conditions | no test file<br>timing: activate:action |
| [GD05-023 Re-GZ BWS](../packages/cards/src/cards/gd05/unit/023-re-gz-bws.ts) | unit | place/use EX Resource | no test file<br>timing: deploy |
| [GD05-024 Gundam AGE-2 Normal (SP Ver.)](../packages/cards/src/cards/gd05/unit/024-gundam-age-2-normal-sp-ver.ts) | unit | destroyed triggers | no test file<br>timing: destroyed |
| [GD05-025 Demi Barding](../packages/cards/src/cards/gd05/unit/025-demi-barding.ts) | unit | deck reveal/mill conditions | no test file<br>timing: deploy |
| [GD05-026 Gundam Aerial Rebuild](../packages/cards/src/cards/gd05/unit/026-gundam-aerial-rebuild.ts) | unit | conditional branches/replacements | no test file |
| [GD05-028 Kayra's Jegan](../packages/cards/src/cards/gd05/unit/028-kayra-s-jegan.ts) | unit | blocker or attack redirection | no test file<br>timing: deploy |
| [GD05-029 Kayra's Re-GZ](../packages/cards/src/cards/gd05/unit/029-kayra-s-re-gz.ts) | unit | deck reveal/mill conditions | no test file<br>timing: deploy |
| [GD05-030 Michaelis](../packages/cards/src/cards/gd05/unit/030-michaelis.ts) | unit | blocker or attack redirection | no test file |
| [GD05-033 Master Gundam](../packages/cards/src/cards/gd05/unit/033-master-gundam.ts) | unit | trash recursion or trash-count conditions | no test file<br>timing: attack |
| [GD05-034 Gaia Gundam](../packages/cards/src/cards/gd05/unit/034-gaia-gundam.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: onShieldAreaCardDestroyByBattle |
| [GD05-035 Dragon Gundam](../packages/cards/src/cards/gd05/unit/035-dragon-gundam.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: attack, onShieldAreaCardDestroyByBattle |
| [GD05-036 Haow Gundam](../packages/cards/src/cards/gd05/unit/036-haow-gundam.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: whenPaired |
| [GD05-037 Destroy Gundam](../packages/cards/src/cards/gd05/unit/037-destroy-gundam.ts) | unit | link timing triggers | no test file |
| [GD05-038 Gundam Throne Eins (GN High Mega Launcher)](../packages/cards/src/cards/gd05/unit/038-gundam-throne-eins-gn-high-mega-launcher.ts) | unit | link timing triggers | no test file<br>timing: activate:main |
| [GD05-039 Chaos Gundam](../packages/cards/src/cards/gd05/unit/039-chaos-gundam.ts) | unit | dedicated runtime scenario missing | no test file<br>timing: attack |
| [GD05-040 Abyss Gundam](../packages/cards/src/cards/gd05/unit/040-abyss-gundam.ts) | unit | support ability plumbing | empty effects<br>no test file |
| [GD05-041 Gaia Gundam (MA Mode)](../packages/cards/src/cards/gd05/unit/041-gaia-gundam-ma-mode.ts) | unit | zone cost modifiers | no test file |
| [GD05-044 Gundam Rose](../packages/cards/src/cards/gd05/unit/044-gundam-rose.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: attack |
| [GD05-046 Abyss Gundam (MA Mode)](../packages/cards/src/cards/gd05/unit/046-abyss-gundam-ma-mode.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: whenPaired |
| [GD05-048 Gundam Kyrios (Flight Mode)](../packages/cards/src/cards/gd05/unit/048-gundam-kyrios-flight-mode.ts) | unit | blocker or attack redirection | no test file |
| [GD05-049 Sazabi](../packages/cards/src/cards/gd05/unit/049-sazabi.ts) | unit | conditional branches/replacements | no test file<br>timing: attack |
| [GD05-050 Gundam Exia Repair](../packages/cards/src/cards/gd05/unit/050-gundam-exia-repair.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: destroyed, onBattleDamageDealtToUnit |
| [GD05-051 Gundam Barbatos Lupus Rex](../packages/cards/src/cards/gd05/unit/051-gundam-barbatos-lupus-rex.ts) | unit | dedicated runtime scenario missing | no test file |
| [GD05-052 Sazabi](../packages/cards/src/cards/gd05/unit/052-sazabi.ts) | unit | trash recursion or trash-count conditions | no test file<br>timing: deploy |
| [GD05-053 Quess's Jagd Doga](../packages/cards/src/cards/gd05/unit/053-quess-s-jagd-doga.ts) | unit | destroyed triggers | no test file<br>timing: destroyed |
| [GD05-054 Alpha Azieru](../packages/cards/src/cards/gd05/unit/054-alpha-azieru.ts) | unit | blocker or attack redirection | no test file |
| [GD05-055 Destiny Gundam](../packages/cards/src/cards/gd05/unit/055-destiny-gundam.ts) | unit | damage prevention/reduction | no test file<br>timing: onBattleDamageReceived |
| [GD05-057 Gyunei's Jagd Doga](../packages/cards/src/cards/gd05/unit/057-gyunei-s-jagd-doga.ts) | unit | blocker or attack redirection | no test file<br>timing: activate:main |
| [GD05-059 Gundam Barbatos Lupus](../packages/cards/src/cards/gd05/unit/059-gundam-barbatos-lupus.ts) | unit | conditional branches/replacements | no test file<br>timing: attack |
| [GD05-060 Gundam Flauros (Ryusei-Go)](../packages/cards/src/cards/gd05/unit/060-gundam-flauros-ryusei-go.ts) | unit | dedicated runtime scenario missing | no test file<br>timing: attack, deploy |
| [GD05-061 Geara Doga](../packages/cards/src/cards/gd05/unit/061-geara-doga.ts) | unit | blocker or attack redirection | no test file |
| [GD05-064 Force Impulse Gundam](../packages/cards/src/cards/gd05/unit/064-force-impulse-gundam.ts) | unit | trash recursion or trash-count conditions | no test file<br>timing: deploy |
| [GD05-065 Landman Rodi](../packages/cards/src/cards/gd05/unit/065-landman-rodi.ts) | unit | link timing triggers | no test file |
| [GD05-066 Shining Gundam](../packages/cards/src/cards/gd05/unit/066-shining-gundam.ts) | unit | trash recursion or trash-count conditions | no test file<br>timing: attack, deploy |
| [GD05-067 Wing Gundam Zero (EW)](../packages/cards/src/cards/gd05/unit/067-wing-gundam-zero-ew.ts) | unit | dedicated runtime scenario missing | no test file<br>timing: attack |
| [GD05-068 Shining Gundam (Super Mode)](../packages/cards/src/cards/gd05/unit/068-shining-gundam-super-mode.ts) | unit | link timing triggers | no test file<br>timing: attack |
| [GD05-069 Gundam Maxter](../packages/cards/src/cards/gd05/unit/069-gundam-maxter.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: attack, onDestroyByBattle |
| [GD05-070 Tallgeese Ⅲ](../packages/cards/src/cards/gd05/unit/070-tallgeese.ts) | unit | damage prevention/reduction | no test file<br>timing: onDestroyByBattle |
| [GD05-071 Gundam Sandrock Custom (EW)](../packages/cards/src/cards/gd05/unit/071-gundam-sandrock-custom-ew.ts) | unit | conditional branches/replacements | no test file<br>timing: attack |
| [GD05-072 Rising Gundam](../packages/cards/src/cards/gd05/unit/072-rising-gundam.ts) | unit | link timing triggers | no test file<br>timing: whenLinked |
| [GD05-073 Altron Gundam (EW)](../packages/cards/src/cards/gd05/unit/073-altron-gundam-ew.ts) | unit | dedicated runtime scenario missing | no test file<br>timing: deploy |
| [GD05-074 Noin's Taurus](../packages/cards/src/cards/gd05/unit/074-noin-s-taurus.ts) | unit | destroyed triggers | no test file<br>timing: destroyed |
| [GD05-075 Royal Gundam](../packages/cards/src/cards/gd05/unit/075-royal-gundam.ts) | unit | blocker or attack redirection | no test file |
| [GD05-076 Bolt Gundam](../packages/cards/src/cards/gd05/unit/076-bolt-gundam.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: attack |
| [GD05-078 Gundam Deathscythe Hell (EW)](../packages/cards/src/cards/gd05/unit/078-gundam-deathscythe-hell-ew.ts) | unit | blocker or attack redirection | no test file |
| [GD05-079 Gundam Heavyarms Custom (EW)](../packages/cards/src/cards/gd05/unit/079-gundam-heavyarms-custom-ew.ts) | unit | conditional branches/replacements | no test file<br>timing: activate:main |
| [GD05-081 Kira Yamato](../packages/cards/src/cards/gd05/pilot/081-kira-yamato.ts) | pilot | link timing triggers | no test file<br>timing: burst, whenLinked |
| [GD05-082 Andrew Waldfeld](../packages/cards/src/cards/gd05/pilot/082-andrew-waldfeld.ts) | pilot | pilot pairing/link resident effects | no test file<br>timing: burst |
| [GD05-083 Cagalli Yula Athha](../packages/cards/src/cards/gd05/pilot/083-cagalli-yula-athha.ts) | pilot | pilot pairing/link resident effects | no test file<br>timing: burst, whenPaired |
| [GD05-084 Odelo Henrik](../packages/cards/src/cards/gd05/pilot/084-odelo-henrik.ts) | pilot | damage prevention/reduction | no test file<br>timing: burst |
| [GD05-085 Amuro Ray](../packages/cards/src/cards/gd05/pilot/085-amuro-ray.ts) | pilot | conditional branches/replacements | no test file<br>timing: burst, onDestroyByBattle |
| [GD05-086 Kayra Su](../packages/cards/src/cards/gd05/pilot/086-kayra-su.ts) | pilot | blocker or attack redirection | no test file<br>timing: burst |
| [GD05-087 Lauda Neill](../packages/cards/src/cards/gd05/pilot/087-lauda-neill.ts) | pilot | dedicated runtime scenario missing | no test file<br>timing: burst |
| [GD05-088 Prospera Mercury](../packages/cards/src/cards/gd05/pilot/088-prospera-mercury.ts) | pilot | conditional branches/replacements | no test file<br>timing: burst |
| [GD05-089 Master Asia](../packages/cards/src/cards/gd05/pilot/089-master-asia.ts) | pilot | link timing triggers | no test file<br>timing: attack, burst |
| [GD05-090 Stellar Loussier](../packages/cards/src/cards/gd05/pilot/090-stellar-loussier.ts) | pilot | destroyed triggers | no test file<br>timing: burst, destroyed |
| [GD05-091 Sting Oakley](../packages/cards/src/cards/gd05/pilot/091-sting-oakley.ts) | pilot | trash recursion or trash-count conditions | no test file<br>timing: burst |
| [GD05-092 Auel Neider](../packages/cards/src/cards/gd05/pilot/092-auel-neider.ts) | pilot | link timing triggers | no test file<br>timing: attack, burst |
| [GD05-093 Char Aznable](../packages/cards/src/cards/gd05/pilot/093-char-aznable.ts) | pilot | link timing triggers | no test file<br>timing: burst, whenLinked |
| [GD05-094 Quess Paraya](../packages/cards/src/cards/gd05/pilot/094-quess-paraya.ts) | pilot | destroyed triggers | empty directives<br>no test file<br>timing: burst, destroyed |
| [GD05-095 Gyunei Guss](../packages/cards/src/cards/gd05/pilot/095-gyunei-guss.ts) | pilot | blocker or attack redirection | no test file<br>timing: burst |
| [GD05-096 Chad Chadan](../packages/cards/src/cards/gd05/pilot/096-chad-chadan.ts) | pilot | conditional branches/replacements | no test file<br>timing: attack, burst |
| [GD05-097 Domon Kasshu](../packages/cards/src/cards/gd05/pilot/097-domon-kasshu.ts) | pilot | pilot pairing/link resident effects | no test file<br>timing: burst, whenPaired |
| [GD05-098 Heero Yuy](../packages/cards/src/cards/gd05/pilot/098-heero-yuy.ts) | pilot | conditional branches/replacements | no test file<br>timing: burst, onShieldAreaCardDestroyByBattle |
| [GD05-099 Trowa Barton](../packages/cards/src/cards/gd05/pilot/099-trowa-barton.ts) | pilot | conditional branches/replacements | no test file<br>timing: burst, onDestroyByBattle |
| [GD05-100 Quatre Raberba Winner](../packages/cards/src/cards/gd05/pilot/100-quatre-raberba-winner.ts) | pilot | pilot pairing/link resident effects | no test file<br>timing: burst, whenPaired |
| [GD05-101 Gavane Goonny](../packages/cards/src/cards/gd05/pilot/101-gavane-goonny.ts) | pilot | conditional branches/replacements | no test file<br>timing: burst, onUnitEffectCostPaid |
| [GD05-102 Wings of Light](../packages/cards/src/cards/gd05/command/102-wings-of-light.ts) | command | conditional branches/replacements | no test file<br>timing: action |
| [GD05-103 Not with Scattershot!](../packages/cards/src/cards/gd05/command/103-not-with-scattershot.ts) | command | dedicated runtime scenario missing | no test file<br>timing: action, main |
| [GD05-104 At the Risk of One's Life](../packages/cards/src/cards/gd05/command/104-at-the-risk-of-one-s-life.ts) | command | link timing triggers | no test file<br>timing: action |
| [GD05-105 Exclusively Defense-Oriented Policy](../packages/cards/src/cards/gd05/command/105-exclusively-defense-oriented-policy.ts) | command | command burst dispatch | no test file<br>timing: action, burst, main |
| [GD05-106 Mutual Attraction](../packages/cards/src/cards/gd05/command/106-mutual-attraction.ts) | command | trash recursion or trash-count conditions | no test file<br>timing: main |
| [GD05-107 Interwoven Blessings](../packages/cards/src/cards/gd05/command/107-interwoven-blessings.ts) | command | command burst dispatch | no test file<br>timing: burst, main |
| [GD05-108 Overcoming Hardships](../packages/cards/src/cards/gd05/command/108-overcoming-hardships.ts) | command | blocker or attack redirection | empty directives<br>no test file<br>timing: action |
| [GD05-109 Felsi's Plea](../packages/cards/src/cards/gd05/command/109-felsi-s-plea.ts) | command | pilot pairing/link resident effects | no test file<br>timing: action |
| [GD05-110 Darkness Finger](../packages/cards/src/cards/gd05/command/110-darkness-finger.ts) | command | command burst dispatch | no test file<br>timing: action, burst, main |
| [GD05-111 Airframe​ Seizure](../packages/cards/src/cards/gd05/command/111-airframe-seizure.ts) | command | conditional branches/replacements | no test file<br>timing: main |
| [GD05-112 Hoka Kyoten Juzetsujin](../packages/cards/src/cards/gd05/command/112-hoka-kyoten-juzetsujin.ts) | command | pilot pairing/link resident effects | no test file<br>timing: main |
| [GD05-113 Rose Screamer](../packages/cards/src/cards/gd05/command/113-rose-screamer.ts) | command | pilot pairing/link resident effects | no test file<br>timing: main |
| [GD05-114 Widespread Annihilation](../packages/cards/src/cards/gd05/command/114-widespread-annihilation.ts) | command | dedicated runtime scenario missing | no test file<br>timing: main |
| [GD05-115 Newtype Labs Director](../packages/cards/src/cards/gd05/command/115-newtype-labs-director.ts) | command | command burst dispatch | no test file<br>timing: burst, main |
| [GD05-116 Veteran's Pride](../packages/cards/src/cards/gd05/command/116-veteran-s-pride.ts) | command | dedicated runtime scenario missing | no test file<br>timing: action, main |
| [GD05-117 Become a Shield](../packages/cards/src/cards/gd05/command/117-become-a-shield.ts) | command | dedicated runtime scenario missing | no test file<br>timing: action, main |
| [GD05-118 Incendiary Spark](../packages/cards/src/cards/gd05/command/118-incendiary-spark.ts) | command | place/use EX Resource | no test file<br>timing: main |
| [GD05-119 A Wind Against Fires](../packages/cards/src/cards/gd05/command/119-a-wind-against-fires.ts) | command | dedicated runtime scenario missing | no test file<br>timing: action |
| [GD05-120 Shining Finger](../packages/cards/src/cards/gd05/command/120-shining-finger.ts) | command | command burst dispatch | no test file<br>timing: action, burst, main |
| [GD05-121 Cyclone Punch](../packages/cards/src/cards/gd05/command/121-cyclone-punch.ts) | command | pilot pairing/link resident effects | no test file<br>timing: main |
| [GD05-122 Graviton Hammer](../packages/cards/src/cards/gd05/command/122-graviton-hammer.ts) | command | pilot pairing/link resident effects | no test file<br>timing: main |
| [GD05-123 Archangel](../packages/cards/src/cards/gd05/base/123-archangel.ts) | base | dedicated runtime scenario missing | no test file<br>timing: burst, deploy |
| [GD05-124 White Ark](../packages/cards/src/cards/gd05/base/124-white-ark.ts) | base | conditional branches/replacements | no test file<br>timing: burst, deploy |
| [GD05-125 Ra Cailum](../packages/cards/src/cards/gd05/base/125-ra-cailum.ts) | base | damage prevention/reduction | empty directives<br>no test file<br>timing: activate:main, burst, deploy |
| [GD05-126 Quiet Zero](../packages/cards/src/cards/gd05/base/126-quiet-zero.ts) | base | conditional branches/replacements | no test file<br>timing: activate:main, burst, deploy |
| [GD05-127 Girty Lue](../packages/cards/src/cards/gd05/base/127-girty-lue.ts) | base | blocker or attack redirection | empty directives<br>no test file<br>timing: burst, deploy, whenLinked |
| [GD05-128 Gundam Fight](../packages/cards/src/cards/gd05/base/128-gundam-fight.ts) | base | conditional branches/replacements | no test file<br>timing: activate:main, burst, deploy |
| [GD05-129 Axis](../packages/cards/src/cards/gd05/base/129-axis.ts) | base | destroyed triggers | no test file<br>timing: activate:main, burst, deploy |
| [GD05-130 Presidential Office](../packages/cards/src/cards/gd05/base/130-presidential-office.ts) | base | destroyed triggers | no test file<br>timing: burst, deploy, destroyed |
| [ST10-001 Zeta Gundam (EX)](../packages/cards/src/cards/st10/unit/001-zeta-gundam-ex.ts) | unit | blocker or attack redirection | no test file<br>timing: onShieldAreaCardDestroyByBattle |
| [ST10-006 Phoenix Gundam (Power Unleashed) (EX)](../packages/cards/src/cards/st10/unit/006-phoenix-gundam-power-unleashed-ex.ts) | unit | pilot pairing/link resident effects | no test file<br>timing: onDestroyByBattle |
| [ST10-007 Gundam Barbatos 4th Form](../packages/cards/src/cards/st10/unit/007-gundam-barbatos-4th-form.ts) | unit | link timing triggers | no test file<br>timing: whenLinked |
| [ST10-008 Gundam Barbatos 1st Form](../packages/cards/src/cards/st10/unit/008-gundam-barbatos-1st-form.ts) | unit | trash recursion or trash-count conditions | no test file<br>timing: deploy |
| [ST10-011 Kamille Bidan](../packages/cards/src/cards/st10/pilot/011-kamille-bidan.ts) | pilot | link timing triggers | no test file<br>timing: burst, whenLinked |
| [ST10-012 Mark Guilder](../packages/cards/src/cards/st10/pilot/012-mark-guilder.ts) | pilot | pilot pairing/link resident effects | no test file<br>timing: burst, whenPaired |
| [ST10-015 Diffuse Beam Cannon](../packages/cards/src/cards/st10/command/015-diffuse-beam-cannon.ts) | command | conditional branches/replacements | no test file<br>timing: action |
| [ST10-016 Luna Mana & Carry Base](../packages/cards/src/cards/st10/base/016-luna-mana-carry-base.ts) | base | dedicated runtime scenario missing | no test file<br>timing: burst, deploy |

## Notes

- `parsed shell has no directives` means the parser identified a timing/header but produced no executable directives, so the engine has nothing meaningful to resolve.
- `todo/skip` evidence means the card has an explicit pending card-level behavior test, even if part of its effect is already modeled.
- Cards with only printed keywords and no effect text are excluded unless they have a pending test.
