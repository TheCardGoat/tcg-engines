import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rangerTeamupI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ranger Team-Up",
    text: "Chosen character gets +{S} equal to their {W} this turn.",
  },
  de: {
    name: "Teamarbeit der Ritter des Rechts",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug +{S} in Höhe seiner {W}.",
  },
  fr: {
    name: "Les rangers font équipe",
    text: "Choisissez un personnage qui gagne autant de {S} que sa {W} pour le reste de ce tour.",
  },
  it: {
    name: "Agenti Speciali Uniti",
    text: "Un personaggio a tua scelta riceve +{S} pari alla sua {W} per questo turno.",
  },
};
