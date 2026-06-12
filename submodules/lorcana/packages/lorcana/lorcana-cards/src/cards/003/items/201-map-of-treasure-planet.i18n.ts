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
        title: "SCHLÜSSEL FÜR DAS PORTAL",
        description: "— Du zahlst 1 weniger für den nächsten Ort, den du in diesem Zug ausspielst.",
      },
      {
        title: "ZEIGE DEN WEG HEREIN",
        description: "Du zahlst 1 weniger, um Charaktere zu einem Ort zu bewegen.",
      },
    ],
  },
  fr: {
    name: "Carte de la Planète au Trésor",
    text: [
      {
        title: "CLÉ DU PORTAIL",
        description: "— Le prochain lieu que vous jouez durant ce tour vous coûte 1 de moins.",
      },
      {
        title: "MONTRE LE CHEMIN",
        description: "Déplacer vos personnages sur des lieux vous coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Mappa del Pianeta del Tesoro",
    text: [
      {
        title: "CHIAVE DEL PORTALE",
        description: "— Paga 1 in meno per per giocare il tuo prossimo luogo per questo turno.",
      },
      {
        title: "MOSTRARE L'ENTRATA",
        description: "Paga 1 in meno per spostare i tuoi personaggi in un luogo.",
      },
    ],
  },
};
