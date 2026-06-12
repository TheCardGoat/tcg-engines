import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sisuEmpoweredSiblingI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sisu",
    version: "Empowered Sibling",
    text: [
      {
        title: "Shift 6",
      },
      {
        title: "I GOT THIS!",
        description:
          "When you play this character, banish all opposing characters with 2 {S} or less.",
      },
    ],
  },
  de: {
    name: "Sisu",
    version: "Starkes Familienmitglied",
    text: [
      {
        title: "Gestaltwandel 6",
      },
      {
        title: "ICH MACH DAS SCHON!",
        description:
          "Wenn du diesen Charakter ausspielst, verbanne alle gegnerischen Charaktere mit 2 oder weniger.",
      },
    ],
  },
  fr: {
    name: "Sisu",
    version: "Sœur responsable",
    text: [
      {
        title: "Alter 6",
      },
      {
        title: "LAISSE-MOI GÉRER ÇA!",
        description:
          "Lorsque vous jouez ce personnage, bannissez tous les personnages adverses ayant 2 ou moins.",
      },
    ],
  },
  it: {
    name: "Sisu",
    version: "Sorella Potenziata",
    text: [
      {
        title: "Trasformazione 6",
      },
      {
        title: "LASCIA FARE",
        description:
          "A ME Quando giochi questo personaggio, esilia tutti i personaggi avversari con 2 o inferiore.",
      },
    ],
  },
};
