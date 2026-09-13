import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { plunderRun } from "./plunder-run.ts";

export const plunderRunI18n = defineFamilyI18n(plunderRun, {
  en: {
    name: "Plunder Run",
    typeText: "Generic Action",
    text: ({ powerBonus }) =>
      `The next time an attack action card you control hits this turn, draw a card.\nIf Plunder Run is played from arsenal, the next attack action card you play this turn gains +${powerBonus}{p}.\nGo again`,
  },
});

export const {
  red: plunderRunRedI18n,
  yellow: plunderRunYellowI18n,
  blue: plunderRunBlueI18n,
} = plunderRunI18n.cards;
