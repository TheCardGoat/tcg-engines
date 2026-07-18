import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicCarpetPhantomRugI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Carpet",
    version: "Phantom Rug",
    text: [
      {
        title: "Vanish",
        description: "(When an opponent chooses this character for an action, banish them.)",
      },
      {
        title: "SPECTRAL FORCE",
        description:
          "Your other Illusion characters gain Challenger +1. (They get +1 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Fliegender Teppich",
    version: "Phantomteppich",
    text: [
      {
        title:
          "<Verschwinden> (Jedes Mal, wenn dieser Charakter von einer Aktion einer gegnerischen Person ausgewählt wird, verbanne ihn.)",
      },
      {
        title: "Spektrale Kraft",
        description:
          "Deine anderen Illusionen erhalten <Herausfordern> +1. (Während sie herausfordern, erhalten sie +1 {S}.)",
      },
    ],
  },
  fr: {
    name: "Tapis Volant",
    version: "Apparition tapissière",
    text: [
      {
        title:
          "<Dissipation> (Lorsqu'un adversaire choisit ce personnage avec une action, bannissez-le.)",
      },
      {
        title: "Force spectrale",
        description:
          "Vos autres personnages Illusion gagnent <Offensif> +1. (Lorsqu'ils défient, ces personnages gagnent +1 {S}.)",
      },
    ],
  },
  it: {
    name: "Tappeto Magico",
    version: "Zerbino Fantasma",
    text: [
      {
        title:
          "<Svanire> (Quando un avversario sceglie questo personaggio per un'azione, esilialo.)",
      },
      {
        title: "Forza Spettrale",
        description:
          "I tuoi altri personaggi Illusione ottengono <Sfidante> +1. (Ricevono +1 {S} mentre stanno sfidando.)",
      },
    ],
  },
  es: {
    name: "Alfombra mágica",
    version: "Alfombra fantasma",
    text: [
      {
        title: "Desaparecer",
        description: "(Cuando un oponente elige este personaje para una acción, destierralo).",
      },
      {
        title: "FUERZA ESPECTRAL",
        description:
          "Tus otros personajes de Illusion obtienen Challenger +1. (Obtienen +1 {S} mientras desafían).",
      },
    ],
  },
};
