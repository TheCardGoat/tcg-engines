import type { LocationCard } from "@tcg/lorcana-types";
import { theIslandOfNomanisanSyndromesHeadquartersI18n } from "./204-the-island-of-nomanisan-syndromes-headquarters.i18n";

export const theIslandOfNomanisanSyndromesHeadquarters: LocationCard = {
  id: "mXi",
  canonicalId: "ci_mXi",
  reprints: ["set12-204"],
  cardType: "location",
  name: "The Island of Nomanisan",
  version: "Syndrome's Headquarters",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 204,
  rarity: "rare",
  cost: 3,
  willpower: 6,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0970bfa5f6e24f108baff292de83fcb5",
  },
  text: [
    {
      title: "RESEARCH",
      description: "& DEVELOPMENT Robot characters get +1 {S} and +1 {W} while here.",
    },
    {
      title: "CHEAP SHOT",
      description:
        "Once during your turn, whenever a character banishes another character in a challenge while here, you may deal 2 damage to chosen character.",
    },
  ],
  abilities: [
    {
      id: "mXi-1",
      name: "RESEARCH & DEVELOPMENT",
      text: "RESEARCH & DEVELOPMENT Robot characters get +1 {S} and +1 {W} while here.",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
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
              classification: "Robot",
            },
          ],
        },
      },
    },
    {
      id: "mXi-2",
      name: "RESEARCH & DEVELOPMENT",
      text: "RESEARCH & DEVELOPMENT Robot characters get +1 {S} and +1 {W} while here.",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 1,
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
              classification: "Robot",
            },
          ],
        },
      },
    },
    {
      id: "mXi-3",
      name: "CHEAP SHOT",
      text: "CHEAP SHOT Once during your turn, whenever a character banishes another character in a challenge while here, you may deal 2 damage to chosen character.",
      type: "triggered",
      trigger: {
        event: "banish-in-challenge",
        on: "CHARACTERS_HERE",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
  i18n: theIslandOfNomanisanSyndromesHeadquartersI18n,
};
