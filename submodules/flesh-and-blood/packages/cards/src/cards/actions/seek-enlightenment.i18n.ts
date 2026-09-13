import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { seekEnlightenment } from "./seek-enlightenment.ts";

export const seekEnlightenmentI18n = defineFamilyI18n(seekEnlightenment, {
  en: {
    name: "Seek Enlightenment",
    text: ({
      powerBonus,
    }) => `The next attack action card you play this turn gains +${powerBonus}{p} and "If this hits, put it into your hero's soul."
Go again`,
    typeText: "Light Action",
  },
});

export const {
  red: seekEnlightenmentRedI18n,
  yellow: seekEnlightenmentYellowI18n,
  blue: seekEnlightenmentBlueI18n,
} = seekEnlightenmentI18n.cards;
