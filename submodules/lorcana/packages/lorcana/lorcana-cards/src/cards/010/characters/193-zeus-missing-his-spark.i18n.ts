import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const zeusMissingHisSparkI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Zeus",
    version: "Missing His Spark",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "I NEED MORE THUNDERBOLTS!",
        description: "While there's a card under this character, he gets +2 {S} and +2 {W}.",
      },
    ],
  },
  de: {
    name: "Zeus",
    version: "Vermisst seine Blitze",
    text: [
      {
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Mir gehen die Blitze aus",
        description:
          "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +2 {S} und +2 {W}.",
      },
    ],
  },
  fr: {
    name: "Zeus",
    version: "Sans son étincelle",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Donnez-moi plus de foudre!",
        description: "Tant qu'il y a une carte sous ce personnage, il gagne +2 {S} et +2 {W}.",
      },
    ],
  },
  it: {
    name: "Zeus",
    version: "Senza la Sua Scintilla",
    text: [
      {
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Mi Servono Altre Saette, Forza!",
        description:
          "Mentre c'è una carta sotto a questo personaggio, questo riceve +2 {S} e +2 {W}.",
      },
    ],
  },
};
