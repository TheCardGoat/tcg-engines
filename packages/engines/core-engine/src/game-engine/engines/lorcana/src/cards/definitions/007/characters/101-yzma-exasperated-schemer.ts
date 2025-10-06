import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yzmaExasperatedSchemer: LorcanaCharacterCardDefinition = {
  id: "zls",
  name: "Yzma",
  title: "Exasperated Schemer",
  characteristics: ["storyborn", "villain", "sorcerer"],
  text: "HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card.",
  type: "character",
  abilities: [
    {
      ...youMayDrawThenChooseAndDiscard,
      name: "HOW SHALL I DO IT?",
      text: "When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Mel Milton",
  number: 101,
  set: "007",
  rarity: "common",
  lore: 1,
};
