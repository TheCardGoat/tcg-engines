import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckCavernProspector: CharacterCard = {
  id: "1hq",
  cardType: "character",
  name: "Scrooge McDuck",
  version: "Cavern Prospector",
  fullName: "Scrooge McDuck - Cavern Prospector",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Scrooge McDuck.)\nSPECULATION Whenever you play a character or location with Boost, you may put the top card of your deck facedown under them.",
  cost: 6,
  strength: 4,
  willpower: 7,
  lore: 2,
  cardNumber: 18,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c1b31199a4eabc9db83d0b06451215bcffc9cd01",
  },
  abilities: [
    {
      id: "1hq-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4 {I}",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
