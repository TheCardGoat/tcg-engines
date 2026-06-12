import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const madamMimElephantI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Madam Mim",
    version: "Elephant",
    text: [
      {
        title: "A LITTLE GAME",
        description:
          "When you play this character, banish her or return another chosen character of yours to your hand.",
      },
      {
        title: "SNEAKY MOVE",
        description:
          "At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Madame Mim",
    version: "Elefant",
    text: [
      {
        title: "EIN KLEINES SPIELCHEN",
        description:
          "Wenn du diesen Charakter ausspielst, musst du ihn verbannen oder einen deiner anderen Charaktere wählen und zurück auf deine Hand nehmen.",
      },
      {
        title: "RAFFINIERTER SCHACHZUG",
        description:
          "Zu Beginn deines Zuges, darfst du bis zu 2 Schadensmarker von diesem Charakter zu einem gegnerischen Charakter deiner Wahl verschieben.",
      },
    ],
  },
  fr: {
    name: "Madame Mime",
    version: "En éléphante",
    text: [
      {
        title: "UN PETIT JEU",
        description:
          "Lorsque vous jouez ce personnage, bannissez-le ou renvoyez l'un de vos autres personnages en jeu dans votre main.",
      },
      {
        title: "COUP EN DOUCE",
        description:
          "Au début de votre tour, vous pouvez déplacer jusqu'à 2 dommages de ce personnage vers un personnage adverse.",
      },
    ],
  },
  it: {
    name: "Maga Magò",
    version: "Elefante",
    text: [
      {
        title: "UN GIOCHETTO",
        description:
          "Quando giochi questo personaggio, esilialo o riprendi in mano un tuo altro personaggio a tua scelta.",
      },
      {
        title: "MOSSA SUBDOLA",
        description:
          "All'inizio del tuo turno, puoi spostare fino a 2 segnalini danno da questo personaggio a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
