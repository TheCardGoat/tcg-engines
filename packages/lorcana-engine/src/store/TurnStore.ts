// 4. TURN STRUCTURE
// 4.1. Phases
// 4.1.1. A turn has three phases, which occur in this order: Beginning Phase, Main Phase, and End of Turn Phase.
// 4.1.2. The Beginning Phase is where a player resets their cards as appropriate for their new turn. This is where all effects that end at
// the start of the player’s turn end and where effects that occur or begin at the start of their turn happen. The Beginning Phase
// has three steps: Ready, Set, and Draw. (See 4.2, Beginning Phase.)
// 4.1.3. The Main Phase is where a player can act on their turn, choosing to perform any of the Main Phase turn actions. (See 4.3,
// Main Phase.)
// 4.1.4. The End of Turn Phase is where all effects that end at the current turn end. If effects would be added to the bag as a result of
// effects ending, those effects are resolved and the game proceeds to the next player’s Beginning Phase. (See 4.4, End of Turn
// Phase.)

// 4.2. Beginning Phase
// 4.2.1. Ready
// 4.2.1.1. The active player readies all their cards in play and in their inkwell.
// 4.2.1.2. Effects that apply During your turn start applying.
// 4.2.1.3. Effects that end at the start of your turn or at the start of your next turn end.
// 4.2.1.4. Effects that trigger at the start of your turn and at the beginning of your turn trigger but do not yet resolve (see 4.2.2.3).
// 4.2.2. Set
// 4.2.2.1. Characters that are in play are no longer drying and will be able to quest, challenge, or {E} to pay costs for
//     activated abilities or song cards.
// 4.2.2.2. The active player gains lore from locations they have in play with a {L} characteristic. This isn’t a triggered ability and
// doesn’t use the bag.
// 4.2.2.3. Effects that would occur At the start of your turn or At the beginning of your turn and abilities that triggered
// during the Ready step are added to the bag. Then, all triggers are resolved.
// 4.2.3. Draw
// 4.2.3.1. Drawing is when a player takes the top card of their deck and puts that card into their hand. A player can draw only
// from their deck. Putting a card into a hand from any zone besides the deck isn’t considered drawing.
// 4.2.3.2. First, the active player draws a card from their deck. If this turn is the first turn of the game, the active player skips
// this step.
// 4.2.3.3. Once all effects have been resolved and there are no more waiting to be added, the game moves into the Main
// Phase.

// 4.3. Main Phase
// 4.3.1. Turn actions are the actions that the game allows a player to take during their turn. No effect or other card is needed in order
// to take these turn actions.
// 4.3.2. The active player may take turn actions in any order during the Main Phase of their turn. Unless otherwise noted, they may
// take each action any number of times, provided they have the necessary resources to pay any associated costs and complete
// the turn actions.
// 4.3.3. Put a card into the inkwell. This turn action is limited to once per turn.
// 4.3.3.1. The player declares they’re putting a card into their inkwell, then chooses and reveals a card from their hand with
//     the inkwell symbol. All players verify that the inkwell symbol is present.
// 4.3.3.2. The player places the revealed card in their inkwell facedown and ready.
// 4.3.3.3. Effects that would occur as a result of a card being put into the inkwell are added to the bag (see 8.7, Bag).

// 4.3.4. Play a card.
// 4.3.4.1. The active player can take a turn action to play a card from their hand by announcing the card and paying its cost.
//     This process follows a series of steps. If any part of the playing a card process can’t be performed, it’s illegal to play
// the card and the game goes back to the point right before the card was announced.
// 4.3.4.2. These steps apply to all cards that can be played. Cards can normally be played only from a player’s hand. Only the
// active player can play cards; no player may play a card on an opponent’s turn.
// 4.3.4.3. First, the active player announces the card they intend to play and reveals it from their hand.
// 4.3.4.4. Second, the player announces how they intend to play the card, whether for its ink cost or an alternate cost. If
// multiple alternate costs could apply to the card, the player may choose one and ignore the others for the purposes
// of playing the card.
// 4.3.4.5. Third, the player determines the total cost needed to play the card. The total cost is the ink cost or alternate cost
// plus any cost modifiers. This can include additional costs, cost increases, or cost reductions. Apply any additional
// costs first, then cost increases, then cost reductions. The resulting cost is the total cost.
// 4.3.4.6. Fourth, the player pays the total cost. If the total cost includes any ink, the player must exert a number of ready
// ink cards equal to the ink cost. If any other costs are included, the player pays those costs as instructed by the card
// text. Costs can be paid in any order but must be paid in full.
// 4.3.4.7. Once the total card cost is paid, the card is now played. If the card is a character, item, or location, the card enters
// the Play zone. If it’s a character being played using its Shift ability, it must be put on top of the card indicated in
// the second step of this process. If the card is an action, the effect immediately resolves and the card goes to the
// player’s discard pile.
// 4.3.4.8. If an effect would trigger as a result of any of the steps for playing a card, that effect waits to resolve until the card
// and its effect are fully played and resolved. Note that while an action card is resolving, it’s not considered to be in
// the discard yet.
// 4.3.4.9. Effects that change how a player pays the cost of a card (e.g., Singer) don’t change the ink cost of the card.
// 4.3.4.10. If a card can be played for free, ignore all ink costs when paying for it. Other steps required to play the card and
// non-ink costs still apply.

