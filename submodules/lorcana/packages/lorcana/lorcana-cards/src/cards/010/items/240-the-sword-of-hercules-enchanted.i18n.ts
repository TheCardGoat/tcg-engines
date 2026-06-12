import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theSwordOfHerculesEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Sword of Hercules",
    text: [
      {
        title: "MIGHTY HIT",
        description: "When you play this item, banish chosen opposing Deity character.",
      },
      {
        title: "HAND-TO-HAND",
        description:
          "During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Hercules’ Schwert",
    text: [
      {
        title: "MÄCHTIGER TREFFER",
        description:
          "Wenn du diesen Gegenstand ausspielst, verbanne eine gegnerische Gottheit deiner Wahl.",
      },
      {
        title: "MANN GEGEN MANN",
        description:
          "Jedes Mal während deines Zuges, wenn einer deiner Charaktere durch eine Herausforderung einen anderen Charakter verbannt, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "L'épée d'Hercule",
    text: [
      {
        title: "COUP PUISSANT",
        description:
          "Lorsque vous jouez cet objet, choisissez un personnage Dieu adverse et bannissez-le.",
      },
      {
        title: "CORPS-À-CORPS",
        description:
          "Durant votre tour, chaque fois que l'un de vos personnages en bannit un autre via un défi, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "La Spada di Ercole",
    text: [
      {
        title: "COLPO POTENTE",
        description:
          "Quando giochi questo oggetto, esilia un personaggio Divinità avversario a tua scelta.",
      },
      {
        title: "CORPO A CORPO",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi personaggi esilia un altro personaggio in una sfida, ottieni 1 leggenda.",
      },
    ],
  },
};
