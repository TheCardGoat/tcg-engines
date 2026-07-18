import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hueySavvyNephewI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Huey",
    version: "Savvy Nephew",
    text: [
      {
        title: "Support",
      },
      {
        title: "THREE NEPHEWS",
        description:
          "Whenever this character quests, if you have characters named Dewey and Louie in play, you may draw 3 cards.",
      },
    ],
  },
  de: {
    name: "Tick Duck",
    version: "Gerissener Neffe",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Die drei Neffen",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet und du einen Trick-Charakter und einen Track-Charakter im Spiel hast, darfst du 3 Karten ziehen.",
      },
    ],
  },
  fr: {
    name: "Riri",
    version: "Neveu astucieux",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Trois neveux",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez piocher 3 cartes si vous avez au moins un personnage Fifi et un personnage Loulou en jeu.",
      },
    ],
  },
  it: {
    name: "Qui",
    version: "Nipote Esperto",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Tre Nipoti",
        description:
          "Ogni volta che questo personaggio va all'avventura, se hai personaggi chiamati Quo e Qua in gioco, puoi pescare 3 carte.",
      },
    ],
  },
  es: {
    name: "Huey",
    version: "Sobrino inteligente",
    text: [
      {
        title: "Apoyo",
      },
      {
        title: "TRES SOBRINOS",
        description:
          "Siempre que este personaje realice una misión, si tienes personajes llamados Dewey y Louie en juego, puedes robar 3 cartas.",
      },
    ],
  },
};
