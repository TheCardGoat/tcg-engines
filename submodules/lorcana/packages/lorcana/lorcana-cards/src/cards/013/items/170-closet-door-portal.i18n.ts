import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const closetDoorPortalI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Closet Door Portal",
    text: [
      {
        title: "Knock, Knock",
        description: "This item enters play exerted.",
      },
      {
        title: "Who's There?",
        description:
          "{E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order. Put this card into your inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Schranktür-Portal",
    text: [
      {
        title: "Klopf, klopf",
        description: "Dieser Gegenstand kommt erschöpft ins Spiel.",
      },
      {
        title: "Wer ist da?",
        description:
          "{E}, 2 {I} — Schaue dir die obersten 3 Karten deines Decks an. Du darfst 1 Charakter-, Gegenstands- oder Ortskarte, die 6 oder weniger kostet, daraus aufdecken und kostenlos ausspielen. Lege die restlichen Karten in beliebiger Reihenfolge unter dein Deck. Lege diese Karte verdeckt und erschöpft in deinen Tintenvorrat.",
      },
    ],
  },
  fr: {
    name: "Portail de la Porte du placard",
    text: [
      {
        title: "Toc Toc",
        description: "Cet objet entre en jeu épuisé.",
      },
      {
        title: "Qui est là?",
        description:
          "{E}, 2 {I} — Regardez les 3 cartes du dessus de votre pioche. Vous pouvez révéler une carte Personnage, Objet ou Lieu coûtant 6 ou moins parmi elles et la jouer gratuitement. Placez les autres cartes sous votre pioche, dans l'ordre de votre choix. Placez cette carte-ci dans votre réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "Portale dell'Armadio",
    text: [
      {
        title: "Toc, Toc",
        description: "Questo oggetto entra in gioco impegnato.",
      },
      {
        title: "Chi È?",
        description:
          "{E}, 2 {I} — Guarda le prime 3 carte del tuo mazzo. Puoi rivelare una carta personaggio, oggetto o luogo con costo 6 o inferiore e giocarla gratis. Metti il resto in fondo al tuo mazzo in qualsiasi ordine. Aggiungi questa carta al tuo calamaio, a faccia in giù e impegnata.",
      },
    ],
  },
  es: {
    name: "Portal de la puerta del armario",
    text: [
      {
        title: "Toca, toca",
        description: "Este objeto entra en juego ejercido.",
      },
      {
        title: "¿Quién está ahí?",
        description:
          "{E}, 2 {I}: mira las 3 primeras cartas de tu mazo. Puedes revelar una carta de personaje, objeto o ubicación con un coste de 6 o menos y jugarla gratis. Coloque el resto en el fondo de su plataforma en cualquier orden. Pon esta carta en tu tintero boca abajo y ejercítala.",
      },
    ],
  },
};
