import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const infrapinkUltraScanSpecsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Infra-Pink Ultra Scan Specs",
    text: [
      {
        title: "DETECTING EVIDENCE",
        description: "When you play this item, draw a card, then choose and discard a card.",
      },
      {
        title: "FOLLOW THE CLUES",
        description:
          "Banish this item — Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
      },
    ],
  },
  de: {
    name: "Infra-Rosa-Nachtsicht-Fernglas",
    text: [
      {
        title: "Beweise aufspüren",
        description:
          "Wenn du diesen Gegenstand ausspielst, ziehe 1 Karte. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
      {
        title: "Folge den Hinweisen",
        description:
          "Verbanne diesen Gegenstand — Ein Charakter deiner Wahl erhält in diesem Zug <Alarmiert>. (Der Charakter kann herausfordern, als hätte er Wendig.)",
      },
    ],
  },
  fr: {
    name: "Jumelles de théâtre infra-rose",
    text: [
      {
        title: "Détecter les preuves",
        description: "Lorsque vous jouez cet objet, piochez une carte puis défaussez une carte.",
      },
      {
        title: "Suivre les indices",
        description:
          "Bannissez cet objet — Choisissez un personnage qui gagne <Agilité> pour le reste de ce tour. (Il peut défier comme s'il avait Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Ultra Occhiali a Raggi Infrarosa",
    text: [
      {
        title: "Trovare Prove",
        description:
          "Quando giochi questo oggetto, pesca una carta, poi scegli e scarta una carta.",
      },
      {
        title: "Seguire gli Indizi",
        description:
          "Esilia questo oggetto — Un personaggio a tua scelta ottiene <Vigile> per questo turno. (Può sfidare come se avesse Sfuggente.)",
      },
    ],
  },
};
