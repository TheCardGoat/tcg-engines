import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const plutoGuardDogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pluto",
    version: "Guard Dog",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "BRAVO",
        description: "While this character has no damage, he gets +4 {S}.",
      },
    ],
  },
  de: {
    name: "Pluto",
    version: "Wachhund",
    text: [
      {
        title: "Beschützen",
      },
      {
        title: "GUTER JUNGE",
        description: "Solange dieser Charakter unbeschädigt ist, erhält er +4.",
      },
    ],
  },
  fr: {
    name: "Pluto",
    version: "Chien de garde",
    text: [
      {
        title: "Rempart",
      },
      {
        title: "BON CHIEN",
        description: "Tant que ce personnage n'a aucun dommage sur lui, il gagne +4.",
      },
    ],
  },
  it: {
    name: "Pluto",
    version: "Cane da Guardia",
    text: [
      {
        title: "Guardiano",
      },
      {
        title: "BRAVO",
        description: "Mentre questo personaggio non ha danno, riceve +4.",
      },
    ],
  },
};
