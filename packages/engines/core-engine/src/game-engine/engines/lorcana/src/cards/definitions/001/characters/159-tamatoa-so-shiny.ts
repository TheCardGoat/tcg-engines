import { whenPlayAndWheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities"; // Add import

export const tamatoaSoShiny: LorcanaCharacterCardDefinition = {
  id: "jzt",
  name: "Tamatoa",
  title: "So Shiny!",
  characteristics: ["storyborn", "villain"],
  text: "**WHAT HAVE WE HERE?** When you play this character and whenever he quests, you may return an item card from your discard to your hand.\n\n**GLAM** This character gets +1 {L} for each item you have in play.",
  type: "character",
  abilities: [
    propertyStaticAbilities({
      name: "Glam",
      text: "This character gets +1 {L} for each item you have in play.",
      attribute: "lore",
      amount: {
        dynamic: true,
        filters: [
          { filter: "zone", value: "play" },
          { filter: "type", value: "item" },
          { filter: "owner", value: "self" },
        ],
      },
    }),
    ...whenPlayAndWheneverQuests({
      name: "What have we here?",
      text: "When you play this character and whenever he quests, you may return an item card from your discard to your hand.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "item" },
              { filter: "owner", value: "self" },
              { filter: "zone", value: "discard" },
            ],
          },
        },
      ],
    }),
  ],
  flavour: "Watch me dazzle like a diamond in the rough!",
  inkwell: true,
  colors: ["sapphire"],
  cost: 8,
  strength: 5,
  willpower: 8,
  lore: 1,
  illustrator: "Leonardo Giammichele",
  number: 159,
  set: "TFC",
  rarity: "super_rare",
};
