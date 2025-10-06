import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { wheneverOneOfYourCharChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scarVengefulLion: LorcanaCharacterCardDefinition = {
  id: "rkn",
  missingTestCase: true,
  name: "Scar",
  title: "Vengeful Lion",
  characteristics: ["storyborn", "villain"],
  text: "**Ward** _(Opponents can't choose this character except to challenge.)_ **LIFE'S NOT FAIR, IS IT?** Whenever one of your characters challenges a damaged character, you may draw a card.",
  type: "character",
  abilities: [
    wardAbility,
    wheneverOneOfYourCharChallengesAnotherChar({
      name: "**LIFE'S NOT FAIR, IS IT?**",
      text: "Whenever one of your characters challenges a damaged character, you may draw a card.",
      optional: true,
      effects: [drawACard],
      defenderFilter: [
        {
          filter: "status",
          value: "damage",
          comparison: { operator: "gt", value: 0 },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  illustrator: "César Vergara",
  number: 93,
  set: "SSK",
  rarity: "rare",
};
