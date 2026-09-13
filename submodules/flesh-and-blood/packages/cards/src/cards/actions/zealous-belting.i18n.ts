import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { zealousBelting } from "./zealous-belting.ts";

export const zealousBeltingI18n = defineFamilyI18n(zealousBelting, {
  en: {
    name: "Zealous Belting",
    text: "While there is a card in your pitch zone with {p} greater than Zealous Belting's base {p}, Zealous Belting has go again.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: zealousBeltingRedI18n,
  yellow: zealousBeltingYellowI18n,
  blue: zealousBeltingBlueI18n,
} = zealousBeltingI18n.cards;
