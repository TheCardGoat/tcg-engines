import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pry } from "./pry.ts";

export const pryI18n = defineFamilyI18n(pry, {
  en: {
    name: "Pry",
    text: ({ revealCount }) => {
      const revealed = revealCount === 1 ? "a card" : `${revealCount} cards`;
      return `Target hero reveals ${revealed} from their hand. If Pry is played during an opponents turn, instead they reveal all cards in their hand.\nYou may choose a card revealed this way. If you do, that hero puts it on the bottom of their deck then draws a card.`;
    },
    typeText: "Wizard Action",
  },
});

export const { red: pryRedI18n, yellow: pryYellowI18n, blue: pryBlueI18n } = pryI18n.cards;
