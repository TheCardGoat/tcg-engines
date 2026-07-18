import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rafikiMysticalFighterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rafiki",
    version: "Mystical Fighter",
    text: [
      {
        title: "Challenger +3",
      },
      {
        title: "ANCIENT SKILLS",
        description:
          "Whenever he challenges a Hyena character, this character takes no damage from the challenge.",
      },
    ],
  },
  de: {
    name: "Rafiki",
    version: "Mystischer Kämpfer",
    text: [
      {
        title: "<Herausfordern> +3 (Während dieser Charakter herausfordert, erhält er +3 {S}.)",
      },
      {
        title: "Uralte Kenntnisse",
        description:
          "Dieser Charakter erhält keinen Schaden durch Herausforderungen, während er eine Hyäne herausfordert.",
      },
    ],
  },
  fr: {
    name: "Rafiki",
    version: "Combattant mystique",
    text: [
      {
        title: "<Offensif> +3",
      },
      {
        title: "Talent Ancestral",
        description:
          "Lorsque ce personnage défie un personnage Hyène, il ne subit aucun dommage pour ce défi.",
      },
    ],
  },
  it: {
    name: "Rafiki",
    version: "Combattente Mistico",
    text: [
      {
        title: "<Sfidante> +3",
      },
      {
        title: "Antiche Abilità",
        description:
          "Ogni volta che sfida un personaggio Iena, questo personaggio non subisce danni dalla sfida.",
      },
    ],
  },
  es: {
    name: "Rafiki",
    version: "Luchador místico",
    text: [
      {
        title: "Retador +3",
      },
      {
        title: "HABILIDADES ANTIGUAS",
        description:
          "Siempre que desafía a un personaje de Hiena, este personaje no sufre ningún daño por el desafío.",
      },
    ],
  },
};
