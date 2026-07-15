import type { CharacterCard } from "@tcg/lorcana-types";

export const flintheartGlomgoldLoneCheater: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "j9d-1",
      text: "THEY'LL NEVER SEE IT COMING! During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 140,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "456a3064e0e69929c0b9426e3bc37b6341b3573a",
  },
  franchise: "Ducktales",
  fullName: "Flintheart Glomgold - Lone Cheater",
  id: "j9d",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Flintheart Glomgold",
  set: "003",
  strength: 3,
  text: "THEY'LL NEVER SEE IT COMING! During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Lone Cheater",
  willpower: 4,
};
