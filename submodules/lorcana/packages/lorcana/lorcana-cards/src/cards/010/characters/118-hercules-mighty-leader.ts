import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesMightyLeaderI18n } from "./118-hercules-mighty-leader.i18n";

export const herculesMightyLeader: CharacterCard = {
  id: "xm6",
  canonicalId: "ci_xm6",
  reprints: ["set10-118"],
  cardType: "character",
  name: "Hercules",
  version: "Mighty Leader",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "010",
  cardNumber: 118,
  rarity: "legendary",
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_ee4bc5f80eb74a19b749e0b31be7d920",
    tcgPlayer: 660037,
  },
  text: [
    {
      title: "EVER VIGILANT",
      description: "This character can't be dealt damage unless he's being challenged.",
    },
    {
      title: "EVER VALIANT",
      description:
        "While this character is exerted, your other Hero characters can't be dealt damage unless they're being challenged.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince", "Deity"],
  abilities: [
    {
      id: "xm6-1",
      name: "EVER VIGILANT",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-be-dealt-damage",
        target: "SELF",
        condition: {
          type: "not",
          condition: {
            type: "being-challenged",
          },
        },
      },
      text: "EVER VIGILANT This character can't be dealt damage unless he's being challenged.",
    },
    {
      id: "xm6-2",
      name: "EVER VALIANT",
      type: "static",
      condition: {
        type: "exerted",
      },
      effect: {
        type: "restriction",
        restriction: "cant-be-dealt-damage",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filter: [{ type: "has-classification", classification: "Hero" }],
        },
        condition: {
          type: "not",
          condition: {
            type: "being-challenged",
          },
        },
      },
      text: "EVER VALIANT While this character is exerted, your other Hero characters can't be dealt damage unless they're being challenged.",
    },
  ],
  i18n: herculesMightyLeaderI18n,
};
