import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const marshmallowTerrifyingSnowmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Marshmallow",
    version: "Terrifying Snowman",
    text: [
      {
        title: "BEHEMOTH",
        description: "This character gets +1 {S} for each card in your hand.",
      },
    ],
  },
  de: {
    name: "Marshmallow",
    version: "Furchteinflößender Schneemann",
    text: [
      {
        title: "UNGEHEUER",
        description: "Dieser Charakter erhält +1 für jede Karte auf deiner Hand.",
      },
    ],
  },
  fr: {
    name: "Guimauve",
    version: "Terrifiant bonhomme de neige",
    text: [
      {
        title: "MASTODONTE",
        description: "Ce personnage gagne +1 par carte dans votre main.",
      },
    ],
  },
  it: {
    name: "Marshmallow",
    version: "Spaventoso Pupazzo di Neve",
    text: [
      {
        title: "COLOSSO",
        description: "Questo personaggio riceve +1 per ogni carta nella tua mano.",
      },
    ],
  },
};
