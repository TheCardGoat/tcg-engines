import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peteWrestlingChampI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pete",
    version: "Wrestling Champ",
    text: [
      {
        title: "RE-PETE",
        description:
          "{E} — Reveal the top card of your deck. If it's a character card named Pete, you may play it for free.",
      },
    ],
  },
  de: {
    name: "Kater Karlo",
    version: "Wrestling-Champion",
    text: [
      {
        title: "Abgekatertes Spiel",
        description:
          "{E} — Decke die oberste Karte deines Decks auf. Falls sie eine Kater-Karlo-Charakterkarte ist, darfst du sie kostenlos ausspielen.",
      },
    ],
  },
  fr: {
    name: "Pat",
    version: "Champion de lutte",
    text: [
      {
        title: "Ré-pat-ition",
        description:
          "{E} — Révélez la carte du dessus de votre pioche. Si c'est un personnage Pat, vous pouvez le jouer gratuitement.",
      },
    ],
  },
  it: {
    name: "Gambadilegno",
    version: "Campione di Wrestling",
    text: [
      {
        title: "Raddoppietro",
        description:
          "{E} — Rivela la prima carta del tuo mazzo. Se è una carta personaggio chiamata Gambadilegno, puoi giocarla gratis.",
      },
    ],
  },
  es: {
    name: "Pete",
    version: "Campeón de lucha libre",
    text: [
      {
        title: "RE-PETE",
        description:
          "{E}: revela la carta superior de tu mazo. Si es una carta de personaje llamada Pete, puedes jugarla gratis.",
      },
    ],
  },
};
