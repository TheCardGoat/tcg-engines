import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ambushI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ambush!",
    text: "{E} one of your characters to deal damage equal to their {S} to chosen character.",
  },
  de: {
    name: "Überfall!",
    text: "{E} einen deiner Charaktere, um einem Charakter deiner Wahl Schaden in Höhe der {S} des erschöpften Charakters zuzufügen.",
  },
  fr: {
    name: "Embuscade !",
    text: "{E} l'un de vos personnages pour infliger autant de dommages que sa {S} à un personnage de votre choix.",
  },
  it: {
    name: "Imboscata!",
    text: "{E} uno dei tuoi personaggi per infliggere danno pari alla sua {S} a un personaggio a tua scelta.",
  },
};
