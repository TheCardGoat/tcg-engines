import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyEmeraldChampion: CharacterCard = {
  abilities: [
    {
      effect: {
        target: "challenging-character",
        type: "banish",
      },
      id: "bau-1",
      name: "EVEN THE SCORE",
      text: "EVEN THE SCORE Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.",
      trigger: {
        challengeContext: {
          role: "defender",
        },
        challengeContext: {
          role: "defender",
        },
        event: "banish-in-challenge",
        on: {
          controller: "you",
          excludeSelf: true,
        },
      },
      type: "triggered",
    },
    {
      effect: {
        keyword: "Ward",
        target: {
          count: "all",
          excludeSelf: true,
          filter: [{ owner: "you", type: "owner" }],
          selector: "all",
        },
        type: "gain-keyword",
      },
      id: "bau-2",
      name: "PROVIDE COVER",
      text: "PROVIDE COVER Your other Emerald characters gain Ward.",
      type: "static",
    },
  ],
  cardNumber: 91,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "28bab6167da4c29d12d6021e7e28f3cf48449adb",
  },
  fullName: "Goofy - Emerald Champion",
  id: "bau",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  name: "Goofy",
  set: "010",
  strength: 3,
  text: "EVEN THE SCORE Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.\nPROVIDE COVER Your other Emerald characters gain Ward. (Opponents can't choose them except to challenge.)",
  version: "Emerald Champion",
  willpower: 5,
};
