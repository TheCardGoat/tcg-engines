import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const marieFavoredKittenI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Marie",
    version: "Favored Kitten",
    text: [
      {
        title: "I'LL SHOW YOU",
        description:
          "Whenever this character quests, you may give chosen character -2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Marie",
    version: "Bevorzugtes Kätzchen",
    text: [
      {
        title: "Ich werd's dir zeigen",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einem Charakter deiner Wahl in diesem Zug -2 {S} geben.",
      },
    ],
  },
  fr: {
    name: "Marie",
    version: "Chatonne privilégiée",
    text: [
      {
        title: "Je vais te faire voir",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un personnage qui subit -2 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Minou",
    version: "Gattina Prediletta",
    text: [
      {
        title: "Ti Faccio Vedere Io",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi dare -2 {S} a un personaggio a tua scelta per questo turno.",
      },
    ],
  },
  es: {
    name: "María",
    version: "Gatito favorito",
    text: [
      {
        title: "TE MOSTRARÉ",
        description:
          "Siempre que este personaje realice una misión, puedes darle al personaje elegido -2 {S} este turno.",
      },
    ],
  },
};
