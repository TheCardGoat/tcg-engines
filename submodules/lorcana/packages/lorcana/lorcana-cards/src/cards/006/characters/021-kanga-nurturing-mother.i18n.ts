import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kangaNurturingMotherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kanga",
    version: "Nurturing Mother",
    text: [
      {
        title: "SAFE AND SOUND",
        description:
          "Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Kanga",
    version: "Pflegende Mutter",
    text: [
      {
        title: "GESUND UND MUNTER",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, wähle einen deiner anderen Charaktere. Jener kann bis zu Beginn deines nächsten Zuges nicht herausgefordert werden.",
      },
    ],
  },
  fr: {
    name: "Maman Gourou",
    version: "Mère nourricière",
    text: [
      {
        title: "SAIN ET SAUF",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un autre de vos personnages qui ne pourra pas être défié jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Kanga",
    version: "Madre Amorevole",
    text: [
      {
        title: "AL SICURO",
        description:
          "Ogni volta che questo personaggio va all'avventura, un tuo altro personaggio a tua scelta non può essere sfidato fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
