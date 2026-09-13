import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bitingGale } from "./biting-gale.ts";

export const bitingGaleI18n = defineFamilyI18n(bitingGale, {
  en: {
    name: "Biting Gale",
    text: "Ice Fusion\nIf Biting Gale was fused, the attacking hero discards a card unless they pay {r}{r}.",
    typeText: "Elemental Guardian Defense Reaction",
  },
});
export const {
  red: bitingGaleRedI18n,
  yellow: bitingGaleYellowI18n,
  blue: bitingGaleBlueI18n,
} = bitingGaleI18n.cards;
