import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jimHawkinsStubbornCabinBoyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jim Hawkins",
    version: "Stubborn Cabin Boy",
    text: [
      {
        title: "COME HERE, COME HERE, COME HERE!",
        description:
          "During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn.",
      },
    ],
  },
  de: {
    name: "Jim Hawkins",
    version: "Sturer Schiffsjunge",
    text: [
      {
        title: "Komm her, komm her, komm her!",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, erhält dieser Charakter in diesem Zug <Herausfordern> +2. (Während der Charakter herausfordert, erhält er +2 {S}.)",
      },
    ],
  },
  fr: {
    name: "Jim Hawkins",
    version: "Mousse obstiné",
    text: [
      {
        title: "Reviens, reviens, reviens!",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, ce personnage gagne <Offensif> +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Jim Hawkins",
    version: "Mozzo Cocciuto",
    text: [
      {
        title: "Vieni, vieni, vieni!",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, questo personaggio ottiene <Sfidante> +2 per questo turno. (Riceve +2 {S} mentre sta sfidando.)",
      },
    ],
  },
};
