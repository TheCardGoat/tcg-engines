import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckUncleMoneybags: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "ekh-1",
      name: "TREASURE FINDER",
      text: "TREASURE FINDER Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 155,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "34821210949db285beda99fc388fae434447385b",
  },
  franchise: "Ducktales",
  fullName: "Scrooge McDuck - Uncle Moneybags",
  id: "ekh",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Scrooge McDuck",
  set: "003",
  strength: 1,
  text: "TREASURE FINDER Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
  version: "Uncle Moneybags",
  willpower: 3,
};
