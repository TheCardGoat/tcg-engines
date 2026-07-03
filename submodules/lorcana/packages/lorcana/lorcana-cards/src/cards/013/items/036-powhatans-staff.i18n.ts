import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const powhatansStaffI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Powhatan's Staff",
    text: [
      {
        title: "STEP FORWARD",
        description:
          "{E}, 1 {I} — The next character you play this turn enters play exerted and gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      },
    ],
  },
  de: {
    name: "Powhatans Stab",
    text: [
      {
        title: "Tritt vor",
        description:
          "{E}, 1 {I} — Der nächste Charakter, den du in diesem Zug ausspielst, kommt erschöpft ins Spiel und erhält <Beschützen>. (Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Bâton de Powhatan",
    text: [
      {
        title: "Faire un pas en avant",
        description:
          "{E}, 1 {I} — Le prochain personnage que vous jouez ce tour-ci entre en jeu épuisé et gagne <Rempart> jusqu'au début de votre prochain tour. (Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Bastone di Powhatan",
    text: [
      {
        title: "Farsi Avanti",
        description:
          "{E}, 1 {I} — Il prossimo personaggio che giochi per questo turno entra in gioco impegnato e ottiene <Guardiano> fino all'inizio del tuo prossimo turno. (Un personaggio avversario che sfida uno dei tuoi personaggi deve sceglierne uno con Guardiano, se possibile.)",
      },
    ],
  },
};
