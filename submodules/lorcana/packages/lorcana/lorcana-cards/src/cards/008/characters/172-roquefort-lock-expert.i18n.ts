import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const roquefortLockExpertI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Roquefort",
    version: "Lock Expert",
    text: [
      {
        title: "SAFEKEEPING",
        description:
          "Whenever this character quests, you may put chosen item into its player's inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Roquefort",
    version: "Experte für Schlösser",
    text: [
      {
        title: "SICHERE VERWAHRUNG",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einen Gegenstand deiner Wahl verdeckt und erschöpft in den zugehörigen Tintenvorrat legen.",
      },
    ],
  },
  fr: {
    name: "Roquefort",
    version: "Expert en serrures",
    text: [
      {
        title: "GARDER EN SÉCURITÉ",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un objet et le placer dans la réserve d'encre de son propriétaire, face cachée et épuisé.",
      },
    ],
  },
  it: {
    name: "Groviera",
    version: "Esperto di Serrature",
    text: [
      {
        title: "METTERE AL SICURO",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi aggiungere un oggetto a tua scelta al calamaio del suo giocatore, a faccia in giù e impegnato.",
      },
    ],
  },
};
