import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailJackieWellesRideOrDieChoom = {
  id: "b665e103-456b-4c51-9551-95b0bc87212a",
  externalId: "cb-jackie-welles-ride-or-die-choom",
  slug: "jackie-welles-ride-or-die-choom",
  name: "Jackie Welles — Ride or Die Choom",
  displayName: "Jackie Welles — Ride or Die Choom",
  rulesText:
    "{Attack} Give this Unit +2 power this turn for each friendly Gig with an even value.\n{Defeated} Draw 1 for each friendly Gig with an odd value.",
  color: "yellow",
  classifications: ["Merc", "Valentino"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "048",
  printings: [
    {
      id: "12d44604-ad7b-4e82-b517-9edb0be44427",
      collectorNumber: "048",
      setCode: "welcometonightcityretail",
      rarity: "Epic",
    },
    {
      id: "93f68b18-e15c-44be-883b-8db7990646f1",
      collectorNumber: "β048",
      setCode: "welcometonightcitybeta",
      rarity: "Epic",
    },
  ],
  selectedPrintingId: "12d44604-ad7b-4e82-b517-9edb0be44427",
  artist: "Ilya Kuvshinov",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/048.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 6,
  power: 8,
  abilities: [
    {
      kind: "static",
      text: "Attack Give this Unit +2 power this turn for each friendly Gig with an even value. Defeated Draw 1 for each friendly Gig with an odd value.",
      effects: [],
    },
  ],
  reminderText: [],
} satisfies WelcomeToNightCityRetailCardDefinition;
