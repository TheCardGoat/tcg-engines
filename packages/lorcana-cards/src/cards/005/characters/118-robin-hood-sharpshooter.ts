import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodSharpshooter: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
        },
        chooser: "CONTROLLER",
      },
      id: "1w7-1",
      name: "MY GREATEST PERFORMANCE",
      text: "MY GREATEST PERFORMANCE Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 118,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "f66d5ab4d3a54fec003c4f80526a7a6667ce7c86",
  },
  franchise: "Robin Hood",
  fullName: "Robin Hood - Sharpshooter",
  id: "1w7",
  inkType: ["ruby"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Robin Hood",
  set: "005",
  strength: 1,
  text: "MY GREATEST PERFORMANCE Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.",
  version: "Sharpshooter",
  willpower: 4,
};
