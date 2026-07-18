import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pachaPanickedCustomerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pacha",
    version: "Panicked Customer",
    text: [
      {
        title: "<Reckless>",
      },
      {
        title: "Adrenaline Surge",
        description: "During your turn, this character gets +4 {S}.",
      },
    ],
  },
  de: {
    name: "Patcha",
    version: "Panischer Kunde",
    text: [
      {
        title: "<Impulsiv>",
      },
      {
        title: "Adrenalinschub",
        description: "In deinem Zug erhält dieser Charakter +4 {S}.",
      },
    ],
  },
  fr: {
    name: "Pacha",
    version: "Client paniqué",
    text: [
      {
        title: "<Combattant>",
      },
      {
        title: "Montée d'adrénaline",
        description: "Durant votre tour, ce personnage gagne +4 {S}.",
      },
    ],
  },
  it: {
    name: "Pacha",
    version: "Cliente nel Panico",
    text: [
      {
        title: "<Attaccabrighe>",
      },
      {
        title: "Scarica di Adrenalina",
        description: "Durante il tuo turno, questo personaggio riceve +4 {S}.",
      },
    ],
  },
  es: {
    name: "Pachá",
    version: "Cliente en pánico",
    text: [
      {
        title: "<Imprudente>",
      },
      {
        title: "Oleada de adrenalina",
        description: "Durante tu turno, este personaje obtiene +4 {S}.",
      },
    ],
  },
};
