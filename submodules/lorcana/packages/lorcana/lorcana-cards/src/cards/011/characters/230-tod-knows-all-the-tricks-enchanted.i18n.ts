import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const todKnowsAllTheTricksEnchantedI18n: Record<Languages, I18nProperties> = {
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
        title: "<Gestaltwandel> 5 {I}",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Beeindruckende Sprünge",
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
        title: "<Alter> 5 {I}",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "Sauts impressionnants",
        description:
          "Deux fois durant votre tour, lorsque ce personnage est choisi avec une action ou la capacité d'un objet, vous pouvez le redresser.",
      },
    ],
  },
  it: {
    name: "Red",
    version: "Conosce Tutti i Trucchi",
    text: "<Trasformazione> 5 {I}, <Sfuggente> Salti Eccezionali Due volte durante il tuo turno, ogni volta che questo personaggio viene scelto per un'azione o per l'abilità di un oggetto, puoi prepararlo.",
  },
  es: {
    name: "Tod",
    version: "Conoce todos los trucos",
    text: [
      {
        title: "Cambio 5 {I}",
      },
      {
        title: "Evasivo",
      },
      {
        title: "SALTOS IMPRESIONANTES",
        description:
          "Dos veces durante tu turno, cada vez que este personaje sea elegido para una acción o habilidad de un objeto, puedes prepararlo.",
      },
    ],
  },
};
