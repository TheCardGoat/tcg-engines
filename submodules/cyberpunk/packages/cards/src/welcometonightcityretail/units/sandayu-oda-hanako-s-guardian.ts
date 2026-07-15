import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailSandayuOdaHanakoSGuardian = defineCyberpunkCard({
  id: "9611a3ba-d365-453f-89ed-c986a1948edc",
  slug: "sandayu-oda-hanako-s-guardian",
  rulesText:
    "{Play} Spend a rival Unit for each friendly value-pair of Gigs.\nThis Unit can attack rival Units the turn it's played.",
  name: "Sandayu Oda — Hanako's Guardian",
  displayName: "Sandayu Oda — Hanako's Guardian",
  canonicalId: "sandayu-oda-hanako-s-guardian",
  color: "green",
  classifications: ["Arasaka", "Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "088",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/088.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  type: "unit",
  cost: 7,
  power: 8,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Spend a rival Unit for each friendly value-pair of Gigs.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "forEachFriendlyGigPair",
          effects: [
            {
              effect: "spend",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                state: "ready",
                selection: {
                  mode: "choose",
                  min: 1,
                  max: 1,
                },
              },
            },
          ],
        },
      ],
    },
    {
      kind: "static",
      text: "This Unit can attack rival Units the turn it's played.",
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "canAttackOnPlayedTurnAgainstUnits",
          duration: "continuous",
          conditions: [
            {
              condition: "hasLag",
              target: {
                selector: "self",
              },
            },
          ],
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
