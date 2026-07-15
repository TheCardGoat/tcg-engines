import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailAltCunninghamSoulkillerArchitect = defineCyberpunkCard({
  id: "12475e77-0e16-420e-a935-65eb74290de8",
  slug: "alt-cunningham-soulkiller-architect",
  rulesText:
    "{Spend} Your next Program this turn plays for -1 €$ for each friendly min Gig, to a minimum of 1 €$.\n1 €$, {Spend} Play a Program from your trash. Bottom-deck it after you play it. (You still pay its cost.)",
  name: "Alt Cunningham — Soulkiller Architect",
  displayName: "Alt Cunningham — Soulkiller Architect",
  canonicalId: "alt-cunningham-soulkiller-architect",
  color: "blue",
  classifications: ["Merc", "Netrunner"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "106",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/106.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "SPEND Your next Program this turn plays for -1 €$ for each friendly min Gig, to a minimum of 1 €$.",
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
          effect: "grantCostModifier",
          player: "friendly",
          appliesTo: {
            selector: "card",
            controller: "friendly",
            zones: ["hand", "trash"],
            cardTypes: ["program"],
          },
          modifier: {
            reducer: "perTargetCount",
            reductionPerCount: 1,
            target: {
              selector: "gig",
              controller: "friendly",
              minValue: 1,
              maxValue: 1,
              amount: "all",
            },
            min: 1,
          },
          duration: "turn",
          uses: 1,
        },
      ],
    },
    {
      kind: "triggered",
      text: "1 €$, SPEND Play a Program from your trash. Bottom-deck it after you play it. (You still pay its cost.)",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedProgram",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["trash"],
            cardTypes: ["program"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
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
          effect: "playCard",
          target: {
            selector: "bound",
            id: "selectedProgram",
          },
        },
        {
          effect: "delayed",
          timing: "afterTriggerResolution",
          effects: [
            {
              effect: "moveCard",
              target: {
                selector: "bound",
                id: "selectedProgram",
              },
              destination: "deckBottom",
            },
          ],
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
