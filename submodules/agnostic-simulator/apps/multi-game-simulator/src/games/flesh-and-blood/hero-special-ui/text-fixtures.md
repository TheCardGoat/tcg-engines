# FAB Hero Special UI — Visual Text Fixtures

Auto-rendered from `textFixtures.ts`. Do not hand-edit this file body;
edit the TypeScript builders and re-run the test / export script.

Fixtures: 70
Catalog entries: 73

---

FIXTURE id: dromai
Hero: Dromai  |  Tier A  |  Draconic Illusionist
Slugs: dromai-ash-artist, dromai

MUST SHOW (acceptance checklist):
  1. Ash token stack with count
  2. Dragon allies with power/life
  3. Ash as material under dragons (sub-cards)
  4. Played a red card this turn status (dragons get go again)

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Allies / dragons / figments / zombies — Full permanent cards with power/life, attack readiness, keywords (phantasm, ward, crank).
  • Material under permanents — Sub-cards under a permanent (Ash under dragons). Show under-count and material effects.
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.

NOTES: Phantasm on material under dragons must be readable on the permanent.

ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Dromai]   [Chest]                               │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [played-red-this-turn]                               │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Ash ×3                          (token stack)                │
│ Aether Ashwing  1{p}/1{h}        under: Ash ×1  [phantasm]   │
│ Azvolai         6{p}/6{h}        under: Ash ×2  [phantasm][a │
│ ← dragons are full ally cards; ash under them is material    │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   red card (just pitched → created Ash)               │
│ GY:      (empty)                                             │
│ Hand:    Invocation + red pitch fuel                         │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: levia
Hero: Levia  |  Tier A  |  Shadow Brute
Slugs: levia-shadowborn-abomination, levia

MUST SHOW (acceptance checklist):
  1. Banished zone as primary economy display
  2. Blood-debt card count (pending end-phase life loss)
  3. Mitigation active when a 6+{p} card entered banished this turn
  4. No separate blood-debt mana pool on the hero

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Blood debt readout — Count of public blood-debt cards in banished; projected end-phase life loss; mitigation active flag.
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).

NOTES: Blood Debt is a keyword on banished cards (CR 8.3.11), not a hero counter resource.

ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 28  │  Resources 0  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Levia]   [Chest]                                │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [6+p-entered-banished-this-turn → blood-debt MITIGAT │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (no signature tokens — banished is the economy)              │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ Blood Debt pending life loss: 4   ← count of public BD cards │
│ • Endless Winter (BD)  {p}6+                                 │
│ • Mark of the Beast (BD)                                     │
│ • Soul Food (BD)                                             │
│ • Wrecker Romp (BD)                                          │
│ UI: show BD badge per card + aggregate end-phase −{h}        │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      discarded non-BD cards                              │
│ Hand:    6+{p} brute attacks                                 │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: chane
Hero: Chane  |  Tier A  |  Shadow Runeblade
Slugs: chane-bound-by-shadow, chane

MUST SHOW (acceptance checklist):
  1. Soul Shackle token stack
  2. Banished zone with blood-debt cards
  3. Blood-debt pending life loss

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Blood debt readout — Count of public blood-debt cards in banished; projected end-phase life loss; mitigation active flag.
  • Playable-from-banished — Highlight cards legal to play from banished (Rune Gate, Evos, watery grave, etc.).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 30  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Chane]   [Chest]                                │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [soul-shackle-armed-this-turn?]                      │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Soul Shackle ×2   (each: banish top at action phase)         │
│ Runechant ×3      (from package / flails)                    │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ Blood Debt pending: 3                                        │
│ • Seeds of Agony (BD) — Rune Gate candidate                  │
│ • Dimenxxional Gateway (BD)                                  │
│ • top-deck exile from shackles                               │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: vynnset
Hero: Vynnset  |  Tier A  |  Shadow Runeblade
Slugs: vynnset-iron-maiden, vynnset

MUST SHOW (acceptance checklist):
  1. Runechant stack
  2. Start-of-turn banish prompt feedback
  3. Optional pay-{h} unpreventable Runechant flag this turn
  4. Banished + blood debt

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Blood debt readout — Count of public blood-debt cards in banished; projected end-phase life loss; mitigation active flag.
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 34  │  Resources 0  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Vynnset]   [Chest]                              │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [start-turn-banished-hand] [runechant-unpreventable? │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Runechant ×4                                                 │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ Blood Debt pending: 2                                        │
│ • hand card banished at start of turn                        │
│ • shadow non-attack                                          │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: boltyn
Hero: Boltyn  |  Tier A  |  Light Warrior
Slugs: ser-boltyn-breaker-of-dawn, boltyn

MUST SHOW (acceptance checklist):
  1. Soul under hero (count + inspect)
  2. Charged this turn status
  3. Banish-from-soul attack reaction affordance

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Hero soul — Sub-cards under the hero; count badge + inspect; support banish-from-soul costs.
  • Hero Signal Edge — Active-only 44px dock attached to the hero edge; compact pips open a public this-turn detail popover without moving board zones.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 36  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [Dawnblade]   [Boltyn]   [Chest]                             │
│                  soul: 3 cards (Censor / Courage / charge fu │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [charged-this-turn]                                  │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Courage ×1 (optional package)                                │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (soul cards leave to banished when spent)                    │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: prism-sculptor
Hero: Prism (Sculptor of Arc Light)  |  Tier A  |  Light Illusionist
Slugs: prism-sculptor-of-arc-light, prism

MUST SHOW (acceptance checklist):
  1. Soul under hero
  2. Spectral Shield token stack
  3. Banish-from-soul → create Spectral Shield

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Hero soul — Sub-cards under the hero; count badge + inspect; support banish-from-soul costs.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 35  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Prism]   [Chest]                                │
│                  soul: 4 (Herald light cards)                │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Spectral Shield ×2   Ward 1 each                             │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ soul card spent to create shield                             │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: prism-awakener
Hero: Prism (Awakener / Advent)  |  Tier A  |  Light Illusionist
Slugs: prism-awakener-of-sol, prism-advent-of-thrones

MUST SHOW (acceptance checklist):
  1. Soul under hero
  2. Figment permanents in arena
  3. Awaken figment interaction
  4. Herald-to-soul → search figment feedback

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Hero soul — Sub-cards under the hero; count badge + inspect; support banish-from-soul costs.
  • Allies / dragons / figments / zombies — Full permanent cards with power/life, attack readiness, keywords (phantasm, ward, crank).
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 33  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Prism (Awakener)]   [Chest]                     │
│                  soul: 2 Heralds                             │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Figment of Triumph   (unawakened)                            │
│ Figment of Tenacity  (awakened → angel ally)                 │
│ Spectral Shield ×1                                           │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ soul card spent to Awaken                                    │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: nuu
Hero: Nuu  |  Tier A  |  Mystic Assassin
Slugs: nuu-alluring-desire, nuu

