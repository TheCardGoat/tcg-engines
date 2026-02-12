import type { CharacterCard } from "@tcg/lorcana-types";

export const scuttleExpertOnHumans: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CHOSEN_CHARACTER",
          type: "put-on-bottom",
        },
        type: "optional",
      },
      id: "dpt-1",
      name: "LET ME SEE",
      text: "LET ME SEE When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 154,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "31704def1d802226e01db38740244b78a7210207",
  },
  franchise: "Little Mermaid",
  fullName: "Scuttle - Expert on Humans",
  id: "dpt",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Scuttle",
  set: "004",
  strength: 1,
  text: "LET ME SEE When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Expert on Humans",
  willpower: 3,
};
