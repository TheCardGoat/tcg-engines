import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const howFarIllGoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "How Far I'll Go",
    text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
  },
  de: {
    name: "Ich bin bereit",
    text: "Schaue dir die obersten 2 Karten deines Decks an. Nimm 1 davon auf deine Hand und lege die andere verdeckt und erschöpft in deinen Tintenvorrat.",
  },
  fr: {
    name: "Le bleu lumière",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Regardez les 2 premières cartes de votre pioche, ajoutez-en 1 à votre main et placez l'autre dans votre réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "Dov'è Che Andrò",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per giocare questa canzone gratis.)",
      },
      {
        title:
          "Guarda le prime 2 carte del tuo mazzo, aggiungine una alla tua mano e l'altra al tuo calamaio, a faccia in giù e impegnata.",
      },
    ],
  },
};
