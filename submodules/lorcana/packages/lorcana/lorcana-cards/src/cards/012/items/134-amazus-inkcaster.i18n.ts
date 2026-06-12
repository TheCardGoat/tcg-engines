import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const amazusInkcasterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Amazu's Inkcaster",
    text: [
      {
        title: "ON THE HORIZON",
        description:
          "{E}, 1 {I} — Look at the top 4 cards of your deck. You may reveal a location card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Amazus Tintenformer",
    text: [
      {
        title: "Am Horizont",
        description:
          "{E}, 1 {I} — Schaue dir die obersten 4 Karten deines Decks an. Du darfst 1 Ortskarte daraus aufdecken und auf deine Hand nehmen. Lege die restlichen Karten in beliebiger Reihenfolge unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Invocateur d’Encre d’Amazu",
    text: [
      {
        title: "À l'horizon",
        description:
          "{E}, 1 {I} — Regardez les 4 cartes du dessus de votre pioche. Vous pouvez révéler une carte Lieu parmi elles et l'ajouter à votre main. Placez les autres cartes sous votre pioche, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Inchiostratore di Amazu",
    text: [
      {
        title: "All'Orizzonte",
        description:
          "{E}, 1 {I} — Guarda le prime 4 carte del tuo mazzo. Puoi rivelare una carta luogo e aggiungerla alla tua mano. Metti il resto in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
};
