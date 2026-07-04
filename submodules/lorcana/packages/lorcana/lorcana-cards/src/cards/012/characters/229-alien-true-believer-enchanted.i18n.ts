import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const alienTrueBelieverEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Alien",
    version: "True Believer",
    text: [
      {
        title: "WE ARE ONE",
        description: "This character gets +1 {S} for each other Toy character you have in play.",
      },
      {
        title: "HE HAS BEEN CHOSEN",
        description:
          "During your turn, when this character is banished, return another character card named Alien from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Alien",
    version: "Wahrer Gläubiger",
    text: [
      {
        title: "Wir sind eins",
        description:
          "Dieser Charakter erhält +1 {S} für jedes weitere Spielzeug, das du im Spiel hast.",
      },
      {
        title: "Er ist auserwählt worden",
        description:
          "Wenn dieser Charakter in deinem Zug verbannt wird, nimm eine andere Charakterkarte namens Alien aus deinem Ablagestapel zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Alien",
    version: "Vrai croyant",
    text: [
      {
        title: "Nous ne faisons qu'un",
        description:
          "Ce personnage gagne +1 {S} pour chaque autre personnage Jouet que vous avez en jeu.",
      },
      {
        title: "Le grappin l'a choisi",
        description:
          "Durant votre tour, lorsque ce personnage est banni, renvoyez dans votre main une autre carte Personnage nommée Alien de votre défausse.",
      },
    ],
  },
  it: {
    name: "Alieno",
    version: "Vero Credente",
    text: [
      {
        title: "Siamo Una Cosa Sola",
        description:
          "Questo personaggio riceve +1 {S} per ogni altro personaggio Giocattolo che hai in gioco.",
      },
      {
        title: "È Stato Scelto",
        description:
          "Durante il tuo turno, quando questo personaggio viene esiliato, riprendi in mano un'altra carta personaggio chiamata Alieno dai tuoi scarti.",
      },
    ],
  },
};
