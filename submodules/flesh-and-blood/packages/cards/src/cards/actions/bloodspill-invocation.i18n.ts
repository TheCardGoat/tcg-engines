import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bloodspillInvocation } from "./bloodspill-invocation.ts";

export const bloodspillInvocationI18n = defineFamilyI18n(bloodspillInvocation, {
  en: {
    name: "Bloodspill Invocation",
    text: (count) =>
      `Go again\nWhen an attack action card you control hits, destroy Bloodspill Invocation then create ${count === 1 ? "a" : count} Runechant token${count === 1 ? "" : "s"}.\nWhen your hero is dealt damage, destroy Bloodspill Invocation.`,
    typeText: "Runeblade Action - Aura",
  },
});

export const {
  red: bloodspillInvocationRedI18n,
  yellow: bloodspillInvocationYellowI18n,
  blue: bloodspillInvocationBlueI18n,
} = bloodspillInvocationI18n.cards;
