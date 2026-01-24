import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphBigLug: CharacterCard = {
  id: "1ic",
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Big Lug",
  fullName: "Wreck-It Ralph - Big Lug",
  inkType: ["amber", "ruby"],
  franchise: "Wreck It Ralph",
  set: "008",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Wreck-It Ralph.)\nBACK ON TRACK When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.",
  cost: 7,
  strength: 7,
  willpower: 5,
  lore: 1,
  cardNumber: 24,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "c3d8abe27b7eb16bd2601664dd5ab481885277c1",
  },
  abilities: [
    {
      id: "1ic-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "1ic-2",
      type: "triggered",
      name: "BACK ON TRACK When you play this character and",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "return-to-hand",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            chooser: "CONTROLLER",
          },
          {
            type: "gain-lore",
            amount: 1,
          },
        ],
      },
      text: "BACK ON TRACK When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Racer"],
};
