import type { CharacterCard } from "@tcg/lorcana-types";
import { yokaiIntellectualSchemerI18n } from "./097-yokai-intellectual-schemer.i18n";

export const yokaiIntellectualSchemer: CharacterCard = {
  id: "zT9",
  canonicalId: "ci_zT9",
  reprints: ["set7-097"],
  cardType: "character",
  name: "Yokai",
  version: "Intellectual Schemer",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  cardNumber: 97,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f9a3516262004948b7bd488cc55af5b9",
    tcgPlayer: 618139,
  },
  text: [
    {
      title: "INNOVATE",
      description: "You pay 1 {I} less to play characters using their Shift ability.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Inventor"],
  abilities: [
    {
      id: "8zk-1",
      name: "INNOVATE",
      type: "static",
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
        playMethod: "shift",
      },
      text: "INNOVATE You pay 1 {I} less to play characters using their Shift ability.",
    },
  ],
  i18n: yokaiIntellectualSchemerI18n,
};
