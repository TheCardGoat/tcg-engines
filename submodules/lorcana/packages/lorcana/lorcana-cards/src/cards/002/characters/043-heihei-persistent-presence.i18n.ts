import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const heiheiPersistentPresenceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "HeiHei",
    version: "Persistent Presence",
    text: [
      {
        title: "HE'S BACK!",
        description:
          "When this character is banished in a challenge, return this card to your hand.",
      },
    ],
  },
  de: {
    name: "HeiHei",
    version: "Wiederkehrende Erscheinung",
    text: [
      {
        title: "ER IST ZURÜCK!",
        description:
          "Wenn dieser Charakter durch eine Herausforderung verbannt wird, nimm ihn zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Heihei",
    version: "Volatile tenace",
    text: [
      {
        title: "IL EST DE RETOUR",
        description: "Lorsque ce personnage est banni via un défi, renvoyez-le dans votre main.",
      },
    ],
  },
  it: {
    name: "Heihei",
    version: "Presenza Persistente",
    text: [
      {
        title: "È TORNATO!",
        description:
          "Quando questo personaggio viene esiliato in una sfida, riprendi in mano questa carta.",
      },
    ],
  },
};
