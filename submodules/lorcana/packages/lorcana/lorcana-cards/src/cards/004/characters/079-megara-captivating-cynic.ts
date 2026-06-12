import type { CharacterCard } from "@tcg/lorcana-types";
import { megaraCaptivatingCynicI18n } from "./079-megara-captivating-cynic.i18n";

export const megaraCaptivatingCynic: CharacterCard = {
  id: "2qv",
  canonicalId: "ci_2qv",
  reprints: ["set4-079"],
  cardType: "character",
  name: "Megara",
  version: "Captivating Cynic",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 79,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_bb689737789640e98f540464691035a6",
    tcgPlayer: 549632,
  },
  text: [
    {
      title: "SHADY DEAL",
      description:
        "When you play this character, choose and discard a card or banish this character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "2qv-1",
      name: "SHADY DEAL",
      text: "SHADY DEAL When you play this character, choose and discard a card or banish this character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "or",
        optionLabels: ["choose and discard a card", "banish this character."],
        options: [
          {
            amount: 1,
            chosen: true,
            target: "CONTROLLER",
            type: "discard",
          },
          {
            type: "banish",
            target: {
              selector: "self",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
      },
    },
  ],
  i18n: megaraCaptivatingCynicI18n,
};
