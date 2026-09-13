import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { polarBlast } from "./polar-blast.ts";

export const polarBlastI18n = defineFamilyI18n(polarBlast, {
  en: {
    name: "Polar Blast",
    text: (_parameter, color) =>
      `Target opposing hero may pay ${color === "red" ? "{r}{r}" : color === "yellow" ? "{r}{r}{r}" : "{r}"}. If they don't your next attack this turn gains dominate.\nIf Polar Blast is played from arsenal, draw a card.\nGo again`,
    typeText: "Ice Action",
  },
});

export const {
  red: polarBlastRedI18n,
  yellow: polarBlastYellowI18n,
  blue: polarBlastBlueI18n,
} = polarBlastI18n.cards;
