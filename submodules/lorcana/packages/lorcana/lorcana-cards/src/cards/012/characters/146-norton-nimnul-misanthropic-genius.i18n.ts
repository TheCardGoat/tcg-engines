import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nortonNimnulMisanthropicGeniusI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Norton Nimnul",
    version: "Misanthropic Genius",
    text: [
      {
        title: "DEVITALIZER RAY",
        description:
          "Once during your turn, whenever you play an item, chosen opposing character gets -2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Professor Norton Nimnul",
    version: "Misanthropisches Genie",
    text: [
      {
        title: "Devitalisierungsstrahl",
        description:
          "Einmal während deines Zuges, wenn du einen Gegenstand ausspielst, erhält ein gegnerischer Charakter deiner Wahl in diesem Zug -2 {S}.",
      },
    ],
  },
  fr: {
    name: "Professeur Nimnul",
    version: "Génie misanthrope",
    text: [
      {
        title: "Rayon dévitalisant",
        description:
          "Une fois durant votre tour, lorsque vous jouez un objet, choisissez un personnage adverse qui subit -2 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Norton Pandemonium",
    version: "Genio Misantropo",
    text: [
      {
        title: "Raggio Devitalizzante",
        description:
          "Una volta durante il tuo turno, ogni volta che giochi un oggetto, un personaggio avversario a tua scelta riceve -2 {S} per questo turno.",
      },
    ],
  },
};
