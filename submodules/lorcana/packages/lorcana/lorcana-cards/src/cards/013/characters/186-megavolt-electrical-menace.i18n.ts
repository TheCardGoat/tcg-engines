import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const megavoltElectricalMenaceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Megavolt",
    version: "Electrical Menace",
    text: [
      {
        title: "Force Field",
        description: "While you have no cards in your hand, this character gains <Resist> +2.",
      },
    ],
  },
  de: {
    name: "Megavolt",
    version: "Elektrische Bedrohung",
    text: [
      {
        title: "Kraftfeld",
        description:
          "Solange du keine Karten auf der Hand hast, erhält dieser Charakter <Robust> +2. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Mégavolt",
    version: "Menace électrique",
    text: [
      {
        title: "Champ de force",
        description:
          "Tant que vous n'avez aucune carte en main, ce personnage gagne <Résistance> +2.",
      },
    ],
  },
  it: {
    name: "Megavolt",
    version: "Minaccia Elettrica",
    text: [
      {
        title: "Campo di Forza",
        description: "Mentre non hai carte in mano, questo personaggio ottiene <Resistere> +2.",
      },
    ],
  },
  es: {
    name: "Megavoltio",
    version: "Amenaza eléctrica",
    text: [
      {
        title: "Campo de fuerza",
        description: "Mientras no tengas cartas en tu mano, este personaje gana <Resistir> +2.",
      },
    ],
  },
};
