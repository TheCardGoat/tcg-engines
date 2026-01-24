import type { CharacterCard } from "@tcg/lorcana-types";

export const scuttleExpertOnHumans: CharacterCard = {
  id: "dpt",
  cardType: "character",
  name: "Scuttle",
  version: "Expert on Humans",
  fullName: "Scuttle - Expert on Humans",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "LET ME SEE When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 154,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "31704def1d802226e01db38740244b78a7210207",
  },
  abilities: [
    {
      id: "dpt-1",
      type: "triggered",
      name: "LET ME SEE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "LET ME SEE When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