MUST SHOW (acceptance checklist):
  1. Chi point asset
  2. Opponent banished (blue play-from-theirs)
  3. Chain-link resolve: defending actions banished

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Chi points — Fourth asset next to resources; required when paying {c} costs or pitching for chi.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Playable-from-banished — Highlight cards legal to play from banished (Rune Gate, Evos, watery grave, etc.).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 0  │  AP 1  │  Chi 3                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Nuu]   [Chest]                                  │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [chi ready for {c}{c}{c}]                            │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (stealth attacks / no signature token)                       │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ OPPONENT banished (viewer can highlight playable blues):     │
│ • blue action (playable by Nuu this turn?)                   │
│ OWN banished: defending actions from resolved links          │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    blue steal package                                  │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: enigma
Hero: Enigma  |  Tier A  |  Mystic Illusionist
Slugs: enigma-ledger-of-ancestry, enigma, enigma-new-moon

MUST SHOW (acceptance checklist):
  1. Chi point asset
  2. Spectral Shield tokens (with +1{p} counters)
  3. New Moon: cloaked face-down equipment

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Chi points — Fourth asset next to resources; required when paying {c} costs or pitching for chi.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Cloaked / face-down equipment — Equipment can be face-down (cloaked); show silhouette until revealed.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 34  │  Resources 1  │  AP 1  │  Chi 2                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Enigma]   [Chest]                               │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: cloaked face-down equip ×2 (New Moon) + face-up ward  │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Spectral Shield ×3   one has +1{p} counter                   │
│ Spectral Shield can attack (first costs {r} less)            │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: zen
Hero: Zen  |  Tier A  |  Mystic Ninja
Slugs: zen-tamer-of-purpose, zen

MUST SHOW (acceptance checklist):
  1. Chi point asset
  2. Crouching Tiger created into hand
  3. Combo card banished face-up may-play-this-turn

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Chi points — Fourth asset next to resources; required when paying {c} costs or pitching for chi.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Playable-from-banished — Highlight cards legal to play from banished (Rune Gate, Evos, watery grave, etc.).
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 31  │  Resources 0  │  AP 1  │  Chi 3                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Zen]   [Chest]                                  │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (combo board — tokens optional)                              │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ • Flic Flak (combo) FACE-UP  [may play this turn]            │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    Crouching Tiger (created) + attacks                 │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: maxx
Hero: Maxx Nitro  |  Tier A  |  Mechanologist
Slugs: maxx-the-hype-nitro, maxx-nitro

MUST SHOW (acceptance checklist):
  1. Hyper Driver items with steam counters
  2. Crank state on Hyper Drivers
  3. Boosted this turn gate for hero ability

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Allies / dragons / figments / zombies — Full permanent cards with power/life, attack readiness, keywords (phantasm, ward, crank).
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).

NOTES: Steam counters and crank are the core chrome — treat items as first-class permanents.

ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 28  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Maxx]   [Chest]                                 │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [boosted-this-turn] [cranked-this-turn ×1]           │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Hyper Driver   steam ●●  [crank]  (token/item)               │
│ Hyper Driver   steam ●    [crank]                            │
│ UI: steam counters + destroy-at-zero + crank AP gain         │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: dash
Hero: Dash  |  Tier A  |  Mechanologist
Slugs: dash-inventor-extraordinaire, dash, dash-i-o, dash-database

MUST SHOW (acceptance checklist):
  1. Starting Mechanologist item in arena (classic)
  2. I/O: top-of-deck always peekable
  3. I/O: play cheap item from top as instant (+{r})
  4. Items with steam counters when present

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Allies / dragons / figments / zombies — Full permanent cards with power/life, attack readiness, keywords (phantasm, ward, crank).
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 30  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Dash I/O]   [Chest]                             │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [top-deck-peek: visible]                             │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Teklo Foundry Heart (item, arena)                            │
│ Hyper Driver steam ●●                                        │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   boost discards may feed banished items              │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ TOP OF DECK (always look): cheap Mechanologist item          │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: teklovossen
Hero: Teklovossen  |  Tier A  |  Mechanologist
Slugs: teklovossen-esteemed-magnate, teklovossen, professor-teklovossen

