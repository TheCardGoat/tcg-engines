import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const philoctetesNononsenseInstructorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Philoctetes",
    version: "No-Nonsense Instructor",
    text: [
      {
        title: "YOU GOTTA STAY FOCUSED",
        description:
          "Your Hero characters gain Challenger +1. (They get +1 {S} while challenging.)",
      },
      {
        title: "SHAMELESS PROMOTER",
        description: "Whenever you play a Hero character, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Phil",
    version: "Kein Unsinns-Ausbilder",
    text: [
      {
        title: "DU MUSST DICH KONZENTIEREN",
        description:
          "Deine Heldinnen und Helden erhalten Herausfordern +1. (Während sie herausfordern, erhalten sie +1.)",
      },
      {
        title: "FRECHER VERKÜNDER",
        description:
          "Jedes Mal, wenn du einen Held oder eine Heldin ausspielst, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Philoctète",
    version: "Instructeur direct",
    text: [
      {
        title: "TU DOIS RESTER CONCENTRÉ",
        description:
          "Vos personnages Héros gagnent Offensif +1 (Lorsqu'ils défient, ces personnages gagnent +1.)",
      },
      {
        title: "ENTRAÎNEUR EFFRONTÉ",
        description: "Chaque fois que vous jouez un personnage Héros, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Filottete",
    version: "Istruttore Pragmatico",
    text: [
      {
        title: "DEVI RESTARE CONCENTRATO I",
        description:
          "tuoi personaggi Eroe ottengono Sfidante +1. (Ricevono +1 mentre stanno sfidando.)",
      },
      {
        title: "PROMOTORE SFACCIATO",
        description: "Ogni volta che giochi un personaggio Eroe, ottieni 1 leggenda.",
      },
    ],
  },
};
