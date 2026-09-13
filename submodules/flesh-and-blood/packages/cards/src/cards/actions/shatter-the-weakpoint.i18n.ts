import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shatterTheWeakpoint } from "./shatter-the-weakpoint.ts";

export const shatterTheWeakpointI18n = defineFamilyI18n(shatterTheWeakpoint, {
  en: {
    name: "Shatter the Weakpoint",
    typeText: "Warrior Action",
    text: 'Your next sword attack this turn gets +4{p} and "When this hits a Warrior hero, destroy an equipment they control with 0{d}."\nGo again',
  },
});

export const { red: shatterTheWeakpointRedI18n } = shatterTheWeakpointI18n.cards;
