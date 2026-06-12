import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofyMarleysClumsySpiritI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goofy",
    version: "Marley's Clumsy Spirit",
    text: [
      {
        title: "PREPARE YOURSELF",
        description:
          "When you play this character, you may ready chosen character. If you do, they can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Goofy",
    version: "Marleys ungeschickter Geist",
    text: [
      {
        title: "MACH DICH BEREIT",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Charakter deiner Wahl bereit machen. Wenn du dies tust, kann er in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Dingo",
    version: "Esprit maladroit de Marley",
    text: [
      {
        title: "PRÉPAREZ-VOUS",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage et le redresser. Si vous le faites, il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Spirito Imbranato di Marley",
    text: [
      {
        title: "PREPARATI",
        description:
          "Quando giochi questo personaggio, puoi preparare un personaggio a tua scelta. Se lo fai, non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
