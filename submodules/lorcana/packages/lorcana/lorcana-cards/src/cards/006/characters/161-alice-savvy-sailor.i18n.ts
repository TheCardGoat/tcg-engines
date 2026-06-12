import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aliceSavvySailorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Alice",
    version: "Savvy Sailor",
    text: [
      {
        title: "Ward",
      },
      {
        title: "AHOY!",
        description:
          "Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Alice",
    version: "Gerissene Seglerin",
    text: [
      {
        title: "Behütet",
      },
      {
        title: "AHOI!",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, wähle einen deiner anderen Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges +1 und Behütet.",
      },
    ],
  },
  fr: {
    name: "Alice",
    version: "Marin avisée",
    text: [
      {
        title: "Hors d'atteinte",
      },
      {
        title: "NAVIRE EN VUE!",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un autre de vos personnages qui gagne +1 et Hors d'atteinte jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Alice",
    version: "Esperta Marinaia",
    text: [
      {
        title: "Protetto",
      },
      {
        title: "AHOY!",
        description:
          "Ogni volta che questo personaggio va all'avventura, un tuo altro personaggio a tua scelta riceve +1 e ottiene Protetto fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
