# Flesh and Blood Glossary

Load this file before rules-facing Flesh and Blood work. Use these terms in
player-facing copy, tests, and implementation notes unless the codebase has an
established narrower type name. Each entry is a **condensed** concept definition
covering every term in the official Comprehensive Rules glossary; the verbatim,
authoritative text lives at
`references/flesh-and-blood-comprehensive-rules/glossary.md` (sourced from
rules.fabtcg.com/en/cr/). When exact wording or a citation matters, consult that
file — this reference is for fast context and consistent terminology.

Notation: `{p}` = power, `{d}` = defence, `{r}` = resource, `{h}` = hero life.

## Game Structure

- Game: A single competition of Flesh and Blood between the players, resulting in a win or a draw.
- Match: One or more consecutive games between the same players.
- Player: A person playing the game.
- Turn: A round of play consisting of three phases (Start, Action, End) with one designated turn-player. (As an effect keyword: to flip a card over or make a private card public, or vice versa.)
- Turn-Player: The player whose turn it is; can play actions, becomes the active player after a layer resolves, and chooses player-order for applying replacement effects and adding triggered-layers to the stack.
- Active Player: The player who currently has priority (may play cards and activate abilities).
- Inactive Player: A player who currently does not have priority (cannot play cards or activate abilities).
- Non-Turn Player: A player whose turn it is not.
- Priority: The ability to play cards and activate abilities, held by one player at a time during the action phase.
- Start-of-game Procedure: Setup steps before the game — reveal hero, decide the first turn-player, select equipment and weapons, shuffle and present the deck, and draw the hand.
- Start Phase: First part of a turn; start-of-turn triggered effects resolve here, followed by the Action Phase.
- Action Phase: Second part of a turn; players are given priority to play cards and activate abilities.
- End Phase: Third and final part of a turn; the "beginning of the end phase" event occurs, action and resource points are lost, the turn-player may move a card from hand to arsenal, and draws up to their hero's intellect.
- Action Point: Asset used to pay for playing an action card or activating an action activated ability; only the turn-player can gain them.
- Step: A component of combat in the action phase.
- Arena: Collective term for the Arms, Combat Chain, Chest, Head, Hero, Legs, Permanent, and Weapon zones.
- Zone: A named collection of cards; owned by a player or shared; most have a physical location in the play-space.
- James White: Founder of Legend Story Studios and creator of Flesh and Blood.

## Objects & Card Types

- Card: An entity with properties, represented by an official Flesh and Blood card.
- Type: A property of an object that defines its interactions with rules and effects (how/when it can be played, whether it is a token).
- Subtype: A property of an object that can define interactions with rules and/or effects.
- Supertype: A property; only cards whose supertype set is a subset of the hero's supertypes may be in a registered deck (constructed) or starting deck (limited).
- Class: A category of supertype keywords representing a hero's profession.
- Talent: A category of supertype keywords representing a hero's regional specialties.
- Generic: A placeholder supertype, used in the type box, representing the absence of any supertypes.
- Hero: A card type usable as a player's hero card; occupies the hero zone.
- Weapon: A type of object that can be equipped to a weapon zone. (1H) occupies one weapon zone; (2H) occupies two.
- Equipment: A card type that may start in play in an equipment zone (arms, chest, head, legs) or weapon zone, per subtype, and can be used to defend.
- Companion: A card type that may start in play in an equipment or weapon zone, depending on subtype.
- Action: A type of object or activated ability playable/activatable only as layer 1 of the stack by the turn-player with priority; costs an action point.
- Attack action: An Action card with the Attack subtype; becomes a chain link on the combat chain when it resolves.
- Attack reaction: A card/activated ability playable/activatable only by the player controlling the attack during the reaction step of combat.
- Defense reaction: A card/activated ability playable/activatable only by a player whose hero is being attacked during the reaction step of combat.
- Instant: A type of object playable/activatable as any layer of the stack by the active player; costs no action point.
- Block: A type of card that cannot be played.
- Resource (type): A type of object that cannot be played.
- Mentor: A card type includable only with a young hero. (Also an obsolete ability keyword with the same young-hero restriction.)
- Token (object): A temporary card in the arena, typically created by an effect.
- Macro: A non-card object used as a game-piece for specific formats.

