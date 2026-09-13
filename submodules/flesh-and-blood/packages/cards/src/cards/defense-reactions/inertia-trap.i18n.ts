import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { inertiaTrap } from "./inertia-trap.ts";

export const inertiaTrapI18n = defineFamilyI18n(inertiaTrap, {
  en: {
    name: "Inertia Trap",
    text: "When this defends an attack with {p} greater than its base, create an Inertia token under the attacking hero's control.",
    typeText: "Assassin / Ranger Defense Reaction - Trap",
  },
});

export const { red: inertiaTrapRedI18n } = inertiaTrapI18n.cards;
