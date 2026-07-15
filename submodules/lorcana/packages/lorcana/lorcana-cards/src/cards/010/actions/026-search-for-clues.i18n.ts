import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const searchForCluesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Search for Clues",
    text: "The player or players with the most cards in their hands choose and discard 2 cards. If you have a Detective character in play, gain 1 lore.",
  },
  de: {
    name: "Spurensuche",
    text: [
      {
        title: "Alle Mitspielenden",
        description:
          "(auch du) mit den meisten Karten auf der Hand wählen je 2 Karten aus ihrer Hand und werfen sie ab. Wenn du mindestens einen Detektiv im Spiel hast, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Rechercher des indices",
    text: "Le joueur ou les joueurs ayant le plus de cartes en main défaussent chacun 2 cartes. Si vous avez un personnage Détective en jeu, gagnez 1 éclat de Lore.",
  },
  it: {
    name: "Cercare Indizi",
    text: "Il giocatore o i giocatori con più carte in mano scelgono e scartano 2 carte. Se hai in gioco un personaggio Detective, ottieni 1 leggenda.",
  },
};
