import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kuzcoSelfishEmperorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kuzco",
    version: "Selfish Emperor",
    text: [
      {
        title: "OUTPLACEMENT",
        description:
          "When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.",
      },
      {
        title: "BY INVITE ONLY 4",
        description:
          "{I} — Your other characters gain Resist +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Kusco",
    version: "Selbstsüchtiger Herrscher",
    text: [
      {
        title: "AUSMUSTERN",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Gegenstand oder Ort deiner Wahl verdeckt und erschöpft in den zugehörigen Tintenvorrat legen.",
      },
      {
        title: "NUR AUF EINLADUNG 4",
        description:
          "— Deine anderen Charaktere erhalten bis zu Beginn deines nächsten Zuges Robust +1 (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Kuzco",
    version: "Empereur égoïste",
    text: [
      {
        title: "COUPES DRASTIQUES",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un lieu ou un objet et le placer dans la réserve d'encre de son propriétaire, face cachée et épuisé.",
      },
      {
        title: "SUR INVITATION SEULEMENT 4",
        description:
          "— Vos autres personnages gagnent Résistance +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Kuzco",
    version: "Imperatore Egoista",
    text: [
      {
        title: "RIDUZIONE DEL PERSONALE",
        description:
          "Quando giochi questo personaggio, puoi aggiungere un oggetto o un luogo a tua scelta al calamaio del suo giocatore, a faccia in giù e impegnato. SOLO SU INVITO 4 — I tuoi altri personaggi ottengono Resistere +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
