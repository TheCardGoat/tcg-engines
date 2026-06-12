import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const simbaRightfulKingI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Simba",
    version: "Rightful King",
    text: [
      {
        title: "TRIUMPHANT STANCE",
        description:
          "During your turn, whenever this character banishes another character in a challenge, chosen opposing character can't challenge during their next turn.",
      },
    ],
  },
  de: {
    name: "Simba",
    version: "Rechtmäßiger König",
    text: [
      {
        title: "TRIUMPHALE HALTUNG",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, wähle einen gegnerischen Charakter. Er kann in seinem nächsten Zug nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "Simba",
    version: "Roi légitime",
    text: [
      {
        title: "POSE TRIOMPHANTE",
        description:
          "Chaque fois que ce personnage en bannit un autre via un défi durant votre tour, choisissez un personnage adverse, il ne pourra pas défier durant son prochain tour.",
      },
    ],
  },
  it: {
    name: "Simba",
    version: "Sovrano Legittimo",
    text: [
      {
        title: "POSA TRIONFALE",
        description:
          "Durante il tuo turno, ogni volta che questo personaggio esilia un altro personaggio in una sfida, un personaggio avversario a tua scelta non può sfidare durante il suo prossimo turno.",
      },
    ],
  },
};
