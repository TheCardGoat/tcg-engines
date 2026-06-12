import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckRubyChampionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Ruby Champion",
    text: [
      {
        title: "HIGH ENERGY",
        description: "Your other Ruby characters get +1 {S}.",
      },
      {
        title: "POWERFUL REWARD",
        description: "Your other Ruby characters with 7 {S} or more get +1 {L}.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Rubin-Champion",
    text: [
      {
        title: "VIEL ENERGIE",
        description: "Deine anderen Rubin-Charaktere erhalten +1.",
      },
      {
        title: "MÄCHTIGE BELOHNUNG",
        description: "Deine anderen Rubin-Charaktere mit 7 oder mehr erhalten +1.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Champion Rubis",
    text: [
      {
        title: "PLEIN D'ÉNERGIE",
        description: "Vos autres personnages Rubis gagnent +1.",
      },
      {
        title: "PUISSANTE RÉCOMPENSE",
        description: "Vos autres personnages Rubis ayant 7 ou plus gagnent +1.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Campione di Rubino",
    text: [
      {
        title: "SUPER ENERGIA I",
        description: "tuoi altri personaggi Rubino ricevono +1.",
      },
      {
        title: "RICOMPENSA POTENTE I",
        description: "tuoi altri personaggi Rubino con 7 o superiore ricevono +1.",
      },
    ],
  },
};
