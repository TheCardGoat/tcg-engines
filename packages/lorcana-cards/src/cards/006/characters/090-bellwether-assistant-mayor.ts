import type { CharacterCard } from "@tcg/lorcana-types";

export const bellwetherAssistantMayor: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "vwg-1",
      name: "FEAR ALWAYS WORKS",
      text: "FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 90,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "72f9912aaf126caa296ac6b59f85a9b63a5c644d",
  },
  franchise: "Zootropolis",
  fullName: "Bellwether - Assistant Mayor",
  id: "vwg",
  inkType: ["emerald"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Bellwether",
  set: "006",
  strength: 2,
  text: "FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  version: "Assistant Mayor",
  willpower: 3,
};
