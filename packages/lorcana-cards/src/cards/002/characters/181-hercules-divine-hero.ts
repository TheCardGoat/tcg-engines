import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesDivineHero: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "5e9-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      id: "5e9-2",
      keyword: "Resist",
      text: "Resist +2",
      type: "keyword",
      value: 2,
    },
  ],
  cardNumber: 181,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Prince", "Deity"],
  cost: 6,
  externalIds: {
    ravensburger: "1372c6d5229587e89693707e53401c018887b762",
  },
  franchise: "Hercules",
  fullName: "Hercules - Divine Hero",
  id: "5e9",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "Hercules",
  set: "002",
  strength: 6,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Hercules.)\nResist +2 (Damage dealt to this character is reduced by 2.)",
  version: "Divine Hero",
  willpower: 3,
};
