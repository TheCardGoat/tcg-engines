# Game Mechanics - Timing and Permissions

#### Fast vs Slow&#x20;

The timing for playing cards and activating abilities falls under two categories: Slow and Fast timing conventions or speeds.

1. Slow speed follows the following conventions:
   1. The turn player may play slow action cards (action cards with slow speed), allies, weapons, items, domains, champions, phantasias, activate slow abilities, and may declare attacks when they have Opportunity and the Effects Stack is empty during their Main Phase. These are referred to as “Slow Player Actions.”
   2. The non-turn player can't perform Slow Player Actions.
2. Fast speed follows the following conventions:
   1. Any player may activate fast cards when they have Opportunity in the turn, or no events are otherwise taking place, and Opportunity passes as a result of the game state. These are referred to as “Fast Player Actions.”
   2. Activated abilities can be activated at a fast speed.

#### Opportunity

Opportunity is a concept that governs the activation of cards and abilities at a fast speed.

1. Opportunity for players arises as a result of a game event taking place which designates a player to receive Opportunity.
   1. Activation of cards or abilities or a triggered ability being placed on the Effects Stack all generate opportunities for players to act upon.
   2. Opportunity will always arise whenever there is an effect pending resolution in the Effects Stack.
2. While a player has Opportunity, that player may activate any card or activate any ability with a fast speed. If the turn player has Opportunity and it is their main phase, they may perform slow player actions.
3. Players pass Opportunity in turn order declining to take further player actions.&#x20;
4. Players pass Opportunity to the next player in turn order until every player has had a chance to respond to the top effect of the Effects Stack.
5. The top layer in the Effects Stack resolves after all players in a game have successfully passed on Opportunity for one cycle.
6. Following this, the taking of player actions and the passing of Opportunity is repeated until all effects, card activations and materializations, and abilities pending resolution have been resolved.
7. Any time the bottommost layer of the Effects Stack resolves, if the game is currently in the Main phase, the turn player regains control of the Main phase.
8. The turn player is the first player to receive Opportunity whenever Opportunity arises at the beginning of most phases and steps of phases, after the completion of turn-based actions, or after the topmost layer of the Effects Stack resolves.
   1. After a player activates or materializes a card, activates an ability, they receive Opportunity by default even if they are not the turn player. In this manner, players can maintain Opportunity and commit to multiple consecutive player actions. However, pending actions cannot be resolved until they pass Opportunity and all players have had a chance to pass Opportunity in turn order.
9. State-based effects and turn-based actions will always happen before players receive Opportunity to act.&#x20;
10. If a player were to receive Opportunity, state-based effects are first checked and the game will perform any necessary state-based actions before players have the Opportunity to act.
11. If all players pass on Opportunity while the Effects Stack is empty, the game will automatically proceed to the next phase.

Situations in which Opportunity arises:

* At the beginning of Recollection and End Phases
* After a card or ability enters the Effects Stack. (This can refer to materializations, activations, or triggers. Opportunity passes before resolution of that card or ability.)
* At the beginning of the retaliation step and damage step of the combat phase
* At the beginning of the main phase (turn player receives Opportunity and can perform Slow player actions)
* After an activation, trigger, or materialization resolves and there is another effect on the Effects Stack or a pending turn-based action
* After the turn player moves to the end of the turn, the opponent(s) will receive Opportunity before the end step

#### Special Play Permissions

Some effects will grant a player the ability to play, activate, or materialize a card they might not normally have the ability to.&#x20;

1. Special Play Permission-granting effects explicitly give permission to a player as to the context of time and duration that the permission is granted.
   1. These permissions will typically override or overrule any default cases, such as Fast or Slow stats on cards, as well as the zones from which a card can be played.
2. If a card states a given player "activate/play/materialize a card" (with or without a may) without establishing a duration for this effect, the permission is assumed to be given only as part of the effect and is considered an instruction to the player, just as an effect may state "Draw 2 cards."
   1. After the effect has been completely resolved, any permission granted expires. This permission will allow players to seemingly activate cards with Slow play permissions while the Effects Stack is not empty.

{% hint style="info" %}
&#x20;![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/quicksilver-grail-ftc.jpg)![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/beseech-the-winds-doa-alter.jpg)

E.g., for cards such as Quicksilver Grail or Beseech The Winds, the player is granted permission to play the banished card or is instructed to materialize a card and is granted permission to do so through the effect, bypassing normal timing permissions.
{% endhint %}

3. If, on the other hand, an effect specifies a duration or conditions ("as long as...") modifying the play permission, the play permissions are altered or granted only after the effect has fully resolved and a player must still abide by any permissions that were not overridden.
   1. These effects will typically modify permissions for zones from which a card is played rather than explicitly grant permissions that allow Slow vs Fast play permissions to be overridden.

{% hint style="info" %}
E.g., Naia grants permission to activate the Spell from banishment "as long as you control Naia." This permission is only granted after the effect fully resolves rather than being instructed play/activate/materialize a card. As a result, only the permission to activate it from banishment is added to the normal permissions and play timings of Fast vs Slow will still apply.

<img src="https://ga-index-public.s3.us-west-2.amazonaws.com/cards/naia-diviner-of-fortunes-mrc.jpg" alt="" data-size="original">
{% endhint %}
