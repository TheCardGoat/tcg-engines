import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theTroubadourMusicalNarratorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Troubadour",
    version: "Musical Narrator",
    text: [
      {
        title: "Resist +1",
      },
      {
        title: "Singer 4",
      },
    ],
  },
  de: {
    name: "Der Troubadour",
    version: "Musikalischer Erzähler",
    text: [
      {
        title:
          "<Robust> +1 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
      {
        title: "<Singen> 4 (Die Kosten dieses Charakters gelten als 4 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "Le Troubadour",
    version: "Narrateur-musicien",
    text: [
      {
        title: "<Résistance> +1",
      },
      {
        title:
          "<Mélomane> 4 (Ce personnage est considéré comme ayant un coût de 4 pour chanter des chansons.)",
      },
    ],
  },
  it: {
    name: "Il Trovatore",
    version: "Narratore Musicante",
    text: [
      {
        title: "<Resistere> +1",
      },
      {
        title: "<Melodioso> 4",
      },
    ],
  },
};
