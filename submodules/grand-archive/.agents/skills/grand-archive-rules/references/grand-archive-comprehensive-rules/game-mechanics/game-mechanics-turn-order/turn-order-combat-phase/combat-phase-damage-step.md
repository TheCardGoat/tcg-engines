# Combat Phase - Damage Step

#### General Rules:

1. First, the turn player receives opportunity. This point at which players are granted Opportunity during this phase is considered “before damage” and is the only time players may act before the game progresses until the conclusion combat phase.
2. Second, if there are multiple units retaliating against the attacker, the attacking player chooses the order in which the retaliating units will deal damage to the attacking unit. Damage will be done simultaneously, however the order determines how damage will interact with any replacement effects such as damage prevention and for On Hit and On Kill triggers.
   1. For each attacker, the only On Kill abilities from a retaliating source that will trigger are those from the damage source marking lethal damage and that would send the attacking unit to the graveyard as a result of combat damage
3. Third, after the Effects Stack is empty, and each player has passed on Opportunity in succession, damage is dealt simultaneously between the attacking unit and its target, and, if any, the retaliating unit(s) to its/their retaliation targets.
   1. Damage calculation from the attacker first involves summation of power stats of all Intents (all cards in the intent), weapons wielded by the attacker, and any additive or subtractive power modifiers. Any replacement effects or further modifiers are applied after this.
   2. If a retaliating unit were to leave the field before the damage step, it would deal no damage and be dealt no damage.
   3. A retaliating unit will still deal damage to its retaliation target even if the attacking unit is no longer considered to be attacking.
   4. Damage dealt by a retaliating unit is considered combat damage.
   5. If any weapon or attack card effects would modify the damage dealt by an attack or create additional effects, those effects are applied after the combining of power stats during the dealing of damage within the damage step. Damage is all applied in one instance.
   6. If any replacement effects with damage occur, the controller of the object taking damage chooses the order in which they apply sequentially and step-wise for each replacement effect.
   7. Combat damage and removal of durability counters for weapons involved in attacks are done simultaneously.
      1. Damage dependent upon the number of durability counters on a weapon is taken before any durability counters are removed.
      2. If a weapon is wielded in an attack and was part of dealing damage or dealt damage, a durability counter is removed in this phase. Durability is still removed if the damage dealt is 0. No durability counters are removed if the attack was negated or fizzled, the defending object left the field or became an illegal attack target before damage was dealt, or if the weapon left the field before damage was dealt.
   8. In the time that an instance of damage is being dealt, no Opportunity is given; no actions may be taken by players during this game state.
4. Finally, after damage is calculated correctly and dealt, the game progresses to the End of Combat step.

{% hint style="danger" %}
Regarding retaliation damage: If a retaliating unit was given stealth at the beginning of the damage step, a targeted attack without True Sight will become illegal and the unit retaliating won’t be dealt damage, however, the retaliating unit will still deal damage to the unit declared attacking.
{% endhint %}

{% hint style="warning" %}
Regarding damage prevention: A player controlling an effect that prevents 1 damage from a source has a champion being attacked by another player’s champion using Rending Flames as well as an effect that increases damage dealt by 1. The defending player may order the effects such that: Damage is decreased by 1, then doubled, and then increased by 1 to minimize damage dealt.
{% endhint %}
