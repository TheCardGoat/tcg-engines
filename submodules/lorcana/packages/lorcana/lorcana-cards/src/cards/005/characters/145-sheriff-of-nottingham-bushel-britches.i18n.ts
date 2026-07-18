import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sheriffOfNottinghamBushelBritchesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sheriff of Nottingham",
    version: "Bushel Britches",
    text: [
      {
        title: "EVERY LITTLE BIT HELPS",
        description: "For each item you have in play, you pay 1 {I} less to play this character.",
      },
      {
        title: "Support",
      },
    ],
  },
  de: {
    name: "Sheriff von Nottingham",
    version: "Der alte Geldsack",
    text: [
      {
        title: "Schon das kleinste Bisschen hilft",
        description:
          "Für jeden Gegenstand den du im Spiel hast, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Shérif de Nottingham",
    version: "Immonde personnage",
    text: [
      {
        title: "Y a pas de p'tites pièces",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins pour chaque objet que vous avez en jeu.",
      },
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Sceriffo di Nottingham",
    version: "Vecchio Bracalone",
    text: [
      {
        title: "Tutto Fa, Anche Se È Poco",
        description:
          "Per ogni oggetto che hai in gioco, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
  es: {
    name: "Sheriff de Nottingham",
    version: "Calzones de bushel",
    text: [
      {
        title: "TODO AYUDA",
        description:
          "Por cada objeto que tengas en juego, pagas 1 {I} menos para interpretar a este personaje.",
      },
      {
        title: "Apoyo",
      },
    ],
  },
};
