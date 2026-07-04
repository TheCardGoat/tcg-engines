import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sulleyTheNewBossI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sulley",
    version: "The New Boss",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "REHIRE",
        description:
          "When you play this character, you may return a character card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Sulley",
    version: "Der neue Boss",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Wiedereinstellung",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du eine Charakterkarte von deinem Ablagestapel zurück auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Sulli",
    version: "Le nouveau Boss",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Réembaucher",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez renvoyer dans votre main une carte Personnage de votre défausse.",
      },
    ],
  },
  it: {
    name: "Sulley",
    version: "Il Nuovo Capo",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Riassunzione",
        description:
          "Quando giochi questo personaggio, puoi riprendere in mano una carta personaggio dai tuoi scarti.",
      },
    ],
  },
};
