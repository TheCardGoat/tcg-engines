import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailYorinobuArasakaSteelDragon = defineCyberpunkCard({
  id: "6cf6456d-d020-4c6c-9041-66d503a01a0a",
  canonicalId: "yorinobu-arasaka-steel-dragon",
  slug: "yorinobu-arasaka-steel-dragon",
  rulesText:
    "{Play} You may play a Unit with cost 4 or less from your hand or trash for free. It can attack rival Units this turn.\nThe first time an ARASAKA Unit is defeated each turn, draw 1.",
  name: "Yorinobu Arasaka — Steel Dragon",
  displayName: "Yorinobu Arasaka — Steel Dragon",
  color: "red",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "022",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/022.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Play You may play a Unit with cost 4 or less from your hand or trash for free. It can attack rival Units this turn.",
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
            zones: ["hand", "trash"],
            cardTypes: ["unit"],
            maxCost: 4,
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
          effect: "playCard",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          free: true,
        },
        {
          effect: "grantRule",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          rule: "canAttackOnPlayedTurnAgainstUnits",
          duration: "turn",
        },
      ],
    },
    {
      kind: "triggered",
      text: "The first time an ARASAKA Unit is defeated each turn, draw 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardDefeated",
          player: "any",
          target: {
            selector: "card",
            cardTypes: ["unit"],
            classifications: ["Arasaka"],
          },
        },
      },
      limits: ["firstTimeEachTurn"],
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
        },
      ],
    },
  ],
  type: "unit",
  cost: 7,
  power: 9,
}) satisfies UnitCardDefinition;
