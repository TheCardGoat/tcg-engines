import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hydraDeadlySerpentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hydra",
    version: "Deadly Serpent",
    text: [
      {
        title: "WATCH THE TEETH",
        description:
          "Whenever this character is dealt damage, deal that much damage to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Hydra",
    version: "Tödliche Schlange",
    text: [
      {
        title: "Vorsicht Zähne!",
        description:
          "Jedes Mal, wenn dieser Charakter Schaden erhält, füge einem gegnerischen Charakter deiner Wahl genauso viel Schaden zu.",
      },
    ],
  },
  fr: {
    name: "L'Hydre",
    version: "Serpent mortel",
    text: [
      {
        title: "Attention aux dents",
        description:
          "Chaque fois que ce personnage subit des dommages, choisissez un personnage adverse et infligez-lui le même nombre de dommages.",
      },
    ],
  },
  it: {
    name: "Idra",
    version: "Serpente Letale",
    text: [
      {
        title: "Attento ai Denti",
        description:
          "Ogni volta che questo personaggio subisce danno, infliggine lo stesso ammontare a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
