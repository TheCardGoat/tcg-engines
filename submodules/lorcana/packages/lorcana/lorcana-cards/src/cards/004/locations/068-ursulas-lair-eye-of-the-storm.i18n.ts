import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ursulasLairEyeOfTheStormI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ursula’s Lair",
    version: "Eye of the Storm",
    text: [
      {
        title: "SLIPPERY HALLS",
        description:
          "Whenever a character is banished in a challenge while here, you may return them to your hand.",
      },
      {
        title: "SEAT OF POWER",
        description: "Characters named Ursula get +1 {L} while here.",
      },
    ],
  },
  de: {
    name: "Ursulas Versteck",
    version: "Auge des Sturms",
    text: [
      {
        title: "GLITSCHIGE HALLEN",
        description:
          "Jedes Mal, wenn einer deiner Charaktere an diesem Ort durch eine Herausforderung verbannt wird, darfst du jenen zurück auf deine Hand nehmen.",
      },
      {
        title: "ORT DER MACHT",
        description: "Ursula-Charaktere an diesem Ort erhalten +1.",
      },
    ],
  },
  fr: {
    name: "Le Repaire d'Ursula",
    version: "L'œil du cyclone",
    text: [
      {
        title: "SALLES GLISSANTES",
        description:
          "Chaque fois qu'un personnage sur ce lieu est banni via un défi, vous pouvez le renvoyer dans votre main.",
      },
      {
        title: "SIÈGE DU POUVOIR",
        description: "Tant qu'ils sont sur ce lieu, les personnages Ursula gagnent +1.",
      },
    ],
  },
  it: {
    name: "Il Covo di Ursula",
    version: "Occhio del Ciclone",
    text: [
      {
        title: "CORRIDOI SCIVOLOSI",
        description:
          "Ogni volta che un personaggio viene esiliato in una sfida mentre si trova in questo luogo, puoi riprenderlo in mano.",
      },
      {
        title: "SEDE DEL POTERE I",
        description: "personaggi chiamati Ursula ricevono +1 mentre si trovano in questo luogo.",
      },
    ],
  },
};
