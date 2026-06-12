import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const todKnowsAllTheTricksI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tod",
    version: "Knows All the Tricks",
    text: [
      {
        title: "Shift 5 {I}",
      },
      {
        title: "Evasive",
      },
      {
        title: "IMPRESSIVE LEAPS",
        description:
          "Twice during your turn, whenever this character is chosen for an action or an item's ability, you may ready him.",
      },
    ],
  },
  de: {
    name: "Cap",
    version: "Kennt alle Tricks",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "Wendig",
      },
      {
        title: "BEEINDRUCKENDE SPRÜNGE",
        description:
          "Zweimal während deines Zuges, wenn dieser Charakter von einer Aktion oder einem Gegenstand ausgewählt wird, darfst du ihn bereit machen.",
      },
    ],
  },
  fr: {
    name: "Rox",
    version: "A des trucs à lui",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "Insaisissable",
      },
      {
        title: "SAUTS IMPRESSIONNANTS",
        description:
          "Deux fois durant votre tour, lorsque ce personnage est choisi avec une action ou la capacité d'un objet, vous pouvez le redresser.",
      },
    ],
  },
  it: {
    name: "Red",
    version: "Conosce Tutti i Trucchi",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "Sfuggente",
      },
      {
        title: "SALTI ECCEZIONALI",
        description:
          "Due volte durante il tuo turno, ogni volta che questo personaggio viene scelto per un'azione o per l'abilità di un oggetto, puoi prepararlo.",
      },
    ],
  },
};
