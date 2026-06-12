import type { CharacterCard } from "@tcg/lorcana-types";
import { dormouseEasilyAgitatedI18n } from "./103-dormouse-easily-agitated.i18n";

export const dormouseEasilyAgitated: CharacterCard = {
  id: "L4w",
  canonicalId: "ci_L4w",
  reprints: ["set8-103"],
  cardType: "character",
  name: "Dormouse",
  version: "Easily Agitated",
  inkType: ["emerald", "ruby"],
  franchise: "Alice in Wonderland",
  set: "008",
  cardNumber: 103,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ff4402de300941a0a708629ab5f59aae",
    tcgPlayer: 631416,
  },
  text: [
    {
      title: "VERY RUDE INDEED",
      description:
        "When you play this character, you may put 1 damage counter on chosen character.",
    },
  ],
  classifications: ["Storyborn"],
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
          type: "put-damage",
        },
        type: "optional",
      },
      id: "1x7-1",
      name: "VERY RUDE INDEED",
      text: "VERY RUDE INDEED When you play this character, you may put 1 damage counter on chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: dormouseEasilyAgitatedI18n,
};
