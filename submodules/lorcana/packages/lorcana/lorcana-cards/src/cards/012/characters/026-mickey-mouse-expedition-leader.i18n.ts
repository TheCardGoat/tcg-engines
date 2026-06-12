import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseExpeditionLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Expedition Leader",
    text: [
      {
        title: "LONG JOURNEY",
        description: "This character may enter play exerted.",
      },
      {
        title: "SECRET PATH",
        description:
          "While this character is exerted, whenever one of your other characters quests, chosen opposing character gets -2 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Expeditionsleiter",
    text: [
      {
        title: "Lange Reise",
        description: "Du darfst diesen Charakter erschöpft ausspielen.",
      },
      {
        title: "Geheimer Pfad",
        description:
          "Jedes Mal, wenn einer deiner anderen Charaktere erkundet, solange dieser Charakter erschöpft ist, erhält ein gegnerischer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -2 {S}.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Chef d'expédition",
    text: [
      {
        title: "Long périple",
        description: "Ce personnage peut entrer en jeu épuisé.",
      },
      {
        title: "Sentier secret",
        description:
          "Tant que ce personnage est épuisé, chaque fois que l'un de vos autres personnages est envoyé à l'aventure, choisissez un personnage adverse qui subit -2 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Capo Spedizione",
    text: [
      {
        title: "Lungo Viaggio",
        description: "Questo personaggio può entrare in gioco impegnato.",
      },
      {
        title: "Sentiero Segreto",
        description:
          "Mentre questo personaggio è impegnato, ogni volta che uno dei tuoi altri personaggi va all'avventura, un personaggio avversario a tua scelta riceve -2 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
