import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const herculesBabyDemigodI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hercules",
    version: "Baby Demigod",
    text: [
      {
        title: "Ward",
      },
      {
        title: "STRONG LIKE HIS DAD 3",
        description: "{I} — Deal 1 damage to chosen damaged character.",
      },
    ],
  },
  de: {
    name: "Hercules",
    version: "Baby-Halbgott",
    text: [
      {
        title: "<Behütet>",
      },
      {
        title: "Stark, wie sein Vater",
        description: "3 {I} — Füge einem beschädigten Charakter deiner Wahl 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Hercule",
    version: "Bébé demi-dieu",
    text: [
      {
        title: "<Hors d'atteinte>",
      },
      {
        title: "Fort comme son père",
        description: "3 {I} — Infligez 1 dommage à un personnage ayant au moins 1 dommage.",
      },
    ],
  },
  it: {
    name: "Ercole",
    version: "Semidio Bambino",
    text: [
      {
        title: "<Protetto>",
      },
      {
        title: "Forte, Come il suo Papà",
        description: "3 {I} — Infliggi 1 danno a un personaggio danneggiato a tua scelta.",
      },
    ],
  },
  es: {
    name: "Hércules",
    version: "Bebé semidiós",
    text: [
      {
        title: "Pabellón",
      },
      {
        title: "FUERTE COMO SU PAPÁ 3",
        description: "{I}: inflige 1 daño al personaje dañado elegido.",
      },
    ],
  },
};