MUST SHOW (acceptance checklist):
  1. Evos playable from banished
  2. Banished inspector with Evo highlights
  3. Next Evo as instant this turn flag

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Playable-from-banished — Highlight cards legal to play from banished (Rune Gate, Evos, watery grave, etc.).
  • Allies / dragons / figments / zombies — Full permanent cards with power/life, attack readiness, keywords (phantasm, ward, crank).
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 3  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Teklovossen]   [Chest]                          │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [next-evo-as-instant]                                │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Evo equip / construct in arena                               │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ • Evo Steel Soul Module   [PLAYABLE FROM BANISHED]           │
│ • Evo Face Controller     [PLAYABLE FROM BANISHED]           │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: data-doll
Hero: Data Doll MKII  |  Tier A  |  Mechanologist
Slugs: data-doll-mkii

MUST SHOW (acceptance checklist):
  1. Banished → arena auto for cheap Mechanologist items
  2. Items entering permanent zone mid-resolution

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Allies / dragons / figments / zombies — Full permanent cards with power/life, attack readiness, keywords (phantasm, ward, crank).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 16  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Data Doll MKII]   [Chest]                       │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Item cost ≤2 that entered from banished this turn            │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ boosted items waiting / already moved to arena               │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: malice
Hero: Malice  |  Tier A  |  Necromancer
Slugs: malice-domina-of-the-dead, malice

MUST SHOW (acceptance checklist):
  1. Zombie allies in permanent zone
  2. On death: face-down banished + Corrupted Corpse in banished
  3. Play zombie from graveyard window

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Allies / dragons / figments / zombies — Full permanent cards with power/life, attack readiness, keywords (phantasm, ward, crank).
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 29  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Malice]   [Chest]                               │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Zombie ally A  3{p}/2{h}                                     │
│ Zombie ally B  4{p}/1{h}                                     │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ • face-down (zombie that died)                               │
│ • Corrupted Corpse (created on death)                        │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      zombie targets for reanimation window               │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: gravy-bones
Hero: Gravy Bones  |  Tier A  |  Pirate Necromancer
Slugs: gravy-bones-shipwrecked-looter, gravy-bones

MUST SHOW (acceptance checklist):
  1. Gold token stack
  2. Watery grave play-from-GY when blue hit GY this turn
  3. Gold sink activation (draw then discard)

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Playable-from-banished — Highlight cards legal to play from banished (Rune Gate, Evos, watery grave, etc.).
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).

NOTES: Play-from-graveyard uses GY inspector with watery-grave legality, not banished.

ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 30  │  Resources 0  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Gravy Bones]   [Chest]                          │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [blue-entered-GY-this-turn → watery grave ON]        │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Gold ×2                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      watery grave cards [PLAYABLE] while blue-GY flag on │
│ Hand:    blues + looter lines                                │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: viserai
Hero: Viserai (classic)  |  Tier A  |  Runeblade
Slugs: viserai-rune-blood, viserai

MUST SHOW (acceptance checklist):
  1. Runechant stack count (critical for Rune Gate packages)

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 34  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Viserai]   [Chest]                              │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Runechant ×6   ← count must be huge/readable                 │
│ Rune Gate cards care about this number                       │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: viserai-forsaken
Hero: Viserai (Forsaken / Between Worlds)  |  Tier A  |  Shadow Runeblade
Slugs: viserai-the-forsaken, viserai-between-worlds

MUST SHOW (acceptance checklist):
  1. Runechant stack
  2. Auto-banish top of deck on create Runechants
  3. 3+ Runechants this turn → traverse affordance

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 28  │  Resources 0  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Viserai Forsaken]   [Chest]                     │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [runechants-created-this-turn: 3 → TRAVERSE ready]   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Runechant ×5                                                 │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ top-deck cards auto-exiled on Runechant create               │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: viserai-usurper
Hero: Viserai Usurper  |  Tier A  |  Shadow Runeblade Demon
Slugs: viserai-usurper

MUST SHOW (acceptance checklist):
  1. Blood-debt attack package UI
  2. Gate to i'Arathael permanent / activation
  3. Traverse at end phase when gate used

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Blood debt readout — Count of public blood-debt cards in banished; projected end-phase life loss; mitigation active flag.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Allies / dragons / figments / zombies — Full permanent cards with power/life, attack readiness, keywords (phantasm, ward, crank).
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 30  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Viserai Usurper]   [Chest]                      │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [gate-activated-this-turn → traverse EOT]            │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Gate to i'Arathael (landmark/permanent)                      │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ Blood Debt pending: 2  |  BD attacks package                 │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: baalghor
Hero: Baalghor  |  Tier A  |  Shadow Demon
Slugs: baalghor-omen-of-the-end

MUST SHOW (acceptance checklist):
  1. Pitch always banishes (pitch zone may stay empty)
  2. Attack actions playable from banished at +3{p}
  3. Banished as main resource display

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Playable-from-banished — Highlight cards legal to play from banished (Rune Gate, Evos, watery grave, etc.).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 25  │  Resources 0  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Baalghor]   [Chest]                             │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (pitch never stays — all pitch banishes)                     │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ • pitched cards (many)                                       │
│ • attack actions [+3{p} when played from banished]           │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   ALWAYS EMPTY (replacement: banish on pitch)         │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: arakni-chaos
Hero: Arakni (Chaos / Marionette)  |  Tier A  |  Chaos Assassin
Slugs: arakni-marionette, arakni-web-of-deceit

