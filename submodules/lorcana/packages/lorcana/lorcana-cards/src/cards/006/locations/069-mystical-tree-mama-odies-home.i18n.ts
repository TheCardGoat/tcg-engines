import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mysticalTreeMamaOdiesHomeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mystical Tree",
    version: "Mama Odie's Home",
    text: [
      {
        title: "NOT BAD",
        description:
          "At the start of your turn, you may move 1 damage counter from chosen character here to chosen opposing character.",
      },
      {
        title: "HARD-EARNED WISDOM",
        description:
          "At the start of your turn, if you have a character named Mama Odie here, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Mystischer Baum",
    version: "Mama Odies Zuhause",
    text: [
      {
        title: "NICHT SCHLECHT",
        description:
          "Zu Beginn deines Zuges darfst du 1 Schadensmarker von einem Charakter deiner Wahl an diesem Ort zu einem gegnerischen Charakter deiner Wahl verschieben.",
      },
      {
        title: "HART ERARBEITETES WISSEN",
        description:
          "Zu Beginn deines Zuges, wenn du mindestens einen Mama-Odie-Charakter an diesem Ort hast, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Arbre mystique",
    version: "Maison de Mama Odie",
    text: [
      {
        title: "PAS MAL",
        description:
          "Au début de votre tour, vous pouvez choisir un personnage sur ce lieu et déplacer 1 de ses dommages sur un personnage adverse de votre choix.",
      },
      {
        title: "SAGESSE DUREMENT ACQUISE",
        description:
          "Au début de votre tour, si vous avez un personnage Mama Odie sur ce lieu, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Albero Mistico",
    version: "Casa di Mamma Odie",
    text: [
      {
        title: "NON MALE",
        description:
          "All'inizio del tuo turno, puoi spostare 1 segnalino danno da un personaggio a tua scelta in questo luogo a un personaggio avversario a tua scelta.",
      },
      {
        title: "SAGGEZZA OTTENUTA CON FATICA",
        description:
          "All'inizio del tuo turno, se hai un personaggio chiamato Mamma Odie in questo luogo, ottieni 1 leggenda.",
      },
    ],
  },
};
