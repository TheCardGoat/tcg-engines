# Game Mechanics - Counters

#### General Rules:

1. A counter is a special attribute of an object or card that holds both a type and a numeric value.
   1. Counters may be placed on activations in some circumstances.
2. Depending on the type, counters will have various effects or enable certain abilities.
3. Counters can be tracked using tokens, dice, or an agreed-upon method used by players. These methods denote the number and type of each counter on a card or mastery.
4. The quantity of a counter type can increase by gaining counters. It can decrease by spending counters to pay a cost or by losing or removing counters through an effect.
5. Counters persist on an object or card in a zone as long as it does not change zones. Moving a card to another zone causes its counters to be lost.
   1. Masteries can also gain persistent counters in some circumstances. Counters will remain on a mastery until the mastery is removed or the counters themselves are removed.
6. Counters can be subdivided into generic or special counters. Special counters have specific rules associated with them. Generic counters do not grant or have inherent abilities or effects.
   1. Counters are considered generic unless they are listed in the sections below.

#### Buff

1. Buff counters statically modify an object’s power and life stats by +1 to each of those stats for every buff counter on that object.
2. If the object does not have a power or life stat, that stat will not be generated due to a buff counter being placed on that object.
3. Modifications from buff counters will be applied before any other changes to the base power and life stats of an ally.
4. If buff counters are placed on an object with debuff counters, each buff counter will remove itself and a corresponding debuff counter.

#### Bulwark

1. Bulwark counters can be placed on units. They act as a continuous effect that prevents an instance of combat damage that would be dealt to that unit.
   1. Since Bulwark counters work as a damage prevention effect, they function simultaneously with other damage replacement effects. As such, the owner of the objects receiving damage may select the order in which simultaneous effects apply.
2. If a unit has a bulwark counter on it, the next time combat damage would be dealt to that unit, the damage is prevented and a bulwark counter is removed.
3. Preventing damage with Bulwark counters is not optional. If the unit would take a non-zero amount of damage, the damage prevention and removal of the Bulwark counter must occur.
4. Bulwark counters collectively apply only one replacement effect that removes a Bulwark counter. This applies regardless of how many Bulwark counters are on an object. No more than one counter may be removed per damage instance that is prevented.
   1. If unpreventable damage is dealt, only one Bulwark counter is removed.

#### Damage

1. Damage counters are permanent counters on champions that are placed whenever a champion is dealt any type of damage.
2. Damage counters will mark damage in whole numbers starting from 0.
3. Damage counters reaching or exceeding a champion's life stat cause that champion to die.

{% hint style="success" %}
A player loses the game if they control no champions.
{% endhint %}

4. Damage counters are removed by effects that Recover.

#### Debuff

1. Debuff counters statically modify an object’s power and life stats by -1 to each of those stats for every debuff counter on that object.
2. If the object does not have a power or life stat, that stat will not be generated due to a debuff counter being placed on that object.
3. Modifications from debuff counters will be applied before any other changes to the base power and life stats of an ally.
4. If debuff counters are placed on an object with buff counters, each debuff counter will remove itself and a corresponding buff counter.

#### Durability

1. Cards with a durability stat will enter the field with a number of durability counters equal to that stat.
2. Durability counters on an object can exceed the printed durability stat of an object.
3. Weapons and Siegeable objects will be destroyed by state-based effects if their durability reaches 0.
4. If the object does not have a durability stat, the stat will not be generated as a result of a durability counter being placed on that object.

#### Enlighten

1. Enlighten counters have the following ability: "Remove 3 enlighten counters from \[CARDNAME]: Draw a card."

#### Level

1. Level counters on champions give that champion +1 Level for each level counter on that champion.

#### Omen

1. Omen counters designate the card(s) in banishment on which they are placed as Omens.
2. Rules text on cards that refers to Omens refers to the set of cards that have at least one Omen counter placed on them in banishment.

#### Static

1. As long as at least one object a player controls has a static counter on it, whenever an arcane element unit they control deals combat damage, the player may remove a static counter from each object with a static counter. The object whose static counter was removed is considered a source that deals 1 damage to the object dealt combat damage by the arcane unit.
   1. This is a triggered ability that triggers once for each object with a static counter, rather than a single trigger.
   2. This ability is not redundant; only one instance of this triggered ability will exist on a unit regardless of how many static counters it has, and the ability will trigger only once per object, per instance of combat damage dealt.

#### Wither

1. At the beginning of a player's main phase, if they control one or more objects with a wither counter on them, they sacrifice each of those objects unless they pay 1 reserve for each wither counter on it, then remove those counters.
2. The triggered ability is sourced from the game rather than the objects on which the wither-related trigger originates.
3. The reserve cost to be paid for each object must be paid in full. If it is not completely paid, that object is sacrificed.
4. All wither counters are removed at the same time during the resolution of the triggered ability.
5. There is only one main phase per turn; wither will not create another trigger after returning to the main phase after combat if any wither counters were placed in a combat phase.
