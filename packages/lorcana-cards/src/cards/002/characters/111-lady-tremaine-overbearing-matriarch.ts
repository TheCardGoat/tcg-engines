import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineOverbearingMatriarch: CharacterCard = {
  id: "r0v",
  cardType: "character",
  name: "Lady Tremaine",
  version: "Overbearing Matriarch",
  fullName: "Lady Tremaine - Overbearing Matriarch",
  inkType: ["ruby"],
  franchise: "Cinderella",
  set: "002",
  text: "NOT FOR YOU When you play this character, each opponent with more lore than you loses 1 lore.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 111,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "6165fc64a0e304e3d44cc5ec4ec2c07b6c24207c",
  },
  abilities: [
    {
      id: "r0v-1",
      type: "triggered",
      name: "NOT FOR YOU",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      text: "NOT FOR YOU When you play this character, each opponent with more lore than you loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
