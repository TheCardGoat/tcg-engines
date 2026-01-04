import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesDivineHero: CharacterCard = {
  id: "5e9",
  cardType: "character",
  name: "Hercules",
  version: "Divine Hero",
  fullName: "Hercules - Divine Hero",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "002",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Hercules.)\nResist +2 (Damage dealt to this character is reduced by 2.)",
  cost: 6,
  strength: 6,
  willpower: 3,
  lore: 2,
  cardNumber: 181,
  inkable: true,
  externalIds: {
    ravensburger: "1372c6d5229587e89693707e53401c018887b762",
  },
  abilities: [
    {
      id: "5e9-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    },
    {
      id: "5e9-2",
      type: "keyword",
      keyword: "Resist",
      value: 2,
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince", "Deity"],
};
