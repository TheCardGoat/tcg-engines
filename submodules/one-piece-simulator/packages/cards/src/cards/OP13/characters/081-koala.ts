import type { CharacterCard } from "@tcg/op-types";
import { op13Koala081I18n } from "./081-koala.i18n.ts";

export const op13Koala081: CharacterCard = {
  id: "OP13-081",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "strike",
  effect:
    'If your Leader has the "Revolutionary Army" type, this Character gains +3 cost.\n[Activate: Main] [Once Per Turn] You may place 1 card from your trash at the bottom of your deck: Give up to 1 rested DON!! card to your Leader or 1 of your Characters.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op13Koala081I18n,
};
