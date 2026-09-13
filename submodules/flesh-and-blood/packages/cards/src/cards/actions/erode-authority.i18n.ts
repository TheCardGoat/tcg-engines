import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { erodeAuthority } from "./erode-authority.ts";

export const erodeAuthorityI18n = defineFamilyI18n(erodeAuthority, {
  en: {
    name: "Erode Authority",
    typeText: "Illusionist Action - Attack",
    text: "Dominate\nFragment",
  },
});

export const {
  red: erodeAuthorityRedI18n,
  yellow: erodeAuthorityYellowI18n,
  blue: erodeAuthorityBlueI18n,
} = erodeAuthorityI18n.cards;
