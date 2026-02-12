import type { CharacterCard } from "@tcg/lorcana-types";

export const docLeaderOfTheSevenDwarfs: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "xfn-1",
      name: "SHARE AND SHARE ALIKE",
      text: "SHARE AND SHARE ALIKE Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 5,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  cost: 3,
  externalIds: {
    ravensburger: "78808ef4f46068f8cf74e84d569167ddb81dc47f",
  },
  franchise: "Snow White",
  fullName: "Doc - Leader of the Seven Dwarfs",
  id: "xfn",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Doc",
  set: "002",
  strength: 2,
  text: "SHARE AND SHARE ALIKE Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
  version: "Leader of the Seven Dwarfs",
  willpower: 3,
};
