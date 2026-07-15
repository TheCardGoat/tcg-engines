# Combat & Battles

Reference for attack declarations, battle steps, damage, shields, and blocking.  
Source: Gundam Card Game Comprehensive Rules Ver. 1.5.0

---

## Declaring an Attack (Section 8)

- Only **Units** can attack.
- A Unit must be **active** (not rested) to declare an attack.
- Declaring an attack **rests** the attacking Unit.
- Units **cannot attack on the turn they enter the field** unless an effect overrides this (e.g., entering via link).

### Valid Attack Targets

- The **opponent player** directly.
- An opponent's **rested Unit** in the battle area.
- You **cannot** attack an active (ready) opponent Unit.

---

## Battle Steps (Section 8)

Each attack resolves through five sequential steps:

### 1. Attack Step

- The active player declares an attacker and a target.
- The attacking Unit rests.
- 【Attack】 trigger effects resolve.

### 2. Block Step

- The defending player may declare a **Blocker**.
- A Unit with `<Blocker>` may rest itself to redirect the attack to itself.
- If a blocker is declared, the attack target changes to the blocking Unit.

### 3. Action Step

- Players alternate performing actions (see [action-steps.md](../references/effects-and-resolution.md#action-steps-section-9) in effects reference).
- Options: play an action-timing card, activate an 【Action】 or 【Activate·Action】 effect, or pass.
- The step ends when both players pass consecutively.

### 4. Damage Step

- **Unit vs. Unit:** Both Units deal damage equal to their AP to each other simultaneously.
  - A Unit whose accumulated damage meets or exceeds its HP is **destroyed** and sent to the trash.
  - `<First Strike>` — The Unit with First Strike deals its damage first. If this destroys the opposing Unit, the opposing Unit does not deal damage back.
- **Unit vs. Player (direct attack):** The attacking Unit deals damage to the opponent's **shields**.
  - Remove 1 shield per hit. The removed shield is flipped face-up; if it has a 【Burst】 effect, the defending player may activate it.
  - `<Breach N>` — After destroying an enemy Unit, deal N additional damage to shields.
  - `<Suppression N>` — Hit N shields instead of 1.
  - If the defending player has **no shields remaining** when they would take damage, they are **defeated**.

### 5. End Step

- Battle cleanup.
- Proceed to the next action in the Main Phase or the next attack.

---

## Shield Mechanics

- Shields are placed face-down during setup (6 shields).
- Bases occupy the shield area and absorb damage before regular shields.
- When a shield is removed by battle damage, it is flipped face-up. If it has 【Burst】, the owner may resolve it immediately.
- A player with 0 shields who takes battle damage **loses the game**.

---

## Damage & Destruction

- Damage is tracked via counters on Units.
- When a Unit's accumulated damage ≥ HP, it is destroyed and sent to the trash.
- Attached Pilots move with the Unit to the same destination.
- Destruction is checked during **rules management** (Section 11).

---

## Key Constraints

- Resolve each attack fully before declaring the next.
- `<Blocker>` redirects the attack — if the original target was the player, blocking converts it to a Unit fight; no shield damage occurs.
- `<High-Maneuver>` prevents the attack from being blocked.
