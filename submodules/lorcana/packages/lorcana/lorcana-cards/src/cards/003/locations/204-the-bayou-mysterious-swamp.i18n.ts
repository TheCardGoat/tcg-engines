import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theBayouMysteriousSwampI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Bayou",
    version: "Mysterious Swamp",
    text: [
      {
        title: "SHOW ME THE WAY",
        description:
          "Whenever a character quests while here, you may draw a card, then choose and discard a card.",
      },
    ],
  },
  de: {
    name: "Der Bayou",
    version: "Geheimnisvoller Sumpf",
    text: [
      {
        title: "WIR NEHMEN EUCH JETZT MIT",
        description:
          "Jedes Mal, wenn einer deiner Charaktere an diesem Ort erkundet, darfst du 1 Karte ziehen. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
    ],
  },
  fr: {
    name: "Le bayou",
    version: "Marais mystérieux",
    text: [
      {
        title: "MONTRE-MOI LE CHEMIN",
        description:
          "Chaque fois qu'un personnage sur ce lieu est envoyé à l'aventure, vous pouvez piocher une carte, puis choisissez et défaussez une carte.",
      },
    ],
  },
  it: {
    name: "Il Bayou",
    version: "Palude Misteriosa",
    text: [
      {
        title: "MOSTRAMI LA VIA",
        description:
          "Ogni volta che un personaggio va all'avventura mentre si trova in questo luogo, puoi pescare una carta, poi scegli e scarta una carta.",
      },
    ],
  },
};
