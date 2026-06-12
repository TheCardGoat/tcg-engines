import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const olympusWouldBeThatWayI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Olympus Would Be That Way",
    text: "Your characters get +3 {S} while challenging a location this turn.",
  },
  de: {
    name: "Zum Olymp geht's da lang",
    text: "Deine Charaktere erhalten in diesem Zug +3, während sie einen Ort herausfordern.",
  },
  fr: {
    name: "L'Olympe, ce serait pas plutôt par là ?",
    text: "Lorsqu'ils défient un lieu durant votre tour, vos personnages gagnent +3.",
  },
  it: {
    name: "L'Olimpo Sarebbe per di Là",
    text: [
      {
        title: "I",
        description: "tuoi personaggi ottengono +3 mentre stanno sfidando luoghi per questo turno.",
      },
    ],
  },
};
