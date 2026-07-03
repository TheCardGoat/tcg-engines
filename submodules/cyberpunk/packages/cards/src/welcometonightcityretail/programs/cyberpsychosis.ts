import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { quickAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailCyberpsychosis = defineCyberpunkCard({
  id: "d0991502-57e5-42e2-b37b-64b425f4f1b5",
  slug: "cyberpsychosis",
  rulesText:
    "{Quick} Give an equipped Unit +3 power this turn for each if its equipped Gears. If that Unit steals or fights, defeat it at the end of this turn.",
  name: "Cyberpsychosis",
  displayName: "Cyberpsychosis",
  canonicalId: "cyberpsychosis",
  color: "yellow",
  classifications: ["Quickhack"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "067",
  artist: "Michal Ivan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/067.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  keywords: ["quick"],
  type: "program",
  cost: 3,
  power: null,
  abilities: [
    quickAbility(),
    {
      kind: "triggered",
      text: "Give an equipped Unit +3 power this turn for each if its equipped Gears. If that Unit steals or fights, defeat it at the end of this turn.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedUnit",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            hasAttachedCards: true,
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
          effect: "modifyPower",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          value: {
            type: "perCount",
            multiplier: 3,
            target: {
              selector: "card",
              controller: "friendly",
              cardTypes: ["gear"],
              attachedTo: {
                selector: "bound",
                id: "selectedUnit",
              },
            },
          },
          duration: "turn",
        },
        {
          effect: "defeatAtEndOfTurnIfAttacks",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
