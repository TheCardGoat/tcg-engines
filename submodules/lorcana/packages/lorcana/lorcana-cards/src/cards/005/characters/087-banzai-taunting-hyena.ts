import type { CharacterCard } from "@tcg/lorcana-types";
import { banzaiTauntingHyenaI18n } from "./087-banzai-taunting-hyena.i18n";

export const banzaiTauntingHyena: CharacterCard = {
  id: "xWf",
  canonicalId: "ci_xWf",
  reprints: ["set5-087"],
  cardType: "character",
  name: "Banzai",
  version: "Taunting Hyena",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 87,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2f8df927b41b4664aa7f6b810df6da4a",
    tcgPlayer: 561162,
  },
  text: [
    {
      title: "HERE KITTY, KITTY, KITTY",
      description: "When you play this character, you may exert chosen damaged character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Hyena"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
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
          type: "exert",
        },
        type: "optional",
      },
      id: "16q-1",
      name: "HERE KITTY, KITTY, KITTY",
      text: "HERE KITTY, KITTY, KITTY When you play this character, you may exert chosen damaged character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: banzaiTauntingHyenaI18n,
};
