import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tearThroughThePortal } from "./tear-through-the-portal.ts";

export const tearThroughThePortalI18n = defineFamilyI18n(tearThroughThePortal, {
  en: {
    name: "Tear Through the Portal",
    text: ({
      color,
    }) => `Choose a ${color} action card in your banished zone. It gets go again until end of turn.
Go again`,
    typeText: "Shadow Action",
  },
});

export const {
  red: tearThroughThePortalRedI18n,
  yellow: tearThroughThePortalYellowI18n,
  blue: tearThroughThePortalBlueI18n,
} = tearThroughThePortalI18n.cards;
