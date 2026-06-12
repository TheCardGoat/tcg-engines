import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gizmoduckDuckburgDefenderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gizmoduck",
    version: "Duckburg Defender",
    text: [
      {
        title: "<Resist> +1",
      },
      {
        title: "Fail-Safe",
        description:
          "While you have no cards in your hand, opponents can't play actions with cost 4 or more.",
      },
    ],
  },
  de: {
    name: "Krachbumm-Ente",
    version: "Verteidiger von Entenhausen",
    text: [
      {
        title:
          "<Robust> +1 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
      {
        title: "Ausfallsicher",
        description:
          "Solange du keine Karten auf der Hand hast, können gegnerische Mitspielende keine Aktionen ausspielen, die 4 oder mehr kosten.",
      },
    ],
  },
  fr: {
    name: "Robotik",
    version: "Défenseur de Donaldville",
    text: [
      {
        title: "<Résistance> +1",
      },
      {
        title: "Sécurité intégrée",
        description:
          "Tant que vous n'avez aucune carte en main, vos adversaires ne peuvent pas jouer d'action coûtant 4 ou plus.",
      },
    ],
  },
  it: {
    name: "Robopap",
    version: "Difensore di Paperopoli",
    text: [
      {
        title: "<Resistere> +1",
      },
      {
        title: "Misura di Sicurezza",
        description:
          "Mentre non hai carte in mano, gli avversari non possono giocare azioni con costo 4 o superiore.",
      },
    ],
  },
};
