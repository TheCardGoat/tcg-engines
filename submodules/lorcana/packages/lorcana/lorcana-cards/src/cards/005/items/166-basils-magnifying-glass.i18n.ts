import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const basilsMagnifyingGlassI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Basil's Magnifying Glass",
    text: [
      {
        title: "FIND WHAT'S HIDDEN",
        description:
          "{E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Basils Lupe",
    text: [
      {
        title: "VERBORGENES FINDEN, 2",
        description:
          "— Schaue dir die obersten 3 Karten deines Decks an. Du darfst 1 Gegenstandskarte daraus aufdecken und auf deine Hand nehmen. Lege die restlichen Karten in beliebiger Reihenfolge unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Loupe de Basil",
    text: [
      {
        title: "RÉVÉLER L'INVISIBLE,",
        description:
          "2 — Regardez les 3 cartes du dessus de votre pioche. Vous pouvez révéler une carte Objet parmi elles et la prendre en main. Remettez les autres cartes sous votre pioche, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Lente d'Ingrandimento di Basil",
    text: [
      {
        title: "TROVARE",
        description:
          "CIÒ CHE È NASCOSTO, 2 — Guarda le prime 3 carte del tuo mazzo. Puoi rivelare una carta oggetto e aggiungerla alla tua mano. Metti il resto in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
};
