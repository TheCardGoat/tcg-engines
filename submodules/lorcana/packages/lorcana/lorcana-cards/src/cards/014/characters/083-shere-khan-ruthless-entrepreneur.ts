import type { CharacterCard } from "@tcg/lorcana-types";
import { shereKhanRuthlessEntrepreneurI18n } from "./083-shere-khan-ruthless-entrepreneur.i18n";

export const shereKhanRuthlessEntrepreneur: CharacterCard = {
  id: "kg0",
  canonicalId: "ci_kg0",
  slug: "lorcana-ci_kg0",
  printings: [
    {
      id: "set14-083",
      artId: "set14-083",
      setCode: "set14",
      collectorNumber: "83",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-083"],
  cardType: "character",
  name: "Shere Khan",
  version: "Ruthless Entrepreneur",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 83,
  rarity: "super_rare",
  cost: 7,
  strength: 7,
  willpower: 4,
  lore: 1,
  inkable: false,
  text: [
    {
      title: "Quietly Released",
      description:
        "When you play this character, put chosen opposing character with 3 {S} or less on the bottom of their player's deck.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
  abilities: [
    {
      id: "kg0-1",
      name: "Quietly Released",
      type: "triggered",
      text: "Quietly Released When you play this character, put chosen opposing character with 3 {S} or less on the bottom of their player's deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "put-on-bottom",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filters: [{ type: "strength-comparison", comparison: "less-or-equal", value: 3 }],
        },
      },
    },
  ],
  i18n: shereKhanRuthlessEntrepreneurI18n,
};
