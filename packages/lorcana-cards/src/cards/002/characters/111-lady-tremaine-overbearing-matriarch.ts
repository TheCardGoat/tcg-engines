import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineOverbearingMatriarch: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      id: "r0v-1",
      name: "NOT FOR YOU",
      text: "NOT FOR YOU When you play this character, each opponent with more lore than you loses 1 lore.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 111,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 2,
  externalIds: {
    ravensburger: "6165fc64a0e304e3d44cc5ec4ec2c07b6c24207c",
  },
  franchise: "Cinderella",
  fullName: "Lady Tremaine - Overbearing Matriarch",
  id: "r0v",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Lady Tremaine",
  set: "002",
  strength: 2,
  text: "NOT FOR YOU When you play this character, each opponent with more lore than you loses 1 lore.",
  version: "Overbearing Matriarch",
  willpower: 2,
};
