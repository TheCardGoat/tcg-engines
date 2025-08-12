import { gainLoreEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gatheringKnowledgeAndWisdom: LorcanaActionCardDefinition = {
  id: "uuj",
  name: "Gathering Knowledge And Wisdom",
  characteristics: ["action"],
  text: "Gain 2 lore.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Gain 2 lore.",
      targets: [selfPlayerTarget],
      effects: [gainLoreEffect({ targets: [selfPlayerTarget], value: 2 })],
    },
  ],
  flavour:
    "Just think! All this knowledge was under our noses the whole time. We only had to look in the right place.",
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Heidi Neunhoeffer",
  number: 62,
  set: "SSK",
  rarity: "common",
};
