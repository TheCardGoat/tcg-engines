import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const clarabelleClumsyGuestI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Clarabelle",
    version: "Clumsy Guest",
    text: [
      {
        title: "BUTTERFINGERS",
        description: "When you play this character, you may pay 2 {I} to banish chosen item.",
      },
    ],
  },
  de: {
    name: "Klarabella",
    version: "Tollpatschiger Gast",
    text: [
      {
        title: "BUTTERFINGER",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 2 bezahlen, um einen Gegenstand deiner Wahl zu verbannen.",
      },
    ],
  },
  fr: {
    name: "Clarabelle",
    version: "Invitée maladroite",
    text: [
      {
        title: "DEUX MAINS GAUCHES",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez payer 2 pour choisir un objet et le bannir.",
      },
    ],
  },
  it: {
    name: "Clarabella",
    version: "Ospite Pasticciona",
    text: [
      {
        title: "MANI DI PASTA FROLLA",
        description:
          "Quando giochi questo personaggio, puoi pagare 2 per esiliare un oggetto a tua scelta.",
      },
    ],
  },
};
