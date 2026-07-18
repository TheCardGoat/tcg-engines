import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseArtfulRogueEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Artful Rogue",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "MISDIRECTION",
        description:
          "Whenever you play an action, chosen opposing character can't quest during their next turn.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Gewiefter Gauner",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Micky-Maus-Charaktere auszuspielen.)",
      },
      {
        title: "Irreführung",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, wähle einen gegnerischen Charakter. Er kann in seinem nächsten Zug nicht erkunden.",
      },
    ],
  },
  fr: {
    name: "MICKEY",
    version: "Bandit rusé",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Mickey",
      },
      {
        title: "MAUVAISE ORIENTATION",
        description:
          "Chaque fois que vous jouez une carte action, choisissez un personnage adverse. Il ne peut pas être envoyé à l'aventure durant son prochain tour.",
      },
    ],
  },
  it: {
    name: "Mickey Mouse",
    version: "Artful Rogue",
    text: [
      {
        title:
          "<Shift> 5 (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)",
      },
      {
        title: "Misdirection",
        description:
          "Whenever you play an action, chosen opposing character can't quest during their next turn.",
      },
    ],
  },
  es: {
    name: "Ratoncito Mickey",
    version: "Pícaro ingenioso",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "DIRECCIÓN MAL",
        description:
          "Cada vez que juegas una acción, el personaje contrario elegido no puede realizar misiones durante su siguiente turno.",
      },
    ],
  },
};
