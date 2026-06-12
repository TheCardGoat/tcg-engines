import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const boomerHasTheBeakI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Boomer",
    version: "Has the Beak",
    text: [
      {
        title: "SPOTTED HIM!",
        description: "When you play this character, you may exert chosen damaged character.",
      },
    ],
  },
  de: {
    name: "Bumer",
    version: "Der mit dem Schnabel",
    text: [
      {
        title: "HAB IHN GEFUNDEN!",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen beschädigten Charakter deiner Wahl erschöpfen.",
      },
    ],
  },
  fr: {
    name: "Piqueur",
    version: "A le bec",
    text: [
      {
        title: "REPÉRÉ!",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage ayant au moins un dommage et l'épuiser.",
      },
    ],
  },
  it: {
    name: "Sbuccia",
    version: "Quello col Becco",
    text: [
      {
        title: "L'HO TROVATO!",
        description:
          "Quando giochi questo personaggio, puoi impegnare un personaggio danneggiato a tua scelta.",
      },
    ],
  },
};
