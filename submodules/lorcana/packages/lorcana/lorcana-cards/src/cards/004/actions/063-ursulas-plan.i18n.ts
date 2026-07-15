import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ursulasPlanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ursula’s Plan",
    text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
  },
  de: {
    name: "Ursulas Plan",
    text: "Alle gegnerischen Mitspielenden wählen je einen ihrer Charaktere und erschöpfen ihn. Diese werden zu Beginn ihres nächsten Zuges nicht bereit gemacht.",
  },
  fr: {
    name: "Plan d'Ursula",
    text: "Chaque adversaire choisit un de ses personnages et l'épuise. Ces personnages ne se redressent pas au début de leur prochain tour.",
  },
  it: {
    name: "Il Piano di Ursula",
    text: "Ogni avversario sceglie e impegna uno dei suoi personaggi. Questi personaggi non si possono preparare all'inizio del loro prossimo turno.",
  },
};
