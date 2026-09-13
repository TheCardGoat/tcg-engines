<!-- Source: https://rules.fabtcg.com/en/cr/ (Legend Story Studios, official Flesh and Blood Comprehensive Rules). Retrieved 2026-07-29. Do not edit by hand; re-scrape from source. -->

# 3 Zones

## 3.0 General

3.0.1 A zone is a collection of objects. There are 15 types of zones: arms, arsenal, banished, chest, combat chain, deck, graveyard, hand, head, hero, legs, permanent, pitch, stack, and weapon.

3.0.1a A zone is considered empty when it does not contain any objects and has no permanents equipped to it. An equipment zone is exposed if it is empty. A zone does not cease to exist if it is empty.

3.0.2 Each player has their own arms, arsenal, banished, chest, deck, graveyard, hand, head, hero, legs, and pitch zones; and has two weapon zones. The stack zone, permanent zone, and combat chain zone are shared by all players.

> **Note:** Cards printed before 2023 have used the phrase "zone you control" which refers to a zone that the player owns.

3.0.3 An object can have one of two possible states of visibility: public, or private. A public object is an object where information about the properties of the object is currently available to all players. A private object is an object where the information about the properties of that object is not currently available to all players.

3.0.3a A player may look at any private object they own, or is in a zone that they own, unless the object is in the deck zone.

3.0.4 A public zone is a zone in which the default visibility of objects is public. A private zone is a zone in which the default visibility of objects is private.

3.0.4a The arms, banished, chest, combat chain, graveyard, head, hero, legs, permanent, pitch, stack, and weapon zones are public zones.

3.0.4b The arsenal, deck, and hand zones are private zones.

3.0.4c A public zone may contain a private object, if the object is made private while in that zone, or if the object is moved into that zone as a private object. The private object remains private until a rule or effect makes it public.

3.0.4d A private zone may contain public objects if the object is made public while in that zone, or if the object is moved into that zone as a public object. The public object remains public until a rule or effect makes it private.

3.0.4e If a rule or effect specifies an object in a public zone, the source must be public for the rule or effect to apply unless otherwise stated.

> **Example:** Tome of Torment has the text "You may play this from your banished zone." If a Tome of Torment is private (face-down) in the banished zone, a public zone, its ability would not apply because it does not explicitly state face-down.

3.0.5 The arena is a collection of all the arms, chest, combat chain, head, hero, legs, permanent, and weapon zones.

3.0.5a The arena is not a zone. If an object would be put into the arena by a rule or effect without specifying a zone, it is placed into the permanent zone as a permanent.

3.0.5b The arsenal, banished, deck, graveyard, hand, pitch, and stack zones are not part of the arena.

3.0.6 The layout and representation of zones and objects in those zones are defined by tournament rules.

3.0.7 When an object moves from one zone to another, the object leaving its old zone (origin) and the object entering its new zone (destination) is performed simultaneously. At no point is the object not in a zone.

3.0.7a The object as it leaves the origin is considered the object moving for rules and effects. If the object is private at its origin and would be private at its destination, it is considered to have no properties for effects.

> **Example:** Levia has the text "If a card with 6 or more has been put into your banished zone this turn, …,". If a card is banished and it has 4 as it leaves its origin and 6 when it enters the banished zone, it is considered to have 4 when it moves zones and does not meet the condition of Levia's effect.
>
> **Example:** Levia has the text "If a card with 6 or more has been put into your banished zone this turn, …," If a card with 6 is banished face-down from the player's hand, it was private at the origin and is private at the destination, so it is considered to have no properties when it moves zones and does not meet the condition of Levia's effect.

3.0.7b If the origin and the destination of a move are the same, then no move occurs. If the object would go from public to private during the move, it just becomes private instead. If the object would go from private to public during the move, it just becomes public instead.

> **Example:** Mark of the Beast has the text "If this would be put into your graveyard from anywhere, instead banish it." If Mark of the Beast is banished face-down, and then an effect tries to put it into the graveyard, it will become face-up and remain in the banished zone. It is still considered the same card as before.

3.0.8 If a private object would move zones and be public at the destination, it becomes public before any further replacement effects are applied and it is moved. If a public object will move zones and be private at the destination, it becomes private before any further replacement effects are applied and it is moved.

> **Example:** Azalea's activated ability puts a card from the deck (private object) into the arsenal face-up (public object in a private zone), therefore it becomes public before it is moved.
>
> **Example:** Intimidate puts a card from hand (private object) into the banished zone face down (private object in a public zone), therefore it does not become public before it is moved.

