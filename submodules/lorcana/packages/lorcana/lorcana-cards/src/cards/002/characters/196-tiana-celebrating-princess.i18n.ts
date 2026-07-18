import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tianaCelebratingPrincessI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tiana",
    version: "Celebrating Princess",
    text: [
      {
        title: "Resist +2",
      },
      {
        title: "WHAT YOU GIVE IS WHAT YOU GET",
        description:
          "While this character is exerted and you have no cards in your hand, opponents can't play actions.",
      },
    ],
  },
  de: {
    name: "Tiana",
    version: "Festliche Prinzessin",
    text: [
      {
        title:
          "<Robust> +2 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
      {
        title: "Was du gibst ist was du kriegst",
        description:
          "Solange dieser Charakter erschöpft ist und du keine Karten auf der Hand hast, können gegnerische Mitspielende keine Aktionen ausspielen.",
      },
    ],
  },
  fr: {
    name: "Tiana",
    version: "Princesse en fête",
    text: [
      {
        title: "<Résistance> +2",
      },
      {
        title: "Le succès dépend de toi",
        description:
          "Tant que ce personnage est épuisé et que vous n'avez aucune carte en main, vos adversaires ne peuvent pas jouer de cartes Action.",
      },
    ],
  },
  it: {
    name: "Tiana",
    version: "Celebrating Princess",
    text: [
      {
        title: "<Resist> +2 (Damage dealt to this character is reduced by 2.)",
      },
      {
        title: "What You Give is What You Get",
        description:
          "While this character is exerted and you have no cards in your hand, opponents can't play actions.",
      },
    ],
  },
  es: {
    name: "Tiana",
    version: "Celebrando a la princesa",
    text: [
      {
        title: "Resistir +2",
      },
      {
        title: "LO QUE DAS ES LO QUE RECIBES",
        description:
          "Mientras este personaje esté ejercido y no tengas cartas en tu mano, los oponentes no pueden realizar acciones.",
      },
    ],
  },
};
