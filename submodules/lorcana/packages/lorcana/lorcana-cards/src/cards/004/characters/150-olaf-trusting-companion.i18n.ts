import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const olafTrustingCompanionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Olaf",
    version: "Trusting Companion",
    text: "Support",
  },
  de: {
    name: "Olaf",
    version: "Vertrauensvoller Begleiter",
    text: "Unterstützen (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Olaf",
    version: "Compagnon confiant",
    text: [
      {
        title: "Soutien",
        description:
          "(Lorsque vous envoyez ce personnage à l'aventure, vous pouvez ajouter sa à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Olaf",
    version: "Compagno Fiducioso",
    text: "Aiutante",
  },
};
