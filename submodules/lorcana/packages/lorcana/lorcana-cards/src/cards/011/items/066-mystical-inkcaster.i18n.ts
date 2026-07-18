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
        title: "Besondere Beschwörungen",
        description:
          "{E}, 3 {I} — Spiele einen Charakter, der 5 oder weniger kostet, kostenlos aus. Er erhält <Rasant>. Verbanne ihn am Ende deines Zuges. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "Invocateur d’encre mystique",
    text: [
      {
        title: "Invocation spéciale",
        description:
          "{E}, 3 {I} — Jouez gratuitement un personnage coûtant 5 ou moins. Il gagne <Charge>. À la fin de votre tour, bannissez-le.",
      },
    ],
  },
  it: {
    name: "Inchiostratore Mistico",
    text: [
      {
        title: "Evocazioni Speciali",
        description:
          "{E}, 3 {I} — Gioca un personaggio con costo 5 o inferiore gratis. Ottiene <Lesto>. Alla fine del tuo turno, esilialo. (Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
  es: {
    name: "Lanzador de tinta místico",
    text: [
      {
        title: "CONVOCATORIAS ESPECIALES",
        description:
          "{E}, 3 {I}: juega con un personaje con un coste de 5 o menos de forma gratuita. Ganan Rush. Al final de tu turno, destiérralos. (Pueden desafiar el turno en el que se juega).",
      },
    ],
  },
};
