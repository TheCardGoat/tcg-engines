import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fergusMcduckScroogesFatherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fergus McDuck",
    version: "Scrooge's Father",
    text: [
      {
        title: "TOUGHEN UP",
        description:
          "When you play this character, chosen character of yours gains Ward until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Dietbert Duck",
    version: "Dagoberts Vater",
    text: [
      {
        title: "ABHÄRTEN",
        description:
          "Wenn du diesen Charakter ausspielst, wähle einen deiner Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges Behütet. (Gegnerische Mitspielende können den Charakter nicht auswählen, außer um ihn herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "Fergus Mac Picsou",
    version: "Père de Balthazar",
    text: [
      {
        title: "ENDURCIR",
        description:
          "Lorsque vous jouez ce personnage, choisissez l'un de vos personnages qui gagne Hors d'atteinte jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Fergus de' Paperoni",
    version: "Padre di Paperone",
    text: [
      {
        title: "INDURIRSI",
        description:
          "Quando giochi questo personaggio, un tuo personaggio a tua scelta ottiene Protetto fino all'inizio del tuo prossimo turno. (Gli avversari non possono sceglierlo se non per sfidarlo.)",
      },
    ],
  },
};