MUST SHOW (acceptance checklist):
  1. Marked status on opponents
  2. End-phase Agent of Chaos transformation UI
  3. Stealth go-again feedback on hits

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Marked — Mark badge on a hero (Assassin / Draconic contracts).
  • Agent of Chaos form — Hero identity / moniker swap UI when Arakni becomes a random Agent.
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Arakni Marionette]   [Chest]                    │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [opponent MARKED] [end-phase → Agent of Chaos roll]  │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (stealth / daggers)                                          │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ OPPONENT hero badge: MARKED                                  │
│ FORM: current moniker / pending Agent swap UI                │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: cindra
Hero: Cindra  |  Tier A  |  Royal Draconic Ninja
Slugs: cindra-dracai-of-retribution, cindra

MUST SHOW (acceptance checklist):
  1. Marked opponents
  2. Fealty token stack
  3. Re-equip Draconic daggers from graveyard
  4. Draconic chain-link count for discount

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Marked — Mark badge on a hero (Assassin / Draconic contracts).
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 33  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [Dagger][Dagger]   [Cindra]   [Chest]                        │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [draconic-chain-links: 2] [opponent MARKED]          │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Fealty ×2                                                    │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      Draconic daggers [re-equip targets]                 │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: fang
Hero: Fang  |  Tier A  |  Royal Draconic Warrior
Slugs: fang-dracai-of-blades, fang

MUST SHOW (acceptance checklist):
  1. Marked opponents
  2. Fealty token stack (threshold 3 for dagger discount)

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Marked — Mark badge on a hero (Assassin / Draconic contracts).
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 34  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [Dagger][Dagger]   [Fang]   [Chest]                          │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [opponent MARKED] [fealty≥3? NO (2)]                 │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Fealty ×2   (need 3 for dagger discount)                     │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: blaze
Hero: Blaze Firemind  |  Tier A  |  Wizard
Slugs: blaze-firemind

MUST SHOW (acceptance checklist):
  1. Energy counters on the hero card
  2. Spend X energy for arcane play-as-instant
  3. Opt → add energy counters feedback

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Counters on hero — Named counters on the hero object itself (e.g. energy on Blaze).
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 15  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Blaze]   [Chest]                                │
│                  soul: —                                     │
│               counters: energy ●●●●● (5)                     │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [opted-this-turn]                                    │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (arcane package — no required tokens)                        │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: taylor
Hero: Taylor  |  Tier A  |  Shapeshifter
Slugs: taylor

MUST SHOW (acceptance checklist):
  1. Inventory of equipment (different names)
  2. Start-of-turn banish equip → equip from inventory

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Inventory — Side zone for starting equipment / Tomes outside the main deck.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 16  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Taylor]   [Chest]                               │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: currently equipped: arms piece A                      │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (inventory is the special zone)                              │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ INVENTORY ──────────────────────────────────────────────────┐
│ • Head: Snapdragon Scalers                                   │
│ • Chest: Fyendal's Spring Tunic                              │
│ • Arms: (swappable same subtype)                             │
│ • Legs: ...                                                  │
│ Start of turn: banish equip → equip same subtype from invent │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: librarian
Hero: The Librarian  |  Tier A  |  Light Adjudicator
Slugs: the-librarian-magister-of-history

MUST SHOW (acceptance checklist):
  1. Inventory of Tomes
  2. Reveal Tome from inventory → hand
  3. Temporary +intellect on another hero

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Inventory — Side zone for starting equipment / Tomes outside the main deck.
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 18  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [The Librarian]   [Chest]                        │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (multiplayer intellect buffs on others)                      │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ INVENTORY ──────────────────────────────────────────────────┐
│ • Tome of Firebrand                                          │
│ • Tome of Fyendal                                            │
│ • Tome of Aetherwind                                         │
│ Action: reveal Tome from inventory → hand; grant +1{i}       │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ OTHER HERO intellect badges may show temporary +1{i}         │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: zyggy
Hero: Zyggy  |  Tier A  |  Lightning Illusionist
Slugs: zyggy-starlight, zyggy

MUST SHOW (acceptance checklist):
  1. Lightning Flow tokens
  2. Holo counters on Lightning auras
  3. Banish/return aura with holo flow

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Allies / dragons / figments / zombies — Full permanent cards with power/life, attack readiness, keywords (phantasm, ward, crank).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Zyggy]   [Chest]                                │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Lightning Flow ×1                                            │
│ Lightning aura A   holo ●                                    │
│ Lightning aura B   holo —  (banish/return candidate)         │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: aurora-flow
Hero: Aurora (Lightning Flow)  |  Tier A  |  Lightning Runeblade
Slugs: aurora-legacy-of-tempest, aurora-emissary-of-lightning

MUST SHOW (acceptance checklist):
  1. Lightning Flow tokens
  2. Embodiment of Lightning from Flow sink

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 31  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Aurora (Flow)]   [Chest]                        │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Lightning Flow ×2                                            │
│ Embodiment of Lightning ×1                                   │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: oscilio-flow
Hero: Oscilio (Lightning Flow)  |  Tier A  |  Lightning Wizard
Slugs: oscilio-forked-continuum, oscilio-scion-of-the-third-age

MUST SHOW (acceptance checklist):
  1. Lightning Flow tokens
  2. Ponder tokens
  3. Discarded instant may-play-this-turn

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 30  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Oscilio (Flow)]   [Chest]                       │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [discarded-instant-may-play]                         │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Lightning Flow ×1                                            │
│ Ponder ×2                                                    │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: pleiades
Hero: Pleiades  |  Tier A  |  Guardian (Superstar)
Slugs: pleiades-superstar, pleiades

