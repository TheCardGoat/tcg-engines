import type { CharacterCard } from "@tcg/op-types";
import { op07EustassCaptainKidSp074I18n } from "./074-eustass-captain-kid-sp.i18n.ts";

export const op07EustassCaptainKidSp074: CharacterCard = {
  id: "OP05-074",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Your Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "your",
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07EustassCaptainKidSp074I18n,
};
