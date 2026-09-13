import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { takeAim } from "./take-aim.ts";

export const takeAimI18n = defineFamilyI18n(takeAim, {
  en: {
    name: "Take Aim",
    text: ({
      textValue1,
    }) => `The next Ranger attack action card you play this turn, gains +${textValue1}{p}.
Reload
Go again`,
    typeText: "Ranger Action",
  },
});

export const {
  red: takeAimRedI18n,
  yellow: takeAimYellowI18n,
  blue: takeAimBlueI18n,
} = takeAimI18n.cards;
