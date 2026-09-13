import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tigerFormIncantation } from "./tiger-form-incantation.ts";

export const tigerFormIncantationI18n = defineFamilyI18n(tigerFormIncantation, {
  en: {
    name: "Tiger Form Incantation",
    text: ({ bonus }) =>
      `The next Crouching Tiger you play this turn gets +${bonus}{p}.\nIf you've pitched a blue card this turn, create a Crouching Tiger in your hand.`,
    typeText: "Mystic Ninja Action",
  },
});

export const {
  red: tigerFormIncantationRedI18n,
  yellow: tigerFormIncantationYellowI18n,
  blue: tigerFormIncantationBlueI18n,
} = tigerFormIncantationI18n.cards;
