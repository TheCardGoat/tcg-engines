import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ratigansPartySeedyBackRoomEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ratigan's Party",
    version: "Seedy Back Room",
    text: [
      {
        title: "MISFITS' REVELRY",
        description: "While you have a damaged character here, this location gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Rattenzahns Party",
    version: "Zwielichtiges Hinterzimmer",
    text: [
      {
        title: "FEIER DER MISSETÄTER",
        description:
          "Solange du mindestens einen beschädigten Charakter an diesem Ort hast, erhält dieser Ort +2.",
      },
    ],
  },
  fr: {
    name: "Fête de Ratigan",
    version: "Arrière-salle sordide",
    text: [
      {
        title: "FÊTE DES PARIAS",
        description:
          "Tant que vous avez un personnage ayant au moins un dommage sur lui sur ce lieu, ce lieu gagne +2.",
      },
    ],
  },
  it: {
    name: "Festa di Rattigan",
    version: "Stanzino Squallido",
    text: [
      {
        title: "LA BALDORIA DEI BALORDI",
        description:
          "Mentre hai un personaggio danneggiato in questo luogo, questo luogo riceve +2.",
      },
    ],
  },
};
