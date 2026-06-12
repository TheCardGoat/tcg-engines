import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const annaDiplomaticQueenI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Anna",
    version: "Diplomatic Queen",
    text: [
      {
        title: "ROYAL RESOLUTION",
        description: "When you play this character, you may pay 2 {I} to choose one:",
      },
      {
        title: "• Each opponent chooses and discards a card.",
      },
      {
        title: "• Chosen character gets +2 {S} this turn.",
      },
      {
        title: "• Banish chosen damaged character.",
      },
    ],
  },
  de: {
    name: "Anna",
    version: "Diplomatische Königin",
    text: [
      {
        title: "KÖNIGLICHE ENTSCHEIDUNG",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 2 bezahlen, um eine der Möglichkeiten auszuwählen:",
      },
      {
        title:
          "• Alle gegnerischen Mitspielenden wählen je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
      {
        title: "• Gib einem Charakter deiner Wahl in diesem Zug +2.",
      },
      {
        title: "• Verbanne einen beschädigten Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Anna",
    version: "Reine diplomate",
    text: [
      {
        title: "DÉTERMINATION ROYALE",
        description: "Lorsque vous jouez ce personnage, vous pouvez payer 2, pour choisir entre:",
      },
      {
        title: "• Chaque adversaire choisit une carte de sa main et la défausse.",
      },
      {
        title: "• Choisissez un personnage qui gagne +2 pour le reste de ce tour.",
      },
      {
        title: "• Choisissez un personnage ayant au moins un dommage sur lui et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Anna",
    version: "Regina Diplomatica",
    text: [
      {
        title: "DECISIONE REALE",
        description: "Quando giochi questo personaggio, puoi pagare 2 per scegliere uno:",
      },
      {
        title: "• Ogni avversario sceglie e scarta una carta.",
      },
      {
        title: "• Un personaggio a tua scelta riceve +2 per questo turno.",
      },
      {
        title: "• Esilia un personaggio danneggiato a tua scelta.",
      },
    ],
  },
};
