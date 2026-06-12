import type { CharacterCard } from "@tcg/lorcana-types";
import { yzmaExasperatedSchemerI18n } from "./101-yzma-exasperated-schemer.i18n";

export const yzmaExasperatedSchemer: CharacterCard = {
  id: "yjH",
  canonicalId: "ci_yjH",
  reprints: ["set7-101"],
  cardType: "character",
  name: "Yzma",
  version: "Exasperated Schemer",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "007",
  cardNumber: 101,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f373768f95114e078fb4d77cd3cdead2",
    tcgPlayer: 619459,
  },
  text: [
    {
      title: "HOW SHALL I DO IT?",
      description:
        "When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
        },
      },
      id: "5wn-1",
      name: "HOW SHALL I DO IT?",
      text: "HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: yzmaExasperatedSchemerI18n,
};
