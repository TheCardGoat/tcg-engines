# Playing Cards - Resolution

#### General Rules:

1. Resolution of cards happens after all costs for playing the card are paid, the card is played, passes legality checks, is placed into the Effects Stack (along with its corresponding play method instancing, such as a card activation, materialization or bestowment) and no player has taken any player actions or the game state has not changed in a way that would invalidate the card.
   1. A card's corresponding activation/materialization/bestowment instance is then resolved when the above conditions are met and while no other game actions are taking place; these instances are resolved at discrete points of time within a game, with each instance having its own point in time to resolve.
2. Resolving a card's activation/materialization/bestowment causes the game to examine the card on the effects stack and either has the player perform or enact all effects and instructions listed on the card in top-to-bottom order, step by step, or (in the case of object-type cards) creates an objects with the described characteristics and properties that follow from the source card of that activation/materialization/bestowment.&#x20;
   1. Resolving an instance of an activation/materialization/bestowment will cause a simultaneous state-based check on whether or not any additional instances are associated with the source card. If the last instance is currently resolving, the source card will be removed from the Effects Stack and either go to the Graveyard (or Banishment, in the case of cards with memory costs) or become an object on the field.

{% hint style="info" %}
E.g., If an effect says “Glimpse 2. Draw a card,” the player must first Glimpse 2, only after which they can draw a card. No state-based checks occur between each instruction.
{% endhint %}

3. “You” printed on a card or implicit in commands are directed to the controller, while other specified players or objects are referenced according to target declarations on activation/materialization/bestowment.
4. All effects will resolve from the perspective of the player who controlled the effect in the Effects Stack.
5. Some effects specify "may" as a permission-based clause during the resolution of an effect or ability. For these effects, the specified player will choose to accept or reject the option offered during the resolution. There is no later point in time at which this decision can be made.
6. If any optional choices are made for any effects during a resolution, such as "you may X" where X is a requirement, cost, or action, the player must completely do X for any related effects to happen; players can't partially fulfill the condition on optional effects. Typically, these effects are tied to a default case of "if you don't," which will automatically be applied if the optional cost/action is not taken.
7. All champions, allies, weapons, items, domains, tokens, and other objects will enter the field or intent under the control of the player who controlled the corresponding card or effect that would generate the object in the Effects Stack
8. All action cards will resolve from the perspective of the player who controlled the corresponding card in the Effects Stack.
9. As attack cards resolve, the game will check if it is legal for its controller to initiate a combat phase. If it is, the attack card will resolve and enter a player’s champion’s intent from the perspective of the player that controlled the corresponding card in the Effects Stack. If a combat phase cannot be initiated (e.g., an attack card was activated at fast speed during the opponent’s turn), the attack fizzles as a state-based action.
10. Replacement effects do not replace any actions taken during the resolution of a card; they may only adjust the outcome of that action after it has been performed. As a result, reflexive triggers that are part of a resolution contingent upon an action being performed will see the action as completed even if the result of that action is modified through a replacement effect.
11. A card is resolved when all of its materializations or activations have resolved from the Effects Stack, including the original and/or any copies. A card resolves and is removed from the Effects Stack as a result of state-based checks.&#x20;
    1. If a card has text that modifies its resolution (such as being banished instead of going to the graveyard) or the destination zone were to be changed due to a replacement effect or other ability, the destination zone is maintained if it is ngated. This is also true for rules set by supertypes, such as Regalia.

#### Checking Resolution

1. Before a card activation/materialization/bestowment begins resolving, the game will perform a check to make sure that all conditions for successful resolution are met.
   1. For champions, a level-check and lineage check will be performed in addition to any other legality checks upon attempted resolution of a champion materialization.
   2. If the resolution is deemed illegal in any way, it will instead “fizzle”; if something fizzles any of the effects that would occur during its resolution don't, and it would not become an object if it were to do so.
   3. The phrasing “Up to \[X] target \[object]” on cards and effects is treated as optional conditions and will not impact whether or not a card will resolve correctly. The same is true for wording such as "any number" or "any amount" for chosen targets.
   4. Cards and effects that specify and quantify the necessary targets that must be chosen on the declaration of activation or playing of the card must have each of its targets still be valid/legal upon resolution.
      1. A card resolves if and only if the targets selected are all still legal targets for the event upon resolution (apart from “Up to \[X]” target phrasings).
         1. If any one of the necessary targets becomes illegal/invalid at the point of resolution, the entire card/effect does not resolve. If a card does not resolve this way, the card is then sent to the graveyard (or, if it is regalia, to banishment).
