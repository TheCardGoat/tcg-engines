import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { blockerAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailMeredithStoutStoneColdCorpo = defineCyberpunkCard({
  id: "21f68be2-c664-4ae0-a7ef-965a3a5a14c8",
  slug: "meredith-stout-stone-cold-corpo",
  rulesText:
    "{Blocker}\nThis Unit has +2 power while fighting a Legend.\nWhen a Rival adjusts or swaps 1 or more friendly Gigs, you may add a card from your trash to your hand.",
  name: "Meredith Stout — Stone Cold Corpo",
  displayName: "Meredith Stout — Stone Cold Corpo",
  canonicalId: "meredith-stout-stone-cold-corpo",
  color: "red",
  classifications: ["Corpo", "Militech"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "014",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/014.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  keywords: ["blocker"],
  type: "unit",
  cost: 4,
  power: 5,
  abilities: [
    blockerAbility({ text: "BLOCKER" }),
    {
      kind: "static",
      text: "This Unit has +2 power while fighting a Legend. When a Rival adjusts or swaps 1 or more friendly Gigs, you may add a card from your trash to your hand.",
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "modifyPower",
          target: {
            selector: "self",
          },
          value: 2,
          duration: "continuous",
          conditions: [
            {
              condition: "fightKind",
              target: {
                selector: "self",
              },
              kind: "fight",
              opponent: {
                selector: "card",
                cardTypes: ["legend"],
              },
            },
          ],
        },
      ],
    },
    {
      kind: "triggered",
      text: "When a Rival adjusts or swaps 1 or more friendly Gigs, you may add a card from your trash to your hand.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigValueChanged",
          player: "rival",
          target: {
            selector: "gig",
            controller: "friendly",
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "moveCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["trash"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          destination: "hand",
          optional: true,
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
