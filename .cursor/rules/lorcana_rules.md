# Disney Lorcana TCG Rules Summary for AI Evaluation

## 1. Core Concepts & Golden Rules

- **Card > Rules (1.2.1):** If a card's text contradicts a game rule, the card text takes precedence.
- **Prohibition > Permission (1.2.2):** If a rule or effect prevents something, it overrides rules or effects that allow it.
- **Do As Much As Possible (1.2.3):** If an effect instructs a player to do something, they perform as much as possible, even if parts are impossible (unless it's a cost like "[A] to [B]").
- **Choices During Resolution (1.2.4):** Choices for card effects are made when the effect resolves, not when the card is played.
- **Active Player (1.3):** The player whose turn it is.
- **Opponent (1.4):** Any player you are playing against.
- **You/Your (1.8.3):** Refers to the player who played the card, regardless of who controls it.

## 2. Game Setup & End Conditions

- **Deck Rules (2.1):**
  - Minimum 60 cards.
  - Max 2 ink types.
  - Max 4 copies of any card with the same _full name_ (Name + Version).
- **Starting the Game (3.1):**
  - Determine starting player randomly.
  - Shuffle decks, offer cut.
  - Start at 0 lore.
  - Draw 7 cards.
  - Starting player first may mulligan (bottom deck any number, draw back to 7, shuffle). Other players follow in turn order. Only one mulligan per player.
- **Winning the Game (1.9.1.1, 3.2.1.1):** A player wins immediately upon reaching 20 or more lore (checked during Game State Check).
- **Losing the Game (1.9.1.2, 3.2.1.2):** A player loses immediately if they attempt to draw from an empty deck (checked during Game State Check). Loser's cards/effects are removed from the game.
- **Last Player Standing (3.2.1.3):** In multiplayer, the last remaining player wins.

## 3. Turn Structure

- **Phases (4.1):** Beginning Phase -> Main Phase -> End of Turn Phase.
- **Beginning Phase (4.2):**
  - **Ready Step (4.2.1):**
    - Ready all your exerted cards (in play and inkwell).
    - "During your turn" effects start.
    - "Start of turn" effects end.
    - "Start of turn" triggers occur (added to bag in Set step).
  - **Set Step (4.2.2):**
    - Characters played last turn become "dry" (can quest/challenge/exert for costs).
    - Gain lore from your Locations in play with {L}. (Not a triggered ability).
    - Add "Start of turn" triggers (from Ready step) to the bag and resolve them.
  - **Draw Step (4.2.3):**
    - Draw 1 card. (Skip this step on the very first turn of the game).
- **Main Phase (4.3):**
  - Active player performs any number of Turn Actions in any order, if possible.
  - **Turn Actions:**
    - **Put Card into Inkwell (4.3.3):** Once per turn. Choose card with {C} from hand, reveal, place facedown in inkwell ready.
    - **Play a Card (4.3.4):** Announce card from hand, declare cost (ink or alternate), determine total cost (base + modifiers), pay cost (exert ink, pay others), card enters play (Character/Item/Location) or resolves effect & goes to discard (Action).
    - **Quest (4.3.5):** Choose one dry character, check restrictions, exert character, gain lore equal to its {L}. Add triggers to bag.
    - **Challenge (4.3.6):**
      - Choose one dry, ready character (challenger).
      - Choose one exerted opposing character OR any opposing location (challenged).
      - Check restrictions.
      - Exert challenger.
      - Apply "while challenging" effects.
      - Add triggers to bag & resolve.
      - Characters deal damage = {S} to each other (Challenge Damage Step). Locations deal no damage. Apply Resist. Place damage counters.
      - Check for banishment triggers & resolve.
      - End "while challenging" effects. Challenge ends.
    - **Move Character to Location (4.3.7):** Choose your character & your location, pay location's move cost {M}, character moves. Add triggers to bag.
    - **Use Activated Ability (4.3.8, 7.5):** Announce ability, pay cost, resolve effect immediately. (Character abilities requiring {E} need the character to be dry).
- **End of Turn Phase (4.4):**
  - Active player declares end of turn.
  - Add "End of turn" triggers to bag.
  - Resolve all triggers in the bag.
  - "This turn" effects end. If this causes triggers, resolve them.
  - Turn ends, pass to next player.

## 4. Card Types & Properties

- **Conditions (5.1):**
  - **Ready:** Upright. Can exert for costs if dry (characters).
  - **Exerted:** Sideways. Cannot exert for costs.
  - **Damaged:** Has >= 1 damage counter.
  - **Undamaged:** Has 0 damage counters.
- **Characters (6.1):**
  - Have {S} (Strength) and {W} (Willpower).
  - Have classifications (Hero, Villain, etc.).
  - Must be "dry" (in play since start of current turn's Set step) to quest, challenge, or use {E} abilities (6.1.4, 4.2.2.1).
- **Actions (6.3):**
  - Played from hand, effect resolves, goes to discard. Never "in play".
  - **Songs (6.3.3):** Actions with "Song" classification. Can be played for free by exerting a character whose cost >= song's listed cost (or use Singer/Sing Together).
- **Items (6.4):**
  - Enter play. Can use activated abilities the turn they are played.
- **Locations (6.5):**
  - Enter play. Have Move Cost {M}, Willpower {W}, may have Lore {L}.
  - Can be challenged anytime (don't exert).
  - Deal no damage in challenges.
  - Player gains lore = {L} during their Set Step for each location.
  - Characters can move to friendly locations by paying {M}.
- **Card Parts (6.2):**
  - **Name (6.2.4):** Main identifier. Ignores version unless checking "full name".
  - **Version (6.2.5):** Differentiates cards with the same Name. Full Name = Name + Version.
  - **Cost (6.2.7):** Ink needed to play.
  - **Inkwell Symbol {C} (6.2.8):** If present, card can be put into inkwell.
  - **Strength {S} (6.2.9):** Damage dealt in challenges. 0 or less deals no damage.
  - **Willpower {W} (6.2.10):** Damage needed to banish.
  - **Lore {L} (6.2.11, 6.5.6):** Lore gained from questing (Characters) or during Set step (Locations). Negative {L} counts as 0.
  - **Abilities (6.2.12):** Rules text.

## 5. Abilities

- **General (7.1):**
  - Clauses separated by periods are distinct.
  - **[A] to [B] (7.1.2.2):** Must fully perform cost [A] to get effect [B]. [A] is a cost, [B] is an effect.
  - **[A] then [B] (7.1.2.3):** Do as much of [A] as possible, then do as much of [B] as possible.
  - **May (7.1.3):** Player chooses whether the effect happens. If no, nothing in the clause happens.
  - **Up to N (7.1.8):** Choose 0 to N distinct items/targets.
  - **That (7.1.9):** Refers to the specific card/object previously mentioned. If it changed zones, the effect might fail.
  - **Reveal (7.1.10):** Show card face(s) to all players from the specified group.
- **Triggered Abilities (7.4):**
  - Start with "When", "Whenever", "At the start of", "At the end of".
  - When condition met, effect added to the Bag (8.7).
  - Conditional Triggers ("[Trigger], if [Condition], [Effect]"): Check condition when triggered _and_ when resolving. If false either time, no effect. (7.4.4)
  - Multi-Condition Triggers ("[Trigger1] and [Trigger2], [Effect]"): Trigger if _either_ condition is met. (7.4.6)
  - Floating Triggers: Created by resolving effects, exist for a duration (e.g., "Whenever X this turn..."). (7.4.7)
- **Activated Abilities (7.5):**
  - Format: `[Cost] -- [Effect]`.
  - Can be used by active player during Main Phase if cost can be paid.
  - Resolve immediately after cost is paid.
  - Character {E} costs require the character to be dry. Item abilities can be used turn played.
- **Static Abilities (7.6):**
  - Continuously active while source is in play (or for specified duration).
  - Affect cards as they enter play.
  - If source leaves play, effect ends immediately.
- **Replacement Effects (7.7):**
  - Use words like "instead" or "enters play [...]".
  - Wait for an event and modify/replace it _before_ it happens.
  - The original event does not happen.
  - If multiple replacements apply, affected player/controller chooses one.

## 6. Zones

- **Public Zones (8.1.2):** Play, Discard. Anyone can look/count cards.
- **Private Zones (8.1.3):** Deck, Hand, Inkwell. Cannot look (except own hand) unless effect allows. Can count cards anytime.
- **Deck (8.2):** Facedown, randomized. Draw from top. Cannot look/reorder. Lose if must draw when empty.
- **Hand (8.3):** Held cards. No max size. Discard from hand to discard pile.
- **Play (8.4):** Where Characters, Items, Locations are. Cards here are "in play".
- **Inkwell (8.5):** Facedown ink cards. Each represents 1 Ink {I}. Cannot look (even own). Must track ready/exerted status.
- **Discard (8.6):** Faceup pile for banished cards, resolved actions, discarded cards. Public.
- **Bag (1.7, 8.7):** Conceptual zone for pending triggered abilities.
  - Trigger occurs -> Ability added to Bag by its controller.
  - Active player resolves one of their triggers from Bag fully.
  - If resolution causes more triggers, add them to Bag.
  - Active player resolves ALL their triggers (including new ones) before passing priority.
  - Next player in turn order resolves ALL their triggers.
  - Repeat until Bag is empty.

## 7. Game State Checks (1.9)

- **When:** End of each step, after actions/abilities resolve, after each Bag resolution.
- **Process:**
  1.  Check Win/Loss conditions:
      - Any player >= 20 lore? They WIN.
      - Any player tried to draw from empty deck since last check? They LOSE.
      - If a player wins and loses simultaneously, they WIN.
  2.  If no win/loss, check other conditions:
      - Character/Location damage >= Willpower? Banish it (Required Action).
  3.  Perform all Required Actions simultaneously (if multiple).
  4.  If any Required Action occurred, REPEAT the Game State Check from step 1.
  5.  Once check completes with no Required Actions, add any abilities triggered _during_ the check process to the Bag.

## 8. Damage & Banishment

- **Damage Counters (9.1):** Represent damage on Characters/Locations.
- **Dealing vs Putting Damage (9.2):** Effects that "put" damage counters don't count as "dealing damage" (e.g., ignore Resist).
- **Moving Damage (9.3):** Remove from A, put on B. Target (B) does not "take damage" (ignores Resist).
- **Banishment (1.9.1.3):** Required Action when damage >= Willpower during Game State Check. Card goes to Discard.
- **Leaving Play (9.4):** When a card leaves play, damage counters cease to exist.

## 9. Keywords (10)

- **(Stacking):** Keywords with `+N` (Challenger, Resist) stack. Others generally don't if granted multiple times.
- **Bodyguard (10.2):** May enter play exerted. Opponents _must_ challenge this character (or another with Bodyguard) if able.
- **Challenger +N (10.3):** Gets +N {S} _while challenging_. (Not when being challenged).
- **Evasive (10.4):** Can only be challenged by characters with Evasive.
- **Reckless (10.5):** Cannot quest. _Must_ challenge if ready and an opposing exerted character/location exists. (Cannot end turn otherwise).
- **Resist +N (10.6):** Reduce damage dealt _to_ this character/location by N. If damage reduced to 0, no damage is dealt.
- **Rush (10.7):** Can challenge the turn it enters play (ignores "drying").
- **Shift {Cost} (10.8):** Alternate play cost. Pay {Cost}, play on top of another character _you control_ with the same _name_. Inherits state (dry/exerted/damage) but uses new card's text/stats. Underlying cards go to discard if top card leaves play.
- **Singer N (10.9):** Can exert this character to sing a Song as if this character's cost was N.
- **Sing Together N (10.10):** Can exert any number of your ready characters whose total cost >= N to sing the song for free.
- **Support (10.11):** Triggered: "Whenever this character quests, you may add their {S} to another chosen character's {S} this turn."
- **Ward (10.12):** Opponents cannot _choose_ this card with effects (can still be affected by non-targeting effects). Can still be challenged.
