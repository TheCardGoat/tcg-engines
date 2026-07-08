import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const eeyoreHunnyScholarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Eeyore",
    version: "Hunny Scholar",
    text: [
      {
        title: "HUNNYTACTICS",
        description:
          "Whenever this character quests, chosen Hunny character of yours gets +1 {L} and gains Ward until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "I-Aah",
    version: "Honig-Gelehrter",
    text: [
      {
        title: "Honig-Taktiken",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, wähle einen deiner Honig-Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges +1 {L} und <Behütet>. (Gegnerische Mitspielende können den Charakter nicht auswählen, außer um ihn herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "Bourriquet",
    version: "Érudit mellifique",
    text: [
      {
        title: "Tactiques mellifiques",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez l'un de vos personnages Miel qui gagne +1 {L} et <Hors d'atteinte> jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Ih-Oh",
    version: "Erudito del Miele",
    text: [
      {
        title: "Tattiche del Miele",
        description:
          "Ogni volta che questo personaggio va all'avventura, un tuo personaggio Miele a tua scelta riceve +1 {L} e ottiene <Protetto> fino all'inizio del tuo prossimo turno. (Gli avversari non possono sceglierlo se non per sfidarlo.)",
      },
    ],
  },
};
