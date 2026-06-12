import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kristoffsLuteI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kristoff's Lute",
    text: [
      {
        title: "MOMENT OF INSPIRATION",
        description:
          "{E}, 2 {I} — Reveal the top card of your deck. You may play it as if it were in your hand. Otherwise, put it in your discard.",
      },
    ],
  },
  de: {
    name: "Kristoffs Laute",
    text: [
      {
        title: "MOMENT DER INSPIRATION, 2",
        description:
          "— Decke die oberste Karte deines Decks auf. Du darfst sie ausspielen, als wäre sie auf deiner Hand. Wenn du dies nicht tust, lege die Karte auf deinen Ablagestapel.",
      },
    ],
  },
  fr: {
    name: "Luth de Kristoff",
    text: [
      {
        title: "MOMENT D'INSPIRATION, 2",
        description:
          "— Révélez la carte du dessus de votre pioche. Vous pouvez la jouer comme si elle était dans votre main. Sinon, placez-la dans votre défausse.",
      },
    ],
  },
  it: {
    name: "Liuto di Kristoff",
    text: [
      {
        title: "MOMENTO DI ISPIRAZIONE, 2",
        description:
          "— Rivela la prima carta del tuo mazzo. Puoi giocarla come se fosse nella tua mano. Altrimenti, mettila nei tuoi scarti.",
      },
    ],
  },
};
