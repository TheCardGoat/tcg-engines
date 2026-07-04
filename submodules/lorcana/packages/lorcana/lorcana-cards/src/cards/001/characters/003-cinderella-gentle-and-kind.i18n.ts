import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cinderellaGentleAndKindI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cinderella",
    version: "Gentle and Kind",
    text: [
      {
        title: "Singer 5",
      },
      {
        title: "A WONDERFUL DREAM",
        description: "{E} — Remove up to 3 damage from chosen Princess character.",
      },
    ],
  },
  de: {
    name: "Cinderella",
    version: "Behutsam und freundlich",
    text: [
      {
        title: "<Singen> 5 (Die Kosten dieses Charakters gelten als 5 für das Singen von Liedern.)",
      },
      {
        title: "Ein wundervoller Traum",
        description: "{E} — Entferne bis zu 3 Schaden von einer Prinzessin deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "CENDRILLON",
    version: "Douce et charmante",
    text: [
      {
        title:
          "<Mélomane> 5 (Ce personnage est considéré comme ayant un coût de 5 pour chanter des chansons.)",
      },
      {
        title: "UN RÊVE MAGNIFIQUE",
        description:
          "{E} — Choisissez un personnage Princesse et retirez-lui jusqu'à 3 jetons Dommage.",
      },
    ],
  },
  it: {
    name: "Cinderella",
    version: "Gentle and Kind",
    text: [
      {
        title: "<Singer> 5 (This character counts as cost 5 to sing songs.)",
      },
      {
        title: "A Wonderful Dream",
        description: "{E} — Remove up to 3 damage from chosen Princess character.",
      },
    ],
  },
};
