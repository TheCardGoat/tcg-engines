import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { legendsInPlay } from "@tcg/cyberpunk-types";
import { welcomeToNightCityRetailMaxtacSquadronI18n } from "./maxtac-squadron.i18n.ts";

export const welcomeToNightCityRetailMaxtacSquadron = defineCyberpunkCard(
  {
    id: "2a8802d3-598c-4ce3-9051-59ecf965ffbf",
    canonicalId: "maxtac-squadron",
    slug: "maxtac-squadron",
    color: "green",
    classifications: ["NCPD"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "082",
    artist: "Olgierd Ciszak",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/082.webp",
    rarity: "Common",
    legality: "legal",
    hasSellTag: false,
    ram: 3,
    abilities: [
      {
        kind: "triggered",
        text: "At the end of your turn, if this Unit is spent, ready a friendly face-up Legend.",
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
            effect: "ready",
            conditions: [
              {
                condition: "cardState",
                target: {
                  selector: "self",
                },
                state: "spent",
              },
            ],
            target: {
              ...legendsInPlay("friendly", "faceUp"),
              state: "spent",
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
    type: "unit",
    cost: 3,
    power: 4,
  },
  welcomeToNightCityRetailMaxtacSquadronI18n,
) satisfies UnitCardDefinition;
