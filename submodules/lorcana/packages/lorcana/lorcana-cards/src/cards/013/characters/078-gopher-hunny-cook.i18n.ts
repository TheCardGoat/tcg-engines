import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gopherHunnyCookI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gopher",
    version: "Hunny Cook",
    text: [
      {
        title: "Down the Hole",
        description: "This character may enter play exerted.",
      },
      {
        title: "Fortifying Meal",
        description:
          "During an opponent's turn, while this character is exerted, your other Hunny characters gain <Resist> +1.",
      },
    ],
  },
  de: {
    name: "Gopher",
    version: "Honig-Koch",
    text: [
      {
        title: "Aus dem Erdloch",
        description: "Du darfst diesen Charakter erschöpft ausspielen.",
      },
      {
        title: "Stärkende Mahlzeit",
        description:
          "Solange dieser Charakter im Zug einer gegnerischen Person erschöpft ist, erhalten deine anderen Honig-Charaktere <Robust> +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Grignotin",
    version: "Cuisinier mellifique",
    text: [
      {
        title: "Au fond du trou",
        description: "Ce personnage peut entrer en jeu épuisé.",
      },
      {
        title: "Repas fortifiant",
        description:
          "Durant le tour de vos adversaires, si ce personnage est épuisé, vos autres personnages Miel gagnent <Résistance> +1.",
      },
    ],
  },
  it: {
    name: "Castor",
    version: "Cuoco del Miele",
    text: [
      {
        title: "Giù per il Buco",
        description: "Questo personaggio può entrare in gioco impegnato.",
      },
      {
        title: "Pasto Fortificante",
        description:
          "Durante il turno di un avversario, mentre questo personaggio è impegnato, i tuoi altri personaggi Miele ottengono <Resistere> +1.",
      },
    ],
  },
  es: {
    name: "Ardilla de tierra",
    version: "Cocinero cariñoso",
    text: [
      {
        title: "Por el agujero",
        description: "Este personaje puede entrar en juego agotado.",
      },
      {
        title: "Comida fortificante",
        description:
          "Durante el turno de un oponente, mientras este personaje está ejercido, tus otros personajes Hunny obtienen <Resistencia> +1.",
      },
    ],
  },
};
