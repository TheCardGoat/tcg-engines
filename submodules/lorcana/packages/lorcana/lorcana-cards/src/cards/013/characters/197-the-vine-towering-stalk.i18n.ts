import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theVineToweringStalkI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Vine",
    version: "Towering Stalk",
    text: [
      {
        title: "Floodborn Shift 7 {I}",
        description: "(You may pay 7 {I} to play this on top of one of your Floodborn characters.)",
      },
      {
        title: "SATURATE",
        description: "Your other exerted Floodborn characters gain Bodyguard.",
      },
      {
        title: "HOSTILE SWARM",
        description:
          "During an opponent's turn, whenever one of your Floodborn characters is banished, deal 1 damage to each opposing character.",
      },
    ],
  },
  de: {
    name: "Die Ranke",
    version: "Hochgewachsener Stängel",
    text: [
      {
        title:
          "<Flutgestaltwandel> 7 {I} (Du kannst 7 {I} zahlen, um diesen Charakter auf einen deiner Flutgestalt-Charaktere auszuspielen.)",
      },
      {
        title: "Sättigen",
        description: "Deine anderen erschöpften Flutgestalt-Charaktere erhalten <Beschützen>.",
      },
      {
        title: "Feindlicher Schwarm",
        description:
          "Jedes Mal, wenn einer deiner Flutgestalt-Charaktere im Zug einer gegnerischen Person verbannt wird, füge jedem gegnerischen Charakter 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "La Plante",
    version: "Tige imposante",
    text: [
      {
        title:
          "<Alter de Floodborn> 7 {I} (Vous pouvez payer 7 {I} pour jouer ce personnage sur l'un de vos personnages Floodborn.)",
      },
      {
        title: "Saturer",
        description: "Vos autres personnages Floodborn épuisés gagnent <Rempart>.",
      },
      {
        title: "Essaim hostile",
        description:
          "Durant le tour de vos adversaires, chaque fois que l'un de vos personnages Floodborn est banni, infligez 1 dommage à chaque personnage adverse.",
      },
    ],
  },
  it: {
    name: "Il Viticcio",
    version: "Fusto Torreggiante",
    text: [
      {
        title:
          "<Trasformazione Imbevuto> 7 {I} (Puoi pagare 7 {I} per giocare questa carta sopra a uno dei tuoi personaggi Imbevuto.)",
      },
      {
        title: "Saturare",
        description: "I tuoi altri personaggi Imbevuto impegnati ottengono <Guardiano>.",
      },
      {
        title: "Sciame Ostile",
        description:
          "Durante il turno di un avversario, ogni volta che uno dei tuoi personaggi Imbevuto viene esiliato, infliggi 1 danno a ogni personaggio avversario.",
      },
    ],
  },
  es: {
    name: "La vid",
    version: "Tallo imponente",
    text: [
      {
        title: "Cambio nacido en las inundaciones 7 {I}",
        description:
          "(Puedes pagar 7 {I} para jugar esto encima de uno de tus personajes de Floodborn).",
      },
      {
        title: "SATURAR",
        description: "Tus otros personajes Floodborn ejercidos ganan Guardaespaldas.",
      },
      {
        title: "ENJAMBRE HOSTIL",
        description:
          "Durante el turno de un oponente, cada vez que uno de tus personajes Floodborn sea desterrado, inflige 1 daño a cada personaje contrario.",
      },
    ],
  },
};
