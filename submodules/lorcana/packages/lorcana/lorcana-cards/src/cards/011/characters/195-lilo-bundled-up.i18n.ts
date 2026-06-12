import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const liloBundledUpI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lilo",
    version: "Bundled Up",
    text: [
      {
        title: "EXTRA LAYERS",
        description:
          "During each opponent's turn, the first time this character would take damage, she takes no damage instead.",
      },
    ],
  },
  de: {
    name: "Lilo",
    version: "Gut angezogen",
    text: [
      {
        title: "EXTRASCHICHTEN",
        description:
          "Jedes erste Mal, wenn dieser Charakter im Zug einer gegnerischen Person Schaden erhalten würde, erhält er stattdessen keinen Schaden.",
      },
    ],
  },
  fr: {
    name: "Lilo",
    version: "Bien emmitouflée",
    text: [
      {
        title: "EXTRA COUCHES",
        description:
          "Durant le tour de chaque adversaire, la première fois que ce personnage doit subir des dommages, il n'en subit aucun à la place.",
      },
    ],
  },
  it: {
    name: "Lilo",
    version: "Infagottata",
    text: [
      {
        title: "STRATI AGGIUNTIVI",
        description:
          "Durante il turno di ogni avversario, la prima volta che questo personaggio subirebbe danni, non subisce invece alcun danno.",
      },
    ],
  },
};
