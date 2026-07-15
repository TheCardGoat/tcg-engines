import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofyGhostOfJacobMarleyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goofy",
    version: "Ghost of Jacob Marley",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "GRAVE OUTCOME",
        description:
          "When this character is banished, each opponent chooses and discards a card for each card that was under him.",
      },
    ],
  },
  de: {
    name: "Goofy",
    version: "Geist von Jacob Marley",
    text: [
      {
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Gravierendes Ende",
        description:
          "Wenn dieser Charakter verbannt wird, wählen alle gegnerischen Mitspielenden für jede Karte, die unter diesem Charakter lag, je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Dingo",
    version: "Fantôme de Jacob Marley",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Conséquence sépulcrale",
        description:
          "Lorsque ce personnage est banni, chaque adversaire défausse une carte pour chaque carte sous ce personnage.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Fantasma di Jacob Marley",
    text: [
      {
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Conseguenza Funerea",
        description:
          "Quando questo personaggio viene esiliato, ogni avversario sceglie e scarta una carta per ogni carta che era sotto di esso.",
      },
    ],
  },
};
