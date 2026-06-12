import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicalAidI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magical Aid",
    text: 'Chosen character gains Challenger +3 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +3 {S} while challenging.)',
  },
  de: {
    name: "Magische Unterstützung",
    text: 'Ein Charakter deiner Wahl erhält in diesem Zug: "Wenn dieser Charakter durch eine Herausforderung verbannt wird, nimm ihn zurück auf deine Hand" und Herausfordern +3. (Während der Charakter herausfordert, erhält er +3.)',
  },
  fr: {
    name: "Assistance magique",
    text: 'Choisissez un personnage qui gagne Offensif +3 et "lorsque ce personnage est banni via un défi, renvoyez cette carte dans votre main" pour le reste de ce tour.',
  },
  it: {
    name: "Aiuto Magico",
    text: 'Un personaggio a tua scelta ottiene Sfidante +3 e "Quando questo personaggio viene esiliato in una sfida, riprendi in mano questa carta" per questo turno.',
  },
};
