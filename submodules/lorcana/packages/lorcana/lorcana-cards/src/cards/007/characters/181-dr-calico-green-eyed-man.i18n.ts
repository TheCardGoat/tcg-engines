import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const drCalicoGreeneyedManI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dr. Calico",
    version: "Green-Eyed Man",
    text: [
      {
        title: "YOU'RE BEGINNING TO IRK ME",
        description: "While this character has no damage, he gains Resist +2.",
      },
    ],
  },
  de: {
    name: "Dr. Calico",
    version: "Grünäugiger Mann",
    text: [
      {
        title: "So langsam nerven Sie mich",
        description:
          "Solange dieser Charakter unbeschädigt ist, erhält er <Robust> +2. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Dr. Calico",
    version: "L'homme à l'œil vert",
    text: [
      {
        title: "Vous commencez à m'indisposer",
        description: "Tant que ce personnage n'a aucun dommage, il gagne <Résistance> +2.",
      },
    ],
  },
  it: {
    name: "Dr. Calico",
    version: "Uomo dall'Occhio Verde",
    text: [
      {
        title: "Così Mi Farà Irritare",
        description: "Mentre questo personaggio non ha danno, ottiene <Resistere> +2.",
      },
    ],
  },
};
