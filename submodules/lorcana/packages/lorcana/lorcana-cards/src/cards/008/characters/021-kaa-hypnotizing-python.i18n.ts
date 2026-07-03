import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kaaHypnotizingPythonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kaa",
    version: "Hypnotizing Python",
    text: [
      {
        title: "LOOK ME IN THE EYE",
        description:
          "Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
      },
    ],
  },
  de: {
    name: "Kaa",
    version: "Hypnotisierende Python",
    text: [
      {
        title: "Schau mir in die Augen",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhält ein gegnerischer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -2 {S} und <Impulsiv>. (Der Charakter kann nicht erkunden und muss herausfordern, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Kaa",
    version: "Python hypnotiseur",
    text: [
      {
        title: "Regarde-moi dans les yeux",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage adverse qui subit -2 {S} et qui gagne <Combattant> jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Kaa",
    version: "Pitone Ipnotico",
    text: [
      {
        title: "Guardami negli Occhi",
        description:
          "Ogni volta che questo personaggio va all'avventura, un personaggio avversario a tua scelta riceve -2 {S} e ottiene <Attaccabrighe> fino all'inizio del tuo prossimo turno. (Non può andare all'avventura e deve sfidare, se possibile.)",
      },
    ],
  },
};
