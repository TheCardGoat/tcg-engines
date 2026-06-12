# Card Test Coverage Audit

Generated from `packages/cards/src/**/{legends,units,programs,gear}/*.ts` and matching tests under `packages/engine/src/cards/**`.

## Scope And Method

- Counts concrete card files only; `index.ts`, helpers, generated bundle files, and package barrels are excluded.
- Lists the printed `rulesText` where present, plus declared `keywords` and `timingTriggers`.
- Lists existing test case names exactly as they appear in the matching card test file.
- The coverage note is title-based triage, not a proof that every assertion is correct. Use this as the review queue for deciding which card tests need stronger happy-path assertions.
- Edge-case tests should remain in shared effect, target, condition, and move suites when they are not card-specific.

## Summary

- Card source files: 48
- Matching card test files: 48
- Missing card test files: 0
- Cards still requiring assertion-level review: 48

## Important Caveat

This document proves that every concrete card source currently has a matching card test file and lists what those tests claim to cover. It does not prove the assertions are complete or correct. The next pass should inspect the source ability DSL and each test body, then mark cards as complete only when at least one card-level happy path exercises the actual ability behavior.

## Card Matrix

### Dying Night - V's Pistol

- Source: `packages/cards/src/alpha/gear/dying-night-v-s-pistol.ts`
- Test: `packages/engine/src/cards/alpha/gear/dying-night-v-s-pistol.test.ts`
- Type: `gear`
- Ability / rules text: (Equip to a unit or face-up legend.) ATTACK If you have 7+ Street Cred, defeat a rival gear card that costs 2 or less.
- Keywords: _None_
- Timing triggers: `attack`
- Coverage note: Has named happy-path coverage (defeat, equip, attack).
- Test cases:
  - can equip to a friendly unit
  - host gains +2 power from gear
  - defeats a rival gear card costing <= 2 when street cred >= 7 on attack
  - defeats the selected rival gear during a direct attack in the high-cred scenario
  - does NOT defeat rival gear when street cred < 7
  - no effect when rival has no gear
  - deducts 2 eddies to equip
  - fails to equip with insufficient eddies
  - emits an action log when gear is equipped

### Kiroshi Optics

- Source: `packages/cards/src/alpha/gear/kiroshi-optics.ts`
- Test: `packages/engine/src/cards/alpha/gear/kiroshi-optics.test.ts`
- Type: `gear`
- Ability / rules text: (Equip to a unit or face-up legend.) ATTACK Look at a friendly face-down legend without revealing it.
- Keywords: _None_
- Timing triggers: `attack`
- Coverage note: Has named happy-path coverage (equip, attack).
- Test cases:
  - can equip to a friendly unit
  - host gains +1 power from gear
  - emits cardsRevealed event when host attacks and face-down legends exist
  - fires attack trigger on direct attack
  - deducts 1 eddie to equip
  - fails to equip with insufficient eddies
  - emits an action log when gear is equipped
  - attack trigger fires during unit combat
  - keeps the peeked legend identity private while logging the public slot

### Mandibular Upgrade

- Source: `packages/cards/src/alpha/gear/mandibular-upgrade.ts`
- Test: `packages/engine/src/cards/alpha/gear/mandibular-upgrade.test.ts`
- Type: `gear`
- Ability / rules text: (Equip to a unit or face-up legend.) BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)
- Keywords: `blocker`
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (block, equip, attack).
- Test cases:
  - can equip to a friendly unit
  - host gains +0 power (gear power is 0)
  - host with gear can block a rival's direct attack
  - host is spent when activated as a blocker
  - spent host cannot block
  - deducts 1 eddie to equip
  - fails to equip with insufficient eddies
  - emits an action log when gear is equipped
  - emits a blocker action log when host blocks

### Mantis Blades

- Source: `packages/cards/src/alpha/gear/mantis-blades.ts`
- Test: `packages/engine/src/cards/alpha/gear/mantis-blades.test.ts`
- Type: `gear`
- Ability / rules text: (Equip to a unit or face-up legend.)
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (equip).
- Test cases:
  - definition matches expected stats
  - can be equipped to a friendly unit
  - host gains +2 power from gear

### Sandevistan

- Source: `packages/cards/src/alpha/gear/sandevistan.ts`
- Test: `packages/engine/src/cards/alpha/gear/sandevistan.test.ts`
- Type: `gear`
- Ability / rules text: (Equip to a unit or face-up legend.) PLAY This unit can attack spent units this turn.
- Keywords: _None_
- Timing triggers: `play`
- Coverage note: Has named happy-path coverage (equip, attack).
- Test cases:
  - can equip to a friendly unit
  - host gains +3 power from gear
  - grants canAttackOnPlayedTurnAgainstUnits active effect on equip
  - canAttackOnPlayedTurnAgainstUnits rule is turn-scoped (expires at end of turn)
  - host with gear can attack a spent rival unit
  - deducts 3 eddies to equip
  - fails to equip with insufficient eddies
  - emits an action log when gear is equipped

### Satori - Sword of Saburo

- Source: `packages/cards/src/alpha/gear/satori-sword-of-saburo.ts`
- Test: `packages/engine/src/cards/alpha/gear/satori-sword-of-saburo.test.ts`
- Type: `gear`
- Ability / rules text: (Equip to a unit or face-up legend.) ATTACK If this unit wins a fight against a rival unit, draw a card.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (draw, equip, attack).
- Test cases:
  - can equip to a friendly unit
  - host gains +1 power from gear
  - host can attack a spent rival unit
  - host can attack rival directly
  - deducts 2 eddies to equip
  - fails to equip with insufficient eddies
  - gear goes to trash when host is defeated in combat
  - emits an action log when gear is equipped
  - attacks a rival unit, wins the fight, and draws a card
  - does not draw when the host loses the fight
  - does not draw on a mutual KO
  - does not draw on a direct attack (gigsStolen result)
  - does not fire when a different friendly unit (not the host) wins a fight

