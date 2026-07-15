import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchAlienBuccaneer: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "19n-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        from: "discard",
        type: "play-card",
      },
      id: "19n-2",
      name: "READY FOR ACTION",
      text: "READY FOR ACTION When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 72,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Alien", "Pirate"],
  cost: 4,
  externalIds: {
    ravensburger: "a47fda64f881fde3e3a374f0e76152127d4c47e4",
  },
  franchise: "Lilo and Stitch",
  fullName: "Stitch - Alien Buccaneer",
  id: "19n",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Stitch",
  set: "006",
  strength: 3,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Stitch.)\nREADY FOR ACTION When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck.",
  version: "Alien Buccaneer",
  willpower: 4,
};
