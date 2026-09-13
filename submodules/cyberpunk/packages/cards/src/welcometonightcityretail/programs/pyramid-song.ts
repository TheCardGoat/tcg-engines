import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

const powerDownEffect = {
  effect: "modifyPower" as const,
  target: {
    selector: "card" as const,
    controller: "rival" as const,
    zones: ["field" as const],
    cardTypes: ["unit" as const],
    selection: {
      mode: "choose" as const,
      min: 1,
      max: 1,
    },
  },
  value: -5,
  duration: "turn" as const,
};

const bottomDeckEffect = {
  effect: "moveCard" as const,
  target: {
    selector: "card" as const,
    controller: "rival" as const,
    zones: ["field" as const],
    cardTypes: ["unit" as const],
    maxPower: 0,
    selection: {
      mode: "choose" as const,
      min: 1,
      max: 1,
    },
  },
  destination: "deckBottom" as const,
};

/** Friendly d4 showing face value 1 (a min Gig). */
const friendlyD4IsMin = {
  condition: "targetExists" as const,
  target: {
    selector: "gig" as const,
    controller: "friendly" as const,
    amount: "all" as const,
    sides: "d4" as const,
    maxValue: 1,
  },
};

export const welcomeToNightCityRetailPyramidSong = defineCyberpunkCard({
  id: "7977a175-0516-478e-b166-3edb035849a4",
  canonicalId: "pyramid-song",
  slug: "pyramid-song",
  name: "Pyramid Song",
  displayName: "Pyramid Song",
  rulesText:
    "Choose one effect. If a friendly d4 is a min Gig, choose both instead.\nGive a rival Unit -5 power this turn. // Bottom-deck a rival Unit with power 0.",
  color: "blue",
  classifications: ["Braindance"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "135",
  artist: "Elizaveta Kazakova",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/135.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Choose one effect. If a friendly d4 is a min Gig, choose both instead. Give a rival Unit -5 power this turn. // Bottom-deck a rival Unit with power 0.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "chooseEffect",
          options: [
            {
              id: "both",
              label: "Both effects (friendly d4 is a min Gig)",
              conditions: [friendlyD4IsMin],
              effects: [powerDownEffect, bottomDeckEffect],
            },
            {
              id: "power-down",
              label: "Give a rival Unit -5 power this turn",
              conditions: [{ condition: "not", of: friendlyD4IsMin }],
              effects: [powerDownEffect],
            },
            {
              id: "bottom-deck",
              label: "Bottom-deck a rival Unit with power 0",
              conditions: [{ condition: "not", of: friendlyD4IsMin }],
              effects: [bottomDeckEffect],
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 3,
}) satisfies ProgramCardDefinition;
