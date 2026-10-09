import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { welcomeToNightCityRetailRuthlessLowlifeI18n } from "./ruthless-lowlife.i18n.ts";

export const welcomeToNightCityRetailRuthlessLowlife = defineCyberpunkCard(
  {
    id: "fee335a7-2546-48a5-9bb8-b0886014ce66",
    canonicalId: "ruthless-lowlife",
    slug: "ruthless-lowlife",
    color: "red",
    classifications: ["Ganger", "Maelstrom"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "017",
    artist: "Jeffrey Alan Love",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/017.webp",
    rarity: "Common",
    legality: "legal",
    hasSellTag: false,
    ram: 1,
    abilities: [
      {
        kind: "static",
        text: "This Unit can only attack rival Units. (It can't attack Gig areas.)",
        effects: [
          {
            effect: "grantRule",
            target: { selector: "self" },
            rule: "cantAttackRival",
            duration: "continuous",
          },
        ],
      },
    ],
    type: "unit",
    cost: 2,
    power: 4,
  },
  welcomeToNightCityRetailRuthlessLowlifeI18n,
) satisfies UnitCardDefinition;
