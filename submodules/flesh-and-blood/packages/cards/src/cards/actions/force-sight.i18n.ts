import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { forceSight } from "./force-sight.ts";

export const forceSightI18n = defineFamilyI18n(forceSight, {
  en: {
    name: "Force Sight",
    typeText: "Generic Action",
    text: ({ powerBonus }) =>
      `The next attack action card you play this turn gains +${powerBonus}{p}.\nIf Force Sight is played from arsenal, opt 2.\nGo again`,
  },
});

export const {
  red: forceSightRedI18n,
  yellow: forceSightYellowI18n,
  blue: forceSightBlueI18n,
} = forceSightI18n.cards;
