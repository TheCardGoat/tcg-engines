import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rapunzelEtherealProtectorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rapunzel",
    version: "Ethereal Protector",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "CLONK!",
        description:
          "Whenever this character quests, if there's a card under her, chosen opposing character can't challenge until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Rapunzel",
    version: "Geisterhafte Beschützerin",
    text: [
      {
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Klonk!",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls er mindestens eine Karte unter sich hat, wähle einen gegnerischen Charakter. Er kann bis zu Beginn deines nächsten Zuges nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "Raiponce",
    version: "Protectrice éthérée",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Chbonk!",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, s'il y a une carte sous lui, choisissez un personnage adverse qui ne peut pas défier jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Rapunzel",
    version: "Ethereal Protector",
    text: [
      {
        title:
          "<Boost> 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)",
      },
      {
        title: "Clonk!",
        description:
          "Whenever this character quests, if there's a card under her, chosen opposing character can't challenge until the start of your next turn.",
      },
    ],
  },
  es: {
    name: "Rapunzel",
    version: "Protector etéreo",
    text: [
      {
        title: "Impulsar 2 {I}",
      },
      {
        title: "¡CLON!",
        description:
          "Cada vez que este personaje realiza una misión, si hay una carta debajo de ella, el personaje contrario elegido no puede desafiar hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
