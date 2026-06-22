import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailAdamSmasherEnderOfLegends = {
  id: "eff41c12-b872-4101-9779-00e691532893",
  externalId: "cb-adam-smasher-ender-of-legends",
  slug: "adam-smasher-ender-of-legends",
  name: "Adam Smasher — Ender of Legends",
  displayName: "Adam Smasher — Ender of Legends",
  rulesText:
    "[GO SOLO] (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\n[PLAY] Defeat a rival Unit.",
  color: "red",
  classifications: ["Arasaka", "Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "001",
  printings: [
    {
      id: "a9c1137e-2e33-4293-9dcc-9351c9a0bbee",
      collectorNumber: "001",
      setCode: "welcometonightcityretail",
      rarity: "Epic",
    },
    {
      id: "4d75c13e-bde2-409b-8bcc-516e054f28f5",
      collectorNumber: "β001",
      setCode: "welcometonightcitybeta",
      rarity: "Epic",
    },
  ],
  selectedPrintingId: "a9c1137e-2e33-4293-9dcc-9351c9a0bbee",
  artist: "Michał Dziekan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/001.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  keywords: ["goSolo"],
  type: "legend",
  cost: 9,
  power: 9,
  abilities: [
    {
      kind: "keyword",
      text: "GO SOLO",
      keyword: "goSolo",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "triggered",
      text: "PLAY Defeat a rival Unit.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
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
    },
  ],
  reminderText: [],
} satisfies WelcomeToNightCityRetailCardDefinition;
