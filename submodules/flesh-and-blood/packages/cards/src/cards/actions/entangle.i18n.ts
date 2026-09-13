import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { entangle } from "./entangle.ts";

export const entangleI18n = defineFamilyI18n(entangle, {
  en: {
    name: "Entangle",
    text: 'Earth Fusion\nIf Entangle was fused, it gains "If this hits a hero, their first attack during their next turn has -2{p}."',
    typeText: "Elemental Guardian Action - Attack",
  },
});

export const {
  red: entangleRedI18n,
  yellow: entangleYellowI18n,
  blue: entangleBlueI18n,
} = entangleI18n.cards;
