import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiExpandedConsciousness: CharacterCard = {
  id: "quw",
  cardType: "character",
  name: "Heihei",
  version: "Expanded Consciousness",
  fullName: "Heihei - Expanded Consciousness",
  inkType: ["sapphire", "steel"],
  franchise: "Moana",
  set: "007",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Heihei.)\nResist +1 (Damage dealt to this character is reduced by 1.)\nCLEAR YOUR MIND When you play this character, put all cards from your hand into your inkwell facedown and exerted.",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 163,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "60cce29a8b123e85708a10c1bc80278325d99446",
  },
  abilities: [
    {
      id: "quw-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "quw-2",
      type: "keyword",
      keyword: "Resist",
      value: 1,
      text: "Resist +1",
    },
    {
      id: "quw-3",
      type: "triggered",
      name: "CLEAR YOUR MIND",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "put-into-inkwell",
        source: "hand",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      text: "CLEAR YOUR MIND When you play this character, put all cards from your hand into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
