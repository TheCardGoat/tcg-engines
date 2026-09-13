# Game Mechanics - Copy

Some cards or abilities can become a copy of a card activation/materialization, object, or ability, or may create an object that is a copy of a card, object, or ability. Copying can refer to the effect of copying an object or card activation. A copy can refer to the copied card activation/materialization, object, or ability.&#x20;

#### General Rules:

1. Anything copied will assume the properties and characteristics it inherits as a result of the zone in which it was copied.
   1. A copied activation of a card or ability is still considered a card activation. A copied triggered ability is still considered a triggered ability. This is true for all types of interactable objects.
      1. If the activation of the original card would require additional costs, those additional costs are also required for the copy. The copy is treated as a card, per rule 1.e. in this section.
   2. A card copied from the hand will cause the copy to behave as if it were in the hand. The same is true for other zones.
   3. Only copies of cards on the field (i.e., the objects the cards represent) will become represented by tokens on the field.
   4. Copies that are not on the field will only persist as long as the effect that created the copy persists. However, a copy of a card activation/materialization with a corresponding object type will cause a token of that object to be summoned as it resolves (the original card copy itself still ceases to exist).
      1. A copy of an intent will remain in the intent until the end of combat.
   5. Copies of cards (not objects) are treated as cards themselves for the duration of the copy effect. The same is true for any other type of copying.
      1. Any effects or other rules text referencing "this" on the original card that was copied will apply to the copy itself, as it is also treated as a card under rule 1.e.

{% hint style="success" %}
For 1.a., a copied intent is also an intent, a copied object is copied into the field, a copied activation is copied into the effects stack, etc.
{% endhint %}

2. Whenever a copy is made of a card activation/materialization, it will automatically gain the "copy" property. Only non-copied card activations/materializations will resolve with the source card representing the object of the activation/materialization, if it were to become an object. Otherwise, objects resolving with the "copy" property from their activations/materialization will become token objects.
3. Copied card activations and copied objects are under the control of the player who created the copy.
4. A copied ability will have the same source as the original ability activation or trigger, and references by name will refer to the source of the original ability.
5. Copy effects that state a player may choose new targets or modes for the copied ability or card activation allow the player to choose new targets or modes.
   1. This will not allow the player to modify any choices made in activating the original non-copy instance.
6. Copying a card is not the same as generating a card. A copied card will cease to exist after the duration of the effect that created it.

#### Copying Objects

1. When an object is copied, the new copy has all characteristics of the base printing of the current face of that card without any modifiers such as counters, rested/awake statuses, or other continuous one-shot effects applied to the card.
   1. Copying an object will only copy the default text on a card, regardless of any modifiers that object maintained through or conferred by its activation/materialization, such as Imbued, Brewed, or Prepared.
      1. This extends to any cards copied in the Intent.
2. Any choices or modes made while the original was on the field do not count as copiable information or characteristics for the new object. If any abilities ask that a player choose an effect, this choice is not impacted by nor will it impact the original object’s choice.

{% hint style="warning" %}
![](https://api.gatcg.com/cards/images/nia-mistveiled-scout-doa-alter.jpg)

E.g., If a copy was made of Nia, Mistveiled Scout, the copy’s controller may choose a different card name from what was named by the original Nia while the new object’s On Enter ability is resolving. The new Nia will not “remember” which card was chosen by the original.
{% endhint %}

3. Copies of any intent will also be copied into the intent zone. Those copies will cease to exist at the end of combat.
4. Any subsequent changes to the original object will not cause any changes in characteristics to any of the copies.
5. When an object is copied, the copied object is solely used to reference characteristics, regardless of whether or not the copied object is itself a copy.
6. Copying a transformable card will cause the copy to have only the characteristics of the face-up side. This copy will not be able to transform unless it has a valid corresponding side.

#### Static Copying

1. Some objects may enter the field as a copy of another object. If it does, the copied object will act as if it entered as the original card with any On Enter abilities being placed onto the Effects Stack if able. Otherwise, it will copy all other characteristics as point 1 made above.
2. Entering as a copy is not a triggered ability like On Enter.

#### Copying Abilities, Card Activations, and Materializations

1. Copying a card or ability activation, materialization, or triggered ability will cause another instance of that ability or card to be placed onto the Effects Stack with any chosen modes, alternative costs, values of X, or other choices made during activation to be identical to the new copy.
   1. Modes may only be changed if the copy effect gives explicit instructions to do so.
2. Any choices made during resolution may be different between the copy and the original.
3. If there is any property or characteristic of cards or objects associated with the activation, materialization, or triggered ability, that information is also copied. This is true for: Brewed, Imbued, Prepared, and Empowered.

{% hint style="info" %}
E.g., an Imbued action activation that is copied will produce an Imbued copy. However, if an imbued *object* is copied, the new object will not be imbued.
{% endhint %}

4. A copied activation of a card with a field-permanent object type (such as Ally or Item) will cause the copied activation to enter as a token copy of that object with any characteristics matching those of the card in the Effects Stack, including any static modifications made to that activation.
5. A copied activation of a card that does not have a corresponding permanent object type (such as actions) will cease to exist after it resolves, is negated, or fizzles.
