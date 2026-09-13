<!-- Source: https://rules.fabtcg.com/en/cr/ (Legend Story Studios, official Flesh and Blood Comprehensive Rules). Retrieved 2026-07-29. Do not edit by hand; re-scrape from source. -->

# 5 Layers, Cards, & Abilities

## 5.0 General

## 5.1 Playing Cards

5.1.1 To play a card is to move it to the stack as a card-layer.[[1.6.2a]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.6.2a) Only a card's owner can play it unless otherwise specified by a rule or effect. Playing a card involves the following steps in order: Announce, Declare Costs, Declare Modes and Targets, Check Legal Play, Calculate Asset-Costs, Pay Asset-Costs, Calculate Effect-Costs, Pay Effect-Costs, and Play.

5.1.1a A player can only play cards from their hand or arsenal zones unless otherwise specified by a rule or effect.

5.1.2 **Announce** : First, the player proposes the card to be played. The card moves to the stack zone under that player's control and becomes the topmost layer of the stack.

5.1.2a Effects that apply to the next card played are applied if the card matches the effect description. Effects that are dependent on any undetermined parameters of the card are applied when those parameters are declared.

> **Example:** There are three continuous effects active: "The next attack action card you play gains +3," "Action cards cost less to play," and "Attack action cards you control have +3." When an attack action card is proposed to be played and is moved to the stack under the player's control, all three effects begin to apply immediately.
>
> **Example:** Goliath Gauntlet has the text "The next attack action card with cost 2 or greater you play this turn gets +2." If you play an attack action card with a cost of X, at the time you declare the value of X to be 2 or more, Goliath Gauntlet's effect will apply. If you declare X to be 0 or 1, Goliath Gauntlet will not apply.
>
> **Example:** Become the Cup has the text "As you play this, choose a color. This gets the chosen color." When Become the Cup is announced, the effect is applied - the player declares a color and the card gets the chosen color.

5.1.2b A card may only be announced to be played if a rule or existing effect allows it to be played.

> **Example:** Tome of Torment has the text "You may play this from your banished zone." which is a play-static ability that when functional, allows it to be played from the banished zone. If Tome of Torment is private (face-down) in the banished zone, its play-static ability is not functional and therefore it cannot be announced to be played.

