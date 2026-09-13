import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { prismaticShield } from "./prismatic-shield.ts";

export const prismaticShieldI18n = defineFamilyI18n(prismaticShield, {
  en: {
    name: "Prismatic Shield",
    typeText: "Illusionist Instant",
    text: (count) =>
      count === 1 ? "Create a Spectral Shield token." : `Create ${count} Spectral Shield tokens.`,
  },
});

export const {
  red: prismaticShieldRedI18n,
  yellow: prismaticShieldYellowI18n,
  blue: prismaticShieldBlueI18n,
} = prismaticShieldI18n.cards;
