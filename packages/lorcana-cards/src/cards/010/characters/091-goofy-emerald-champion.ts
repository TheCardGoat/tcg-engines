import type { CharacterCard } from "@tcg/lorcana";

export const goofyEmeraldChampion: CharacterCard = {
  id: "bau",
  cardType: "character",
  name: "Goofy",
  version: "Emerald Champion",
  fullName: "Goofy - Emerald Champion",
  inkType: ["emerald"],
  set: "010",
  text: "EVEN THE SCORE Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.\nPROVIDE COVER Your other Emerald characters gain Ward. (Opponents can't choose them except to challenge.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 91,
  inkable: false,
  externalIds: {
    ravensburger: "28bab6167da4c29d12d6021e7e28f3cf48449adb",
  },
  abilities: [
    {
      id: "bau-1",
      text: "EVEN THE SCORE Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.",
      name: "EVEN THE SCORE",
      type: "triggered",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: {
          filters: [
            { type: "owner", owner: "you" },
            { type: "challenge-role", role: "defender" },
            { type: "source", ref: "other" },
          ],
        },
      },
      effect: {
        type: "banish",
        target: {
          selector: "all",
          count: "all",
          filter: [{ type: "challenge-role", role: "attacker" }],
        },
      },
    },
    {
      id: "bau-2",
      text: "PROVIDE COVER Your other Emerald characters gain Ward.",
      name: "PROVIDE COVER",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: {
          selector: "all",
          count: "all",
          filter: [
            { type: "owner", owner: "you" },
            { type: "source", ref: "other" },
          ],
        },
      },
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
