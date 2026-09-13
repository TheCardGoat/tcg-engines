import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { deadwoodDirge } from "./deadwood-dirge.ts";

export const deadwoodDirgeI18n = defineFamilyI18n(deadwoodDirge, {
  en: {
    name: "Deadwood Dirge",
    text: (count) =>
      `Destroy an aura you control. If you do, create ${count === 1 ? "a Runechant token" : count + " Runechant tokens"}.\nGo again`,
    typeText: "Runeblade Action",
  },
});

export const {
  red: deadwoodDirgeRedI18n,
  yellow: deadwoodDirgeYellowI18n,
  blue: deadwoodDirgeBlueI18n,
} = deadwoodDirgeI18n.cards;
