import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theMagicFeatherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Magic Feather",
    text: [
      {
        title: "NOW YOU CAN FLY!",
        description:
          "When you play this item, choose a character of yours. While this item is in play, that character gains Evasive.",
      },
      {
        title: "GROUNDED 3",
        description: "{I} — Return this item to your hand.",
      },
    ],
  },
  de: {
    name: "Die magische Feder",
    text: [
      {
        title: "JETZT KANNST DU FLIEGEN!",
        description:
          "Wenn du diesen Gegenstand ausspielst, wähle einen deiner Charaktere. Solange dieser Gegenstand im Spiel ist, erhält jener Charakter Wendig.",
      },
      {
        title: "GEERDET 3",
        description: "— Nimm diesen Gegenstand zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "La plume magique",
    text: [
      {
        title: "TU VAS POUVOIR VOLER!",
        description:
          "Lorsque vous jouez cet objet, choisissez l'un de vos personnages. Tant que cet objet est en jeu, le personnage ainsi choisi gagne Insaisissable.",
      },
      {
        title: "AU SOL 3",
        description: "— Renvoyez cet objet dans votre main.",
      },
    ],
  },
  it: {
    name: "La Piuma Magica",
    text: [
      {
        title: "ORA POTRAI VOLARE!",
        description:
          "Quando giochi questo oggetto, scegli un tuo personaggio. Mentre questo oggetto è in gioco, quel personaggio ottiene Sfuggente. (Solo altri personaggi con Sfuggente possono sfidarlo.) A TERRA 3 — Riprendi in mano questo oggetto.",
      },
    ],
  },
};
