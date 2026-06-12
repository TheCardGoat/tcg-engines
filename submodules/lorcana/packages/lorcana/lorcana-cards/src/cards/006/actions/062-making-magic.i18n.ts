import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const makingMagicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Making Magic",
    text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
  },
  de: {
    name: "Magie schaffen",
    text: "Verschiebe 1 Schadensmarker von einem Charakter deiner Wahl zu einem gegnerischen Charakter deiner Wahl. Ziehe 1 Karte.",
  },
  fr: {
    name: "Faire de la magie",
    text: "Choisissez un personnage et déplacez 1 de ses dommages sur un personnage adverse de votre choix. Piochez une carte.",
  },
  it: {
    name: "Fare una Magia",
    text: "Sposta 1 segnalino danno da un personaggio a tua scelta a un personaggio avversario a tua scelta. Pesca una carta.",
  },
};
