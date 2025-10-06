import { youGainLore } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverOneOfYourCharChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const faZhouWarHero: LorcanaCharacterCardDefinition = {
  id: "bu5",
  name: "Fa Zhou",
  title: "War Hero",
  characteristics: ["storyborn", "hero"],
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 3,
  illustrator: "Mel Milton",
  number: 188,
  set: "007",
  rarity: "rare",
  lore: 1,
  text: "TRAINING EXERCISES Whenever one of your characters challenges another character, if it's the second challenge this turn, you gain 3 lore.",
  abilities: [
    wheneverOneOfYourCharChallengesAnotherChar({
      name: "TRAINING EXERCISES",
      text: "Whenever one of your characters challenges another character, if it's the second challenge this turn, you gain 3 lore.",
      attackerFilter: [
        {
          filter: "turn",
          value: "challenge",
          // TODO: the problem here is that during this filter evaluation, we don't have information about who is the attacker or the defender
          targetFilter: [{ filter: "owner", value: "self" }],
          // TODO: Unfortunately, the check happens before we update the challenge counter, that's why we're counting 1 and not 2
          comparison: { operator: "eq", value: 1 },
        },
      ],
      effects: [youGainLore(3)],
    }),
  ],
};
