import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blasmophetSBoon } from "./blasmophet-s-boon.ts";

export const blasmophetSBoonI18n = defineFamilyI18n(blasmophetSBoon, {
  en: {
    name: "Blasmophet's Boon",
    typeText: "Shadow Brute Action - Attack",
    text: "If you control a Blasmophet, this card's {p} is 6. Otherwise, it's 0.\nBlood Debt",
  },
});

export const { blue: blasmophetSBoonBlueI18n } = blasmophetSBoonI18n.cards;
