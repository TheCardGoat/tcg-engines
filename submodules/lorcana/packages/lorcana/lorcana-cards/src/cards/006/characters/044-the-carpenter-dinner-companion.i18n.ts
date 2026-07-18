import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theCarpenterDinnerCompanionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Carpenter",
    version: "Dinner Companion",
    text: [
      {
        title: "I'LL GET YOU!",
        description: "When this character is banished, you may exert chosen character.",
      },
    ],
  },
  de: {
    name: "Der Zimmermann",
    version: "Tischnachbar",
    text: [
      {
        title: "Ich krieg dich!",
        description:
          "Wenn dieser Charakter verbannt wird, darfst du einen Charakter deiner Wahl erschöpfen.",
      },
    ],
  },
  fr: {
    name: "Le Charpentier",
    version: "Compagnon de table",
    text: [
      {
        title: "Je t'aurai!",
        description:
          "Lorsque ce personnage est banni, vous pouvez choisir un personnage et l'épuiser.",
      },
    ],
  },
  it: {
    name: "Il Carpentiere",
    version: "Commensale",
    text: [
      {
        title: "Ti Prenderò",
        description:
          "Quando questo personaggio viene esiliato, puoi impegnare un personaggio a tua scelta.",
      },
    ],
  },
  es: {
    name: "El carpintero",
    version: "Compañero de cena",
    text: [
      {
        title: "¡TE ATRAERÉ!",
        description: "Cuando este personaje es desterrado, puedes ejercer el personaje elegido.",
      },
    ],
  },
};
