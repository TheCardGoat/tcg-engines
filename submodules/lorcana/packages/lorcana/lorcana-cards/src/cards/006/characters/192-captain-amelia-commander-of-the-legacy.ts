import type { CharacterCard } from "@tcg/lorcana-types";
import { captainAmeliaCommanderOfTheLegacyI18n } from "./192-captain-amelia-commander-of-the-legacy.i18n";

export const captainAmeliaCommanderOfTheLegacy: CharacterCard = {
  id: "2tR",
  canonicalId: "ci_OsQ",
  reprints: ["set6-192"],
  cardType: "character",
  name: "Captain Amelia",
  version: "Commander of the Legacy",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 192,
  rarity: "common",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_eb10018264004dc59f9bf0f31295d757",
    tcgPlayer: 592014,
  },
  text: [
    {
      title: "DRIVELING GALOOTS",
      description: "This character can't be challenged by Pirate characters.",
    },
    {
      title: "EVERYTHING SHIPSHAPE",
      description: "While being challenged, your other characters gain Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien", "Captain"],
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
        challengerFilter: {
          type: "has-classification",
          classification: "Pirate",
        },
      },
      id: "1ln-1",
      name: "DRIVELING GALOOTS",
      text: "DRIVELING GALOOTS This character can't be challenged by Pirate characters.",
      type: "static",
    },
    {
      effect: {
        keyword: "Resist",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filter: [
            {
              type: "challenge-role",
              role: "defender",
            },
          ],
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "1ln-2",
      name: "EVERYTHING SHIPSHAPE",
      text: "EVERYTHING SHIPSHAPE While being challenged, your other characters gain Resist +1.",
      type: "static",
    },
  ],
  i18n: captainAmeliaCommanderOfTheLegacyI18n,
};
