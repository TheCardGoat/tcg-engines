import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const drFacilierFortuneTellerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dr. Facilier",
    version: "Fortune Teller",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "YOU'RE IN MY WORLD",
        description:
          "Whenever this character quests, chosen opposing character can't quest during their next turn.",
      },
    ],
  },
  de: {
    name: "Dr. Facilier",
    version: "Wahrsager",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Ihr seid in meiner Welt",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, wähle einen gegnerischen Charakter. Er kann in seinem nächsten Zug nicht erkunden.",
      },
    ],
  },
  fr: {
    name: "Dr. Facilier",
    version: "Lit dans les cartes",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Mon royaume vous tend les bras",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, choisissez un personnage adverse. Il ne peut pas être envoyé à l'aventure durant son prochain tour.",
      },
    ],
  },
  it: {
    name: "Dr. Facilier",
    version: "Fortune Teller",
    text: [
      {
        title: "<Evasive> (Only characters with Evasive can challenge this character.)",
      },
      {
        title: "You're in My World",
        description:
          "Whenever this character quests, chosen opposing character can't quest during their next turn.",
      },
    ],
  },
};