### Goro Takemura - Hands Unclean

- Source: `packages/cards/src/alpha/legends/goro-takemura-hands-unclean.ts`
- Test: `packages/engine/src/cards/alpha/legends/goro-takemura-hands-unclean.test.ts`
- Type: `legend`
- Ability / rules text: GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.) BLOCKER (When a rival units attacks, you may spend this unit to redirect the attack to this unit.)
- Keywords: `goSolo`, `blocker`
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (spend, ready, block, attack, play).
- Test cases:
  - enters the field as a ready unit with no summoning sickness
  - spends Goro when he attacks
  - cannot attack when spent
  - emits a localised action log for the direct attack
  - redirects a direct attack to itself
  - is spent when activated as a blocker
  - blocking a direct attack steals no gigs on resolution
  - emits blockerActivated event when Goro blocks
  - emits a localised action log when Goro blocks
  - emits a localised action log when the fight resolves — Goro wins
  - spent Goro cannot block
  - only the defending player can activate Goro as a blocker

### Jackie Welles - Pour One Out For Me

- Source: `packages/cards/src/alpha/legends/jackie-welles-pour-one-out-for-me.ts`
- Test: `packages/engine/src/cards/alpha/legends/jackie-welles-pour-one-out-for-me.test.ts`
- Type: `legend`
- Ability / rules text: The first time you play a blue unit or blue gear each turn, you may increase a friendly gig by 2. Then, if it's at max value, draw a card.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (draw, increase, play).
- Test cases:
  - increases a friendly gig by 2 when a blue unit is played
  - increases a friendly gig by 2 when a blue gear is played
  - draws a card if the gig reaches its max face value after the increase
  - does not draw a card if the gig is below max value after the increase
  - clamps the gig at its die type maximum
  - does not trigger when a non-blue card is played
  - only triggers once per turn — second blue card does not fire the ability again
  - fires again on the next turn after the limit resets
  - does not increase the gig if no friendly gig is available (optional effect skipped)
  - emits a gigValueChanged event when the gig is increased
  - increases only the first gig when multiple friendly gigs are present
  - draw fires on a d4 gig bumped to its max face of 4

### Saburo Arasaka - Stubborn Patriarch

- Source: `packages/cards/src/alpha/legends/saburo-arasaka-stubborn-patriach.ts`
- Test: `packages/engine/src/cards/alpha/legends/saburo-arasaka-stubborn-patriach.test.ts`
- Type: `legend`
- Ability / rules text: Your Arasaka units have +1 power when attacking.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (attack, power).
- Test cases:
  - Arasaka unit attacking with Saburo face-up gets +1 effective power
  - Arasaka unit has base power when not attacking (no attack state)
  - Saburo's buff lets an Arasaka unit defeat an equal-power opponent it would normally tie
  - Non-Arasaka unit does not receive the +1 power bonus when attacking
  - Saburo face-down (not yet called) does not grant the +1 power bonus
  - Only the actively attacking Arasaka unit benefits; idle Arasaka units are unaffected

### V - Corporate Exile

- Source: `packages/cards/src/alpha/legends/v-corporate-exile.ts`
- Test: `packages/engine/src/cards/alpha/legends/v-corporate-exile.test.ts`
- Type: `legend`
- Ability / rules text: GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)
- Keywords: `goSolo`
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (ready, attack).
- Test cases:
  - can be paid from the legend area to enter the field ready
  - enters the field as a ready unit with no summoning sickness
  - spends V when he attacks
  - cannot attack when spent
  - emits a localised action log for the direct attack
  - steals a gig on successful direct attack
  - steals only 1 gig at power 8 (below 10 threshold)
  - can attack a spent rival unit and win the fight
  - emits a localised action log when V wins a fight
  - appears as an attack candidate in the prompt layer
  - cannot attack a ready rival unit

### Viktor Vektor - Sit Down and Relax

- Source: `packages/cards/src/alpha/legends/viktor-vektor-sit-down-and-relax.ts`
- Test: `packages/engine/src/cards/alpha/legends/viktor-vektor-sit-down-and-relax.test.ts`
- Type: `legend`
- Ability / rules text: FLIP Search the top 5 cards of your deck for up to 2 gear that costs 2 or less each. Reveal them and add them to your hand. (Place the other cards on the bottom of your deck in a random order.)
- Keywords: _None_
- Timing triggers: `flip`
- Coverage note: Has named happy-path coverage (search, flip).
- Test cases:
  - finds gear in the top 5 and adds it to hand when called
  - can select up to 2 gear cards
  - allows selecting 0 cards (up to 2 is optional)
  - cannot select more than 2 cards
  - cannot select gear that costs more than 2
  - cannot select non-gear cards from the search window
  - bottom-decks the remaining cards after search
  - flips Viktor face-up when called
  - costs 2 eddies to call
  - fails to call with insufficient eddies
  - emits a searchPerformed event
  - emits a reveal log with card IDs for the top 5
  - emits an action log for the call
  - emits an action log for the search resolution
  - can select gear costing exactly 2

### Yorinobu Arasaka - Embracing Destruction

