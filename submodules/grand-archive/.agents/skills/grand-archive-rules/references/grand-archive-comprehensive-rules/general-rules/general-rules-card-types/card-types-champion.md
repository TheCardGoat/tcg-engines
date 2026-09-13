# Card Types - Champion

#### General Rules

1. Champion is also an object type; a champion is placed on the field as a champion object. A champion object is also an champion unit.
2. Champion cards start in the material deck.
3. A Level 0 Spirit champion card must be put onto the field on each player’s first turn. This is treated as a special game action and cannot be responded to.
   1. Players may not materialize Level 0 champions.
4. Champions can attack only through attack cards or by using weapons. Most champions do not inherently have a power stat and, therefore, can't inherently attack or retaliate against attacks.
   1. Attacking rests a champion as a cost, either from activation of an attack card or by an attack declaration through a weapon.
   2. Attack declarations made as a result of an attack card entering the Intent do not rest as a cost.
   3. Champions with a power stat may declare an attack without an attack card or weapon, just as allies can.
5. Champions statically enable non-norm elements for the controlling player. Champion cards in a lineage will grant a player access to all elements included among their element types.
6. Champion names for lineages will typically be considered without prefixes, suffixes, titles, epithets, or any other naming ornamentation for the card.
7. Champions can be materialized from the material deck as long as they have a legal lineage requirement and are level N+1, where N is the current level of a champion on the field under that player's control.
   1. If the materialized champion becomes N+2 with respect to the champion in play, the materialization becomes illegal and fizzles.
8. If a Champion card would be put into a graveyard from anywhere, it is instead banished.

**Leveling Up**

1. A champion can be incrementally leveled by placing the next level champion card on top of that champion’s “[lineage](/glossary/game-terms.md#lineage-term)." The next level champion is placed on top of the previous level champion. This is known as leveling up the champion. Leveling a champion can be a result of materializing a champion card during the materialize phase or as a result of effects that instruct a player to “[level up](/glossary/game-terms.md#level-up)” their champion.
2. Champions are leveled by a player when a champion whose base level is N+1 is selected from the material deck and played, usually by selection for materialization with memory costs paid. N refers to the printed level of one of that player’s champion cards on the field and does not consider additional level-modifying effects.

{% hint style="info" %}
E.g., Lorraine, Wandering Warrior is a Level 1 champion regardless of how many effects state “your champion gets +X level” and can level up into a valid Level 2 champion from the material deck.
{% endhint %}

3. Players ignore element requirements/restrictions when materializing a champion or leveling a champion up.

{% hint style="success" %}
E.g., A player who controls Lorraine, Blademaster with a Spirit of Fire in the Lineage may still level up the champion into Lorraine, Crux Knight without previously having the Crux element enabled.
{% endhint %}

4. Leveling up a champion requires a player to place the new champion card on top of the existing champion card as part of the lineage. It keeps the same rested/awake property. I.e., if a rested champion levels up, it will remain rested.
5. Leveling up a champion does not use the effects stack. If a champion card is materialized, leveling up will happen as a result of the resolution of the champion card.
6. The entire stack of cards consisting of a Champion and the cards in the “[Inner Lineage](/game-mechanics/game-mechanics-game-zones/game-zones-object-specific-zones.md#inner-lineage)” in its entirety is referred to as the “Lineage.”
7. Only the top card of the lineage is treated as an object, i.e. the Champion, and all inherited effects within the “[Inner Lineage](/game-mechanics/game-mechanics-game-zones/game-zones-object-specific-zones.md#inner-lineage)” cards apply to the Champion.
   1. The Champion is considered the champion object that is on the field.
   2. A new champion card being placed on top of the original champion does not count as a new object entering the field. It will still count as a new champion card entering the lineage. Therefore, the addition of that card to the lineage will trigger any On Enter abilities of the topmost champion card in the lineage.
      1. When a champion leaves or enters the field, it will do so with all cards within its inner lineage as well as its counters (Enlighten, Level, etc.).
      2. The element identity of the champion consists of all elements among champion cards within the lineage.
      3. If a new object were to replace the current champion and its lineage, no attributes of that lineage carry over, such as enlighten counters or damage counters.
      4. Only Inherited Effects from among cards in the lineage will contribute to the effects and abilities of the champion of the lineage; any other characteristics from the inner lineage such as card name, cost, class identity, types, non-Inherited Effect abilities, life stats, and power stats are ignored.
8. Players can only level up champions they control.
9. Players can't play nor level up champions they do not meet leveling requirements for.

**Deleveling**

1. A player may delevel a champion as a cost or as a result of an effect or certain abilities. For a player to delevel a champion, that player takes the top-most champion card in that champion’s lineage and returns it to the Material deck.
