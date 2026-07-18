import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const megaraSecretKeeperEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Megara",
    version: "Secret Keeper",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "I'LL BE FINE",
        description:
          'While there\'s a card under this character, she gets +1 {L} and gains "Whenever this character is challenged, each opponent chooses and discards a card."',
      },
    ],
  },
  de: {
    name: "Meg",
    version: "Geheimnishüterin",
    text: [
      {
        title:
          "<Stärken> 1 {I} (Einmal während deines Zuges darfst du 1 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Es wird schon wieder",
        description:
          'Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +1 {L} und "Jedes Mal, wenn dieser Charakter herausgefordert wird, wählen alle gegnerischen Mitspielenden je 1 Karte aus ihrer Hand und werfen sie ab".',
      },
    ],
  },
  fr: {
    name: "Mégara",
    version: "Gardienne du secret",
    text: [
      {
        title:
          "<Boost> 1 {I} (Une fois durant votre tour, vous pouvez payer 1 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Oh, je survivrai",
        description:
          'Tant qu\'il y a une carte sous ce personnage, il gagne +1 {L} et "Chaque fois que ce personnage est défié, chaque adversaire défausse une carte."',
      },
    ],
  },
  it: {
    name: "Megara",
    version: "Custode dei Segreti",
    text: [
      {
        title:
          "<Potenziamento> 1 {I} (Una volta durante il tuo turno, puoi pagare 1 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Sto Benissimo",
        description:
          'Mentre c\'è una carta sotto a questo personaggio, questo riceve +1 {L} e ottiene "Ogni volta che questo personaggio viene sfidato, ogni avversario sceglie e scarta una carta".',
      },
    ],
  },
  es: {
    name: "Mégara",
    version: "Guardián secreto",
    text: [
      {
        title: "Impulsar 1 {I}",
      },
      {
        title: "Estaré bien",
        description:
          'Mientras haya una carta debajo de este personaje, ella obtiene +1 {L} y gana "Siempre que este personaje es desafiado, cada oponente elige y descarta una carta".',
      },
    ],
  },
};