3.0.8a If the destination or visibility of the movement of an object is modified, then the visibility of the object is immediately re-evaluated before any further replacement effects are applied and it is moved.

> **Example:** Drone of Brutality has the text "If this would be put into your graveyard from anywhere, instead put it on the bottom of your deck." If Drone of Brutality is discarded (from the private hand zone to the public graveyard zone), the card first becomes a public object, then the replacement effect replaces the destination to be the deck (a private zone), the card becomes a private object, and finally, the cards are moved to the bottom of the deck.

3.0.9 If an object enters a zone that is not in the arena and is not the stack zone, or a public object becomes private while it is not in the arena, it resets - its previous existence ceases to exist and it becomes a new object with no relation to its previous existence.

> **Example:** Endless Arrow is played and during the reaction step, Snapdragon Scalers is activated to give it "go again." Endless Arrow hits and returns to the player's hand (a zone outside the arena) and therefore becomes a new object. If the player plays Endless Arrow again it will not have "go again" because it is a new Endless Arrow card with no relation to its previous existence.

3.0.9a An ability that triggers when an object moves from one zone to another still references the new object, as long as the object remains a public object.

> **Example:** Merciful Retribution has the text "Whenever an aura or attack action card you control is destroyed, … If it's a non-token Light card, put it into your hero's soul." If a non-token Light card in the arena is destroyed, it moves to the graveyard and becomes a new object. However, because Merciful Retribution triggers on the object moving to the graveyard (as part of its destruction) it still references the new object it becomes in that zone for the triggered-layer it produces. If the non-token Light card moves to another zone or becomes private before the layer resolves, the triggered-layer loses that reference.

3.0.9b An ability with an effect that moves an object from one zone to another still references the new object for the remainder of any effects it generates, as long as the object remains a public object.

> **Example:** Bull's Eye Bracers has the text "If you have no cards in your arsenal, you may put an arrow card from your hand face-up into your arsenal. It gets +1 until end of turn." If an arrow card is put into the arsenal, it becomes a new object. However, because the activated ability of Bull's Eye Bracers was the source of the effect that moved the arrow card, the rest of the effect still references the new object it became in that zone.

3.0.9c The process of how an object becomes a new object is preserved as the history of that new object.

> **Example:** Slithering Shadowpede has the text "If this was banished from your hand this turn, you may play it from your banished zone." If Slithering Shadowpede is banished from hand, it resets and becomes a new object in the banished zone, but the information regarding where it was banished from is preserved, allowing it to be played from the banished zone this turn.

3.0.10 Zones of the same type are independent of their creation method. If a rule or effect creates a zone of the same type as an existing zone, the created zone is not distinguishable as being created by that rule or effect - only that there is now an additional zone of that type.

3.0.10a If a rule or effect moves an object into a specified type of zone, and there are two or more zones that match the specified type, the player that owns the object chooses which zone that object is moved to.

3.0.10b If the zone of a player ceases to exist, and there is only one of that type of zone owned by the player, any cards in that zone are cleared and the zone ceases to exist.

3.0.10c If the zone of a player ceases to exist, and there are two or more of that type of zone owned by the player, an empty zone of that type owned by the player ceases to exist. If there are no zones of that type owned by the player that are empty, the player chooses which zone will cease to exist - any cards in that zone are cleared and the zone ceases to exist.

