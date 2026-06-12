import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aladdinVigilantGuardI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aladdin",
    version: "Vigilant Guard",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "SAFE PASSAGE",
        description:
          "Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
      },
    ],
  },
  de: {
    name: "Aladdin",
    version: "Wachsamer Gardist",
    text: [
      {
        title: "Beschützen",
      },
      {
        title: "SICHERER DURCHGANG",
        description:
          "Jedes Mal, wenn einer deiner Verbündeten erkundet, darfst du bis zu 2 Schaden von diesem Charakter entfernen.",
      },
    ],
  },
  fr: {
    name: "Aladdin",
    version: "Protecteur vigilant",
    text: [
      {
        title: "Rempart",
      },
      {
        title: "PASSAGE SÛR",
        description:
          "Chaque fois que l'un de vos personnages Allié est envoyé à l'aventure, vous pouvez retirer jusqu'à 2 dommages de ce personnage-ci.",
      },
    ],
  },
  it: {
    name: "Aladdin",
    version: "Guardia Vigile",
    text: [
      {
        title: "Guardiano",
      },
      {
        title: "PASSAGGIO SICURO",
        description:
          "Ogni volta che uno dei tui personaggi Alleato va all'avventura, puoi rimuovere fino a 2 danni da questo personaggio.",
      },
    ],
  },
};
