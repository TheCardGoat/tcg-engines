import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailJudyAlvarezNothingToDoubt = defineCyberpunkCard({
  id: "cb7f8d05-87cc-4606-ad71-a9283f2f4b20",
  canonicalId: "judy-alvarez-nothing-to-doubt",
  slug: "judy-alvarez-nothing-to-doubt",
  subname: "Nothing to Doubt",
  name: "Judy Álvarez",
  displayName: "Judy Álvarez: Nothing to Doubt",
  rulesText:
    "1 €$, {Spend} Reveal the top card of your deck. You may play it for free. Otherwise, add it to your hand.",
  color: "blue",
  classifications: ["Ganger", "Mox", "Techie"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "116",
  artist: "Ilya Kushinov",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/116.webp",
  rarity: "Secret",
  legality: "legal",
  hasSellTag: false,
  ram: 5,
  abilities: [
    {
      kind: "triggered",
      text: "1 €$, Spend Reveal the top card of your deck. You may play it for free. Otherwise, add it to your hand.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      costs: [
        {
          cost: "payEddies",
          amount: 1,
        },
        {
          cost: "spend",
          target: {
            selector: "self",
          },
        },
      ],
      effects: [
        {
          effect: "trashFromDeck",
          player: "friendly",
          amount: 1,
          outputBinding: "revealed",
        },
        {
          effect: "playCard",
          target: {
            selector: "bound",
            id: "revealed",
          },
          free: true,
          optional: true,
          elseEffects: [
            {
              effect: "moveCard",
              target: {
                selector: "bound",
                id: "revealed",
              },
              destination: "hand",
            },
          ],
        },
      ],
    },
  ],
  type: "unit",
  cost: 6,
  power: 6,
}) satisfies UnitCardDefinition;
