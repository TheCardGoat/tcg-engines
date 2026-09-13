# Playing Cards - Card Activation

#### General Rules

1. In activating a card, a player takes the card from the zone it currently is in, puts it onto the Effects Stack, and pays its associated activation costs. Activating a card has the following steps in order: Announcing the Activation, Checking Elements, Declaring Costs, Selecting Modes, Declaring Targets, Checking Legality, Calculating Reserve Cost, Paying Costs, and Activation, as follows:

**1.1 Announcing Activation**: First, the player announces the card they are activating and places it onto the effects stack. It is timestamped according to when it entered the effects stack.

**1.2 Checking Elements**: Then, the game checks whether the player has the required elements enabled to activate the card. If not, the activation is illegal.

1. For cards whose identity is a combination of two or more elements (e.g., Norm and Exalted), all of those elements must be enabled.

**1.3 Declaring Costs**: Next, the player declares the intended cost parameters for the card.

1. If a card has X in its cost, the player must declare the value of X.
2. If the card has optional costs, the player must declare all additional costs that they will pay.
3. If the card has an alternative cost, they must declare if they are paying the alternative cost. If there are multiple alternative costs, the player can choose which alternative cost they will choose among them.
4. If a card uses the phrasing “Up to \[X] target \[object(s)], these must be specified during target selection.

{% hint style="info" %}
Innervate Fury cannot choose 8 allies to split damage among and select one of the target allies to receive 0 damage. This means, effectively, there can be at most 7 targets to split damage between.

<img src="https://ga-index-public.s3.us-west-2.amazonaws.com/cards/innervate-fury-ftc.jpg" alt="" data-size="original">
{% endhint %}

**1.4 Selecting Modes:** Some cards require that one or more modes be selected out of given options when activating the card and placing it onto the effects stack. All modes must be selected as the card is placed onto the effects stack, and the selected modes may not be changed after the card is activated.

1. If any modes are selected based on unlocked class bonuses at the time of activation, these modes will still be selected and remain unchanged unless the class bonus is lost; they will not be regained statically if class bonus is lost.

**1.5 Declaring Targets**: After modes are selected, any necessary targets for successful activation must be chosen. A target may only be selected if it is legal. If an effect instructs a player to choose "up to" or "any number" or "any amount" or any variation of this, these targets are optional; they are not required for successful activation of the card. These targets will be inherited by the corresponding card activation.

**1.6 Checking Legality**: Then, the game performs a legality check for card activation and, if any part of the activation is not legal, the activation is canceled, and the game will revert to the point before the card activation was declared. No action will be considered to have been taken nor will event triggers be generated.

**1.7 Calculating Reserve Cost**: Next, the player calculates the reserve cost of the card with the following steps:

1. First, the starting reserve cost of the card is determined.
2. Second, effects that set a reserve cost are applied.
3. Third, effects that add or subtract to or from the reserve cost are applied simultaneously.
4. Fourth, effects that remove reserve costs are applied. This would cause reserve cost to become 0. Effects can’t cause the reserve cost to be less than 0.

**1.8 Paying Costs**: Next, the player pays the reserve cost and any additional or alternative costs of the card. If the costs cannot be paid, then the activation is illegal and the game state is reversed before activation was initiated. Costs can be paid in any order so long as they are fulfilled.

1. Costs may be paid through replacement effects.
2. If the payment of costs results in any modifications or additional modes being added to an activation, step 4 will be repeated for any new unselected modes or options. The same will be true for step 5 and 6, however, step 7 will not be repeated. Previously chosen targets and modes that were not modified or added in this step cannot be changed.

{% hint style="info" %}
E.g., For 1.8, Cordelia gives your tokens Reservable. You would be able to rest four Powercell tokens to pay for the reserve cost of Overlord before sacrificing the Powercells for the additional cost.

<img src="https://ga-index-public.s3.us-west-2.amazonaws.com/cards/overlord-mk-iii-mrc.jpg" alt="" data-size="original"> ![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/cordelia-aurous-kaiser-mrc.jpg)
{% endhint %}

**1.9 Activation**: Then, the card is considered activated, and the player who activated the card gains Opportunity. The card activation is placed at the top-most index of the Effects Stack (following first-in-last-out resolution ordering). The corresponding source card for the activation is only tracked via timestamp, but is not ordered in the Effects Stack. Any additional instances beyond the originally instanced activation is given the "copy" property.

1. Cards can only be activated from hand unless otherwise stated.
2. Some effects will specify that you may activate a card with a memory cost as opposed to materializing it. Activating a card this way will still require payment according to its memory costs, as well as placing the card into the Effects Stack. The card will receive a corresponding activation rather than a materialization.
3. Activating a card is not dependent upon whether a player has or has not materialized for this turn; players may still activate cards with memory costs if that player has materialized a card and vice versa.

<br>
