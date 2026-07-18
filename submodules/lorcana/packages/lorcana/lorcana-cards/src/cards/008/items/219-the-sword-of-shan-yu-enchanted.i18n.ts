import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theSwordOfShanyuEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Sword of Shan-Yu",
    text: [
      {
        title: "WORTHY WEAPON",
        description:
          "{E}, {E} one of your characters — Ready chosen character. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Das Schwert des Shan-Yu",
    text: [
      {
        title: "Würdige Waffe",
        description:
          "{E}, {E} einen deiner Charaktere — Mache einen Charakter deiner Wahl bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "L’épée de Shan-Yu",
    text: [
      {
        title: "Une arme digne de ce nom",
        description:
          "{E}, {E} l'un de vos personnages — Choisissez un personnage et redressez-le. Ce personnage ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "La Spada di Shan-Yu",
    text: [
      {
        title: "Arma Degna",
        description:
          "{E}, {E} uno dei tuoi personaggi — Prepara un personaggio a tua scelta. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "La espada de Shan-Yu",
    text: [
      {
        title: "ARMA DIGNA",
        description:
          "{E}, {E} uno de tus personajes: personaje elegido listo. No pueden realizar misiones durante el resto de este turno.",
      },
    ],
  },
};
