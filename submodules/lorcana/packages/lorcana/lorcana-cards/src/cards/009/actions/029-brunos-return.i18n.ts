import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const brunosReturnI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bruno's Return",
    text: "Return a character card from your discard to your hand. You may remove up to 2 damage from chosen character.",
  },
  de: {
    name: "Brunos Rückkehr",
    text: "Nimm 1 Charakterkarte aus deinem Ablagestapel zurück auf deine Hand. Entferne danach bis zu 2 Schaden von einem Charakter deiner Wahl.",
  },
  fr: {
    name: "Retour de Bruno",
    text: "Reprenez en main une carte Personnage de votre défausse. Puis choisissez un personnage et retirez-lui jusqu'à 2 jetons Dommage.",
  },
  it: {
    name: "Il Ritorno di Bruno",
    text: "Riprendi in mano una carta personaggio dai tuoi scarti. Poi rimuovi fino a 2 danni da un personaggio a tua scelta.",
  },
};
