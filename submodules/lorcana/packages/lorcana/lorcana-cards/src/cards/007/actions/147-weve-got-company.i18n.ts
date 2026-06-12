import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const weveGotCompanyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "We've Got Company!",
    text: "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)",
  },
  de: {
    name: "Wir kriegen Gesellschaft!",
    text: "Mache alle deine Charaktere bereit. Sie erhalten in diesem Zug Impulsiv. (Sie können nicht erkunden und müssen herausfordern, wenn möglich.)",
  },
  fr: {
    name: "Nous avons de la visite !",
    text: "Redressez tous vos personnages. Ils gagnent Combattant pour le reste de ce tour. (Ils ne peuvent pas être envoyés à l'aventure et doivent défier s'il le peuvent.)",
  },
  it: {
    name: "Abbiamo Visite!",
    text: "Prepara tutti i tuoi personaggi. Ottengono Attaccabrighe per questo turno. (Non possono andare all'avventura e devono sfidare, se possibile.)",
  },
};
