import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const everythingElseIsObsoleteI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Everything Else Is Obsolete",
    text: "Look at the top 3 cards of your deck. Put one into your inkwell facedown and exerted, one on the top of your deck, and one on the bottom of your deck.",
  },
  de: {
    name: "Die andere Musik ist nur Verschnitt",
    text: "Schaue dir die obersten 3 Karten deines Decks an. Lege 1 davon verdeckt und erschöpft in deinen Tintenvorrat, 1 zurück auf dein Deck und 1 darunter.",
  },
  fr: {
    name: "Tout semble auprès de lui très démodé",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Regardez les 3 cartes du dessus de votre pioche. Placez-en une dans votre réserve d'encre, face cachée et épuisée, une sur votre pioche, et une sous votre pioche.",
      },
    ],
  },
  it: {
    name: "Lo Stesso Prurito Nun Te Dà",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Guarda le prime 3 carte del tuo mazzo. Aggiungine una al tuo calamaio a faccia in giù e impegnata, mettine una in cima al tuo mazzo e una in fondo al tuo mazzo.",
      },
    ],
  },
  es: {
    name: "Everything Else Is Obsolete",
    text: "Look at the top 3 cards of your deck. Put one into your inkwell facedown and exerted, one on the top of your deck, and one on the bottom of your deck.",
  },
};
