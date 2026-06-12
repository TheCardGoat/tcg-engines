import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const minnieMouseStorytellerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Minnie Mouse",
    version: "Storyteller",
    text: [
      {
        title: "GATHER AROUND",
        description: "Whenever you play a character, this character gets +1 {L} this turn.",
      },
      {
        title: "JUST ONE MORE",
        description:
          "Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Minnie Maus",
    version: "Geschichtenerzählerin",
    text: [
      {
        title: "VERSAMMELN",
        description:
          "Jedes Mal, wenn du einen Charakter ausspielst, erhält dieser Charakter in diesem Zug +1.",
      },
      {
        title: "NUR NOCH EINS",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, verliert ein gegnerischer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges so viel, wie dieser Charakter hat.",
      },
    ],
  },
  fr: {
    name: "Minnie",
    version: "Conteuse",
    text: [
      {
        title: "APPROCHEZ-VOUS",
        description:
          "Chaque fois que vous jouez un personnage, ce personnage-ci gagne +1 pour le reste de ce tour.",
      },
      {
        title: "JUSTE UNE DERNIÈRE!",
        description:
          "Chaque fois que ce personnage part à l'aventure, choisissez un personnage adverse qui perd autant de que le de ce personnage-ci jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Minni",
    version: "Narratrice",
    text: [
      {
        title: "AVVICINATEVI",
        description:
          "Ogni volta che giochi un personaggio, questo personaggio riceve +1 per questo turno.",
      },
      {
        title: "ANCORA UNA",
        description:
          "Ogni volta che questo personaggio va all'avventura, un personaggio avversario a tua scelta perde pari al di questo personaggio fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
