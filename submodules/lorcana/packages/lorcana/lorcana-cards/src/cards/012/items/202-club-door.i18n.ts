import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const clubDoorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Club Door",
    text: [
      {
        title: "WELCOME BACK, SIR",
        description:
          "If you have a character named Fat Cat in play, you may play this card for free.",
      },
      {
        title: "COOL CATS ONLY",
        description: "Your locations can't be challenged by characters with cost 2 or less.",
      },
    ],
  },
  de: {
    name: "Club-Türe",
    text: [
      {
        title: "Willkommen zurück, Sir",
        description:
          "Falls du einen Al-Katzone-Charakter im Spiel hast, darfst du diese Karte kostenlos ausspielen.",
      },
      {
        title: "Nur coole Katzen",
        description:
          "Deine Orte können nicht von Charakteren, die 2 oder weniger kosten, herausgefordert werden.",
      },
    ],
  },
  fr: {
    name: "Porte du Club",
    text: [
      {
        title: "Bon retour, Monsieur",
        description:
          "Vous pouvez jouer cet objet gratuitement si vous avez un personnage nommé Catox en jeu.",
      },
      {
        title: "Réservé aux chats cools",
        description: "Vos lieux ne peuvent pas être défiés par des personnages coûtant 2 ou moins.",
      },
    ],
  },
  it: {
    name: "Porta del Club",
    text: [
      {
        title: "Bentornato, Signore",
        description:
          "Se hai in gioco un personaggio chiamato Gattolardo, puoi giocare questa carta gratis.",
      },
      {
        title: "Solo Gatti Cool",
        description:
          "I tuoi luoghi non possono essere sfidati da personaggi con costo 2 o inferiore.",
      },
    ],
  },
};
