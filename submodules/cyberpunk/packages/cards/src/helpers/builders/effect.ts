import type {
  AdjustGigEffect,
  AttachCardEffect,
  DefeatEffect,
  DelayedEffect,
  DiscardFromHandEffect,
  DrawEffect,
  GrantRuleEffect,
  IfYouDoEffect,
  LookAtEffect,
  ModifyGigEffect,
  ModifyPowerEffect,
  MoveCardEffect,
  MultiplyPowerEffect,
  PlayCardEffect,
  ReadyEffect,
  RemoveFromGameEffect,
  ReturnToHandEffect,
  SearchDeckEffect,
  SpendEffect,
  StealGigEffect,
  TrashFromDeckEffect,
} from "@tcg/cyberpunk-types";

export const effect = {
  defeat: (args: Omit<DefeatEffect, "effect">): DefeatEffect => ({ effect: "defeat", ...args }),
  spend: (args: Omit<SpendEffect, "effect">): SpendEffect => ({ effect: "spend", ...args }),
  returnToHand: (args: Omit<ReturnToHandEffect, "effect">): ReturnToHandEffect => ({
    effect: "returnToHand",
    ...args,
  }),
  draw: (args: Omit<DrawEffect, "effect">): DrawEffect => ({ effect: "draw", ...args }),
  modifyGig: (args: Omit<ModifyGigEffect, "effect">): ModifyGigEffect => ({
    effect: "modifyGig",
    ...args,
  }),
  adjustGig: (args: Omit<AdjustGigEffect, "effect">): AdjustGigEffect => ({
    effect: "adjustGig",
    ...args,
  }),
  modifyPower: (args: Omit<ModifyPowerEffect, "effect">): ModifyPowerEffect => ({
    effect: "modifyPower",
    ...args,
  }),
  multiplyPower: (args: Omit<MultiplyPowerEffect, "effect">): MultiplyPowerEffect => ({
    effect: "multiplyPower",
    ...args,
  }),
  grantRule: (args: Omit<GrantRuleEffect, "effect">): GrantRuleEffect => ({
    effect: "grantRule",
    ...args,
  }),
  ready: (args: Omit<ReadyEffect, "effect">): ReadyEffect => ({ effect: "ready", ...args }),
  lookAt: (args: Omit<LookAtEffect, "effect">): LookAtEffect => ({ effect: "lookAt", ...args }),
  searchDeck: (args: Omit<SearchDeckEffect, "effect">): SearchDeckEffect => ({
    effect: "searchDeck",
    ...args,
  }),
  discardFromHand: (args: Omit<DiscardFromHandEffect, "effect">): DiscardFromHandEffect => ({
    effect: "discardFromHand",
    ...args,
  }),
  moveCard: (args: Omit<MoveCardEffect, "effect">): MoveCardEffect => ({
    effect: "moveCard",
    ...args,
  }),
  playCard: (args: Omit<PlayCardEffect, "effect">): PlayCardEffect => ({
    effect: "playCard",
    ...args,
  }),
  attachCard: (args: Omit<AttachCardEffect, "effect">): AttachCardEffect => ({
    effect: "attachCard",
    ...args,
  }),
  removeFromGame: (args: Omit<RemoveFromGameEffect, "effect">): RemoveFromGameEffect => ({
    effect: "removeFromGame",
    ...args,
  }),
  stealGig: (args: Omit<StealGigEffect, "effect">): StealGigEffect => ({
    effect: "stealGig",
    ...args,
  }),
  trashFromDeck: (args: Omit<TrashFromDeckEffect, "effect">): TrashFromDeckEffect => ({
    effect: "trashFromDeck",
    ...args,
  }),
  ifYouDo: (args: Omit<IfYouDoEffect, "effect">): IfYouDoEffect => ({
    effect: "ifYouDo",
    ...args,
  }),
  delayed: (args: Omit<DelayedEffect, "effect">): DelayedEffect => ({
    effect: "delayed",
    ...args,
  }),
};
