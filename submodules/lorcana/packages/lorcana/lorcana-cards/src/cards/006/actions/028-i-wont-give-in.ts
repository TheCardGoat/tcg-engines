import type { ActionCard } from "@tcg/lorcana-types";
import { iWontGiveInI18n } from "./028-i-wont-give-in.i18n";

export const iWontGiveIn: ActionCard = {
  id: "j2a",
  canonicalId: "ci_j2a",
  reprints: ["set6-028"],
  cardType: "action",
  name: "I Won't Give In",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "006",
  cardNumber: 28,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_128b29d2aef043efb62b2fb63189c4ca",
    tcgPlayer: 588087,
  },
  text: "Return a character card with cost 2 or less from your discard to your hand.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        type: "return-from-discard",
        target: "CONTROLLER",
        destination: "hand",
        filter: {
          cardType: "character",
          maxCost: 2,
        },
      },
      id: "v73-1",
      text: "Return a character card with cost 2 or less from your discard to your hand.",
      type: "action",
    },
  ],
  i18n: iWontGiveInI18n,
};
