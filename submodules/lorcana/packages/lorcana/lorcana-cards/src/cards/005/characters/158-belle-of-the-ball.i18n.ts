import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const belleOfTheBallI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Belle",
    version: "Of the Ball",
    text: [
      {
        title: "Ward",
      },
      {
        title: "USHERED INTO THE PARTY",
        description:
          "When you play this character, your other characters gain Ward until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Belle",
    version: "Vom Ball",
    text: [
      {
        title: "Behütet",
      },
      {
        title: "IN DIE FEIER GELEITET",
        description:
          "Wenn du diesen Charakter ausspielst, erhalten deine anderen Charaktere bis zu Beginn deines nächsten Zuges Behütet.",
      },
    ],
  },
  fr: {
    name: "Belle",
    version: "Du bal",
    text: [
      {
        title: "Hors d'atteinte",
      },
      {
        title: "INVITÉE",
        description:
          "À LA FÊTE Lorsque vous jouez ce personnage, vos autres personnages gagnent Hors d'atteinte jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Belle",
    version: "Reginetta del Ballo",
    text: [
      {
        title: "Protetto",
      },
      {
        title: "ACCOMPAGNATA ALLA FESTA",
        description:
          "Quando giochi questo personaggio, i tuoi altri personaggi ottengono Protetto fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
