import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const johnSmithSnowTrackerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "John Smith",
    version: "Snow Tracker",
    text: [
      {
        title: "FOLLOW THE TRACKS",
        description:
          "At the end of your turn, if this character is exerted and none of your characters challenged this turn, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "John Smith",
    version: "Fährtenleser im Schnee",
    text: [
      {
        title: "FOLGE DEN SPUREN",
        description:
          "Am Ende deines Zuges, falls dieser Charakter erschöpft ist und in diesem Zug keiner deiner Charaktere herausgefordert hat, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "John Smith",
    version: "Pisteur des neiges",
    text: [
      {
        title: "SUIT LES TRACES À",
        description:
          "la fin de votre tour, si ce personnage est épuisé et qu'aucun de vos personnages n'a défié ce tour-ci, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "John Smith",
    version: "Inseguitore sulla Neve",
    text: [
      {
        title: "SEGUIRE LE TRACCE",
        description:
          "Alla fine del tuo turno, se questo personaggio è impegnato e nessuno dei tuoi personaggi ha sfidato in questo turno, ottieni 1 leggenda.",
      },
    ],
  },
};
