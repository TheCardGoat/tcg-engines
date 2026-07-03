import type { CharacterCard } from "@tcg/lorcana-types";
import { winnieThePoohHunnyArchmageI18n } from "./040-winnie-the-pooh-hunny-archmage.i18n";

export const winnieThePoohHunnyArchmage: CharacterCard = {
  id: "FIF",
  canonicalId: "ci_FIF",
  slug: "lorcana-ci_FIF",
  printings: [
    {
      id: "set13-040",
      artId: "set13-040",
      setCode: "set13",
      collectorNumber: "40",
      rarity: "common",
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
  cardNumber: 40,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_82dcfa6128384ac2b40f0fcedee35777",
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
  i18n: winnieThePoohHunnyArchmageI18n,
};
