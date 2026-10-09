import type { CharacterCard } from "@tcg/lorcana-types";
import { winnieThePoohHunnyArchmageEpicI18n } from "./212-winnie-the-pooh-hunny-archmage-epic.i18n";

export const winnieThePoohHunnyArchmageEpic: CharacterCard = {
  id: "5p0",
  canonicalId: "ci_FIF",
  slug: "lorcana-ci_FIF",
  printings: [
    {
      id: "set13-212-epic",
      artId: "ci_FIF-epic",
      setCode: "set13",
      collectorNumber: "212",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set13-040"],
  cardType: "character",
  name: "Winnie the Pooh",
  version: "Hunny Archmage",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 212,
  rarity: "epic",
  specialRarity: "epic",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_82dcfa6128384ac2b40f0fcedee35777",
    tcgPlayer: "702678",
  },
  text: [
    {
      title: "STICK TOGETHER",
      description:
        "While you have 2 or more other Hunny characters in play, this character gets +2 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Sorcerer", "Hunny"],
  abilities: [
    {
      type: "static",
      name: "STICK TOGETHER",
      text: "STICK TOGETHER While you have 2 or more other Hunny characters in play, this character gets +2 {L}.",
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 2,
        classification: "Hunny",
        excludeSelf: true,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  i18n: winnieThePoohHunnyArchmageEpicI18n,
};
