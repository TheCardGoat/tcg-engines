import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const moanaBornLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Moana",
    version: "Born Leader",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "WELCOME TO MY BOAT",
        description:
          "Whenever this character quests while at a location, ready all other characters here. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Vaiana",
    version: "Geborene Anführerin",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Vaiana-Charaktere auszuspielen.)",
      },
      {
        title: "Willkommen auf meinem Boot",
        description:
          "Jedes Mal, wenn dieser Charakter an einem Ort erkundet, mache alle deine anderen Charaktere an diesem Ort bereit. Sie können in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Vaiana",
    version: "Cheffe née",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Vaiana.)",
      },
      {
        title: "Bienvenue sur mon bateau",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure depuis un lieu, redressez tous les autres personnages qui s'y trouvent. Ils ne peuvent pas être envoyés à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Vaiana",
    version: "Leader Nata",
    text: [
      {
        title:
          "<Trasformazione> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Vaiana.)",
      },
      {
        title: "Benvenuto sulla Mia Barca",
        description:
          "Ogni volta che questo personaggio va all'avventura mentre si trova in un luogo, prepara tutti gli altri personaggi in quel luogo. Non possono andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
