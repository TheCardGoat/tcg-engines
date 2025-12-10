import type { CharacterCard } from "@tcg/lorcana";

export const hadesKingOfOlympus: CharacterCard = {
  id: "1e5",
  cardType: "character",
  name: "Hades",
  version: "King of Olympus",
  fullName: "Hades - King of Olympus",
  inkType: ["amber"],
  franchise: "Hercules",
  set: "001",
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Hades.)\nSINISTER PLOT This character gets +1 {L} for each other Villain character you have in play.",
  cost: 8,
  strength: 6,
  willpower: 7,
  lore: 1,
  cardNumber: 5,
  inkable: false,
  externalIds: {
    ravensburger: "b49576fe526d49f6abcdf5af9e3eb03f64505194",
  },
  abilities: [
    {
      id: "1e5-1",
      text: "Shift 6",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 6,
      },
    },
    {
      id: "1e5-2",
      text: "SINISTER PLOT This character gets +1 {L} for each other Villain character you have in play.",
      name: "SINISTER PLOT",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 0,
        target: "SELF",
        scaling: {
          base: 0,
          factor: 1,
          source: "other Villain character you have in play.",
        },
      },
    },
  ],
  classifications: ["Floodborn", "Villain", "King", "Deity"],
};
