import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const zeroToHeroI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Zero to Hero",
    text: "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
  },
  de: {
    name: "In Sekunden auf Hundert",
    text: "Zähle deine Charaktere im Spiel. Der nächste Charakter, den du in diesem Zug ausspielst, kostet dich diese Anzahl weniger.",
  },
  fr: {
    name: "De zéro en héros",
    text: "Le prochain personnage que vous jouez durant ce tour vous coûte -X, X étant le nombre de personnages que vous avez en jeu à ce moment-là.",
  },
  it: {
    name: "Zero to Hero",
    text: "Count the number of characters you have in play. You pay that amount of less for the next character you play this turn.",
  },
};
