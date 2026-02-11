import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphBigLug: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1ic-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
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
      id: "1ic-2",
      name: "BACK ON TRACK When you play this character and",
      text: "BACK ON TRACK When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 24,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Racer"],
  cost: 7,
  externalIds: {
    ravensburger: "c3d8abe27b7eb16bd2601664dd5ab481885277c1",
  },
  franchise: "Wreck It Ralph",
  fullName: "Wreck-It Ralph - Big Lug",
  id: "1ic",
  inkType: ["amber", "ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Wreck-It Ralph",
  set: "008",
  strength: 7,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Wreck-It Ralph.)\nBACK ON TRACK When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.",
  version: "Big Lug",
  willpower: 5,
};
