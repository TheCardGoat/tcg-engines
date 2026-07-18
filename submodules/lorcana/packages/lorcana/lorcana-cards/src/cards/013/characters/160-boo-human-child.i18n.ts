import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const booHumanChildI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Boo",
    version: "Human Child",
    text: [
      {
        title: "Making Memories",
        description: "While you have 5 or more cards in your inkwell, this character gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Buh",
    version: "Menschenkind",
    text: [
      {
        title: "Erinnerungen schaffen",
        description:
          "Solange du 5 oder mehr Karten in deinem Tintenvorrat hast, erhält dieser Charakter +2 {L}.",
      },
    ],
  },
  fr: {
    name: "Bouh",
    version: "Enfant humaine",
    text: [
      {
        title: "Créer des souvenirs",
        description:
          "Tant que vous avez 5 cartes ou plus dans votre réserve d'encre, ce personnage gagne +2 {L}.",
      },
    ],
  },
  it: {
    name: "Boo",
    version: "Bambina Umana",
    text: [
      {
        title: "Costruire Ricordi",
        description: "Mentre hai 5 o più carte nel tuo calamaio, questo personaggio riceve +2 {L}.",
      },
    ],
  },
  es: {
    name: "Abucheo",
    version: "Niño humano",
    text: [
      {
        title: "Creando recuerdos",
        description: "Mientras tengas 5 o más cartas en tu tintero, este personaje obtiene +2 {L}.",
      },
    ],
  },
};
