import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const castleWyvernAboveTheCloudsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Castle Wyvern",
    version: "Above the Clouds",
    text: [
      {
        title: "PROTECT THIS CASTLE",
        description:
          "Characters gain Challenger +1 and Resist +1 while here. (They get +1 {S} while challenging. Damage dealt to them is reduced by 1.)",
      },
    ],
  },
  de: {
    name: "Burg Wyvern",
    version: "Über den Wolken",
    text: [
      {
        title: "Die Burg verteidigen",
        description:
          "Deine Charaktere an diesem Ort erhalten <Herausfordern> +1 und <Robust> +1. (Während die Charaktere herausfordern, erhalten sie +1 {S}. Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Château de Wyvern",
    version: "Au-dessus des nuages",
    text: [
      {
        title: "Protégez le château",
        description:
          "Les personnages sur ce lieu gagnent <Offensif> +1 et <Résistance> +1. (Lorsqu'ils défient, ces personnages gagnent +1 {S}. Les dommages qui leur sont infligés sont réduits de 1.)",
      },
    ],
  },
  it: {
    name: "Castello Wyvern",
    version: "Sopra le Nuvole",
    text: [
      {
        title: "Proteggere Questo Castello",
        description:
          "I personaggi ottengono <Sfidante> +1 e <Resistere> +1 mentre si trovano in questo luogo. (Ricevono +1 {S} mentre stanno sfidando. Il danno che gli viene inflitto è ridotto di 1.)",
      },
    ],
  },
};
