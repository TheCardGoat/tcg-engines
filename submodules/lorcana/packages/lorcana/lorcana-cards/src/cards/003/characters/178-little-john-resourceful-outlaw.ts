import type { CharacterCard } from "@tcg/lorcana-types";
import { littleJohnResourcefulOutlawI18n } from "./178-little-john-resourceful-outlaw.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const littleJohnResourcefulOutlaw: CharacterCard = {
  id: "qJp",
  canonicalId: "ci_qJp",
  reprints: ["set3-178"],
  cardType: "character",
  name: "Little John",
  version: "Resourceful Outlaw",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 178,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_71fd1d1099c9451393725c4afa6ca274",
    tcgPlayer: 537943,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "OKAY, BIG SHOT",
      description:
        "While this character is exerted, your characters with Bodyguard gain Resist +1 and get +1 {L}.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(4),
    {
      condition: {
        type: "exerted",
      },
      effect: {
        keyword: "Resist",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "has-keyword", keyword: "Bodyguard" }],
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "kck-2",
      name: "OKAY, BIG SHOT",
      text: "OKAY, BIG SHOT While this character is exerted, your characters with Bodyguard gain Resist +1 and get +1 {L}.",
      type: "static",
    },
    {
      condition: {
        type: "exerted",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "has-keyword", keyword: "Bodyguard" }],
        },
        type: "modify-stat",
      },
      id: "kck-3",
      name: "OKAY, BIG SHOT",
      text: "OKAY, BIG SHOT While this character is exerted, your characters with Bodyguard gain Resist +1 and get +1 {L}.",
      type: "static",
    },
  ],
  i18n: littleJohnResourcefulOutlawI18n,
};
