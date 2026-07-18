import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const genieMagicalResearcherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Genie",
    version: "Magical Researcher",
    text: [
      {
        title: "Boost 1",
      },
      {
        title: "{I} INCREASING WISDOM This character gets +1 {L} for each card under him.",
      },
    ],
  },
  de: {
    name: "Dschinni",
    version: "Magischer Forscher",
    text: [
      {
        title:
          "<Stärken> 1 {I} (Einmal während deines Zuges darfst du 1 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Wachsende Weisheit",
        description: "Dieser Charakter erhält für jede Karte unter ihm +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Génie",
    version: "Chercheur en magie",
    text: [
      {
        title:
          "<Boost> 1 {I} (Une fois durant votre tour, vous pouvez payer 1 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Sagesse croissante",
        description: "Ce personnage gagne +1 {L} pour chaque carte sous lui.",
      },
    ],
  },
  it: {
    name: "Genio",
    version: "Ricercatore Magico",
    text: [
      {
        title:
          "<Potenziamento> 1 {I} (Una volta durante il tuo turno, puoi pagare 1 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Saggezza in Aumento",
        description: "Questo personaggio riceve +1 {L} per ogni carta sotto di sé.",
      },
    ],
  },
  es: {
    name: "Genio",
    version: "Investigador mágico",
    text: [
      {
        title: "Impulso 1",
      },
      {
        title:
          "{I} AUMENTO DE SABIDURÍA Este personaje obtiene +1 {L} por cada carta debajo de él.",
      },
    ],
  },
};
