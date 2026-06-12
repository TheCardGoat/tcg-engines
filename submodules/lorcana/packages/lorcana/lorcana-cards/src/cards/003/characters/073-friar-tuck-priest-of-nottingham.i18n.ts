import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const friarTuckPriestOfNottinghamI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Friar Tuck",
    version: "Priest of Nottingham",
    text: [
      {
        title: "YOU THIEVING SCOUNDREL",
        description:
          "When you play this character, the player or players with the most cards in their hand chooses and discards a card.",
      },
    ],
  },
  de: {
    name: "Bruder Tack",
    version: "Pfarrer von Nottingham",
    text: [
      {
        title: "DU DIEBISCHER SCHURKE",
        description:
          "Wenn du diesen Charakter ausspielst, wählen alle Mitspielenden (auch du), mit den meisten Karten auf der Hand, je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Frère Tuck",
    version: "Prêtre de Nottingham",
    text: [
      {
        title: "IMMONDE COQUIN",
        description:
          "Lorsque vous jouez ce personnage, le joueur ou les joueurs ayant le plus de cartes en main choisissent une carte et la défaussent.",
      },
    ],
  },
  it: {
    name: "Frà Tac",
    version: "Sacerdote di Nottingham",
    text: [
      {
        title: "BRUTTA CANAGLIA DI UN LADRO",
        description:
          "Quando giochi questo personaggio, il giocatore o i giocatori con più carte in mano ne sceglie una e la scarta.",
      },
    ],
  },
};
