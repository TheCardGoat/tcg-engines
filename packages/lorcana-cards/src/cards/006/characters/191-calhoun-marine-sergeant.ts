import type { CharacterCard } from "@tcg/lorcana-types";

export const calhounMarineSergeant: CharacterCard = {
  abilities: [
    {
      id: "10g-1",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "10g-2",
      name: "LEVEL UP",
      text: "LEVEL UP During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 191,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "8364649fe1abbe5e1521f9dca01ac72dbac4ff28",
  },
  franchise: "Wreck It Ralph",
  fullName: "Calhoun - Marine Sergeant",
  id: "10g",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Calhoun",
  set: "006",
  strength: 3,
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nLEVEL UP During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
  version: "Marine Sergeant",
  willpower: 2,
};
