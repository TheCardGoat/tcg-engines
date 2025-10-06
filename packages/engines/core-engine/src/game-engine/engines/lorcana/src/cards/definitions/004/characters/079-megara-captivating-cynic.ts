import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const megaraCaptivatingCynic: LorcanitoCharacterCardDefinition = {
  id: "spm",
  name: "Megara",
  title: "Captivating Cynic",
  characteristics: ["dreamborn", "ally"],
  text: "**SHADY DEAL** When you play this character, chose and discard a card or banish this character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "SHADY DEAL",
      optional: true,
      text: "When you play this character, chose and discard a card or banish this character.",
      effects: [discardACard],
      onCancelLayer: {
        type: "resolution",
        effects: [
          {
            type: "banish",
            target: {
              type: "card",
              value: "all",
              filters: [{ filter: "source", value: "self" }],
            },
          },
        ],
      },
    },
  ],
  flavour: "With love, there's always a catch.",
  colors: ["emerald"],
  cost: 3,
  strength: 3,
  willpower: 6,
  lore: 2,
  illustrator: "Yu Nguyėn",
  number: 79,
  set: "URR",
  rarity: "common",
};
