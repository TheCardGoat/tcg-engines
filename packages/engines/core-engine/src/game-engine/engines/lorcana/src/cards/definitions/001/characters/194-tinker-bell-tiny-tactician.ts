import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tinkerBellTinyTactician: LorcanaCharacterCardDefinition = {
  id: "s44",
  reprints: ["ahg"],

  name: "Tinker Bell",
  title: "Tiny Tactician",
  characteristics: ["dreamborn", "ally", "fairy"],
  text: "**Battle plans** {E} - Draw a card, then choose and discard a card.",
  type: "character",
  abilities: [
    {
      ...youMayDrawThenChooseAndDiscard,
      type: "activated",
      costs: [{ type: "exert" }],
      optional: false,
      name: "Battle plans",
      text: "Draw a card, then choose and discard a card.",
    },
  ],
  flavour: "Sometimes all you need is a little tactical genius.",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Grace Tran",
  number: 194,
  set: "TFC",
  rarity: "common",
};
