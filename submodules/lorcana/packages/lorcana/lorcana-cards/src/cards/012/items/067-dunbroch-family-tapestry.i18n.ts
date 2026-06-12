import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dunbrochFamilyTapestryI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "DunBroch Family Tapestry",
    text: [
      {
        title: "TORN APART",
        description: "This item enters play exerted.",
      },
      {
        title: "MEND THE BOND",
        description:
          "{E}, Banish this item — Each player shuffles all character cards from their discard into their deck.",
      },
    ],
  },
  de: {
    name: "DunBroch-Familien-Wandteppich",
    text: [
      {
        title: "Zerrissen",
        description: "Dieser Gegenstand kommt erschöpft ins Spiel.",
      },
      {
        title: "Das Band wiederherstellen",
        description:
          "{E}, Verbanne diesen Gegenstand — Alle Mitspielenden (auch du) mischen alle Charakterkarten aus ihrem Ablagestapel zurück in ihr Deck.",
      },
    ],
  },
  fr: {
    name: "Tapisserie familiale de DunBroch",
    text: [
      {
        title: "Déchirée",
        description: "Cet objet entre en jeu épuisé.",
      },
      {
        title: "Répare le mal",
        description:
          "{E}, Bannissez cet objet — Chaque joueur mélange dans sa pioche toutes les cartes Personnage de sa défausse.",
      },
    ],
  },
  it: {
    name: "Arazzo della Famiglia DunBroch",
    text: [
      {
        title: "Strappato",
        description: "Questo oggetto entra in gioco impegnato.",
      },
      {
        title: "Riparare lo Strappo",
        description:
          "{E}, esilia questo oggetto — Ogni giocatore mescola tutte le carte personaggio dai suoi scarti nel suo mazzo.",
      },
    ],
  },
};
