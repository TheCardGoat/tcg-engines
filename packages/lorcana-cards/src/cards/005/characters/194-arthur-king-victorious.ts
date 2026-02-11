import type { CharacterCard } from "@tcg/lorcana-types";

export const arthurKingVictorious: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "d3q-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 2,
        duration: "this-turn",
      },
      id: "d3q-2",
      name: "KNIGHTED BY THE KING",
      text: "KNIGHTED BY THE KING When you play this character, chosen character gains Challenger +2 and Resist +2 and can challenge ready characters this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 194,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "King"],
  cost: 7,
  externalIds: {
    ravensburger: "2f3a330ce28cc7aa20666f69e8e605efcffacc9b",
  },
  franchise: "Sword in the Stone",
  fullName: "Arthur - King Victorious",
  id: "d3q",
  inkType: ["steel"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Arthur",
  set: "005",
  strength: 3,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Arthur.)\nKNIGHTED BY THE KING When you play this character, chosen character gains Challenger +2 and Resist +2 and can challenge ready characters this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)",
  version: "King Victorious",
  willpower: 6,
};