## Subtypes (permanents & equippables)

- Ally: An independent attacker and/or defender during combat; resets its life at end of turn.
- Aura: Becomes a permanent in the arena when it resolves or otherwise enters the arena.
- Item: Becomes a permanent in the arena when it resolves or otherwise enters the arena.
- Landmark: Becomes a permanent in the arena when it resolves or enters, replacing any current landmark.
- Ash: Becomes a permanent in the arena when it resolves or otherwise enters.
- Figment: Becomes a permanent in the arena when it resolves or otherwise enters.
- Construct: Changes the active face of its source and becomes a permanent when it resolves.
- Invocation: Changes the active face of its source and becomes a permanent when it resolves.
- Affliction: Enters the arena under the control of an opponent.
- Arrow: Can only be played from arsenal and only when the player controls a bow.
- Off-Hand: An equipment subtype equippable to a weapon zone; cannot be equipped with another off-hand.
- Quiver: An equipment subtype equippable to a weapon zone, even with a (2H) Bow.
- Perched: Allows a card to be equipped in addition to a (2H) weapon.

## Zones

- Deck: A private zone owned by a player that starts with the cards from the player's starting deck.
- Hand: A private zone owned and held by a player.
- Arsenal: A private zone owned by a player from which cards can be played (holds up to one card).
- Pitch zone: Public zone outside the arena where pitched cards go to generate resource points; pitched cards return to the bottom of the deck at end of turn.
- Graveyard: Public zone owned by a player where resolved, destroyed, and discarded cards go.
- Banished Zone: Public zone where cards that are banished are moved to.
- Combat Chain: Shared public zone open only during combat; facilitates resolution of attacks as chain links.
- Chain Link: A subsection of the combat chain containing the cards and tokens relating to one attack.
- Stack: Zone that facilitates the resolution of layers to generate effects.
- Permanent: Arena zone for resolved auras, items, allies, landmarks, and similar objects.
- Soul: A collection of cards in the hero zone, placed face up underneath the hero card, not considered to be in the arena.
- Hero / Weapon / Arms / Chest / Head / Legs zones: Public zones owned by a player; the hero zone holds up to one hero card; the weapon zone holds up to one weapon, off-hand, or quiver; each equipment zone holds up to one object of its subtype.
- Exposed: A head, chest, arms, or legs zone that is empty.

## Properties

- Property: An attribute of an object that defines how it interacts with rules and effects.
- Base: The original value of a property when the object was created; modifiable by effects that specifically modify base values.
- Color: A property that is red, yellow, or blue, tied to pitch value.
- Cost (property): The number of resources required to play a card or activate an ability.
- Defence ({d}): How much an object reduces attack damage as a defending card.
- Intellect: A hero property for how many cards that player draws up to at the end of the turn.
- Life: A property defining an object's starting life total; objects with life are living objects. A hero at 0 life loses the game.
- Life Total: Maximum life loss that can occur before losing; base life + life gained − life lost.
- Life Loss: A reduction of life total via damage or an effect.
- Name: A property used by specialization and for identifying tokens; name + pitch value determine a card's uniqueness.
- Pitch (property): The number of resource points generated when the card is pitched: red = 1, yellow = 2, blue = 3.
- Power ({p}): A property representing an object's strength as an attack.
- Text Box: A card property that can contain rules text, reminder text, and flavor text.
- Rules Text: Text-box text defining a card's abilities.
- Reminder Text: Text-box text reminding players of a definition or rule.
- Flavor Text: Text-box text adding lore depth/background.
- Type Box: A card property defining its types, supertypes, and subtypes.

## Layers, Abilities & Effects

