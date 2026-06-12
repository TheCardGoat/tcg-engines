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
        title: "UNGEHOBELTER GAST",
        description: "Beschädigte Charaktere können diesen Charakter nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "Ed",
    version: "Fêtard hystérique",
    text: [
      {
        title: "INVITÉ CHAHUTEUR",
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
        title: "OSPITE RUMOROSO I",
        description: "personaggi danneggiati non possono sfidare questo personaggio.",
      },
    ],
  },
};
