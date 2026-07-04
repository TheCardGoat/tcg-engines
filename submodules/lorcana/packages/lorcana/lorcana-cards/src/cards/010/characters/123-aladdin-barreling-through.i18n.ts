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
        title:
          "<Stärken> 1 {I} (Einmal während deines Zuges darfst du 1 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "<Impulsiv>",
      },
      {
        title: "Nur die Kräftigen",
        description:
          'Solange dieser Charakter mindestens eine Karte unter sich hat, erhalten deine Charaktere mit <Impulsiv> "{E} — Sammle 1 Legende".',
      },
    ],
  },
  fr: {
    name: "Aladdin",
    version: "À toute allure",
    text: [
      {
        title:
          "<Boost> 1 {I} (Une fois durant votre tour, vous pouvez payer 1 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "<Combattant>",
      },
      {
        title: "Seuls les audacieux",
        description:
          'Tant qu\'il y a une carte sous ce personnage, vos personnages avec <Combattant> gagnent "{E} — Gagnez 1 éclat de Lore."',
      },
    ],
  },
  it: {
    name: "Aladdin",
    version: "Alla Carica",
    text: [
      {
        title:
          "<Potenziamento> 1 {I} (Una volta durante il tuo turno, puoi pagare 1 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "<Attaccabrighe>",
      },
      {
        title: "Solo i Coraggiosi",
        description:
          'Mentre c\'è una carta sotto a questo personaggio, i tuoi personaggi con <Attaccabrighe> ottengono "{E} — Ottieni 1 leggenda".',
      },
    ],
  },
};
