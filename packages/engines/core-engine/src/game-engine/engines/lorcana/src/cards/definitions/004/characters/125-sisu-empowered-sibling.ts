import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sisuEmpoweredSibling: LorcanitoCharacterCardDefinition = {
  id: "vbb",
  name: "Sisu",
  title: "Empowered Sibling",
  characteristics: ["hero", "floodborn", "dragon", "deity"],
  text: "**Shift** 6 _You may pay 6 {I} to play this on top of one of your characters named Sisu.)_\n\n\n**I GOT THIS!** When you play this character, banish all opposing characters with 2 {S} or less.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "I GOT THIS!",
      text: "When you play this character, banish all opposing characters with 2 {S} or less.",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              { filter: "owner", value: "opponent" },
              {
                filter: "attribute",
                value: "strength",
                comparison: { operator: "lte", value: 2 },
              },
            ],
          },
        },
      ],
    },
    shiftAbility(6, "Sisu"),
  ],
  colors: ["ruby"],
  cost: 8,
  strength: 5,
  willpower: 4,
  lore: 3,
  illustrator: "Grace Tran",
  number: 125,
  set: "URR",
  rarity: "legendary",
};
