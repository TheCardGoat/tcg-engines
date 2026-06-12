import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const steelCoilI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Steel Coil",
    text: [
      {
        title: "METALLIC FLOW",
        description:
          "During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.",
      },
    ],
  },
  de: {
    name: "Stahl-Reif",
    text: [
      {
        title: "METALLISCHER FLUSS",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, darfst du 1 Karte ziehen. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
    ],
  },
  fr: {
    name: "Spirale d’acier",
    text: [
      {
        title: "FLUIDE MÉTALLIQUE",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, vous pouvez piocher une carte puis en défausser une.",
      },
    ],
  },
  it: {
    name: "Spira d'Acciaio",
    text: [
      {
        title: "FLUSSO METALLICO",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, puoi pescare una carta, poi scegli e scarta una carta.",
      },
    ],
  },
};
