import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailLizzyWizzyDelicateWeapon = defineCyberpunkCard({
  id: "6b078eff-4cef-4beb-a299-ed388a72ce45",
  slug: "lizzy-wizzy-delicate-weapon",
  rulesText:
    "{Play} You may play a Program with cost 3 or less from your hand or trash for free. Bottom-deck it after you play it.\n{Blocker}",
  name: "Lizzy Wizzy — Delicate Weapon",
  displayName: "Lizzy Wizzy — Delicate Weapon",
  canonicalId: "lizzy-wizzy-delicate-weapon",
  color: "blue",
  classifications: ["Rocker"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "117",
  artist: "CD Projekt Red",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/117.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  keywords: ["blocker"],
  type: "unit",
  cost: 5,
  power: 2,
  abilities: [
    {
      kind: "keyword",
      text: "BLOCKER (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
      keyword: "blocker",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "triggered",
      text: "PLAY You may play a Program with cost 3 or less from your hand or trash for free. Bottom-deck it after you play it.",
      trigger: {
        trigger: "play",
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
            zones: ["hand", "trash"],
            cardTypes: ["program"],
            maxCost: 3,
            selection: {
              mode: "choose",
              min: 0,
              max: 1,
            },
          },
        },
      ],
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "playCard",
            target: {
              selector: "bound",
              id: "selectedProgram",
            },
            free: true,
          },
          ifEffects: [
            {
              effect: "delayed",
              timing: "endOfTurn",
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
    },
  ],
}) satisfies UnitCardDefinition;
