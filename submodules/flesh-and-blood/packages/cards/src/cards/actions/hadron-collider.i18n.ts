import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hadronCollider } from "./hadron-collider.ts";

export const hadronColliderI18n = defineFamilyI18n(hadronCollider, {
  en: {
    name: "Hadron Collider",
    text: ({ value1 }) =>
      `Crank\nThis enters the arena with ${value1} steam counters. At the start of your turn, destroy this unless you remove a steam counter from it.\nWhen you boost an attack, destroy this. If you do, the attack gets +X{p}, where X is the number of steam counters on this.`,
    typeText: "Mechanologist Action - Item",
  },
});

export const {
  red: hadronColliderRedI18n,
  yellow: hadronColliderYellowI18n,
  blue: hadronColliderBlueI18n,
} = hadronColliderI18n.cards;
