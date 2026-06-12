import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const doYouWantToBuildASnowmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Do You Want to Build A Snowman?",
    text: [
      {
        title: "Chosen opponent chooses YES! or NO!:",
      },
      {
        title: "* YES!",
        description: "You gain 3 lore.",
      },
      {
        title:
          "* NO! They choose a character of theirs and put that card on the bottom of their deck.",
      },
    ],
    optionTexts: [
      "YES! They gain 3 lore.",
      "NO! Choose one of your characters and put it on the bottom of your deck.",
    ],
  },
  de: {
    name: "Willst du einen Schneemann bauen?",
    text: [
      {
        title: "Eine gegnerische Person deiner Wahl sagt JA! oder NEIN!:",
      },
      {
        title: "• JA!",
        description: "Du sammelst 3 Legenden.",
      },
      {
        title: "• NEIN! Die Person wählt einen ihrer Charaktere und legt diesen unter ihr Deck.",
      },
    ],
    optionTexts: [
      "JA! Sie sammeln 3 Legenden.",
      "NEIN! Wähle einen deiner Charaktere und lege ihn unter dein Deck.",
    ],
  },
  fr: {
    name: "Je voudrais un bonhomme de neige",
    text: [
      {
        title: "Choisissez un adversaire qui choisit D'ACCORD! ou NON!:",
      },
      {
        title: "• D'ACCORD!",
        description: "vous gagnez 3 éclats de Lore.",
      },
      {
        title: "• NON! il choisit l'un de ses personnages et le place sous sa pioche.",
      },
    ],
    optionTexts: [
      "D'ACCORD ! Il gagne 3 éclats de Lore.",
      "NON ! Choisissez l'un de vos personnages et placez-le sous votre pioche.",
    ],
  },
  it: {
    name: "Sei Già in Piedi Oppure Dormi?",
    text: [
      {
        title: "Un avversario a tua scelta sceglie tra SÌ! o NO!:",
      },
      {
        title: "• SÌ!",
        description: "Ottieni 3 leggenda.",
      },
      {
        title:
          "• NO! Quell'avversario sceglie un suo personaggio e mette quella carta in fondo al suo mazzo.",
      },
    ],
    optionTexts: [
      "SÌ! Ottiene 3 leggenda.",
      "NO! Scegli un tuo personaggio e mettilo in fondo al tuo mazzo.",
    ],
  },
};
