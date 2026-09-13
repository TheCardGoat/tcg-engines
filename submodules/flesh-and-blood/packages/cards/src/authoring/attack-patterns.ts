import type { FabCardFilter, FabEffect } from "@tcg/flesh-and-blood-types/authoring";

export function nextAttackPowerWithOnHit(args: {
  amount: number;
  filter: FabCardFilter;
  effect: FabEffect;
  hitTargetFilter?: FabCardFilter;
}): FabEffect {
  const appliesTo = { next: args.filter, events: ["attack" as const, "activate" as const] };
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
            id: "onHit",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "hit",
                actor: { kind: "player", player: "ability-controller" },
                observes: { kind: "source", selector: "attack" },
                target: {
                  kind: "hero",
                  ...(args.hitTargetFilter ? { filter: args.hitTargetFilter } : {}),
                },
              },
            },
            resolution: { kind: "effect", effect: args.effect },
          },
        },
        target: { selector: "this-attack" },
        duration: "this-turn",
        appliesTo,
      },
    ],
  };
}

export function grantOnHitToTargetAttack(args: {
  filter: FabCardFilter;
  effect: FabEffect;
}): FabEffect {
  return {
    type: "grant-property",
    property: {
      kind: "ability",
      ability: {
        kind: "static",
        staticKind: "triggered",
        id: "onHit",
        text: "",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: { kind: "player", player: "ability-controller" },
            observes: { kind: "source", selector: "attack" },
            target: { kind: "hero" },
          },
        },
        resolution: { kind: "effect", effect: args.effect },
      },
    },
    target: {
      selector: "object",
      declared: "on-stack",
      zones: ["combat-chain"],
      filter: args.filter,
      count: 1,
    },
    duration: "this-chain-link",
  };
}
