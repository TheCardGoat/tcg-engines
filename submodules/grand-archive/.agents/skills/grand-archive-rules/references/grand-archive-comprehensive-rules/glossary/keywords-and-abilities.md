# Keywords and Abilities

In this section, \[CARDNAME] refers to the implied name of the card itself.

Redundant keyworded abilities will ignore any mentions of that ability on a card or effect beyond the first.

{% hint style="warning" %}
Reminder text for abilities on card printings may not exactly reflect the entry of the rules text within the comprehensive rules. Reminder text is used for the convenience of short-handing rules for clarity and the player experience. Modifications of reminder text may be done in card printings to trim unnecessary rules text for broader abilities. Please refer to this section for exact rules.
{% endhint %}

#### Aenean Progression

* Aenean Progression is a static ability of cards that says "this card costs 2 more to activate for each time you've resolved a card with Aenean Progression this game."
* The cost of the card will not increase if the card was activated but not resolved.

#### Aethercalling

1. Aethercalling is a static ability of cards which means "As you’re looking at this card while glimpsing, you may load it into an Aetherwing weapon you control."
2. Loading a card with Aethercalling is performed as a special game action and does not use the Effects stack.

#### Agility N

1. Agility N is a triggered ability that means "Return N cards from your memory to your hand at the beginning of the end phase."
   1. An ability that grants agility to a player means that the player gains the agility property for a characterized duration. The default duration is a turn.
      1. A player can gain multiple instances of an agility trigger.
      2. A player's agility property is lost as a state-based action during the Clean-Up Phase.
   2. At the beginning of each end phase, if a player has agility, the ability will trigger for each instance of agility they possess. The player may order the resolution of the agility triggers if multiple triggers were placed on the stack simultaneously.
      1. Gaining an instance of Agility on an opponent's turn will allow it to trigger during that turn's end phase.
2. Each player picks which cards are returned to their hand.
3. If a player has fewer cards in their memory than they can return to their hand from Agility, you return as many cards to your hand as you can.
4. Multiple instances of Agility on a card will generate separate triggers during the end phase.<br>

#### Ambush

1. Ambush is a static ability of units which means "This unit may retaliate against attackers while it isn't defending."
   1. Ambush allows a player to retaliate with that unit when:
      1. Another unit or domain they control is being attacked by an opponent.
      2. An opponent is attacking a unit or domain that another opponent controls.
   2. Ambush will not function when your unit is attacking another object you control.
2. The unit must still be awake to retaliate against attackers.

#### Brew

