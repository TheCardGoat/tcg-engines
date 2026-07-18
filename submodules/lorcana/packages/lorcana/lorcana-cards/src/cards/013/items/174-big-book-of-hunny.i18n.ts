import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bigBookOfHunnyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Big Book of Hunny",
    text: [
      {
        title: "INVOKE HUNNY",
        description:
          "{E}, 2 {I} — Reveal the top card of your deck. If it's a Hunny card, put it into your hand. Otherwise, put it on the bottom of your deck.",
      },
    ],
  },
  de: {
    name: "Großes Honigbuch",
    text: [
      {
        title: "Honig beschwören",
        description:
          "{E}, 2 {I} — Decke die oberste Karte deines Decks auf. Falls sie eine Honig-Karte ist, nimm sie auf deine Hand. Falls nicht, lege sie unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Grand livre du miel",
    text: [
      {
        title: "Invocation de miel",
        description:
          "{E}, 2 {I} — Révélez la carte du dessus de votre pioche. S'il s'agit d'une carte Miel, ajoutez-la à votre main. Sinon, placez-la sous votre pioche.",
      },
    ],
  },
  it: {
    name: "Grande Libro del Miele",
    text: [
      {
        title: "Invocazione del Miele",
        description:
          "{E}, 2 {I} — Rivela la prima carta del tuo mazzo. Se è una carta Miele, aggiungila alla tua mano. Altrimenti, mettila in fondo al tuo mazzo.",
      },
    ],
  },
  es: {
    name: "Gran libro de la miel",
    text: [
      {
        title: "INVOCAR CARIÑO",
        description:
          "{E}, 2 {I}: revela la carta superior de tu mazo. Si es una carta de Hunny, ponla en tu mano. De lo contrario, colóquelo en el fondo de su plataforma.",
      },
    ],
  },
};
