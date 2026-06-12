import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const duckburgFunsosFunzoneI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Duckburg",
    version: "Funso’s Funzone",
    text: [
      {
        title: "WHERE FUN IS IN THE ZONE",
        description:
          "Whenever a character quests while here, you pay 2 less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Entenhausen",
    version: "Fonsos Funpark",
    text: [
      {
        title: "FÜR SPASS, WIE ICH IHN MAG",
        description:
          "Jedes Mal, wenn einer deiner Charaktere an diesem Ort erkundet, zahlst du 2 weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Canardville",
    version: "Au pays des jeux de Funso",
    text: [
      {
        title: "FUNSO FAIT DES HEUREUX",
        description:
          "Chaque fois qu'un personnage sur ce lieu est envoyé à l'aventure, le prochain personnage que vous jouez ce tour-ci vous coûte 2 de moins.",
      },
    ],
  },
  it: {
    name: "Paperopoli",
    version: "Casa dello Spasso di Spassi",
    text: [
      {
        title: "LA CASA DELLO SPASSO",
        description:
          "Ogni volta che un personaggio va all'avventura mentre si trova in questo luogo, paga 2 in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
