import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { goSoloAbility } from "@tcg/cyberpunk-types";

export const spoilerAltCunninghamSoulkillerArchitect = defineCyberpunkCard({
  id: "5bbc73e5-14c8-4817-8ffc-865dc0c6d068",
  slug: "alt-cunningham-soulkiller-architect",
  rulesText:
    "GO SOLO When this Legend steals a Gig, you may remove this Legend from the game. If you do, choose a Program from your trash. Play it for free.",
  subname: "Soulkiller Architect",
  name: "Alt Cunningham",
  displayName: "Alt Cunningham - Soulkiller Architect",
  canonicalId: "alt-cunningham-soulkiller-architect",
  color: "blue",
  classifications: ["Merc", "Netrunner"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "121",
  artist: "Pandart Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/121.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["goSolo"],
  type: "legend",
  cost: 6,
  power: 4,
  abilities: [
    goSoloAbility(),
    {
      kind: "triggered",
      text: "When this Legend steals a Gig, you may remove this Legend from the game. If you do, choose a Program from your trash. Play it for free.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
          },
          minAmount: 1,
          source: {
            selector: "self",
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "removeFromGame",
            target: {
              selector: "self",
            },
            optional: true,
          },
          ifEffects: [
            {
              effect: "playCard",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["trash"],
                cardTypes: ["program"],
              },
              free: true,
            },
          ],
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
