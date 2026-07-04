import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailGildedMatoN = defineCyberpunkCard({
  id: "0901652d-99c9-46c7-9821-ca3e8208fb4d",
  slug: "gilded-mato-n",
  rulesText:
    "{Play} You may defeat a friendly Gear. If you do, defeat a rival Unit with cost 3 or less.",
  name: "Gilded Matón",
  displayName: "Gilded Matón",
  canonicalId: "gilded-mato-n",
  color: "yellow",
  classifications: ["Ganger", "Valentino"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "045",
  artist: "Josan Gonzalez (Deathburger)",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/045.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  type: "unit",
  cost: 4,
  power: 3,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY You may defeat a friendly Gear. If you do, defeat a rival Unit with cost 3 or less.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "defeat",
            target: {
              selector: "card",
              controller: "friendly",
              cardTypes: ["gear"],
            },
            optional: true,
          },
          ifEffects: [
            {
              effect: "defeat",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                maxCost: 3,
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
    },
  ],
}) satisfies UnitCardDefinition;
