import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const zeroToHeroI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Zero to Hero",
    text: "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
  },
  de: {
    name: "In Sekunden auf Hundert",
    text: "Zähle deine Charaktere im Spiel. Der nächste Charakter, den du in diesem Zug ausspielst, kostet dich diese Anzahl {I} weniger.",
  },
  fr: {
    name: "De zéro en héros",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Le prochain personnage que vous jouez durant ce tour vous coûte -X {I}, X étant le nombre de personnages que vous avez en jeu à ce moment-là.",
      },
    ],
  },
  it: {
    name: "Zero to Hero",
    text: "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
  },
};
