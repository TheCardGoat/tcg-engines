import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rapunzelHighClimberI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rapunzel",
    version: "High Climber",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "WRAPPED UP",
        description:
          "Whenever this character quests, chosen opposing character can't quest during their next turn.",
      },
    ],
  },
  de: {
    name: "Rapunzel",
    version: "Kletterin",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "EINGEWICKELT",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, wähle einen gegnerischen Charakter. Jener kann in seinem nächsten Zug nicht erkunden.",
      },
    ],
  },
  fr: {
    name: "Raiponce",
    version: "Grimpeuse en haute altitude",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "ENROULÉ",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage adverse qui ne peut pas être envoyé à l'aventure durant son prochain tour.",
      },
    ],
  },
  it: {
    name: "Rapunzel",
    version: "Scalatrice d'Alta Quota",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "AVVOLTO",
        description:
          "Ogni volta che questo personaggio va all'avventura, un personaggio avversario a tua scelta non può andare all'avventura durante il suo prossimo turno.",
      },
    ],
  },
};
