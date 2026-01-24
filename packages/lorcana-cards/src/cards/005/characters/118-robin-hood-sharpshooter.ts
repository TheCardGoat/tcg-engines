import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodSharpshooter: CharacterCard = {
  id: "1w7",
  cardType: "character",
  name: "Robin Hood",
  version: "Sharpshooter",
  fullName: "Robin Hood - Sharpshooter",
  inkType: ["ruby"],
  franchise: "Robin Hood",
  set: "005",
  text: "MY GREATEST PERFORMANCE Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 118,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f66d5ab4d3a54fec003c4f80526a7a6667ce7c86",
  },
  abilities: [
    {
      id: "1w7-1",
      type: "triggered",
      name: "MY GREATEST PERFORMANCE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
        },
        chooser: "CONTROLLER",
      },
      text: "MY GREATEST PERFORMANCE Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
