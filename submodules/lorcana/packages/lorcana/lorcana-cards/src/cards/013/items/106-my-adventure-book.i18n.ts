import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const myAdventureBookI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "My Adventure Book",
    text: [
      {
        title: "New Memories",
        description:
          "{E}, 1 {I} — Reveal the top card of your deck. If it's a non-character card or a character card named Kevin, put it into your hand. Otherwise, put it on the bottom of your deck.",
      },
    ],
  },
  de: {
    name: "Mein Abenteuerbuch",
    text: [
      {
        title: "Neue Erinnerungen",
        description:
          "{E}, 1 {I} — Decke die oberste Karte deines Decks auf. Falls sie keine Charakterkarte oder eine Charakterkarte namens Kevin ist, nimm sie auf deine Hand. Falls nicht, lege sie unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Mon livre d’aventure",
    text: [
      {
        title: "Nouveaux souvenirs",
        description:
          "{E}, 1 {I} — Révélez la carte du dessus de votre pioche. S'il s'agit d'une carte non-Personnage ou d'une carte Personnage nommée Kevin, ajoutez-la à votre main. Sinon, placez-la sous votre pioche.",
      },
    ],
  },
  it: {
    name: "Il Libro delle Mie Avventure",
    text: [
      {
        title: "Nuovi Ricordi",
        description:
          "{E}, 1 {I} — Rivela la prima carta del tuo mazzo. Se è una carta non personaggio o una carta personaggio chiamata Kevin, aggiungila alla tua mano. Altrimenti, mettila in fondo al tuo mazzo.",
      },
    ],
  },
  es: {
    name: "Mi libro de aventuras",
    text: [
      {
        title: "Nuevos recuerdos",
        description:
          "{E}, 1 {I}: revela la carta superior de tu mazo. Si es una carta que no es un personaje o una carta de personaje llamada Kevin, ponla en tu mano. De lo contrario, colóquelo en el fondo de su plataforma.",
      },
    ],
  },
};
