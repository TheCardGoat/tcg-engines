import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailRidingNomad = {
  id: "20bcc767-29f0-4aa0-b842-4d4e546ed36e",
  externalId: "cb-riding-nomad",
  slug: "riding-nomad",
  name: "Riding Nomad",
  subname: null,
  displayName: "Riding Nomad",
  rulesText: "[ADRENALINE] (This Unit can attack the turn it's played.)",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "green",
  classifications: ["Nomad"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "087",
  printings: [
    {
      id: "1ee3ba07-86b0-4309-be55-4b4698f700b8",
      collectorNumber: "087",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/087.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/1ee3ba07-86b0-4309-be55-4b4698f700b8/render-mpvlx7qq.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Common",
      finish: "standard",
      artist: "Michal Ivan",
    },
    {
      id: "29b3036d-306a-485f-af6c-b08fb5b912ac",
      collectorNumber: "β087",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b087.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/29b3036d-306a-485f-af6c-b08fb5b912ac/render-mpv4hde3.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Common",
      finish: "standard",
      artist: "Michal Ivan",
    },
  ],
  selectedPrintingId: "1ee3ba07-86b0-4309-be55-4b4698f700b8",
  artist: "Michal Ivan",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/087.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/1ee3ba07-86b0-4309-be55-4b4698f700b8/render-mpvlx7qq.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  timingTriggers: [],
  keywords: ["adrenaline"],
  type: "unit",
  cost: 5,
  power: 4,
  abilities: [
    {
      kind: "keyword",
      text: "ADRENALINE (This Unit can attack the turn it's played.)",
      keyword: "adrenaline",
      source: {
        selector: "self",
      },
      effects: [],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
