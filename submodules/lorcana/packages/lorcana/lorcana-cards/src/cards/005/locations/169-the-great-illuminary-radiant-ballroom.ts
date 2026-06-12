import type { LocationCard } from "@tcg/lorcana-types";
import { theGreatIlluminaryRadiantBallroomI18n } from "./169-the-great-illuminary-radiant-ballroom.i18n";

export const theGreatIlluminaryRadiantBallroom: LocationCard = {
  id: "FUQ",
  canonicalId: "ci_FUQ",
  reprints: ["set5-169"],
  cardType: "location",
  name: "The Great Illuminary",
  version: "Radiant Ballroom",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 169,
  rarity: "rare",
  cost: 3,
  willpower: 9,
  moveCost: 2,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_5b27a13096a24ba4af338df7a19a358f",
    tcgPlayer: 555275,
  },
  text: [
    {
      title: "WARM WELCOME",
      description: "Characters with Support get +1 {L} and +2 {W} while here.",
    },
  ],
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
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
              type: "has-keyword",
              keyword: "Support",
            },
          ],
        },
        type: "modify-stat",
      },
      id: "bsq-1",
      name: "WARM WELCOME",
      text: "WARM WELCOME Characters with Support get +1 {L} and +2 {W} while here.",
      type: "static",
    },
    {
      effect: {
        modifier: 2,
        stat: "willpower",
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
              type: "has-keyword",
              keyword: "Support",
            },
          ],
        },
        type: "modify-stat",
      },
      id: "bsq-2",
      name: "WARM WELCOME",
      text: "WARM WELCOME Characters with Support get +1 {L} and +2 {W} while here.",
      type: "static",
    },
  ],
  i18n: theGreatIlluminaryRadiantBallroomI18n,
};
