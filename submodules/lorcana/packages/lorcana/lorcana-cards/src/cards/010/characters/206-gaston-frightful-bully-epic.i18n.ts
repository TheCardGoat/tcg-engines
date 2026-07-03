import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gastonFrightfulBullyEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gaston",
    version: "Frightful Bully",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "TOP THAT!",
        description:
          "Whenever this character quests, if there's a card under him, chosen opposing character can't challenge and must quest if able during their next turn.",
      },
    ],
  },
  de: {
    name: "Gaston",
    version: "Schrecklicher Tyrann",
    text: [
      {
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Mach das erst mal nach!",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls er mindestens eine Karte unter sich hat, wähle einen gegnerischen Charakter. Jener kann in seinem nächsten Zug nicht herausfordern und muss erkunden, wenn möglich.",
      },
    ],
  },
  fr: {
    name: "Gaston",
    version: "Brute terrifiante",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Fais mieux que ça!",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, s'il y a une carte sous lui, choisissez un personnage adverse qui ne peut pas défier et doit être envoyé à l'aventure durant son prochain tour, s'il le peut.",
      },
    ],
  },
  it: {
    name: "Gaston",
    version: "Bullo Spaventoso",
    text: [
      {
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Batti Questo!",
        description:
          "Ogni volta che questo personaggio va all'avventura, se c'è una carta sotto di esso, un personaggio avversario a tua scelta non può sfidare e deve andare all'avventura durante il suo prossimo turno, se possibile.",
      },
    ],
  },
};
