import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { brutalAssault } from "./brutal-assault.ts";

export const brutalAssaultI18n = defineFamilyI18n(brutalAssault, {
  en: { name: "Brutal Assault", typeText: "Generic Action - Attack" },
});

export const {
  red: brutalAssaultRedI18n,
  yellow: brutalAssaultYellowI18n,
  blue: brutalAssaultBlueI18n,
} = brutalAssaultI18n.cards;
