import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const isabelaMadrigalSuchALovelyVoiceEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Isabela Madrigal",
    version: "Such a Lovely Voice",
    text: [
      {
        title: "<Singer> 5",
      },
      {
        title: "New Motif",
        description:
          "When you play this character, if you removed 1 or more damage from one of your characters this turn, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Isabela Madrigal",
    version: "So eine schöne Stimme",
    text: [
      {
        title: "<Singen> 5 (Die Kosten dieses Charakters gelten als 5 für das Singen von Liedern.)",
      },
      {
        title: "Neues Motiv",
        description:
          "Wenn du diesen Charakter ausspielst, falls du in diesem Zug 1 oder mehr Schaden von einem deiner Charaktere entfernt hast, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Isabela Madrigal",
    version: "Une si jolie voix",
    text: [
      {
        title:
          "<Mélomane> 5 (Ce personnage est considéré comme ayant un coût de 5 pour chanter des chansons.)",
      },
      {
        title: "Nouveau motif",
        description:
          "Lorsque vous jouez ce personnage, si vous avez retiré 1 dommage ou plus de l'un de vos personnages ce tour-ci, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Isabela Madrigal",
    version: "Che Voce Incantevole",
    text: [
      {
        title: "<Melodioso> 5",
      },
      {
        title: "Nuovo Motivetto",
        description:
          "Quando giochi questo personaggio, se hai rimosso 1 o più danni da uno dei tuoi personaggi in questo turno, ottieni 1 leggenda.",
      },
    ],
  },
};
