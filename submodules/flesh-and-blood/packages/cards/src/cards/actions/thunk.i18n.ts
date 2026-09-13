import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { thunk } from "./thunk.ts";

export const thunkI18n = defineFamilyI18n(thunk, {
  en: {
    name: "Thunk",
    text: "When you win a clash revealing this, create a Might token.",
    typeText: "Guardian Action - Attack",
  },
});

export const { red: thunkRedI18n, yellow: thunkYellowI18n, blue: thunkBlueI18n } = thunkI18n.cards;
