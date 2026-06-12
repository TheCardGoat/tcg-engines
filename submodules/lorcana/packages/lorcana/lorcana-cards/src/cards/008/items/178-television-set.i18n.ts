import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const televisionSetI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Television Set",
    text: [
      {
        title: "IS IT ON YET?",
        description:
          "{E}, 1 {I} — Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.",
      },
    ],
  },
  de: {
    name: "Fernseher",
    text: [
      {
        title: "LÄUFT SIE SCHON?,",
        description:
          "1 — Schaue dir die oberste Karte deines Decks an. Falls sie eine Welpen-Charakterkarte ist, darfst du sie aufdecken und auf deine Hand nehmen. Falls nicht, lege sie unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Poste de télévision",
    text: [
      {
        title: "ÇA A COMMENCÉ?,",
        description:
          "1 — Regardez la carte du dessus de votre pioche. S'il s'agit d'une carte Personnage Chiot, vous pouvez la révéler et la prendre en main. Sinon, placez-la sous votre pioche.",
      },
    ],
  },
  it: {
    name: "Televisore",
    text: [
      {
        title: "È GIÀ INIZIATO?,",
        description:
          "1 — Guarda la prima carta del tuo mazzo. Se è una carta personaggio Cucciolo, puoi rivelarla e aggiungerla alla tua mano. Altrimenti, mettila in fondo al tuo mazzo.",
      },
    ],
  },
};
