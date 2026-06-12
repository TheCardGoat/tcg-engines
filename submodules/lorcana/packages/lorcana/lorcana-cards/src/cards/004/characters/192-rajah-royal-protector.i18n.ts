import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rajahRoyalProtectorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rajah",
    version: "Royal Protector",
    text: [
      {
        title: "STEADY GAZE",
        description:
          "While you have no cards in your hand, characters with cost 4 or less can't challenge this character.",
      },
    ],
  },
  de: {
    name: "Radsha",
    version: "Königlicher Beschützer",
    text: [
      {
        title: "WACHSAMER BLICK",
        description:
          "Wenn du keine Karten auf der Hand hast, können Charaktere, die 4 oder weniger kosten, diesen Charakter nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "Rajah",
    version: "Protecteur Royal",
    text: [
      {
        title: "NE QUITTE PAS DES YEUX",
        description:
          "Tant que vous n'avez aucune carte en main, ce personnage ne peut pas être défié par des personnages coûtant 4 ou moins.",
      },
    ],
  },
  it: {
    name: "Rajah",
    version: "Protettore Reale",
    text: [
      {
        title: "SGUARDO FERMO",
        description:
          "Mentre non hai carte in mano, questo personaggio non può essere sfidato da personaggi con costo 4 o inferiore.",
      },
    ],
  },
};
