import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const winterCampMedicalTentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Winter Camp",
    version: "Medical Tent",
    text: [
      {
        title: "HELP THE WOUNDED",
        description:
          "Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.",
      },
    ],
  },
  de: {
    name: "Winter-Camp",
    version: "Sanitätszelt",
    text: [
      {
        title: "DEN VERWUNDETEN HELFEN",
        description:
          "Jedes Mal, wenn einer deiner Charaktere an diesem Ort erkundet, entferne bis zu 2 Schaden von ihm. Wenn es ein Held oder eine Heldin ist, entferne stattdessen bis zu 4 Schaden.",
      },
    ],
  },
  fr: {
    name: "Camp d'Hiver",
    version: "Tente médicale",
    text: [
      {
        title: "ASSISTANCE AUX BLESSÉS",
        description:
          "Chaque fois qu'un personnage sur ce lieu est envoyé à l'aventure, retirez-lui jusqu'à 2 jetons Dommage. Si c'est un personnage Héros, retirez-lui jusqu'à 4 jetons Dommage à la place.",
      },
    ],
  },
  it: {
    name: "Accampamento Invernale",
    version: "Tenda Medica",
    text: [
      {
        title: "AIUTARE I FERITI",
        description:
          "Ogni volta che un personaggio va all'avventura mentre si trova in questo luogo, rimuovi fino a 2 danni da quel personaggio. Se è un personaggio Eroe, rimuovi invece fino a 4 danni.",
      },
    ],
  },
};
