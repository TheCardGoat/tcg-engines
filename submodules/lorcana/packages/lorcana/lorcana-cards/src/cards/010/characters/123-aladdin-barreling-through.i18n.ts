import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aladdinBarrelingThroughI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aladdin",
    version: "Barreling Through",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "Reckless",
      },
      {
        title: "ONLY THE BOLD",
        description:
          'While there\'s a card under this character, your characters with Reckless gain "{E} — Gain 1 lore."',
      },
    ],
  },
  de: {
    name: "Aladdin",
    version: "Volle Kraft voraus",
    text: [
      {
        title: "Stärken 1",
      },
      {
        title: "Impulsiv",
      },
      {
        title: "NUR DIE",
        description:
          'KRÄFTIGEN Solange dieser Charakter mindestens eine Karte unter sich hat, erhalten deine Charaktere mit Impulsiv " — Sammle 1 Legende".',
      },
    ],
  },
  fr: {
    name: "Aladdin",
    version: "À toute allure",
    text: [
      {
        title: "Boost 1",
      },
      {
        title: "Combattant",
      },
      {
        title: "SEULS LES AUDACIEUX",
        description:
          'Tant qu\'il y a une carte sous ce personnage, vos personnages avec Combattant gagnent " — Gagnez 1 éclat de Lore."',
      },
    ],
  },
  it: {
    name: "Aladdin",
    version: "Alla Carica",
    text: [
      {
        title: "Potenziamento 1",
      },
      {
        title: "Attaccabrighe",
      },
      {
        title: "SOLO I CORAGGIOSI",
        description:
          'Mentre c\'è una carta sotto a questo personaggio, i tuoi personaggi con Attaccabrighe ottengono " — Ottieni 1 leggenda".',
      },
    ],
  },
};
