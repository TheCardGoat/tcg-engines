# Game Mechanics - Playing Cards

#### General Rules:

1. Activating, materializing, or bestowing a card is considered playing that card.
2. A card can only be played if a player has control of that card or is given play permissions for that card.
3. If playing a card is illegal, the actions directly taken to play that card are canceled and the game state will revert to the point before the attempt to play that card was made.
4. All cards in the Effects Stack are controlled by the player who played them.
5. The activations, materializations, and bestowments of that card belong to whichever player created that instance and put it onto the Effects Stack.&#x20;
6. When a card is played, that card is moved to the Effects Stack and given a timestamp corresponding to when it was played. This will also automatically add one instance of either an activation, materialization, or bestowment to the Effects Stack, corresponding with the play method used for that card.
7. A played card will be removed from the Effects Stack and moved to its appropriate zone after each instance of its activations is resolved or removed from the Effects Stack (see [state-based checks](/game-mechanics/game-mechanics-miscellaneous-topics/state-based-checks-and-effects.md)).
   1. Cards with reserve costs will go to the Graveyard from the Effects Stack; cards with memory costs will go to Banishment. If a non-copy instance resolves and becomes an object, then the card will instead be placed on the field to represent the object.
8. If a card is removed from the Effects Stack, any instances of its activation, materialization, or bestowment will be removed from the Effects Stack, as well.

{% hint style="info" %} <img src="/files/ikI0PpXIgPjy3Xu3nMhp" alt="" data-size="original">\
\
E.g., if a card activation is negated via Frostbind, the corresponding card for that activation will also be banished. If there were any other copies of the activation of that card, those copies will fizzle since the sourced card for those activations is now removed from the Effects Stack.
{% endhint %}

9. Activations, materializations, and bestowments of a card are treated as instructions to create an object or resolve effects based on the corresponding source card for those activations, materializations, or bestowments.
   1. Information such as costs paid for the activation, properties, and restrictions are all referenced based on the original card played; however, the controller of the resolving instance and the targets may change.
   2. Whenever a copy or additional instance is created beyond the original, it will also carry a "copy" property that keeps track of its state as an instanced copy. This is important for tracking objects created from a resolving activation/materialization and whether they are token objects or objects represented by the card.
   3. Static modifications to the source card from which activations/materializations/bestowments derive will also be read in any further instances of those activations/materializations/bestowments. E.g., if an effect were to give an additional ability or effect to activated cards or a card on the effects stack, the additional ability/effect will be inherited by any instanced activations, materialization, etc., pending resolution.

The following pages discuss these topics:

* [Card Activation](/game-mechanics/game-mechanics-playing-cards/playing-cards-card-activation.md)
* [Card Materialization](/game-mechanics/game-mechanics-playing-cards/playing-cards-card-materialization.md)
* [Costs and Memory](/game-mechanics/game-mechanics-playing-cards/playing-cards-costs-and-memory.md)
* [Resolution](/game-mechanics/game-mechanics-playing-cards/playing-cards-resolution.md)
