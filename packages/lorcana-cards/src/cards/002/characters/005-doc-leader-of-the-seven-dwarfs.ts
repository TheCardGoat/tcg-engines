import type { CharacterCard } from "@tcg/lorcana-types";

export const docLeaderOfTheSevenDwarfs: CharacterCard = {
  id: "xfn",
  cardType: "character",
  name: "Doc",
  version: "Leader of the Seven Dwarfs",
  fullName: "Doc - Leader of the Seven Dwarfs",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "SHARE AND SHARE ALIKE Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 5,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "78808ef4f46068f8cf74e84d569167ddb81dc47f",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
};
