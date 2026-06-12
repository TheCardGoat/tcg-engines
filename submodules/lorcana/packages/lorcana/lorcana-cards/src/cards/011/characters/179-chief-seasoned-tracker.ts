import type { CharacterCard } from "@tcg/lorcana-types";
import { chiefSeasonedTrackerI18n } from "./179-chief-seasoned-tracker.i18n";

export const chiefSeasonedTracker: CharacterCard = {
  id: "pkL",
  canonicalId: "ci_pkL",
  reprints: ["set11-179"],
  cardType: "character",
  name: "Chief",
  version: "Seasoned Tracker",
  inkType: ["steel"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 179,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a26bf7d81173483589a2df5446ab1ec0",
    tcgPlayer: 673740,
  },
  text: [
    {
      title: "GOOD RIDDANCE",
      description:
        "{E} — If an opposing character was banished in a challenge this turn, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1cy-1",
      name: "GOOD RIDDANCE",
      cost: {
        exert: true,
      },
      condition: {
        type: "banished-in-challenge-this-turn",
        owner: "opponent",
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      type: "activated",
      text: "GOOD RIDDANCE {E} — If an opposing character was banished in a challenge this turn, draw a card.",
    },
  ],
  i18n: chiefSeasonedTrackerI18n,
};
