import type { FabCardFilter, FabEffect } from "@tcg/flesh-and-blood-types/authoring";

type WagerPrize =
  Extract<FabEffect, { type: "wager" }> extends { prize?: infer Prize }
    ? NonNullable<Prize>
    : never;

const attackTarget = (filter: FabCardFilter) => ({
  selector: "object" as const,
  declared: "on-stack" as const,
  zones: ["combat-chain" as const],
  filter,
  count: 1 as const,
});

const nextAttack = (filter: FabCardFilter) => ({
  next: filter,
  events: ["attack" as const, "activate" as const],
});

export function targetAttackPowerAndWager(args: {
  amount: number;
  filter: FabCardFilter;
  prize: WagerPrize;
}): FabEffect {
  return {
    type: "sequence",
    steps: [
      {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: args.amount,
        target: attackTarget(args.filter),
        duration: "this-turn",
      },
      { type: "wager", attacker: { selector: "this-attack" }, prize: args.prize },
    ],
    outputBinding: "it",
  };
}

export function nextAttackPowerAndWager(args: {
  amount: number;
  filter: FabCardFilter;
  prize: WagerPrize;
  optional?: boolean;
}): FabEffect {
  const appliesTo = nextAttack(args.filter);
  const wager: FabEffect = { type: "wager", prize: args.prize };
  return {
    type: "sequence",
    steps: [
      {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: args.amount,
        target: { selector: "this-attack" },
        duration: "this-turn",
        appliesTo,
      },
      {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "wagerOnAttack",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "attack",
                actor: { kind: "player", player: "ability-controller" },
                observes: { kind: "source", selector: "attack" },
                target: { kind: "hero" },
              },
            },
            resolution: {
              kind: "effect",
              effect: args.optional ? { type: "optional", effect: wager } : wager,
            },
          },
        },
        target: { selector: "this-attack" },
        duration: "this-turn",
        appliesTo,
      },
    ],
  };
}
