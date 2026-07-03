import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const puaPotbelliedBuddyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pua",
    version: "Potbellied Buddy",
    text: [
      {
        title: "ALWAYS THERE",
        description: "When this character is banished, you may shuffle this card into your deck.",
      },
    ],
  },
  de: {
    name: "Pua",
    version: "Hängebauch-Freund",
    text: [
      {
        title: "Immer dabei",
        description:
          "Wenn dieser Charakter verbannt wird, darfst du diese Karte in dein Deck mischen.",
      },
    ],
  },
  fr: {
    name: "Pua",
    version: "Compagnon bedonnant",
    text: [
      {
        title: "Toujours à tes côtés",
        description:
          "Lorsque ce personnage est banni, vous pouvez le remélanger dans votre pioche.",
      },
    ],
  },
  it: {
    name: "Pua",
    version: "Amico Panciuto",
    text: [
      {
        title: "Sempre Presente",
        description:
          "Quando questo personaggio viene esiliato, puoi rimescolare questa carta nel tuo mazzo.",
      },
    ],
  },
};
