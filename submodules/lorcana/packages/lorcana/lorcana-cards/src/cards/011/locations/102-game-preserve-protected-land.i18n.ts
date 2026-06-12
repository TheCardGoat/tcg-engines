import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gamePreserveProtectedLandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Game Preserve",
    version: "Protected Land",
    text: [
      {
        title: "EASY TO MISS",
        description:
          "While there's a character with Evasive here, this location gains Evasive. (Only characters with Evasive can challenge it.)",
      },
    ],
  },
  de: {
    name: "Wildschutzgebiet",
    version: "Geschütztes Land",
    text: [
      {
        title: "LEICHT ZU ÜBERSEHEN",
        description:
          "Solange du mindestens einen Charakter mit Wendig an diesem Ort hast, erhält dieser Ort Wendig. (Nur Charaktere mit Wendig können ihn herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Réserve de chasse",
    version: "Terrain protégé",
    text: [
      {
        title: "FACILE À RATER",
        description:
          "Tant qu'il y a un personnage avec Insaisissable sur ce lieu, ce lieu gagne Insaisissable. (Seuls les personnages avec Insaisissable peuvent défier ce lieu.)",
      },
    ],
  },
  it: {
    name: "Riserva di Caccia",
    version: "Territorio Protetto",
    text: [
      {
        title: "FACILE NON ACCORGERSENE",
        description:
          "Mentre c'è un personaggio con Sfuggente in questo luogo, questo luogo ottiene Sfuggente. (Solo personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
