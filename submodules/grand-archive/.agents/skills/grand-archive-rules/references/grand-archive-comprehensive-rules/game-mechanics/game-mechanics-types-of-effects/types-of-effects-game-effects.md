# Types of Effects - Game Effects

#### General Rules:

1. Game effects are types of effects that only impact the game as a result of game mechanics and objects interacting to resolve a game state and to move the game to a state where players can again act. Game effects often rely on the state of the game to determine what events occur.

Game effects include:

* Temporary effects ending (apart from those ending during the end phase)
* A weapon being destroyed or banished as a result of having 0 durability during the damage step of attacks
* Allies being destroyed by having marked damage equal to or greater than the life stat of the ally card
* Players losing the game as a result of having marked damage on their champion equal to or greater than the life stat of the champion
* Players losing the game as a result of attempting to draw from an empty deck (“decking out”)
* Tokens ceasing to exist if they exist in a zone other than the field during game state checks
* Players being required to sacrifice copies of a controlled Unique object

2. The game will check the game state when a player receives Opportunity or as phases begin and end. State-based effects/actions will take place during this time.
3. No players receive Opportunity, nor may they take player actions when game effects are taking place.
4. If static effects in the game set contradicting rules within the game or are persistent or continuous effects, these effects use the most recently generated effect, modifying those rules.
   1. The same rules are applied for the duration of the temporary effects.

{% hint style="info" %}
E.g., if a player has permanently enabled the fire element, and another player has permanently disabled the fire element afterward, the element is considered disabled.&#x20;

If, after this, the original player re-enables the fire element permanently, they have that element considered permanently enabled.
{% endhint %}

5. For all such contradicting effects, “can” does not overwrite “can’t” even if the permission-granting effect is more recent.
6. Effects dependent on the destruction of an object do not produce effects if the object is instead put into Banishment.
7. Effects that would copy cards or objects copy all characteristics of those cards or objects at the time that effect resolves.
8. Game effects that trigger per discrete events will use "whenever \[discrete event occurs] and will consider each time that event has happened. On the other hand, if  "whenever one or more \[discrete event]" is used instead, it will group all of those events and generate only one trigger.

{% hint style="warning" %} <img src="https://api.gatcg.com/cards/images/3wd5cj6hua.jpg" alt="" data-size="original"> ![](https://api.gatcg.com/cards/images/o1yp6dnpyk.jpg)\
\
E.g., Fabled Sapphire Fatestone will only trigger once, regardless of how many cards are moved from the deck to the graveyard in a single game event. On the other hand, Fabled Azurite Fatestone will trigger multiple times for each card banished from the memory in a game event.
{% endhint %}
