import type { CharacterCard } from "@tcg/lorcana-types";

export const maxGoofChartTopper: CharacterCard = {
  id: "iz6",
  cardType: "character",
  name: "Max Goof",
  version: "Chart Topper",
  fullName: "Max Goof - Chart Topper",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Max Goof.)\nNUMBER ONE HIT Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 77,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4464e161e9005aebccdd3136b9446adeb92d8d6d",
  },
  abilities: [
    {
      id: "iz6-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4 {I}",
    },
    {
      id: "iz6-2",
      type: "triggered",
      name: "NUMBER ONE HIT",
      trigger: {
        event: "quest",
        timing: "whenever",
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
      text: "NUMBER ONE HIT Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
