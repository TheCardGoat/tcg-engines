import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailDyingNightVSPistol = {
  id: "df06b6e2-1675-48a3-bfe2-d0bc4c5f35eb",
  externalId: "cb-dying-night-v-s-pistol",
  slug: "dying-night-v-s-pistol",
  name: "Dying Night — V's Pistol",
  displayName: "Dying Night — V's Pistol",
  rulesText:
    '(Equip to a friendly Unit or face-up Legend.)\n{Attack} Decrease a Gig by up to 2. At the end of your turn, if this Unit is named "V", ready 2 Eddies.',
  color: "blue",
  classifications: ["Merc", "Weapon"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "128",
  printings: [
    {
      id: "2b1b6268-193f-4b9e-a63c-0cbc200d6db7",
      collectorNumber: "128",
      setCode: "welcometonightcityretail",
      rarity: "Rare",
    },
    {
      id: "3ceebded-0941-477f-b486-f2cb22ca653d",
      collectorNumber: "β128",
      setCode: "welcometonightcitybeta",
      rarity: "Rare",
    },
    {
      id: "4bb35017-9842-4178-99a6-34353a3de2d4",
      collectorNumber: "017",
      setCode: "theheistretailstarterdeck",
      rarity: "Rare",
    },
    {
      id: "1dc3c618-a40a-4717-bf4d-a573915c8ac0",
      collectorNumber: "β017",
      setCode: "theheistbetastarterdeck",
      rarity: "Rare",
    },
  ],
  selectedPrintingId: "2b1b6268-193f-4b9e-a63c-0cbc200d6db7",
  artist: "Ivan Shavrin",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/128.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "gear",
  cost: 2,
  power: 2,
  abilities: [
    {
      kind: "static",
      text: 'Attack Decrease a Gig by up to 2. At the end of your turn, if this Unit is named "V", ready 2 Eddies.',
      effects: [],
    },
  ],
  reminderText: [],
  attachment: {
    text: "Equip to a unit or face-up legend.",
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["field", "legendArea"],
      cardTypes: ["unit", "legend"],
      face: "faceUp",
    },
  },
} satisfies WelcomeToNightCityRetailCardDefinition;
