import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theSorcerersHatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Sorcerer's Hat",
    text: [
      {
        title: "INCREDIBLE ENERGY",
        description:
          "{E}, 1 {I} — Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
      },
    ],
  },
  de: {
    name: "Der Zauberhut",
    text: [
      {
        title: "UNGLAUBLICHE ENERGIE, 1",
        description:
          "— Benenne eine Karte, decke danach die oberste Karte deines Decks auf. Falls es die benannte Karte ist, nimm sie auf deine Hand. Falls nicht, lege sie zurück auf dein Deck.",
      },
    ],
  },
  fr: {
    name: "Le chapeau de sorcier",
    text: [
      {
        title: "INCROYABLE",
        description:
          "ÉNERGIE, 1 — Nommez une carte puis révélez la première carte de votre pioche. S'il s'agit de la carte nommée, ajoutez-la à votre main. Sinon, remettez-la sur le dessus de votre pioche.",
      },
    ],
  },
  it: {
    name: "Cappello dello Stregone",
    text: [
      {
        title: "INCREDIBILE ENERGIA, 1",
        description:
          "— Nomina una carta, dopodiché rivela la prima carta del tuo mazzo. Se è la carta nominata, aggiungila alla tua mano. Altrimenti, mettila in cima al tuo mazzo.",
      },
    ],
  },
};