MUST SHOW (acceptance checklist):
  1. Suspense counters on auras (move between them)
  2. Confidence tokens
  3. Crowd cheers status

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Allies / dragons / figments / zombies — Full permanent cards with power/life, attack readiness, keywords (phantasm, ward, crank).
  • Crowd cheers / boos — Super Slam crowd state that creates tokens and enables hero abilities.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 34  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Pleiades]   [Chest]                             │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [crowd: CHEERS]                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Aura of Suspense A   suspense ●●                             │
│ Aura of Suspense B   suspense ●                              │
│ Confidence ×1                                                │
│ Hero ability: move suspense counters between auras           │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: fai
Hero: Fai  |  Tier A  |  Draconic Ninja
Slugs: fai-rising-rebellion, fai

MUST SHOW (acceptance checklist):
  1. Phoenix Flame in graveyard (starts there)
  2. Recycle Phoenix Flame to hand
  3. Draconic chain-link count for cost reduction

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 33  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Fai]   [Chest]                                  │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [draconic-chain-links: 2]                            │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (Phoenix Flame is in GY, not arena)                          │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      Phoenix Flame  [starts here]  recycle → hand        │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: kassai-cintari
Hero: Kassai (Cintari Sellsword)  |  Tier A  |  Warrior
Slugs: kassai-cintari-sellsword

MUST SHOW (acceptance checklist):
  1. Copper token stack
  2. Weapon attacks this turn / hits tracking
  3. Second sword attack cost reduction

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [Cintari Saber][Cintari Saber]   [Kassai (Cintari)]   [Chest │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [weapon-attacks: 2] [weapon-hits: 1]                 │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Copper ×2                                                    │
│ Cintari Sellsword ally (optional package)                    │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: kassai-golden
Hero: Kassai (Golden Sand)  |  Tier A  |  Warrior
Slugs: kassai-of-the-golden-sand, kassai

MUST SHOW (acceptance checklist):
  1. Gold token creation on weapon hit
  2. Drew a card this turn (sword discount)
  3. Graveyard banish cost for Gold setup

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 33  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [sword][sword]   [Kassai (Golden Sand)]   [Chest]            │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [drew-this-turn → sword discount ON]                 │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Gold ×1                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      red/yellow cards for banish-to-Gold setup           │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: victor
Hero: Victor Goldmane  |  Tier A  |  Guardian
Slugs: victor-goldmane-high-and-mighty, victor-goldmane, victor-goldmane-match-fixer

MUST SHOW (acceptance checklist):
  1. Gold token stack
  2. Clash UI (fail → pay Gold to re-clash)
  3. First Gold created this turn → draw feedback

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 36  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Victor Goldmane]   [Chest]                      │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [first-gold-this-turn → drew] [clash ready]          │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Gold ×3                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ CLASH UI: reveal / re-clash by destroying Gold               │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: olympia
Hero: Olympia  |  Tier A  |  Warrior
Slugs: olympia-prized-fighter, olympia

MUST SHOW (acceptance checklist):
  1. Gold on first wager win per attack
  2. Wager resolution UI

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Olympia]   [Chest]                              │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [wager-won-this-attack → Gold]                       │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Gold ×2                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ WAGER UI on attacks                                          │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: puffin
Hero: Puffin  |  Tier A  |  Mechanologist Pirate
Slugs: puffin-hightail, puffin

MUST SHOW (acceptance checklist):
  1. Gold tokens
  2. Golden Cog with steam counters + crank
  3. Second crank this turn → draw

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 30  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Puffin]   [Chest]                               │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [cranked-this-turn: 2 → draw]                        │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Gold ×1                                                      │
│ Golden Cog  steam ●  [crank]                                 │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: marlynn
Hero: Marlynn  |  Tier A  |  Ranger Pirate
Slugs: marlynn-treasure-hunter, marlynn

MUST SHOW (acceptance checklist):
  1. Gold tokens
  2. Goldfin Harpoon into hand from Gold sink
  3. Face-up arrows into arsenal from draws

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Arsenal face-up / face-down — Arsenal card orientation is rules-relevant (arrows face-up, Lexi flips, etc.).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 31  │  Resources 0  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Marlynn]   [Chest]                              │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Gold ×1                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: FACE-UP arrow (from draw)                           │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    Goldfin Harpoon (created) + arrows                  │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: scurv
Hero: Scurv  |  Tier A  |  Pirate
Slugs: scurv-stowaway

MUST SHOW (acceptance checklist):
  1. Gold tokens
  2. Goldkiss Rum tokens
  3. Activate Rum → gain {r}

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 28  │  Resources 0  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Scurv]   [Chest]                                │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Gold ×1                                                      │
│ Goldkiss Rum ×2  (tap hero, destroy → go again)              │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: valda
Hero: Valda  |  Tier A  |  Guardian
Slugs: valda-seismic-impact, valda-brightaxe

MUST SHOW (acceptance checklist):
  1. Seismic Surge token stack
  2. Threshold 3 → crush dominate status this turn
  3. Opponent draw during action phase feedback

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 35  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Valda]   [Chest]                                │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [seismic≥3 → crush DOMINATE this turn]               │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Seismic Surge ×4                                             │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: iyslander
Hero: Iyslander  |  Tier A  |  Elemental Wizard
Slugs: iyslander-stormbind, iyslander

