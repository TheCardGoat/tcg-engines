import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const taranPigKeeperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Taran",
    version: "Pig Keeper",
    text: [
      {
        title: "Support",
      },
      {
        title: "FOLLOW THE PIG",
        description:
          "Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Taran",
    version: "Schweinehirt",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Folge dem Schwein",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du eine Hen-Wen-Charakterkarte aus deinem Ablagestapel zurück auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Taram",
    version: "Gardien de cochon",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Suivre le cochon",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez renvoyer dans votre main une carte Personnage nommée Tirelire de votre défausse.",
      },
    ],
  },
  it: {
    name: "Taron",
    version: "Guardiano di Porci",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Segui il Maiale",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi riprendere in mano una carta personaggio chiamata Ewy dai tuoi scarti.",
      },
    ],
  },
};
