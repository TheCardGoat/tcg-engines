import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiExpandedConsciousness: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "quw-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      id: "quw-2",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
    {
      effect: {
        type: "put-into-inkwell",
        source: "hand",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      id: "quw-3",
      name: "CLEAR YOUR MIND",
      text: "CLEAR YOUR MIND When you play this character, put all cards from your hand into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 163,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "60cce29a8b123e85708a10c1bc80278325d99446",
  },
  franchise: "Moana",
  fullName: "Heihei - Expanded Consciousness",
  id: "quw",
  inkType: ["sapphire", "steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Heihei",
  set: "007",
  strength: 1,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Heihei.)\nResist +1 (Damage dealt to this character is reduced by 1.)\nCLEAR YOUR MIND When you play this character, put all cards from your hand into your inkwell facedown and exerted.",
  version: "Expanded Consciousness",
  willpower: 5,
};
