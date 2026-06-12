import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theBitterwoodUndergroundForestI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Bitterwood",
    version: "Underground Forest",
    text: [
      {
        title: "GATHER RESOURCES",
        description:
          "Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Der Bitterwald",
    version: "Unterirdischer Wald",
    text: [
      {
        title: "RESSOURCEN SAMMELN",
        description:
          "Einmal während deines Zuges, wenn einer deiner Charaktere mit 5 oder mehr an diesen Ort bewegt wird, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Le Bois-Amer",
    version: "Forêt souterraine",
    text: [
      {
        title: "RASSEMBLER DES RESSOURCES",
        description:
          "Une fois durant votre tour, lorsque vous déplacez sur ce lieu un personnage ayant 5 ou plus, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Il Bosco Amaro",
    version: "Foresta Sotterranea",
    text: [
      {
        title: "RACCOGLIERE RISORSE",
        description:
          "Una volta durante il tuo turno, ogni volta che sposti un personaggio con 5 o superiore in questo luogo, puoi pescare una carta.",
      },
    ],
  },
};
