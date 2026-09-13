import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { markOfTheFunnelWeb } from "./mark-of-the-funnel-web.ts";

export const markOfTheFunnelWebI18n = defineFamilyI18n(markOfTheFunnelWeb, {
  en: {
    name: "Mark of the Funnel Web",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nWhen this hits a marked hero, banish a card in their arsenal.",
  },
});

export const {
  red: markOfTheFunnelWebRedI18n,
  yellow: markOfTheFunnelWebYellowI18n,
  blue: markOfTheFunnelWebBlueI18n,
} = markOfTheFunnelWebI18n.cards;
