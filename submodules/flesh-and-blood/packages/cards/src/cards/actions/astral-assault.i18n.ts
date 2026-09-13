import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { astralAssault } from "./astral-assault.ts";

export const astralAssaultI18n = defineFamilyI18n(astralAssault, {
  en: {
    name: "Astral Assault",
    typeText: "Lightning Action - Attack",
    text: "When this attacks, you may destroy a Lightning Flow you control. If you do, this gets +2{p}.",
  },
});

export const {
  red: astralAssaultRedI18n,
  yellow: astralAssaultYellowI18n,
  blue: astralAssaultBlueI18n,
} = astralAssaultI18n.cards;