- Layer: A card, activated-layer, or triggered-layer on the stack waiting to resolve.
- Card-Layer: A card as an unresolved layer on the stack.
- Activated-Layer: A layer object on the stack created by activating an activated ability.
- Triggered-Layer: A layer object (or one to be put onto the stack) created by a triggered effect.
- Attack-Layer: A layer with the attack (with) effect, specifying to attack with a card on resolution.
- Attack-Proxy: An object representing its source as an attack on the stack, in the queue, or on the combat chain.
- Ability: An object property that generates effects; types are activated, resolution, and static.
- Activated Ability: An ability that can be activated to put a layer on the stack, generating effects on resolution.
- Resolution Ability: An ability that generates effects when the card (as a card-layer) resolves on the stack.
- Static Ability: An ability that generates effects without resolving (as) a layer on the stack.
- Meta-Static Ability: A static ability that influences the rules outside the game (e.g. deck construction).
- Play-Static Ability: A static ability that functions when its source is played as a card on the stack.
- Property-Static Ability: A static ability defining its source object's value anywhere in and outside the game.
- Triggered-Static Ability: A static ability that generates a single static-triggered effect.
- Hidden Activated Ability: An activated ability activatable when its source object is private.
- Hidden Triggered Ability: A triggered ability that can be optionally triggered when its source object is private.
- Effect: A phenomenon generated by an ability that changes the game state by producing events or applying changes to objects or the game.
- Discrete Effect: A one-off effect that creates an event modifying the game state.
- Continuous Effect: An ongoing effect modifying the abilities, properties, and/or control of objects, and/or the rules of the game.
- Layer-Continuous Effect: A continuous effect created by the resolution of a layer.
- Static-Continuous Effect: A continuous effect generated by a static ability.
- Dependent Effect: A continuous effect whose outcome depends on a preceding effect in the staging system.
- Replacement Effect: An effect that replaces an event with a modified event, immediately before it occurs.
- Self-Replacement Effect: A replacement effect modifying an effect/event of a preceding effect or leading connected ability.
- Standard-Replacement Effect: A typical replacement effect modifying events that match its condition.
- Identity-Replacement Effect: A replacement effect modifying an object as it enters the arena.
- Prevention Effect: A replacement effect reducing the damage amount of a damage event about to occur.
- Fixed-Prevention Effect: A prevention effect applying a fixed amount per event, with no leftover carryover.
- Shielding-Prevention Effect: A prevention effect applying as much remaining amount as possible per event and carrying over any leftover.
- Triggered Effect: An effect that puts a layer on the stack when an event/state matches its trigger condition.
- Inline-Triggered Effect: A discrete triggered effect that triggers when generated if the condition is met.
- Static-Triggered Effect: A static-continuous triggered effect that typically requires its source in the arena to trigger.
- Delayed-Triggered Effect: A layer-continuous triggered effect that, once generated, does not require its source in the arena to trigger.
- Keyword (meta): Ability Keyword, Effect Keyword, and Label Keyword substitute for rules text; a Token keyword refers to a specific token.

## Identity, Control & Timing

- Owner: Relationship describing which player brought a card, token, or permanent into the game.
- Controller: The player in control of the object or chain link.
- Control: Relationship describing which player may activate an object's abilities, or which player controls a chain link's attack.
- Source: For an ability, the object that has it; for an effect, the source of the ability that generated it (unless otherwise specified).
- Last Known Information: Properties of an object that no longer exists, referenced by a rule or effect.
- Event: A change in game state that may involve performing one or more instructions.
- Multi Event: An event representing an instruction repeated two or more times, splitting into individual events.
- Trigger Condition: A condition of a triggered effect; when met it creates a triggered-layer, and must also be met for the layer to resolve successfully.
- Trigger Event: A game event that meets a triggered effect's condition; once occurred, it need not recur to satisfy the condition for resolution.
- Play: To add a card to the stack, determine its parameters, and then pay its associated costs.
- Pay (act): To perform the actions required by a cost — spending assets such as action points or resource costs, or resolving effects.
- Resolve: effect — create and execute an effect's events; layer — generate effects from, then remove, the top layer of the stack.
- Become / Copy: An effect causing an object's properties to be defined by a specification or another object.
- Counters: A physical marker on an arena object that modifies its properties and/or interacts with effects.
- Clear: A process of moving objects to the graveyard.

