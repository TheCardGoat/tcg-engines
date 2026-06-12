import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicaDeSpellThievingSorceressI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magica De Spell",
    version: "Thieving Sorceress",
    text: [
      {
        title: "TELEKINESIS",
        description:
          "{E} — Return chosen item with cost equal to or less than this character's {S} to its player's hand.",
      },
    ],
  },
  de: {
    name: "Gundel Gaukeley",
    version: "Diebische Hexe",
    text: [
      {
        title: "TELEKINESE",
        description:
          "— Schicke einen Gegenstand deiner Wahl auf die zugehörige Hand zurück, der genauso viel oder weniger kostet wie der -Wert dieses Charakters beträgt.",
      },
    ],
  },
  fr: {
    name: "Miss Tick",
    version: "Sorcière en plein larcin",
    text: [
      {
        title: "TÉLÉKINÉSIE",
        description:
          "— Choisissez un objet ayant un coût inférieur ou égal à la de ce personnage et renvoyez-le dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Amelia",
    version: "Strega Ladruncola",
    text: [
      {
        title: "TELECINESI",
        description:
          "— Fai tornare un oggetto a tua scelta con costo pari o inferiore alla di questo personaggio in mano al suo giocatore.",
      },
    ],
  },
};
