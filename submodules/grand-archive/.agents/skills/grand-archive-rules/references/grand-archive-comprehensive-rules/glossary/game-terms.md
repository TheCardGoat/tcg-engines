# Game Terms

#### Activate/Activating

1. To activate a card is to take the card from the zone it is currently in (usually the hand), pay its costs, and put it onto the Effects Stack for resolution. A player may activate a card if they have Opportunity and are legally allowed to activate the card.
2. To activate an ability is to indicate the ability being activated, pay the costs, and put the ability onto the Effects Stack for resolution. A player may activate a given ability if they have Opportunity and are legally allowed to activate the ability.

#### Awake

1. A card on the field is considered awake if it is in an upright position.
2. Abilities of that card that require resting, such as attacking or as a cost of activation, can only be activated if that card is awake.
3. Cards enter the field awake.

#### Banish

1. To banish a card is to take a card from the zone it is currently in and put that card into its owner’s Banishment zone.
2. A banished card is a card that has been put into the Banishment zone.
3. An object banished is not considered to have been destroyed or to have died when leaving the field this way.

#### Buff Counters

1. Buff counters increase an object’s power and life stats by +1 for each buff counter on that object.
2. Stat modifications due to buff counters are static.

#### Control and Ownership

1. Control of an object or card activation is given to the player who activated the corresponding card by default.
2. The player that controls a specified object is referred to as that object’s controller.
3. If control of a card, object, effect, or ability is not specified, control defaults to the owner. E.g., if an ally is [suppressed](/glossary/game-terms.md#suppress), the new object ally will be under the control of the owner of that ally card.
4. If a triggered ability is placed onto the Effects Stack from a card or object, control of that ability is granted to the controller of that card or object as the ability was placed onto the Effects Stack; changes in control of that object will not retroactively change the player in control of that ability.
5. The owner of the card does not necessarily always control the card.
6. Ownership of a card (within a game of Grand Archive) is designated to the player that began the game with that card in their main deck, material deck, or sideboard.
7. The player that owns a specified card is referred to as the owner of that card.
8. Change in control does not change ownership of the card.

#### Copy

1. Copy can refer to both the effect of copying an object or card activation or the copied object or card.
2. When an object is copied, the copy object becomes a clone of the printed face of the card disregarding any modifiers such as extra counters or status conditions (awake/rested, will not wake up, etc).
3. When a card activation is copied, the copy activation becomes a copy of the card in the Effects Stack with all modes, activation choices, and otherwise modified activation attributes being identical to the original.
4. If an effect is copied, it is effectively put onto the Effects Stack a second time with any relevant modes or activation choices and parameters copied from the original.

#### Damage Counters

1. Damage counters are marked on champions to track a champion’s life.
2. Counters can tick upwards from 0 and a champion is considered defeated when the damage counters reach or exceed the life stat of the champion.
3. Damage counters can be removed by effects that recover.

#### Destruction

1. Destroy is an effect that can affect any object(s) on the field.
2. To destroy an object, move that object from the field to its owner’s Graveyard. If that card is a token, it will be removed from the game.
   1. Destroyed units are considered to have died when they go to the graveyard. They are not considered to have died if they would be banished, put on top/bottom of the deck, or put into the hand instead.
3. An object is destroyed if and only if: it is destroyed by an effect that specifically instructs to destroy it, if it is destroyed as a result of state-based effects, or if it has been sacrificed. A card entering the graveyard or being placed into the graveyard for any other reason does not mean it has been destroyed.
4. A non-regalia weapon is considered destroyed as from the state-based effects if the number of durability counters on that weapon is 0, either by combat or other means.
5. A unit is destroyed from the state-based effect of having 0 or less life or from having damage marked (temporary or via damage counters) equal to or greater than its life.
6. A siegeable domain is destroyed from the state-based effect of the number of durability counters on it reaching 0.
7. An effect or card that specifies an object to be destroyed only causes that object to die if and only if that card immediately enters the graveyard upon resolution of effects.

{% hint style="warning" %}
Banishment as a result of a destruction effect does not allow effects dependent upon that object dying or being sent to the graveyard to happen as there is not a time during the game in which that card can be considered to have entered the graveyard.
{% endhint %}

#### Died/Dies and Kills/Killed <a href="#dies" id="dies"></a>

1. Dies is a term used to denote when a unit on the field would enter the graveyard. Units on the field die when they are either destroyed directly by an effect or by state-based effects, such as having 0 or less life.
   1. A sacrificed unit is considered to have died and been destroyed.
   2. Non-units do not die but they are still considered destroyed.

{% hint style="warning" %}
E.g., a destruction or destroy effect kills an ally and that ally is considered to have died. A siegeable domain being destroyed as a result of falling to 0 durability counters does not die. This means effects like On Kill will not trigger when it comes to non-units.
{% endhint %}

2. A unit is only considered to have died or to have been killed if and only if it enters the graveyard directly from play.

{% hint style="danger" %}
If it would be banished instead of being sent to the graveyard, the card is, by definition, not considered to have died.
{% endhint %}

#### Discard

1. When a player discards a card, they must move a card from the specified zone to their Graveyard. If no zone is specified, cards are discarded from hand by default.
2. Discarding a card can be required as an additional or alternative cost to playing a card or activating an ability. As with the normal steps in paying costs, discarding must be done before the card or ability is fully played or activated.
3. Generally, effects that cause players to discard or require discarding as a cost allow them to choose which card or cards are discarded. Some effects may require that discarding is done randomly.

#### Distant

1. Distant is a property of units.
2. After a unit becomes distant, it will stay distant until the end of its controller’s turn.
3. The distant property ends at the same time as other end of turn effects.

#### Durability Counters

1. Weapons have durability counters that represent how many times they may be successfully wielded for an attack.
   1. A weapon being wielded will only cause it to lose durability during the [Damage Step](/game-mechanics/game-mechanics-turn-order/turn-order-combat-phase/combat-phase-damage-step.md) of combat.
2. Durability counters can be added to exceed the durability stat of a weapon.
3. Weapons are destroyed when durability reaches 0.

#### Element

1. The element of a card is represented by a name and symbol on the top right of its card face.
2. Elements apply a restriction on players from playing cards unless that element is within the element identity of one of their champions.
3. Elements fall under three categories: Norm, Basic, a d Advanced.
   1. Norm is a default element without any restrictions; players always have access to playing cards of this element.
   2. Basic elements are Water, Fire, and Wind, and are typically unlocked by the Level 0 champion that is put into play during the start of a game. Other effects can enable these elements as well.
   3. Advanced elements are any elements that do not fall under either Norm or the Basic element categories. These elements are typically unlocked either after a champion reaches level 3 in its lineage or under special circumstances.
      1. Exalted is a special advanced element that is enabled by default for a player as long as they control a champion that enables another advanced element for them.

#### Enlighten Counters

1. Enlighten counters confer the following ability to objects they're placed on: “Remove 3 enlighten counters from \[CARDNAME]: Draw a card.”
2. Enlighten counters placed on champions persist through level-ups of a player’s champion.<br>

#### Ephemeral

1. Ephemeral is a property that can modify card activations in the effects stack, objects on the field, or intents.
   1. Ephemeral objects will be banished if they were to leave the field.
   2. Ephemeral card activations will be banished when they resolve or leave the effects stack.
      1. If an ephemeral card activation is negated or fizzles, it will be banished instead of going to the graveyard.
   3. Ephemeral intents are banished during the end of combat.
      1. Any On Hit abilities will reference the source of the ability in Banishment according to last-known information of the Intent.

#### Fast

1. Fast is an attribute of action cards that determines when that card may be activated. See the section on timing for further detail.
2. Player actions or cards with the fast modifier may be activated while that player has Opportunity to act or during that player’s main phase if they are the turn player.

#### Fizzle

1. Fizzle refers to card activations/materializations or abilities failing to resolve normally as a result of a game state where targets or game conditions made the activation illegal. When a card's activation or an ability (triggered or activated) fizzles, it will not resolve its effects and will cease to exist from the Effects Stack.
   1. Cards can't fizzle; if all activations/materializations of a card either resolve or fail to resolve, the card that was activated/materialized will then resolve from the Effects Stack and be placed in its default resolution zone. (As a reminder, non-object Regalia and other Material Deck cards will resolve to Banishment, while non-object Main Deck cards with reserve costs will resolve to the Graveyard. Cards whose activations/materializations become objects will instead resolve by sending their respective card to the field where it represents the played card.)
2. For champion materializations, a champion card's materialization can fizzle if its lineage or leveling requirements become illegal before it can resolve (e.g., deleveling the champion card while its leveled-up champion card materialization is pending resolution).
3. If a source card for activations/materializations is removed from the Effects Stack while there are still instances of those activations/materializations pending resolution, those instances will fizzle as a result of not having the source card to activate/materialize from.
4. A card activations/materialization or ability being fizzled is not the same as being [negated](#negated); fizzling is due to a result of state-based checks while negating is the action of removing it from the Effects Stack.

#### Fostered

1. Fostered is a property of allies.
2. Units are unfostered by default.
3. Allies can be made to be fostered by other cards or as a state-based check generated by the Foster keyword ability.
4. An ally can only become fostered once.

#### Gather

1. Gather defines the player action of gathering.
2. To gather, a player selects an ingredient at random from among six different token items and summons it.  The six ingredients are Blightroot, Fraysia, Manaroot, Razorvine, Silvershine, and Springleaf. Each ingredient has two characteristic subtypes used in conjunction with the Brew ability: Adjuvants or Catalysts, and Root, Leaf, or Flower.
3. If a player uses the gather token board, they may use dice or other counting tokens to denote the quantities of each ingredient. Each is still considered an individual object on the field and can be interacted with normally.

#### Generate

1. Generate defines the player action of generating cards, or adding cards from outside the game permanently for the remainder of a game of Grand Archive. Generated cards do not persist after the conclusion of a game; any generated cards will be removed from the play area and corresponding zones after a game has ended.
2. Generating a card adds the specified generated card to the effect’s controller’s hand by default. If a zone is specified for the generate effect, the card will be added in the specified zone for the duration of the game. If that zone is no longer present, it will regress to the default case of being added to the hand.
3. Generated cards can exceed the quantity limits imposed by deckbuilding constraints.
4. Players must own physical copies of each of the cards they wish to generate in a game.
5. If a player attempts to generate a card but does not have the physical card to represent the generated card, the card generation fails; the player fails to generate the card.
6. Cards are added to the hand by default if no zone is specified or a zone that it would be placed into does not exist when a player would be instructed to put a generated card there.

#### Glimpse

1. Glimpse defines the player action of glimpsing, usually worded as glimpse N.
2. To Glimpse N, a player looks at the top N cards of their deck and places any number of those cards to the top of their deck in any order and the remainder on the bottom of their deck in any order.

#### Hit

1. Hit will typically be considered in relation to On Hit triggered abilities.
2. A unit is hit when it is dealt combat damage.
3. If no damage is dealt or damage dealt is zero, a unit is not considered hit.
4. Non-Combat damage sources will not cause the unit to be considered hit.

{% hint style="warning" %}
Combat damage is any damage dealt directly by units during combat based on attacking and retaliation actions; retaliating or attacking units will deal combat damage and be considered to have hit their attack/retaliation targets.
{% endhint %}

#### Influence

1. A player’s influence is equal to the total number of cards in their hand and memory zones.

#### Inner Lineage

1. The inner lineage of a champion is all cards in a champion's lineage other than the top-most card, i.e., the champion itself.
2. The inner lineage can contain any cards and a card must be in the inner lineage to be able to use a Lineage Release ability.

#### Label Keywords

1. Label keywords exist as bolded and italicized text followed by a long hyphen on cards that do not function as normal keywords. Rather, they will refer to a broad class of similar mechanics with individual cards differing in the wording or conditions of the keyword.
2. Label keywords can be referenced by abilities or effects and do count as a characteristic of the card.
3. List of Label keywords:

* Balance: This keyword represents that a card will offer additional effects based on whether the player has an equal amount of cards in their hand and memory.
* Cardistry: This keyword reflects abilities that reference the number of differently-costed Suited allies under a player's control. Typically, these abilities will have an activation cost reduction of 1 reserve for each Suited ally with a different reserve cost under a player's control.
* Deluge N: This keyword represents a static ability around the condition of having N or more water cards in the graveyard.
* Harmonize: This keyword represents that a card will offer additional effects based on whether a Melody subclass card was activated previously during this turn during the resolution of the card.
* Upkeep: This keyword presents a cost or condition that must be fulfilled each turn, usually with the adverse effect of not fulfilling the upkeep condition.
* Equestrian: This keyword reflects abilities that function in conjunction with controlling a Horse ally. The Horse ally may have any typing so long as "Horse" exists as a subtype and "Ally" exists as a type.

#### Last-Known Information

1. [Last-known information](/game-mechanics/game-mechanics-card-and-object-information.md) is information such as status, characteristics, or stats of an object or card that is tracked when that card changes zones.
2. Some effects are reliant on information while a card or object was in a specific zone and will use the information as if that card was still in that zone for determination of effects.
3. Last-known information only considers the last zone change that happened and not any information carried from zone changes prior to that.

#### Leave/Leaves <a href="#dies" id="dies"></a>

1. These are interchangeable terms used to denote when a non-Champion object on the field would leave the field and move to another zone.

#### Level (base)

1. The base level of a champion is the printed level of the champion card in the top left corner. This level determines the leveling sequence of a champion and does not include any level stat modifiers such as “your champion gets +X levels.” The base level is a static characteristic of the champion card. The base level is typically only considered for leveling up champions rather than meeting level restrictions for abilities and effects.

#### Level Counters

1. Level counters represent +1 LV for each level counter on the champion.
2. These counters do not modify the base level of the champion.

#### Level Up

1. A level up or the act of leveling up is when a player adds the next level champion onto one of the champion’s lineages. This does not use the effects stack. Leveling up will cause any “On Enter” abilities of the card being placed onto the lineage to trigger.
2. Leveling up itself is not considered a materialization but can be the result of materializing a champion card.
3. Leveling up is not based on any level modifications from other effects in the game and is solely based on the printed (base) level of the champion card.

#### Lineage (term)

1. A lineage is the entire group of cards dedicated to representing a champion. A lineage includes all cards including the [inner lineage](/game-mechanics/game-mechanics-game-zones/game-zones-object-specific-zones.md#inner-lineage) as well as the topmost card (i.e. the representative champion).
2. The name of a lineage follows the name (excluding titles or monikers) of the topmost card and any leveling restrictions or champion restriction abilities will use that name as a basis.&#x20;

#### Load

1. "Load" is a player action that means to take a card from the zone it is currently in and move it underneath another card. The card on top is considered "loaded" with that card and the card that is being put underneath becomes part of the "loaded cards" underneath that card.&#x20;

#### Loaded

1. Loaded is a property of objects.
2. Cards are unloaded by default.
3. Cards are considered loaded when an object has cards in its [Loaded Cards ](/game-mechanics/game-mechanics-game-zones/game-zones-object-specific-zones.md#loaded-cards)zone.

#### LV

1. "LV" refers to the level of your champion as a sum of the level denoted on your champion card in addition to level modifying effects in the game.
2. LV is generally used for effects or rules text requiring a calculation or a referential variable.
3. LV can take on negative values. If being used to calculate cost reductions (such as with Efficiency), a negative LV value will increase costs. When being used to count or select cards, counters, or objects, a negative LV is considered 0 (you can't select negative amounts of cards or objects).

#### Modes

1. Modes are effects that are listed on a card or effect that give two or more effect options. Modes may be set or changed depending on the game state, or may require a player to choose one or more modes if a card or effect were to resolve. Cards and abilities with these modes can be called modal.
   1. Any modes chosen or selected by a player are made before a card is placed onto the Effects Stack pending resolution.
   2. Modes that define game-state dependencies are not selected by the player, but are selected during the resolution of the effect.

#### Negate

1. Some effects may specify to "negate" a certain card activation/materialization, game action, or effect. "Negate" is a player action which means to remove that instance of the described negate target from the Effects Stack. The removed activation/materialization or ability instance is considered "negated." It does not resolve; it does not happen. Any effects that would otherwise have occurred as a result of the resolution of the negated copy (original or otherwise) do not occur.
   1. A card's activation that has been negated does not remove the source card of that activation from the effects stack; a card that is in the effects stack is not directly removed via negation. The card is only removed as a result of state-based checks where the card no longer has any pending activations/materializations.
   2. Paid costs are not refunded when something is negated. E.g., If a card activation is negated, the costs paid to activate a card and move it to the effects stack do not undo those costs paid, and the card will remain in the Effects Stack until state-based checks remove it from that zone.

#### Negated&#x20;

1. An activation/materialization or ability is negated when a player negates it through an effect.
2. If a card's activation is negated, it is removed from the Effects Stack.
   1. Any triggered abilities that were put on the Effects Stack as a result of the activation will remain triggered; they are not also removed from the Effects Stack.

#### Obedience

1. A player can’t attack with or activate the abilities of an ally that does not obey that player. They may still have that ally retaliate.
2. Allies obey their controlling players by default.
3. Static abilities and triggered abilities of an ally will always happen regardless of obedience, but ownership of the abilities depends on the control of that ally. Some abilities may require obedience of the source object to resolve properly.
4. An attacking ally will continue performing the attack even after it no longer obeys the player who originally declared the attack. This is included when pride conditions are suddenly not fulfilled or if control of the object changes during an attack.

#### Opportunity <a href="#opportunity-term" id="opportunity-term"></a>

1. Opportunity is defined as the time in which a player has the chance to act in response to player actions taken by either themselves or by another player, in response to an effect or player action pending resolution, or in response to a phase change.
2. When Opportunity arises, it first is given to the turn player and proceeds to other players in turn order.
3. Phases apart from the main phase end according to when no players have Opportunity and no events are pending resolution.

#### Play/Played

1. A card is considered played after it is either materialized or activated.
2. Materializing or activating a card counts as playing the card.

#### Player Action

1. Player actions are distinct actions in the game a player can take. E.g., activating or materializing cards, attacking, activating abilities, etc.
2. Player action order is the order in which players may take actions during a turn when they would receive Opportunity. After a player action is taken or Opportunity is granted, it is first given to the turn player. The turn player may act first, after which non-turn players may each take a turn performing player actions as allowed by the game. This can be called the Turn Player / Non-turn Player order.

#### Players

1. A player is an individual taking part in a game of Grand Archive. The “turn player” is the player in control of the current turn and its progression and “non-turn players” are any players that are not the turn player.

#### Preparation Counters

1. Preparation counters are a type of counter that may be placed on a champion.
2. Preparation counters may be paid as an additional cost when activating a card with the keyword Prepare.

#### Recover

1. Recover defines the player action of recovering damage, usually worded as recover N.
2. To recover N, a player removes N damage counters from their champion.
   1. If a player attempts to recover more than the number of damage counters on their champion, they instead remove all damage counters from the champion.
      1. A player that is instructed to recover a non-zero amount while their champion(s) have no damage counters on them will still trigger abilities whose condition is "whenever you recover."
   2. A player can’t remove more than the number of damage counters present on a champion, e.g. if a champion has two damage counters and the player recovers 3, only 2 damage counters are removed.

{% hint style="warning" %}
E.g., For a card that says, "As an additional cost to activate this card, Recover 10," a player activating that card must have a champion with at least 10 damage counters that must be removed.
{% endhint %}

#### Redirect

1. Redirect means to change the target of a card or ability to another valid target.
2. If an effect specified to choose rather than to target, it cannot be redirected.

#### Reflexive Trigger

1. A reflexive trigger is a trigger found within an effect or ability that is placed onto the Effects Stack only if the condition for that trigger is fulfilled and after the initial part of the ability or effect is fully resolved.
2. The source of a reflexive trigger is considered the original source of the effect or ability that generated the reflexive trigger.

{% hint style="info" %}
![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/umbra-sight-alc.jpg)\
\
E.g., Umbra Sight optionally allows a player to draw a card into their memory and put Umbra Sight on the bottom of their champion's lineage. The remainder of the text from "When you do, ..." is a reflexive trigger; It is a triggered ability that is put onto the effects stack after Umbra Sight  resolves and the second card is optionally drawn with Umbra Sight put on the bottom of the champion's lineage.
{% endhint %}

#### Reserve

1. Reserve refers to the player action of taking a card from their hand and placing it into their Memory zone.
2. Reserved cards are returned to the player's hand during the [Recollection](/game-mechanics/game-mechanics-turn-order/turn-order-recollection-phase.md) phase.

#### Rest/Rested

1. To rest an object on the field, that object is turned from the upright (awake) orientation to the horizontal (rested) orientation.
2. Rest Symbol: The rest symbol will appear on a card as a black-bordered arrow turning 180 degrees to the right.
3. The rest symbol will usually indicate resting as a cost for activating an ability.
4. An object on the field is considered rested if it is in a horizontal orientation.
5. Objects that are already rested can’t rest; players cannot rest objects that are rested. If an effect attempts to rest an object that is rested, nothing will happen.

#### Retaliate/Retaliation

1. To retaliate, the defending player may rest a defending unit during the retaliation step of the combat phase to represent it as retaliating during combat.
2. Resting is a cost to retaliate; already-rested units cannot retaliate.
3. A retaliating unit will deal damage according to its power against the attacking unit during the damage step.
4. When retaliation is declared, the retaliating unit causes the attacking unit to become the retaliation target, which is maintained even if the attacking unit stops attacking during the combat phase.
5. Units without a power stat or have a power of 0 cannot retaliate.
6. Retaliation is the act of a defending unit resting to deal damage according to its power against a unit attacking it.
7. A unit can only retaliate if it was an object on the field “before retaliation” (see [Retaliation Step](/game-mechanics/game-mechanics-turn-order/turn-order-combat-phase/combat-phase-retaliation-step.md) of combat).
8. A unit that gains stealth after being declared as retaliating during the combat phase will still retaliate against its attacker during the damage step and deal damage accordingly.

#### Reveal

1. An ability, effect, or game rule may tell a player to reveal a card or a group of cards in a game zone.
2. To reveal a card, a player takes the specified card(s) in that zone and presents them to all players in the game face-up as public information.
3. Cards remain revealed until the next discrete game state, until a player takes a player action, or until the next time state-based effects are checked.
4. Revealed cards may be written down or recorded however a player wishes to do so but may not ask that the revealed cards stay revealed; the information state of the revealed card (private vs public) reverts to the original state before it was revealed after the card stops being revealed.
5. Cards revealed from a private zone ought to be shuffled or randomized among the other cards in the zone after those cards stop being revealed.
6. A card that is already public information or already known can be revealed any number of times.

#### Sacrifice

1. Sacrificing an object is a player action.
2. To sacrifice means to remove an object from the field or in play and put it into the graveyard, or, if the object was a regalia or champion, into banishment.
   1. The type of object to be sacrificed will be characterized by the effect or cost.
   2. If an object is sacrificed as a cost to pay for an effect, ability, or activation, that object is sacrificed at the same time all other costs are paid.
   3. Players can only sacrifice objects they control.
   4. An object is still considered sacrificed if a replacement effect would cause the object to go to a zone other than the graveyard.
3. If the object has an On Death trigger or would trigger an ability due to that object being sacrificed in order to activate a card or ability, the ability will be placed onto the Effects Stack on top of that card or ability and resolved first.
4. If the object has an On Death trigger or would trigger an ability due to that object being sacrificed as a result of an effect, the ability will be placed onto the Effects Stack after all effects of the original ability specifying the sacrifice have resolved.

#### Scavenge N

1. Scavenge N is a instructional word that means to reveal cards from the top of the deck until either the card with a described characteristic or until N cards have been revealed. The card that is found that fits the criteria of the scavenge is referred to as the scavenged card. After the player reveals the scavenged card, they put it into their hand. The rest of the revealed cards will be put to the bottom of the deck in a random order. If no card is scavenged after N cards are revealed, the player will take all of the revealed cards and put them to the bottom of the deck in a random order.

#### Search

1. Search is an instructional word in some effects that tell a player to look through a set of cards in a zone, typically with the intended result of choosing one or more cards out of that set to perform an action on them, such as moving them to another zone.

#### Shuffling

1. Shuffling a set of cards is to make that set of cards sufficiently randomized such that any player in a game cannot uniquely identify any one card and has no reasonable knowledge as to the location of any of those cards from among the set.
2. Effects may instruct a player or players to shuffle a set of cards. If this is done, those players must take the specified cards or set of cards and mix them in a random manner suitable for them until those cards are sufficiently randomized.

#### Slow

1. Slow is an attribute of action cards that determines when that card may be activated. See the section on timing for further detail.
2. Attacks and ally cards innately have a slow timing modifier, only being able to be activated by the turn player during their main phase when no effects are on the Effects Stack.

#### Source

1. A source is considered the object or card from which damage, ability, or effect originates.

#### Suppress

1. Suppress is a keyworded action that can target an object which means for the controller of the ability to “banish it and return it to the field under its owner’s control at the beginning of the next end phase.” The return of the object is caused by a delayed trigger created by Suppress.
   1. The controller of the source that suppressed the object(s) controls the trigger. If simultaneous triggers are instanced, the controller may choose the order in which the triggers are placed onto the Effects Stack.
2. If a card banished with suppress were to leave banishment before the delayed trigger were to resolve, the delayed trigger will not return that card to the field from wherever it currently is; the card in banishment must be the same card that was initially banished.
3. If more than one object is simultaneously suppressed, an independent delayed trigger will be instance for each object, separate of the others. If one suppress trigger is negated, it will not negate any of the other suppress triggers.

#### Summon

1. Summon defines the player action of summoning objects into play.
2. A summoned object is treated as a token that only exists while it is on the field.
3. Summoned objects (tokens) can be represented by any outside game object such that it is easy to distinguish tokens apart from other objects and such that the characteristics of that token are easily tracked or referenceable.

#### Timestamp

1. A timestamp is a chronological marker tied to an object on the field placed when it entered play or tied to a continuous effect when it began in the game. Timestamps are used to keep track of recency of effects and to determine which effects would supersede another if they modify the same value(s).
2. Effects with timestamps are applied in order of oldest effects to newest effects.

#### Token

1. A token is an object put into play through an effect instructing a player to summon that object.
2. Tokens are treated as regular objects while in play but will cease to exist when they move to another zone.
3. A token moving to another zone will still complete any state-based checks, triggers, and any necessary actions to resolve the game state, and the token will cease to exist as Opportunity is passed to the next player.

#### Transform

1. Transform defines the player action of flipping a double-faced card (as an object) over to its other face. Only cards that have a valid side to transform into may transform.
   1. If a player attempts to transform a card that cannot be transformed, nothing will happen. This includes any attempts at having a card enter the field transformed if the card is not a double-faced card.
2. Transforming a card will retain any counters that were initially placed on the object. It will also retain any applied continuous effects, such as Links, if legal.

#### Unit

1. Units are champions and ally objects.
2. Units can typically be attack targets during attack declarations.

#### Wake Up

1. To wake up an object on the field, that object is turned from the horizontal (rested) orientation to the upright (awake) orientation.
2. Objects that are already awake can’t wake up; players cannot wake up objects that are awake. If an effect attempts to wake up an object that is awake, nothing will happen.

#### Wield

1. Wield means to use a weapon during an attack declaration.
2. A weapon used during an attack is said to be "wielded" and becomes wielded when it is announced as being wield in combat.
3. Champions can wield weapons to declare attacks.
4. Some weapons with [functional subtypes](/general-rules/general-rules-card-types/card-types-functional-subtypes.md) can't be wielded unless they are loaded.
