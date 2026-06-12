import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const louisEndearingAlligatorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Louis",
    version: "Endearing Alligator",
    text: [
      {
        title: "SENSITIVE SOUL",
        description: "This character enters play exerted.",
      },
      {
        title: "FRIENDLIER THAN HE LOOKS",
        description:
          "When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
      },
    ],
  },
  de: {
    name: "Louis",
    version: "Liebenswerter Alligator",
    text: [
      {
        title: "SENSIBLE SEELE",
        description: "Dieser Charakter kommt erschöpft ins Spiel.",
      },
      {
        title: "FREUNDLICHER, ALS ER AUSSIEHT",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein gegnerischer Charakter deiner Wahl in seinem nächsten Zug Impulsiv. (Der Charakter kann nicht erkunden und muss herausfordern, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Louis",
    version: "Alligator attachant",
    text: [
      {
        title: "ÂME SENSIBLE",
        description: "Ce personnage entre en jeu épuisé.",
      },
      {
        title: "PLUS SYMPA QU'IL N'Y PARAÎT",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui gagne Combattant durant son prochain tour.",
      },
    ],
  },
  it: {
    name: "Louis",
    version: "Tenero Alligatore",
    text: [
      {
        title: "ANIMO SENSIBILE",
        description: "Questo personaggio entra in gioco impegnato.",
      },
      {
        title: "PIÙ AMICHEVOLE DI QUANTO SEMBRI",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta ottiene Attaccabrighe durante il suo prossimo turno. (Non può andare all'avventura e deve sfidare, se possibile.)",
      },
    ],
  },
};
