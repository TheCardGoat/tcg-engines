import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { smashingGoodTime } from "./smashing-good-time.ts";

export const smashingGoodTimeI18n = defineFamilyI18n(smashingGoodTime, {
  en: {
    name: "Smashing Good Time",
    typeText: "Generic Action",
    text: ({ powerBonus }) =>
      `The next time an attack action card hits a hero this turn, you may destroy an item they control with cost 2 or less.\nIf Smashing Good Time is played from arsenal, the next attack action card you play this turn gains +${powerBonus}{p}.\nGo again`,
  },
});

export const {
  red: smashingGoodTimeRedI18n,
  yellow: smashingGoodTimeYellowI18n,
  blue: smashingGoodTimeBlueI18n,
} = smashingGoodTimeI18n.cards;
