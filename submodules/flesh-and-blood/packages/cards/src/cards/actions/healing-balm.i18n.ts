import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { healingBalm } from "./healing-balm.ts";

export const healingBalmI18n = defineFamilyI18n(healingBalm, {
  en: {
    name: "Healing Balm",
    typeText: "Generic Action",
    text: ({ amount }) => `Gain ${amount}{h}`,
  },
});

export const {
  red: healingBalmRedI18n,
  yellow: healingBalmYellowI18n,
  blue: healingBalmBlueI18n,
} = healingBalmI18n.cards;
