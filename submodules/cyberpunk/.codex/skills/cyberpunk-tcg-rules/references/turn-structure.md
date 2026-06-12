# Turn Structure

## Contents

- Setup
- Start of turn
- Play phase
- Attack phase
- End states

## Setup

- Place the 3 Legends face-down in random order so the player does not know which Legend is where.
- Shuffle every non-Legend card into the deck.
- Put all Gig Dice in the fixer area.
- Randomly choose the first player.
- Make the first player begin the game with 2 spent Legends.
- Draw 6 cards for the opening hand.
- Allow one mulligan: shuffle that hand back and draw 6 new cards once.

## Start of turn

Resolve these steps in order:

1. Draw 1 card. Do not impose a maximum hand size.
2. Take 1 die from the fixer area, roll it to set its value, then place it in the Gig area.
3. Ready every spent card.

Additional constraints:

- Let the player choose any die from the fixer area except the `d20`, which must remain there until it is the only die left.
- Count each physical die as exactly 1 Gig for win-condition purposes.
- Use the die face values only for effects that care about Street Cred.

## Play phase

Allow these actions in any order:

- Sell for Eddies once per turn. The sold card must have the Sell Tag (`€$`) in hand. Reveal it, then place it face-down in the Eddies area. A sold card only pays 1 Eddie per turn when spent, even if its printed cost is higher.
- Call a Legend once per turn by spending 2 Eddies. Flip a random face-down Legend without peeking first. Resolve any `FLIP` trigger immediately.
- Play cards by spending Eddies equal to the printed cost. Let any Legend pay 1 Eddie whether the Legend is face-up or face-down. Resolve any `PLAY` trigger as soon as the cost is paid.

Remember:

- Programs are one-shot effects and go to the trash after resolving.
- Gear attaches to a friendly Unit.
- Units still cannot attack on the turn they enter the field unless an effect explicitly says they can.

## Attack phase

Let each Unit attack one at a time. Fully resolve one attack before declaring the next one.

The attacker may choose:

- A spent rival Unit
- The rival directly

Do not allow attacks against ready rival Units.

### Attack a spent Unit

Resolve a fight in this order:

1. Offensive step: spend the attacking Unit and resolve any `ATTACK` trigger.
2. Defensive step: allow the defender to call a Legend or redirect the attack to a ready `BLOCKER`.
3. Fight step: compare total power. The higher total defeats the lower total. If totals match, both are defeated.
4. Defeat step: move defeated Units and any attached Gear to the trash.

### Attack the rival directly

Resolve a direct attack in this order:

1. Offensive step: spend the attacking Unit and resolve any `ATTACK` trigger.
2. Defensive step: allow the defender to call a Legend or redirect the attack to a ready `BLOCKER`.
3. Steal step: if the direct attack still connects, move 1 die from the rival's Gig area to the attacker's Gig area. Steal 1 additional die for every full 10 power on the attacking Unit.

Remember:

- If a `BLOCKER` redirects the direct attack, resolve a fight instead.
- If a direct attack is redirected or otherwise stopped, do not steal any Gigs from that attack.

## End states

- Win by starting your turn with at least 6 Gig Dice already in your Gig area.
- Enter overtime after both players finish a turn without taking a new Gig from their fixer areas. In overtime, the instant a player has the majority of Gig Dice, that player wins.
- Lose immediately when your deck reaches 0 cards.
