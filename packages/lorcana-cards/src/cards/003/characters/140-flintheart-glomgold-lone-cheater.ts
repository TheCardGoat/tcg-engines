import type { CharacterCard } from "@tcg/lorcana-types";

export const flintheartGlomgoldLoneCheater: CharacterCard = {
  id: "j9d",
  cardType: "character",
  name: "Flintheart Glomgold",
  version: "Lone Cheater",
  fullName: "Flintheart Glomgold - Lone Cheater",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  text: "THEY'LL NEVER SEE IT COMING! During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 140,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "456a3064e0e69929c0b9426e3bc37b6341b3573a",
  },
  abilities: [
    {
      id: "j9d-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "THEY'LL NEVER SEE IT COMING! During your turn, this character gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