- Source: `packages/cards/src/alpha/legends/yorinobu-arasaka-embracing-destruction.ts`
- Test: `packages/engine/src/cards/alpha/legends/yorinobu-arasaka-embracing-destruction.test.ts`
- Type: `legend`
- Ability / rules text: The first time a friendly Arasaka unit attacks each turn, draw a card. Then, if you have less than 20 Street Cred, discard 1 card from your hand to your trash.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (draw, attack, discard, trash).
- Test cases:
  - draws a card when a friendly Arasaka unit attacks and Yorinobu is face-up
  - creates a discardFromHand pending choice when streetCred < 20
  - resolves the discard pending choice by moving the selected card to trash
  - does not discard when streetCred >= 20
  - does not discard when streetCred > 20
  - does not trigger when a non-Arasaka unit attacks
  - does not trigger when Yorinobu is face-down
  - triggers only once per turn (firstTimeEachTurn)
  - triggers again on a new turn
  - does not trigger when a rival's Arasaka unit attacks
  - triggers after calling Yorinobu face-up
  - auto-discards when hand has exactly 1 card after draw
  - rejects resolveDiscardFromHand with a card not in hand

### Corporate Surveillance

- Source: `packages/cards/src/alpha/programs/corporate-surveillance.ts`
- Test: `packages/engine/src/cards/alpha/programs/corporate-surveillance.test.ts`
- Type: `program`
- Ability / rules text: Spend a rival unit with cost 3 or less.
- Keywords: _None_
- Timing triggers: `play`
- Coverage note: Has named happy-path coverage (spend).
- Test cases:
  - spends a rival unit with cost <= 3
  - program goes to trash after resolving
  - deducts 2 eddies from the player
  - can target a rival unit with cost exactly 3
  - can target an already-spent rival unit (becomes/stays spent)
  - offers only rival units with cost 3 or less as eligible targets
  - spends only the selected rival unit when multiple valid targets exist
  - fails when player has insufficient eddies
  - does not spend a rival unit with cost > 3
  - emits an action log for playing the program

### Floor It

- Source: `packages/cards/src/alpha/programs/floor-it.ts`
- Test: `packages/engine/src/cards/alpha/programs/floor-it.test.ts`
- Type: `program`
- Ability / rules text: Return a spent unit with cost 4 or less to its owner's hand.
- Keywords: _None_
- Timing triggers: `play`
- Coverage note: Has named happy-path coverage (return).
- Test cases:
  - returns a spent friendly unit to the owner's hand
  - returns a spent rival unit to the rival's hand (owner's hand)
  - offers spent rival units with cost 4 or less from the target DSL
  - program goes to trash after resolving
  - deducts 3 eddies from the player
  - can target a unit with cost exactly 3 (within limit)
  - cannot target a unit with cost > 4
  - cannot target a ready (unspent) unit
  - fails when player has insufficient eddies
  - emits an action log for playing the program

### Industrial Assembly

- Source: `packages/cards/src/alpha/programs/industrial-assembly.ts`
- Test: `packages/engine/src/cards/alpha/programs/industrial-assembly.test.ts`
- Type: `program`
- Ability / rules text: Increase a friendly gig by 4. Then, if you have 7+ Street Cred, draw a card.
- Keywords: _None_
- Timing triggers: `play`
- Coverage note: Has named happy-path coverage (draw, increase).
- Test cases:
  - asks the player to choose exactly one friendly gig
  - increases the chosen friendly gig die value by 4
  - does not increase unchosen friendly gigs
  - clamps gig value at die maximum (d6 max is 6)
  - clamps gig value at die maximum (d12 max is 12)
  - increases only one friendly gig when multiple are present
  - draws a card when street cred >= 7 after the increase
  - does NOT draw a card when street cred < 7 after the increase
  - program goes to trash after resolving
  - deducts 2 eddies from the player
  - fails when player has insufficient eddies
  - emits an action log for playing the program

### Reboot Optics

- Source: `packages/cards/src/alpha/programs/reboot-optics.ts`
- Test: `packages/engine/src/cards/alpha/programs/reboot-optics.test.ts`
- Type: `program`
- Ability / rules text: Give a friendly unit +4 power this turn. Defeat it at the end of the turn.
- Keywords: _None_
- Timing triggers: `play`
- Coverage note: Has named happy-path coverage (defeat, power).
- Test cases:
  - gives the target unit +4 effective power
  - program goes to trash after resolving
  - deducts 2 eddies from the player
  - unit is defeated at end of turn
  - buffed unit can win a fight it would normally lose
  - power buff does not affect rival units
  - offers only friendly field units as eligible targets
  - buffs only the selected friendly unit when multiple valid targets exist
  - has no effect when there are no friendly field units to target
  - fails when player has insufficient eddies
  - emits an action log for playing the program
  - emits an action log naming the selected target
  - keeps both target-selection and delayed-defeat logs

### Armored Minotaur

- Source: `packages/cards/src/alpha/units/armored-minotaur.ts`
- Test: `packages/engine/src/cards/alpha/units/armored-minotaur.test.ts`
- Type: `unit`
- Ability / rules text: PLAY If you have 12+ Street Cred, defeat a rival unit with power 5 or less.
- Keywords: _None_
- Timing triggers: `play`
- Coverage note: Has named happy-path coverage (defeat, play, power).
- Test cases:
  - defeats a rival unit with power <= 5 when street cred >= 12
  - does NOT trigger when street cred < 12
  - defeats only the chosen rival unit when multiple power <= 5 targets exist
  - cannot defeat a unit with power > 5
  - defeats only power <= 5 units, leaving power > 5 units unharmed
  - no valid targets: ability is skipped (no error)
  - action log shows the card was played
  - defeated unit goes to rival's trash
  - Armored Minotaur enters field even if condition not met
  - triggers at exactly 12 street cred (boundary)
  - triggers with street cred well above 12

### Corpo Security

