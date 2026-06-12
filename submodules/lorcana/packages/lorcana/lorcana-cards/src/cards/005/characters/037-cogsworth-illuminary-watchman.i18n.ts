import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cogsworthIlluminaryWatchmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cogsworth",
    version: "Illuminary Watchman",
    text: [
      {
        title: "TIME TO MOVE IT!",
        description:
          "When you play this character, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
      },
    ],
  },
  de: {
    name: "Von Unruh",
    version: "Uhralter Wächter des Illuminariums",
    text: [
      {
        title: "ZEIT, SICH ZU BEWEGEN!",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug Rasant. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "Big Ben",
    version: "Gardien de l'Illuminarium",
    text: [
      {
        title: "IL FAUT ARRÊTER ÇA!",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne Charge pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Tockins",
    version: "Sentinella dell'Illuminarium",
    text: [
      {
        title: "È ORA DI MUOVERSI!",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene Lesto per questo turno. (Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
};
