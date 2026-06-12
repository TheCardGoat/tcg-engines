import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pongoDeterminedFatherEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pongo",
    version: "Determined Father",
    text: [
      {
        title: "TWILIGHT BARK",
        description:
          "Once during your turn, you may pay 2 {I} to reveal the top card of your deck. If it's a character card, put it into your hand. Otherwise, put it on the bottom of your deck.",
      },
    ],
  },
  de: {
    name: "Pongo",
    version: "Entschlossener Vater",
    text: [
      {
        title: "DÄMMERUNGSBELLEN",
        description:
          "Einmal pro Zug, darfst du 2 bezahlen, um die oberste Karte deines Decks aufzudecken. Falls sie eine Charakterkarte ist, nimm sie auf deine Hand. Falls nicht, lege sie unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Pongo",
    version: "Père persévérant",
    text: [
      {
        title: "ABOIEMENT DU SOIR",
        description:
          "Une fois par tour, vous pouvez payer 2 pour révéler la première carte de votre pioche. S'il s'agit d'une carte Personnage, ajoutez-la à votre main. Sinon, remettez-la sous votre pioche.",
      },
    ],
  },
  it: {
    name: "Pongo",
    version: "Padre Determinato",
    text: [
      {
        title: "TELEGRAFO DEL CREPUSCOLO",
        description:
          "Una volta per turno, puoi pagare 2 per rivelare la prima carta del tuo mazzo. Se è una carta personaggio, aggiungila alla tua mano. Altrimenti, mettila in fondo al tuo mazzo.",
      },
    ],
  },
};