## Combat

- Combat: The process of resolving an attack through a series of steps on the combat chain.
- Attack (subtype): A card subtype that initiates combat and becomes a chain link on the combat chain.
- Attack (object identity): A term used by effects to refer to an object involved in attacking during combat.
- Attack (ability / effect / event): A resolution ability marking a layer as an attack-proxy; a discrete effect creating an attack-layer and putting the attack-card/proxy into the queue; and the event that occurs when an attack resolves and the Attack Step begins.
- Defend: Adding an object to a chain link as a defending card.
- Defending: A card on a chain link that contributes defence to the sum compared to the attack's power during the damage step.
- Chain Link Resolution: The resolution of an attack as a chain link during the resolution step of combat.
- Layer Step: First combat step; an attack is unresolved as a layer on the stack. Followed by the Attack Step.
- Attack Step: Combat step after the Layer Step; the attack becomes a chain link on the combat chain. Followed by the Defend Step.
- Defend Step: Combat step after the Attack Step; the defending hero (if any) declares defending cards. Followed by the Reaction Step.
- Reaction Step: Combat step after the Defend Step; the attacker may play attack reactions and instants, the defender (if any) defense reactions and instants. Followed by the Damage Step.
- Damage Step: Combat step after the Reaction Step; the attack's power is compared to the total defence of defending cards and the target is dealt physical damage. Followed by the Resolution Step.
- Resolution Step: Combat step after the Damage Step; the chain link attack resolves, its controller gains an action point if it has "go again", and may play another attack or close the chain.
- Close Step: Combat step after the Resolution Step, or when the chain is closed by a rule/effect; no player has priority and the combat chain closes through a game-state process.
- Damage: An event reducing a subject's life total by a specified amount; types are arcane, physical, and generic.
- Arcane Damage: A specific type of damage, dealt by effects.
- Physical Damage: A specific type of damage, dealt by attacks during the damage step.
- Generic Damage: Untyped damage, dealt by effects.
- Hit: An event that occurs when an attack deals damage to its target during the damage step.

## Resources & Costs

- Cost (concept): The requirement of payment from a player incurred by an ability, card, effect, or rule.
- Resource (point): An asset possessed by a player, used to pay resource costs.
- Pitch (act): Moving a card from the hand into the pitch zone to generate resource points to pay a cost.
- Pitch (effect): To move a card from the hand into the pitch zone to generate resource points, without paying a cost.
- Additional Cost: ability — a meta-static ability that adds a cost to playing a card; phrase — an effect that adds a cost to playing a card.
- Alternative Cost: A meta-static ability that replaces the resource cost of playing a card with a different cost.
- X / Y / Z: A literal placeholder for an undetermined value of an effect.

## Effect Keywords

