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
        title: "Du musst dich konzentieren",
        description:
          "Deine Heldinnen und Helden erhalten <Herausfordern> +1. (Während sie herausfordern, erhalten sie +1 {S}.)",
      },
      {
        title: "Frecher Verkünder",
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
        title: "Tu dois rester concentré",
        description:
          "Vos personnages Héros gagnent <Offensif> +1 (Lorsqu'ils défient, ces personnages gagnent +1 {S}.)",
      },
      {
        title: "Entraîneur effronté",
        description: "Chaque fois que vous jouez un personnage Héros, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Filottete",
    version: "Istruttore Pragmatico",
    text: [
      {
        title: "Devi Restare Concentrato",
        description:
          "I tuoi personaggi Eroe ottengono <Sfidante> +1. (Ricevono +1 {S} mentre stanno sfidando.)",
      },
      {
        title: "Promotore Sfacciato",
        description: "Ogni volta che giochi un personaggio Eroe, ottieni 1 leggenda.",
      },
    ],
  },
};
