import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jasperCommonCrookI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jasper",
    version: "Common Crook",
    text: [
      {
        title: "PUPPYNAPPING",
        description:
          "Whenever this character quests, chosen opposing character can't quest during their next turn.",
      },
    ],
  },
  de: {
    name: "Jasper",
    version: "Gewöhnlicher Ganove",
    text: [
      {
        title: "WELPEN-ENTFÜHRUNG",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, wähle einen gegnerischen Charakter. Er kann in seinem nächsten Zug nicht erkunden.",
      },
    ],
  },
  fr: {
    name: "JASPER",
    version: "Petite frappe",
    text: [
      {
        title: "ENLÈVEMENT DE CHIOTS",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, choisissez un personnage adverse qui ne pourra pas être envoyé à l'aventure durant son prochain tour.",
      },
    ],
  },
  it: {
    name: "Gaspare",
    version: "Comune Ladruncolo",
    text: [
      {
        title: "A NANNA CUCCIOLI",
        description:
          "Ogni volta che questo personaggio va all'avventura, un personaggio avversario a tua scelta non potrà andare all'avventura nel suo prossimo turno.",
      },
    ],
  },
};
