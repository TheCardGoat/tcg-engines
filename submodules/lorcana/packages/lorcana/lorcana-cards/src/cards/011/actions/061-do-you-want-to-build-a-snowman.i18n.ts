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
  },
  de: {
    name: "Willst du einen Schneemann bauen?",
    text: [
      {
        title: "Eine gegnerische Person deiner Wahl sagt JA! oder NEIN!:",
      },
      {
        title: "• JA! Du sammelst 3 Legenden.",
      },
      {
        title: "• NEIN! Die Person wählt einen ihrer Charaktere und legt diesen unter ihr Deck.",
      },
    ],
  },
  fr: {
    name: "Je voudrais un bonhomme de neige",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez un adversaire qui choisit D'ACCORD! ou NON!:",
      },
      {
        title: "• D'ACCORD!: vous gagnez 3 éclats de Lore.",
      },
      {
        title: "• NON!: il choisit l'un de ses personnages et le place sous sa pioche.",
      },
    ],
  },
  it: {
    name: "Sei Già in Piedi Oppure Dormi?",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Un avversario a tua scelta sceglie tra SÌ! o NO!:",
      },
      {
        title: "• SÌ! Ottieni 3 leggenda.",
      },
      {
        title:
          "• NO! Quell'avversario sceglie un suo personaggio e mette quella carta in fondo al suo mazzo.",
      },
    ],
  },
  es: {
    name: "¿Quieres construir un muñeco de nieve?",
    text: [
      {
        title: "El oponente elegido elige ¡SÍ! o ¡NO!:",
      },
      {
        title: "* ¡SÍ!",
        description: "Obtienes 3 conocimientos.",
      },
      {
        title: "* ¡NO! Eligen un personaje suyo y ponen esa carta en la parte inferior de su mazo.",
      },
    ],
  },
};
