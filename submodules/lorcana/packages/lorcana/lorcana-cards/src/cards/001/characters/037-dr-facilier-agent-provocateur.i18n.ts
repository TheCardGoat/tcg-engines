import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const drFacilierAgentProvocateurI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dr. Facilier",
    version: "Agent Provocateur",
    text: [
      {
        title: "Shift 5",
        description:
          "(You may pay 5 {I} to play this on top of one of your characters named Dr. Facilier.)",
      },
      {
        title: "INTO THE SHADOWS",
        description:
          "Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
      },
    ],
  },
  de: {
    name: "Dr. Facilier",
    version: "Agent Provocateur",
    text: "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Dr.-Facilier-Charaktere auszuspielen.)\\Im Schattenreich\\ Jedes Mal, wenn einer deiner anderen Charaktere durch eine Herausforderung verbannt wird, darfst du jene Karte zurück auf deine Hand nehmen.",
  },
  fr: {
    name: "DR. FACILIER",
    version: "Agent provocateur",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Dr. Facilier.)",
      },
      {
        title: "VERS LES OMBRES",
        description:
          'Vos autres personnages gagnent: "Lorsque ce personnage est banni via un défi, vous pouvez le reprendre en main."',
      },
    ],
  },
  it: {
    name: "Dr. Facilier",
    version: "Agent Provocateur",
    text: [
      {
        title:
          "<Shift> 5 (You may pay 5 {I} to play this on top of one of your characters named Dr. Facilier.)",
      },
      {
        title: "Into the Shadows",
        description:
          "Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
      },
    ],
  },
  es: {
    name: "Dr. Facilier",
    version: "Agente provocador",
    text: [
      {
        title: "Shift 5",
        description:
          "(Puedes pagar 5 {I} para jugar esto encima de uno de tus personajes llamado Dr. Facilier).",
      },
      {
        title: "EN LAS SOMBRAS",
        description:
          "Siempre que uno de tus otros personajes sea desterrado en un desafío, puedes devolver esa carta a tu mano.",
      },
    ],
  },
};
