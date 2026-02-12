import type { CharacterCard } from "@tcg/lorcana-types";

export const maxGoofChartTopper: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "iz6-1",
      keyword: "Shift",
      text: "Shift 4 {I}",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      id: "iz6-2",
      name: "NUMBER ONE HIT",
      text: "NUMBER ONE HIT Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 77,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "4464e161e9005aebccdd3136b9446adeb92d8d6d",
  },
  franchise: "Goofy Movie",
  fullName: "Max Goof - Chart Topper",
  id: "iz6",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Max Goof",
  set: "009",
  strength: 4,
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Max Goof.)\nNUMBER ONE HIT Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.",
  version: "Chart Topper",
  willpower: 5,
};
