import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const wrongLeverEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Wrong Lever!",
    text: "Choose one:\n- Return chosen character to their player's hand.\n- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
  },
  de: {
    name: "Das war der Falsche!",
    text: [
      {
        title: "Wähle eine Möglichkeit aus:",
      },
      {
        title: "• Schicke einen Charakter deiner Wahl auf die zugehörige Hand zurück.",
      },
      {
        title:
          "• Lege eine Zieh-den-Hebel!-Karte aus deinem Ablagestapel unter dein Deck, um einen Charakter deiner Wahl unter das zugehörige Deck zu legen.",
      },
    ],
  },
  fr: {
    name: "Pas ce levier-là !",
    text: [
      {
        title: "Choisissez entre:",
      },
      {
        title: "• Choisissez un personnage et renvoyez-le dans la main de son propriétaire.",
      },
      {
        title:
          "• Placez une carte nommée Abaisse le levier! de votre défausse sous votre pioche pour choisir un personnage et le placer sous la pioche de son propriétaire.",
      },
    ],
  },
  it: {
    name: "L'Altra Leva!",
    text: [
      {
        title: "Scegli uno:",
      },
      {
        title: "• Fai riprendere in mano al suo giocatore un personaggio a tua scelta.",
      },
      {
        title:
          "• Metti una carta chiamata Abbassa la Leva! dai tuoi scarti in fondo al tuo mazzo per mettere un personaggio a tua scelta in fondo al mazzo del suo giocatore.",
      },
    ],
  },
};
