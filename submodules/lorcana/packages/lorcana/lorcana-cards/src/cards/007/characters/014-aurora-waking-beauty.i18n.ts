import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const auroraWakingBeautyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aurora",
    version: "Waking Beauty",
    text: [
      {
        title: "Singer 5",
      },
      {
        title: "SWEET DREAMS",
        description:
          "Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Aurora",
    version: "Erwachte Schönheit",
    text: [
      {
        title: "<Singen> 5 (Die Kosten dieses Charakters gelten als 5 für das Singen von Liedern.)",
      },
      {
        title: "Süsse Träume",
        description:
          "Jedes Mal, wenn du 1 oder mehr Schaden von einem Charakter entfernst, mache diesen Charakter bereit. Er kann in diesem Zug nicht mehr erkunden oder herausfordern.",
      },
    ],
  },
  fr: {
    name: "Aurore",
    version: "La belle s'éveillant",
    text: [
      {
        title:
          "<Mélomane> 5 (Ce personnage est considéré comme ayant un coût de 5 pour chanter des chansons.)",
      },
      {
        title: "Beaux rêves",
        description:
          "Chaque fois que vous retirez au moins 1 dommage d'un personnage, redressez ce personnage-ci. Il ne peut ni partir à l'aventure ni défier pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Aurora",
    version: "Bellezza Risvegliata",
    text: [
      {
        title: "<Melodioso> 5",
      },
      {
        title: "Sogni d'Oro",
        description:
          "Ogni volta che rimuovi 1 o più danni da un personaggio, prepara questo personaggio. Non può andare all'avventura o sfidare per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "Aurora",
    version: "Belleza despierta",
    text: [
      {
        title: "Cantante 5",
      },
      {
        title: "DULCES SUEÑOS",
        description:
          "Siempre que elimines 1 o más daños de un personaje, prepara este personaje. No puede realizar misiones ni desafíos durante el resto de este turno.",
      },
    ],
  },
};
