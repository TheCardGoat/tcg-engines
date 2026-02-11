import type { CharacterCard } from "@tcg/lorcana-types";

export const gadgetHackwrenchBrilliantBosun: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "35v-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "35v-2",
      text: "MECHANICALLY SAVVY While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.",
      type: "action",
    },
  ],
  cardNumber: 140,
  cardType: "character",
  classifications: ["Floodborn", "Ally", "Inventor"],
  cost: 6,
  externalIds: {
    ravensburger: "0b66351b877ceea82545c1ad0fa5559e4ca44113",
  },
  franchise: "Rescue Rangers",
  fullName: "Gadget Hackwrench - Brilliant Bosun",
  id: "35v",
  inkType: ["sapphire"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Gadget Hackwrench",
  set: "006",
  strength: 3,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Gadget Hackwrench.)\nMECHANICALLY SAVVY While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.",
  version: "Brilliant Bosun",
  willpower: 6,
};
