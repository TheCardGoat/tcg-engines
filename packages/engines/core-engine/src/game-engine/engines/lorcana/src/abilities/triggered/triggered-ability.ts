// **7.4. Triggered Abilities**

// **7.4.1. **Triggered abilities occur when their trigger condition is met. They trigger only once per trigger condition that is met.

// **7.4.2. **Triggered abilities start with “When,” “Whenever,” “At the start of,” or “At the end of” and describe the game state that causes the abilities to trigger and the effects of the abilities.

// **7.4.3. **When an ability triggers, its effect is placed into the bag to be resolved in order as described in section 8.7, “Bag.”

// **7.4.4. **Some triggered abilities are written as “\[Trigger Condition\], if \[Secondary Condition\], \[Effect\]. These abilities check whether the secondary condition is true both when the effect would be added to the bag and again when the effect resolves.

// **7.4.4.1. **If the secondary condition is false when the effect would be added to the bag, the effect is never added to the bag.

// **7.4.4.2. **If the secondary condition is false when the effect would resolve, the triggered ability resolves with no effect.

// ***Example:** Stitch – Carefree Surfer has an ability cal ed Ohana that reads, “When you play this character, if you have* *2 or more other characters in play, you may draw 2 cards.” When the active player plays Stitch, the triggered ability* *checks to see if the player has two or more other characters in play. If not, the triggered ability isn’t added to the bag. *

// *If the player has two or more characters in play, the ability is added to the bag. The triggered ability will check again* *when it resolves to see if the condition is still true. If it isn’t, the triggered ability resolves for no effect. *

// **7.4.5. **Some triggered abilities are written as, “\[Trigger Condition\], \[Effect\]. \[Effect\].” Both effects are linked to the trigger condition but are independent of each other.

// ***Example A:** Moana – Of Motunui has an ability cal ed We Can Fix It that reads, “Whenever this character quests, you may ready* *your other Princess characters. They can’t quest for the rest of this turn.” If the active player chooses to quest with Moana, none* *of their other Princess characters can quest this turn, regardless of whether they were readied by the effect or not. *

// ***Example B:** Scar – Vicious Cheater has an ability cal ed Daddy Isn’t Here to Save You that reads, “During your turn, whenever* *this character banishes another character in a chal enge, you may ready this character. He can’t quest for the rest of this turn.” *

// *Because the two effects are both tied to the trigger condition, if Scar doesn’t chal enge he can quest this turn as normal. *

// **7.4.6. **Some triggered abilities are written as, “\[Trigger Condition\] and \[Trigger Condition\], \[Effect\].” These abilities function as having two triggered abilities that are independent of each other but both resolve for the same effect.

// ***Example:** John Silver – Alien Pirate has an ability cal ed Pick Your Fights that reads, “When you play this character and whenever* *he quests, chosen opposing character gains **Reckless** during their next turn.” The triggered ability occurs when John Silver is* *played and also when the active player quests with this character. The triggered ability doesn’t need both trigger conditions to* *be true at the same time for it to occur, only one or the other. *

// **7.4.7. **Some abilities and effects create a triggered ability that can occur only during a specific duration or when a specific condition is met at a particular moment later in the game. These are usual y created as the result of resolving an action card.

// **7.4.7.1. ** *Floating Triggered Abilities –* Triggered abilities created to exist for a specified duration. These exist outside of the bag. Whenever the condition of the floating triggered ability is met, an instance of that triggered ability is added to the bag for resolution. Once that duration has expired, the floating triggered ability ceases to exist.

// ***Example:** Steal from the Rich is an action that reads, “Whenever one of your characters quests this turn, each* *opponent loses 1 lore.” When Steal from the Rich resolves, it creates the floating triggered ability defined by the card. *

// *This exists for the rest of the turn. * *Whenever the player quests with one of their characters that turn, the condition* *of the floating triggered ability is met and an instance of that triggered ability is added to the bag to resolve. The* *floating triggered ability continues to exist outside of the bag until the end of the turn, when the specified duration in* *the condition expires. *

// **7.4.7.2. ** *Delayed Triggered Abilities –* Triggered abilities created to resolve at a specific moment later in the game. This moment is specified in the condition of the delayed triggered ability. The ability exists outside of the bag until that condition is met. When the condition is met, the delayed triggered ability is added to the bag for resolution.

// ***Example:** Candy Drift is an action that reads, “Draw a card. Chosen character of yours gets \+5 *\{S\} * this turn. At the* *end of your turn, banish them.” When the action resolves, it generates a delayed triggered ability: “At the end of your* *turn, banish them.” The triggered ability exists outside of the bag until the step of the End of Turn where end-of-turn* *triggers occur. At that point, the triggered ability is added to the bag and resolves. *

import type {
  AbilityCondition,
  LorcanaAbility,
  LorcanaAbilityCost,
  LorcanaBaseAbility,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";

export interface LorcanaTriggeredAbility extends LorcanaBaseAbility {
  type: "triggered";
  costs: LorcanaAbilityCost;
  timing: LorcanaTriggerTiming;
  secondaryCondition?: AbilityCondition;
}

export const isTriggeredAbility = (
  ability?: LorcanaAbility,
): ability is LorcanaTriggeredAbility => ability?.type === "activated";

export type LorcanaTriggerTiming =
  | "onPlay" // When you play this character
  | "onPlayCharacter" // Whenever you play a character
  | "onPlayItem" // Whenever you play an item
  | "onPlayAction" // Whenever you play an action
  | "onPlaySong" // Whenever you play a song
  | "onQuest" // Whenever this character quests
  | "onCharacterQuests" // Whenever a character quests
  | "onPutIntoInkwell" // Whenever a card is put into your inkwell
  | "onChallenge" // When/whenever this character challenges
  | "onChallenged" // When/whenever this character is challenged
  | "onCharacterChallenges" // Whenever a character challenges
  | "onBanish" // When this character is banished
  | "onBanishInChallenge" // When this character is banished in a challenge
  | "onOtherBanished" // Whenever one of your other characters is banished
  | "onDamage" // When this character is damaged
  | "onDealDamage" // When this character deals damage
  | "onDamageRemoved" // Whenever damage is removed
  | "onMove" // When this character moves
  | "onReady" // Whenever you ready this character
  | "onExert" // Whenever you exert this character
  | "onActivatedAbility" // Whenever a player activates an ability
  | "onCardDrawn" // Whenever you draw a card
  | "onDiscard" // Whenever you discard a card
  | "onOpponentDiscard" // Whenever an opponent discards a card
  | "startOfTurn" // At the start of your turn
  | "endOfTurn" // At the end of your turn
  | "whenLeaves" // When this character leaves play
  | "onMoveToLocation" // When this character moves to a location
  | "whileAtLocation" // While this character is at a location
  | "whileExerted" // While this character is exerted
  | "whileHasDamage" // While this character has damage
  | "whileNoDamage" // While this character has no damage
  | "whileCharacterInPlay" // While you have a character in play
  | "whileChallenging" // While this character is challenging
  | "whileChallenged" // While this character is being challenged
  | "onShift"; // When you play a Floodborn character using Shift
