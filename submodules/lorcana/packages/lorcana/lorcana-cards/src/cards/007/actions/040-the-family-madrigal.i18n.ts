import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theFamilyMadrigalI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Family Madrigal",
    text: "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
  },
  de: {
    name: "Familie Madrigal",
    text: "Schaue dir die obersten 5 Karten deines Decks an. Du darfst bis zu 1 Madrigal-Charakterkarte und bis zu 1 Liedkarte daraus aufdecken und auf deine Hand nehmen. Lege die restlichen Karten in beliebiger Reihenfolge auf dein Deck.",
  },
  fr: {
    name: "La Famille Madrigal",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 5 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Regardez les 5 premières cartes de votre pioche. Vous pouvez révéler jusqu'à 1 carte Personnage Madrigal et 1 carte Chanson parmi elles. Placez les cartes révélées dans votre main. Placez les autres cartes sur votre pioche, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "La Famiglia Madrigal",
    text: [
      {
        title:
          "(Un personaggio con costo 5 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Guarda le prime 5 carte del tuo mazzo. Puoi rivelare fino a 1 carta personaggio Madrigal e fino a 1 carta canzone e aggiungerle alla tua mano. Metti il resto in cima al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
  es: {
    name: "La Familia Madrigal",
    text: "Mira las 5 primeras cartas de tu mazo. Puedes revelar hasta 1 carta de personaje de Madrigal y hasta 1 carta de canción y ponerlas en tu mano. Coloca el resto en la parte superior de tu mazo en cualquier orden.",
  },
};
