import type { CharacterCard } from "@tcg/lorcana-types";
import { zeusDefiantGodI18n } from "./109-zeus-defiant-god.i18n";

export const zeusDefiantGod: CharacterCard = {
  id: "PmL",
  canonicalId: "ci_PmL",
  reprints: ["set12-109"],
  cardType: "character",
  name: "Zeus",
  version: "Defiant God",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "012",
  cardNumber: 109,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_f573b1954fec4594b089d2897386dc69",
  },
  text: [
    {
      title: "IMMORTAL WOUND",
      description: "This character enters play with 4 damage.",
    },
  ],
  classifications: ["Storyborn", "King", "Deity"],
  abilities: [
    {
      id: "PmL-1",
      effect: {
        amount: 4,
        type: "enters-with-damage",
      },
      type: "static",
      name: "IMMORTAL WOUND",
      text: "IMMORTAL WOUND This character enters play with 4 damage.",
    },
  ],
  i18n: zeusDefiantGodI18n,
};
