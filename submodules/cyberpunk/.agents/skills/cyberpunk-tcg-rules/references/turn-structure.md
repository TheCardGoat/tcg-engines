# Turn Structure

## Contents

- Setup
- Start of turn
- Main phase
- Attacking
- End states

## Setup

- Place the 3 Legends face-down in random order so the player does not know which Legend is where.
- Shuffle every non-Legend card into the deck.
- Put all Gig Dice in the fixer area.
- Both players roll a d20 (reroll on a tie). Whoever rolls higher decides who goes first.
- The player going first spends their 2 leftmost Legends and doesn't ready them on their first turn.
- Draw 6 cards for the opening hand.
- Allow one mulligan: shuffle that hand back and draw 6 new cards once.

## Start of turn

Resolve these steps in order:

1. Ready every spent card.
2. Draw 1 card. Do not impose a maximum hand size.
3. Take 1 die from the fixer area, roll it to set its value, then place it in the Gig area.

Additional constraints:

- Let the player choose any die from the fixer area except the `d20`, which must remain there until it is the only die left.
- Count each physical die as exactly 1 Gig for win-condition purposes.
- Use the die face values only for effects that care about Street Cred.

## Main phase

Allow these actions in any order:

- Sell for Eddies once per turn. The sold card must have the Sell Tag (`€$`) in hand. Reveal it, then place it face-down in the Eddies area. A sold card only pays 1 Eddie per turn when spent, no matter how much it costs in your hand.
- Call a Legend once per turn by spending 1 Eddie. Flip a random face-down Legend without peeking first. Resolve any `CALL` trigger immediately.
- Play cards by spending Eddies equal to the printed cost. Let any Legend pay 1 Eddie whether the Legend is face-up or face-down. Resolve any `PLAY` trigger as soon as the cost is paid.

Remember:

- Programs are one-shot effects and go to the trash after resolving.
- Gear attaches to a friendly Unit or Legend.
- All Units enter the field with Lag, which lasts until the end of the turn. Units with Lag can't attack or activate self-spend effects.
- Units still cannot attack on the turn they enter the field unless an effect explicitly says they can, such as `ADRENALINE` or `GO SOLO`.

## Attacking

Let each Unit attack one at a time. Fully resolve one attack before declaring the next one.

The attacker may choose:

- A spent rival Unit
- The rival directly

Do not allow attacks against ready rival Units.

### Attack sequence

1. Offensive step: spend the attacking Unit and resolve any `ATTACK` trigger.
2. Defensive step: allow the defender to call a Legend, activate `QUICK` effects, or redirect the attack to a ready `BLOCKER`.
3. Resolution step:
   - If attacking a spent Unit, compare total power. The higher total defeats the lower total. If totals match, both are defeated. Move defeated Units and any attached Gear to the trash, then resolve any `DEFEATED` effects.
   - If attacking the rival directly and the attack still connects, steal Gig Dice from the rival.

### Direct attack theft

- Steal 1 Gig by default.
- Steal 2 total Gigs at 10 power.
- Steal 3 total Gigs at 20 power.
- Continue adding 1 Gig for each additional full 10 power.

Remember:

- If a `BLOCKER` redirects the direct attack, resolve a fight instead.
- If a direct attack is redirected or otherwise stopped, do not steal any Gigs from that attack.

## End states

- Win by starting your turn with at least 7 Gig Dice already in your Gig area.
- Enter overtime after the last player's 7th turn. In overtime, the instant a player has the majority of Gig Dice, that player wins.
- Lose immediately when your deck reaches 0 cards.
