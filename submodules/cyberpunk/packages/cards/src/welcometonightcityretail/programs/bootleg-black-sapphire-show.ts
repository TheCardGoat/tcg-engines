import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailBootlegBlackSapphireShow = {
  id: "84561b4c-67f0-4b2e-80ac-6b9c0a2396e3",
  externalId: "cb-bootleg-black-sapphire-show",
  slug: "bootleg-black-sapphire-show",
  name: "Bootleg Black Sapphire Show",
  displayName: "Bootleg Black Sapphire Show",
  rulesText:
    "Sell the top card of your deck.\nIf you control a Gig with an even value and a Gig with an odd value, draw 2.",
  color: "yellow",
  classifications: ["Braindance"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "066",
  printings: [
    {
      id: "decc76ed-f5ed-4f02-90d7-e01e2a3975e0",
      collectorNumber: "066",
      setCode: "welcometonightcityretail",
      rarity: "Uncommon",
    },
    {
      id: "20c23b0f-187d-41d8-9670-b8e603049b3d",
      collectorNumber: "β066",
      setCode: "welcometonightcitybeta",
      rarity: "Uncommon",
    },
  ],
  selectedPrintingId: "decc76ed-f5ed-4f02-90d7-e01e2a3975e0",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/066.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 4,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 5,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Sell the top card of your deck. If you control a Gig with an even value and a Gig with an odd value, draw 2.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "sellFromDeck",
          player: "friendly",
          amount: 1,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 2,
          conditions: [
            {
              condition: "hasEvenAndOddGigValues",
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies WelcomeToNightCityRetailCardDefinition;
