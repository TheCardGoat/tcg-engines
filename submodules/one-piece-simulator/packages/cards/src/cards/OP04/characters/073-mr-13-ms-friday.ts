import type { CharacterCard } from "@tcg/op-types";
import { op04Mr13MsFriday073I18n } from "./073-mr-13-ms-friday.i18n.ts";

export const op04Mr13MsFriday073: CharacterCard = {
  id: "OP04-073",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP04",
  cost: 3,
  power: 1000,
  counter: 2000,
  traits: ["Animal Baroque Works"],
  attribute: "wisdom",
  effect:
    '[Activate:Main] You may trash this Character and 1 of your Characters with a type including "Baroque Works": Add up to 1 DON!! card from your DON!! deck and set it as active. [Trigger] Play this card.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op04Mr13MsFriday073I18n,
};
