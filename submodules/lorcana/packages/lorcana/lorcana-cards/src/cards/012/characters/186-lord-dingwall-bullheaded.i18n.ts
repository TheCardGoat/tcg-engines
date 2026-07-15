import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lordDingwallBullheadedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lord Dingwall",
    version: "Bullheaded",
    text: [
      {
        title: "FIGHTIN' TALK",
        description:
          "This character may enter play exerted to give chosen character Challenger +3 this turn. (They get +3 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Lord Dingwall",
    version: "Starrköpfig",
    text: [
      {
        title: "Kampfansage",
        description:
          "Du darfst diesen Charakter erschöpft ausspielen, um einem Charakter deiner Wahl in diesem Zug <Herausfordern> +3 zu geben. (Während sie herausfordern, erhalten sie +3 {S}.)",
      },
    ],
  },
  fr: {
    name: "Seigneur Dingwall",
    version: "Têtu comme une mule",
    text: [
      {
        title: "Discours belliqueux",
        description:
          "Ce personnage peut entrer en jeu épuisé pour donner <Offensif> +3 à un personnage de votre choix pour le reste de ce tour. (Lorsqu'il défie, ce personnage-là gagne +3 {S}.)",
      },
    ],
  },
  it: {
    name: "Lord Dingwall",
    version: "Cocciuto",
    text: [
      {
        title: "Parole di Sfida",
        description:
          "Questo personaggio può entrare in gioco impegnato per dare a un personaggio a tua scelta <Sfidante> +3 per questo turno. (Riceve +3 {S} mentre sta sfidando.)",
      },
    ],
  },
};
