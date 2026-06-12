import type { CharacterCard } from "@tcg/lorcana-types";
import { bellwetherAssistantMayorI18n } from "./090-bellwether-assistant-mayor.i18n";

export const bellwetherAssistantMayor: CharacterCard = {
  id: "2R6",
  canonicalId: "ci_2R6",
  reprints: ["set6-090"],
  cardType: "character",
  name: "Bellwether",
  version: "Assistant Mayor",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "006",
  cardNumber: 90,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_94afdca365e64d8ba0d826076fc4448e",
    tcgPlayer: 591120,
  },
  text: [
    {
      title: "FEAR ALWAYS WORKS",
      description:
        "During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        keyword: "Reckless",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "gain-keyword",
        duration: "their-next-turn",
      },
      id: "vwg-1",
      name: "FEAR ALWAYS WORKS",
      text: "FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn.",
      condition: {
        type: "your-turn",
      },
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: bellwetherAssistantMayorI18n,
};
