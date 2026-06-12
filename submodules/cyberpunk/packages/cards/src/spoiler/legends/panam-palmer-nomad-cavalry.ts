import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerPanamPalmerNomadCavalry = {
  id: "4132e38c-38f4-4958-85df-ba863caf43d5",
  externalId: "cyberpunk:panam-palmer-nomad-cavalry",
  slug: "panam-palmer-nomad-cavalry",
  name: "Panam Palmer",
  subname: "Nomad Cavalry",
  displayName: "Panam Palmer - Nomad Cavalry",
  rulesText:
    "CALL Ready this Legend. When a friendly Unit attacks, [Spend Icon]: Choose a Gear from this Legend and equip it to that Unit. If you do, ready that Unit.",
  flavorText: null,
  color: "green",
  classifications: ["Aldecado", "Merc", "Nomad"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "032",
  printings: [
    {
      id: "963ef785-1bd9-4404-9a49-263589b0a53b",
      collectorNumber: "032",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b032.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b032.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Łukasz Poller",
    },
  ],
  selectedPrintingId: "963ef785-1bd9-4404-9a49-263589b0a53b",
  artist: "Łukasz Poller",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b032.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b032.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  keywords: [],
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
  reminderText: [],
} satisfies SpoilerCardDefinition;
