import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const atlanticaConcertHallI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Atlantica",
    version: "Concert Hall",
    text: [
      {
        title: "UNDERWATER ACOUSTICS",
        description: "Characters count as having +2 cost to sing songs while here.",
      },
    ],
  },
  de: {
    name: "Atlantica",
    version: "Konzertsaal",
    text: [
      {
        title: "AKUSTIK UNTER WASSER",
        description:
          "Die Kosten von Charakteren an diesem Ort gelten als +2 für das Singen von Liedern.",
      },
    ],
  },
  fr: {
    name: "Atlantica",
    version: "Salle de concert",
    text: [
      {
        title: "ACOUSTIQUE SOUS-MARINE",
        description:
          "Les personnages sur ce lieu sont considérés comme ayant un coût de +2 pour chanter des chansons.",
      },
    ],
  },
  it: {
    name: "Atlantica",
    version: "Sala dei Concerti",
    text: [
      {
        title: "ACUSTICA SUBACQUEA I",
        description:
          "personaggi contano come di costo +2 per cantare le canzoni mentre si trovano in questo luogo.",
      },
    ],
  },
};
