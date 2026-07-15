import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailPanamPalmerNomadCavalry = defineCyberpunkCard({
  id: "950f045c-f5a4-4318-9907-b630d64de754",
  slug: "panam-palmer-nomad-cavalry",
  rulesText:
    "2 €$, {Spend} Move a Gear from this Legend to an unequipped friendly Unit. If you do, ready that Unit.\nAt the end of your turn, if 5 or more friendly Units and/or Legends are equipped, ready them.",
  name: "Panam Palmer — Nomad Cavalry",
  displayName: "Panam Palmer — Nomad Cavalry",
  canonicalId: "panam-palmer-nomad-cavalry",
  color: "green",
  classifications: ["Aldecado", "Merc", "Nomad"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "075",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/075.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "2 €$, SPEND Move a Gear from this Legend to an unequipped friendly Unit. If you do, ready that Unit.",
      trigger: {
        trigger: "activated",
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
            hasAttachedCards: false,
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
          amount: 2,
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
          // Card text: "Move a Gear from this Legend to an unequipped
          // friendly Unit. If you do, ready that Unit." The ready must only
          // fire when the move actually happens — wrap the move as the
          // doEffect and the ready as the ifEffect.
          effect: "ifYouDo",
          doEffect: {
            effect: "moveCard",
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["legendArea"],
              cardTypes: ["gear"],
              attachedTo: {
                selector: "self",
              },
              selection: {
                mode: "choose",
                min: 1,
                max: 1,
              },
            },
            destination: "field",
            attachTo: {
              selector: "bound",
              id: "selectedUnit",
            },
          },
          ifEffects: [
            {
              effect: "ready",
              target: {
                selector: "bound",
                id: "selectedUnit",
              },
            },
          ],
        },
      ],
    },
    {
      kind: "triggered",
      text: "At the end of your turn, if 5 or more friendly Units and/or Legends are equipped, ready them.",
      trigger: {
        trigger: "event",
        event: {
          event: "turnEnded",
          player: "friendly",
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ready",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field", "legendArea"],
            cardTypes: ["unit", "legend"],
            hasAttachedCards: true,
          },
          conditions: [
            {
              condition: "hasEquippedUnitsOrLegends",
              controller: "friendly",
              minCount: 5,
            },
          ],
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