- Source: `packages/cards/src/alpha/units/corpo-security.ts`
- Test: `packages/engine/src/cards/alpha/units/corpo-security.test.ts`
- Type: `unit`
- Ability / rules text: This unit can't attack. BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)
- Keywords: `blocker`
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (spend, block, attack).
- Test cases:
  - can block a rival's direct attack on the rival player
  - can block a rival's attack on a spent friendly unit
  - must be ready to block (fails when spent)
  - spends after blocking
  - emits a localised action log when blocking
  - has the cantAttack rule granted by its static ability
  - has a static grantRule activeEffect with origin static
  - also has the blocker rule alongside cantAttack
  - can still be on field and block despite not being able to attack
  - emits blockerActivated event when blocking — confirming defensive utility despite cantAttack
  - cannot attack a spent rival unit (cantAttack rule blocks the move)
  - cannot attack the rival directly (cantAttack rule blocks the move)

### Delamain Cab

- Source: `packages/cards/src/alpha/units/delamain-cab.ts`
- Test: `packages/engine/src/cards/alpha/units/delamain-cab.test.ts`
- Type: `unit`
- Ability / rules text: _None_
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Covered for no-card-specific-ability baseline.
- Test cases:
  - definition matches expected stats
  - can be played from hand to field

### Emergency Atlus

- Source: `packages/cards/src/alpha/units/emergency-atlus.ts`
- Test: `packages/engine/src/cards/alpha/units/emergency-atlus.test.ts`
- Type: `unit`
- Ability / rules text: _None_
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Covered for no-card-specific-ability baseline.
- Test cases:
  - definition matches expected stats
  - can be played from hand to field

### Evelyn Parker - Scheming Siren

