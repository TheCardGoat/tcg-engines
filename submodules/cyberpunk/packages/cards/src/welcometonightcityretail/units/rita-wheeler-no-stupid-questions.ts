import { blockerAbility, type UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailRitaWheelerNoStupidQuestions = defineCyberpunkCard({
  id: "65a14367-da52-4578-8162-3c4bac11007d",
  canonicalId: "rita-wheeler-no-stupid-questions",
  slug: "rita-wheeler-no-stupid-questions",
  name: "Rita Wheeler — No Stupid Questions",
  displayName: "Rita Wheeler — No Stupid Questions",
  rulesText:
    "{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)\nThe first time this Unit is spent each turn, draw 1, then discard 1.",
  color: "blue",
  classifications: ["Ganger", "Mox"],
  set: { code: "welcometonightcityretail", name: "Welcome to Night City — Retail" },
  printNumber: "125",
  artist: "TOPDOG Entertainment",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/125.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  keywords: ["blocker"],
  type: "unit",
  cost: 4,
  power: 4,
  abilities: [
    blockerAbility({
      text: "Blocker (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
    }),
    {
      kind: "triggered",
      text: "The first time this Unit is spent each turn, draw 1, then discard 1.",
      trigger: {
        trigger: "event",
        event: { event: "cardSpent", player: "friendly", target: { selector: "self" } },
      },
      source: { selector: "self" },
      limits: ["firstTimeEachTurn"],
      effects: [
        { effect: "draw", player: "friendly", amount: 1 },
        {
          effect: "discardFromHand",
          player: "friendly",
          amount: 1,
          target: { selector: "card", controller: "friendly", zones: ["hand"] },
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
