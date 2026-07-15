import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const meridaFormidableArcherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merida",
    version: "Formidable Archer",
    text: [
      {
        title: "FULL QUIVER",
        description:
          "When you play this character, you may return an action card named Three Arrows from your discard to your hand.",
      },
      {
        title: "STEADY AIM",
        description:
          "Whenever one of your actions deals damage to an opposing character, deal 2 damage to that character.",
      },
    ],
  },
  de: {
    name: "Merida",
    version: "Beeindruckende Bogenschützin",
    text: [
      {
        title: "Voller Köcher",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 1 Drei-Pfeile-Aktionskarte aus deinem Ablagestapel zurück auf deine Hand nehmen.",
      },
      {
        title: "Zielsicher",
        description:
          "Jedes Mal, wenn eine deiner Aktionen einem gegnerischen Charakter Schaden zufügt, füge jenem Charakter 2 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Merida",
    version: "Archère redoutable",
    text: [
      {
        title: "Carquois plein",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez renvoyer dans votre main une carte Action nommée Triple flèche de votre défausse.",
      },
      {
        title: "Visée stable",
        description:
          "Chaque fois que l'une de vos actions inflige des dommages à un personnage adverse, infligez 2 dommages à ce personnage-là.",
      },
    ],
  },
  it: {
    name: "Merida",
    version: "Arciera Formidabile",
    text: [
      {
        title: "Faretra Piena",
        description:
          "Quando giochi questo personaggio, puoi riprendere in mano una carta azione chiamata Tre Frecce dai tuoi scarti.",
      },
      {
        title: "Mira Sicura",
        description:
          "Ogni volta che una delle tue azioni infligge danno a un personaggio avversario, infliggi 2 danni a quel personaggio.",
      },
    ],
  },
};
