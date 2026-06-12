import type { CharacterCard } from "@tcg/lorcana-types";
import { motherGothelSelfishManipulatorI18n } from "./090-mother-gothel-selfish-manipulator.i18n";

export const motherGothelSelfishManipulator: CharacterCard = {
  id: "QPF",
  canonicalId: "ci_QPF",
  reprints: ["set1-090"],
  cardType: "character",
  name: "Mother Gothel",
  version: "Selfish Manipulator",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "001",
  cardNumber: 90,
  rarity: "common",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b9b75a9f9ec8475b836925a711e88d8d",
    tcgPlayer: 508772,
  },
  text: [
    {
      title: "SKIP THE DRAMA, STAY WITH MAMA",
      description: "While this character is exerted, opposing characters can't quest.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      condition: {
        type: "exerted",
      },
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: {
          selector: "all",
          zones: ["play"],
          owner: "opponent",
          count: "all",
        },
      },
      id: "xse-1",
      name: "SKIP THE DRAMA, STAY WITH MAMA",
      text: "SKIP THE DRAMA, STAY WITH MAMA While this character is exerted, opposing characters can't quest.",
      type: "static",
    },
  ],
  i18n: motherGothelSelfishManipulatorI18n,
};