MUST SHOW (acceptance checklist):
  1. Frostbite under opponent control
  2. Blue non-attack from arsenal as instant off-turn
  3. Arsenal orientation

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Arsenal face-up / face-down — Arsenal card orientation is rules-relevant (arrows face-up, Lexi flips, etc.).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 30  │  Resources 0  │  AP 0  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Iyslander]   [Chest]                            │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (own board may be empty)                                     │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: FACE-UP blue non-attack (play as instant off-turn)  │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ OPPONENT permanents: Frostbite ×2                            │
│ Frostbite: +{r} costs, destroys EOT / on play                │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: lexi
Hero: Lexi  |  Tier A  |  Elemental Ranger
Slugs: lexi-livewire, lexi

MUST SHOW (acceptance checklist):
  1. Arsenal face-down → face-up flip
  2. Frostbite under target hero
  3. Lightning branch go-again flag

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Arsenal face-up / face-down — Arsenal card orientation is rules-relevant (arrows face-up, Lexi flips, etc.).
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Lexi]   [Chest]                                 │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [arsenal-flip used] [next-attack-go-again?]          │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (optional)                                                   │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: was face-down Ice → flipped FACE-UP                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ OPPONENT: Frostbite ×1 under their control                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: jarl
Hero: Jarl Vetreiði  |  Tier A  |  Elemental Guardian
Slugs: jarl-vetrei-i

MUST SHOW (acceptance checklist):
  1. Frostbite placed into opponent exposed equipment zones (head/chest/arms/legs)

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.

NOTES: Frostbite is not only an aura row — can occupy exposed equipment slots.

ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 34  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Jarl Vetreiði]   [Chest]                        │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (own)                                                        │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ OPPONENT EQUIPMENT ZONES:                                    │
│   Head:  EXPOSED → Frostbite sitting in slot                 │
│   Chest: armor equipped                                      │
│   Arms:  EXPOSED → Frostbite                                 │
│   Legs:  EXPOSED                                             │
│ Frostbite can occupy exposed equipment slots — not only aura │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: briar
Hero: Briar  |  Tier A  |  Elemental Runeblade
Slugs: briar-warden-of-thorns, briar

MUST SHOW (acceptance checklist):
  1. Embodiment of Earth tokens
  2. Embodiment of Lightning tokens
  3. Second non-attack this turn tracking

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 33  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Briar]   [Chest]                                │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [non-attack-actions-this-turn: 2]                    │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Embodiment of Earth ×1                                       │
│ Embodiment of Lightning ×1                                   │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: aurora-classic
Hero: Aurora (classic)  |  Tier A  |  Elemental Runeblade
Slugs: aurora-shooting-star, aurora

MUST SHOW (acceptance checklist):
  1. Embodiment of Lightning tokens
  2. Played a Lightning card this turn gate

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Aurora]   [Chest]                               │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [played-lightning-this-turn]                         │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Embodiment of Lightning ×1                                   │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: tuffnut
Hero: Tuffnut  |  Tier A  |  Revered Brute
Slugs: tuffnut-bumbling-hulkster, tuffnut

MUST SHOW (acceptance checklist):
  1. Cheered and Booed independently when active
  2. Toughness tokens

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Hero Signal Edge — Active-only 44px dock attached to the hero edge; compact pips open a public this-turn detail popover without moving board zones.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 36  │  Resources 0  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Tuffnut]   [Chest]                              │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [crowd: CHEERS]                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Toughness ×2                                                 │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: lyath
Hero: Lyath Goldmane  |  Tier A  |  Reviled Guardian
Slugs: lyath-goldmane-vile-savant, lyath-goldmane

MUST SHOW (acceptance checklist):
  1. Crowd boos status
  2. Might tokens
  3. Halved base power/defense presentation

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Crowd cheers / boos — Super Slam crowd state that creates tokens and enables hero abilities.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 34  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Lyath Goldmane]   [Chest]                       │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [crowd: BOOS] [base p/d HALVED (rounded up)]         │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Might ×2                                                     │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: kayo-sup
Hero: Kayo (Super Slam)  |  Tier A  |  Brute
Slugs: kayo-underhanded-cheat, kayo-strong-arm

MUST SHOW (acceptance checklist):
  1. Single weapon zone
  2. Crowd boos
  3. Vigor tokens
  4. Set base power 6 ability feedback

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Weapon zone count — Default two weapon slots; some heroes start with one.
  • Crowd cheers / boos — Super Slam crowd state that creates tokens and enables hero abilities.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 33  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1 only]  (1 weapon zone)   [Kayo (SUP)]   [Chest]          │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [crowd: BOOS]                                        │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Vigor ×1                                                     │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: kayo-hvy
Hero: Kayo (Heavy Hitters)  |  Tier A  |  Brute
Slugs: kayo-armed-and-dangerous, kayo

MUST SHOW (acceptance checklist):
  1. Single weapon zone
  2. Might tokens from 6+ discards
  3. Power buff off combat chain

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Weapon zone count — Default two weapon slots; some heroes start with one.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 34  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1 only]   [Kayo (HVY)]   [Chest]                           │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [discarded-6+-this-action-phase]                     │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Might ×1                                                     │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: uzuri
Hero: Uzuri  |  Tier A  |  Assassin
Slugs: uzuri-switchblade, uzuri

MUST SHOW (acceptance checklist):
  1. Temporary face-down banished from hand
  2. Reveal then swap onto active chain link

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Uzuri]   [Chest]                                │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [switchblade AR used?]                               │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (stealth attacks)                                            │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ • face-down (temporary from hand) → reveal                   │
│   if attack ≤2 cost: swaps onto chain link                   │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: kano
Hero: Kano  |  Tier A  |  Wizard
Slugs: kano-dracai-of-aether, kano

