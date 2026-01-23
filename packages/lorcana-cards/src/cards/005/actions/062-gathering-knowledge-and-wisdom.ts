import type { ActionCard } from "@tcg/lorcana-types";

export const gatheringKnowledgeAndWisdom: ActionCard = {
  id: "pjc",
  cardType: "action",
  name: "Gathering Knowledge and Wisdom",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "Gain 2 lore.",
  cost: 2,
  cardNumber: 62,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5c09a4c51f5fe4668bbd8723ebc416da70603684",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const gatheringKnowledgeAndWisdom: LorcanitoActionCard = {
//   id: "uuj",
//   name: "Gathering Knowledge And Wisdom",
//   characteristics: ["action"],
//   text: "Gain 2 lore.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Gain 2 lore.",
//       effects: [youGainLore(2)],
//     },
//   ],
//   flavour:
//     "Just think! All this knowledge was under our noses the whole time. We only had to look in the right place.",
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Heidi Neunhoeffer",
//   number: 62,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561620,
//   },
//   rarity: "common",
// };
//