- Banish: Move a card to the owner's banished zone.
- Create: Bring a token into existence in the arena, or a card into the game.
- Destroy: Move a card to the owner's graveyard.
- Discard: Move a card from a player's hand to their graveyard.
- Draw: Move the top card of the player's deck into their hand.
- Deal: Reduce a subject's life total by a specified amount using a type of damage (arcane, physical, generic).
- Gain: Properties gain a property/part/increase a value (synonym of "gets/has/is"; antonym of "loses"); also to increase a hero/living object's life, or to increase a player's resource assets.
- Lose: Properties lose a property/part/decrease a value (synonym of "gets"; antonym of "gains/has"); also to decrease life or resource assets.
- Put: Move an object into another zone, or create and/or move counters onto an object.
- Remove: Take a counter off an object.
- Distribute: Create and/or allocate counters onto objects.
- Charge: Put a card from the player's hand into their hero's soul.
- Equip: Put an equipment or weapon object into its respective zone, which becomes its equipped zone.
- Retrieve: The player may pay {r} to equip something.
- Search: Look through a zone and select a card matching a specification.
- Look: Gain information of a private card's properties.
- Reveal: Show an object to every player.
- Shuffle: Randomize the order of a collection of cards (typically the deck).
- Opt: Look at the top cards of the deck and put each on the top or bottom in any order.
- Reload: Give the player the option of putting a single card from hand into their arsenal if it is empty.
- Intimidate: Banish a card from a player's hand face down and return it at the end of the turn.
- Freeze: A frozen object cannot be played and its activated abilities cannot be activated; it can be unfrozen.
- Unfreeze: A frozen object is no longer frozen.
- Ignore: Consider an event, or part of an event, to have never happened.
- Negate: Remove a layer from the stack, preventing it from resolving.
- Repeat: Repeat a previous set of effects until a condition or number of repetitions is met.
- Roll / Reroll: Toss a die to generate a random number / toss again and use the new result.
- Name (effect): The player determines a name to be used by another effect.
- Become: See Identity, Control & Timing.
- Mark: Make a hero marked.
- Wager: Give a prize to one player if an attack hits, or another if it doesn't.
- Clash: Reveal and compare the power of each clashing player's deck.
- Amp: Increase arcane damage the next time you would deal it this turn.
- Transcend: Flip the card and put it into the owner's hand.
- Transform: Put the transformed card underneath the permanent it has been transformed into.
- Return to the Brood: A player's hero becomes their base hero.
- Tap / Untap: Change a permanent from untapped to tapped / tapped to untapped.
- Give / Steal: Voluntarily / involuntarily transfer control from one player to another.
- Sharpen: Put a +1{p} counter on a card and remove all +1{p} counters from it at end of turn.
- The Crowd Cheers / The Crowd Boos: Cause the player to be cheered or booed.
- Pay (effect): Perform the act of paying to satisfy an asset-cost.
- Pitch (effect): See Resources & Costs.

## Ability Keywords

- Go again: Gain an action point when the card or ability-layer resolves on the stack, **or when a chain link resolves and combat moves to the Resolution Step**.
- Dominate: The defending hero cannot defend with more than one card from hand.
- Overpower: The defending hero cannot defend with more than one action card.
- Piercing: Increase the source's power when it is defended by equipment.
- Arcane Barrier: Pay resources to prevent arcane damage to your hero.
- Arcane Shelter: Prevent arcane damage to your hero by destroying this card.
- Spellvoid: Prevent arcane damage to your hero by destroying this object.
- Quell: Pay resources to prevent damage to your hero; if you do, destroy this source at the beginning of the end phase.
- Ward: Prevent damage to your hero by destroying this card.
- Spectra: Its source may be targeted by an attack; destroys its source if attacked (may close the combat chain).
- Phantasm: Destroy the source when defended by an attack action card with 6 or more {p} (may close the combat chain).
- Mirage: Destroy its source if it is defending an attack with 6 or more power.
- Fragment: Reduce the attack's {p} by 2 each time a card with 2 or more {d} defends it.
- Battleworn: Equipment accumulates a −1{d} counter after it is used to defend.
- Guardwell: Equipment accumulates −1{d} counters equal to its {d} after it is used to defend.
- Temper: Equipment accumulates a −1{d} counter after defending; destroys it if its defence is zero.
- Blade Break: Destroy this equipment after it is used to defend.
- Blood Debt: At the beginning of your end phase, if this card is in your banished zone, lose 1 life.
- Ephemeral: Remove its source from the game if it would enter the graveyard.
- Legendary: A player may include only one copy of this card in their deck.
- Specialization: Include this card only in decks with a hero that has the same name (or moniker) as the specialization.
- Boost: Optional additional cost of banishing the top card of the deck; if it is a Mechanologist card, the played card gains go again.
- Crank: Remove a steam counter from the card when it enters the arena to gain an action point.
- Fusion: Reveal cards with the specified talent(s) — earth, ice, and/or lightning — for this card to be considered fused.
- Essence: Allows including additional cards in the deck based on talent (earth, ice, and/or lightning).
- Heave: Pay X resources at end of turn to put this card from hand into your arsenal and create X Seismic Surge tokens.
- Channel: Destroy its source unless the controlling player puts the specified cards at the bottom of their deck at end of turn.
- Cloaked: Equip this card face-down instead of face-up.
- Modular: Equip the card to any zone; it takes the subtype of the zone it is equipped to.
- Pairs (with): Cannot equip the card unless the specified card is also equipped.
- Protect: Declare the card as a defending card for another player.
- Ambush: Declare the source as a defending card from arsenal.
- Rune Gate: Play its source from the banished zone without paying its resource cost.
- Scrap: Optional additional cost of banishing an item or equipment from the graveyard.
- Beat Chest: Optional additional cost of discarding a 6{p} card from hand.
- Stealth: Does nothing; effects may refer to objects that have stealth.
- Suspense: Enter the arena with suspense counters, remove one each turn, and leave the arena when none remain.
- Aura of Suspense: An aura with the suspense ability.
- Watery Grave: Turn its source face-down when it moves from the arena to the graveyard.
- Legend of the Watery Grave: A combination of Legendary and Watery Grave.
- Universal: This card gains the class of the hero that owns or controls it.
- Meld: Play both sides of a split-card by paying twice the cost.

