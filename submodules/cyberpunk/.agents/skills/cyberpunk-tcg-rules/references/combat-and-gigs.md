# Combat and Gigs

## Contents

- Playmat areas
- Gigs and Street Cred
- Combat restrictions
- Fighting Units
- Direct attacks and theft
- Defensive interruptions

## Playmat areas

- `Fixer area`: hold all unrecruited Gig Dice here until they are claimed at the start of turns.
- `Gig area`: hold claimed Gigs here, including Gigs stolen from the rival.
- `Field`: place Units here and resolve combat here.
- `Eddies area`: place sold cards here face-down; spend them to pay costs.
- `Legends area`: hold the 3 Legend cards here, starting face-down.
- `Deck`: draw from here at the start of each turn.
- `Trash`: send discarded cards and defeated cards here.

## Gigs and Street Cred

- Treat each die as one Gig, no matter what number is showing.
- Compute Street Cred by summing the face values of the dice in a player's Gig area.
- Let cards care about Street Cred totals when their text says so.
- Keep in mind that two small dice are closer to winning than one large die, because the win condition counts dice rather than pips.

## Combat restrictions

- Let only ready Units attack.
- Spend the attacking Unit as part of declaring the attack.
- Allow attacks only against spent rival Units or the rival directly.
- Prevent attacks against ready rival Units.
- Remember that ready Units do not automatically protect Gigs. They only interfere with attacks if they have `BLOCKER`, `QUICK`, or another explicit effect.

## Fighting Units

When a Unit attacks a spent rival Unit:

1. Spend the attacking Unit.
2. Resolve the attacker's `ATTACK` trigger, if any.
3. Give the defender a chance to call a Legend, activate `QUICK` effects, or assign a ready `BLOCKER`.
4. Compare total power values.
5. Defeat the lower-power side, or defeat both sides on a tie.
6. Move defeated Units and attached Gear to the trash.
7. Resolve any `DEFEATED` effects on defeated Units.

## Direct attacks and theft

When a Unit attacks the rival directly:

1. Spend the attacking Unit.
2. Resolve the attacker's `ATTACK` trigger, if any.
3. Give the defender a chance to call a Legend, activate `QUICK` effects, or assign a ready `BLOCKER`.
4. If the attack still connects, steal Gig Dice from the rival.

Theft amount:

- Steal 1 Gig by default.
- Steal 2 total Gigs at 10 power.
- Steal 3 total Gigs at 20 power.
- Continue adding 1 Gig for each additional full 10 power.

Let the attacker choose which die or dice to take from the rival's Gig area.

## Defensive interruptions

- Allow the defender to call a Legend during the defensive step, once per rival turn.
- Allow the defender to activate `QUICK` effects or play `QUICK` Programs during the defensive step.
- Allow a ready `BLOCKER` to spend and redirect the attack to itself.
- Treat a redirected direct attack as a fight against the blocking Unit.
- Do not award any stolen Gigs if the original direct attack was redirected or otherwise prevented from hitting the rival.
