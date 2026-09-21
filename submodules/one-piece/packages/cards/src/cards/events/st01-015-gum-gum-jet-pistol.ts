import type { EventCard } from "@tcg/op-types";
import { printing, supernovasStrawHat } from "../st01-helpers.ts";
import { st01GumGumJetPistol015I18n } from "./st01-015-gum-gum-jet-pistol.i18n.ts";

export const st01GumGumJetPistol015: EventCard = {
  id: "ST01-015",
  canonicalId: "ST01-015",
  slug: "gum-gum-jet-pistol",
  name: "Gum-Gum Jet Pistol",
  printings: [printing("ST01-015", "C")],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 4,
  traits: supernovasStrawHat,
  trigger: "[Trigger] Activate this card's [Main] effect.",
  effect: "[Main] K.O. up to 1 of your opponent's Characters with 6000 power or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "power", comparison: "lte", value: 6000 }],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [{ action: "activateEffect", effectTrigger: "main" }],
      },
    ],
  },
  i18n: st01GumGumJetPistol015I18n,
};
