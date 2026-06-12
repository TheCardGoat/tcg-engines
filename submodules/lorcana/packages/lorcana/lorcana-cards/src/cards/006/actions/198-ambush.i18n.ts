import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ambushI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ambush!",
    text: "{E} one of your characters to deal damage equal to their {S} to chosen character.",
  },
  de: {
    name: "Überfall!",
    text: "einen deiner Charaktere, um einem Charakter deiner Wahl Schaden in Höhe der des erschöpften Charakters zuzufügen.",
  },
  fr: {
    name: "Embuscade !",
    text: "l'un de vos personnages pour infliger autant de dommages que sa à un personnage de votre choix.",
  },
  it: {
    name: "Imboscata!",
    text: "uno dei tuoi personaggi per infliggere danno pari alla sua a un personaggio a tua scelta.",
  },
};
