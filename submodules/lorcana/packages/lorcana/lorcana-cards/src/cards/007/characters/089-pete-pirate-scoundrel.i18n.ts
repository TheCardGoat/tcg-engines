import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const petePirateScoundrelI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pete",
    version: "Pirate Scoundrel",
    text: [
      {
        title: "PILFER AND PLUNDER",
        description: "Whenever you play an action that isn't a song, you may banish chosen item.",
      },
    ],
  },
  de: {
    name: "Kater Karlo",
    version: "Piraten-Schurke",
    text: [
      {
        title: "Stehlen und Plündern",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, die kein Lied ist, darfst du einen Gegenstand deiner Wahl verbannen.",
      },
    ],
  },
  fr: {
    name: "Pat",
    version: "Crapule de pirate",
    text: [
      {
        title: "Voler et piller",
        description:
          "Chaque fois que vous jouez une action qui n'est pas une chanson, vous pouvez choisir un objet et le bannir.",
      },
    ],
  },
  it: {
    name: "Gambadilegno",
    version: "Canaglia Pirata",
    text: [
      {
        title: "Sgraffignare e Saccheggiare",
        description:
          "Ogni volta che giochi un'azione che non è una canzone, puoi esiliare un oggetto a tua scelta.",
      },
    ],
  },
};
