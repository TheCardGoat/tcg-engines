import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { quickAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailSafetyOverride = defineCyberpunkCard({
  id: "b4cba235-816d-4888-a308-1c397b9288e7",
  canonicalId: "safety-override",
  slug: "safety-override",
  name: "Safety Override",
  displayName: "Safety Override",
  rulesText:
    "{Quick} The next time a friendly Unit loses a fight this turn, defeat the opposing rival Unit.",
  color: "yellow",
  classifications: ["Quickhack"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "069",
  artist: "Miguel Valderrama",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/069.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  keywords: ["quick"],
  abilities: [
    quickAbility(),
    {
      kind: "triggered",
      text: "Quick The next time a friendly Unit loses a fight this turn, defeat the opposing rival Unit.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "grantNextFriendlyFightLossDefeat",
          duration: "turn",
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 2,
}) satisfies ProgramCardDefinition;
