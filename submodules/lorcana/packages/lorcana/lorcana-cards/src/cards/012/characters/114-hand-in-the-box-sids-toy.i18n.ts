import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const handintheboxSidsToyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hand-in-the-Box",
    version: "Sid's Toy",
    text: [
      {
        title: "SPRING-LOADED",
        description:
          "You may put a Toy character card from your discard on the bottom of your deck to play this character for free.",
      },
    ],
  },
  de: {
    name: "Schachtelhand",
    version: "Sids Spielzeug",
    text: [
      {
        title: "Gespannte Feder",
        description:
          "Du kannst 1 Spielzeug-Charakterkarte aus deinem Ablagestapel unter dein Deck legen, um diesen Charakter kostenlos auszuspielen.",
      },
    ],
  },
  fr: {
    name: "La Main dans la Boîte",
    version: "Jouet de Sid",
    text: [
      {
        title: "À ressort",
        description:
          "Vous pouvez placer sous votre pioche une carte Personnage Jouet de votre défausse pour jouer ce personnage-ci gratuitement.",
      },
    ],
  },
  it: {
    name: "Mano a Sorpresa",
    version: "Giocattolo di Sid",
    text: [
      {
        title: "Carico a Molla",
        description:
          "Puoi mettere una carta personaggio Giocattolo dai tuoi scarti in fondo al tuo mazzo per giocare questo personaggio gratis.",
      },
    ],
  },
};
