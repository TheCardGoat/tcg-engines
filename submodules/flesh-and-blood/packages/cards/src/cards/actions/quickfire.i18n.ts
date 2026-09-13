import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { quickfire } from "./quickfire.ts";

export const quickfireI18n = defineFamilyI18n(quickfire, {
  en: {
    name: "Quickfire",
    text: ({ value1 }) =>
      `This costs {r} less to play for each Hyper Driver you control.\nThe next attack you boost this turn gets +${value1}{p}.\nGo again`,
    typeText: "Mechanologist Action",
  },
});

export const {
  red: quickfireRedI18n,
  yellow: quickfireYellowI18n,
  blue: quickfireBlueI18n,
} = quickfireI18n.cards;
