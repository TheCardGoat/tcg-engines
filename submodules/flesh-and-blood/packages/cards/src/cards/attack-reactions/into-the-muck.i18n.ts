import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { intoTheMuck } from "./into-the-muck.ts";

export const intoTheMuckI18n = defineFamilyI18n(intoTheMuck, {
  en: {
    name: "Into the Muck",
    typeText: "Warrior Attack Reaction",
    text: "Play this only if you've wagered this chain link.\nBanish a non-equipment defending card on the active chain link.",
  },
});

export const { red: intoTheMuckRedI18n } = intoTheMuckI18n.cards;
