import type { ItemCard } from "@tcg/lorcana-types";
import { musketeerTabardI18n } from "./203-musketeer-tabard.i18n";

export const musketeerTabard: ItemCard = {
  id: "Srb",
  canonicalId: "ci_Srb",
  reprints: ["set1-203"],
  cardType: "item",
  name: "Musketeer Tabard",
  inkType: ["steel"],
  set: "001",
  cardNumber: 203,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_540aa5414bc94516a563bab640ced601",
    tcgPlayer: 505951,
  },
  text: [
    {
      title: "ALL FOR ONE AND ONE FOR ALL",
      description:
        "Whenever one of your characters with Bodyguard is banished, you may draw a card.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "8a5-1",
      name: "ALL FOR ONE AND ONE FOR ALL",
      text: "ALL FOR ONE AND ONE FOR ALL Whenever one of your characters with Bodyguard is banished, you may draw a card.",
      trigger: {
        event: "banish",
        on: {
          controller: "you",
          cardType: "character",
          hasKeyword: "Bodyguard",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: musketeerTabardI18n,
};
