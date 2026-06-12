import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beastFrustratedDesignerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Beast",
    version: "Frustrated Designer",
    text: [
      {
        title: "I'VE HAD IT!",
        description: "{E}, 2 {I}, Banish 2 of your items — Deal 5 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Biest",
    version: "Frustrierter Designer",
    text: [
      {
        title: "ICH HAB' GENUG!, 2,",
        description:
          "Verbanne 2 deiner Gegenstände — Füge einem Charakter deiner Wahl 5 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "La Bête",
    version: "Concepteur frustré",
    text: [
      {
        title: "J'EN AI ASSEZ!, 2,",
        description:
          "Bannissez 2 de vos objets — Choisissez un personnage et infligez-lui 5 dommages.",
      },
    ],
  },
  it: {
    name: "La Bestia",
    version: "Inventore Frustrato",
    text: [
      {
        title: "NE HO ABBASTANZA!, 2,",
        description: "esilia 2 tuoi oggetti — Infliggi 5 danni a un personaggio a tua scelta.",
      },
    ],
  },
};
