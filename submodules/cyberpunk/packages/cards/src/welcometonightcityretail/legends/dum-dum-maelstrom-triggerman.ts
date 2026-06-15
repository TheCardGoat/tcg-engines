import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailDumDumMaelstromTriggerman = {
  id: "3b3f941d-aa58-4337-99dc-4af3fd3ccd47",
  externalId: "cb-dum-dum-maelstrom-triggerman",
  slug: "dum-dum-maelstrom-triggerman",
  name: "Dum Dum — Maelstrom Triggerman",
  displayName: "Dum Dum — Maelstrom Triggerman",
  rulesText:
    "[CALL] You may defeat a friendly Gear. If you do, draw 2. Otherwise, draw 1.\n[QUICK] 1 €$, [Spend Icon:] Give a friendly Unit +1 power this turn for each of its equipped Gear.",
  color: "yellow",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "036",
  printings: [
    {
      id: "aaac486c-dbfd-4137-b373-24a2df29522c",
      collectorNumber: "036",
      setCode: "welcometonightcityretail",
      rarity: "Rare",
    },
    {
      id: "33cfbdb0-a169-458a-86dc-9123697654d7",
      collectorNumber: "β036",
      setCode: "welcometonightcitybeta",
      rarity: "Rare",
    },
  ],
  selectedPrintingId: "aaac486c-dbfd-4137-b373-24a2df29522c",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/036.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  keywords: ["quick"],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "keyword",
      text: "QUICK",
      keyword: "quick",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "triggered",
      text: "CALL You may defeat a friendly Gear. If you do, draw 2. Otherwise, draw 1.",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "defeat",
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["gear"],
            },
            optional: true,
          },
          ifEffects: [
            {
              effect: "draw",
              player: "friendly",
              amount: 2,
            },
          ],
          elseEffects: [
            {
              effect: "draw",
              player: "friendly",
              amount: 1,
            },
          ],
        },
      ],
    },
    {
      kind: "triggered",
      text: "1 €$, SPEND Give a friendly Unit +1 power this turn for each of its equipped Gear.",
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
          effect: "modifyPower",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          value: {
            type: "perCount",
            multiplier: 1,
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
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
