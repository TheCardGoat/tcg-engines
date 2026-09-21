import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailJohnnySilverhandRockingRenegade = defineCyberpunkCard({
  id: "56947a14-0b1e-4c3d-89e0-17839bcf4280",
  canonicalId: "johnny-silverhand-rocking-renegade",
  slug: "johnny-silverhand-rocking-renegade",
  subname: "Rocking Renegade",
  name: "Johnny Silverhand",
  displayName: "Johnny Silverhand: Rocking Renegade",
  rulesText:
    "2 €$, {Spend} A friendly Unit can attack spent rival Units the turn it's played. If it's a ROCKER Unit, also give it +2 power this turn. This effect costs -1 €$ for each friendly Gig with 8+ value.",
  color: "red",
  classifications: ["Merc", "Rocker", "Samurai"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "003",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/003.webp",
  rarity: "Secret",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  abilities: [
    {
      kind: "triggered",
      text: "2 €$, Spend A friendly Unit can attack spent rival Units the turn it's played. If it's a ROCKER Unit, also give it +2 power this turn. This effect costs -1 €$ for each friendly Gig with 8+ value.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      costs: [
        {
          cost: "payEddies",
          amount: 2,
          reduction: {
            target: {
              selector: "gig",
              controller: "friendly",
              amount: "all",
              minValue: 8,
            },
            reductionPerCount: 1,
            min: 1,
          },
        },
        {
          cost: "spend",
          target: {
            selector: "self",
          },
        },
      ],
      bindings: [
        {
          id: "selectedUnit",
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
        },
      ],
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          rule: "canAttackOnPlayedTurnAgainstUnits",
          duration: "turn",
        },
        {
          // Optional: only applies when the selected Unit is a Rocker.
          effect: "modifyPower",
          target: {
            selector: "bound",
            id: "selectedUnit",
            classifications: ["Rocker"],
          },
          value: 2,
          duration: "turn",
          optional: true,
        },
      ],
    },
  ],
  type: "legend",
}) satisfies LegendCardDefinition;
