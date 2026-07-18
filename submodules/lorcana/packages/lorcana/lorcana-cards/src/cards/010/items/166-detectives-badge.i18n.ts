import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const detectivesBadgeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Detective's Badge",
    text: [
      {
        title: "PROTECT AND SERVE",
        description:
          "{E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Dienstmarke",
    text: [
      {
        title: "Schützen und dienen",
        description:
          "{E}, 1 {I} — Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges <Robust> +1 und die Klassifizierung Detektiv. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Badge de police",
    text: [
      {
        title: "Protéger et servir",
        description:
          "{E}, 1 {I} — Choisissez un personnage qui gagne <Résistance> +1 et la classification Détective jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Distintivo da Detective",
    text: [
      {
        title: "Proteggere e Servire",
        description:
          "{E}, 1 {I} — Un personaggio a tua scelta ottiene <Resistere> +1 e la classificazione Detective fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Insignia de detective",
    text: [
      {
        title: "PROTEGER Y SERVIR",
        description:
          "{E}, 1 {I}: el personaje elegido obtiene Resistencia +1 y la clasificación de Detective hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
