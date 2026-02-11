import type { CharacterCard } from "@tcg/lorcana-types";

export const gyroGearlooseEccentricInventor: CharacterCard = {
  abilities: [
    {
      id: "1fz-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
        target: "SELF",
        duration: "this-turn",
      },
      id: "1fz-2",
      name: "I'LL SHOW YOU!",
      text: "I'LL SHOW YOU! When you play this character, chosen opposing character gets -3 {S} this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 123,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Inventor"],
  cost: 3,
  externalIds: {
    ravensburger: "bb531c3d4c57db87a2247107cf68766885e486f9",
  },
  franchise: "Ducktales",
  fullName: "Gyro Gearloose - Eccentric Inventor",
  id: "1fz",
  inkType: ["ruby", "sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Gyro Gearloose",
  set: "008",
  strength: 1,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nI'LL SHOW YOU! When you play this character, chosen opposing character gets -3 {S} this turn.",
  version: "Eccentric Inventor",
  willpower: 3,
};
