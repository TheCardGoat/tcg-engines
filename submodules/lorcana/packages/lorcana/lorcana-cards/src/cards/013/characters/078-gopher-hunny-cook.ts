import type { CharacterCard } from "@tcg/lorcana-types";
import { gopherHunnyCookI18n } from "./078-gopher-hunny-cook.i18n";

export const gopherHunnyCook: CharacterCard = {
  id: "Fk5",
  canonicalId: "ci_Fk5",
  slug: "lorcana-ci_Fk5",
  printings: [
    {
      id: "set13-078",
      artId: "set13-078",
      setCode: "set13",
      collectorNumber: "78",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-078"],
  cardType: "character",
  name: "Gopher",
  version: "Hunny Cook",
  inkType: ["emerald"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 78,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_2775897b3f6f41599550c6264cc831a2",
  },
  text: [
    {
      title: "DOWN THE HOLE",
      description: "This character may enter play exerted.",
    },
    {
      title: "FORTIFYING MEAL",
      description:
        "During an opponent's turn, while this character is exerted, your other Hunny characters gain Resist +1.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Hunny"],
  abilities: [
    {
      id: "Fk5-1",
      name: "DOWN THE HOLE",
      type: "static",
      text: "DOWN THE HOLE This character may enter play exerted.",
      effect: {
        type: "restriction",
        restriction: "may-enter-play-exerted",
        target: "SELF",
      },
    },
    {
      id: "Fk5-2",
      name: "FORTIFYING MEAL",
      type: "static",
      text: "FORTIFYING MEAL During an opponent's turn, while this character is exerted, your other Hunny characters gain Resist +1.",
      condition: {
        type: "and",
        conditions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
          {
            type: "is-exerted",
          },
        ],
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filters: [
            {
              type: "has-classification",
              classification: "Hunny",
            },
          ],
        },
      },
    },
  ],
  i18n: gopherHunnyCookI18n,
};
