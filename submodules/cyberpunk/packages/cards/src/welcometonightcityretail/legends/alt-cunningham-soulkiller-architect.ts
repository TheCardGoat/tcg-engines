import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailAltCunninghamSoulkillerArchitect = {
  id: "12475e77-0e16-420e-a935-65eb74290de8",
  externalId: "cb-alt-cunningham-soulkiller-architect",
  slug: "alt-cunningham-soulkiller-architect",
  name: "Alt Cunningham — Soulkiller Architect",
  subname: null,
  displayName: "Alt Cunningham — Soulkiller Architect",
  rulesText:
    "[Spend Icon:] Your next Program this turn plays for -1 €$ for each friendly min Gig, to a minimum of 1 €$.\n1 €$, [Spend Icon:] Play a Program from your trash. Bottom-deck it after you play it. (You still pay its cost.)",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "blue",
  classifications: ["Merc", "Netrunner"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "106",
  printings: [
    {
      id: "cb23a651-dd1d-48f8-aca3-8d33fef79fdd",
      collectorNumber: "106",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/106.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/cb23a651-dd1d-48f8-aca3-8d33fef79fdd/render-mpvmnn4t.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Daniel Valaisis",
    },
    {
      id: "873656f0-c32a-46fb-856f-8a5ee44b8d21",
      collectorNumber: "β106",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b106.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/873656f0-c32a-46fb-856f-8a5ee44b8d21/render-mpu65z5j.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Daniel Valaisis",
    },
  ],
  selectedPrintingId: "cb23a651-dd1d-48f8-aca3-8d33fef79fdd",
  artist: "Daniel Valaisis",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/106.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/cb23a651-dd1d-48f8-aca3-8d33fef79fdd/render-mpvmnn4t.webp",
  rarity: "Rare",
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
      text: "SPEND Your next Program this turn plays for -1 €$ for each friendly min Gig, to a minimum of 1 €$.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
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
          effect: "grantCostModifier",
          player: "friendly",
          appliesTo: {
            selector: "card",
            controller: "friendly",
            zones: ["hand", "trash"],
            cardTypes: ["program"],
          },
          modifier: {
            reducer: "perTargetCount",
            reductionPerCount: 1,
            target: {
              selector: "gig",
              controller: "friendly",
              minValue: 1,
              maxValue: 1,
              amount: "all",
            },
            min: 1,
          },
          duration: "turn",
          uses: 1,
        },
      ],
    },
    {
      kind: "triggered",
      text: "1 €$, SPEND Play a Program from your trash. Bottom-deck it after you play it. (You still pay its cost.)",
      trigger: {
        trigger: "activated",
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
            zones: ["trash"],
            cardTypes: ["program"],
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
          effect: "playCard",
          target: {
            selector: "bound",
            id: "selectedProgram",
          },
        },
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
  reminderText: [],
} satisfies StructuredCardDefinition;
