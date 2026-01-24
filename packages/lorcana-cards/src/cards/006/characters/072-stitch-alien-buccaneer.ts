import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchAlienBuccaneer: CharacterCard = {
  id: "19n",
  cardType: "character",
  name: "Stitch",
  version: "Alien Buccaneer",
  fullName: "Stitch - Alien Buccaneer",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Stitch.)\nREADY FOR ACTION When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 72,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "a47fda64f881fde3e3a374f0e76152127d4c47e4",
  },
  abilities: [
    {
      id: "19n-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "19n-2",
      type: "triggered",
      name: "READY FOR ACTION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "discard",
      },
      text: "READY FOR ACTION When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Alien", "Pirate"],
};
