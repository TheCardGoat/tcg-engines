import type { CharacterCard } from "@tcg/op-types";
import { op09DonquixoteRosinante032I18n } from "./032-donquixote-rosinante.i18n.ts";

export const op09DonquixoteRosinante032: CharacterCard = {
  id: "OP09-032",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates Navy ODYSSEY"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Your Opponent's Attack] [Once Per Turn] Set this Character as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onOpponentAttack",
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
  i18n: op09DonquixoteRosinante032I18n,
};
