import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { piercingShadowVise } from "./piercing-shadow-vise.ts";

export const piercingShadowViseI18n = defineFamilyI18n(piercingShadowVise, {
  en: {
    name: "Piercing Shadow Vise",
    text: "You may play Piercing Shadow Vise from your banished zone.\nIf you have dealt arcane damage to an opposing hero this turn, Piercing Shadow Vise gains +2{p}.\nBlood Debt",
    typeText: "Shadow Runeblade Action - Attack",
  },
});

export const {
  red: piercingShadowViseRedI18n,
  yellow: piercingShadowViseYellowI18n,
  blue: piercingShadowViseBlueI18n,
} = piercingShadowViseI18n.cards;