1. Brew is a static ability that allows cards to be activated using an alternative cost involving sacrificing ingredients (typically summoned by[ gathering](/glossary/game-terms.md#gather)). The Brew keyword will list the objects needed for the alternative cost.
2. Brew means "You may sacrifice the listed objects rather than pay this card's reserve cost."
3. A card activated by paying the alternative brew cost will cause the activation to become brewed.
4. Activating a card using the Brew cost can still be modified by additional activation cost modifiers. Effects that modify the reserve cost are ignored when Brewing cards.

#### Bulwark

1. Bulwark is a static ability of objects, which means "This object enters the field with a [bulwark](/game-mechanics/game-mechanics-counters.md#bulwark) counter."
2. If a card has multiple instances of the Bulwark ability, each instance will place a bulwark counter on that object.

#### Cascade

1. Cascade is a keyword for modal abilities that selects a corresponding effect to place onto the effect stack depending on the number of times the ability has been either triggered or activated for triggered abilities and activated abilities, respectively.
   1. Cascade does not use counters and only tracks the number of times the ability has been triggered/activated.
   2. The selected effect considers the number of times activated/triggered, including the current activation/trigger. I.e., the first trigger or activation will always have cascade at 1.
   3. Only the effect corresponding to the correct cascade effect is put onto the stack. If the effect requires any selections, such as targets, they are made as the effect is put on the stack.
2. If that ability does not resolve for any reason, the ability is still activated, and the cascade ability will advance to the next count on the subsequent activation or trigger.
3. Copying a cascade ability will not advance the count of times the ability has been activated or triggered and will place an additional instance of the pending effect on the Effects Stack for resolution.
4. Cascade abilities are instanced per object; if that object were to leave the field, the new object of that card will have new cascade abilities that will not track how many times the old object had triggered or activated its cascade ability.

#### Champion Bonus

1. Champion bonuses are restriction abilities that define a bonus effect or replacement effect for a card that is enabled if and only if the player’s champion’s lineage name matches the specified champion name of the restriction ability.
2. Champion Bonuses function in all zones.
3. If a card with a champion bonus ability lists a champion whose name differs from the name of the champion(s) controlled by a player such that the condition for a class bonus is not met, the keywords and effects associated with the bonus are ignored as part of the rules text in every zone.

#### Class Bonus

1. Class Bonus is a restriction ability that defines a bonus effect or replacement effect for a card that is enabled if and only if a player’s champion’s class matches the class of the card or object.
2. To unlock a class bonus, a player’s champion must match at least one of the classes on the card with class bonus that player controls.
3. Class Bonus functions in all zones.
4. If a card with class bonus and a champion differ such that the condition for a class bonus is not met, the keywords and effects associated with the bonus are ignored as part of the rules text in every zone.

{% hint style="info" %}
E.g., Merlin, Memory Thief banishing a Flame-Rune Swordsman from the graveyard of a player controlling Tristan, Grim Stalker does not gain a level counter upon resolving Merlin’s ability.

![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/merlin-memory-thief-doa-alter.jpg)![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/flame-rune-swordsman-doa-alter.jpg)
{% endhint %}

#### Class Locked

1. Class Locked is a restriction ability that disallows the player from playing that card unless that player’s champion’s class matches the class of the card.
2. To unlock the card, a player’s champion must match at least one of the classes on the card with class bonus that player controls.
3. Class Locked functions in all zones.
4. If a card that is class locked and a champion differ such that the class condition is not met, that card can't be played.
   1. If a card has multiple Class Locked abilities that define different classes, each restriction must be met simultaneously for the card to be allowed to be played.
5. Unlike Class Bonus or other ability-tied restriction abilities, Class Locked does not disable rules text on a card.

#### Cleave

1. Cleave is a static ability of attacks, weapons, and units which means "Attack all attackable objects a chosen player controls. This attack can't be intercepted."
   1. Attackable objects include Siegeable domains.
   2. Rather than selecting an attack target during declarations, an attack with Cleave is declared by selecting a player. Defending objects are assigned based on all legal, attackable objects controlled by the chosen player. Any units that enter the field under the defending player’s control will not be designated as defenders and will not be involved in combat as defenders.
2. Cleave attacks can’t be intercepted or redirected.

{% hint style="info" %}
E.g., For 1.b., a player chosen for a Cleave attack activates and resolves Blanche, Sheltering Saint at the beginning of the retaliation step of combat. Blanche would not be considered a defending unit and would not be able to retaliate nor would be dealt damage during the damage step.

![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/blanche-sheltering-saint-ftc.jpg)![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/hurricane-sweep-sp1.jpg)
{% endhint %}

5. An attack with Cleave may be retaliated against by each defending unit.&#x20;
6. Attacks with cleave involve only one combat step; damage is done simultaneously to each assigned defending unit.
   1. Each damage calculation is done independently.
7. Damage done as a result of an attack with Cleave only causes the loss of one durability counter on a weapon if that weapon is wielded for the attack.
8. Multiple instances of Cleave are redundant.

#### Critical N <a href="#critical" id="critical"></a>

1. Critical N is a static ability which means “If this would deal combat damage, instead double that damage unless an opponent discards N cards.”
2. Any opponent may discard N cards even if a unit they control is not receiving the damage.
3. Multiple instances of critical stack from a single source additively. E.g. An ally with both Critical 2 and Critical 3 will require opponents to, in any combination, discard 2 and 3 cards, otherwise the damage is doubled. Damage will only be doubled once, regardless of how many instances of Critical are involved.

#### Command

1. Command is a static ability on Command Attacks which means "An ally you control performs this attack."
   1. Commands have a replaced additional cost of resting an awake ally rather than a champion. The command ability may include a subtype that specifies which ally type must be rested. This replacement cost removes the cost of resting a champion to activate an attack card.
      1. Allies with zero power (or less) may be selected to attack using Command cards.
   2. You do not rest your champion to activate attacks with the command ability.
   3. A command that was played with its additional cost of resting ally waived in some form, such as by effects that specify to "activate without paying its costs," the attack must still select a valid attacker to resolve properly; the controller must have an ally. This will not rest the ally during the attack if it is awake, and the controller may also choose a rested ally for a command activated this way.
2. After an attack with command resolves, a combat phase will begin with the rested ally as the attacker rather than a chosen champion. The attack card added to the rested ally's intent for the combat phase.
   1. Commands that resolve without a valid target will not create a combat phase; the rested ally will not enter combat.
   2. The ally must still obey its controller to attack. This means if a condition such as Pride is not met, the attack will fail to begin, no combat phase will start, and the attack card will enter the graveyard. The ally would remain rested.
3. If an attack card with the command ability were to be placed into an intent, the attacker's object typing will be checked against any specified subtypes for the ability as a state-based action. If the specified subtype for the command ability is not met and the command in the intent is not a legal attack for the attacker, the attack card will be placed in the graveyard as a result of state-based effects.

{% hint style="success" %}
Damage will be dealt by a unit according to its damage stat and the damage stats of any cards in its intent.
{% endhint %}

#### Commanded Will N

1. Commanded Will is a static ability of Chessman units which means "As long as this unit is attacking using a Command card, it gets +N power."
   1. The ability's condition is fullfilled if there is a Command attack card in its Intent zone.

#### Divine Relic

1. Divine Relic is a static ability which means “You can only have one card with this keyword in your material deck.”

#### Efficiency

1. Efficiency is a cost-modifying static ability for a card or ability which means “This card costs LV less to activate” ([LV](/glossary/game-terms.md#lv) refers to your champion’s level).
2. Efficiency functions only while a card is being placed onto the Effects Stack.

#### Element Bonus

1. Element Bonus is a restriction ability that defines a bonus effect or replacement effect for a card that is enabled if and only if the player’s champion’s element(s) matches the element of the card or object.
2. Element Bonus functions in all zones.

#### Elysian Aura

1. Elysian Aura is a static ability which means "As long as you control at least one object with this ability, Aenean Spell cards you own activate and resolve as if your champion has +2 level."
   1. This effect will not stack additively for each object with Elysian Aura; only one Elysian Aura effect will be active regardless of how many objects with Elysian Aura that player controls.
2. Aenean Spell cards activated by a player while they control an object with Elysian Aura will calculate any costs, modes, or other level-dependent information as if that player's champion's LV is 2 higher. E.g., a Level 3 champion card whose controller is activating a card with Efficiency and controls an object with Elysian Aura would pay 5 less to activate that card.
3. If a player gained control of an object with Elysian Aura after a card is already activated, costs that were paid, modes selected, or any other level-dependent information at the point of activation can't be changed. The same is true if a player loses control of all objects with Elysian Aura.
   1. However, if the change in LV causes a restricted ability to become restricted, the ability or effects corresponding to that restriction will be lost. This is only considered after state-based checks are performed. If control of all objects with Elysian Aura is lost in the process of resolving a card with a restriction ability, the ability will still consider Elysian Aura as active until the effect fully resolves and state-based checks are performed again.
   2. Resolving effects that consider LV in any calculations will consider any changes in the status of the Elysian Aura if the ability is either active or lost during resolution.

#### Empower N

1. Empower is a static ability which means "The next Spell card you activate this turn activates and resolves as if your champion got +N level(s)."
   1. Empower must take a value greater than 0 to happen; a spell will not be empowered if an effect gave Empower 0.
2. Empower is statically granted to a card in the Effects Stack the next time it would apply.
   1. When the next Spell card is activated, it is added to the Effects Stack with the "Empowered" property, and all of its activations (including copies) will treat the resolving activation as being empowered.
3. Multiple instances of Empower stack additively.

#### Ephemerate

1. Ephemerate is a static ability which means "You may activate this card from the graveyard by paying its ephemerate cost."
   1. The ephemerate cost is separated by an "—". Any modifiers to this cost or ability are listed after this cost.
   2. As ephemerate counts as an alternative activation that is not given any special permissions or timing windows (unlike Starcalling), the activation must follow the default speed of the card.
   3. Card activations that would become objects as they resolve become Ephemeral as they enter the field, if the card was activated via the Ephemeral ability cost.
      1. Ephemeral, as an object property, modifies objects such that the objects are banished whenever they would leave the field. The ephemeral property placed on the object will not be applied to the card that object represents. If the card would move zones, the card does not retain the "ephemeral" property and any subsequent objects represented by that card (unless otherwise specified) will not be ephemeral.
   4. Cards activations that would not become an object or an intent, such as Actions, become Ephemeral on the effects stack when activated via the Ephemeral ability cost.
      1. Ephemeral, as a property applied to cards in the effects stack, modifies the cards such that they will be banished as they resolve or if they were to be moved from the effects stack.
   5. Activations of attacks via ephemerate will resolve and become an Intent. They are considered ephemeral in the Intent zone and will be banished during the end of combat.

{% hint style="success" %}
If an effect would banish an ephemeral card, that card will still be able to track that object as its destination has not changed. E.g., any form of temporary banishing and then returning to the field, such as suppressing, would allow the card to return to the field. If it is returned this way, it is considered a new object and will not "remember" that it was ephemeral; the new object is not ephemeral.
{% endhint %}

#### Fast Activation

1. Fast Activation is a static ability which means “You may activate this card at fast speed.”
2. Fast Activation is redundant.

#### First Boon

1. First Boon is a static ability of Boons which means "Bestow this boon at the beginning of the game, before Spirits enter."
2. Bestowing a boon using the First Boon ability is a pre-game action.

#### Floating Memory

1. Floating Memory is a static ability which means “While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.”
2. When paying a memory cost, the part of the cost paid with floating memory must be declared before determining the number of cards that are randomly banished as part of paying for memory costs.
3. Floating memory is redundant.

#### Foster

1. Foster is a triggered ability which means “At the beginning of your recollection phase, if this ally hasn't been dealt damage since the end of your previous turn, it becomes fostered.”
2. Any unit may become fostered, but units can’t make themselves fostered without the Foster keyword.
3. Foster is redundant.

#### Hindered

1. Hindered is a static ability which means, "This object enters the field rested."
2. Hindered is redundant.

#### Interdiction

1. Interdiction is a static ability of cards which means, "As long as this card's activation is on the effects stack, players can't have opportunity."
2. When a card with Interdiction is activated, it will remove any Opportunity that a player has and Opportunity will not be transferred or granted to any other player. This means that no players may play any cards, declare attacks, activate abilities, or perform any other player action that would require Opportunity for the sake of timing conventions.
   1. Triggered abilities may still be placed on the effects stack.
3. After a card activation with Interdiction resolves, the turn player will gain Opportunity.

#### Imbue

1. Imbue is an static ability which means, “You may reserve all cards revealed as you activate this card. If at least N of them are \<cards matching the defined characteristic>, this card becomes imbued."
2. Fulfilling the condition of the imbue ability will cause the card that resolves or the object the card would become to be imbued.
3. Cards that are set in the memory zone revealed are not revealed from the memory zone. They are just placed face-up in the memory zone. This means it will not trigger off of cards being revealed from memory.
4. Cards revealed for Imbue will be turned face down after the card is successfully activated and placed on the effects stack.
5. If a card has multiple instances of Imbue, only the smallest value of N needs to be met for a card to be imbued.
6. If a card has Imbue abilities that define different characteristics, the player may choose which characteristic to imbue for.
7. Imbue can exist in the following variations:
   1. Imbue N: To Imbue N, the defined characteristic defaults to N cards that match the imbued card's element identity.
      1. Cards with the Exalted element will consider both its basic element and the Exalted element as valid characteristics to qualify for the Imbue condition.
   2. Advanced Imbue N: For Advanced Imbue N, the defined characteristic is set to N cards that are of advanced element. These do not have to match the card's element.
   3. \[Element] Imbue N: These abilities define an element where N cards need to match the defined element.

#### Immortality

1. Immortality is a static ability which means “This object can’t be sent from the field to the graveyard.”
   1. Immortal objects do not die; they do not go to the graveyard as a result of having 0 or less life.
   2. Immortal objects can’t be destroyed (including via sacrifice).
2. If a player controls multiple Immortal objects that are unique and have the same name, a player will still be forced to put one of those objects into their graveyard as a state-based effect as a result of breaking the Unique rule.
   1. Rule 2 takes precedence over Rule 1 and allows Rule 1 to be ignored in these cases.
   2. This counts as dying or being destroyed.
3. Immortality is redundant.

#### Inherited Effect

1. An Inherited Effect is a static ability applied to champion cards which means “Your champion has this ability as long as this card is part of its lineage.”
2. Inherited Effect only functions while the card with the ability is in a Lineage.

#### Intercept

1. Intercept is a triggered ability which means “Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.”
   1. The ally must still be a valid target for the attack to be redirected.
   2. Players can't redirect attacks to the source of the trigger if it is already defending in combat.
2. If an ally with intercept does not obey a player, the resolution of the intercept ability will fail and that ally will not be able to intercept. The trigger still occurs and Opportunity is presented if a player has any effects that might cause that ally to obey the controlling player.
   1. Intercept will trigger, but will not allow the player to make that ally intercept if that ally does not obey that player.
3. Intercept is redundant.

#### Kindle N

1. Kindle is a static ability which means "You may banish up to N fire element cards fromyour graveyard as you activate this card. Each one pays for 1 reserve of this card's cost."
2. Kindle does not modify a card's cost characteristics regardless of how its payment is opted for.

#### Level Locked N

1. Level Locked is a restriction ability that disallows the player from playing that card unless that player’s champion's base (written) level is at least N or higher.
2. To unlock the card, a player’s champion card must present a level of N or higher; level modifiers from continuous effects will not contribute to changing a champion's base level.
3. Level Locked functions in all zones.
4. If a card that is level locked and a champion's level is insufficient to reach the requisite N, that card can't be played.
   1. If a card has multiple Level Locked abilities, the highest restriction must be met for the card to be allowed to be played.
5. Unlike Class Bonus or other ability-tied restriction abilities, Level Locked does not disable rules text on a card.

#### Level Restriction

1. Level Restrictions (formatted as bubbles with Level N+) are restriction abilities that check if a player’s champion is at least level N.
2. Level Restrictions function in all zones.

#### Lineage (Keyword)

1. Lineage is a static restriction ability for leveling up a champion which means “\[CARDNAME] must be leveled from a previous level ‘X’ champion” where X is the character name of the previous champion.

{% hint style="info" %}
E.g., Lorraine, Wandering Warrior is a Lorraine champion and would be a valid condition for leveling into Lorraine, Blademaster.

![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/lorraine-wandering-warrior-doa-alter.jpg)![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/lorraine-blademaster-doa-alter.jpg)
{% endhint %}

#### Lineage Release

1. Lineage Release is an activated ability that says “Activate this ability by banishing this card from your champion’s inner lineage.”
2. Lineage Release abilities on one card do not allow a player to banish another card with a Lineage Release ability for the cost of the written ability; only the effect of the ability of the card banished will be put onto the Effects Stack awaiting resolution.
3. These abilities can only be activated if the card with Lineage Release is in the Inner Lineage (i.e., it is not the player’s champion).

#### Link

1. Link is a static ability of objects which means "This object enters the field linked to a target object. If the link is broken, sacrifice this object."
   1. The link will designate a linked object that is the target (or, sometimes, choice) of the Link.
   2. The Link ability may be preceded by an object type. This will restrict targeting of the Link ability only to consider objects of that type as legal. This is true for choosing, as well.
2. Objects that enter the field after resolution from the effects stack that specify a Link ability become linked to a targeted object, typically preceding the Link word.
   1. If an object with a Link ability were to enter the field from a zone other than the effects stack, the linked object is just chosen as the object enters the field. It will not target anything.
   2. If the activation or materialization of the card with the Link ability has no legal targets, it will fizzle. If the object with the Link ability enters the field from a zone other than the effects stack and has no legal choices to Link to, it will be sacrificed (See points 6 and 7).

{% hint style="info" %}
E.g., Champion Link, Ally Link. The target object of the Link is the Linked object (and can be described as Linked ally, Linked champion, etc.).
{% endhint %}

3. Cards with Link abilities must specify the Link target when they are put onto the Effects Stack. If that object is no longer legal, it will fizzle.
4. A Link ability is broken when either the object with the Link ability or the Linked object leaves the field. The Link is also broken if it becomes illegal at any time, such as through type-changing or type-setting.
5. If the object with a Link ability has no Link with an object during state-based checks, the object with the Link ability is sacrificed as a state-based action (players must sacrifice it before any Opportunity is passed and any further player actions are taken). This considers if the link is broken or did not exist when the object with the Link ability entered the field.
6. An object can be under the effect of any number of Link abilities.
7. A Link only exists when at least one of the Linked objects has a legal Link.

#### Link Shield

1. Link Shield is a static ability of objects that inherits the same rules as Link and counts as a Link ability. Link Shield means "This object enters the field linked to a target object. If the link is broken, destroy this object. If the linked object would be destroyed, remove all temporary damage from it and destroy this object instead. If that object would be sacrificed, sacrifice this instead."
   1. An object that is linked to another object with Link Shield will become linked.
2. An object with the Link Shield ability will be sacrificed instead of the linked object if the linked object would be sacrificed as a result of an effect or to pay a cost.
   1. If the linked object is sacrificed, it can't fulfill requirements for multiple sacrifices if the object with Link Shield is sacrificed in its place. E.g., an effect that would say "Target player sacrifices two allies." would need that player to pick two separate allies to sacrifice. If one of the allies has a Link Shield, the result would be the Link Shield sacrifice replacing the sacrifice of the ally it is attached to, but the other ally would still be sacrificed. The player may not elect to sacrifice the Link Shield object and the object it is attached to to meet the requirements of the effect.
   2. If any references are made to the sacrificed or destroyed object, regardless of type mentioned (e.g., "the sacrificed ally's power"), it will instead reference the corresponding stat or information from the object with the Link Shield.
      1. If the corresponding stat does not exist on the Link Shield, it is considered to be zero.

#### Memory N+

1. Memory N+ is a restriction ability that defines a bonus effect or replacement effect for a card that is enabled if and only if the player has N or more cards in their memory zone.

#### Multistrike N

* Multistrike N is a static keyword ability that means "As an attack is declared, select up to N additional attack targets for the attack."
* If an attack declaration with multistrike also has the Cleave keyword, the opponent receiving the cleave attack is selected first. Then, the N additional attack targets are selected.

#### Omnishroud

1. Omnishroud is a static ability of objects which means “This can’t be targeted by activations, materializations, or triggered abilities.”
   1. Activations includes card and ability activations.
2. If an object receives Omnishroud while being targeted by an activation, materialization, or triggered ability, that target would be considered illegal.
   1. If that target was the only specified necessary target for the spell, the spell will fizzle.
3. Omnishroud is redundant.
   1. Spellshroud may still be applied to objects with Omnishroud, but will defer targeting permissions to those set by Omnishroud since Omnishroud is more restrictive.<br>

#### On Attack

1. On Attack is a triggered ability condition.
   1. On units, On Attack means “When this unit attacks.”
   2. On cards in the intent, On Attack means "when this is used in an attack."
   3. On weapons, On Attack means "when this is wielded."

#### On Banish

1. On Banish is a triggered ability condition that means "When this is banished."
2. The unit is only considered to be banished if it goes directly to banishment when it dies; On Banish will not trigger if the unit is sent anywhere else as a result of a replacement effect.
3. On Banish triggers from the field and considers the source of the ability as the object that was banished, not the card itself that is placed in banishment.

#### On Charge N

1. On Charge is a triggered ability condition which means "The first time this object has N charge counters on it."
   1. The triggered ability will only trigger once, the first time it has N charge counters. It will not trigger again regardless of whether the charge counters are removed and it regains charge counters in some way.
2. At the beginning of a player's recollection step as a turn-based action (TBA), that player puts a charge counter on each of their objects with an untriggered On Charge ability.

#### On Death

1. On Death is a triggered ability condition that means “When this dies.”
   1. Only units can die. Non-units are still considered destroyed, but are not considered to have died.
2. The unit is only considered to have died if it goes directly to the graveyard when it dies; On Death will not trigger if the unit is sent to banishment as a replacement for being sent to the graveyard.
3. On Death triggers from the field and considers the source of the ability as the object that died, not the card itself that is placed in the graveyard.

#### On Enter

1. On Enter is a triggered ability condition of objects that means “When this enters the field.”
2. For champions, On Enter will consider the card entering the Lineage as the topmost champion card as if that card had entered the field (it is not a new object).

#### On Foster

1. On Foster is a triggered ability condition which means “Whenever this unit becomes fostered.”

#### On Hit

1. On Hit is a triggered ability condition.
2. On units, On Hit means “When this deals combat damage to an attackable object.”
   1. On Hit will trigger off of hitting a Siegeable domain with damage dealt in the form of loss of durability counters from that domain.
3. On intents and weapons, On Hit means “When an attack or retaliation using this deals combat damage to an attackable object”

{% hint style="info" %}
E.g. On Hit triggers on any unit being dealt combat damage, typically through attacks or retaliations. On Ally Hit triggers only when the combat damage is dealt to an ally unit. On Champion Hit triggers only when the combat damage is dealt to a champion unit.
{% endhint %}

4. If an On Hit ability specifies an effect that specifies “that opponent” or\
   “that player,” this language will specify the opponent or player controlling the object that was hit.

#### On Kill

1. On Kill is a triggered ability condition when attacked units are killed by an attack.
   1. Units are killed as a result of having 0 or less life as a state-based effect.
   2. Siegeable domains are destroyed as a result of having 0 or less durability as a state-based effect but will not trigger On Kill as they are not considered units.
2. On units, On Kill means “When a unit is killed as a result of being dealt combat damage by this.”
3. On intents and weapons, On Kill means “When a unit is killed as a result of being dealt combat damage in an attack using this.”

{% hint style="success" %}
See [killed](/glossary/game-terms.md#dies): "A unit is only considered to... have died or to have been **killed** if and only if it enters the graveyard directly from play." This means that On Kill will only trigger if the unit went to the graveyard directly due to the combat damage dealt, and not through any secondary effects, such as On Hit abilities that then would kill the unit.
{% endhint %}

#### On Leave

1. On Leave is a triggered ability condition that means “When this leaves the field.”
2. On Leave triggers from the field and considers the source of the ability as the object that left play, not the card itself that is moved to another zone.

#### Prepare N <a href="#prepare" id="prepare"></a>

1. Prepare is an optional cost-modifying static ability of some cards which means, “As an additional cost to activate \[CARDNAME], you may remove N Preparation counters from your champion. If you do, \[CARDNAME] becomes prepared as it’s activated.”
2. If the Prepare cost was paid, the card becomes “prepared.”

#### Preserve/Preserved <a href="#preserve" id="preserve"></a>

1. Preserve on objects is a triggered ability that means, “When \[CARDNAME] is destroyed, put it into its owner’s material deck revealed and Preserved. You may return a Preserved card from your material deck to your hand instead of materializing when you would materialize.” Objects with Preserve will have a trigger when they are destroyed which will cause the object’s card to be sent from the graveyard to the material deck “Preserved.”
   1. If a card is banished instead of going to the graveyard, it will not be in the graveyard to trigger Preserve.
2. Preserve on non-objects is a static ability that means, “As \[CARDNAME] resolves and would be placed into the graveyard, instead put it into its owner’s material deck revealed and Preserved. You may return a Preserved card from your material deck to your hand instead of materializing when you would materialize.” Non-objects will have a replacement effect generated which will send the card to the material deck “Preserved” as it resolves rather than entering the graveyard.
   1. If a non-object card with Preserve would be banished instead of going to the graveyard as it resolves, the card’s controller may choose whether the card is Preserved or is banished.
3. Every card that is Preserved is added to the material deck face-up and remains face-up until it moves to the hand, memory, or other zone considered as private information.
4. “Preserved” is a card property that allows the card to be added back to a player’s hand when they would materialize instead of materializing a card.

   1. This will not count as a materialization.
   2. Preserved cards must stay revealed for as long as they remain Preserved.
   3. Returning a Preserved card to replace a materialization only requires that a player is given an opportunity to materialize, regardless of whether or not the player has a card they are able to materialize.
      1. *"No Double Dipping"*: If a permission would be given to "play" a card, only the materialization choice would be able to be replaced and the player can't also activate a card while replacing the option to materialize.

#### Pride N <a href="#pride" id="pride"></a>

1. Pride is a static ability, which means “This ally won’t obey you unless your champion is level N or higher.” (Refer to [Obedience](/glossary/game-terms.md#obedience).)
2. If an object has multiple instances of pride, only the highest value is taken into consideration for obedience.

#### Ranged N <a href="#ranged" id="ranged"></a>

1. Ranged N is a static ability for units which means “As long as this unit is distant, its attacks get +N power.”
2. Multiple instances of Ranged stack additively.

#### Renewable

1. Renewable is a static ability of Regalia which means “If this card would be banished from the field or an intent, put it into its owner’s material deck instead.”
2. Renewable will not function from any other zones, such as the object-specific zone of loaded cards (See [Object-Specific Zones](/game-mechanics/game-mechanics-game-zones/game-zones-object-specific-zones.md)).
3. Renewable is redundant.

#### Reservable

1. Reservable is a static ability of objects which means “While paying for a reserve cost, you may rest this object to pay for 1 of that cost.”
2. Reservable can pay for any costs that require a reserve cost, including activation costs, added or extra reserve costs, or taxed reserve costs.
3. Reservable is redundant.

#### Retort N

1. Retort is a static ability which means "As long as this ally is retaliating, it gets +N power."

#### Spellshroud

1. Spellshroud is a static ability of objects which means “This can't be targeted by spells,” where Spells are cards, effects, or sources that have or are granted the Spell subtype.
   1. Triggers generated by a Spell object are themselves of the Spell subtype and therefore cannot target objects with Spellshroud.
2. If an object receives Spellshroud while being targeted by a spell, that target would be considered illegal.
   1. If that target was the only specified necessary target for the spell, the spell will fizzle.
3. Spellshroud is redundant.

#### Starcalling

1. Starcalling is a static ability of cards which means “As you’re looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you’re looking at on the bottom of your deck in any order.”
   1. Activating a card this way can ignore the default play speed.
2. Starcalling is an alternative cost for activating cards.
3. When a player activates a card using the Starcalling cost, that player will put all other cards seen while glimpsing at the bottom of the deck in any order; they may not choose to put any cards on the top of the deck.
4. Starcalling costs can still be modified by activation cost modifiers.
5. Starcalling only functions from the Main Deck and cards activated by paying for Starcalling costs are considered as activated from the Main Deck and no other zones.
6. Once a card is activated via Starcalling, it will be placed onto the effects stack but will not begin to resolve until any and all currently resolving effects are fully resolved.

#### Steadfast

1. Steadfast is a static ability which means “This ally can retaliate while rested and doesn’t rest to do so.”
2. Steadfast is redundant.

#### Stealth

1. Stealth is a static ability of units which means "This can't be targeted by attacks unless permitted by True Sight."
2. Objects that were declared as retaliating against an attack before receiving stealth will still retaliate against their retaliation target and will deal damage accordingly during the combat phase.
3. If an object receives stealth while being the target of an attack, that target is considered illegal for the attack, and the attack is fizzled unless the attacking object has true sight. The defending object stops being a defending object.
4. Stealth is redundant.

#### Taunt

1. Taunt is a static ability of units which means "While awake, this must be targeted before other objects you control during your opponents' attack declarations, if able."
2. When declaring target(s) for an attack, a player must target awake units with Taunt over other attackable objects, if able.
   1. Attacks may be redirected or changed from the ally with taunt after initial attack declarations.
3. If multiple objects with Taunt are in play, the attacking player can choose which of those units to attack.
4. Taunt is redundant. An object with multiple instances of Taunt does not have to be attacked with higher priority over an object with a single instance of Taunt.

#### True Sight

1. True Sight is a static ability.
   1. On units, True Sight means "This unit's attacks can target units with stealth."
   2. On weapons, True Sight means "Attacks using this weapon can target units with stealth."
   3. On attacks, True Sight means "This attack can target units with stealth."
2. True Sight is redundant.

#### Unblockable

1. Unblockable is a static ability which means "This unit's attacks can't be intercepted and ignore taunt."
2. Attack target(s) from an unblockable unit can still be changed (See [redirect](/glossary/game-terms.md#redirect).)
3. Unblockable is redundant.

#### Vigor

1. Vigor is a triggered ability of units which means "This unit wakes up at the beginning of your end step."
2. Multiple instances of Vigor will create separate triggers during the end step.
