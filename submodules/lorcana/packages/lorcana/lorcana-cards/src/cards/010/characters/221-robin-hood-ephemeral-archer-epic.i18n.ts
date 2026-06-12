import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const robinHoodEphemeralArcherEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Robin Hood",
    version: "Ephemeral Archer",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "EXPERT SHOT",
        description:
          "Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.",
      },
    ],
  },
  de: {
    name: "Robin Hood",
    version: "Flüchtiger Bogenschütze",
    text: [
      {
        title: "Stärken 1",
      },
      {
        title: "MEISTERHAFTER SCHUSS",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls er mindestens eine Karte unter sich hat, wähle bis zu 2 Charaktere und füge ihnen je 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Robin des Bois",
    version: "Archer éphémère",
    text: [
      {
        title: "Boost 1",
      },
      {
        title: "TIREUR EXPERT",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, s'il y a une carte sous lui, choisissez jusqu'à 2 personnages et infligez 1 dommage à chacun.",
      },
    ],
  },
  it: {
    name: "Robin Hood",
    version: "Arciere Effimero",
    text: [
      {
        title: "Potenziamento 1",
      },
      {
        title: "TIRO ESPERTO",
        description:
          "Ogni volta che questo personaggio va all'avventura, se c'è una carta sotto di esso, infliggi 1 danno a fino a 2 personaggi a tua scelta.",
      },
    ],
  },
};
