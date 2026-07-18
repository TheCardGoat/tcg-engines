import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const unconventionalToolI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Unconventional Tool",
    text: [
      {
        title: "FIXED IN NO TIME",
        description:
          "When this item is banished, you pay 2 {I} less for the next item you play this turn.",
      },
    ],
  },
  de: {
    name: "Unkonventionelles Werkzeug",
    text: [
      {
        title: "Im Handumdrehen repariert",
        description:
          "Wenn dieser Gegenstand verbannt wird, zahlst du 2 {I} weniger für den nächsten Gegenstand, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Outil inhabituel",
    text: [
      {
        title: "Réparé en un clin d'œil",
        description:
          "Lorsque cet objet est banni, le prochain objet que vous jouez ce tour-ci vous coûte 2 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Strumento non Convenzionale",
    text: [
      {
        title: "Aggiustato in Un Momento",
        description:
          "Quando questo oggetto viene esiliato, paga 2 {I} in meno per giocare il tuo prossimo oggetto per questo turno.",
      },
    ],
  },
  es: {
    name: "Herramienta no convencional",
    text: [
      {
        title: "SOLUCIONADO EN NINGÚN TIEMPO",
        description:
          "Cuando este objeto es desterrado, pagas 2 {I} menos por el siguiente objeto que juegues en este turno.",
      },
    ],
  },
};
