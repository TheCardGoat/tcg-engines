import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailJudyALvarezBraindanceMaestro = defineCyberpunkCard({
  id: "4560f3d0-5f63-466b-93b7-fc9d822a556e",
  canonicalId: "judy-a-lvarez-braindance-maestro",
  slug: "judy-a-lvarez-braindance-maestro",
  subname: "Braindance Maestro",
  name: "Judy Álvarez",
  displayName: "Judy Álvarez: Braindance Maestro",
  rulesText:
    "When you play a BRAINDANCE Program, give a friendly Unit +1 power this turn.\n{Spend} Trash the top card of your deck. If it's a Program, you may add it to your hand.",
  color: "blue",
  classifications: ["Ganger", "Mox", "Techie"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "108",
  artist: "Gautier Viller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/108.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  abilities: [
    {
      kind: "triggered",
      text: "When you play a BRAINDANCE Program, give a friendly Unit +1 power this turn.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardPlayed",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            cardTypes: ["program"],
            classifications: ["Braindance"],
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "modifyPower",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          value: 1,
          duration: "turn",
        },
      ],
    },
    {
      kind: "triggered",
      text: "Spend Trash the top card of your deck. If it's a Program, you may add it to your hand.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      costs: [
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
          outputBinding: "trashedCards",
        },
        {
          effect: "moveCard",
          target: {
            selector: "bound",
            id: "trashedCards",
            cardTypes: ["program"],
          },
          destination: "hand",
          optional: true,
        },
      ],
    },
  ],
  type: "legend",
}) satisfies LegendCardDefinition;
