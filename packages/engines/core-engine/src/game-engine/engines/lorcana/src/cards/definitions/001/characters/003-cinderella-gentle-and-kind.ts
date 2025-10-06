import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cinderellaGentleAndKind: LorcanitoCharacterCardDefinition = {
  id: "qil",
  reprints: ["xks"],
  name: "Cinderella",
  title: "Gentle and Kind",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_\n\n**A WONDERFUL DREAM** {E}− Remove up to 3 damage from chosen Princess character.",
  type: "character",
  illustrator: "Javier Salas",
  abilities: [
    {
      type: "activated",
      name: "A WONDERFUL DREAM",
      text: "{E}− Remove up to 3 damage from chosen Princess character.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "heal",
          amount: 3,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              { filter: "characteristics", value: ["princess"] },
            ],
          },
        },
      ],
    },
    {
      type: "static",
      ability: "singer",
      value: 5,
      text: "**Singer** 5 _(This character counts as cost 4 to sing songs.)_",
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  number: 3,
  set: "TFC",
  rarity: "uncommon",
};
