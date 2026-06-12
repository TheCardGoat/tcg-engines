import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const andysRoomHomeBaseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Andy's Room",
    version: "Home Base",
    text: [
      {
        title: "ANDY'S FAVORITE",
        description: "While you have only 1 character here, they get +2 {W} and +1 {L}.",
      },
    ],
  },
  de: {
    name: "Andys Zimmer",
    version: "Heimatbasis",
    text: [
      {
        title: "Andys Liebling",
        description:
          "Solange du genau 1 Charakter an diesem Ort hast, erhält er +2 {W} und +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Chambre d'Andy",
    version: "Camp de base",
    text: [
      {
        title: "Le préféré d'Andy",
        description:
          "Tant que vous n'avez qu'un seul personnage sur ce lieu, ce personnage gagne +2 {W} et +1 {L}.",
      },
    ],
  },
  it: {
    name: "La Stanza di Andy",
    version: "Base Operativa",
    text: [
      {
        title: "Il Preferito di Andy",
        description:
          "Mentre hai solo 1 personaggio in questo luogo, quel personaggio riceve +2 {W} e +1 {L}.",
      },
    ],
  },
};
