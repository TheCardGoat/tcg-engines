import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerCyberpsychosis = {
  id: "d0991502-57e5-42e2-b37b-64b425f4f1b5",
  externalId: "cyberpunk:cyberpsychosis",
  slug: "cyberpsychosis",
  name: "Cyberpsychosis",
  subname: null,
  displayName: "Cyberpsychosis",
  rulesText:
    "You may also play this Program when a Unit attacks by paying this card's cost and spending a friendly Unit or face-up Legend. Give an equipped Unit +2 power this turn for each of its equipped Gear. Defeat the Unit at the end of this turn.",
  flavorText: null,
  color: "yellow",
  classifications: ["Quickhack"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "102",
  printings: [
    {
      id: "e55b7a69-2b0b-48eb-a781-7e802b3e7099",
      collectorNumber: "102",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b102.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b102.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Michal Ivan",
    },
  ],
  selectedPrintingId: "e55b7a69-2b0b-48eb-a781-7e802b3e7099",
  artist: "Michal Ivan",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b102.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b102.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: [],
  keywords: [],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "You may also play this Program when a Unit attacks by paying this card's cost and spending a friendly Unit or face-up Legend. Give an equipped Unit +2 power this turn for each of its equipped Gear. Defeat the Unit at the end of this turn.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardAttacks",
          player: "any",
          target: {
            selector: "card",
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
      costs: [
        {
          cost: "payCardCost",
        },
        {
          cost: "spend",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field", "legendArea"],
            cardTypes: ["unit", "legend"],
            face: "faceUp",
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
            multiplier: 2,
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
          effect: "delayed",
          timing: "endOfTurn",
          effects: [
            {
              effect: "defeat",
              target: {
                selector: "bound",
                id: "selectedUnit",
              },
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies SpoilerCardDefinition;
