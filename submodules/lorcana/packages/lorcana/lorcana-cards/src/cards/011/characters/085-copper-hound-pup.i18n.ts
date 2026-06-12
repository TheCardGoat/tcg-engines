import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const copperHoundPupI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Copper",
    version: "Hound Pup",
    text: [
      {
        title: "FOUND YA",
        description: "When you play this character, chosen player reveals their hand.",
      },
    ],
  },
  de: {
    name: "Capper",
    version: "Jagdhund-Welpe",
    text: [
      {
        title: "HAB DICH",
        description:
          "Wenn du diesen Charakter ausspielst, zeigt eine gegnerische Person deiner Wahl alle Handkarten für alle sichtbar vor.",
      },
    ],
  },
  fr: {
    name: "Rouky",
    version: "Chiot de chasse",
    text: [
      {
        title: "J'T'AI TROUVÉ",
        description: "Lorsque vous jouez ce personnage, choisissez un joueur qui révèle sa main.",
      },
    ],
  },
  it: {
    name: "Toby",
    version: "Cucciolo di Segugio",
    text: [
      {
        title: "TROVATO!",
        description:
          "Quando giochi questo personaggio, un giocatore a tua scelta rivela la sua mano.",
      },
    ],
  },
};
