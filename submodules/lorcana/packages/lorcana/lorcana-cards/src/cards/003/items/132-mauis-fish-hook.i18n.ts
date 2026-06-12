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
        title: "JETZT IST MAUI ZEIT!",
        description:
          "Wenn du einen Maui-Charakter im Spiel hast, darfst du die Formwandler-Fähigkeit dieses Gegenstands kostenlos einsetzen.",
      },
      {
        title: "FORMWANDLER, 2",
        description:
          "— Wähle eine Möglickeit aus: • Gib einem Charakter deiner Wahl in diesem Zug +3. • Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Wendig.",
      },
    ],
  },
  fr: {
    name: "L'hameçon de Maui",
    text: [
      {
        title: "MAUI EST DE RETOUR!",
        description:
          "Si vous avez un personnage Maui en jeu, vous pouvez utiliser gratuitement la capacité Métamorphose de cet objet.",
      },
      {
        title: "MÉTAMORPHOSE,",
        description:
          "2 — Choisissez entre: • Choisissez un personnage, il gagne Insaisissable jusqu'au début de votre prochain tour. • Choisissez un personnage, il gagne +3 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Amo da Pesca di Maui",
    text: [
      {
        title:
          "È L'ORA DI MAUI! Se hai un personaggio chiamato Maui in gioco, puoi usare gratis l'abilità Mutaforma di questo oggetto.",
      },
      {
        title: "MUTAFORMA, 2",
        description:
          "— Scegli uno: • Un personaggio a tua scelta ottiene Sfuggente fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.) • Un personaggio a tua scelta riceve +3 per questo turno.",
      },
    ],
  },
};
