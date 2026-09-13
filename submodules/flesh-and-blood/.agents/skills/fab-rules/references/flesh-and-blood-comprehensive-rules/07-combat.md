<!-- Source: https://rules.fabtcg.com/en/cr/ (Legend Story Studios, official Flesh and Blood Comprehensive Rules). Retrieved 2026-07-29. Do not edit by hand; re-scrape from source. -->

# 7 Combat

## 7.0 General

7.0.1 Combat is a game state where the combat chain is open and attacks undergo resolution in steps on the stack and combat chain. The resolution of a chain link consists of seven steps in order: Layer, Attack, Defend, Reaction, Damage, and Resolution.

7.0.1a During combat, while the combat chain is open, a player cannot play cards or activate activated abilities with the type action, except for attacks and attack-layers during the Resolution Step of combat.[[7.6]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.6) An action card/ability can still be played/activated as an instant during any step of combat when a player has priority.

7.0.2 The combat chain is a zone[[3.6]](https://rules.fabtcg.com/en/cr/03-zones/#cr3.6) that is open during combat and closed otherwise. It comprises chain links when it is open, and is empty when it is closed.

7.0.2a The combat chain starts the game closed. If the combat chain is closed and an attack or attack-layer is added to the stack, the combat chain opens and the Layer Step begins immediately. The combat chain remains open until it is closed again.[[7.7.2]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.7.2)

7.0.2b When referring to combat chain as a time, the combat chain starts when it opens and ends when closes. If an effect states "this combat chain" it refers to the current combat chain if it is open - if the combat chain is closed the effect fails to be generated.

7.0.3 A chain link is an element of the combat chain and represents the resolution of an attack. A chain link is neither an object nor a zone. A chain link comprises an active-attack, an attack-source (if any), and any number of defending cards.

7.0.3a A chain link is created when an attack is added to the combat chain as a chain link.[[7.2.2]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.2.2) The attack becomes the active-attack of chain link N+1, where N is the number of existing chain links on the combat chain.

7.0.3b The active chain link is the most recent chain link of the combat chain to be resolved. When a chain link is created during the Attack Step it remains the active chain link until it resolves[[7.6.2]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.6.2) or the combat chain closes.

7.0.3c When referring to a chain link as a collection, the properties, control, and ownership of a chain link are considered to be the same as the active-attack of that chain link. If the active-attack of a chain link ceases to exist, last known information about the active-attack is used to determine the properties, control, and ownership.[[1.2.3]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.2.3)

> **Example:** Double Strike has the text "When this chain link resolves, banish this." Even if the Double Strike ceases to exist, the chain link remains, and is considered a Ninja chain link controlled by the attacking hero.

7.0.3d If an effect states to "this chain link" it refers to the chain link that the source is on, or the active chain link if the source is not on the combat chain. As a time or duration, a chain link starts when it becomes the active chain link and ends when it is no longer the active chain link or the combat chain closes. As a location, the chain link is the respective collection of objects on the combat chain. If there is no active chain link (during the Layer or Resolution Step, or when the combat chain is closed) the effect fails to be generated.

> **Example:** Flittering Charge has the text "If you've played an instant card this chain link, this gets go again." which refers to the chain link that Flittering Charge is on and refers to it as a time. The condition is met when an instant card is played during the Attack Step to the Damage Step while Flittering Charge is on the active chain link.

7.0.3e If there is an active chain link, any layer that is played/activated/triggered is considered to be played/activated/triggered on the active chain link for rules and effects.[[7.0.3b]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.0.3b)

7.0.3f To put a card on a chain link, that card moves to the combat chain and is associated with that chain link until it leaves the combat chain. Cards on a chain link are considered to be on the combat chain and in the arena.

7.0.4 An active-attack, is an attack that has been put onto the combat chain as a chain link[[1.4]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.4)[[7.0.3a]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.0.3a).

7.0.4a If a card is put onto a chain link as an attacking card, the existing active-attack (if any) is cleared, and the new card becomes the active-attack for that chain link. It is considered a new attack, but the attack target(s) remain the same.

> **Example:** Uzuri has the text "… put target attacking card with stealth from the active chain link on the bottom of its owner's deck, then put the banished card onto the active chain link as the attacking card." The card with stealth is essentially replaced by the banished card as the attack on the chain link. The banished card is considered a new attack for rules and effects, except that the target of the attack stays the same.

7.0.5 A defending card is a card that is designated as defending on a chain link for an attack-target by a rule or effect.[[7.3.2]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.3.2)[[7.4.2d]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.4.2d)[[8.5.32]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.5.32)

7.0.5a To be added as a defending card, the card is put on the respective chain link. The card is considered to be defending until it leaves the combat chain. Then the "defend" event occurs and effects that trigger from defending are triggered. The controller of the card at the time it defends is considered to have defended with that card.

> **Example:** Surging Militia has the text "This gets +1 for each non-equipment card defending it." and Inertia Trap has the text "When this defends an attack with greater than its base, …" When Inertia Trap becomes a defending card against Surging Militia, the Surging Militia will gain +1 before the defend event occurs, and thus Inertia Trap will trigger.

7.0.5b If an effect would add a card on a chain link as a defending card, but the card is already defending on that chain link or the card cannot become a defending card due to another effect, the effect fails, no defend event occurs, and the card does not move zones.

> **Example:** Amulet of Havencall has the text "Defense Reaction -- Destroy this: Search your deck for a Rally the Rearguard, add it to this chain link as a defending card, then shuffle." If Rally the Rearguard cannot be added as a defending card, it remains in the deck and the deck is shuffled.
>
> **Example:** Quickdodge Flexors has the text "Defense Reaction -- : Add this to the active chain link as a defending card. It has 2 base this chain link." If Quickdodge Flexors is already defending card on the active chain link, then its ability is activated, it will remain a defending card on that chain link, no defend event will occur, but its base will still be set to 2.

7.0.5c A defending card is considered to be defending against the active-attack on the chain link. If the active-attack ceases to exist, last known information about the active-attack is used to determine the properties, control, and ownership of the attack.[[1.2.3]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.2.3)

7.0.5d A card can only defend on one chain link for one attack-target at a time. If there are multiple attack-targets and an effect adds a defending card to a chain link but does not specify which attack-target it defends for, the controller of the effect determines which attack-target it will defend for.

7.0.5e If exactly one card is put onto a chain link as a defending card it is considered to defend alone. If two or more cards are put onto a chain link as defending cards in the same event, they are considered to defend together.

> **Example:** If a player declares two cards during the defend step of combat, those cards are considered to defend together. Then, if the player plays and resolves a defense reaction, that card is considered to defend alone because it is just one card being added as a defending card - despite there already being defending cards on the chain link.

## 7.1 Layer Step

7.1.1 The Layer Step is a game state where an attack is unresolved as a layer on the stack and there are no attacks in the queue.

7.1.2 First, the turn-player gains priority.

7.1.2a When the top layer of the stack is an attack and all players pass in succession, the attack is put into the attack queue.[[5.3.1a]](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/#cr5.3.1a)

7.1.3 Second and finally, when the stack is empty the Layer Step ends. If there's an attack in the queue, the Attack Step begins. Otherwise, the combat chain closes.

## 7.2 Attack Step

7.2.1 The Attack Step is a game state where an attack is put on the combat chain as a chain link and becomes attacking before any defending cards are declared.

7.2.2 First, the next attack moves from the queue onto the combat chain as a chain link.[[7.0.3]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.0.3) Attacking objects on a chain link remain attacking until they leave the combat chain.

> **Note** : Attacks with resolution abilities that generate discrete effects printed before 2021 have received an errata that corrects them to be triggered effects that trigger when the attack becomes attacking.

7.2.2a If the attack is an attack-card, it moves onto the combat chain as a chain link. The attack-card is the active-attack and becomes attacking.

> **Example:** Head Jab is an attack action card. After the Head Jab resolves, it moves as an attack-card onto the combat chain as a chain link, and it is considered the active-attack.

7.2.2b If the attack is an attack-proxy, the attack and its attack-source move onto the combat chain as the chain link. The attack-proxy is the active-attack and the attack-source becomes attacking. If the attack-source was on a previous chain link, the attack-proxy on that chain link ceases to exist.[[1.4.3c]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.4.3c)

> **Example:** Bone Basher is a one-handed weapon with an attack activated ability. After an attack-proxy of Bone Basher resolves, the attack-proxy and Bone Basher move onto the combat chain as a chain link, and the attack-proxy is considered the active-attack.

7.2.2c If (A) the active-attack or attack-source cannot move to the combat chain as a chain link, (B) the active-attack or attack-source cannot become attacking, or (C) the attack does not have any legal attack-targets[[1.4.5]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.4.5), instead the attack is cleared from the queue. If there is another attack in the queue, the Attack Step begins again with that attack, otherwise the Close Step begins.[[7.7]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.7)

> **Example:** Spectra is a keyword that means "This can be attacked" and "When this becomes the target of an attack, destroy this." If a permanent with Spectra is the only target of an attack, it ceases to exist before the Attack Step and is no longer a legal attack-target, so the attack is cleared from the queue. If there are no other attacks in the queue, the combat chain closes.
>
> **Example:** Kabuto of Imperial Authority has the text "opponents can't attack with weapons." If the attack is a weapon attack-proxy, its attack-source (the weapon) cannot become attacking, so the attack-proxy is cleared from the queue. If there are no other attacks in the queue, the combat chain closes.

7.2.3 Third, the "attack" event occurs and effects that trigger from attacking are triggered.

> **Example:** The attack is Dread Triptych. The abilities "When this attacks, if you've played a non-attack action card this turn, create a Runechant token." and "When this attacks, if you've dealt arcane damage this turn, create a Runechant token." trigger and are added as separate triggered-layers on the stack.

7.2.3a The controller of the active-attack and their hero become the "attacking hero" until the active chain link resolves or the combat chain closes. If an effect of a source on the chain link refers to the attacking hero, it refers to that hero until the combat chain closes.

7.2.3b The controller of the attack-target and their hero become the "defending hero" until the active chain link resolves or the combat chain closes. If an effect of a source on the chain link refers to the defending hero, it refers to that hero until the combat chain closes.

> **Example:** Exude Confidence has the text "If this isn't defended by a card with greater or equal , the defending hero can't play or activate instants and defense reactions," which is an effect that refers to the defending hero of the chain link where Exude Confidence the active-attack. If the next attack has a different attack-target, Exude Confidence's effect will still refer to that hero.

7.2.4 Fourth, the turn-player gains priority.

7.2.5 Fifth and finally, when the stack is empty and all players pass in succession, the Attack Step ends and the Defend Step begins.

## 7.3 Defend Step

7.3.1 The Defend Step is a game state where defending cards may be declared by a hero being attacked.

7.3.2 First, defending cards are declared for the attack-target(s). Cards declared this way become defending cards for the attack-target(s) on the active chain link.[[7.0.5]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.0.5) Declaring a card this way is not considered playing that card - it does not incur the cost of playing that card, it does not add it as a layer on the stack, and it does not resolve any resolution abilities on that card.

7.3.2a If the attack-target is a hero, their controller may declare any number of non-defense-reaction cards from their hand and/or public equipment permanents they control. Otherwise, a player may only declare cards for an attack-target if a rule or effect specifies it.

7.3.2b A card cannot be declared if (A) it does not have the defense property (0 is a value), (B) it is already a defending card on a chain link, or (C) it would make the current set of declared cards illegal to become defending.

> **Example:** If an attack has overpower (can't be defended by more than one action card) and is already defended by an action card, an action card cannot be declared because it cannot become a defending card.

7.3.2c If a player declares two or more defending cards for an attack-target, they decide the order those cards are declared and become defending.

> **Example:** Flic Flak has the text "If the next card you defend with this turn is a card with combo, it gains +2." If a player declares two or more cards, they choose the order they become defending, and thus which of those cards Flic Flak's ability will apply to.

7.3.2d All declared cards for an attack-target are put onto the active chain link as a single multi-event as defending cards for that attack-target. The order in which the declared cards become defending within the multi-event is determined by the order in which were declared.[[1.9.2]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.9.2)

> **Example:** Bastion of Unity has the text "Unity - When this defends together with a card from hand, this gets +1 until end of turn." If one player declares Bastion of Unity and another player declares a card from hand, Bastion of Unity's effect will trigger because both cards defend together as part of the same multi-event.

7.3.2e If two or more players may declare defending cards for an attack-target, they do so in clockwise order starting with the player that controls the attack-target.[[1.1.6]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.1.6)

> **Example:** If a player's hero is attacked, that player declares any defending cards first, then in clockwise order, players may declare additional defending cards, such as cards with Protect.

7.3.2f If there are two or more attack-targets, defending cards are declared for each attack-target in clockwise order of their controller, starting from attacking hero.[[1.1.6]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.1.6) Then, if two or more attack-targets are controlled by the same player, defending cards are declared for each attack-target in an order determined by that controlling player. Cards only defend the attack-target they are declared for. All declared cards for each attack target are put onto the active chain link in separate events as defending cards.

> **Example:** Apocalypse Automaton has the text "This attacks up to X target opposing heroes, …." If two players' heroes are attacked by an Apocalypse Automaton, the defending cards for each hero are declared in clockwise order from the controller of the attack. The first hero's player declares defending cards, then any player may declare additional defending cards (such as cards with Protect), and finally, those declared cards become defending cards for that hero. This process then repeats for the second hero.

7.3.3 Second, the turn-player gains priority.

7.3.4 Third and finally, when the stack is empty and all players pass in succession, the Defend Step ends and the Reaction Step begins.

## 7.4 Reaction Step

7.4.1 The Reaction Step is a game state where players may use reactions related to combat.

7.4.2 First, the turn-player gains priority.

7.4.2a The player that controls the attack may play/activate attack reaction[[8.1.2]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.1.2) cards/abilities when they have priority during the Reaction Step.

7.4.2b A player that controls a hero as an attack-target (if any) may play/activate defense reaction[[8.1.3]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.1.3) cards/abilities when they have priority during the Reaction Step.

7.4.2c A defense reaction card cannot be played if a rule or effect would prevent the player from defending with that card.

> **Example:** If an attack has dominate (can't be defended by more than 1 card from hand) and is already defended by a card from hand, defense reaction cards cannot be played from hand because dominate prevents it from becoming a defending card.

7.4.2d When a defense reaction card resolves it becomes a defending card on the active chain link for its controller's hero.[[7.0.5]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.0.5) A defense reaction card fails to resolve if it cannot become a defending card.[[5.3.2b]](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/#cr5.3.2b)

> **Example:** If an attack has dominate (can't be defended by more than 1 card from hand) and there are two defense reactions on the stack, the first one will resolve and become a defending card, but the second one will fail to resolve because dominate prevents it from becoming a defending card.

7.4.3 Second and finally, when the stack is empty and all players pass in succession, the Reaction Step ends and the Damage Step begins.

## 7.5 Damage Step

7.5.1 The Damage Step is a game state where the physical damage of the active chain link is calculated and applied.

7.5.2 First, damage is calculated for the attack-target(s). If the power of the attack is greater than the sum total defense value of the defending cards for the attack-target, the attack hits the attack-target for damage equal to the difference.

> **Example:** If the power of the attack is 6, and there are two defending cards with a defense 3 and 2 respectively then the sum total defense value of the defending cards is 5. The power of the attack is greater than the sum total defense, so the attack-target is dealt 6-5=1 damage.

7.5.2a Dealing damage to the attack-target this way, is a hit-event generated by the game.[[7.5.5]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.5.5) The source of the damage is the attack.

7.5.2b If the attack-target has ceased to exist or is illegal when the damage is calculated, no damage is dealt, and the event is not generated.

7.5.2c If there are two or more attack-targets, damage is calculated and dealt separately for each attack-target controlled by players in clockwise-order. If there are two or more attack-targets controlled by the same player, the order for those attack-targets is determined by the controller of the attack.

7.5.3 Second, the turn-player gains priority.

7.5.4 Third and finally, when the stack is empty and all players pass in succession, the Damage Step ends and the Resolution Step begins.

7.5.5 The hit-event is a named-event[[1.9.3]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.9.3) that is otherwise identical to a deal damage event[[8.5.3]](https://rules.fabtcg.com/en/cr/08-keywords/#cr8.5.3). An attack is considered to have hit if it deals damage to an attack-target with a hit-event.

7.5.5a If the attack-target loses life as a result of anything except damage dealt by the hit-event, then the attack is not considered to have hit.

7.5.5b If the hit-event is modified by replacement effects such that no damage is dealt by the active-attack to the attack-target, it is no longer a hit-event - the attack is not considered to have hit when the event occurs. Damage may still be dealt if the hit-event is modified, but it is not considered a hit-event if the active-attack is not the source of the damage that would be dealt to the attack-target.

> **Example:** Feign Death has the text "The next time you would be dealt damage this turn, prevent it." If the effect from Feign Death prevents all damage dealt by the active-attack, no damage is dealt, the hit-event does not occur, and the attack is not considered to have hit.

7.5.5c If a rule or effect prevents a triggered effect from triggering when the active-attack hits and/or when it deals damage, then the triggered effect does not trigger on the hit-event.

> **Example:** Stamp Authority has the text "Attack action card effects do not trigger when they hit," which prevents triggered effects from attack action card triggering on a hit-event. If a triggered effect from an attack action card would trigger on damage being dealt (e.g. Blizzard Bolt), and the attack action card hits, the effect will not trigger on the hit-event.

7.5.5d A chain link is considered to have hit if any hit-event occurs while it is the active chain link.

## 7.6 Resolution Step

7.6.1 The Resolution Step is a game state where the active chain link resolves, the attacker may gain an action point from go again, and combat may continue with more attacks.

7.6.2 First, the active chain link becomes a resolved chain link and effects that trigger when the chain link resolves are triggered. If the attack has go again, its controller gains 1 action point.

7.6.2a If the attack is no longer on the combat chain, the last known information of the attack is used to determine whether the attack has go again.

7.6.3 Second, the turn-player gains priority.

7.6.3a The turn-player may play or activate attacks or attack-layers during the Resolution Step of combat. If an attack or attack-layer is added to the stack, the Resolution Step ends and the Layer Step begins.

7.6.3b If the stack is empty and there is an attack in the queue, the Resolution Step ends and the Attack Step begins.

7.6.4 Third and finally, when the stack and queue are empty and all players pass in succession, the Resolution Step ends and the Close Step begins.

## 7.7 Close Step

7.7.1 The Close Step is a game state where the combat chain closes and combat ends. Players do not get priority during the Close Step.

7.7.2 If a rule or effect causes the combat chain to close, the current step (if any) ends and the Close Step begins. The combat chain closes in the following situations:

7.7.2a If, during the Resolution Step, all players pass in succession when the stack is empty and there are no more attacks in the queue , the Close Step begins.[[7.6.4]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.6.4)

7.7.2b If, at the beginning of the Attack Step, (A) the active-attack or attack-source cannot become a chain link, (B) they cannot become attacking or (C) there are no legal attack-targets; and there are no more attacks in the queue, the Close Step begins.[[7.2.2c]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.2.2c)

7.7.2c If, before damage is calculated during the Damage Step,[[7.5.2]](https://rules.fabtcg.com/en/cr/07-combat/#cr7.5.2) the active-attack ceases to exist and there are no more attacks in the queue, the Close Step begins as a game state action.[[1.10.2]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.10.2)

> **Example:** Luminaris has the text "… Illusionist auras you control are weapons with 1 and "Once per Turn Action -- 0: Attack"." If a Spectral Shield token is activated to attack the opponent, and the token is destroyed before the Damage Step, the activated attack will also cease to exist, and the Close Step will begin.

7.7.2d If an effect closes the combat chain, the Close Step begins as a game state action.[[1.10.2]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.10.2)

7.7.3 First, the "combat chain closes" event occurs and effects that trigger from the combat chain closing are triggered. All attacks, attack-layers, and reactions are cleared from the stack and queue.

7.7.4 Second, layers on the stack resolve and game state actions are performed as if all players are passing priority in succession.[[1.10.2]](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.10.2)

7.7.5 Third, when the stack is empty, all permanents remaining on the combat chain return to their respective zones - equipped permanents return to their respective equipped zones. Any other permanent returns to the permanent zone.

7.7.6 Fourth, all remaining objects on the combat chain are cleared.[[3.0.12]](https://rules.fabtcg.com/en/cr/03-zones/#cr3.0.12)

7.7.7 Fifth and finally, the combat chain closes. Effects that last for "the/this combat chain" end. The Close Step ends and the Action Phase continues.
