import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const woodyTownSheriffI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Woody",
    version: "Town Sheriff",
    text: [
      {
        title: "Move Along",
        description:
          "When you play this character, until the start of your next turn, chosen opposing character can't challenge and must quest if able.",
      },
    ],
  },
  de: {
    name: "Woody",
    version: "Sheriff",
    text: [
      {
        title: "Geh weiter",
        description:
          "Wenn du diesen Charakter ausspielst, wähle einen gegnerischen Charakter. Jener kann bis zu Beginn deines nächsten Zuges nicht herausfordern und muss erkunden, wenn möglich.",
      },
    ],
  },
  fr: {
    name: "Woody",
    version: "Shérif de la ville",
    text: [
      {
        title: "Bouge de là",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui ne peut pas défier et doit, s'il le peut, être envoyé à l'aventure jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Woody",
    version: "Sceriffo della Città",
    text: [
      {
        title: "Circolare",
        description:
          "Quando giochi questo personaggio, fino all'inizio del tuo prossimo turno, un personaggio avversario a tua scelta non può sfidare e deve andare all'avventura se possibile.",
      },
    ],
  },
};
