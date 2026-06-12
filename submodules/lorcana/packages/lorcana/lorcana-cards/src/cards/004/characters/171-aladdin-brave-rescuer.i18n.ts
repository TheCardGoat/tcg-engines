import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aladdinBraveRescuerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aladdin",
    version: "Brave Rescuer",
    text: [
      {
        title:
          "Shift: Discard a location card (You may discard a location card to play this on top of one of your characters named Aladdin.)",
      },
      {
        title: "CRASHING THROUGH",
        description: "Whenever this character quests, you may banish chosen item.",
      },
    ],
  },
  de: {
    name: "Aladdin",
    version: "Tapferer Retter",
    text: [
      {
        title:
          "Gestaltwandel: Wirf 1 Ortskarte ab (Du kannst 1 Ortskarte abwerfen, um diesen Charakter auf einen deiner Aladdin-Charaktere auszuspielen.)",
      },
      {
        title: "DURCHSCHLAGENDE ERFOLGE",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einen Gegenstand deiner Wahl verbannen.",
      },
    ],
  },
  fr: {
    name: "Aladdin",
    version: "Courageux sauveur",
    text: [
      {
        title:
          "Alter: Défaussez une carte Lieu (Vous pouvez défausser une carte Lieu pour jouer ce personnage sur l'un de vos personnages Aladdin.)",
      },
      {
        title: "PASSAGE EN FORCE",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un objet et le bannir.",
      },
    ],
  },
  it: {
    name: "Aladdin",
    version: "Soccorritore Coraggioso",
    text: [
      {
        title:
          "Trasformazione: Scarta una carta luogo (Puoi scartare una carta luogo per giocare questa carta sopra a uno dei tuoi personaggi chiamato Aladdin.)",
      },
      {
        title: "FARSI LARGO",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi esiliare un oggetto a tua scelta.",
      },
    ],
  },
};
