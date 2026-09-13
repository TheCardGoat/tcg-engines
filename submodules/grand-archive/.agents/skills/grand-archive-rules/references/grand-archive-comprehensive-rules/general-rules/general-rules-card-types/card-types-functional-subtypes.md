# Card Types - Functional Subtypes

Some subtypes of cards are functional. That is, they might have specific rules that pertain to how the card can function differently from or in addition to the rules of the card type.

#### Functional Domains

1. Siegeable
   1. "Siegeable" is a subtype modifier for domains that allows them to be declared as attack targets.
      1. Siegeable domains are not units and can't die.
      2. Cards that target a unit will not be able to target a Siegeable domain unless it is a type of unit in addition to its other types.
      3. Attacks with Cleave will include siegeable domains in the set of defending objects on attack declarations.
      4. Siegeable domains can't be chosen as an attack target as long as there is a legal object with Taunt is in play that must be attacked first.
   2. Siegeable domains have an innate durability stat that determines how many durability counters that domain will enter the field with.
      1. Whenever a siegeable domain would take damage, that many durability counters are removed from the domain.
      2. On Hit abilities will still consider the damage as dealt even if it is not marking damage in any form.
      3. Siegeable domains will be destroyed as a state-based effect if it has no remaining durability counters (its durability reaches zero).

#### Functional Items

1. Bullet / Arrow
   1. Bullet and Arrow are functional item subtypes with a power stat.

#### Functional Actions

1. Aethercharge
   1. Aethercharge is a functional spell subtype with a power stat.

#### Functional Weapons

1. Gun / Bow / Aetherwing
   1. Gun, Bow, and Aetherwings are functional weapon subtypes. They must be “Loaded” to be wielded for an attack.&#x20;
      1. Guns, Bows, and Aetherwing weapons can't be wielded in conjunction with attack cards.

{% hint style="info" %}
See [Loaded Cards](/game-mechanics/game-mechanics-game-zones/game-zones-object-specific-zones.md#loaded-cards); an object that has been Loaded will put all of its Loaded Cards into the Intent when it is used during attack declarations.
{% endhint %}

<br>
