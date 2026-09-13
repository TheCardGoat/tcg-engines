# Playing Cards - Card Materialization

#### General Rules:

1. In materializing a card, a player takes the card from the zone it currently is in, puts it onto the Effects Stack, and pays its associated materialization costs. It is timestamped according to when it entered the effects stack. Materializing a card has the following steps in order: Announcing the Materialization, Checking Elements, Declaring Costs, Selecting Modes, Declaring Targets, Checking Legality, Calculating Memory Costs, Paying Costs, and Materialization.
2. A player may only materialize a card once per materialize phase or if an effect gives a player permission to materialize a card.
3. Materializing a card follows the same initial steps as listed in Card Activation Steps 1.1 through 1.5, with the exception that the card is announced for materialization rather than activation, and then follows with 3.1:

**3.1 Checking Legality**: The game performs a legality check for card materialization and, if any part of the materialization is not legal, the materialization is canceled, and the game will revert to the point before the card materialization was declared. No action will be considered to have been taken nor will event triggers generated.&#x20;

1. This part is distinguished from the step for activation as, specifically, for playing Champions, players must meet the requirements to play the champion intended for materialization, including any Lineage or leveling requirements.

**3.2 Calculating Memory Cost**: Next, the player calculates the memory cost of the card with the following steps:

1. First, the starting memory cost of the card is determined.
2. Second, effects that set a memory cost are applied.
3. Third, effects that add or subtract to or from the memory cost are applied simultaneously.
4. Fourth, effects that remove memory costs are applied. This would cause the reserve cost to become 0. Effects can’t cause the memory cost to be less than 0.

**3.3 Paying Costs**: Next, the player pays the memory cost and any additional or alternative costs of the card. If the costs cannot be paid, then the materialization is illegal and the game state is reversed before materialization was initiated.

1. Costs may be paid through replacement effects.
2. Unlike Activation, Materialization costs have to follow a specific order: if any [Floating Memory](/glossary/keywords-and-abilities.md#floating-memory) abilities are used to pay for a memory cost, those must be used first before any other costs and rendered and paid.

**3.4 Materialization**: Then, the card is considered materialized, and the player who materialized the card gains opportunity. The card materialization is placed at the top-most index of the Effects Stack (following first-in-last-out resolution ordering). Any additional instances beyond the originally instanced materialization are given the "copy" property.

1. Cards that enter the Effects Stack as a result of that card having been materialized will cause that card to be considered a materialization while it is in the Effects Stack.
2. Cards without Memory Costs cannot be materialized.
