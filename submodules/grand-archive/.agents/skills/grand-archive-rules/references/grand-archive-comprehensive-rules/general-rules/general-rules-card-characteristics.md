# General Rules - Card Characteristics

#### General Rules

1. A characteristic of a card or object is any part of the card that can be referenced by effect text or the game. Characteristics can include:

* Element
* Cost
* Types (including supertypes and subtypes)
* Abilities
* Stats (power, life, durability)
* Speed (fast, slow)
* Name

2. Characteristics do not include [properties or states](/game-mechanics/game-mechanics-properties-and-states.md).

#### Type-Overwriting and Type-setting

1. If an effect sets an object's typing to a specified type, it will replace the originally noted typing. Any typing not modified is retained, such as subtyping.
2. If the specified overwriting sets the card type, it will also lose its supertypes. Supertypes must be redefined whenever a card’s type is set or overridden.

{% hint style="info" %}
E.g., Triskit, Angel of Guidance, loses the original Unique Ally typing if a player accepts the On Enter ability and will instead become a Unique Champion. Subtyping is conserved, and Triskit will still be a Warrior Angel.

![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/triskit-guidance-angel-doa-alter.jpg)
{% endhint %}

#### Type-Acting

1. If an effect states that an object may perform an action “as though it were \[object type],” it will not set nor overwrite its own type to match that as the type it is acting as.
2. These effects may allow objects to behave as other object types but will not innately change their own type nor the targeting, damage, timing, and other attributes specific to its own type.
3. Card effects will generally specify what behavior is granted in the effect text.

#### Type-Expansion

1. If an effect confers additional types to an object or card, it will then have all attributes of all of its card types without duplication of any overlapping attributes or behaviors.
2. If any characteristics overlap where their rules conflict, such as being sent to banishment versus graveyard when being destroyed, the more restrictive characteristic applies (banishment being more restrictive than the graveyard as a designated zone).

#### Stat-Setting

1. If an effect were to set or establish a card or object's stat (such as power or  life) where that card or object did not previously have such a stat, it is initially given that stat with a default value of 0 before any stat-setting is applied.&#x20;