MUST SHOW (acceptance checklist):
  1. Top-deck look result
  2. Banished non-attack playable as instant this turn

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Playable-from-banished — Highlight cards legal to play from banished (Rune Gate, Evos, watery grave, etc.).
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 30  │  Resources 0  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Kano]   [Chest]                                 │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [banished-as-instant-window open]                    │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (arcane)                                                     │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ • Aetherize / non-attack  [play as INSTANT this turn]        │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ TOP DECK peek result from hero ability                       │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: florian
Hero: Florian  |  Tier A  |  Elemental Illusionist
Slugs: florian-rotwood-harbinger, florian

MUST SHOW (acceptance checklist):
  1. Aura tokens created (extra +1 replacement)
  2. Clear token stack growth on create

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Florian]   [Chest]                              │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Aura tokens ×N+1 (replacement: create that many plus 1)      │
│ Example: would create 1 Ponder → create 2                    │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: yorick
Hero: Yorick  |  Tier A  |  Bard
Slugs: yorick-weaver-of-tales

MUST SHOW (acceptance checklist):
  1. Shared deck for all heroes
  2. Shared graveyard for all heroes

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Shared deck + graveyard — Yorick: all heroes share one deck and one graveyard.

NOTES: Format-breaking layout — do not hide shared zones as per-player piles.

ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 18  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Yorick]   [Chest]                               │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (bard package)                                               │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ SHARED DECK  (all heroes)                                    │
│ SHARED GRAVEYARD (all heroes)                                │
│ Do NOT render per-player deck/GY piles as authoritative      │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: melody
Hero: Melody  |  Tier A  |  Bard
Slugs: melody-sing-along

MUST SHOW (acceptance checklist):
  1. Copper tokens equal to other heroes (multiplayer scale)

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 18  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Melody]   [Chest]                               │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Copper ×3  (one per other hero in multiplayer)               │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ Multiplayer scale: Copper count tracks hero count − 1        │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: brevant
Hero: Brevant  |  Tier A  |  Guardian
Slugs: brevant-civic-protector

MUST SHOW (acceptance checklist):
  1. Might tokens on protect
  2. Protect another hero multiplayer feedback

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 18  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Brevant]   [Chest]                              │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [protected-another-hero]                             │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Might ×1                                                     │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: terra
Hero: Terra  |  Tier A  |  Elemental Guardian
Slugs: terra

MUST SHOW (acceptance checklist):
  1. Might from Earth in pitch at end phase

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 18  │  Resources 1  │  AP 0  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Terra]   [Chest]                                │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Might ×1                                                     │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   Earth card present → end-phase May pay {r}: Might   │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: reya
Hero: Reya  |  Tier A  |  Guardian Pit-Fighter
Slugs: reya-the-unyielding

MUST SHOW (acceptance checklist):
  1. Protect keyword feedback
  2. Gold on protect another hero

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 18  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Reya]   [Chest]                                 │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [protect available]                                  │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Gold ×1 (from protecting another hero)                       │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: squizzy
Hero: Squizzy & Floof  |  Tier A  |  Merchant
Slugs: squizzy-floof

MUST SHOW (acceptance checklist):
  1. Opponent may create Cracked Bauble
  2. Gold when they do

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 16  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Squizzy & Floof]   [Chest]                      │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Gold ×2                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ OPPONENT start of turn: may create Cracked Bauble in hand    │
│ If they do → you create Gold                                 │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: genis
Hero: Genis Wotchuneed  |  Tier A  |  Merchant
Slugs: genis-wotchuneed

MUST SHOW (acceptance checklist):
  1. Silver tokens from other heroes cycling hand

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 18  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Genis Wotchuneed]   [Chest]                     │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Silver ×2                                                    │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: kavdaen
Hero: Kavdaen  |  Tier A  |  Merchant
Slugs: kavdaen-trader-of-skins

MUST SHOW (acceptance checklist):
  1. Copper tokens
  2. Life equalization action feedback

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 18  │  Resources 3  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Kavdaen]   [Chest]                              │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Copper ×1                                                    │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ Ability equalizes highest/lowest life among heroes           │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: fightmaster-kox
Hero: Fightmaster Kox  |  Tier A  |  Guardian Pit-Fighter
Slugs: fightmaster-kox

MUST SHOW (acceptance checklist):
  1. Gold sink
  2. Event deck look / reorder

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.
  • Event deck — Multiplayer event deck for Fightmaster Kox-style effects.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 18  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Fightmaster Kox]   [Chest]                      │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Gold ×1                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ EVENT DECK: look top 3, reorder (multiplayer)                │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: betsy
Hero: Betsy  |  Tier A  |  Guardian
Slugs: betsy-skin-in-the-game, betsy

MUST SHOW (acceptance checklist):
  1. Wager UI
  2. Optional pay {r}{r} for +1{p} overpower

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 34  │  Resources 2  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Betsy]   [Chest]                                │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [wager pending — may pay {r}{r} for +1{p} overpower] │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (wager package)                                              │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ WAGER UI on attacks you control                              │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: azalea
Hero: Azalea  |  Tier B  |  Ranger
Slugs: azalea-ace-in-the-hole, azalea

