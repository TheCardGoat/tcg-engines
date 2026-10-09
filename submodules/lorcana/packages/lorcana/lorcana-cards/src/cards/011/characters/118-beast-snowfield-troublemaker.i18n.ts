import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beastSnowfieldTroublemakerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Beast",
    version: "Snowfield Troublemaker",
    text: [
      {
        title: "Rush",
      },
      {
        title: "DYNAMIC MANEUVER",
        description:
          "Whenever this character challenges, if he's at a location, he takes no damage from the challenge.",
      },
    ],
  },
  de: {
    name: "Biest",
    version: "Schneefeld-Unruhestifter",
    text: [
      {
        title: "<Rasant>",
      },
      {
        title: "Dynamisches Manöver",
        description:
          "Jedes Mal, wenn dieser Charakter herausfordert, falls er an einem Ort ist, erhält er keinen Schaden durch die Herausforderung.",
      },
    ],
  },
  fr: {
    name: "La Bête",
    version: "Trublion du champ de neige",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "Manœuvre dynamique",
        description:
          "Chaque fois que ce personnage défie, s'il est sur un lieu, il ne subit aucun dommage lors de ce défi.",
      },
    ],
  },
  it: {
    name: "La Bestia",
    version: "Combinaguai del Campo Innevato",
    text: [
      {
        title: "<Lesto> (Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
      {
        title: "Manovra Dinamica",
        description:
          "Ogni volta che questo personaggio sfida, se si trova in un luogo, non subisce danno dalla sfida.",
      },
    ],
  },
  es: {
    name: "Bestia",
    version: "Alborotador del campo nevado",
    text: [
      {
        title: "Correr",
      },
      {
        title: "MANIOBRA DINÁMICA",
        description:
          "Siempre que este personaje desafía, si está en un lugar, no recibe daño del desafío.",
      },
    ],
  },
};
