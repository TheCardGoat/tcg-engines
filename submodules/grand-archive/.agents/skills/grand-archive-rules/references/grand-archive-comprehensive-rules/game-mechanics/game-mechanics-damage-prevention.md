# Game Mechanics - Damage Prevention

#### General Rules:

1. Damage prevention, usually provided by replacement effects, can either reduce, wholly or in part, the damage that would be taken by a unit.
2. Prevention effects can also be continuous effects.
3. Damage prevention will follow the order of determining replacement effects as described under [Replacement Effects](/game-mechanics/game-mechanics-types-of-effects/types-of-effects-replacement-effects.md).
4. Damage prevention may be characterized by damage types, such as attack or non-combat damage. If a type is specified, the prevention effect will only reduce the damage of that type. If no type is specified, damage prevention will act upon any type of damage, regardless of type.
5. Damage prevention quantities can be divided into categories of “shielding” versus “instance” damage prevention effects.
   1. Shielding damage prevention effects will create a damage buffer that absorbs a certain amount of damage. In this case, the buffer will only be reduced if the damage prevented is greater than zero. Any damage exceeding the buffered/shielded amount will still be dealt as normal.
   2. Instance damage prevention effects will not track the amount of damage to be absorbed but will instead try to prevent some or all of that damage. In this case, the instance of prevention will still be used up if the amount of damage prevented was zero, as long as there was still an attempt at damage prevention. If damage exceeds a quantity set by a prevention instance, the remaining damage will be dealt as normal.

{% hint style="info" %}
E.g., a player using Deflecting Edge, which prevents the next 3 Combat damage that would be dealt to their champion, would not be able to reduce 3 unpreventable damage from an attack, but will still be able to reduce 3 combat damage from a subsequent attack. Similarly, Clarent, Sword of Peace’s ability will still make a 1 damage buffer that will persist through an unpreventable non-attack source, only to be used for a normal non-attack source.

![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/deflecting-edge-doa-alter.jpg)![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/clarent-sword-of-peace-doap.jpg)
{% endhint %}

6. Prevention effects will persist as long as the effect is specified.
7. In the case of unpreventable damage, prevention effects will still attempt to prevent that damage in one instance. Unpreventable damage will not detract from “shielding”-type prevention effects (See above).
8. Prevention effects will specify which units will be affected under the damage prevention. If prevention is applied to each unit or multiple specified units a player controls, the instances of prevention effects are tracked independently for each unit. However, if an effect uses the wording “the next time \[damage threshold] \[damage type] would be dealt to one or more \[designated units],” that instance will only be prevented once, regardless of how many units are controlled.
9. Prevention can also specify the source of damage for damage instances, such as allies, champions, or actions/spells of certain classes.
10. If prevention is given as a whole number, that many points of damage can be subtracted from the damage calculation when damage is dealt.
11. Damage prevention can have additional effects tied to the replacement effect. In these cases, the entire effect is part of the replacement effect. If any delayed triggered ability are dependent upon the prevention of damage, they will be separated by a paragraph break and listed as a separate effect on a new line.

{% hint style="info" %}
E.g., Spellshield: Arcane specifies to put enlighten counters on a champion equal to the amount of damage prevented. This is in the same text paragraph as the damage prevention effect and so the enlighten counters will be placed as part of the damage prevention replacement effect, not underneath a separate trigger.

![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/spellshield-arcane-doa-alter.jpg)
{% endhint %}

<br>
