import type { CharacterCard } from "@tcg/lorcana-types";
import { nortonNimnulMisanthropicGeniusI18n } from "./146-norton-nimnul-misanthropic-genius.i18n";

export const nortonNimnulMisanthropicGenius: CharacterCard = {
  id: "SBA",
  canonicalId: "ci_SBA",
  reprints: ["set12-146"],
  cardType: "character",
  name: "Norton Nimnul",
  version: "Misanthropic Genius",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 146,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_740fc865fdcd40ab8b5391cfdc96509d",
  },
  text: [
    {
      title: "DEVITALIZER RAY",
      description:
        "Once during your turn, whenever you play an item, chosen opposing character gets -2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Inventor"],
  abilities: [
    {
      id: "SBA-1",
      name: "DEVITALIZER RAY",
      type: "triggered",
      text: "DEVITALIZER RAY Once during your turn, whenever you play an item, chosen opposing character gets -2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "item",
          controller: "you",
        },
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
        timing: "whenever",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        duration: "this-turn",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    },
  ],
  i18n: nortonNimnulMisanthropicGeniusI18n,
};
