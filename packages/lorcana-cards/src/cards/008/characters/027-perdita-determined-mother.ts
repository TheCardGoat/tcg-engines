import type { CharacterCard } from "@tcg/lorcana-types";

export const perditaDeterminedMother: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "169-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
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
      id: "169-2",
      text: "QUICK, EVERYONE HIDE When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.",
      type: "action",
    },
  ],
  cardNumber: 27,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "9849851df328fe0b986033d99e6d4ab4ed054ed8",
  },
  franchise: "101 Dalmatians",
  fullName: "Perdita - Determined Mother",
  id: "169",
  inkType: ["amber", "sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Perdita",
  set: "008",
  strength: 4,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Perdita.)\nQUICK, EVERYONE HIDE When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.",
  version: "Determined Mother",
  willpower: 6,
};