MUST SHOW (acceptance checklist):
  1. Arsenal face-up arrows
  2. Arsenal reload action

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Arsenal face-up / face-down — Arsenal card orientation is rules-relevant (arrows face-up, Lexi flips, etc.).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 0  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [Death Dealer][Quiver]   [Azalea]   [Chest]                  │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (bow / quiver)                                               │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: FACE-UP arrow (dominate if reloaded)                │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: riptide
Hero: Riptide  |  Tier B  |  Ranger
Slugs: riptide-lurker-of-the-deep, riptide

MUST SHOW (acceptance checklist):
  1. Extra arsenal load from hand
  2. Trap trigger damage feedback

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Arsenal face-up / face-down — Arsenal card orientation is rules-relevant (arrows face-up, Lexi flips, etc.).
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 31  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Riptide]   [Chest]                              │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [trap-triggered → 1 damage]                          │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Trap in arsenal/hand package                                 │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: face-down (loaded from hand)                        │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: dorinthea
Hero: Dorinthea  |  Tier B  |  Warrior
Slugs: dorinthea-ironsong, dorinthea, dorinthea-quicksilver-prodigy

MUST SHOW (acceptance checklist):
  1. Extra weapon attack this turn flag

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 34  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [Dawnblade]   [Dorinthea]   [Chest]                          │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [extra-weapon-attack-available]                      │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (warrior attacks)                                            │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: hala
Hero: Hala  |  Tier B  |  Warrior
Slugs: hala-bladesaint-of-the-vow, hala

MUST SHOW (acceptance checklist):
  1. Sharpen +1{p} counters on swords (end-phase cleanup)

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Hero turn flags — This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 32  │  Resources 3  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [Sword] +1{p} counter (Sharpen — remove EOT)   [Hala]   [Che │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (sharpen is on weapon, not a token)                          │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: rhinar
Hero: Rhinar  |  Tier B  |  Brute
Slugs: rhinar-reckless-rampage, rhinar

MUST SHOW (acceptance checklist):
  1. Intimidate count this turn (including an empty opposing hand)
  2. Intimidate face-down temporary banished from hand

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Hero Signal Edge — Active-only 44px dock attached to the hero edge; compact pips open a public this-turn detail popover without moving board zones.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 36  │  Resources 0  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Rhinar]   [Chest]                               │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [intimidate pending return EOT]                      │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (brute)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ • face-down (intimidated from opponent hand)                 │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: katsu
Hero: Katsu  |  Tier B  |  Ninja
Slugs: katsu-the-wanderer, katsu

MUST SHOW (acceptance checklist):
  1. Combo card banished face-up may-play-this-turn

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.
  • Playable-from-banished — Highlight cards legal to play from banished (Rune Gate, Evos, watery grave, etc.).
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 33  │  Resources 0  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Katsu]   [Chest]                                │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (combo chain)                                                │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ • combo card FACE-UP [may play this turn]                    │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: kayo-runt
Hero: Kayo (Berserker Runt)  |  Tier B  |  Brute
Slugs: kayo-berserker-runt

MUST SHOW (acceptance checklist):
  1. Die roll UI for 6+ power attacks (halve / double)

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Turn status ledger — Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 17  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Kayo (Runt)]   [Chest]                          │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [die roll UI: 1/4 halve · 5/6 double base {p}]       │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (6+ power attacks)                                           │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: crix
Hero: Groundbreaker Crix  |  Tier B  |  Guardian Pit-Fighter
Slugs: groundbreaker-crix

MUST SHOW (acceptance checklist):
  1. Seismic Surge on clash vs Guardian
  2. Clash UI

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Token stacks — Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 18  │  Resources 1  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Groundbreaker Crix]   [Chest]                   │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: standard gear (not special)                           │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ Seismic Surge ×1 (from clash)                                │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ (empty)                                                      │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      (empty)                                             │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘
┌─ EXTRA / FORMAT ─────────────────────────────────────────────┐
│ CLASH vs Guardian heroes on attack                           │
└──────────────────────────────────────────────────────────────┘

---

FIXTURE id: frankie
Hero: Frankie  |  Tier B  |  Necromancer
Slugs: frankie-make-ends-meat

MUST SHOW (acceptance checklist):
  1. Equipment banished instead of GY
  2. Equip from a graveyard

UI MODULES:
  • Asset bar (life / resources / AP) — Always-on player chrome: life total, resource points, action points.
  • Banished inspector — Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.


ASCII BOARD (visual target):
┌─ ASSETS (public) ────────────────────────────────────────────┐
│ Life 18  │  Resources 3  │  AP 1  │  Chi —                   │
└──────────────────────────────────────────────────────────────┘
┌─ HERO CLUSTER ───────────────────────────────────────────────┐
│               [Head]                                         │
│ [W1] [W2]   [Frankie]   [Chest]                              │
│                  soul: —                                     │
│               counters: —                                    │
│                  [Arms]                                      │
│                  [Legs]                                      │
│ equip: scavenged gear from GY                                │
│ status: [no special flags]                                   │
└──────────────────────────────────────────────────────────────┘
┌─ PERMANENTS / TOKENS ────────────────────────────────────────┐
│ (no signature tokens — equipment economy)                    │
└──────────────────────────────────────────────────────────────┘
┌─ BANISHED ───────────────────────────────────────────────────┐
│ equipment that would have gone to GY                         │
└──────────────────────────────────────────────────────────────┘
┌─ PILES ──────────────────────────────────────────────────────┐
│ Arsenal: (empty / face-down)                                 │
│ Pitch:   (empty)                                             │
│ GY:      equip targets from any GY                           │
│ Hand:    4 cards (private)                                   │
└──────────────────────────────────────────────────────────────┘

---
