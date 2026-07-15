import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bestowAGiftI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bestow a Gift",
    text: "Move 1 damage counter from chosen character to chosen opposing character.",
  },
  de: {
    name: "Ein Geschenk machen",
    text: "Verschiebe 1 Schadensmarker von einem Charakter deiner Wahl zu einem gegnerischen Charakter deiner Wahl.",
  },
  fr: {
    name: "Offrir un don",
    text: "Choisissez un personnage, déplacez 1 de ses jetons Dommage sur un personnage adverse de votre choix.",
  },
  it: {
    name: "Porgere un Dono",
    text: "Sposta 1 segnalino danno da un personaggio a tua scelta a un personaggio avversario a tua scelta.",
  },
};
