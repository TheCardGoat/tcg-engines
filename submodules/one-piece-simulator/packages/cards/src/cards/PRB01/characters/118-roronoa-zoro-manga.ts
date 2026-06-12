import type { CharacterCard } from "@tcg/op-types";
import { prb01RoronoaZoroManga118I18n } from "./118-roronoa-zoro-manga.i18n.ts";

export const prb01RoronoaZoroManga118: CharacterCard = {
  id: "OP06-118",
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "PRB01",
  cost: 9,
  power: 9000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[When Attacking][Once Per Turn](1)(You may rest the specified number of DON!! cards in your cost area.): Set this Character as active.[Activate:Main][Once Per Turn](2)(You may rest the specified number of DON!! cards in your cost area.): Set this Character as active.Disclaimer: This card was reprinted from the original set without the original textured foil.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb01RoronoaZoroManga118I18n,
};