3.0.11 If a rule would move an object to a zone that does not exist, or the zone cannot contain that object, the object is cleared instead.[[3.0.12]](https://rules.fabtcg.com/en/cr/03-zones/#cr3.0.12) If an effect would move an object to a zone that does not exist, or the zone cannot contain that object, and the object would not cease to exist from another rule or effect, then the move event fails.

> **Example:** Uzuri has the text "… put target attacking card with stealth from the active chain link on the bottom of its owner's deck." If the target attacking card with stealth has the token type, it ceases to exist before it is put on the bottom of the deck.

3.0.12 To clear an object, move it from its current zone to its owner's graveyard.

3.0.12a If the object is a token, macro, or a non-card-layer, it leaves its current zone and simply ceases to exist.

3.0.13 If an effect refers to one or more zones without specifying the owner of those zones (or specifying "any"), it refers to the zones owned by the controller of the effect.

3.0.14 A sub-card is a card that is under a permanent or a card on the stack. A top-card is the card on top, and the sub-card is underneath.

3.0.14a A card is only considered to be under a permanent if specified by a rule or effect.

3.0.14b A sub-card is not considered to be in the arena, even if its top-card is in the arena. If a card becomes a sub-card, it ceases to exist and becomes a new card with no relation to its previous existence.[[3.0.9]](https://rules.fabtcg.com/en/cr/03-zones/#cr3.0.9)

3.0.14c If a top-card moves zones and remains the same object, its sub-cards move to the same zone as part of the same event and remain sub-cards. If a top-card becomes a sub-card of another permanent, all of its sub-cards also become sub-cards of that permanent.

3.0.14d If the top-card is public, all sub-cards are also public. If a top-card is private, all sub-cards are also private.

3.0.14e If a top-card ceases to exist, its sub-cards are cleared as part of the same event.[[3.0.12]](https://rules.fabtcg.com/en/cr/03-zones/#cr3.0.12)

## 3.1 Arena

3.1.1 The arena is a collection of all the arms, chest, combat chain, head, hero, legs, permanent, and weapon zones.

3.1.1a The arsenal, banished, deck, graveyard, hand, pitch, and stack zones are not part of the arena.

3.1.2 The arena is not a zone. If an object would be put into the arena by a rule or effect without specifying a zone, it is placed into the permanent zone as a permanent.

3.1.2a A card is considered to be in the arena if it is in any of the arena zones, and it is not a sub-card under permanent.

## 3.2 Arms

3.2.1 An arms zone is a public equipment zone in the arena, owned by a player.

3.2.2 An arms zone can only contain up to one object which is equipped to that zone.[[8.5.41]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.5.41)

3.2.2a An object can only be equipped to an arms zone if it has subtype arms.

3.2.3 A player may equip an arms card to their arms zone at the start of the game.[[4.1]](https://rules.fabtcg.com/en/cr/04-game-structure/#cr4.1)

## 3.3 Arsenal

3.3.1 An arsenal zone is a private zone outside the arena, owned by a player.

3.3.2 An arsenal zone can only contain up to one of its owner's deck-cards.[[1.3.2c]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.3.2c)

3.3.2a If an effect would put a card into an arsenal zone that is not empty, or into the arsenal and there are no empty arsenal zones, that effect fails.

3.3.3 The term "arsenal" refers to all arsenal zones owned by a player and the cards in those zones.

3.3.3a A player's arsenal is considered empty if all of their arsenal zones are empty.

3.3.3b If a rule or effect would specify a card to move into a player's arsenal, it is moved into one of their empty arsenal zones.

3.3.4 Cards in an arsenal zone may be played.[[5.1]](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/#cr5.1)

## 3.4 Banished

3.4.1 A banished zone is a public zone outside the arena, owned by a player.

3.4.2 A banished zone can only contain its owner's cards.

## 3.5 Chest

3.5.1 A chest zone is a public equipment zone in the arena, owned by a player.

3.5.2 A chest zone can only contain up to one object which is equipped to that zone.[[8.5.41]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.5.41)

3.5.2a An object can only be equipped to a chest zone if it has subtype chest.

3.5.3 A player may equip a chest card to their chest zone at the start of the game.[[4.1]](https://rules.fabtcg.com/en/cr/04-game-structure/#cr4.1)

## 3.6 Combat Chain

3.6.1 The combat chain zone is a public zone in the arena. There is only one combat chain zone, shared by all players, and it does not have an owner.

3.6.2 The combat chain zone can only contain cards and attack-proxies.[[1.4.3]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.4.3)

3.6.3 The term "combat chain" refers to the combat chain zone.

3.6.4 The combat chain is "open" during combat - otherwise it is "closed."[[7]](https://rules.fabtcg.com/en/cr/07-combat/#cr7)

## 3.7 Deck

3.7.1 A deck zone is a private zone outside the arena, owned by a player.

3.7.2 A deck zone can only contain its owner's deck-cards.[[1.3.2c]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.3.2c)

3.7.3 The term "deck" refers to the deck zone.

3.7.4 A player cannot look at objects in their own deck zone unless specified by a rule or effect.

3.7.5 Objects in the deck zone are placed face down in an ordered uniform pile.

3.7.6 A player's starting deck starts the game in their deck zone.[[4.1]](https://rules.fabtcg.com/en/cr/04-game-structure/#cr4.1)

## 3.8 Graveyard

3.8.1 A graveyard zone is a public zone outside the arena, owned by a player.

3.8.2 A graveyard zone can only contain its owner's cards.

3.8.3 The term "graveyard" refers to the graveyard zone.

## 3.9 Hand

3.9.1 A hand zone is a private zone outside the arena, owned by a player.

3.9.2 A hand zone can only contain its owner's deck-cards.[[1.3.2c]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.3.2c)

3.9.3 The term "hand" refers to the hand zone.

## 3.10 Head

3.10.1 A head zone is a public equipment zone in the arena, owned by a player.

3.10.2 A head zone can only contain up to one object which is equipped to that zone.[[8.5.41]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.5.41)

3.10.2a An object can only be equipped to a head zone if it has subtype head.

3.10.3 A player may equip a head card to their head zone at the start of the game.[[4.1]](https://rules.fabtcg.com/en/cr/04-game-structure/#cr4.1)

## 3.11 Hero

3.11.1 A hero zone is a public zone in the arena, owned by a player.

3.11.2 A hero zone can only contain one card, with the type hero, and zero or more cards in the hero's soul.

3.11.3 The term "hero" refers to the card with the type hero in the hero zone.

3.11.4 A player must start the game with their hero card in their hero zone.[[4.1]](https://rules.fabtcg.com/en/cr/04-game-structure/#cr4.1)

3.11.5 A hero's soul refers to the collection of sub-objects under the hero card.[[3.0.14]](https://rules.fabtcg.com/en/cr/03-zones/#cr3.0.14)

## 3.12 Legs

3.12.1 A legs zone is a public equipment zone in the arena, owned by a player.

3.12.2 A legs zone can only contain up to one object which is equipped to that zone.[[8.5.41]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.5.41)

3.12.2a An object can only be equipped to a legs zone if it has subtype legs.

3.12.3 A player may equip a legs card to their legs zone at the start of the game.[[4.1]](https://rules.fabtcg.com/en/cr/04-game-structure/#cr4.1)

## 3.13 Permanent

3.13.1 The permanent zone is a public zone in the arena. There is only one permanent zone, shared by all players, and it does not have an owner.

3.13.2 The permanent zone can only contain permanents.

## 3.14 Pitch

3.14.1 A pitch zone is a public zone outside the arena, owned by a player.

3.14.2 A pitch zone can only contain its owner's deck-cards.[[1.3.2c]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.3.2c)

## 3.15 Stack

3.15.1 The stack zone is a public zone outside the arena. There is only one stack zone, shared by all players, and it does not have an owner.

3.15.2 The term "stack" refers to the stack zone.

3.15.3 The stack contains an ordered collection of layers.[[1.6]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.6)

3.15.4 When a layer is added onto the stack, it becomes layer N+1 where N is the number of existing layers on the stack.

3.15.5 The top layer of the stack is layer N, with the highest value of N.

3.15.6 When a layer N is removed from the stack by a rule or effect, any layer M where M>N becomes layer M-1.

> **Example:** There are 4 layers on the stack. Layer 2 is an instant card and is removed by a "negate" effect. Layer 3 becomes layer 2, and layer 4 becomes layer 3, while layer 1 remains unchanged.

3.15.7 The queue is an extension of the stack zone. It is a collection of attacks waiting to be resolved through combat.

3.15.7a The queue contains an ordered collection of attacks.[[1.4]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.4)

3.15.7b When an attack is added into the queue, it becomes item N+1 where N is the number of existing attacks in the queue.

3.15.7c The next attack of the queue is item 1.

3.15.7d When an item N is removed from the queue by a rule or effect, any layer M where M>N becomes layer M-1.

3.15.7e The stack is empty when there are no layers on the stack. The queue is empty when there are no attacks in the queue.

3.15.7f Attacks in the queue are considered to be on the stack for the purposes of ability functionality[[1.7.4]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.7.4), and determining effect targets[[1.8.5a]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.8.5a) and parameters.[[1.8.6b]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.8.6b)

## 3.16 Weapon

3.16.1 A weapon zone is a public zone in the arena, owned by a player.

3.16.2 A weapon zone can only contain up to one object which is equipped to that zone.[[8.5.41]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.5.41)

3.16.2a An object can only be equipped to a weapon zone if it has the type weapon or the subtype off-hand or quiver. An object with the subtype 2H must be equipped to two weapon zones.[[8.2.2]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.2.2)

3.16.3 A player may equip a weapon card or an off-hand card to their weapon zone at the start of the game.[[4.1]](https://rules.fabtcg.com/en/cr/04-game-structure/#cr4.1)
