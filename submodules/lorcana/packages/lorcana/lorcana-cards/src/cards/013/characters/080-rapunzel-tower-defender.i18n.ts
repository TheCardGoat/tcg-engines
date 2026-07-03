import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rapunzelTowerDefenderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rapunzel",
    version: "Tower Defender",
    text: [
      {
        title: "THE FATE'S DESIGN",
        description:
          "When you play this character, you may choose and discard a card. If you do, return chosen character to their player's hand.",
      },
    ],
  },
  de: {
    name: "Rapunzel",
    version: "Verteidigerin des Turms",
    text: [
      {
        title: "Halt das Schicksal auf",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du eine Karte von deiner Hand auswählen und abwerfen. Wenn du dies tust, schicke einen Charakter deiner Wahl auf die zugehörige Hand zurück.",
      },
    ],
  },
  fr: {
    name: "Raiponce",
    version: "Défenseuse de la tour",
    text: [
      {
        title: "Ce destin impur",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez défausser une carte. Si vous le faites, choisissez un personnage et renvoyez-le dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Rapunzel",
    version: "Protettrice della Torre",
    text: [
      {
        title: "I Piani del Fato",
        description:
          "Quando giochi questo personaggio, puoi scegliere e scartare una carta. Se lo fai, fai riprendere in mano al suo giocatore un personaggio a tua scelta.",
      },
    ],
  },
};
