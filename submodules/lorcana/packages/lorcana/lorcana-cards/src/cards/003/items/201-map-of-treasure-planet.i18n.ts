import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mapOfTreasurePlanetI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Map of Treasure Planet",
    text: [
      {
        title: "KEY TO THE PORTAL",
        description: "{E} — You pay 1 {I} less for the next location you play this turn.",
      },
      {
        title: "SHOW THE WAY",
        description: "You pay 1 {I} less to move your characters to a location.",
      },
    ],
  },
  de: {
    name: "Karte des Schatzplaneten",
    text: [
      {
        title: "Schlüssel für das Portal",
        description:
          "{E} — Du zahlst 1 {I} weniger für den nächsten Ort, den du in diesem Zug ausspielst.",
      },
      {
        title: "Zeige den Weg herein",
        description: "Du zahlst 1 {I} weniger, um Charaktere zu einem Ort zu bewegen.",
      },
    ],
  },
  fr: {
    name: "Carte de la Planète au Trésor",
    text: [
      {
        title: "Clé du portail",
        description:
          "{E} — Le prochain lieu que vous jouez durant ce tour vous coûte 1 {I} de moins.",
      },
      {
        title: "Montre le chemin",
        description: "Déplacer vos personnages sur des lieux vous coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Mappa del Pianeta del Tesoro",
    text: [
      {
        title: "Chiave del Portale",
        description:
          "{E} — Paga 1 {I} in meno per per giocare il tuo prossimo luogo per questo turno.",
      },
      {
        title: "Mostrare l'Entrata",
        description: "Paga 1 {I} in meno per spostare i tuoi personaggi in un luogo.",
      },
    ],
  },
};