5.1.2c If the card is a split-card, the player declares which side the split-card will be played with.[[9.2.3]](https://rules.fabtcg.com/en/cr/09-additional-rules/#cr9.2.3) If the split-card has meld[[8.3.38]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.3.38) the player may declare that the card is played with both sides. The declared side(s) determines the card's properties when put onto the stack and any subsequent effects applied to it.

> **Example:** A player may play Null||Shock by declaring one of its sides (Null or Shock), or by declaring both sides using meld. Doing so determines the name, types, and abilities of the card on the stack until it ceases to exist.

5.1.3 **Declare Method and Costs** : Second, the player declares the method in which the card is being played and the parameters for any costs to play the card.

5.1.3a If the card has a variable cost that includes X, the player must declare the value of X.[[1.12.2]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.12.2) If the player uses an effect to play the card without paying the cost that includes X, then the player must declare X as 0.

5.1.3b If the card has additional costs that are optional, the player must declare all additional costs that will be paid.

5.1.3c If the card has an alternative cost or an effect that allows the player to play the card without paying the cost, the player must declare if the alternative cost will be paid or the effect will be used. If a card has two or more alternative costs and/or effects that allow the player to play the card without paying the cost, the player may only declare one (if any) of these.

5.1.3d If the card may be played through the use of two or more rules and/or effects, the player must declare which of one these rules or effects is being used to play the card. Effects that are not declared this way are considered not to have been used to play the card.

> **Example:** Astral Etchings "If you control a Spectral Shield, you may play this as though it were an instant." If a player controls a Spectral Shield and plays Astral Etchings, they declare whether or not Astral Etchings is being played as an instant.
>
> **Example:** Blasmophet, Levia Consumed has the text "Once each turn, you may play a card with blood debt from your banished zone." If a player plays a card with blood debt from their banished zone without using Blasmophet, Levia Consumed's effect, then they may still use that effect to play a different card with blood debt from their banished zone that turn.

5.1.3e If there are two or more effect-costs to be paid, the player declares the order those costs will be paid.

5.1.4 **Declare Modes and Targets** : Third, the player declares the parameters of all resolution abilities.

5.1.4a If the card has any modal resolution abilities, the player must declare the modes for those abilities.[[1.7.5]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.7.5) Then, if any resolution abilities generate effects that require a target, the player must declare all legal targets for those effects.[[1.8.5]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.8.5)

5.1.4b If the card is an attack, the player must declare the target(s) of the attack.[[1.4.5]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.4.5)

5.1.5 **Check Legal Play** : Fourth, the card is evaluated if it is legal to play before any costs are paid. If a rule or effect prevents the card from being played, or the parameters of the proposed card are illegal, the card is illegal to play and the game state is reversed to before the card was announced.[[1.10.3]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.10.3)

5.1.6 **Calculate Asset-Costs** : Fifth, all asset-costs of the proposed card are calculated.[[1.13]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.13)

5.1.6a First, rules define the starting asset-cost. Second, effects that set an asset-cost are applied. Third, effects that increase an asset-cost are applied. Fourth and finally, effects that reduce an asset-cost are applied - if an effect would reduce an asset-cost to be less than zero, it instead reduces it to zero. If two or more effects are applied at each step, then they are applied in timestamp order.[[6.3.4]](https://rules.fabtcg.com/en/cr/06-effects/#cr6.3.4)

5.1.6b The action asset-cost starts at zero. If the card has the type action and is not played as an instant, the action cost starts at one instead.

5.1.6c The resource asset-cost starts at the base resource cost of a card being played. If an alternative cost is declared that replaces the resource asset-cost for playing the card, then the resource asset-cost starts at zero instead.

5.1.7 **Pay Asset-Costs** : Sixth, the player pays all asset-costs (if any).[[1.14.2]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.14.2)

5.1.7a If any asset-cost is not paid in full, the card is illegal to play and the game state is reversed to before the card is announced.[[1.10.3]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.10.3)

5.1.8 **Calculate Effect-Costs** : Seventh, all effect-costs of the proposed cards are calculated.

5.1.8a If any effect-cost cannot be paid, based on the order declared by the player, the card is illegal to play and the game state is reversed to before the card was announced.[[1.10.3]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.10.3)

5.1.9 **Pay Effect-Costs** : Eighth, the player pays all effect-costs.

5.1.9a If a replacement effect modifies an effect-cost, and that cost cannot be paid (the effect does not resolve successfully), the card can still be played.

5.1.10 **Play** : Ninth and finally, the card is now considered played and the player regains priority.

## 5.2 Activated Abilities

5.2.1 An activated ability is an ability that can be activated to put an activated-layer on the stack. Activated abilities are always written in the format "[LIMIT?] [TYPE] -- [COST]: [ABILITIES] [CONDITION?]."

5.2.1a The LIMIT (if any) is written at the start of the ability and specifies the maximum number of times the ability can be activated. If there is no limit, the ability can be activated any number of times.

5.2.1b The TYPE is written directly before the dash and specifies the type of the ability and the type of the activated-layer created by activating the ability.

5.2.1c The COST is written between the dash and colon. It specifies the cost to be paid to activate the ability. Costs may be a combination of asset- and effect-costs. A cost of "0" specifies there a zero resource cost to activate the ability. Costs following an "or" are alternative costs.

5.2.1d The ABILITIES are written after the colon and specify the base abilities of the activated-layer. When the activated-layer resolves, the resolution abilities of the layer generate effects.

5.2.1e The CONDITION (if any) is typically written at the end of the ability and specifies the activation condition. If the activated ability has an activation condition and that condition is not met, the ability cannot be activated.

5.2.2 To activate an activated ability is to create an activated-layer on the stack. A player can only activate an activated ability if they have priority, the ability is functional,[[1.7.4]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.7.4) and the player controls its source (or owns its source if there is no controller), unless otherwise specified by a rule or effect. Activating an activated ability involves the following:

5.2.2a Announce the activated ability to be activated. The activated-layer is created in the stack zone under that player's control and becomes the topmost layer of the stack. The activated-layer is created with the same supertypes and types as the source of the activated ability. Continuous effects begin to apply to the ability layer.

5.2.2b The remainder of the process for activating an activated ability is identical to the process for playing a card listed in steps [[5.1.3]](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/#cr5.1.3)-[[5.1.10]](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/#cr5.1.10), substituting "play" for 'activate`, and "card" for "ability."

5.2.3 If an effect allows an ability to be activated additional times, that activated ability may be activated to exceed its LIMIT by the specified amount of times.

5.2.3a If an effect allows all abilities on an object to be activated additional times and the object has two or more activated abilities, each activated ability of that object can be activated additional times.

> **Example:** Snap Shot has the text "… you may activate abilities of bows you control an additional time this turn and as though they were an instant," which allows each individual activated ability on bows the player controls to be activated an additional time.

5.2.3b If an effect allows an object to be activated additional times and the object has two or more activated abilities, the effect applies at the time the ability is activated beyond its LIMIT. The total number of additional activations may be spread across all activated abilities on the object.

> **Example:** Tri-shot has the text "You may activate target bow you control 2 additional times this turn," which allows the activated abilities on the target bow to be activated a combined total of 2 additional times.

5.2.3c If an effect allows a source to attack additional times or a set number of times, it refers to activating an ability on the source with the attack ability.[[8.3.1]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.3.1)

> **Example:** Twinning Blade has the text "You may attack an additional time with target sword this turn," which allows the player to activate an activated ability (with the attack ability) on the target sword an additional time past its LIMIT.
>
> **Example:** Flurry has the text "… you may attack with the weapon twice this turn," which allows the player to activate an activated ability (with the attack ability) on the target sword up to two times.

5.2.3d Effects that allow the additional activation of an activated ability are additive. If an effect would allow to two or more activated abilities to be activated beyond its LIMIT, the total number of additional activations is shared between those abilities. If two or more effects would allow an activated ability to be activated beyond its LIMIT, the player chooses which of those effects apply to the activation.

> **Example:** Tri-shot has the text "You may activate target bow you control 2 additional times this turn." Barbed Castaway is a bow with two activated abilities with a per turn activation limit of 1. Using Tri-shot's effect, The player may activate either ability twice, or one ability thrice and the other once.

5.2.3e Effects that state how many times an ability can be activated in total, set the LIMIT of the activated ability. If the effect would set the LIMIT of two or more abilities, it sets a shared LIMIT of those abilities. A LIMIT set by an effect can be surpassed by effects that allow an ability to be activated additional times.

> **Example:** Blood on Her Hands has the text "… Target 1H weapon may attack twice this turn," which is an effect that sets the total number of times an activated ability (with the attack effect) can be activated on the target to two. If this effect is applied two or more times, the activated ability (with the attack effect) can still only be activated twice.

5.2.4 If an activated ability's cost can only be paid when the source is private, or if its activation condition specifies the privacy status and/or zone of its source, the ability is functional when the source meets that requirement.

5.2.4a If an activated ability is functional, but its source has no controller, then the owner may activate the ability instead.

> **Example:** Vigorous Windup has the text "Instant -- Discard this: Create a Vigor token." This ability is functional while the card is in its owner's hand. The owner may activate the ability despite not controlling the source.

5.2.4b If a player activates an ability of a private source, the source of the ability becomes public until either the activated-layer resolves or ceases to exist, or the source ceases to exist. When an object becomes public this way, it does not trigger any abilities and cannot be replaced by any replacement effects.

## 5.3 Resolution Abilities & Resolving Layers

5.3.1 A resolution ability is an ability that generates effects when its source resolves as a layer on the stack. If the stack is not empty and all players pass in succession, the top layer of the stack resolves, except for attacks. When a layer resolves it does so in the following order: Check resolution, Static effects, Layer effects, Go again, Leave stack, Clear.

5.3.1a If the top layer of the stack is an attack[[1.4]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.4) and players pass in succession, instead the attack is moved from the stack to the queue to be resolved through combat. [[7]](https://rules.fabtcg.com/en/cr/07-combat/#cr7)

5.3.2 **Check resolution** : First, whether the layer fails to resolve is evaluated. If a layer fails to resolve, the resolution stops, the layer is cleared from the stack, and the turn-player gains priority. A layer fails to resolve in the following situations:

5.3.2a If the layer is a triggered-layer created by a triggered effect with a state-trigger condition, the state-trigger condition must be met by the current game state - otherwise, the layer fails to resolve.

> **Example:** An attack with phantasm is defended by an attack action card with 6. Before the phantasm triggered-layer effect resolves, the attacking hero plays Blinding Beam, giving the defending card -2. When the phantasm triggered-layer resolves, the game state condition that caused phantasm to trigger is no longer true, therefore the phantasm triggered-layer fails to resolve and does not generate any effects.

5.3.2b If the layer is a defense reaction card and it cannot become a defending card on the current chain link, the layer fails to resolve.

5.3.3 **Static effects** : Second, static abilities of the layer become functional.[[1.7.4]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.7.4)

5.3.4 **Layer effects** : Third, each of the resolution abilities of the layer generates its effects in the order specified (except go again).

5.3.4a If the parameters of any effect are undetermined, those parameters are determined before the effect is generated.[[1.8.6]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.8.6)

5.3.4b If an effect fails, any remaining effects continue to be generated.[[1.8.9]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.8.9)

5.3.4c If the layer no longer exists after the generation of an effect, the last known information of the layer is used to determine the remainder of the resolution abilities and the effects that are generated.[[1.2.3]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.2.3)

5.3.4d If the layer is melded[[8.3.38]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.3.38) and it is its first time being resolved, only the right-side resolution abilities generate their effects, then resolution stops and the turn-player gains priority; if it is the second time is being resolved, only the left-side resolution abilities generate their effects, then resolution continues.

5.3.5 **Go again** : Fourth, if the layer has go again, the controlling player gains 1 action point.[[8.3.5]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.3.5)

5.3.5a If the layer no longer exists, the last known information of the layer is used to determine whether the layer had go again.[[1.2.3]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.2.3)

5.3.6 **Leave stack** : Fifth, if a rule or effect would cause the layer to leave the stack, it does so.

5.3.6a A card-layer that becomes a permanent is moved to the arena.[[8.2.4]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.2.4)[[8.2.13]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.2.13)[[8.2.5]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.2.5)[[8.2.9]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.2.9)

5.3.6b A card-layer with the type defense reaction becomes a defending card active chain link.[[8.1.3]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.1.3)

5.3.7 **Clear** : Sixth and finally, if the layer is still on the stack, it is cleared,[[3.0.12]](https://rules.fabtcg.com/en/cr/03-zones/#cr3.0.12) then the turn-player gains priority.

## 5.4 Static Abilities

5.4.1 A static ability is an ability that generates effects without resolving a layer on the stack. Static abilities are written as statements.

5.4.2 Static abilities that are functional generate static continuous effects.[[6.2.3]](https://rules.fabtcg.com/en/cr/06-effects/#cr6.2.3)

5.4.3 A meta-static ability is a static ability that generates effects that apply to the rules outside of the game.

5.4.3a If a meta-static ability that modifies rules outside the game ceases to exist during a game, it does not affect the legality of the rules followed outside the game.

> **Example:** Shiyana, Diamond Gemini has the text "You may have specialization cards of any hero in your deck." If the player controlling Shiyana has specialization cards in their card-pool, and Shiyana lost this meta static ability during a game, having specialization cards in the card-pool is still legal.

5.4.4 A play-static ability is a static ability that generates effects that apply to the playing of its source card.

5.4.4a An additional-cost ability is a play-static ability that adds one or more asset-costs and/or effect-costs to play the source card. Additional-cost abilities are typically written in the format "As an additional cost to play this [COST]," where COST is the additional cost to be paid. An additional-cost ability is optional if the COST of the ability uses the term "may" and must be declared when playing a card.[[5.1.3]](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/#cr5.1.3)

5.4.4b An alternative-cost ability is a play-static ability that replaces one or more asset-costs and/or effect-costs to play the source card. Alternative-cost abilities are typically written in the format "You may [COST] rather than pay this's [BASE]," where COST is the alternative cost to be paid instead of the cards BASE asset-costs and/or effect-costs. Alternative-cost abilities are optional and must be declared when playing a card.[[5.1.3]](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/#cr5.1.3) An alternative cost has no effect on any additional costs that must be paid or modifications to the asset-cost.

5.4.4c If a play-static ability generates a triggered effect that references the playing of its source, the effect triggers immediately if the trigger condition is met. Triggered effects of play-static abilities are typically written in the format "[EFFECT]. When you do, [ABILITIES]," where the trigger condition is playing the card using the preceding effect of the play-static ability.[[5.5]](https://rules.fabtcg.com/en/trp/05-gameplay-logistics/#trp5.5)

> **Note:** Cards printed before 2022 have also used the format "[COST]. If you do, [ABILITIES]," where ABILITIES generate one or more discrete effects.

5.4.4d If a play-static ability generates a conditional continuous effect that references the playing of its source, the effect is generated at the time the condition is met. Conditional continuous effects of play-static abilities are typically written in the format "[EFFECT]. If you do, [CONTINUOUSEFFECT]," where the replacement condition is playing the card using the proceeding effect of the play-static ability.

5.4.5 A property-static ability is a static ability that defines the property, or value of a property, on an object that would normally be found elsewhere on that object.

> **Example:** Mutated Mass has the text "This card's and are equal to twice the number of cards in your pitch zone with different costs," which is a property-static ability that defines the power and defense of the card, otherwise printed on the card with (c).

5.4.5a Property-static abilities function anywhere in and outside the game.

5.4.6 A triggered-static ability is a static ability that generates a single triggered effect.[[5.5]](https://rules.fabtcg.com/en/trp/05-gameplay-logistics/#trp5.5)

5.4.6a If the source of a triggered-static ability ceases to exist from an event that would trigger its effect, and the ability was functional immediately before the event occurs, then the triggered effect is triggered.

> **Example:** Merciful Retribution has the text "Whenever an aura or attack action card you control is destroyed, deal 1 arcane damage to target hero." If Merciful Retribution is in the arena under the control of a player and is destroyed, its triggered effect will trigger, because the destruction event of Merciful Retribution is also the condition of the effect.

5.4.7 A while-static ability is a static ability with a condition that makes it functional under specified circumstances. While-conditional abilities are written in the format "While [CONDITION], [ABILITY]" or "If [CONDITION], while [CONDITION], [ABILITY]," where the ABILITY is the static ability that is functional whenever the CONDITION is met.

> **Example:** Yinti Yanti has the text "While this is defending and you control an aura, it gets +1," which is a while-static ability that is functional when it is a non-permanent defending card because it has a while-condition that is met when the card is defending.

5.4.7a A while-static ability is functional when its while-condition is met and when its source is public, when its source is private if the while-condition explicitly specifies it, or when its source is private and the while-condition specifies it functions in that private zone. Otherwise, a while-static ability is not functional.

> **Example:** Heave is a while-static ability that means "While this is in your hand, …," where the while condition specifies the source being in a zone that is private by default. This means that Heave is functional when its source is private in the player's hand.
>
> **Example:** Blood Debt is a while-static ability that means "While this is in your banished zone, …," where the while-condition specifies the source being in a zone that is public by default. This means that Blood Debt is not functional when its source is private in the player's banished zone.

5.4.7b A hidden triggered ability is both a while-static ability and triggered-static ability, where the while-condition specifies that the source is private or in a private zone. If the triggered condition is met while the ability is functional and the source is private, the owner may decide to trigger the effect. If they do, the source of the ability becomes public and the triggered effect produces a triggered-layer to be added to the stack. The source remains public until the triggered-layer resolves or otherwise ceases to exist, and then it returns to being private.

> **Example:** The Librarian has the text "While The Librarian is face down in arsenal, at the start of your turn, you may turn him face up," which is a hidden triggered ability that is functional when The Librarian is face down in arsenal and the start of turn event occurs. The player decides to trigger the effect, The Librarian becomes public, and when its triggered-layer resolves it is officially turned face up in the arsenal.
