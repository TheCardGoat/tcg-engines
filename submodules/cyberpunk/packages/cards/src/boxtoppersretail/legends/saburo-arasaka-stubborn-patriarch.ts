import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const boxTopperRetailSaburoArasakaStubbornPatriarch = {
  id: "cf50fa24-bf94-4c35-bcc1-c6d56a6f68d8",
  externalId: "cb-saburo-arasaka-stubborn-patriarch",
  slug: "saburo-arasaka-stubborn-patriarch",
  name: "Saburo Arasaka — Stubborn Patriarch",
  subname: null,
  displayName: "Saburo Arasaka — Stubborn Patriarch",
  rulesText:
    "Friendly ARASAKA Units have +1 power while attacking.\n(Units steal an extra Gig for every 10 power.)",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "boxtoppersretail",
    name: "Box Toppers — Retail",
  },
  printNumber: "004",
  printings: [
    {
      id: "77e482f2-6090-47e9-9d03-be28417cb1cb",
      collectorNumber: "004",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersretail/004.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/77e482f2-6090-47e9-9d03-be28417cb1cb/render-mpvt1ulj.webp",
      set: {
        code: "boxtoppersretail",
        name: "Box Toppers — Retail",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Unknown",
    },
    {
      id: "6ac7adce-01af-4b5b-956b-698eda0bed14",
      collectorNumber: "013",
      imageUrl:
        "https://r2.tcg.online/public/cyberpunk/cards/embracingpowerretailstarterdeck/013.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/6ac7adce-01af-4b5b-956b-698eda0bed14/render-mpwbxd5h.webp",
      set: {
        code: "embracingpowerretailstarterdeck",
        name: "Embracing Power — Retail Starter Deck",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "ADIA",
    },
    {
      id: "0cb4ae83-a7ca-4ca6-9c83-6c0581baae57",
      collectorNumber: "β004",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersbeta/b004.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/0cb4ae83-a7ca-4ca6-9c83-6c0581baae57/render-mpvsuufh.webp",
      set: {
        code: "boxtoppersbeta",
        name: "Box Toppers — Beta",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Unknown",
    },
    {
      id: "54136fbd-ce97-4d23-a8e8-f876e3e64819",
      collectorNumber: "β013",
      imageUrl:
        "https://r2.tcg.online/public/cyberpunk/cards/embracingpowerbetastarterdeck/b013.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/54136fbd-ce97-4d23-a8e8-f876e3e64819/render-mpwbo5to.webp",
      set: {
        code: "embracingpowerbetastarterdeck",
        name: "Embracing Power — Beta Starter Deck",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "ADIA",
    },
  ],
  selectedPrintingId: "77e482f2-6090-47e9-9d03-be28417cb1cb",
  artist: "ADIA",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersretail/004.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/77e482f2-6090-47e9-9d03-be28417cb1cb/render-mpvt1ulj.webp",
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
      kind: "static",
      text: "Friendly ARASAKA Units have +1 power while attacking.",
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "modifyPower",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            classifications: ["Arasaka"],
          },
          value: 1,
          duration: "continuous",
          conditions: [
            {
              condition: "attacking",
              target: {
                selector: "self",
              },
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Units steal an extra Gig for every 10 power."],
} satisfies StructuredCardDefinition;
