import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const snowWhiteMerryAsTheMorningI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Snow White",
    version: "Merry as the Morning",
    text: [
      {
        title: "Clarion Call",
        description:
          "Whenever this character quests, you may return chosen Seven Dwarfs character of yours to your hand to draw a card.",
      },
      {
        title: "Never Forgotten",
        description:
          "During an opponent's turn, when this character is banished in a challenge, return this card to your hand.",
      },
    ],
  },
  de: {
    name: "Schneewittchen",
    version: "Fröhlich wie der Morgen",
    text: [
      {
        title: "Weckruf",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einen deiner Sieben Zwerge wählen und ihn zurück auf deine Hand nehmen, um eine Karte zu ziehen.",
      },
      {
        title: "Niemals vergessen",
        description:
          "Wenn dieser Charakter im Zug einer gegnerischen Person durch eine Herausforderung verbannt wird, nimm ihn zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Blanche-Neige",
    version: "Rayonnante comme le matin",
    text: [
      {
        title: "Appel du clairon",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir l'un de vos personnages Sept Nains et le renvoyer dans votre main pour piocher une carte.",
      },
      {
        title: "Jamais oubliée",
        description:
          "Durant le tour de vos adversaires, lorsque ce personnage est banni via un défi, renvoyez cette carte dans votre main.",
      },
    ],
  },
  it: {
    name: "Biancaneve",
    version: "Gioiosa come il Mattino",
    text: [
      {
        title: "Richiamo",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi riprendere in mano un tuo personaggio Sette Nani a tua scelta per pescare una carta.",
      },
      {
        title: "Mai Dimenticata",
        description:
          "Durante il turno di un avversario, quando questo personaggio viene esiliato in una sfida, riprendi in mano questa carta.",
      },
    ],
  },
};
