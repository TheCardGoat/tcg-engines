import type { CharacterCard } from "@tcg/op-types";
import { op14eb04KikunojoEb04012012I18n } from "./eb04-012-kikunojo-eb04-012.i18n.ts";

export const op14eb04KikunojoEb04012012: CharacterCard = {
  id: "EB04-012",
  canonicalId: "EB04-012",
  slug: "kikunojo-eb04-012",
  name: "Kikunojo",
  printings: [
    {
      id: "EB04-012",
      artId: "EB04-012",
      setCode: "EB04",
      collectorNumber: "012",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-012_tJwjU5P.jpg",
      label: "Kikunojo - EB04-012",
    },
    {
      id: "EB04-012_p1",
      artId: "EB04-012_p1",
      setCode: "EB04",
      collectorNumber: "012",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-012_p1_AZlti1j.jpg",
      label: "Kikunojo - EB04-012 (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "EB04",
  cost: 7,
  power: 8000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[Activate:Main] [Once Per Turn] If this Character has played on this turn, set your {Land of Wano} type Leader as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "playedThisTurn",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Land of Wano",
                  match: "includes",
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04KikunojoEb04012012I18n,
};
