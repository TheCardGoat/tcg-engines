import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoVigilantTravelerI18n } from "./025-pluto-vigilant-traveler.i18n";

export const plutoVigilantTraveler: CharacterCard = {
  id: "Tm0",
  canonicalId: "ci_Tm0",
  reprints: ["set12-025"],
  cardType: "character",
  name: "Pluto",
  version: "Vigilant Traveler",
  inkType: ["amber"],
  set: "012",
  cardNumber: 25,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_49511c0b9e594c4ca7a0e38fa31ede19",
  },
  text: [
    {
      title: "BEWARE OF DOG",
      description:
        "Whenever this character quests, if you played another character this turn, chosen opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "Tm0-1",
      name: "BEWARE OF DOG",
      type: "triggered",
      text: "BEWARE OF DOG Whenever this character quests, if you played another character this turn, chosen opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "turn-metric",
        metric: "played-character-with-classification",
        excludeSource: true,
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "until-start-of-next-turn",
      },
    },
  ],
  i18n: plutoVigilantTravelerI18n,
};
