import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerSandayuOdaHanakoSGuardian = defineCyberpunkCard({
  id: "f8c82c1c-8ef2-4924-b5ba-5bb7f333aae7",
  slug: "sandayu-oda-hanako-s-guardian",
  rulesText:
    "PLAY Spend a rival Unit for each friendly value-pair of Gigs. This Unit can attack rival Units the turn it's played.",
  subname: "Hanako's Guardian",
  name: "Sandayu Oda",
  displayName: "Sandayu Oda - Hanako's Guardian",
  canonicalId: "sandayu-oda-hanako-s-guardian",
  color: "green",
  classifications: ["Ganger", "Valentino"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "088",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/088.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  type: "unit",
  cost: 7,
  power: 8,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Spend a rival Unit for each friendly value-pair of Gigs.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "forEachFriendlyGigPair",
          effects: [
            {
              effect: "spend",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                state: "ready",
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
    {
      kind: "static",
      text: "This Unit can attack rival Units the turn it's played.",
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "canAttackOnPlayedTurnAgainstUnits",
          duration: "continuous",
          conditions: [
            {
              condition: "playedThisTurn",
              target: {
                selector: "self",
              },
            },
          ],
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
