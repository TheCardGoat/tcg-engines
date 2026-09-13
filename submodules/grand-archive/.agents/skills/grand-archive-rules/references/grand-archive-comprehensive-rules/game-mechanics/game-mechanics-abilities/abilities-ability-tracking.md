# Abilities - Ability Tracking

Some abilities ask players to remember previously selected modes or options for abilities. Abilities tracked in this way depend on the card that creates and instances the ability.&#x20;

#### General Rules:

1. Cards that do not depend on lineages (which are most non-champion objects) can simply have the abilities and modes tracked for itself, either via note-taking or some other method.
2. For champions, ability tracking means that the champion card that creates the corresponding ability will track the selected options, not the champion object itself. This is analogous to an object leaving and re-entering the field with a new instance of that object being created, along with its abilities.

{% hint style="info" %}
E.g., Tonoris, Genesis Aegis says “At the beginning of your recollection phase, choose one that hasn’t been chosen —” followed by a list of options for summoning tokens. If this Tonoris were to be deleted into a level 2 champion and then the player levels back into Tonoris, Genesis Aegis, a new “version” of the champion card is seen as entering play and will re-instance the triggered ability without any memory of which options were previously chosen. This means a re-leveled champion will be able to select “previously selected” options.

![](https://ga-index-public.s3.us-west-2.amazonaws.com/cards/tonoris-genesis-aegis-alc.jpg)<br>
{% endhint %}

3. Abilities that trigger from the Intent zone will follow and apply their effects according to the [last-known information](/game-mechanics/game-mechanics-card-and-object-information.md#last-known-information) of their source, similar to how objects' On Death triggers will apply while their source is in the graveyard.
   1. If the ability references the source card, it may only do so through the immediate change in zone. If it is moved from the zone it was expected to be in for the sake of resolving an effect related to the presence of the source card, it will not function if the card is positioned to another zone.

{% hint style="success" %}
![](/files/0TFpqNTVg4OaWBPIIqS7)&#x20;

E.g., Seafletched Serpent can't be loaded if it is banished from the graveyard after its On Hit ability has triggered but not resolved.
{% endhint %}
