import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sirPellinoreSeasonedKnightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sir Pellinore",
    version: "Seasoned Knight",
    text: [
      {
        title: "CODE OF HONOR",
        description:
          "Whenever this character quests, your other characters gain Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
    ],
  },
  de: {
    name: "Sir Pelinore",
    version: "Erfahrener Ritter",
    text: [
      {
        title: "Ehrenkodex",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhalten deine anderen Charaktere in diesem Zug <Unterstützen>. (Jedes Mal, wenn die Charaktere erkunden, darfst du ihre {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Seigneur Pélinore",
    version: "Chevalier chevronné",
    text: [
      {
        title: "Code de chevalerie",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vos autres personnages gagnent <Soutien> pour le reste de ce tour. (Lorsque ces personnages sont envoyés à l'aventure, vous pouvez ajouter leur {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Ser Pilade",
    version: "Cavaliere Esperto",
    text: [
      {
        title: "Codice d'Onore",
        description:
          "Ogni volta che questo personaggio va all'avventura, i tuoi altri personaggi ottengono <Aiutante> per questo turno. (Ogni volta che vanno all'avventura, puoi aggiungere la loro {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
  es: {
    name: "Señor Pellinore",
    version: "Caballero experimentado",
    text: [
      {
        title: "CÓDIGO DE HONOR",
        description:
          "Siempre que este personaje realice una misión, tus otros personajes obtienen apoyo este turno. (Siempre que realicen una misión, puedes agregar su {S} al {S} de otro personaje elegido este turno).",
      },
    ],
  },
};
