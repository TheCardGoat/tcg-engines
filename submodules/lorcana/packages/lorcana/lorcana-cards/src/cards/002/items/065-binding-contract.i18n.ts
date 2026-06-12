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
        title: "IN ALLE EWIGKEIT,",
        description: "einen deiner Charaktere — Erschöpfe einen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Contrat irrévocable",
    text: [
      {
        title: "POUR TOUTE",
        description:
          "L'ÉTERNITÉ, l'un de vos personnages — Choisissez un personnage et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Binding Contract",
    text: [
      {
        title: "FOR ALL ETERNITY,",
        description: "one of your characters — Exert chosen character.",
      },
    ],
  },
};
