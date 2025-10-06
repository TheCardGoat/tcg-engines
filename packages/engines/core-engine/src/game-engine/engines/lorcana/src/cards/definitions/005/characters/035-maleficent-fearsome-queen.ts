import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maleficentFearsomeQueen: LorcanaCharacterCardDefinition = {
  id: "ffi",
  missingTestCase: true,
  name: "Maleficent",
  title: "Formidable Queen",
  characteristics: ["floodborn", "queen", "sorcerer", "villain"],
  text: "**Shift** 6 _You may pay 6 {I} to play this on top of one of your characters named Maleficent.)_\n \n**EVERYONE LISTEN** When you play this character, for each character named Maleficent you have in play, return chosen opposing character, item, or location of cost 3 or less to their player's hand.",
  type: "character",
  abilities: [
    shiftAbility(6, "Maleficent"),
    {
      type: "resolution",
      name: "Everyone Listen",
      text: "When you play this character, for each character named Maleficent you have in play, return chosen opposing character, item, or location of cost 3 or less to their player's hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "opponent" },
              { filter: "zone", value: "play" },
              { filter: "type", value: ["character", "item", "location"] },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 3 },
              },
            ],
          },
        },
      ],
    },
  ],
  colors: ["amethyst"],
  cost: 8,
  strength: 7,
  willpower: 7,
  lore: 2,
  illustrator: "Malia Ewart",
  number: 35,
  set: "SSK",
  rarity: "super_rare",
};
