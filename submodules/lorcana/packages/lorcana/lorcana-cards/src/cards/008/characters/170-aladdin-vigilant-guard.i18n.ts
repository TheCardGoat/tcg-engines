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
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Sicherer Durchgang",
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
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Passage sûr",
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
        title: "<Guardiano>",
      },
      {
        title: "Passaggio Sicuro",
        description:
          "Ogni volta che uno dei tui personaggi Alleato va all'avventura, puoi rimuovere fino a 2 danni da questo personaggio.",
      },
    ],
  },
  es: {
    name: "Aladino",
    version: "Guardia Vigilante",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "PASO SEGURO",
        description:
          "Siempre que uno de tus personajes aliados realice una misión, puedes eliminar hasta 2 daños de este personaje.",
      },
    ],
  },
};
