import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckCavernProspector: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1hq-1",
      keyword: "Shift",
      text: "Shift 4 {I}",
      type: "keyword",
    },
  ],
  cardNumber: 18,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "c1b31199a4eabc9db83d0b06451215bcffc9cd01",
  },
  franchise: "Ducktales",
  fullName: "Scrooge McDuck - Cavern Prospector",
  id: "1hq",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Scrooge McDuck",
  set: "010",
  strength: 4,
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Scrooge McDuck.)\nSPECULATION Whenever you play a character or location with Boost, you may put the top card of your deck facedown under them.",
  version: "Cavern Prospector",
  willpower: 7,
};
