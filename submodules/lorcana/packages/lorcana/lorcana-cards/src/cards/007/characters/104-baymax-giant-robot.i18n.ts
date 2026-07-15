import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const baymaxGiantRobotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Baymax",
    version: "Giant Robot",
    text: [
      {
        title: "Universal Shift 4",
        description: "(You may pay 4 {I} to play this on top of any one of your characters.)",
      },
      {
        title: "FUNCTIONALITY IMPROVED",
        description:
          "When you play this character, if you used Shift to play him, remove all damage from him.",
      },
    ],
  },
  de: {
    name: "Baymax",
    version: "Riesiger Roboter",
    text: [
      {
        title:
          "<Universal-Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf irgendeinen deiner Charaktere auszuspielen.)",
      },
      {
        title: "Funktionalität verbessert",
        description:
          "Wenn du diesen Charakter mithilfe von <Gestaltwandel> ausspielst, entferne jeglichen Schaden von ihm.",
      },
    ],
  },
  fr: {
    name: "Baymax",
    version: "Robot géant",
    text: [
      {
        title:
          "<Alter universel> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur n'importe lequel de vos personnages.)",
      },
      {
        title: "Fonctionnalité améliorée",
        description:
          "Si vous jouez ce personnage en utilisant sa capacité <Alter>, retirez tous les dommages présents sur lui.",
      },
    ],
  },
  it: {
    name: "Baymax",
    version: "Robot Gigante",
    text: [
      {
        title:
          "<Trasformazione Universale> 4 (Puoi pagare 4 {I} per giocare questa carta sopra a uno qualsiasi dei tuoi personaggi.)",
      },
      {
        title: "Funzionalità Potenziata",
        description:
          "Quando giochi questo personaggio, se hai usato <Trasformazione> per giocarlo, rimuovi tutti i danni da esso.",
      },
    ],
  },
};
