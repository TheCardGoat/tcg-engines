import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { goSoloAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown = defineCyberpunkCard({
  id: "e2dc863c-5bc9-4ad7-9138-2d5b966ed901",
  canonicalId: "sasha-yakovleva-won-t-let-you-down",
  slug: "sasha-yakovleva-won-t-let-you-down",
  rulesText:
    "{Go Solo}\n{Attack} Reveal the top card of your deck and add it to your hand. This Unit gains power equal to that card's cost this turn.\n{Defeated} A Rival discards 1.",
  name: "Sasha Yakovleva — Won't Let You Down",
  displayName: "Sasha Yakovleva — Won't Let You Down",
  color: "blue",
  classifications: ["Maine's Crew", "Merc", "Netrunner"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "109",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/109.webp",
  rarity: "Secret",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["goSolo"],
  abilities: [
    goSoloAbility({ text: "Go Solo" }),
    {
      kind: "triggered",
      text: "{Attack} Reveal the top card of your deck and add it to your hand. This Unit gains power equal to that card's cost this turn.",
      trigger: {
        trigger: "attack",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "revealTopCardAndModifyPowerByCost",
          player: "friendly",
          target: {
            selector: "self",
          },
          duration: "turn",
        },
      ],
    },
    {
      kind: "triggered",
      text: "{Defeated} A Rival discards 1.",
      trigger: {
        trigger: "defeated",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
        },
      ],
    },
  ],
  type: "legend",
  cost: 5,
  power: 0,
}) satisfies LegendCardDefinition;
