import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tiggerHunnyBarbarianI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tigger",
    version: "Hunny Barbarian",
    text: [
      {
        title: "Reckless",
      },
      {
        title: "PROTECTIVE CHARGE",
        description:
          "Once during your turn, whenever this character challenges another character, you may ready chosen Hunny character. If you do, that character can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Tigger",
    version: "Honig-Barbar",
    text: [
      {
        title: "<Impulsiv>",
      },
      {
        title: "Beschützende Abwehr",
        description:
          "Einmal während deines Zuges, wenn dieser Charakter einen anderen Charakter herausfordert, darfst du einen Honig-Charakter deiner Wahl bereit machen. Wenn du dies tust, kann jener Charakter in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Tigrou",
    version: "Barbare mellifique",
    text: [
      {
        title: "<Combattant>",
      },
      {
        title: "Charge protectrice",
        description:
          "Une fois durant votre tour, lorsque ce personnage en défie un autre, vous pouvez choisir un personnage Miel et le redresser. Si vous le faites, ce personnage-là ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Tigro",
    version: "Barbaro del Miele",
    text: [
      {
        title: "<Attaccabrighe>",
      },
      {
        title: "Carica Protettiva",
        description:
          "Una volta durante il tuo turno, ogni volta che questo personaggio sfida un altro personaggio, puoi preparare un personaggio Miele a tua scelta. Se lo fai, quel personaggio non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "Tigre",
    version: "Bárbaro cariñoso",
    text: [
      {
        title: "Imprudente",
      },
      {
        title: "CARGA PROTECTORA",
        description:
          "Una vez durante tu turno, cada vez que este personaje desafíe a otro personaje, puedes preparar el personaje Hunny elegido. Si lo haces, ese personaje no podrá realizar misiones durante el resto de este turno.",
      },
    ],
  },
};
