import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const megaraLiberatedOne: LorcanitoCharacterCardDefinition = {
  id: "dpb",
  name: "Megara",
  title: "Liberated One",
  characteristics: ["storyborn", "ally"],
  text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n\n**PEOPLE ALWAYS DO CRAZY THINGS** Whenever you play a character named Hercules, you may ready this character.",
  type: "character",
  abilities: [
    wardAbility,
    wheneverPlays({
      name: "PEOPLE ALWAYS DO CRAZY THINGS",
      text: "Whenever you play a character named Hercules, you may ready this character",
      optional: true,
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: "hercules" },
          },
        ],
      },
      effects: [
        {
          type: "exert",
          exert: false,
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  illustrator: "Ye Yang / Raquel Villameva",
  number: 80,
  set: "URR",
  rarity: "uncommon",
};
