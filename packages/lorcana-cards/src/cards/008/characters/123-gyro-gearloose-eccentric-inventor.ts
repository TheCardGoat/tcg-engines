import type { CharacterCard } from "@tcg/lorcana-types";

export const gyroGearlooseEccentricInventor: CharacterCard = {
  id: "1fz",
  cardType: "character",
  name: "Gyro Gearloose",
  version: "Eccentric Inventor",
  fullName: "Gyro Gearloose - Eccentric Inventor",
  inkType: ["ruby", "sapphire"],
  franchise: "Ducktales",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nI'LL SHOW YOU! When you play this character, chosen opposing character gets -3 {S} this turn.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 123,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bb531c3d4c57db87a2247107cf68766885e486f9",
  },
  abilities: [
    {
      id: "1fz-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1fz-2",
      type: "triggered",
      name: "I'LL SHOW YOU!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
        target: "SELF",
        duration: "this-turn",
      },
      text: "I'LL SHOW YOU! When you play this character, chosen opposing character gets -3 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Inventor"],
};