// 4.3.5. Quest
// 4.3.5.1. Sending a character on a quest is a turn action. Only characters can quest.
// 4.3.5.2. A character chosen to quest is the questing character. The player who declares a questing character is the questing
// player.
// 4.3.5.3. To quest, the active player takes the following steps in order.
// 4.3.5.4. First, the player declares that they’re going to have one of their characters quest.
// 4.3.5.5. Second, the player identifies the questing character and checks for any restrictions that prevent them from
// questing (e.g., they aren’t dry yet, they have Reckless, etc.).
// 4.3.5.6. If an effect prevents the identified character from questing, that quest is illegal.
// 4.3.5.7. Third, the player exerts the questing character.
// 4.3.5.8. If no effect prevents the character from questing, the quest is complete and the questing player gains lore equal to
// the {L} of the questing character.
// 4.3.5.9. Effects that would occur as a result of the quest are added to the bag (see 8.7, Bag).
// 4.3.5.10. Once all effects have been resolved, the quest is over.

// 4.3.6. Challenge
// 4.3.6.1. Sending a character into a challenge is a turn action. Only characters can challenge.
// 4.3.6.2. A character sent into a challenge is known as a challenging character, and the opposing character or location is
// being challenged. Both are considered to be in the challenge. Characters can challenge locations. For the differences
// in that process, see 4.3.6.18.
// 4.3.6.3. Only the challenging character and the character being challenged are in the challenge. If an ability or effect refers
// to a character in a challenge, it’s referring to one of the two characters in the current challenge.
// 4.3.6.4. To challenge, the active player follows the steps listed here, in order.
// 4.3.6.5. First, the player declares one of their characters is challenging a character. The declared character must have been
// in play since the beginning of the turn (that is, they must be dry), ready, and otherwise able to challenge.
// 4.3.6.6. Second, the player chooses an exerted opposing character to be challenged.
// 4.3.6.7. Third, the players check for challenging restrictions. If any effect prevents the challenge, the challenge is illegal.
// 4.3.6.8. Fourth, the challenging player exerts the challenging character.
// 4.3.6.9. Fifth, the challenge occurs.
// 4.3.6.10. Sixth, while challenging effects apply.
// 4.3.6.11. Seventh, effects that would trigger are added to the bag.
// 4.3.6.12. Eighth, once all effects in the bag have resolved, each character deals damage equal to their Strength {S} to the other
// character. This is known as the Challenge Damage step. This isn’t an ability or effect and isn’t added to the bag.
// 4.3.6.13. To determine the damage each character in the challenge deals, first calculate the total Strength {S} of each, taking
// into account any current modifier effects. If a character’s {S} is negative, it counts as 0 {S} for the purpose of
// determining damage.
// 4.3.6.14. Apply effects that adjust the amount of damage dealt (e.g., Resist).
// 4.3.6.15. The resulting number is the final amount of damage that character deals. When damage is dealt to a character,
//     place a number of damage counters equal to that damage on that character. (See 9.1, Representation of Damage.)
// 4.3.6.16. Any effects that would trigger as a result of a character being banished in or during a challenge that apply trigger
// and resolve.
// 4.3.6.17. Once all effects have been resolved and there are no more waiting to be added, effects that apply while
//     challenging or while being challenged end, and the challenge is over.
// 4.3.6.18. Players can choose to have a character challenge a location. This follows all of the normal rules and steps of
// challenging with the following exceptions.
// 4.3.6.19. When a challenger is declared, the player chooses an opposing location to challenge instead of a character.
// 4.3.6.20. Locations are never ready or exerted. They can be challenged at any time in the Main Phase.
// 4.3.6.21. Locations don’t have a Strength {S} characteristic and don’t deal damage to the challenging character.
// 4.3.6.22. If a character in a challenge is removed from the challenge for any reason, that challenge ends. First, resolve any
// remaining triggered abilities in the bag. Then, all while challenging effects end and the game proceeds to the
// Main Phase (see 4.3).
