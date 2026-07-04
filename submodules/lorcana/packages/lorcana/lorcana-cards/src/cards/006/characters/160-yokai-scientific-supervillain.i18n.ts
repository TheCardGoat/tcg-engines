import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const yokaiScientificSupervillainI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Yokai",
    version: "Scientific Supervillain",
    text: [
      {
        title: "Shift 6",
      },
      {
        title: "NEUROTRANSMITTER",
        description: "You may play items named Microbots for free.",
      },
      {
        title: "TECHNICAL GAIN",
        description:
          "Whenever this character quests, draw a card for each opposing character with {S}.",
      },
    ],
  },
  de: {
    name: "Yokai",
    version: "Wissenschaftlicher Superschurke",
    text: [
      {
        title:
          "<Gestaltwandel> 6 (Du kannst 6 {I} zahlen, um diesen Charakter auf einen deiner Yokai-Charaktere auszuspielen.)",
      },
      {
        title: "Neurotransmitter",
        description: "Du darfst Microbots-Gegenstände kostenlos ausspielen.",
      },
      {
        title: "Technischer Fortschritt",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, ziehe 1 Karte für jeden gegnerischen Charakter mit 0 {S}.",
      },
    ],
  },
  fr: {
    name: "Yokai",
    version: "Super-méchant scientifique",
    text: [
      {
        title:
          "<Alter> 6 (Vous pouvez payer 6 {I} pour jouer ce personnage sur l'un de vos personnages Yokai.)",
      },
      {
        title: "Neurotransmetteur",
        description: "Vous pouvez jouer des objets Microrobots gratuitement.",
      },
      {
        title: "Progrès technique",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, piochez une carte pour chaque personnage adverse avec une {S} de 0.",
      },
    ],
  },
  it: {
    name: "Yokai",
    version: "Supercattivo Scientifico",
    text: [
      {
        title:
          "<Trasformazione> 6 (Puoi pagare 6 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Yokai.)",
      },
      {
        title: "Trasmettitore Neurale",
        description: "Puoi giocare gratis gli oggetti chiamati Microbot.",
      },
      {
        title: "Conquista Tecnica",
        description:
          "Ogni volta che questo personaggio va all'avventura, pesca una carta per ogni personaggio avversario con 0 {S}.",
      },
    ],
  },
};
