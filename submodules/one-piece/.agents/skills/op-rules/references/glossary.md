# One Piece Glossary

Load this file before rules-facing One Piece work. Use these terms in player-facing copy, tests, and implementation notes unless the codebase has an established narrower type name.

## Core Objects

- Leader: The Leader card in the Leader area. Leader damage and Life determine defeat.
- Character: A card in the Character area. Characters can attack and be attacked while rested.
- Event: A one-shot card activated from hand by paying cost, then trashed.
- Stage: A persistent card in the Stage area.
- DON!! card: The resource card used to pay costs and increase power when given to a Leader or Character.

## Areas

- Deck: The main deck. Having 0 cards in deck is a defeat condition.
- DON!! deck: The separate DON!! card deck.
- Hand: A private area.
- Trash: The discard area.
- Leader area: Open area containing the Leader card.
- Character area: Open area containing Characters. The default maximum is 5 Characters.
- Stage area: Open area containing a Stage. The default maximum is 1 Stage.
- Cost area: Open area where DON!! cards are placed and rested to pay costs.
- Life area: Secret area containing Life cards for the Leader.

## State And Turn Terms

- Turn player: The player whose turn it is.
- Non-turn player: The other player.
- Active: Upright state.
- Rested: Sideways state.
- Refresh Phase: Phase that returns given DON!! to the cost area rested, then sets rested cards active.
- Draw Phase: Phase where the turn player draws.
- DON!! Phase: Phase where DON!! cards are placed from the DON!! deck into the cost area.
- Main Phase: Phase where the turn player may play cards, activate effects, give DON!!, and battle.
- End Phase: Phase where end-of-turn effects and cleanup happen.

## Combat And Damage

- Battle: The attack process from Attack Step through End of the Battle.
- Attack Step: Attacker rests and chooses a legal target.
- Block Step: Defending player may activate [Blocker].
- Counter Step: Defending player may use Counter effects to increase power for the battle.
- Damage Step: Compare power and apply Leader or Character damage.
- Damage processing: Procedure for adding Life to hand or activating [Trigger].
- Life: Cards set aside from the deck at setup. If a Leader would take damage with 0 Life, that player is defeated.
- Power: The value used to compare battle outcomes.
- Counter: A Character counter value or Event [Counter] usable during the Counter Step.

## Keywords

- [Rush]: Character can attack the turn it is played.
- [Double Attack]: Damage to Leader Life from this attack is 2 instead of 1.
- [Banish]: Life damaged by this attack is trashed instead of added to hand, and [Trigger] does not activate.
- [Blocker]: During the Block Step, rest this card to make it the attack target.
- [Trigger]: Optional effect that may activate when the card is added from Life to hand due to damage.
- [Rush: Character]: Character can attack opposing Characters the turn it is played.
- [Unblockable]: Opponent cannot activate [Blocker] against this attack.
- [Main]: Activation timing during the Main Phase.
- [Counter]: Event timing usable during the opponent's Counter Step.
- [DON!! xX]: Condition requiring at least X DON!! cards given to the card.
- DON!! -X: Cost or condition returning X DON!! cards from Leader, Character, or cost area to the DON!! deck.
- [On Play]: Timing when the card is played.
- [When Attacking]: Timing when the card attacks.
- [On Block]: Timing when the player activates [Blocker].
