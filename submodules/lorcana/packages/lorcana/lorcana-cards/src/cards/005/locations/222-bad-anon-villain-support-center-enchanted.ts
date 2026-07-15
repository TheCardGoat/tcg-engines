import type { LocationCard } from "@tcg/lorcana-types";
import { badanonVillainSupportCenterEnchantedI18n } from "./222-bad-anon-villain-support-center-enchanted.i18n";

export const badanonVillainSupportCenterEnchanted: LocationCard = {
  id: "UAt",
  canonicalId: "ci_Uqb",
  slug: "lorcana-ci_Uqb",
  printings: [
    {
      id: "set5-222-enchanted",
      artId: "ci_Uqb-enchanted",
      setCode: "set5",
      collectorNumber: "222",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set5-203"],
  cardType: "location",
  name: "Bad-Anon",
  version: "Villain Support Center",
  inkType: ["steel"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 222,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  willpower: 7,
  moveCost: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c88d044f605440a29cbf41b7cdc7d340",
    tcgPlayer: "561978",
  },
  text: [
    {
      title: "THERE'S NO ONE I'D RATHER BE THAN ME",
      description:
        'Villain characters gain "{E}, 3 {I} — Play a character with the same name as this character for free" while here.',
    },
  ],
  abilities: [
    {
      effect: {
        type: "grant-abilities-while-here",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "same-location-as-source",
            },
            {
              type: "has-classification",
              classification: "Villain",
            },
          ],
        },
        abilities: [
          {
            id: "1kj-1a",
            name: "THERE'S NO ONE I'D RATHER BE THAN ME",
            text: "{E}, 3 {I} — Play a character with the same name as this character for free.",
            type: "activated",
            cost: {
              exert: true,
              ink: 3,
            },
            effect: {
              cardType: "character",
              cost: "free",
              from: "hand",
              filter: {
                cardType: "character",
                sameNameAsSource: true,
              },
              type: "play-card",
            },
          },
        ],
      },
      id: "1kj-1",
      name: "THERE'S NO ONE I'D RATHER BE THAN ME",
      text: "THERE'S NO ONE I'D RATHER BE THAN ME Villain characters gain “{E}, 3 {I} — Play a character with the same name as this character for free” while here.",
      type: "static",
    },
  ],
  i18n: badanonVillainSupportCenterEnchantedI18n,
};
