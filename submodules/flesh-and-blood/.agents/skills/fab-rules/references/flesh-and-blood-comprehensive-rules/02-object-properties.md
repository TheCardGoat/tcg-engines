<!-- Source: https://rules.fabtcg.com/en/cr/ (Legend Story Studios, official Flesh and Blood Comprehensive Rules). Retrieved 2026-07-29. Do not edit by hand; re-scrape from source. -->

# 2 Object Properties

## 2.0 General

2.0.1 A property is an attribute of an object that defines how the object interacts with the rules and effects of the game. There are 13 properties an object may have: abilities,[[1.7]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.7) color strip, cost, defense, intellect, life, name, pitch, power, subtypes, supertypes, text box, and type.

2.0.1a An ability is a property, not an object. However, activated abilities have the object properties cost and type, for the purposes of rules and effects.

2.0.2 The properties of a card or macro are determined by the true text of the card or macro on [cardvault.fabtcg.com](https://cardvault.fabtcg.com).

2.0.3 A numeric property is a property that has a numeric value. The value of some numeric properties can be modified by effects and/or counters to produce a modified value.

2.0.3a An effect that modifies the value of a numeric property does not modify the base value of that property unless otherwise specified by the effect.

> **Example:** An effect that specifies an object to "gain," "get," "have," or "lose" a property-related value, modifies the value of the property but does not change the base value unless it specifically uses the term "base."

2.0.3b If the base value of a numeric property would be modified by an effect, it is not considered to increase or decrease the value for the purposes of effects that reference gaining or losing respectively. Otherwise, if the non-base value would modified, it is considered to increase or decrease the value.

> **Example:** Korshem, Crossroads of the Elements has the text "…, if … no card controlled by a hero has gained or this turn, destroy this." If a player plays a card and an effect applies to the card that increases its (non-base) , a card controlled by a hero has gained and Korshem will not be destroyed.
>
> **Example:** Big Bully has the text "If you've been booed this turn, this card's base is doubled." If an effect would prevent cards from gaining it would not prevent Big Bully from doubling its base because modification to its base value is not considered gaining .

2.0.3c A numeric property cannot have a negative base or modified value. If one or more effects would set or reduce the base or modified value of a numeric property to be less than zero, instead they set or reduce it to zero.

2.0.3d A +1 or -1 property-related counter on an object, modifies the value of the property but does not change the base value.

2.0.4 An object is considered to have gained a property, or part of a property, if it did not have that property/part before, but currently does. An object is considered to have lost a property, or part of a property, if it had that property/part but currently does not. Gaining or losing a property is not considered to increase or decrease the value for the purposes of effects that reference gaining or losing respectively.

2.0.5 The source of a property is the object of which the property is an attribute.

## 2.1 Color

2.1.1 Color is a visual representation of the color of a card.

2.1.2 The printed color of a card is typically expressed at the top of a card as a color strip.

- A card with a red color strip is considered red.
- A card with a yellow color strip is considered yellow.
- A card with a blue color strip is considered blue.

  2.1.2a The printed pitch of a card is typically associated with the printed color of a card, but they are independent. Cards with a printed pitch of 1, 2, and 3, typically have a color strip of red, yellow, and blue respectively. A card with no printed pitch typically does not have a color strip.

## 2.2 Cost

2.2.1 Cost is a numeric property of a card or ability, which determines the starting resource asset-cost to play the card or activate the ability.[[5.1.6]](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/#cr5.1.6)

2.2.2 The printed cost of a card is typically expressed within a resource point symbol located in the top right corner of the card. The printed cost defines the base cost of a card. If a card does not have a printed cost, it does not have the cost property (0 is a valid printed cost).

2.2.2a If the printed value is expressed as two or more undefined symbols and/or numeric values, they are additive for determining the base cost of a card.

> **Example:** Spark of Genius has the cost property with the printed value of "XX," which determines the base cost as X+X for any value of X.

2.2.3 The printed cost of an activated ability is expressed as symbols as part of the description of the ability, where the number of symbols dictates the printed cost. If there are no resource symbols, then the printed cost is 0. The printed cost defines the base resource cost of the ability.[[5.2.1]](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/#cr5.2.1)

2.2.4 The cost property of an object cannot be modified.

2.2.4a An effect that increases or reduces the cost of an object does not modify the cost property of that object. Effects that modify cost are only applied as part of the process for playing or activating that object.[[5.1.6]](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/#cr5.1.6)

> **Example:** An effect that reduces the cost to play a card does not change the cost property of that card in any way - it only changes the calculation of the resource cost when that card is being played.

2.2.4b An effect that refers to the cost of an object refers to the unmodified cost property of an object. An effect that refers to the payment of an object, refers to the modified cost of an object when it was paid to play/activate and put that object on the stack.

2.2.5 The visual expression in symbols and the numerical expression of cost are functionally identical.

> **Example:** The text "Search your deck for a card with cost value 1," is considered to be the same as the text "Search your deck for a card with cost value ."

## 2.3 Defense

2.3.1 Defense is a numeric property of an object, which represents the value contributed to the total sum of defense used in the damage step of combat.[[7.5]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.5)

2.3.2 The printed defense of a card is typically located at the bottom right corner of a card next to the symbol. The printed defense defines the base defense of a card. If a card does not have a printed defense, it does not have the defense property (0 is a valid printed defense).

2.3.2a If the defense of a card is represented as a (c), then the card has an ability that defines the defense of the card at any point in or out of the game. If the ability requires a number that cannot be determined, the defense of the card is 0.

2.3.3 The defense of an object can be modified. The term "defense" or the symbol refers to the modified defense of an object.

## 2.4 Intellect

2.4.1 Intellect is a numeric property of a hero card, which represents the number of cards the controlling player draws up to at the end of their turn.[[4.4]](https://rules.fabtcg.com/en/cr/04-game-structure/#cr4.4)

2.4.2 The printed intellect of a card is typically located at the bottom left corner of a card next to the symbol. The printed intellect defines the base intellect of a card. If a card does not have a printed intellect, it does not have the intellect property (0 is a valid printed intellect).

2.4.3 The intellect of an object can be modified. The term "intellect" or the symbol refers to the modified intellect of an object.

## 2.5 Life

2.5.1 Life is a numeric property of an object, which represents the starting life total of that object.

2.5.1a A permanent with the life property is a living object.[[1.3.3]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.3.3)

2.5.2 The printed life of a card is typically located at the bottom right corner of a card next to the symbol. The printed life defines the base life of a card. If a card does not have a printed life, it does not have the life property (0 is a valid printed life).

2.5.3 The life of a permanent can be modified. The term "life total" or the symbol refers to the modified life of an object.

2.5.3a A permanent's life total is equal to the permanent's base life, plus life gained and minus life lost, as recorded by the players of the game.

2.5.3b Life gained and life lost are not continuous effects - they are discrete effects that apply once, and they permanently modify the life total.[[8.5.7]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.5.7)

2.5.3c If the base life of an permanent changes, then the life total is recalculated using the new base life value of the object.

> **Example:** Shiyana has 20 base life and the text "… Shiyana becomes a copy of target hero …." If Shiyana has lost 5 life and copies the target hero is Kano, with 15 base life, the new life total for Shiyana is 10.

2.5.3d An permanent's life total can be greater than its base life.

2.5.3e An permanent cannot have a negative life total. If the life total is calculated to be less than zero, instead it is considered zero.

2.5.3f If a permanent's life total is reduced to zero, it is cleared as a game state action; or if the permanent is a hero, their player loses or the game is a draw as a game state action.[[1.10.2]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.10.2)[[4.5]](https://rules.fabtcg.com/en/cr/04-game-structure/#cr4.5)

2.5.3g If a living object ceases to exist, it is considered to have died.

## 2.6 Metatype

2.6.1 Metatypes are a collection of metatype keywords. The metatypes of an object determine whether it may be added to a game.

2.6.2 An object can have zero or more metatypes.

2.6.3 The metatype of a card is determined by its type box. The metatype is printed before the card's supertypes.

2.6.4 The metatypes of an activated-layer or triggered-layer are the same as the metatypes of its source.

2.6.5 An object cannot gain or lose metatypes.

2.6.6 Metatypes are either hero-metatypes or set-metatypes. Hero-metatypes specify the moniker(s) of a hero, and the card can only be included in a player's card-pool if it matches their hero's moniker(s). Set-metatypes specify the the name(s) of the set the object can be used in as defined by tournament rules.

## 2.7 Name

2.7.1 Name is a property of an object, which represents one of its object identities and determines the object's uniqueness (along with the pitch property).[[1.2.2]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.2.2)[[1.3.4]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.3.4)

2.7.2 The printed name of a card is typically located at the top of the card. The printed name defines the name of a card.

2.7.3 If an object has a name that is a personal name, that name determines the object's moniker - the most significant identifier of the object's name. A personal name is typically written in the format "[HONORIFIC?] [MONIKER] [LAST?] [, SUFFIX?]," where HONORIFIC (if any) is one or more name honorifics, MONIKER is the moniker of the name, LAST (if any) is one or more middle and/or last names, and SUFFIX (if any) is a title or nickname written after a comma.

> **Example:** The monikers of these names are as follows: Bravo (Bravo), Dorinthea Ironsong (Dorinthea), Data Doll MKII (Data Doll), Ser Boltyn, Breaker of Dawn (Boltyn), Blasmophet, the Soul Harvester, (Blasmophet), The Librarian (The Librarian), Dawnblade (Dawnblade), Stalagmite, Bastion of Isenloft (Stalagmite).

2.7.3a If an object does not have a name that is a personal name, it does not have a moniker.

2.7.3b If two objects have different names, they may have the same moniker. An effect that refers to an object using a moniker may refer to two or more objects with different names but the same moniker.

> **Example:** The cards "Bravo," "Bravo, Showstopper," and "Bravo, Star of the Show," all have the moniker "Bravo."

2.7.3c A moniker is not considered a name. If an effect identifies an object by a name, it does not identify objects with a moniker that is the same as that name.

> **Example:** If a player is instructed by an effect to name a card and they declare "Dawnblade," the effect identifies cards with the name "Dawnblade," but not cards with the name "Dawnblade, Resplendent" despite them having the moniker "Dawnblade."

2.7.4 An object's printed name is always considered to be the English language version of its name, regardless of the printed language.

2.7.5 A name or part of a name is equal to another name or part of a name only if it is an exact case-insensitive match of each whole word in order.

> **Example:** Censor has the text "When this hits a hero, name a card. They can't play the named card until the end of their next turn." If the named card is "Blazing Aether", the effect would not prevent the player from playing "Trailblazing Aether."
>
> **Example:** Fabricate has the text "Equip a base equipment with Proto in its name from your inventory." Cards named "Breaker Helm Protos" cannot be equipped this way because "Protos" is not a whole word match for "Proto."

## 2.8 Pitch

2.8.1 Pitch is a property of a card, which represents the assets a player gains when they pitch the card. The pitch value of the card is the number of assets gained when pitched and it determines the object's uniqueness (along with the name property).[[1.14.3]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.14.3)[[1.3.4]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.3.4)

2.8.2 The printed pitch of a card is expressed visually as one, two, or three socketed or symbols, typically located in the top left corner of a card, where the types of symbols dictate what asset is generated when pitched and the number of symbols dictates the printed pitch value. The printed pitch value defines the base pitch value of a card. If a card does not have a printed pitch value, it does not have the pitch property.

2.8.3 The pitch of an object can be modified. The term "pitch" refers to the modified pitch value of an object.

2.8.4 The visual expression of or symbols and the numerical expression of pitch are functionally identical.

> **Example:** The text "Search your deck for a card with pitch value 1," is considered to be the same as the text "Search your deck for a card with pitch value ."

## 2.9 Power

2.9.1 Power is a numeric property of an object, which represents the power value used in the damage step of combat.[[7.5]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.5)

2.9.2 The printed power of a card is typically located at the bottom left corner of a card next to the symbol. The printed power defines the base power of a card. If a card does not have a printed power, it does not have the power property (0 is a valid printed power).

2.9.2a If the power value of a card is represented as a (c) then the card has an ability that defines the base power of the card at any point in or out of the game. If the ability requires a number that cannot be determined, the power of the card is 0.

2.9.3 The power of an object can be modified. The term "power" or the symbol refers to the modified power of an object.

## 2.10 Subtypes

2.10.1 Subtypes are a collection of subtype keywords. The functional subtypes of a card determine what additional rules apply to the card.

2.10.2 An object can have zero or more subtypes.

2.10.3 The subtypes of a card are determined by its type box. Subtypes (if any) are printed after a long dash after the card's type.

2.10.4 The subtypes of an activated-layer or triggered-layer are the same as the subtypes of its source.

2.10.5 An object can gain or lose subtypes from rules and/or effects.

2.10.6 Subtypes are either functional or non-functional keywords. Functional subtypes add additional rules to an object.[[8.2]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.2) Non-functional subtypes do not add additional rules to an object.

2.10.6a The functional subtype keywords are (1H), (2H), Affliction, Ally, Arrow, Ash, Attack, Aura, Construct, Figment, Invocation, Item, Landmark, Off-Hand, and Quiver.[[8.2]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.2)

2.10.6b The non-functional subtypes keywords are Angel, Arms, Axe, Base, Book, Bow, Brush, Cannon, Chest, Chi, Claw, Club, Cog, Dagger, Demon, Dragon, Evo, Fiddle, Flail, Gem, Gun, Hammer, Head, Legs, Lute, Mercenary, Orb, Pistol, Pit-Fighter, Polearm, Rock, Scepter, Scroll, Scythe, Shuriken, Song, Staff, Sword, Trap, Wrench, and Young.

## 2.11 Supertypes

2.11.1 Supertypes are a collection of supertype keywords. The supertypes of a card determine whether a card can be included in a player's card-pool.

2.11.2 An object can have zero or more supertypes.

2.11.3 The supertypes of a card are determined by its type box. Supertypes are printed before the card's type (if any).

2.11.4 The supertypes of an activated-layer or triggered-layer are the same as the supertypes of its source.

2.11.5 An object can gain or lose supertypes from rules and/or effects.

2.11.6 Supertypes are non-functional keywords and do not add additional rules to an object. A supertype is either a class or a talent.

2.11.6a The class supertype keywords are Adjudicator, Assassin, Bard, Brute, Guardian, Illusionist, Mechanologist, Merchant, Necromancer, Ninja, Pirate, Ranger, Runeblade, Shapeshifter, Thief, Warrior, and Wizard.

2.11.6b The talent supertype keywords are Chaos, Draconic, Earth, Elemental, Ice, Light, Lightning, Mystic, Revered, Reviled, Royal, and Shadow.

## 2.12 Text Box

2.12.1 The text box of a card contains the card text of a card, typically located on the lower half of a card beneath the illustration.

2.12.2 The card text of a card contains the rules text, reminder text, and flavor text of the card (if any). Rules text is printed in roman and boldface. Reminder text is printed in parenthesized italics. Flavor text is separated vertically from the rules and reminder text (if any) by a horizontal bar and is printed in italics.

2.12.3 The rules text of a card defines the base abilities of the card. A paragraph of rules text typically defines a single ability. Reminder and flavor text do not affect the game.

2.12.3a If the rules text specifies the name and/or moniker of its source object in the third-person it is a self-reference. A self-reference can be interpreted as "this" and it refers to its source object and not other cards with the same name.

2.12.3b If the rules text specifies the name and/or moniker of another object in the context of creating it, it refers to a hypothetical object with defined properties, including that name.[[8.6]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.6) Otherwise, if the rules text specifies the name and/or moniker of another object it refers to any existing object with that name and/or moniker.

## 2.13 Traits

2.13.1 Trait is a property of an object, which represents one of its object identities.[[1.2.2]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.2.2)

2.13.2 The printed traits of a card are typically located at the top of the card, under the card name. The printed traits define the traits of a card.

2.13.3 Traits are non-functional keywords or phrases and do not add additional rules to an object.

2.13.3a The trait keywords and phrases are Agents of Chaos.

2.13.4 If an effect refers to a group of cards by a trait, it refers to all cards with that trait.

> **Example:** Arakni, Web of Deceit has the text "At the beginning of your end phase, if an opponent is marked, you become a random Agent of Chaos." This refers to a group which includes all cards with the Agent of Choas trait, and selecting one at random from that group.

## 2.14 Type Box

2.14.1 The type box of a card determines the card's metatypes, supertypes, types, and subtypes, typically located at the bottom of the card. Type boxes are typically written in the format "[METATYPES] [SUPERTYPES] [TYPE] [--- SUBTYPES]," where METATYPES is zero or more metatypes, SUPERTYPES is zero or more supertypes, TYPE is zero or more types, and SUBTYPES is zero or more subtypes.

2.14.1a If the SUPERTYPES of a type box is "Generic," the card has no supertypes.

2.14.1b Hybrid cards are cards with SUPERTYPES written in the format "[SUPERTYPES-1] / [SUPERTYPES-2]." A hybrid card can be included in a player's card-pool as though it only has one of the supertypes sets, SUPERTYPES-1 or SUPERTYPES-2, not both.[[1.1.3]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.1.3) Otherwise, hybrid cards have all of the supertypes specified by SUPERTYPES-1 and SUPERTYPES-2.

## 2.15 Types

2.15.1 Types are a collection of type keywords. The types of a card determine whether the card is a hero-, token-, deck-, or arena-card, and how a deck-card may be played.

2.15.2 An object can have zero or more types.

2.15.3 The type of a card is determined by its type box. The type is printed after the card's supertypes, and before a long dash and subtypes (if any).

2.15.4 The types of an activated-layer or triggered-layer are the same as the types of its source.

2.15.4a The types of an activated ability layer include the types determined by the activated ability.[[5.2.1]](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/#cr5.2.1)

2.15.5 An object can gain or lose types from rules and/or effects.

2.15.6 Types are functional keywords and add additional rules to an object.[[2.15]](https://rules.fabtcg.com/en/cr/02-object-properties/#cr2.15)

2.15.6a The type keywords are Action, Attack Reaction, Block, Companion, Defense Reaction, Demi-Hero, Equipment, Hero, Instant, Macro, Mentor, Resource, Token, and Weapon.[[8.1]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.1)
