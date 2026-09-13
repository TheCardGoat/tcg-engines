import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { electrynJoltstep } from "./electryn-joltstep.ts";

export const electrynJoltstepI18n = defineFamilyI18n(electrynJoltstep, {
  en: {
    name: "Electryn Joltstep",
    text: ({
      powerBonus,
    }) => `Your next Runeblade or Lightning attack this turn gets +${powerBonus}{p}.
Create a Lightning Flow token.
Go again`,
    typeText: "Lightning Runeblade Action",
  },
});

export const {
  red: electrynJoltstepRedI18n,
  yellow: electrynJoltstepYellowI18n,
  blue: electrynJoltstepBlueI18n,
} = electrynJoltstepI18n.cards;
