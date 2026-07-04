import type { CharacterCard } from "@tcg/lorcana-types";
import { maximusRelentlessStallionI18n } from "./195-maximus-relentless-stallion.i18n";

export const maximusRelentlessStallion: CharacterCard = {
  id: "jjL",
  canonicalId: "ci_b1z",
  slug: "lorcana-ci_b1z",
  printings: [
    {
      id: "set13-195",
      artId: "set13-195",
      setCode: "set13",
      collectorNumber: "195",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-195"],
  cardType: "character",
  name: "Maximus",
  version: "Relentless Stallion",
  inkType: ["steel"],
  franchise: "Tangled",
  set: "013",
  cardNumber: 195,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_7c8493ace81246c7b30a1e0536eea674",
  },
  text: [
    {
      title: "NO ESCAPE",
      description:
        "If you discarded a card this turn, this character gains Challenger +2 and can challenge ready characters this turn. (They get +2 strength while challenging.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "static",
      name: "NO ESCAPE",
      text: "NO ESCAPE If you discarded a card this turn, this character gains Challenger +2 and can challenge ready characters this turn.",
      condition: {
        type: "turn-metric",
        metric: "discard-cards-entered",
        ownerScope: "you",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 2,
        target: "SELF",
        duration: "this-turn",
      },
    },
    {
      type: "static",
      name: "NO ESCAPE",
      text: "NO ESCAPE If you discarded a card this turn, this character gains Challenger +2 and can challenge ready characters this turn.",
      condition: {
        type: "turn-metric",
        metric: "discard-cards-entered",
        ownerScope: "you",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "grant-ability",
        ability: "can-challenge-ready",
        target: "SELF",
        duration: "this-turn",
      },
    },
  ],
  i18n: maximusRelentlessStallionI18n,
};
