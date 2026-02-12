import type { CharacterCard } from "@tcg/lorcana-types";

export const annaIceBreaker: CharacterCard = {
  abilities: [
    {
      id: "pj2-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        duration: "until-start-of-next-turn",
        restriction: "cant-ready",
        target: "SELF",
        type: "restriction",
      },
      id: "pj2-2",
      name: "WINTER AMBUSH",
      text: "WINTER AMBUSH When you play this character, chosen opposing character can't ready at the start of their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 72,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "5c027c79eedd9a761d4497187cd38ba25c697de4",
  },
  franchise: "Frozen",
  fullName: "Anna - Ice Breaker",
  id: "pj2",
  inkType: ["amethyst", "sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Anna",
  set: "007",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nWINTER AMBUSH When you play this character, chosen opposing character can't ready at the start of their next turn.",
  version: "Ice Breaker",
  willpower: 3,
};
