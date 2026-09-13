import { defineGameDeckInterchangeAdapter } from "@tcg/shared/game-adapter";
import { FAB_FORMAT_RULES } from "@tcg/flesh-and-blood-engine/deck-validation";

export const fleshAndBloodDeckInterchangeAdapter = defineGameDeckInterchangeAdapter({
  game: "flesh-and-blood",
  defaultFormatId: "cc",
  formats: {
    cc: fabFormat("cc", "Classic Constructed"),
    blitz: fabFormat("blitz", "Blitz"),
    ll: fabFormat("ll", "Living Legend"),
    silverAge: fabFormat("silverAge", "Silver Age"),
  },
});

function fabFormat(id: "cc" | "blitz" | "ll" | "silverAge", label: string) {
  const maximumCardPool = FAB_FORMAT_RULES[id].cardPoolMaximum;
  return {
    id,
    label,
    sections: [
      {
        id: "hero",
        label: "Hero",
        roles: ["validation", "runtime"] as const,
        required: true,
        exactCards: 1,
      },
      {
        id: "cardPool",
        label: "Registered card-pool",
        roles: ["validation", "runtime"] as const,
        required: true,
        maximumCards: maximumCardPool,
      },
    ],
  } as const;
}
