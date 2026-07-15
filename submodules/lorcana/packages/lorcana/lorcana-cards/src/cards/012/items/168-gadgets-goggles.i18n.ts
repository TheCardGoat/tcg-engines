import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gadgetsGogglesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gadget's Goggles",
    text: [
      {
        title: "ENHANCED VISION",
        description:
          "{E}, 1 {I} — Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      },
    ],
  },
  de: {
    name: "Trixis Schutzbrille",
    text: [
      {
        title: "Verbesserte Sicht",
        description:
          "{E}, 1 {I} — Schaue dir die obersten 2 Karten deines Decks an. Lege 1 davon auf dein Deck und die andere darunter.",
      },
    ],
  },
  fr: {
    name: "Lunettes de Gadget",
    text: [
      {
        title: "Vision améliorée",
        description:
          "{E}, 1 {I} — Regardez les 2 cartes du dessus de votre pioche. Placez l'une d'elles sur votre pioche et l'autre dessous.",
      },
    ],
  },
  it: {
    name: "Occhiali di Scheggia",
    text: [
      {
        title: "Vista Potenziata",
        description:
          "{E}, 1 {I} — Guarda le prime 2 carte del tuo mazzo. Mettine una in cima e l'altra in fondo al tuo mazzo.",
      },
    ],
  },
};
