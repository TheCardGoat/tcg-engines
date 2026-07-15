import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const geniePowersUnleashedP1I18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Genie",
    version: "Powers Unleashed",
    text: [
      {
        title: "<Shift> 6",
      },
      {
        title: "<Evasive>",
      },
      {
        title: "Phenomenal Cosmic Power!",
        description:
          "Whenever this character quests, you may play an action with cost 5 or less for free.",
      },
    ],
  },
  de: {
    name: "Dschinni",
    version: "Entfesselte Energie",
    text: [
      {
        title:
          "<Gestaltwandel> 6 (Du kannst 6 {I} zahlen, um diesen Charakter auf einen deiner Dschinni-Charaktere auszuspielen.)",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Kosmische Kräfte!",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du eine Aktion, die 5 oder weniger kostet, kostenlos ausspielen.",
      },
    ],
  },
  fr: {
    name: "Génie",
    version: "Déchaîne ses pouvoirs",
    text: [
      {
        title:
          "<Alter> 6 (Vous pouvez payer 6 {I} pour jouer ce personnage sur l'un de vos personnages Génie.)",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "POUVOIR COSMIQUE PHÉNOMÉNAL!",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, vous pouvez jouer gratuitement une carte action coûtant 5 ou moins.",
      },
    ],
  },
  it: {
    name: "Genie",
    version: "Powers Unleashed",
    text: [
      {
        title:
          "<Shift> 6 (You may pay 6 {I} to play this on top of one of your characters named Genie.)",
      },
      {
        title: "<Evasive> (Only characters with Evasive can challenge this character.)",
      },
      {
        title: "Phenomenal Cosmic Power!",
        description:
          "Whenever this character quests, you may play an action with cost 5 or less for free.",
      },
    ],
  },
};
