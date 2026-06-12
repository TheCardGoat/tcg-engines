import type { CharacterCard } from "@tcg/lorcana-types";
import { yzmaUnjustlyTreatedI18n } from "./184-yzma-unjustly-treated.i18n";

export const yzmaUnjustlyTreated: CharacterCard = {
  id: "luJ",
  canonicalId: "ci_luJ",
  reprints: ["set5-184"],
  cardType: "character",
  name: "Yzma",
  version: "Unjustly Treated",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "005",
  cardNumber: 184,
  rarity: "rare",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_6349578aae2742c6901e3129e8da6925",
    tcgPlayer: 561493,
  },
  text: [
    {
      title: "I'M WARNING YOU!",
      description:
        "During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "1pn-1",
      name: "I'M WARNING YOU!",
      text: "I'M WARNING YOU! During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: yzmaUnjustlyTreatedI18n,
};
