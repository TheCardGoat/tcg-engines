import type { CharacterCard } from "@tcg/lorcana-types";

export const calhounMarineSergeant: CharacterCard = {
  id: "10g",
  cardType: "character",
  name: "Calhoun",
  version: "Marine Sergeant",
  fullName: "Calhoun - Marine Sergeant",
  inkType: ["steel"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nLEVEL UP During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 191,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "8364649fe1abbe5e1521f9dca01ac72dbac4ff28",
  },
  abilities: [
    {
      id: "10g-1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
      text: "Resist +1",
    },
    {
      id: "10g-2",
      type: "triggered",
      name: "LEVEL UP",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "LEVEL UP During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
