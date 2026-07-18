import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const robinHoodEphemeralArcherEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Robin Hood",
    version: "Ephemeral Archer",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "EXPERT SHOT",
        description:
          "Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.",
      },
    ],
  },
  de: {
    name: "Robin Hood",
    version: "Flüchtiger Bogenschütze",
    text: [
      {
        title:
          "<Stärken> 1 {I} (Einmal während deines Zuges darfst du 1 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Meisterhafter Schuss",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls er mindestens eine Karte unter sich hat, wähle bis zu 2 Charaktere und füge ihnen je 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Robin des Bois",
    version: "Archer éphémère",
    text: [
      {
        title:
          "<Boost> 1 {I} (Une fois durant votre tour, vous pouvez payer 1 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Tireur expert",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, s'il y a une carte sous lui, choisissez jusqu'à 2 personnages et infligez 1 dommage à chacun.",
      },
    ],
  },
  it: {
    name: "Robin Hood",
    version: "Arciere Effimero",
    text: [
      {
        title:
          "<Potenziamento> 1 {I} (Una volta durante il tuo turno, puoi pagare 1 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Tiro Esperto",
        description:
          "Ogni volta che questo personaggio va all'avventura, se c'è una carta sotto di esso, infliggi 1 danno a fino a 2 personaggi a tua scelta.",
      },
    ],
  },
  es: {
    name: "Robin Hood",
    version: "Arquero efímero",
    text: [
      {
        title: "Impulsar 1 {I}",
      },
      {
        title: "DISPARO EXPERTO",
        description:
          "Siempre que este personaje realice una misión, si hay una carta debajo de él, inflige 1 daño a hasta 2 personajes elegidos.",
      },
    ],
  },
};
