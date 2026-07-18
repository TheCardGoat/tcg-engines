import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const edHystericalPartygoerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ed",
    version: "Hysterical Partygoer",
    text: [
      {
        title: "ROWDY GUEST",
        description: "Damaged characters can't challenge this character.",
      },
    ],
  },
  de: {
    name: "Ed",
    version: "Hysterischer Partygast",
    text: [
      {
        title: "Ungehobelter Gast",
        description: "Beschädigte Charaktere können diesen Charakter nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "Ed",
    version: "Fêtard hystérique",
    text: [
      {
        title: "Invité chahuteur",
        description:
          "Ce personnage ne peut pas être défié par des personnages ayant au moins un dommage sur eux.",
      },
    ],
  },
  it: {
    name: "Ed",
    version: "Festaiolo Svalvolato",
    text: [
      {
        title: "Ospite Rumoroso",
        description: "I personaggi danneggiati non possono sfidare questo personaggio.",
      },
    ],
  },
  es: {
    name: "Ed",
    version: "Fiestero histérico",
    text: [
      {
        title: "INVITADO RUIDOSO",
        description: "Los personajes dañados no pueden desafiar a este personaje.",
      },
    ],
  },
};
