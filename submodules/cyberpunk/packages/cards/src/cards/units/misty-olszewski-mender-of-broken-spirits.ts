import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpiritsI18n } from "./misty-olszewski-mender-of-broken-spirits.i18n.ts";

export const welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits = defineCyberpunkCard(
  {
    id: "383abfb4-eedb-47c1-87f0-3ae4973c3619",
    canonicalId: "misty-olszewski-mender-of-broken-spirits",
    slug: "misty-olszewski-mender-of-broken-spirits",
    color: "blue",
    classifications: ["Mystic"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "119",
    artist: "ADIA",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/119.webp",
    rarity: "Rare",
    legality: "legal",
    hasSellTag: false,
    ram: 2,
    abilities: [
      {
        kind: "static",
        text: "This Unit can't attack.",
        effects: [
          {
            effect: "grantRule",
            target: {
              selector: "self",
            },
            rule: "cantAttack",
            duration: "continuous",
          },
        ],
      },
      {
        kind: "triggered",
        text: "At the end of your turn, choose a card type. Then, reveal the top card of your deck. If it's the chosen type, add it to your hand and ready 1 Eddie. Otherwise, trash it. (Card types include Unit, Gear, and Program.)",
        trigger: {
          trigger: "event",
          event: {
            event: "turnEnded",
            player: "friendly",
          },
        },
        source: {
          selector: "self",
        },
        effects: [
          {
            effect: "revealTopCardType",
            player: "friendly",
            cardTypes: ["unit", "gear", "program", "legend"],
          },
        ],
      },
    ],
    type: "unit",
    cost: 3,
    power: 0,
  },
  welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpiritsI18n,
) satisfies UnitCardDefinition;
