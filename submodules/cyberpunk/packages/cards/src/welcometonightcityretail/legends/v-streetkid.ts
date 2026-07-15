import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { goSoloAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailVStreetkid = defineCyberpunkCard({
  id: "81a8dec7-9541-4020-93e1-7d798a57dcbc",
  slug: "v-streetkid",
  rulesText:
    "{Call} Trash 3. Then, add 1 BRAINDANCE Program from your trash to your hand.\n{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
  name: "V — StreetKid",
  displayName: "V — StreetKid",
  canonicalId: "v-streetkid",
  color: "red",
  classifications: ["Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "005a",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/005a.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  keywords: ["goSolo"],
  type: "legend",
  cost: 5,
  power: 6,
  abilities: [
    goSoloAbility(),
    {
      kind: "triggered",
      text: "CALL Trash 3. Then, add 1 BRAINDANCE Program from your trash to your hand. GO SOLO (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "trashFromDeck",
          player: "friendly",
          amount: 3,
        },
        {
          effect: "moveCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["trash"],
            cardTypes: ["program"],
            classifications: ["Braindance"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          destination: "hand",
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
