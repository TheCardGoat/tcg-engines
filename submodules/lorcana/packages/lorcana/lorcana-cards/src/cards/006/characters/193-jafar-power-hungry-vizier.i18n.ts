import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jafarPowerhungryVizierI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jafar",
    version: "Power-Hungry Vizier",
    text: [
      {
        title: "YOU WILL BE PAID WHEN THE TIME COMES",
        description:
          "During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Dschafar",
    version: "Machthungriger Wesir",
    text: [
      {
        title: "IHR BEKOMMT SCHON, WAS EUCH ZUSTEHT",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, füge einem Charakter deiner Wahl 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Jafar",
    version: "Vizir avide de pouvoir",
    text: [
      {
        title: "TU SERAS PAYÉ LE MOMENT VENU",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, choisissez un personnage et infligez-lui 1 dommage.",
      },
    ],
  },
  it: {
    name: "Jafar",
    version: "Visir Assetato di Potere",
    text: [
      {
        title: "AVRAI QUELLO CHE TI MERITI",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, infliggi 1 danno a un personaggio a tua scelta.",
      },
    ],
  },
};
