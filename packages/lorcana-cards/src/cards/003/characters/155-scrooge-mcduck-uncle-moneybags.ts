import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckUncleMoneybags: CharacterCard = {
  id: "ekh",
  cardType: "character",
  name: "Scrooge McDuck",
  version: "Uncle Moneybags",
  fullName: "Scrooge McDuck - Uncle Moneybags",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  text: "TREASURE FINDER Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 155,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "34821210949db285beda99fc388fae434447385b",
  },
  abilities: [
    {
      id: "ekh-1",
      type: "triggered",
      name: "TREASURE FINDER",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "TREASURE FINDER Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
