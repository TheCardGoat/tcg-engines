import type { CharacterCard } from "@tcg/lorcana-types";
import { fatCatCriminalBusinessmanI18n } from "./187-fat-cat-criminal-businessman.i18n";

export const fatCatCriminalBusinessman: CharacterCard = {
  id: "Cui",
  canonicalId: "ci_Cui",
  slug: "lorcana-ci_Cui",
  printings: [
    {
      id: "set12-187",
      artId: "set12-187",
      setCode: "set12",
      collectorNumber: "187",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set12-187"],
  cardType: "character",
  name: "Fat Cat",
  version: "Criminal Businessman",
  inkType: ["steel"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 187,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c013142af45943e4b43314298fc1a043",
    tcgPlayer: "692197",
  },
  text: [
    {
      title: "WORTHY INVESTMENT",
      description: "Your locations gain Resist +1.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
  abilities: [
    {
      id: "187-1",
      name: "WORTHY INVESTMENT",
      text: "WORTHY INVESTMENT Your locations gain Resist +1.",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["location"],
        },
      },
    },
  ],
  i18n: fatCatCriminalBusinessmanI18n,
};
