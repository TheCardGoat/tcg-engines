import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shadenSwing } from "./shaden-swing.ts";

export const shadenSwingI18n = defineFamilyI18n(shadenSwing, {
  en: {
    name: "Shaden Swing",
    text: "As an additional cost to play this, banish a random card from your hand.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: shadenSwingRedI18n,
  yellow: shadenSwingYellowI18n,
  blue: shadenSwingBlueI18n,
} = shadenSwingI18n.cards;
