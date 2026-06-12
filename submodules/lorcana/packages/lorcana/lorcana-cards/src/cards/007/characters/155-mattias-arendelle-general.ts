import type { CharacterCard } from "@tcg/lorcana-types";
import { mattiasArendelleGeneralI18n } from "./155-mattias-arendelle-general.i18n";

export const mattiasArendelleGeneral: CharacterCard = {
  id: "YLV",
  canonicalId: "ci_YLV",
  reprints: ["set7-155"],
  cardType: "character",
  name: "Mattias",
  version: "Arendelle General",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "007",
  cardNumber: 155,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f9e60e9ffff4477d8c4715bd38fb90a2",
    tcgPlayer: 619494,
  },
  text: [
    {
      title: "PROUD TO SERVE",
      description: "Your Queen characters gain Ward.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Knight"],
  abilities: [
    {
      effect: {
        keyword: "Ward",
        target: "YOUR_QUEEN_CHARACTERS",
        type: "gain-keyword",
      },
      id: "f9s-1",
      name: "PROUD TO SERVE",
      text: "PROUD TO SERVE Your Queen characters gain Ward.",
      type: "static",
    },
  ],
  i18n: mattiasArendelleGeneralI18n,
};