- Source: `packages/cards/src/alpha/units/evelyn-parker-scheming-siren.ts`
- Test: `packages/engine/src/cards/alpha/units/evelyn-parker-scheming-siren.test.ts`
- Type: `unit`
- Ability / rules text: When a rival steals one or more friendly gigs, if this unit is spent, draw a card.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (draw, steal).
- Test cases:
  - draws 1 card when rival steals a gig and Evelyn is spent
  - does NOT draw when Evelyn is ready (not spent)
  - does NOT trigger when friendly player steals a gig
  - draws for each gig stolen in a single attack (multi-steal)
  - triggers during rival's attack phase (Evelyn is on P1's field, P2 attacks)
  - action log shows the direct attack resolution
  - hand count increases by 1 after trigger
  - does NOT trigger when Evelyn is not on the field (in hand)
  - Evelyn stays spent after the trigger (doesn't ready)
  - does NOT trigger when no gigs are stolen (opponent has no gigs)

### Goro Takemura - Losing His Way

- Source: `packages/cards/src/alpha/units/goro-takemura-losing-his-way.ts`
- Test: `packages/engine/src/cards/alpha/units/goro-takemura-losing-his-way.test.ts`
- Type: `unit`
- Ability / rules text: This unit has +1 power during your turn for each face-up legend in your legends area.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (power).
- Test cases:
  - has base power with 0 face-up legends
  - gains +1 per face-up legend
  - gains +3 with all 3 legends face-up
  - does NOT gain power during rival's turn
  - power returns on next friendly turn
  - calling a legend mid-turn updates power immediately
  - does NOT count rival's face-up legends
  - idle units on same field are NOT buffed
  - effective power during attack

### Jackie Welles - Ride Or Die Choom

- Source: `packages/cards/src/alpha/units/jackie-welles-ride-or-die-choom.ts`
- Test: `packages/engine/src/cards/alpha/units/jackie-welles-ride-or-die-choom.test.ts`
- Type: `unit`
- Ability / rules text: This unit has +2 power for each of your friendly gigs. (Units steal an extra gig for every 10 power.)
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (steal, power).
- Test cases:
  - has base power with 0 friendly gigs
  - gains +2 power with 1 friendly gig
  - power scales with multiple gigs (3 gigs = base + 6)
  - power updates when gaining a new gig
  - power during attack reflects modifier
  - steals two gigs at 14 power
  - does NOT gain power from rival's gigs
  - idle units on same field are NOT buffed (only Jackie)
  - static abilities do not emit action logs
  - effective power in combat: Jackie defeats a unit it would tie without gigs

### MT0D12 Flathead

- Source: `packages/cards/src/alpha/units/mt0d12-flathead.ts`
- Test: `packages/engine/src/cards/alpha/units/mt0d12-flathead.test.ts`
- Type: `unit`
- Ability / rules text: If you have 7+ Street Cred, this unit can't be blocked.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (block).
- Test cases:
  - has cantBeBlocked rule when street cred >= 7
  - does NOT have cantBeBlocked rule when street cred < 7
  - does NOT have cantBeBlocked rule with no gig dice
  - has cantBeBlocked when street cred is exactly 7
  - has cantBeBlocked when street cred exceeds 7
  - rule activates dynamically as street cred changes from below to at/above 7
  - rule deactivates dynamically as street cred drops below 7
  - rival blocker cannot block when cantBeBlocked is active
  - rival blocker CAN block when street cred < 7
  - can attack directly when cantBeBlocked is active (no blocker redirect)
  - can still be attacked by rival units normally
  - effective power during attack is base power (5)
  - does NOT grant cantBeBlocked to other friendly units

### Ruthless Lowlife

- Source: `packages/cards/src/alpha/units/ruthless-lowlife.ts`
- Test: `packages/engine/src/cards/alpha/units/ruthless-lowlife.test.ts`
- Type: `unit`
- Ability / rules text: When a rival steals one or more friendly gigs, if this unit is spent, the value of those gigs becomes 1.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (steal).
- Test cases:
  - sets stolen gig value to 1 when rival steals and Lowlife is spent
  - does NOT trigger when Ruthless Lowlife is ready (not spent)
  - does NOT trigger when friendly player steals a gig
  - stolen gig's value changes from original to 1
  - rival's street cred increases by only 1 instead of the original gig value
  - emits a gigValueChanged event showing the value drop
  - Ruthless Lowlife stays spent after trigger
  - works with high-value gig dice (e.g., d12 at faceValue 10)

### Secondhand Bombus

- Source: `packages/cards/src/alpha/units/secondhand-bombus.ts`
- Test: `packages/engine/src/cards/alpha/units/secondhand-bombus.test.ts`
- Type: `unit`
- Ability / rules text: This unit can't attack. BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)
- Keywords: `blocker`
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (spend, block, attack).
- Test cases:
  - can block a rival's direct attack on the rival player
  - can block a rival's attack on a spent friendly unit
  - must be ready to block (fails when spent)
  - spends after blocking
  - emits a localised action log when blocking
  - has the cantAttack rule granted by its static ability
  - has a static grantRule activeEffect with origin static
  - also has the blocker rule alongside cantAttack
  - can still be on field and block despite not being able to attack
  - emits blockerActivated event when blocking — confirming defensive utility despite cantAttack
  - cannot attack a spent rival unit (cantAttack rule blocks the move)
  - cannot attack the rival directly (cantAttack rule blocks the move)

### Swordwise Huscle

- Source: `packages/cards/src/alpha/units/swordwise-huscle.ts`
- Test: `packages/engine/src/cards/alpha/units/swordwise-huscle.test.ts`
- Type: `unit`
- Ability / rules text: _None_
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Covered for no-card-specific-ability baseline.
- Test cases:
  - definition matches expected stats
  - can be played from hand to field

### T-Bug - Amateur Philosopher

- Source: `packages/cards/src/alpha/units/t-bug-amateur-philosopher.ts`
- Test: `packages/engine/src/cards/alpha/units/t-bug-amateur-philosopher.test.ts`
- Type: `unit`
- Ability / rules text: _None_
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Covered for no-card-specific-ability baseline.
- Test cases:
  - definition matches expected stats
  - can be played from hand to field

### Lucyna Kushinada

- Source: `packages/cards/src/promo/legends/lucyna-kushinada.ts`
- Test: `packages/engine/src/cards/promo/legends/lucyna-kushinada.test.ts`
- Type: `legend`
- Ability / rules text: _None_
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Covered for no-card-specific-ability baseline.
- Test cases:
  - can be called as a standard face-down Legend without creating a pending ability
  - declares no card-specific timing triggers, keywords, or abilities

### Gorilla Arms

- Source: `packages/cards/src/spoiler/gear/gorilla-arms.ts`
- Test: `packages/engine/src/cards/spoiler/gear/gorilla-arms.test.ts`
- Type: `gear`
- Ability / rules text: (Equip to a Unit or face-up Legend.) The first time this Unit steals a Gig each turn, you may steal a rival Gig with the same number of sides.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (steal, equip).
- Test cases:
  - can equip to a friendly unit
  - host gains +4 power from gear
  - deducts 4 eddies to equip
  - fails to equip with insufficient eddies
  - card definition has a gigStolen event trigger
  - ability has firstTimeEachTurn limit
  - stealGig effect uses sameSidesAs filter
  - emits an action log when gear is equipped
  - tracks first-time triggers separately for three equipped hosts
  - does not trigger when the rival steals a gig (player filter rejects)
  - does not trigger when a different friendly unit (not the host) steals (source filter rejects)

### Alt Cunningham - Soulkiller Architect

- Source: `packages/cards/src/spoiler/legends/alt-cunningham-soulkiller-architect.ts`
- Test: `packages/engine/src/cards/spoiler/legends/alt-cunningham-soulkiller-architect.test.ts`
- Type: `legend`
- Ability / rules text: GO SOLO When this Legend steals a Gig, you may remove this Legend from the game. If you do, choose a Program from your trash. Play it for free.
- Keywords: `goSolo`
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (steal, play, trash).
- Test cases:
  - enters the field as a ready unit with no summoning sickness
  - spends Alt when she attacks
  - cannot attack when spent
  - emits a localised action log for the direct attack
  - triggers when Alt steals a gig via direct attack — sets a chooseCardToPlay pending choice
  - Alt is removed from the game after the ability fires
  - plays a program from trash for free after resolving the choice
  - stolen gig is in P1's gig area after the ability resolves
  - does not trigger when a different friendly unit steals a gig (source: self)
  - does not trigger when the rival has no gigs to steal
  - does not set a pending choice when no programs are in trash
  - offers multiple programs when more than one is in trash
  - emits action logs for the gig steal
  - does not trigger when Alt is face-down in the legend area

### Dum Dum - Maelstrom Triggerman

- Source: `packages/cards/src/spoiler/legends/dum-dum-maelstrom-triggerman.ts`
- Test: `packages/engine/src/cards/spoiler/legends/dum-dum-maelstrom-triggerman.test.ts`
- Type: `legend`
- Ability / rules text: CALL You may defeat a friendly Gear. If you do, draw 4 cards. Otherwise, draw 1 card.
- Keywords: _None_
- Timing triggers: `call`
- Coverage note: Has named happy-path coverage (draw, defeat, call).
- Test cases:
  - calling flips Dum Dum face-up
  - costs 2 eddies to call
  - fails to call with insufficient eddies
  - draws 1 card when no friendly gear exists
  - prompts to choose a friendly Gear when one can be defeated
  - defeating a friendly Gear draws 4 cards and detaches the Gear
  - declining to defeat a Gear draws 1 card and leaves Gear attached
  - Dum Dum remains in legend area after being called
  - emits action log for the call
  - cannot call a face-up (already called) legend

### Evelyn Parker - Beautiful Enigma

- Source: `packages/cards/src/spoiler/legends/evelyn-parker-beautiful-enigma.ts`
- Test: `packages/engine/src/cards/spoiler/legends/evelyn-parker-beautiful-enigma.test.ts`
- Type: `legend`
- Ability / rules text: CALL Decrease a rival Gig's value by 3. [Spend Icon]: Search the top 3 cards of your deck for up to 1 Braindance Program. Add it to your hand. Bottom-deck the rest.
- Keywords: _None_
- Timing triggers: `call`
- Coverage note: Has named happy-path coverage (spend, search, call).
- Test cases:
  - decreases a rival gig's value by 3 when called
  - clamps the gig value to a minimum of 1
  - decreases a d4 gig correctly
  - emits a gigValueChanged event
  - costs 2 eddies to call
  - fails to call with insufficient eddies
  - flips Evelyn face-up when called
  - emits action log for the call
  - decreases only one rival gig when multiple are present
  - finds a Braindance program in the top 3 and adds it to hand
  - spends Evelyn when the ability is activated
  - cannot activate when Evelyn is already spent
  - cannot activate when Evelyn is face-down
  - allows selecting 0 cards (up to 1 is optional)
  - bottom-decks the remaining cards after search
  - emits a searchPerformed event
  - emits an action log for the activated ability
  - emits an action log for the search resolution
  - emits a reveal log with category and cardIds
  - includes selected cardIds in the resolution log

### Goro Takemura - Vengeful Bodyguard

- Source: `packages/cards/src/spoiler/legends/goro-takemura-vengeful-bodyguard.ts`
- Test: `packages/engine/src/cards/spoiler/legends/goro-takemura-vengeful-bodyguard.test.ts`
- Type: `legend`
- Ability / rules text: CALL Ready this Legend. When a rival Unit attacks, [Spend Icon]: If you have a sided-pair of Gigs, give a friendly Unit with cost 4 or less +1 power and BLOCKER this turn.
- Keywords: _None_
- Timing triggers: `call`
- Coverage note: Has named happy-path coverage (spend, ready, block, attack, power, call).
- Test cases:
  - Goro is face-up after being called
  - Goro is readied (not spent) after being called
  - calling Goro costs 2 eddies
  - emits a callLegend action log
  - rival attack grants +1 power and BLOCKER to eligible friendly unit
  - granted BLOCKER is functional — unit can block the attack
  - effects are temporary — cleared after turn ends
  - does not trigger when Goro is already spent
  - does not trigger when Goro is face-down
  - does not trigger when no friendly unit with cost 4 or less exists
  - Goro spends but effects are skipped without a sided-pair of Gigs
  - does not trigger on friendly unit attacks — only rival attacks
  - emits an action log for the rival's attack

### Panam Palmer - Nomad Cavalry

- Source: `packages/cards/src/spoiler/legends/panam-palmer-nomad-cavalry.ts`
- Test: `packages/engine/src/cards/spoiler/legends/panam-palmer-nomad-cavalry.test.ts`
- Type: `legend`
- Ability / rules text: CALL Ready this Legend. When a friendly Unit attacks, [Spend Icon]: Choose a Gear from this Legend and equip it to that Unit. If you do, ready that Unit.
- Keywords: _None_
- Timing triggers: `call`
- Coverage note: Has named happy-path coverage (ready, equip, attack, call).
- Test cases:
  - Panam is face-up after being called
  - Panam is ready (not spent) after being called
  - sets a chooseCardToMove pending choice when a friendly unit attacks and Panam has gear
  - Panam is spent after the ability triggers
  - gear moves from Panam to the attacking unit after resolving the choice
  - Gorilla Arms is no longer attached to Panam after resolving
  - attacking unit is readied after equipping the gear
  - declining the choice does not ready the attacking unit
  - ability does not trigger when Panam is already spent
  - ability does not trigger when no gear is attached to Panam
  - ability does not trigger when a rival unit attacks (player: friendly only)

### River Ward - Detective on the Hunt

- Source: `packages/cards/src/spoiler/legends/river-ward-detective-on-the-hunt.ts`
- Test: `packages/engine/src/cards/spoiler/legends/river-ward-detective-on-the-hunt.test.ts`
- Type: `legend`
- Ability / rules text: CALL Draw a card. When a Unit attacks, [Spend Icon]: Choose a Gear from your hand with cost 2 or less. Equip it for free to a friendly Yellow Unit with no equipped Gears.
- Keywords: _None_
- Timing triggers: `call`
- Coverage note: Has named happy-path coverage (equip, attack, call).
- Test cases:
  - P1's hand count increases by 1 after calling River Ward
  - River Ward is face-up (not faceDown) after being called
  - sets a chooseCardToPlay pending choice when all conditions are met
  - pending choice is marked as free play
  - River Ward is spent after the ability triggers
  - gear is on the field and attached to the yellow unit after resolving the choice
  - gear is removed from hand after being equipped
  - gear is equipped for free — P1's eddies do not change
  - ability does not trigger when River Ward is already spent
  - ability does not trigger when no eligible yellow unit is on the field
  - ability does not trigger when no gear with cost 2 or less is in hand
  - only gears with cost 2 or less appear as valid choices
  - ability triggers when a rival unit attacks (player: any)
  - yellow unit that already has gear attached is excluded — binding returns no target and ability does not fire
  - cardPlayed triggers from other cards fire when gear is played via resolveCardToPlay

### Royce - Psycho on the Edge

- Source: `packages/cards/src/spoiler/legends/royce-psycho-on-the-edge.ts`
- Test: `packages/engine/src/cards/spoiler/legends/royce-psycho-on-the-edge.test.ts`
- Type: `legend`
- Ability / rules text: GO SOLO During your turn, this Legend has +2 power for each equipped Gear.
- Keywords: `goSolo`
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (equip, power).
- Test cases:
  - enters the field ready (not spent)
  - can attack the rival on the same turn it enters
  - is spent after attacking
  - cannot attack when spent
  - keeps equipped gear and scaled power after going solo
  - has base power 6 with no gear, face-up during owner's turn
  - has power 12 with 1 Gorilla Arms attached during owner's turn
  - has power 10 with 1 Gorilla Arms attached during opponent's turn
  - has power 18 with 2 Gorilla Arms attached during owner's turn
  - has power 10 when face-down with gear attached (static inactive)
  - power updates dynamically: 6 before attach, 12 after attach
  - gear on P2's field does not buff Royce
  - power returns to 10 on P2's turn and 12 on P1's next turn

### V - Streetkid

- Source: `packages/cards/src/spoiler/legends/v-streetkid.ts`
- Test: `packages/engine/src/cards/spoiler/legends/v-streetkid.test.ts`
- Type: `legend`
- Ability / rules text: GO SOLO DEFEATED Discard the top 3 cards of your deck. Then, choose 1 Braindance Program from your trash and add it to your hand.
- Keywords: `goSolo`
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (defeat, trash).
- Test cases:
  - enters the field as a ready unit with no summoning sickness
  - spends V when she attacks
  - cannot attack when spent
  - emits a localised action log for the direct attack
  - P1's deck decreases by 3 after V is defeated
  - moves the Braindance Program from P1's trash to P1's hand
  - V is in P1's trash after being defeated
  - emits a cardDefeated event for V
  - does not error when P1 has no Braindance programs in trash
  - the fight action log records the correct winner and loser

### Afterparty at Lizzie's

- Source: `packages/cards/src/spoiler/programs/afterparty-at-lizzie-s.ts`
- Test: `packages/engine/src/cards/spoiler/programs/afterparty-at-lizzie-s.test.ts`
- Type: `program`
- Ability / rules text: Adjust a rival Gig by up to ±2. Then, if a friendly Gig has the same value, draw a card.
- Keywords: _None_
- Timing triggers: `play`
- Coverage note: Has named happy-path coverage (draw, adjust).
- Test cases:
  - can be played from hand when rival has a gig
  - deducts 2 eddies from the player
  - fails when player has insufficient eddies
  - first asks which rival gig to adjust
  - targets rival gigs (not friendly)
  - can choose the d12 instead of auto-selecting the first rival gig
  - draws when the adjusted rival gig matches a friendly gig value
  - program is no longer in hand after playing
  - no valid target when rival has no gigs — program resolves with no effect
  - emits an action log for playing the program

### Cyberpsychosis

- Source: `packages/cards/src/spoiler/programs/cyberpsychosis.ts`
- Test: `packages/engine/src/cards/spoiler/programs/cyberpsychosis.test.ts`
- Type: `program`
- Ability / rules text: You may also play this Program when a Unit attacks by paying this card's cost and spending a friendly Unit or face-up Legend. Give an equipped Unit +2 power this turn for each of its equipped Gear. Defeat the Unit at the end of this turn.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (defeat, spend, equip, attack, play, power).
- Test cases:
  - offers its play window as an optional choice when a unit attacks, before the defensive step
  - can decline the Cyberpsychosis window without paying costs or moving the program
  - asks which equipped unit receives Cyberpsychosis after the player chooses it
  - asks which equipped unit receives Cyberpsychosis
  - then asks which additional-cost card to spend
  - pays the card cost and spends the selected friendly unit
  - can spend a face-up legend instead of a unit for the additional cost
  - does not offer the attacking unit as the additional cost after it is spent to attack
  - moves the program from hand to trash after the special-timing play resolves
  - gives the equipped unit +2 power per gear this turn
  - defeats the selected equipped unit at end of turn
  - does not open the attack window without enough eddies to pay for the program
  - emits readable logs for the attack-window play and target selection

### Adam Smasher - Metal Over Meat

- Source: `packages/cards/src/spoiler/units/adam-smasher-metal-over-meat.ts`
- Test: `packages/engine/src/cards/spoiler/units/adam-smasher-metal-over-meat.test.ts`
- Type: `unit`
- Ability / rules text: PLAY Defeat all other Units.
- Keywords: _None_
- Timing triggers: `play`
- Coverage note: Has named happy-path coverage (defeat, play).
- Test cases:
  - defeats all rival units on play
  - defeats all friendly units (except self) on play
  - defeats both friendly AND rival units simultaneously
  - does NOT defeat Adam Smasher himself (excludeSelf)
  - Adam Smasher remains on field after play
  - enters field normally when no other units are present
  - defeated units go to their owner's trash
  - action log shows the card was played
  - works with many units on board
  - emits cardMoved events for each defeated unit

### Caliber - Totentanz's Top Dog

- Source: `packages/cards/src/spoiler/units/caliber-totentanz-s-top-dog.ts`
- Test: `packages/engine/src/cards/spoiler/units/caliber-totentanz-s-top-dog.test.ts`
- Type: `unit`
- Ability / rules text: DEFEATED A rival discards 1. If the card's cost is equal to the value of a friendly Gig, that rival discards 1 more.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (defeat, discard).
- Test cases:
  - definition matches expected stats
  - on defeat, fires a discardFromHand chooseTarget for the rival
  - requires one additional discard when the discarded card's cost matches a friendly gig
  - does not require the additional discard when the discarded card's cost does not match

### El Sombrerón - La Venganza Lenta

- Source: `packages/cards/src/spoiler/units/el-sombreron-la-venganza-lenta.ts`
- Test: `packages/engine/src/cards/spoiler/units/el-sombreron-la-venganza-lenta.test.ts`
- Type: `unit`
- Ability / rules text: ATTACK While fighting a rival Unit, double this Unit's power.
- Keywords: _None_
- Timing triggers: `attack`
- Coverage note: Has named happy-path coverage (attack, power).
- Test cases:
  - definition matches expected stats
  - doubles power when attacking a rival Unit (fightKind: fight)
  - does not double power when attacking the rival directly
  - uses doubled power to win the fight and defeat the rival unit

### Hanako Arasaka - In A Gilded Cage

- Source: `packages/cards/src/spoiler/units/hanako-arasaka-in-a-gilded-cage.ts`
- Test: `packages/engine/src/cards/spoiler/units/hanako-arasaka-in-a-gilded-cage.test.ts`
- Type: `unit`
- Ability / rules text: PLAY Reveal the top 4 cards of your deck. Then choose a friendly Gig. Add all cards with cost equal to that Gig's value to your hand. Trash the rest.
- Keywords: _None_
- Timing triggers: `play`
- Coverage note: Has named happy-path coverage (play, trash).
- Test cases:
  - adds cards with cost equal to selected gig value to hand
  - trashes non-matching cards
  - auto-selects all matching cards (allMatching: true)
  - prompts for gig selection via binding
  - no matching cards: all go to trash
  - all cards match: all go to hand
  - works with different gig values
  - reveals only the top 4 and moves real matching-cost cards to hand
  - hand count increases by number of matched cards
  - action log shows the search
  - keeps search reveal and result entries in player-facing move logs
  - emits a searchPerformed event
  - does not fire ability when no gig is available

### Kerry Eurodyne - The Last Rockerboy

- Source: `packages/cards/src/spoiler/units/kerry-eurodyne-the-last-rockerboy.ts`
- Test: `packages/engine/src/cards/spoiler/units/kerry-eurodyne-the-last-rockerboy.test.ts`
- Type: `unit`
- Ability / rules text: [Spend Icon]: If you have a Gig at max value, draw 2 cards.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (draw).
- Test cases:
  - draws 2 cards when activated with a gig at max value (d6 at 6)
  - does not draw when no gig is at max value
  - fails when Kerry is already spent (CARD_SPENT error)
  - Kerry becomes spent after activation
  - works with a d4 gig at max value (4)
  - works when one smaller die is at max and a larger die is below max
  - works with a d8 gig at max value (8)
  - does NOT check rival's gigs for max value
  - hand count increases by exactly 2
  - emits an action log for the activated ability
  - Kerry is spent even when the condition is not met (no max gig)

### Meredith Stout - Stone Cold Corpo

- Source: `packages/cards/src/spoiler/units/meredith-stout-stone-cold-corpo.ts`
- Test: `packages/engine/src/cards/spoiler/units/meredith-stout-stone-cold-corpo.test.ts`
- Type: `unit`
- Ability / rules text: When a rival decreases the value of your friendly Gig, you may choose a card from your trash and add it to your hand.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (trash).
- Test cases:
  - recovers a card from trash when rival gig value decreases
  - chooses one card when multiple trash cards are eligible
  - can decline the optional recovery
  - does NOT trigger on gig value increase
  - does NOT trigger when friendly gig value decreases (self-inflicted)
  - can choose not to recover (skip when trash is empty)
  - recovered card goes to hand
  - no cards in trash: ability is skipped without error
  - emits a gigValueChanged event when triggered
  - triggers when rival gig is set to lower value (via Evelyn decrease)
  - Meredith stays on field after trigger
  - works when Meredith is spent

### Placide - Voodoo Sentinel

- Source: `packages/cards/src/spoiler/units/placide-voodoo-sentinel.ts`
- Test: `packages/engine/src/cards/spoiler/units/placide-voodoo-sentinel.test.ts`
- Type: `unit`
- Ability / rules text: PLAY ATTACK You may discard a Program from your hand. If you do, bottom-deck a rival Unit.
- Keywords: _None_
- Timing triggers: `play`, `attack`
- Coverage note: Has named happy-path coverage (attack, discard).
- Test cases:
  - discards a Program from hand and bottom-decks a rival unit
  - can opt out of discarding (rival unit stays on field)
  - no Programs in hand: ability is skipped (no pending choice)
  - rival unit goes to bottom of rival's deck (not top)
  - chooses one rival unit to bottom-deck when multiple are eligible
  - discards a Program and bottom-decks a rival unit on attack
  - can opt out during attack trigger
  - works with Placide attacking a spent rival unit (unit fight)
  - action log shows the card moved events

### Riding Nomad

- Source: `packages/cards/src/spoiler/units/riding-nomad.ts`
- Test: `packages/engine/src/cards/spoiler/units/riding-nomad.test.ts`
- Type: `unit`
- Ability / rules text: This Unit can attack spent rival Units the turn it's played.
- Keywords: _None_
- Timing triggers: _None_
- Coverage note: Has named happy-path coverage (attack, play).
- Test cases:
  - can attack a spent rival unit on the turn played
  - CANNOT attack the rival player directly on the turn played
  - CANNOT attack a ready rival unit on the turn played
  - normal summoning sickness applies on subsequent turns (needs to wait a turn)
  - after surviving a turn, can attack normally (units and rival)
  - becomes spent after attacking
  - effective power during attack equals base power (6)
  - multiple Riding Nomads can each attack on play turn
  - rule only applies to self (other units still have summoning sickness)
  - defeats a weaker rival unit in combat on the turn played
