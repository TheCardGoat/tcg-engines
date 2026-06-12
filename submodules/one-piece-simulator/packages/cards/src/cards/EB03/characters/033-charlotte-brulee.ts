import type { CharacterCard } from "@tcg/op-types";
import { eb03CharlotteBrulee033I18n } from "./033-charlotte-brulee.i18n.ts";

export const eb03CharlotteBrulee033: CharacterCard = {
  id: "EB03-033",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Opponent's Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck by your effect, if your Leader has the {Big Mom Pirates} type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb03CharlotteBrulee033I18n,
};
