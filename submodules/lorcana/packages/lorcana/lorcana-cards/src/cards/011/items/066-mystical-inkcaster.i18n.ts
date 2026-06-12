import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mysticalInkcasterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mystical Inkcaster",
    text: [
      {
        title: "SPECIAL SUMMONS",
        description:
          "{E}, 3 {I} — Play a character with cost 5 or less for free. They gain Rush. At the end of your turn, banish them. (They can challenge the turn they're played.)",
      },
    ],
  },
  de: {
    name: "Mystischer Tintenformer",
    text: [
      {
        title: "BESONDERE",
        description:
          "BESCHWÖRUNGEN, 3 — Spiele einen Charakter, der 5 oder weniger kostet, kostenlos aus. Er erhält Rasant. Verbanne ihn am Ende deines Zuges. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "Invocateur d’encre mystique",
    text: [
      {
        title: "INVOCATION",
        description:
          "SPÉCIALE, 3 — Jouez gratuitement un personnage coûtant 5 ou moins. Il gagne Charge. À la fin de votre tour, bannissez-le.",
      },
    ],
  },
  it: {
    name: "Inchiostratore Mistico",
    text: [
      {
        title: "EVOCAZIONI SPECIALI, 3",
        description:
          "— Gioca un personaggio con costo 5 o inferiore gratis. Ottiene Lesto. Alla fine del tuo turno, esilialo. (Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
};
