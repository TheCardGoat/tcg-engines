import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicaDeSpellShadowFormI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magica De Spell",
    version: "Shadow Form",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "DANCE OF DARKNESS",
        description:
          "When you play this character, you may return one of your other characters to your hand to draw a card.",
      },
    ],
  },
  de: {
    name: "Gundel Gaukeley",
    version: "Schattenform",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "TANZ DER DUNKELHEIT",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen deiner anderen Charaktere wählen und zurück auf deine Hand nehmen, um eine Karte zu ziehen.",
      },
    ],
  },
  fr: {
    name: "Miss Tick",
    version: "Sous forme d’ombre",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "DANSE DES TÉNÈBRES",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir et renvoyer l'un de vos personnages dans votre main pour piocher une carte.",
      },
    ],
  },
  it: {
    name: "Amelia",
    version: "In Forma d'Ombra",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "DANZA DELLE OMBRE",
        description:
          "Quando giochi questo personaggio, puoi riprendere in mano un tuo altro personaggio a tua scelta per pescare una carta.",
      },
    ],
  },
};
