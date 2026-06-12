import type { CharacterCard } from "@tcg/lorcana-types";
import { prestonWhitmoreExpeditionFinancierI18n } from "./110-preston-whitmore-expedition-financier.i18n";

export const prestonWhitmoreExpeditionFinancier: CharacterCard = {
  id: "D1V",
  canonicalId: "ci_D1V",
  reprints: ["set12-110"],
  cardType: "character",
  name: "Preston Whitmore",
  version: "Expedition Financier",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 110,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1e431099236d41a1ac9a34d9923f76eb",
  },
  text: [
    {
      title: "PRICE OF PROGRESS",
      description:
        "When you play this character, you may put the top 2 cards of your deck into your discard.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "D1V-1",
      name: "PRICE OF PROGRESS",
      type: "triggered",
      text: "PRICE OF PROGRESS When you play this character, you may put the top 2 cards of your deck into your discard.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "mill",
          amount: 2,
          target: "CONTROLLER",
        },
      },
    },
  ],
  i18n: prestonWhitmoreExpeditionFinancierI18n,
};
