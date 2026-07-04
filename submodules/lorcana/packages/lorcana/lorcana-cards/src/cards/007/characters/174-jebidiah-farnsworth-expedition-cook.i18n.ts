import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jebidiahFarnsworthExpeditionCookI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jebidiah Farnsworth",
    version: "Expedition Cook",
    text: [
      {
        title: "Support",
      },
      {
        title: "I GOT YOUR FOUR BASIC FOOD GROUPS",
        description:
          "When you play this character, chosen character gains Resist +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Jebidiah Farnsworth",
    version: "Expeditionskoch",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Ich hab die vier Hauptnahrungsgruppen",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl bis zu Beginn deines nächsten Zuges <Robust> +1. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Jebidiah Farnsworth",
    version: "Cuisinier de l'expédition",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "J'ai mis vos quatre grands groupes alimentaires",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne <Résistance> +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Jebidiah Farnsworth",
    version: "Cuoco della Spedizione",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Ce li Ho i Quattro Principali Gruppi Alimentari",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene <Resistere> +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
