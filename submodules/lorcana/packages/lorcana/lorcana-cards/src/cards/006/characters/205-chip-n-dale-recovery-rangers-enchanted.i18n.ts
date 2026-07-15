import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chipNDaleRecoveryRangersEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chip 'n' Dale",
    version: "Recovery Rangers",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "(This character counts as being named both Chip and Dale.)",
      },
      {
        title: "SEARCH AND RESCUE",
        description:
          "During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Chip und Chap",
    version: "Ritter der Rückgewinnung",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Chip-Charaktere oder einen deiner Chap-Charaktere auszuspielen.)",
      },
      {
        title: "(Der Name dieses Charakters gilt sowohl als Chip wie auch als Chap)",
      },
      {
        title: "Suchen und Retten",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, darfst du eine Charakterkarte aus deinem Ablagestapel zurück auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Tic et Tac",
    version: "Rangers-sauveteurs",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Tic ou Tac.)",
      },
      {
        title: "(Ce personnage compte à la fois comme un personnage Tic et un personnage Tac.)",
      },
      {
        title: "À la rescousse",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, vous pouvez renvoyer une carte Personnage de votre défausse dans votre main.",
      },
    ],
  },
  it: {
    name: "Cip e Ciop",
    version: "Agenti di Recupero",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Cip o Ciop.)",
      },
      {
        title: "(Questo personaggio conta come se si chiamasse sia Cip che Ciop.)",
      },
      {
        title: "Ricerca e Soccorso",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, puoi riprendere in mano una carta personaggio dai tuoi scarti.",
      },
    ],
  },
};
