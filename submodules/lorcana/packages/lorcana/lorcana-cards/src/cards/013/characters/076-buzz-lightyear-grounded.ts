import type { CharacterCard } from "@tcg/lorcana-types";
import { buzzLightyearGroundedI18n } from "./076-buzz-lightyear-grounded.i18n";

export const buzzLightyearGrounded: CharacterCard = {
  id: "1Ro",
  canonicalId: "ci_1Ro",
  slug: "lorcana-ci_1Ro",
  printings: [
    {
      id: "set13-076",
      artId: "set13-076",
      setCode: "set13",
      collectorNumber: "76",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-076"],
  cardType: "character",
  name: "Buzz Lightyear",
  version: "Grounded",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "013",
  cardNumber: 76,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ac3f2a9029364ac283a341245bf36bae",
  },
  text: [
    {
      title: "NOT",
      description: "A FLYING TOY This character can't gain Evasive.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Toy", "Captain"],
  abilities: [
    {
      type: "static",
      name: "NOT A FLYING TOY",
      text: "NOT A FLYING TOY This character can't gain Evasive.",
      effect: {
        type: "lose-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
    },
  ],
  i18n: buzzLightyearGroundedI18n,
};
