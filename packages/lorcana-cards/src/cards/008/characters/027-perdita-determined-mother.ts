import type { CharacterCard } from "@tcg/lorcana-types";

export const perditaDeterminedMother: CharacterCard = {
  id: "169",
  cardType: "character",
  name: "Perdita",
  version: "Determined Mother",
  fullName: "Perdita - Determined Mother",
  inkType: ["amber", "sapphire"],
  franchise: "101 Dalmatians",
  set: "008",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Perdita.)\nQUICK, EVERYONE HIDE When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  cardNumber: 27,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9849851df328fe0b986033d99e6d4ab4ed054ed8",
  },
  abilities: [
    {
      id: "169-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "169-2",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "discard",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "QUICK, EVERYONE HIDE When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
