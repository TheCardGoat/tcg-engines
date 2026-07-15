import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nanisPaybackI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nani's Payback",
    text: "Each opponent loses lore equal to the damage on chosen character of yours, to a maximum of 4 lore each. Draw a card.",
  },
  de: {
    name: "Nanis Rache",
    text: "Wähle einen deiner Charaktere und zähle den Schaden auf ihm. Alle gegnerischen Mitspielenden verlieren jeweils diese Anzahl an Legenden, bis zu einem Maximum von 4. Ziehe 1 Karte.",
  },
  fr: {
    name: "La revanche de Nani",
    text: "Choisissez l'un de vos personnages. Chaque adversaire perd autant d'éclats de Lore qu'il y a de dommages sur le personnage choisi, jusqu'à un maximum de 4 éclats de Lore chacun. Piochez une carte.",
  },
  it: {
    name: "La Rivincita di Nani",
    text: "Ogni avversario perde leggenda pari al danno su un tuo personaggio a tua scelta, fino a un massimo di 4 leggenda ciascuno. Pesca una carta.",
  },
};
