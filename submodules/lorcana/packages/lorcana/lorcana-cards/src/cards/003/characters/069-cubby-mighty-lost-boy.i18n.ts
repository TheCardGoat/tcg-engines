import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cubbyMightyLostBoyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cubby",
    version: "Mighty Lost Boy",
    text: [
      {
        title: "THE BEAR",
        description: "Whenever this character moves to a location, he gets +3 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Curly",
    version: "Stärkster der verwunschenen Kinder",
    text: [
      {
        title: "DER BÄR",
        description:
          "Jedes Mal, wenn dieser Charakter zu einem Ort bewegt wird, erhält er in diesem Zug +3.",
      },
    ],
  },
  fr: {
    name: "Le Frisé",
    version: "Enfant perdu très costaud",
    text: [
      {
        title: "L'OURS",
        description:
          "Chaque fois que vous déplacez ce personnage sur un lieu, il gagne +3 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Cubby",
    version: "Possente Bimbo Sperduto",
    text: [
      {
        title: "L'ORSO",
        description:
          "Ogni volta che questo personaggio si sposta in un luogo, riceve +3 per questo turno.",
      },
    ],
  },
};
