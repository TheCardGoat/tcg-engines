import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerPanamPalmerNomadCavalry = defineCyberpunkCard({
  id: "4132e38c-38f4-4958-85df-ba863caf43d5",
  slug: "panam-palmer-nomad-cavalry",
  rulesText:
    "CALL Ready this Legend. When a friendly Unit attacks, [Spend Icon]: Choose a Gear from this Legend and equip it to that Unit. If you do, ready that Unit.",
  subname: "Nomad Cavalry",
  name: "Panam Palmer",
  displayName: "Panam Palmer - Nomad Cavalry",
  canonicalId: "panam-palmer-nomad-cavalry",
  color: "green",
  classifications: ["Aldecado", "Merc", "Nomad"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "032",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/032.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "CALL Ready this Legend.",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ready",
          target: {
            selector: "self",
          },
        },
      ],
    },
    {
      kind: "triggered",
      text: "When a friendly Unit attacks, [Spend Icon]: Choose a Gear from this Legend and equip it to that Unit. If you do, ready that Unit.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardAttacks",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
          },
        },
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "attackingUnit",
          target: {
            selector: "context",
            key: "triggerCard",
          },
        },
      ],
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
          effect: "ifYouDo",
          doEffect: {
            effect: "moveCard",
            target: {
              selector: "card",
              controller: "friendly",
              cardTypes: ["gear"],
              attachedTo: {
                selector: "self",
              },
            },
            destination: "field",
            attachTo: {
              selector: "bound",
              id: "attackingUnit",
            },
            optional: true,
          },
          ifEffects: [
            {
              effect: "ready",
              target: {
                selector: "bound",
                id: "attackingUnit",
              },
            },
          ],
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
