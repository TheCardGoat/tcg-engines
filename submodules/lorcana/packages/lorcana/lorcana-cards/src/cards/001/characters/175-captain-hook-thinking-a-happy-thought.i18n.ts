import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const captainHookThinkingAHappyThoughtI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Captain Hook",
    version: "Thinking a Happy Thought",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "Challenger +3",
      },
      {
        title: "STOLEN DUST",
        description: "Characters with cost 3 or less can't challenge this character.",
      },
    ],
  },
  de: {
    name: "Käpt'n Hook",
    version: "Ein feiner Gedanke",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Käpt'n-Hook-Charaktere auszuspielen.)",
      },
      {
        title: "<Herausfordern> +3 (Während dieser Charakter herausfordert, erhält er +3 {S}.)",
      },
      {
        title: "Gestohlener Glanz",
        description:
          "Charaktere, die 3 oder weniger kosten, können diesen Charakter nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "CAPITAINE CROCHET",
    version: "Rêve d'aventure",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Capitaine Crochet.)",
      },
      {
        title: "<Offensif> +3",
      },
      {
        title: "POUSSIÈRE VOLÉE",
        description: "Les personnages coûtant 3 ou moins ne peuvent pas défier ce personnage.",
      },
    ],
  },
  it: {
    name: "Captain Hook",
    version: "Thinking a Happy Thought",
    text: [
      {
        title:
          "<Shift> 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)",
      },
      {
        title: "<Challenger> +3 (While challenging, this character gets +3 {S}.)",
      },
      {
        title: "Stolen Dust",
        description: "Characters with cost 3 or less can't challenge this character.",
      },
    ],
  },
  es: {
    name: "Capitán Garfio",
    version: "Tener un pensamiento feliz",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "Retador +3",
      },
      {
        title: "POLVO ROBADO",
        description: "Los personajes con coste 3 o menos no pueden desafiar a este personaje.",
      },
    ],
  },
};
