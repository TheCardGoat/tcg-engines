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
        title: "Stärken 1",
      },
      {
        title: "ES WIRD SCHON WIEDER",
        description:
          'Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +1 und "Jedes Mal, wenn dieser Charakter herausgefordert wird, wählen alle gegnerischen Mitspielenden je 1 Karte aus ihrer Hand und werfen sie ab".',
      },
    ],
  },
  fr: {
    name: "Mégara",
    version: "Gardienne du secret",
    text: [
      {
        title: "Boost 1",
      },
      {
        title: "OH, JE SURVIVRAI",
        description:
          'Tant qu\'il y a une carte sous ce personnage, il gagne +1 et "Chaque fois que ce personnage est défié, chaque adversaire défausse une carte."',
      },
    ],
  },
  it: {
    name: "Megara",
    version: "Custode dei Segreti",
    text: [
      {
        title: "Potenziamento 1",
      },
      {
        title: "STO BENISSIMO",
        description:
          'Mentre c\'è una carta sotto a questo personaggio, questo riceve +1 e ottiene "Ogni volta che questo personaggio viene sfidato, ogni avversario sceglie e scarta una carta".',
      },
    ],
  },
};
