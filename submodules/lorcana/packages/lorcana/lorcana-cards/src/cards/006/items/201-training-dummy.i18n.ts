import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trainingDummyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Training Dummy",
    text: [
      {
        title: "HANDLE WITH CARE",
        description:
          "{E}, 2 {I} — Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      },
    ],
  },
  de: {
    name: "Übungspuppe",
    text: [
      {
        title: "Handle mit Vorsicht",
        description:
          "{E}, 2 {I} — Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges <Beschützen>. (Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Mannequin d'entraînement",
    text: [
      {
        title: "Ne secoue pas trop la belle",
        description:
          "{E}, 2 {I} — Choisissez un personnage qui gagne <Rempart> jusqu'au début de votre prochain tour. (Lorsqu'il vous défie, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Manichino da Allenamento",
    text: [
      {
        title: "Trattare con Cura",
        description:
          "{E}, 2 {I} — Un personaggio a tua scelta ottiene <Guardiano> fino all'inizio del tuo prossimo turno. (Un personaggio avversario che sfida uno dei tuoi personaggi deve sceglierne uno con Guardiano, se possibile.)",
      },
    ],
  },
};
