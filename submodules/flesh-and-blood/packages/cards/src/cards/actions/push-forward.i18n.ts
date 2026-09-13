import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pushForward } from "./push-forward.ts";

export const pushForwardI18n = defineFamilyI18n(pushForward, {
  en: {
    name: "Push Forward",
    text: ({ value1 }) => `Your next weapon attack this turn gains +${value1}{p}.
If you have attacked with a weapon this turn, your next attack this turn gains dominate.
Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: pushForwardRedI18n,
  yellow: pushForwardYellowI18n,
  blue: pushForwardBlueI18n,
} = pushForwardI18n.cards;
