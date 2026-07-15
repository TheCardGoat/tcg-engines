import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bellesFavoriteBookI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Belle's Favorite Book",
    text: [
      {
        title: "CHAPTER THREE",
        description:
          "{E}, Banish one of your other items — Put the top card of your deck into your inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Belles Lieblingsbuch",
    text: [
      {
        title: "Kapitel drei",
        description:
          "{E}, Verbanne einen deiner anderen Gegenstände — Lege die oberste Karte deines Decks verdeckt und erschöpft in deinen Tintenvorrat.",
      },
    ],
  },
  fr: {
    name: "Le livre préféré de Belle",
    text: [
      {
        title: "Chapitre trois",
        description:
          "{E}, Bannissez un autre de vos objets — Placez la carte du dessus de votre pioche dans votre réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "Libro Preferito di Belle",
    text: [
      {
        title: "Capitolo Tre",
        description:
          "{E}, esilia uno dei tuoi altri oggetti — Aggiungi la prima carta del tuo mazzo al tuo calamaio, a faccia in giù e impegnata.",
      },
    ],
  },
};
