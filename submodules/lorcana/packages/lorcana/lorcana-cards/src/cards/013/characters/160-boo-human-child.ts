import type { CharacterCard } from "@tcg/lorcana-types";
import { booHumanChildI18n } from "./160-boo-human-child.i18n";

export const booHumanChild: CharacterCard = {
  id: "aJj",
  canonicalId: "ci_aJj",
  slug: "lorcana-ci_aJj",
  printings: [
    {
      id: "set13-160",
      artId: "set13-160",
      setCode: "set13",
      collectorNumber: "160",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-160"],
  cardType: "character",
  name: "Boo",
  version: "Human Child",
  inkType: ["sapphire"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 160,
  rarity: "rare",
  cost: 1,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a20b4ff3bdc54782b01f21cfb663ea60",
  },
  text: [
    {
      title: "MAKING MEMORIES",
      description: "While you have 5 or more cards in your inkwell, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "aJj-1",
      name: "MAKING MEMORIES",
      type: "static",
      text: "MAKING MEMORIES While you have 5 or more cards in your inkwell, this character gets +2 {L}.",
      condition: {
        type: "resource-count",
        what: "cards-in-inkwell",
        controller: "you",
        comparison: "greater-or-equal",
        value: 5,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  i18n: booHumanChildI18n,
};
