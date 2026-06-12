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
        title: "ABGEKATERTES SPIEL",
        description:
          "— Decke die oberste Karte deines Decks auf. Falls sie eine Kater-Karlo-Charakterkarte ist, darfst du sie kostenlos ausspielen.",
      },
    ],
  },
  fr: {
    name: "Pat",
    version: "Champion de lutte",
    text: [
      {
        title: "RÉ-PAT-ITION",
        description:
          "— Révélez la carte du dessus de votre pioche. Si c'est un personnage Pat, vous pouvez le jouer gratuitement.",
      },
    ],
  },
  it: {
    name: "Gambadilegno",
    version: "Campione di Wrestling",
    text: [
      {
        title: "RADDOPPIETRO",
        description:
          "— Rivela la prima carta del tuo mazzo. Se è una carta personaggio chiamata Gambadilegno, puoi giocarla gratis.",
      },
    ],
  },
};
