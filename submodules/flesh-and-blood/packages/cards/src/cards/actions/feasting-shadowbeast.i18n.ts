import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { feastingShadowbeast } from "./feasting-shadowbeast.ts";

export const feastingShadowbeastI18n = defineFamilyI18n(feastingShadowbeast, {
  en: {
    name: "Feasting Shadowbeast",
    typeText: "Shadow Brute Action - Attack",
    text: "When this attacks, banish the top card of your deck.\nIf you've banished a card with 6 or more {p} this turn, this gets +2{p}.\nBlood Debt",
  },
});

export const {
  red: feastingShadowbeastRedI18n,
  yellow: feastingShadowbeastYellowI18n,
  blue: feastingShadowbeastBlueI18n,
} = feastingShadowbeastI18n.cards;
