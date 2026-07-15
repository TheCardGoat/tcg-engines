import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const transformedChefCastleStoveI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Transformed Chef",
    version: "Castle Stove",
    text: [
      {
        title: "A CULINARY MASTERPIECE",
        description: "When you play this character, remove up to 2 damage from chosen character.",
      },
    ],
  },
  de: {
    name: "Verwandelter Küchenchef",
    version: "Schloss-Ofen",
    text: [
      {
        title: "Ein kulinarisches Meisterwerk",
        description:
          "Wenn du diesen Charakter ausspielst, entferne bis zu 2 Schaden von einem Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Chef Transformé",
    version: "Poêle du château",
    text: [
      {
        title: "Mijoter des petits plats",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage et retirez-lui jusqu'à 2 jetons Dommage.",
      },
    ],
  },
  it: {
    name: "Chef Trasformato",
    version: "Fuochista del Castello",
    text: [
      {
        title: "Un Capolavoro di Culinaria",
        description:
          "Quando giochi questo personaggio, rimuovi fino a 2 danni da un personaggio a tua scelta.",
      },
    ],
  },
};
