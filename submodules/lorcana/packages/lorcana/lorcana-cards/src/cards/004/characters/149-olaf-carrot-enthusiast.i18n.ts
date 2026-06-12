import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const olafCarrotEnthusiastI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Olaf",
    version: "Carrot Enthusiast",
    text: [
      {
        title:
          "Shift: Discard an item card (You may discard an item card to play this on top of one of your characters named Olaf.)",
      },
      {
        title: "CARROTS ALL AROUND!",
        description:
          "Whenever he quests, each of your other characters gets +{S} equal to this character's {S} this turn.",
      },
    ],
  },
  de: {
    name: "Olaf",
    version: "Karotten-Liebhaber",
    text: [
      {
        title:
          "Gestaltwandel: Wirf 1 Gegenstandskarte ab (Du kannst 1 Gegenstandskarte abwerfen, um diesen Charakter auf einen deiner Olaf-Charaktere auszuspielen.)",
      },
      {
        title: "KAROTTEN ÜBERALL!",
        description:
          "Jedes Mal, wenn er erkundet, erhalten deine anderen Charaktere in diesem Zug + in Höhe der dieses Charakters.",
      },
    ],
  },
  fr: {
    name: "Olaf",
    version: "Fan de carottes",
    text: [
      {
        title:
          "Alter: Défaussez une carte Objet (Vous pouvez défausser une carte Objet pour jouer ce personnage sur l'un de vos personnages Olaf.)",
      },
      {
        title: "DES CAROTTES PARTOUT!",
        description:
          "Chaque fois que vous envoyez ce personnage à l'aventure, ajoutez sa à la de vos autres personnages pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Olaf",
    version: "Appassionato di Carote",
    text: [
      {
        title:
          "Trasformazione: Scarta una carta oggetto (Puoi scartare una carta oggetto per giocare questa carta sopra a uno dei tuoi personaggi chiamato Olaf.)",
      },
      {
        title: "CAROTE OVUNQUE!",
        description:
          "Ogni volta che questo personaggio va all'avventura, ognuno dei tuoi altri personaggi riceve + pari alla di questo personaggio per questo turno.",
      },
    ],
  },
};
