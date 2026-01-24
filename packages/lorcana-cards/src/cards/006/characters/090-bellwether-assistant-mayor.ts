import type { CharacterCard } from "@tcg/lorcana-types";

export const bellwetherAssistantMayor: CharacterCard = {
  id: "vwg",
  cardType: "character",
  name: "Bellwether",
  version: "Assistant Mayor",
  fullName: "Bellwether - Assistant Mayor",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "006",
  text: "FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 90,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "72f9912aaf126caa296ac6b59f85a9b63a5c644d",
  },
  abilities: [
    {
      id: "vwg-1",
      type: "triggered",
      name: "FEAR ALWAYS WORKS",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
      },
      text: "FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
