import type { CharacterCard } from "@tcg/lorcana-types";
import { annaBravingTheStormEpicI18n } from "./218-anna-braving-the-storm-epic.i18n";

export const annaBravingTheStormEpic: CharacterCard = {
  id: "ngx",
  canonicalId: "ci_fSd",
  slug: "lorcana-ci_fSd",
  printings: [
    {
      id: "set9-218-epic",
      artId: "ci_fSd-epic",
      setCode: "set9",
      collectorNumber: "218",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set4-137", "set9-146"],
  cardType: "character",
  name: "Anna",
  version: "Braving the Storm",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "009",
  cardNumber: 218,
  rarity: "common",
  specialRarity: "epic",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d911158c4175449e9814484f3c5adb06",
    tcgPlayer: "650153",
  },
  text: [
    {
      title: "I WAS BORN READY",
      description: "While you have another Hero character in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen"],
  abilities: [
    {
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
      condition: {
        type: "has-character-count",
        classification: "Hero",
        controller: "you",
        count: 2,
        comparison: "greater-or-equal",
      },
      id: "mi9-1",
      name: "I WAS BORN READY",
      text: "I WAS BORN READY While you have another Hero character in play, this character gets +1 {L}.",
    },
  ],
  i18n: annaBravingTheStormEpicI18n,
};
