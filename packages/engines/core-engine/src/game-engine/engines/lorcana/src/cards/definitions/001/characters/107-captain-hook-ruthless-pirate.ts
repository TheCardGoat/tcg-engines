import { whileConditionOnThisCharacterTargetsGain } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import {
  recklessAbility,
  rushAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const captainHookRecklessPirate: LorcanaCharacterCardDefinition = {
  id: "heh",
  name: "Captain Hook",
  title: "Ruthless Pirate",
  characteristics: ["storyborn", "villain", "pirate", "captain"],
  text: "**Rush** _(This character can challenge the turn they're played.)_\n\n**YOU COWARD!** While this character is exerted, opposing characters with **Evasive** gain **Reckless**. _(They can't quest and must challenge if able.)_",
  type: "character",
  abilities: [
    rushAbility,
    whileConditionOnThisCharacterTargetsGain({
      name: "You Coward!",
      text: "While this character is exerted, opposing characters with **Evasive** gain **Reckless**. _(They can't quest and must challenge if able.)_",
      conditions: [{ type: "exerted" }],
      ability: recklessAbility,
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "owner", value: "opponent" },
          { filter: "zone", value: "play" },
          {
            filter: "ability",
            value: "evasive",
          },
        ],
      },
    }),
  ],
  flavour: "You wouldn't dare fight old Hook man-to-man!",
  colors: ["ruby"],
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  illustrator: "Cam Kendell",
  number: 107,
  set: "TFC",
  rarity: "rare",
};
