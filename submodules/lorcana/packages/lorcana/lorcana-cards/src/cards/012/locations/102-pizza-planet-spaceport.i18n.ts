import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pizzaPlanetSpaceportI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pizza Planet",
    version: "Spaceport",
    text: [
      {
        title: "YOU ARE CLEARED TO ENTER",
        description: "Your Toy characters can move here for free.",
      },
      {
        title: "HEAVILY GUARDED",
        description: "Whenever a character is challenged while here, each opponent loses 1 lore.",
      },
    ],
  },
  de: {
    name: "Pizza Planet",
    version: "Weltraumhafen",
    text: [
      {
        title: "Zugangsberechtigung erteilt",
        description: "Deine Spielzeuge können sich kostenlos zu diesem Ort bewegen.",
      },
      {
        title: "Schwer bewacht",
        description:
          "Jedes Mal, wenn einer deiner Charaktere an diesem Ort herausgefordert wird, verlieren alle gegnerischen Mitspielenden je 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Pizza Planet",
    version: "Base de lancement",
    text: [
      {
        title: "Autorisation d'entrée",
        description: "Vous pouvez déplacer gratuitement vos personnages Jouet sur ce lieu.",
      },
      {
        title: "Étroitement surveillé",
        description:
          "Chaque fois qu'un personnage sur ce lieu est défié, chaque adversaire perd 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Pizza Planet",
    version: "Porto Spaziale",
    text: [
      {
        title: "Ingresso Autorizzato",
        description: "I tuoi personaggi Giocattolo possono spostarsi in questo luogo gratis.",
      },
      {
        title: "Ingresso Sorvegliato",
        description:
          "Ogni volta che un personaggio viene sfidato mentre si trova in questo luogo, ogni avversario perde 1 leggenda.",
      },
    ],
  },
};
