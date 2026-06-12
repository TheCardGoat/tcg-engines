import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gizmosuitI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gizmosuit",
    text: [
      {
        title: "CYBERNETIC ARMOR",
        description:
          "Banish this item — Chosen character gains Resist +2 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Krachbumm-Anzug",
    text: [
      {
        title: "CYBERNETISCHE",
        description:
          "RÜSTUNG Verbanne diesen Gegenstand — Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Robust +2. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Le costume de Robotik",
    text: [
      {
        title: "ARMURE",
        description:
          "CYBERNÉTIQUE Bannissez cet objet — Choisissez un personnage, il gagne Résistance +2 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Armatura di Robopap",
    text: [
      {
        title: "CORAZZA CIBERNETICA",
        description:
          "Esilia questo oggetto — Un personaggio a tua scelta ottiene Resistere +2 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
