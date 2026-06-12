import type { CharacterCard } from "@tcg/lorcana-types";
import { littleJohnRobinsPalI18n } from "./179-little-john-robins-pal.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const littleJohnRobinsPal: CharacterCard = {
  id: "9Mk",
  canonicalId: "ci_9Mk",
  reprints: ["set3-179"],
  cardType: "character",
  name: "Little John",
  version: "Robin's Pal",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 179,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_95f558d0b08e47cf9c92c57a7719f874",
    tcgPlayer: 539108,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "DISGUISED",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    bodyguard,
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1ta-2",
      name: "DISGUISED",
      text: "DISGUISED During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: littleJohnRobinsPalI18n,
};
