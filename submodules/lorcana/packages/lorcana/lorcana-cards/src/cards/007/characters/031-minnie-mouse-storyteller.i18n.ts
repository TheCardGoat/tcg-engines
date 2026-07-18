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
        title: "Versammeln",
        description:
          "Jedes Mal, wenn du einen Charakter ausspielst, erhält dieser Charakter in diesem Zug +1 {L}.",
      },
      {
        title: "Nur noch eins",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, verliert ein gegnerischer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges so viel {S}, wie dieser Charakter {L} hat.",
      },
    ],
  },
  fr: {
    name: "Minnie",
    version: "Conteuse",
    text: [
      {
        title: "Approchez-vous",
        description:
          "Chaque fois que vous jouez un personnage, ce personnage-ci gagne +1 {L} pour le reste de ce tour.",
      },
      {
        title: "Juste une dernière!",
        description:
          "Chaque fois que ce personnage part à l'aventure, choisissez un personnage adverse qui perd autant de {S} que le {L} de ce personnage-ci jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Minni",
    version: "Narratrice",
    text: [
      {
        title: "Avvicinatevi",
        description:
          "Ogni volta che giochi un personaggio, questo personaggio riceve +1 {L} per questo turno.",
      },
      {
        title: "Ancora Una",
        description:
          "Ogni volta che questo personaggio va all'avventura, un personaggio avversario a tua scelta perde {S} pari al {L} di questo personaggio fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Minnie ratón",
    version: "Cuentista",
    text: [
      {
        title: "REUNIRSE ALREDEDOR",
        description:
          "Siempre que juegas con un personaje, este personaje obtiene +1 {L} este turno.",
      },
      {
        title: "SOLO UNO MAS",
        description:
          "Cada vez que este personaje realiza una misión, el personaje contrario elegido pierde {S} igual al {L} de este personaje hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
