# IAR zombie / Corrupted Corpse playlines

Inventory is every Card Vault IAR product card whose **type text or functional
text** mentions zombie, corpse, Corrupted Corpse, or Zombie Ally (36 unique
name+pitch identities). Name-only “Corpse Cover” is excluded. Tokens created
by those cards (Corrupted Corpse, Gate to i'Arathael) may appear in results.

Opponent cards are unnamed so each line stays inside the IAR inventory.

## Inventory (36)

| Collector  | Name                       | Pitch | Type                                   | Synergy clause                                                                                                                   |
| ---------- | -------------------------- | ----- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| IAR053     | Malice, Domina of the Dead | —     | Shadow Necromancer Hero                | Play target zombie from graveyard; when a zombie you control dies, banish it face-down and create a Corrupted Corpse in banished |
| IAR054     | Malice                     | —     | Shadow Necromancer Hero - Young        | Same printed pair as IAR053                                                                                                      |
| IAR055     | Vox Necropolis             | —     | Shadow Necromancer Weapon - Staff (2H) | Zombies played from graveyard/banished enter tapped and attack; zombies you control get Action — {r}, {t}: Attack                |
| IAR056     | Appalling Bearers          | —     | Shadow Necromancer Equipment - Arms    | Instant — discard a zombie, destroy this: prevent the next 2 damage                                                              |
| IAR057     | Forsaken Strike            | 2     | Shadow Necromancer Action - Attack     | Additional cost: destroy and/or discard zombies; one mode per zombie (Gate / +2{p} / go again)                                   |
| IAR058     | Bridge of Damnation        | 3     | Shadow Necromancer Action - Aura       | At the start of each turn, destroy this unless you put a zombie from banished into graveyard                                     |
| IAR059     | Restless Templar           | 1     | Zombie Ally                            | Whenever a zombie you control with Decay dies, create a Gate; Decay                                                              |
| IAR060–062 | Commit to Corruption       | 1/2/3 | Shadow Necromancer Action              | Next attack this turn gets +N{p} and “When this hits, create a Corrupted Corpse in banished”                                     |
| IAR063     | Restless Looter            | 1     | Zombie Ally                            | Decay (fuel for Templar / Malice death)                                                                                          |
| IAR064     | Restless Magister          | 1     | Zombie Ally                            | Decay; hits a hero → they banish a card from hand                                                                                |
| IAR065     | Restless Quartermaster     | 1     | Zombie Ally                            | Decay; hits a hero → they banish arsenal                                                                                         |
| IAR066     | Mark of Neverest           | 3     | Instant - Aura                         | Binds to an ally; +1{p} and on hit-or-die may turn a banished card face-down to create a Corrupted Corpse                        |
| IAR069–071 | Acrid Stench               | 1/2/3 | Action - Attack                        | When this attacks, you may discard a zombie. If you do, create a Corrupted Corpse in banished                                    |
| IAR072–074 | Bone Mass                  | 1/2/3 | Action - Attack                        | When this attacks, you may discard a zombie. If you do, next attack gets +1{p}                                                   |
| IAR075–077 | Malignant Migration        | 1/2/3 | Action - Attack                        | When this attacks, you may discard a zombie. If you do, put a banished card into graveyard                                       |
| IAR078–080 | Ominous Toll               | 1/2/3 | Action - Attack                        | When this attacks, you may discard a zombie. If you do, create a Gate                                                            |
| IAR081     | Shadowrealm Solace         | 3     | Shadow Necromancer Action              | Put a banished card into graveyard; if it is a zombie, gain 1{h}                                                                 |
| IAR082     | Shadowrealm Strength       | 1     | Shadow Necromancer Action              | Put a banished card into graveyard; if it is a zombie, next attack gets +3{p}                                                    |
| IAR083     | Shadowrealm Swiftness      | 2     | Shadow Necromancer Action              | Put a banished card into graveyard; if it is a zombie, next attack gets go again                                                 |
| IAR084     | Restless Cleric            | 1     | Zombie Ally                            | Decay; Action — {t}: gain 1{h}                                                                                                   |
| IAR085     | Restless Corporal          | 1     | Zombie Ally                            | Decay; Action — {t}: put a banished card into graveyard                                                                          |
| IAR086     | Restless Outlaw            | 1     | Zombie Ally                            | When this dies, create a Corrupted Corpse in banished; Decay                                                                     |
| IAR087     | Restless Plowman           | 1     | Zombie Ally                            | Decay; Action — {t}: gain {r}                                                                                                    |
| IAR088     | Restless Shieldmaiden      | 1     | Zombie Ally                            | Decay; Shadow Resist 1                                                                                                           |
| IAR089     | Restless Steed             | 1     | Zombie Ally                            | Decay; when this hits, the attack gets go again                                                                                  |
| IAR090     | Corrupted Corpse           | —     | Zombie Ally                            | Incarnate; its attacks get go again; Blood Debt while banished                                                                   |

All 36 collectors are present in the generated IAR printings. Catalog provenance:
FAB Cube `usurp-the-shadow-throne` @ `9fb8c73011311720bc7add61fb8eaab00b131bc3`,
set display name `??? Set 20 ???`, `productionEligible: false`.

---

## Loop 1 — Malice graveyard play + death Corpse

**Cards:** Malice or Malice, Domina of the Dead; Restless Magister; Corrupted Corpse (created).

**Printed:** Action — {r}, {t}: until end of turn, play target zombie from graveyard. Go again. Whenever a zombie you control dies, banish it face-down and create a Corrupted Corpse in your banished zone.

### Playline A — death makes a Corrupted Corpse (already documented)

- **Arrange:** You control Malice. Restless Magister is in your arena (3 life). You have {r} available only if needed later.
- **Act:** An opposing attack deals 3 or more damage to Restless Magister and is not prevented. Pass through the damage window so the Magister dies.
- **Assert:** Restless Magister is banished face-down. A Corrupted Corpse is in your banished zone. That Corpse is Incarnate (cannot start in deck) and has Blood Debt.

Covered by `malice.test.ts` (“a zombie you control dying is banished face-down and creates a Corrupted Corpse”), `usurp-preview-malice`, and Forsaken Strike’s Malice fixture (`forsaken-strike-malice` / INTERACTION-QA: destroy vs discard).

### Playline B — play the zombie back from graveyard (already documented)

- **Arrange:** Malice, Vox Necropolis equipped. Restless Magister in your graveyard. At least {r}{r}{r} (activation plus play plus Vox attack tax as printed).
- **Act:** Activate Malice’s graveyard ability. Play Restless Magister from graveyard.
- **Assert:** Magister enters from graveyard. With Vox, it enters tapped and immediately attacks. After combat it is back in the arena (ally attack, not a destroyed action).

Covered by `malice.test.ts` (“playing a zombie from graveyard under Vox opens its ETB attack”) and `usurp-preview-malice` / `usurp-preview-vox-necropolis`.

**Discard is not dying:** discarding Restless Magister to Forsaken Strike leaves it in the graveyard and does **not** make a Corrupted Corpse. Already documented on the Malice Forsaken fixture.

---

## Loop 2 — Vox Necropolis attacks from graveyard / banished

**Cards:** Vox Necropolis; Malice; Restless Magister or Corrupted Corpse.

**Printed:** During your action phase, zombies you’ve played from a graveyard or banished zone enter tapped and get “When this enters the arena, attack with it.” Zombies you control get “Action — {r}, {t}: Attack.”

### Playline C — seated zombie Attack activation (already documented)

- **Arrange:** Malice, Vox Necropolis in the weapon zone, Restless Magister in arena, {r} available.
- **Act:** Activate Restless Magister (the Vox-granted Attack). Pass both players through responses.
- **Assert:** Combat is open with Magister on the chain. After the chain closes, Magister returns to the arena (not the graveyard).

Covered by `vox-necropolis.test.ts` and `malice.test.ts`. Fixture: `usurp-preview-vox-necropolis`.

### Playline D — Corrupted Corpse swings with go again (already documented)

- **Arrange:** Malice, Vox equipped, Corrupted Corpse already in arena (created earlier by Loop 1 or 5), {r} available.
- **Act:** Activate Corrupted Corpse’s granted Attack.
- **Assert:** The attack has go again (Corrupted Corpse printed). After the chain, the Corpse is still in the arena. Incarnate: if it would die, it ceases to exist instead of hitting graveyard.

Covered by `corrupted-corpse.test.ts` and `usurp-preview-corrupted-corpse`.

**Caveat (does not block these lines):** gap family around “Zombies you control get +1{p}” missing the attacking ally once it leaves the permanent zone for the chain. Vox’s granted Attack itself is proven; a static +{p} aura on “zombies you control” may not ride the chain.

---

## Loop 3 — discard- or destroy-a-zombie additional costs

**Cards:** Forsaken Strike; Appalling Bearers; Acrid Stench / Bone Mass / Malignant Migration / Ominous Toll; Restless Corporal (hand or arena zombie).

### Playline E — Forsaken Strike destroy + discard (already documented)

- **Arrange:** Malice. Restless Corporal in arena, another Restless Corporal in hand. Forsaken Strike (yellow) in hand.
- **Act:** Play Forsaken Strike. Pay destroy: Restless Corporal in arena. Pay discard: Restless Corporal in hand. Choose Gate, then +2{p}.
- **Assert:** Destroyed Corporal is banished face-down and a Corrupted Corpse is created (Malice death). Discarded Corporal is in the graveyard (not a death). Forsaken Strike is attacking with +2{p} and a Gate to i'Arathael exists.

Covered by `forsaken-strike.test.ts`, `usurp-preview-forsaken-strike-yellow`, six-reward and Malice fixtures in INTERACTION-QA.

### Playline F — Acrid Stench discard makes a Corpse (already documented)

- **Arrange:** Malice. Acrid Stench (red) and Restless Cleric in hand.
- **Act:** Play Acrid Stench as an attack. Choose to discard Restless Cleric.
- **Assert:** Restless Cleric is in the graveyard. A Corrupted Corpse is in banished. Acrid Stench has go again.

Covered by `acrid-stench.test.ts` and `usurp-preview-acrid-stench-red`.

### Playline G — Appalling Bearers prevent (already documented as fixture)

- **Arrange:** Appalling Bearers equipped. Restless Cleric in hand. You would take damage.
- **Act:** Activate Appalling Bearers: discard Restless Cleric, destroy the equipment.
- **Assert:** Next 2 damage this turn is prevented. Bearers are destroyed. Cleric is in graveyard (discard, so Malice does not make a Corpse).

Fixture: `usurp-preview-appalling-bearers`. Test: `appalling-bearers.test.ts`.

---

## Loop 4 — Decay death → Gates / Corpses

**Cards:** Restless Templar; Restless Outlaw; any other Restless Zombie Ally with Decay; Gate to i'Arathael / Corrupted Corpse created.

**Printed (Templar):** Whenever a zombie you control with Decay dies, create a Gate. Decay.  
**Printed (Outlaw):** When this dies, create a Corrupted Corpse in banished. Decay.

### Playline H — Templar watches a Decay zombie die (already documented)

- **Arrange:** Restless Templar and Restless Magister in arena (both Decay).
- **Act:** Magister dies (combat damage or three −1{h} counters from successive end phases).
- **Assert:** A Gate to i'Arathael token is created. If Malice is the hero, Magister is also banished face-down and a Corrupted Corpse is created (Loops 1+4 together).

Covered by `restless-templar.test.ts` (Gate on Decay zombie death; non-zombie ally is the boundary). Decay counters: `keyword-decay.test.ts` and simulator `decay-ability` (INTERACTION-QA isolates Decay from Malice).

### Playline I — Outlaw dies into a Corpse (already documented)

- **Arrange:** Restless Outlaw in arena.
- **Act:** Outlaw dies (attack damage or Decay to 0 life).
- **Assert:** A Corrupted Corpse is in your banished zone. Outlaw itself is in graveyard unless Malice is in play, in which case Malice also banishes it face-down (two Corpse-creation paths: Outlaw’s own trigger and Malice’s).

Covered by `restless-outlaw.test.ts` and `usurp-preview-restless-outlaw-red`.

---

## Loop 5 — on-hit / on-attack Corrupted Corpse makers

**Cards:** Commit to Corruption; Acrid Stench; Mark of Neverest; Forsaken Strike or Restless Magister as the IAR attack; Corrupted Corpse created.

### Playline J — Commit to Corruption arms Forsaken Strike (already documented as Commit AAA; IAR-only attack pairing is the same latch)

- **Arrange:** Malice. Commit to Corruption (red) and Forsaken Strike in hand. No extra zombie payments.
- **Act:** Play Commit to Corruption (go again). Play Forsaken Strike without paying zombies. It hits the opposing hero.
- **Assert:** Forsaken Strike had +3{p} (red Commit). A Corrupted Corpse is in banished. A miss still has the power bonus and creates no Corpse (`commit-to-corruption.test.ts` boundary).

Engine coverage uses a non-IAR next attack in the card suite; the printed latch is “your next attack this turn,” so an IAR Forsaken Strike is the inventory-legal stand-in. Fixture: `usurp-preview-commit-to-corruption-red`.

### Playline K — Mark of Neverest on Restless Magister (new as an IAR-zombie binding)

- **Arrange:** Malice. Restless Magister in arena. Mark of Neverest in hand. A face-up card in banished (for example a previously Blood-Debt Corrupted Corpse is already face-up in banished, or any face-up banished card).
- **Act:** Play Mark of Neverest bound to Restless Magister. Activate Magister with Vox (Loop 2) so it hits the opposing hero. Choose to turn the banished card face-down.
- **Assert:** Magister had +1{p} from the bind. A Corrupted Corpse is created in banished. If Magister later dies, the same rider may fire again on death.

`mark-of-neverest.test.ts` proves bind, +1{p}, and the face-down → Corpse rider, but binds **Limpit Hop-Along** (not IAR). The IAR body is Restless Magister / any Restless Zombie Ally. **New** as a Necromancy pairing; engine path is the same bind-to-ally primitive. Fixture exists: `usurp-preview-mark-of-neverest-blue`.

---

## Supporting recycle (in inventory, not a criterion-2 loop)

These mention zombie in functional text and feed Loops 1–2:

| Card                                      | Line                                                                                                                                                             |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bridge of Damnation                       | Start of turn: put a banished zombie into graveyard or the aura dies. Tested in `bridge-of-damnation.test.ts`. Fixture `usurp-preview-bridge-of-damnation-blue`. |
| Restless Corporal                         | Action — {t}: put a banished card into graveyard (then Malice can replay it). Fixture `usurp-preview-restless-corporal-red`.                                     |
| Shadowrealm Solace / Strength / Swiftness | Put banished card to graveyard; zombie riders heal / +3{p} / go again. Strength AAA exists (`shadowrealm-strength.test.ts`) with Restless Magister in banished.  |

### Playline L — Strength recycles a banished zombie into the next IAR attack (new composition)

- **Arrange:** Malice. Restless Magister in banished (face-up). Shadowrealm Strength and Bone Mass in hand.
- **Act:** Play Shadowrealm Strength, moving Magister to graveyard. Play Bone Mass; it attacks (optional discard skipped).
- **Assert:** Magister is in the graveyard (Malice can later replay it). Bone Mass had +3{p} from Strength.

---

## Already documented vs new

| Playline                     | Label               | Where                                                                              |
| ---------------------------- | ------------------- | ---------------------------------------------------------------------------------- |
| A Malice death → Corpse      | already documented  | `malice.test.ts`, `usurp-preview-malice`, Forsaken+Malice QA                       |
| B Malice GY play under Vox   | already documented  | `malice.test.ts`, `usurp-preview-vox-necropolis`                                   |
| C Vox seated Attack          | already documented  | `vox-necropolis.test.ts`                                                           |
| D Corrupted Corpse Vox swing | already documented  | `corrupted-corpse.test.ts`, `usurp-preview-corrupted-corpse`                       |
| E Forsaken Strike payments   | already documented  | `forsaken-strike.test.ts`, INTERACTION-QA                                          |
| F Acrid Stench discard       | already documented  | `acrid-stench.test.ts`                                                             |
| G Appalling Bearers          | already documented  | `appalling-bearers.test.ts`                                                        |
| H Templar Decay Gate         | already documented  | `restless-templar.test.ts`, `decay-ability`                                        |
| I Outlaw death Corpse        | already documented  | `restless-outlaw.test.ts`                                                          |
| J Commit arms next attack    | already documented  | `commit-to-corruption.test.ts` (next attack in suite is non-IAR; latch is generic) |
| K Mark on Restless Magister  | **new** IAR pairing | Mark suite binds a non-IAR ally                                                    |
| L Strength + Bone Mass       | **new** composition | Strength suite uses a non-IAR follow-up attack                                     |

## Blockers

No inventory row is missing from generated IAR printings. The six catalog holes from the Card Vault completeness pass (IAR050–052 Rise to the Challenge, IAR224–226 Dark Arcanite) are not zombie/corpse cards.

Playlines A–J are executable on authored IAR modules plus the tokens they create. K and L are executable on the same primitives; they are labeled new because existing AAA setups used a non-IAR ally or follow-up attack.

Adjacent IAR cards that pay **ally** (not zombie/corpse text) — Danse Macabre, Tome of Necrosis, Bone Barrier, Skeletal Puppetry, Corpse Cover — are outside this inventory.
