import type { EventCard } from "@tcg/op-types";
import { printing, strawHat } from "../st01-helpers.ts";
import { st01DiableJambe016I18n } from "./st01-016-diable-jambe.i18n.ts";

export const st01DiableJambe016: EventCard = {
  id: "ST01-016",
  canonicalId: "ST01-016",
  slug: "diable-jambe",
  name: "Diable Jambe",
  printings: [printing("ST01-016", "C")],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 1,
  traits: strawHat,
  trigger:
    "[Trigger] K.O. up to 1 of your opponent's [Blocker] Characters with a cost of 3 or less.",
  effect:
    "[Main] Select up to 1 of your {Straw Hat Crew} type Leader or Character cards. Your opponent cannot activate [Blocker] if that Leader or Character attacks during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "trait", value: "Straw Hat Crew", match: "includes" }],
            },
            keyword: "unblockable",
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "hasKeyword", value: "blocker" },
                { filter: "cost", comparison: "lte", value: 3 },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st01DiableJambe016I18n,
};
