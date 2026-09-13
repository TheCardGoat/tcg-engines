import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sigilOfSolace } from "./sigil-of-solace.ts";

export const sigilOfSolaceI18n = defineFamilyI18n(sigilOfSolace, {
  en: {
    name: "Sigil of Solace",
    typeText: "Generic Instant",
    text: ({ lifeGain }) => `Gain ${lifeGain}{h}`,
  },
});

export const {
  red: sigilOfSolaceRedI18n,
  yellow: sigilOfSolaceYellowI18n,
  blue: sigilOfSolaceBlueI18n,
} = sigilOfSolaceI18n.cards;