## Label Keywords

- Label Keyword: A keyword that groups abilities with common effects.
- Combo (ninja attack actions): Conditional on the last attack of the combat chain.
- Crush (guardian attack actions): Triggers when the attack deals 4 or more damage.
- Reprise (warrior attack reactions): Conditional on the defending hero having defended with a card from hand.
- Contract (assassin): A contract effect plus a triggered effect that triggers when the contract is completed.
- Rupture (draconic): Conditional on being played as/on chain link 4 or higher of the current combat chain.
- Surge (wizard actions): Conditional on the source dealing more than a specified amount of arcane damage.
- Decompose (earth): A play-static ability allowing the player to banish cards for an additional benefit.
- Material: A while-static ability functional when under a permanent.
- Evo Upgrade (mechanologist): Generates effects based on the number of Evos equipped.
- Galvanize (mechanologist): A triggered-static ability that triggers when defending, allowing destruction of an item you control for an additional benefit.
- Tower (guardian actions): Conditional on the card having 13 or more {p}.
- Bond (elemental): Conditional on having pitched the associated card type to play or activate. (Earth Bond / Ice Bond / Lightning Bond.)
- Flow (elemental attacks): Conditional on having played the associated card type this turn. (Earth Flow / Ice Flow / Lightning Flow.)
- Heavy (weapons): Conditional on having only this weapon equipped in the weapon zones.
- Go Fish (arrows): Triggers when the attack hits a hero.
- High Tide (attack actions): Conditional on two or more blue cards being in the pitch zone.
- Quickstrike (lightning runeblade attack actions): Conditional on the source having go again.
- Starfall (lightning wizard attack actions): Conditional on an instant card being put into the controller's graveyard.

## Tokens (index by kind)

Token entries in the official glossary are catalog data; grouped here for lookup.
Each token's official entry states its class/talent and kind.

- Generic aura: Agility, Bloodrot Pox, Confidence, Frailty, Inertia, Might, Ponder, Quicken, Spellbane Aegis, Toughness, Vigor.
- Elemental aura: Embodiment of Earth, Embodiment of Lightning, Frostbite, Lightning Flow.
- Class/talent aura: Bait (ranger), Fealty (draconic), Runechant (runeblade), Seismic Surge (guardian), Sigil of Fate, Soul Shackle (shadow runeblade), Spectral Shield (illusionist), Zen State (ninja).
- Item: Copper, Gold, Goldkiss Rum, Silver (generic); Golden Cog (mechanologist cog).
- Ally: Aether Ashwing (draconic illusionist dragon), Blasmophet (shadow demon), Cintari Sellsword (warrior mercenary), Ursur, the Soul Reaper (shadow demon).
- Weapon: Graphene Chelicera (assassin dagger).
