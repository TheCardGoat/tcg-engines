import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfQi } from "./blessing-of-qi.ts";

export const blessingOfQiI18n = defineFamilyI18n(blessingOfQi, {
  en: {
    name: "Blessing of Qi",
    text: (_parameter, color) =>
      `At the start of your turn, destroy this, then create a Crouching Tiger in your banished zone. It gets +${
        color === "red" ? 3 : color === "yellow" ? 2 : 1
      }{p} and you may play it this turn.`,
    typeText: "Ninja Action - Aura",
  },
});

export const {
  red: blessingOfQiRedI18n,
  yellow: blessingOfQiYellowI18n,
  blue: blessingOfQiBlueI18n,
} = blessingOfQiI18n.cards;
