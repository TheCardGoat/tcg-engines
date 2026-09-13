import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { scoutThePeriphery } from "./scout-the-periphery.ts";

export const scoutThePeripheryI18n = defineFamilyI18n(scoutThePeriphery, {
  en: {
    name: "Scout the Periphery",
    typeText: "Generic Action",
    text: ({ powerBonus }) =>
      `Look at the top card of target hero's deck.\nThe next attack action card you play from arsenal this turn gains +${powerBonus}{p}.\nGo again`,
  },
});

export const {
  red: scoutThePeripheryRedI18n,
  yellow: scoutThePeripheryYellowI18n,
  blue: scoutThePeripheryBlueI18n,
} = scoutThePeripheryI18n.cards;
