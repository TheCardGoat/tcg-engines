import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sourceOfTheVineI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Source of the Vine",
    text: [
      {
        title: "SIPHON",
        description:
          "Whenever an opposing character quests, you gain 1 lore unless their player pays 1 {I}.",
      },
      {
        title: "RADIANT BLOOM",
        description: "{E}, 2 {I} — Gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Die Quelle der Ranke",
    text: [
      {
        title: "Absaugen",
        description:
          "Jedes Mal, wenn ein gegnerischer Charakter erkundet, sammelst du 1 Legende, außer die ihm zugehörige Person bezahlt 1 {I}.",
      },
      {
        title: "Strahlende Blüte",
        description: "{E}, 2 {I} — Sammle 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Source de la Plante",
    text: [
      {
        title: "Siphon",
        description:
          "Chaque fois qu'un personnage adverse est envoyé à l'aventure, vous gagnez 1 éclat de Lore à moins que son propriétaire ne paie 1 {I}.",
      },
      {
        title: "Floraison rayonnante",
        description: "{E}, 2 {I} — Gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Fonte del Viticcio",
    text: [
      {
        title: "Assorbimento",
        description:
          "Ogni volta che un personaggio avversario va all'avventura, ottieni 1 leggenda a meno che il suo giocatore non paghi 1 {I}.",
      },
      {
        title: "Fioritura Radiosa",
        description: "{E}, 2 {I} — Ottieni 1 leggenda.",
      },
    ],
  },
  es: {
    name: "Fuente de la Vid",
    text: [
      {
        title: "SIFÓN",
        description:
          "Cada vez que un personaje contrario realiza una misión, obtienes 1 conocimiento a menos que su jugador pague 1 {I}.",
      },
      {
        title: "FLOR RADIANTE",
        description: "{E}, 2 {I}: Gana 1 conocimiento.",
      },
    ],
  },
};
