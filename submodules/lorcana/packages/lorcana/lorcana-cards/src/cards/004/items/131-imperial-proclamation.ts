import type { ItemCard } from "@tcg/lorcana-types";
import { imperialProclamationI18n } from "./131-imperial-proclamation.i18n";

export const imperialProclamation: ItemCard = {
  id: "NaH",
  canonicalId: "ci_NaH",
  reprints: ["set4-131"],
  cardType: "item",
  name: "Imperial Proclamation",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 131,
  rarity: "rare",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_32f858adfcc74249b32a879235f871c1",
    tcgPlayer: 548191,
  },
  text: [
    {
      title: "CALL TO THE FRONT",
      description:
        "Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
    },
  ],
  abilities: [
    {
      id: "NaH-1",
      name: "CALL TO THE FRONT",
      text: "CALL TO THE FRONT Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
      type: "triggered",
      trigger: {
        event: "challenge",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
        duration: "next-play-this-turn",
      },
    },
  ],
  i18n: imperialProclamationI18n,
};
