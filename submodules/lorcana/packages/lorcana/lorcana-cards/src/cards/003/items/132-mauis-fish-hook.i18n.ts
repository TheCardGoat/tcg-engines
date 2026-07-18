import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mauisFishHookI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maui's Fish Hook",
    text: [
      {
        title: "IT'S MAUI TIME!",
        description:
          "If you have a character named Maui in play, you may use this item's Shapeshift ability for free.",
      },
      {
        title: "SHAPESHIFT",
        description: "{E}, 2 {I} — Choose one:",
      },
      {
        title: "• Chosen character gains Evasive until the start of your next turn.",
      },
      {
        title: "• Chosen character gets +3 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Mauis Fischhaken",
    text: [
      {
        title: "Jetzt ist Maui Zeit!",
        description:
          "Wenn du einen Maui-Charakter im Spiel hast, darfst du die Formwandler-Fähigkeit dieses Gegenstands kostenlos einsetzen.",
      },
      {
        title: "Formwandler",
        description: "{E}, 2 {I} — Wähle eine Möglickeit aus:",
      },
      {
        title: "• Gib einem Charakter deiner Wahl in diesem Zug +3 {S}.",
      },
      {
        title: "• Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges <Wendig>.",
      },
    ],
  },
  fr: {
    name: "L'hameçon de Maui",
    text: [
      {
        title: "Maui est de retour!",
        description:
          "Si vous avez un personnage Maui en jeu, vous pouvez utiliser gratuitement la capacité Métamorphose de cet objet.",
      },
      {
        title: "Métamorphose",
        description: "{E}, 2 {I} — Choisissez entre:",
      },
      {
        title:
          "• Choisissez un personnage, il gagne <Insaisissable> jusqu'au début de votre prochain tour.",
      },
      {
        title: "• Choisissez un personnage, il gagne +3 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Amo da Pesca di Maui",
    text: [
      {
        title: "È l'Ora di Maui!",
        description:
          "Se hai un personaggio chiamato Maui in gioco, puoi usare gratis l'abilità Mutaforma di questo oggetto.",
      },
      {
        title: "Mutaforma",
        description: "{E}, 2 {I} — Scegli uno:",
      },
      {
        title:
          "• Un personaggio a tua scelta ottiene <Sfuggente> fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
      {
        title: "• Un personaggio a tua scelta riceve +3 {S} per questo turno.",
      },
    ],
  },
  es: {
    name: "Anzuelo de Maui",
    text: [
      {
        title: "¡ES HORA DE MAUI!",
        description:
          "Si tienes un personaje llamado Maui en juego, puedes usar la habilidad Shapeshift de este objeto de forma gratuita.",
      },
      {
        title: "CAMBIO DE FORMA",
        description: "{E}, 2 {I} — Elige uno:",
      },
      {
        title: "• El personaje elegido gana Evasivo hasta el comienzo de tu siguiente turno.",
      },
      {
        title: "• El personaje elegido obtiene +3 {S} este turno.",
      },
    ],
  },
};
