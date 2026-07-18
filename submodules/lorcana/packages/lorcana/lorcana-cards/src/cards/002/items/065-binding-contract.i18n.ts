import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bindingContractI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Binding Contract",
    text: [
      {
        title: "FOR ALL ETERNITY",
        description: "{E}, {E} one of your characters — Exert chosen character.",
      },
    ],
  },
  de: {
    name: "Verbindlicher Vertrag",
    text: [
      {
        title: "In alle Ewigkeit",
        description: "{E}, {E} einen deiner Charaktere — Erschöpfe einen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Contrat irrévocable",
    text: [
      {
        title: "Pour toute l'éternité",
        description: "{E}, {E} l'un de vos personnages — Choisissez un personnage et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Binding Contract",
    text: [
      {
        title: "For All Eternity",
        description: "{E}, {E} one of your characters — Exert chosen character.",
      },
    ],
  },
  es: {
    name: "Contrato vinculante",
    text: [
      {
        title: "POR TODA LA ETERNIDAD",
        description: "{E}, {E} uno de tus personajes: ejerce el personaje elegido.",
      },
    ],
  },
};
