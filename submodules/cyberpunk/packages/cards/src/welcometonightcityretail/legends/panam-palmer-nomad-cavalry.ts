import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailPanamPalmerNomadCavalry = {
  id: "950f045c-f5a4-4318-9907-b630d64de754",
  externalId: "cb-panam-palmer-nomad-cavalry",
  slug: "panam-palmer-nomad-cavalry",
  name: "Panam Palmer — Nomad Cavalry",
  subname: null,
  displayName: "Panam Palmer — Nomad Cavalry",
  rulesText:
    "2 €$, [Spend Icon:] Move a Gear from this Legend to an unequipped friendly Unit. If you do, ready that Unit.\nAt the end of your turn, if 5 or more friendly Units and/or Legends are equipped, ready them.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "green",
  classifications: ["Aldecado", "Merc", "Nomad"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "075",
  printings: [
    {
      id: "6e4ee31b-82d1-421c-b658-ba3f79520365",
      collectorNumber: "075",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/075.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/6e4ee31b-82d1-421c-b658-ba3f79520365/render-mpvmowoc.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Łukasz Poller",
    },
    {
      id: "2cfe57a5-cafe-4611-90fd-c72f33250933",
      collectorNumber: "β075",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b075.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/2cfe57a5-cafe-4611-90fd-c72f33250933/render-mpvknt1u.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Łukasz Poller",
    },
  ],
  selectedPrintingId: "6e4ee31b-82d1-421c-b658-ba3f79520365",
  artist: "Łukasz Poller",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/075.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/6e4ee31b-82d1-421c-b658-ba3f79520365/render-mpvmowoc.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: [],
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
          effect: "moveCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
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
        {
          effect: "ready",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
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
  reminderText: [],
} satisfies StructuredCardDefinition;
