import type { LeaderCard } from "@tcg/op-types";
import { printing, supernovasStrawHat } from "../st01-helpers.ts";
import { st01MonkeyDLuffy001I18n } from "./st01-001-monkey-d-luffy.i18n.ts";

export const st01MonkeyDLuffy001: LeaderCard = {
  id: "ST01-001",
  canonicalId: "ST01-001",
  slug: "monkey-d-luffy/st01-001",
  name: "Monkey.D.Luffy",
  printings: [printing("ST01-001", "L")],
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "ST01",
  power: 5000,
  life: 5,
  traits: supernovasStrawHat,
  attribute: "strike",
  effect:
    "[Activate: Main] [Once Per Turn] Give this Leader or 1 of your Characters up to 1 rested DON!! card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: st01MonkeyDLuffy001I18n,
};
