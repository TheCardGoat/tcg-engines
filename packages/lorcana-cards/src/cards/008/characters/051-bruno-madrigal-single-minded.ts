import type { CharacterCard } from "@tcg/lorcana-types";

export const brunoMadrigalSingleminded: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        restriction: "cant-ready",
        target: "SELF",
        type: "restriction",
      },
      id: "1a1-1",
      name: "STANDING TALL",
      text: "STANDING TALL When you play this character, chosen opposing character can't ready at the start of their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 51,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 4,
  externalIds: {
    ravensburger: "a7994847594176243295b27ad0e85c4d38457cfc",
  },
  franchise: "Encanto",
  fullName: "Bruno Madrigal - Single-Minded",
  id: "1a1",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Bruno Madrigal",
  set: "008",
  strength: 3,
  text: "STANDING TALL When you play this character, chosen opposing character can't ready at the start of their next turn.",
  version: "Single-Minded",
  willpower: 4,
};
