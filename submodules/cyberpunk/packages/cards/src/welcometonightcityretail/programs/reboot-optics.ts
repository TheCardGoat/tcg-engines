import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { quickAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailRebootOptics = defineCyberpunkCard({
  id: "ad13a7bc-c49d-4166-8a9c-965e7bfa9b8f",
  canonicalId: "reboot-optics",
  slug: "reboot-optics",
  rulesText:
    "{Quick} The next time a rival Unit fights this turn, it doesn't defeat the opposing friendly Unit.",
  name: "Reboot Optics",
  displayName: "Reboot Optics",
  color: "blue",
  classifications: ["Quickhack"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "136",
  artist: "Miguel Valderrama",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/136.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["quick"],
  timingTriggers: ["play"],
  abilities: [
    quickAbility({ text: "Quick" }),
    {
      kind: "triggered",
      text: "The next time a rival Unit fights this turn, it doesn't defeat the opposing friendly Unit.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "preventNextRivalFightDefeat",
          duration: "turn",
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 2,
  power: null,
}) satisfies ProgramCardDefinition;
