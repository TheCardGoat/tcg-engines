import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pocahontasPeacekeeperIconicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pocahontas",
    version: "Peacekeeper",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "CALMING WORDS",
        description:
          "When you play this character, if you used Shift to play her and none of your characters challenged this turn, characters can't challenge until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Pocahontas",
    version: "Friedenshüterin",
    text: [
      {
        title: "Gestaltwandel 3",
      },
      {
        title: "BERUHIGENDE WORTE",
        description:
          "Wenn du diesen Charakter mithilfe von Gestaltwandel ausspielst, falls in diesem Zug noch keiner deiner Charaktere herausgefordert hat, können Charaktere bis zu Beginn deines nächsten Zuges nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "Pocahontas",
    version: "Gardienne de la paix",
    text: [
      {
        title: "Alter 3",
      },
      {
        title:
          "Lorsque vous jouez ce personnage via sa capacité Alter, si aucun de vos personnages n'a défié ce tour-ci, les personnages ne peuvent pas défier jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Pocahontas",
    version: "Pacificatrice",
    text: [
      {
        title: "Trasformazione 3",
      },
      {
        title: "VOCE RASSICURANTE",
        description:
          "Quando giochi questo personaggio, se hai usato Trasformazione per giocarlo e nessuno dei tuoi personaggi ha sfidato in questo turno, i personaggi non possono sfidare fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
