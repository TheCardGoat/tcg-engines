import type { CharacterCard } from "@tcg/lorcana-types";
import { edLaughingHyenaI18n } from "./074-ed-laughing-hyena.i18n";

export const edLaughingHyena: CharacterCard = {
  id: "BdA",
  canonicalId: "ci_BdA",
  reprints: ["set5-074"],
  cardType: "character",
  name: "Ed",
  version: "Laughing Hyena",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 74,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_83352cb5f0a94843857df13731c502be",
    tcgPlayer: 561160,
  },
  text: [
    {
      title: "CAUSE A PANIC",
      description:
        "When you play this character, you may deal 2 damage to chosen damaged character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Hyena"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "status",
                status: "damaged",
              },
            ],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "1ez-1",
      name: "CAUSE A PANIC",
      text: "CAUSE A PANIC When you play this character, you may deal 2 damage to chosen damaged character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: edLaughingHyenaI18n,
};
