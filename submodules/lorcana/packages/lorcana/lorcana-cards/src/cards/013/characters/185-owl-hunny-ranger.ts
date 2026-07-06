import type { CharacterCard } from "@tcg/lorcana-types";
import { owlHunnyRangerI18n } from "./185-owl-hunny-ranger.i18n";

export const owlHunnyRanger: CharacterCard = {
  id: "dxV",
  canonicalId: "ci_dxV",
  slug: "lorcana-ci_dxV",
  printings: [
    {
      id: "set13-185",
      artId: "set13-185",
      setCode: "set13",
      collectorNumber: "185",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-185"],
  cardType: "character",
  name: "Owl",
  version: "Hunny Ranger",
  inkType: ["steel"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 185,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fa4a259a62de4ec18ae91b46b4e93c25",
  },
  text: [
    {
      title: "HUNNY ALLIANCE",
      description:
        "While you have another Hunny character in play, this character gains Resist +2.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Hunny"],
  abilities: [
    {
      type: "static",
      name: "HUNNY ALLIANCE",
      text: "HUNNY ALLIANCE While you have another Hunny character in play, this character gains Resist +2.",
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 1,
        classification: "Hunny",
        excludeSelf: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        target: "SELF",
      },
    },
  ],
  i18n: owlHunnyRangerI18n,
};
