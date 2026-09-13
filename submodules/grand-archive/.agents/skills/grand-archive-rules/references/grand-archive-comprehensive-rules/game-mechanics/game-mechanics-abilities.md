# Game Mechanics - Abilities

#### General Rules:

1. Abilities are characteristics of cards and objects that affect the game and either produce an instanced effect or a continuous effect for a specified duration (E.g. “until end of turn”).
2. Abilities can be either Activated abilities, Triggered abilities, or Static abilities, and some abilities (or functional rules) can be bound by Restriction abilities.
3. Abilities are rules text and, therefore, are considered characteristics of the card.
   1. Some abilities can be considered "intrinsic." An intrinsic ability is any ability that is coded in a way where its ability is keyworded or categorized. This considers [Keyword abilities](/glossary/keywords-and-abilities.md) as well as [Label Keyword](/glossary/game-terms.md#label-keywords) abilities.
      1. If a keyword is tied to a restriction and an effect asks the game to check for the keyword, it will do so during resolution to determine the effect or action's legality. Failing the check would cause the game to act as if the checked characteristic is absent.
      2. Effects that instruct a player to search for or specify a card can do so by defining an intrinsic ability as a filter.

{% hint style="success" %}
E.g., if an effect would instruct a player to search for "a card with Floating Memory" from the deck, they may find any card with Floating Memory in its rules text (provided it's unrestricted), even though the ability only functions from the Graveyard.
{% endhint %}

{% hint style="info" %}
Abilities tied to objects generally only function from the field; however, cards may specify zones in which that ability functions.
{% endhint %}

4. Abilities specifying a zone or zones in which they function may not function in any other zones.
5. Abilities specifying a zone or zones in which they do not function may function in other zones.
   1. Abilities of action cards generally only function in the Effects Stacks.
   2. Abilities of attack cards generally only function while they are in the intent.
   3. Abilities of non-action, non-attack cards generally only function while they exist on the field as objects.
6. Cards in the intent can activate and trigger their abilities as if they were objects, with the exception of any abilities that require resting, sacrificing, or performing any object-related ability as a cost. This means any abilities a card would have been able to trigger or activate when it would have been an object may be triggered or activated from the intent. Cards in the intent will also apply any static abilities as if they were objects.
   1. A card's static abilities, other than those that modify a card's characteristics, such as alternative play methods or abilities that grant special activation permissions. These abilities would reference the card as opposed to the object by name, as is by ability conventions.
7. Abilities can specify zones from where an effect may take place or from where that ability may be activated that are not their default functional zone (Effects Stack for action cards, the field for non-action card objects).
8. Multiple non-keyword abilities on a card or object are separated by paragraph breaks.
9. Some abilities can be granted temporarily or permanently to cards, objects, or players, by other effects or abilities.
10. Multiple instances of the same ability are taken into account only if that ability is not classified as redundant.
11. Redundant abilities and keywords of an object will only take effect once, regardless of the multiplicity of instances in which that ability or keyword is active.
12. Redundant abilities and keywords will only consider the first instance of that ability or keyword for counting purposes.

{% hint style="info" %}
E.g., If an ally has three instances of vigor, other cards and effects would see that ally as having only one ability. [Keywords](/glossary/keywords-and-abilities.md) contains information on ability redundancy.
{% endhint %}

13. Abilities consider the source of the ability as the object or card that generated the ability and are controlled by the player who controlled that object or card that generated the ability, whether triggered or activated. If any ability refers to its source’s characteristics, the last known information regarding the source is used.

{% hint style="info" %}
E.g., If an ally with an On Death trigger has an effect based upon that ally’s power, the power considered will be that of the ally while it was on the field before it died.
{% endhint %}

14. An ability placed in the Effects Stack exists independently of its source and will not be negated or fizzled if its source ceases to exist or is itself negated. If the source of the ability has left the zone it was in or changed control, the last known information under its controller at that time is used.
15. All abilities in the Effects Stack are controlled by the player who controlled the source generating that ability.
16. Face-down cards or cards in any non-public zones will have all abilities, intrinsic or otherwise, concealed from each player. They are considered as just cards without any other characteristics until they are revealed or their characteristics are checked in some manner.
17. Abilities that use "as a spell" in their rules text will confer the "Spell" subtyping to the ability while it is on the Effects Stack. Additionally, if the source of that ability is not a Spell, it will temporarily act as a Spell source during the resolution of the ability; however, it will not receive the Spell subtype as the ability does.
    1. If it is an activated ability, this means that it will count as activating a spell.
    2. When selecting targets, units with Spellshroud can't be targeted by abilities triggered or activated "as a spell" due to having the Spell subtyping.
    3. If an object were to act as a Spell source in this way, any triggered abilities that have instanced conditions that specify some action resulting from a Spell source will count the ability's source as a Spell during state-based checks. The object only acts as a Spell source within the resolution of the ability. (This is similar to how [Spirit Blade: Ensoul allows weapons under its effect to attack as if they were allies](https://index.gatcg.com/edition/spirit-blade-ensoul-doa-alter), despite not having an ally typing, nor functionally becoming allies.)

The following pages discuss these topics:

* [Activated Abilities](/game-mechanics/game-mechanics-abilities/abilities-activated-abilities.md)
* [Triggered Abilities](/game-mechanics/game-mechanics-abilities/abilities-triggered-abilities.md)
* [Static Abilities](/game-mechanics/game-mechanics-abilities/abilities-static-abilities.md)
* [Restriction Abilities](/game-mechanics/game-mechanics-abilities/abilities-restriction-abilities.md)
* [Ability Tracking](/game-mechanics/game-mechanics-abilities/abilities-ability-tracking.md)
