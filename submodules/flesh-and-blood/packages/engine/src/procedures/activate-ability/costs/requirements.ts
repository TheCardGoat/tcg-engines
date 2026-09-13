import type { FabCost, FabTarget, FabZone } from "@tcg/flesh-and-blood-types";

export type FabBanishCostRequirement = {
  readonly key: string;
  readonly target: Extract<FabTarget, { readonly selector: "object" }>;
  /** Exact number of objects that must be banished for this cost component. */
  readonly count: number;
  readonly outputBinding: string | null;
  readonly faceDown: boolean;
};

export function activationBanishRequirements(
  cost: FabCost,
  path: readonly number[] = [],
  chosenX?: number,
): readonly FabBanishCostRequirement[] {
  if (cost.class === "mixed") {
    return cost.type === "all"
      ? cost.costs.flatMap((part, index) =>
          activationBanishRequirements(part, [...path, index], chosenX),
        )
      : [];
  }
  // Kassai: banish 2 red + 2 yellow from GY — count is a positive integer.
  // Random / non-controller zone costs stay unsupported until dedicated paths land.
  if (
    cost.class !== "effect" ||
    cost.type !== "banish" ||
    (typeof cost.count !== "number" && cost.count.type !== "x") ||
    (typeof cost.count === "number" && cost.count < 1) ||
    cost.random === true ||
    !["hand", "graveyard", "arena", "hand-or-arsenal", "soul", "under-this"].includes(cost.from)
  )
    return [];
  const count = typeof cost.count === "number" ? cost.count : chosenX;
  if (count === undefined || count < 0 || !Number.isInteger(count)) return [];
  const zones = activationBanishZones(cost.from);
  if (zones.length === 0) return [];
  return [
    {
      key: `cost-${path.join(".") || "0"}:banish`,
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones,
        ...(cost.filter ? { filter: cost.filter } : {}),
        count,
      },
      count,
      outputBinding: cost.outputBinding ?? null,
      faceDown: cost.faceDown === true,
    },
  ];
}

export function activationBanishZones(
  from: Extract<FabCost, { readonly class: "effect"; readonly type: "banish" }>["from"],
): readonly FabZone[] {
  switch (from) {
    case "hand":
      return ["hand"];
    case "graveyard":
      return ["graveyard"];
    case "arena":
      return ["permanent"];
    case "hand-or-arsenal":
      return ["hand", "arsenal"];
    case "soul":
      return ["soul"];
    case "under-this":
      // CR 3.0.14: candidates are keyed to the activated card's hosted
      // sub-cards by the declarations stage (source-keyed "under" seat).
      return ["under"];
    case "deck-top":
      return [];
  }
}

export type FabDiscardCostRequirement = {
  readonly key: string;
  readonly target: Extract<FabTarget, { readonly selector: "object" }>;
  readonly min: number;
  /** `null` means every available candidate may be chosen. */
  readonly max: number | null;
  readonly outputBinding: string | null;
};

export type FabChargeCostRequirement = {
  readonly key: string;
  readonly target: Extract<FabTarget, { readonly selector: "object" }>;
  readonly count: number;
  readonly outputBinding: string | null;
};

export function activationChargeRequirements(
  cost: FabCost,
  path: readonly number[] = [],
): readonly FabChargeCostRequirement[] {
  if (cost.class === "mixed") {
    return cost.type === "all"
      ? cost.costs.flatMap((part, index) => activationChargeRequirements(part, [...path, index]))
      : [];
  }
  if (cost.class !== "effect" || cost.type !== "charge") return [];
  return [
    {
      key: `cost-${path.join(".") || "0"}:charge`,
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: ["hand"],
        count: 1,
      },
      count: 1,
      outputBinding: "charged-this-way",
    },
  ];
}

export function activationDiscardRequirements(
  cost: FabCost,
  path: readonly number[] = [],
): readonly FabDiscardCostRequirement[] {
  if (cost.class === "mixed") {
    return cost.type === "all"
      ? cost.costs.flatMap((part, index) => activationDiscardRequirements(part, [...path, index]))
      : [];
  }
  if (
    cost.class !== "effect" ||
    cost.type !== "discard" ||
    (typeof cost.count !== "number" && cost.count.type !== "any-number") ||
    (typeof cost.count === "number" && cost.count < 1) ||
    cost.random === true ||
    (cost.from !== undefined && cost.from !== "hand")
  )
    return [];
  const min = typeof cost.count === "number" ? cost.count : 0;
  const max = typeof cost.count === "number" ? cost.count : null;
  return [
    {
      key: `cost-${path.join(".") || "0"}:discard`,
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: ["hand"],
        ...(cost.filter ? { filter: cost.filter } : {}),
        count: cost.count,
      },
      min,
      max,
      outputBinding: cost.outputBinding ?? null,
    },
  ];
}

export type FabMoveToDeckCostRequirement = {
  readonly key: string;
  readonly target: Extract<FabTarget, { readonly selector: "object" }>;
  /** Exact number of objects that must be put on deck for this cost component. */
  readonly count: number;
  readonly position: "top" | "bottom";
  readonly outputBinding: string | null;
};

/**
 * Put card(s) from hand and/or arsenal onto the deck as an activation cost.
 * Count 1: Mask of Malicious Manifestations (hand or arsenal → bottom).
 * Count N: Longdraw Half-glove (2 from hand and/or arsenal → bottom).
 */
export function activationMoveToDeckRequirements(
  cost: FabCost,
  path: readonly number[] = [],
): readonly FabMoveToDeckCostRequirement[] {
  if (cost.class === "mixed") {
    return cost.type === "all"
      ? cost.costs.flatMap((part, index) =>
          activationMoveToDeckRequirements(part, [...path, index]),
        )
      : [];
  }
  if (
    cost.class !== "effect" ||
    cost.type !== "move-to-deck" ||
    typeof cost.count !== "number" ||
    cost.count < 1 ||
    (cost.position !== "bottom" && cost.position !== "top") ||
    (cost.from !== "hand" && cost.from !== "arsenal" && cost.from !== "hand-and-arsenal")
  )
    return [];
  const zones: FabZone[] =
    cost.from === "hand" ? ["hand"] : cost.from === "arsenal" ? ["arsenal"] : ["hand", "arsenal"];
  return [
    {
      key: `cost-${path.join(".") || "0"}:move-to-deck`,
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones,
        ...(cost.filter ? { filter: cost.filter } : {}),
        count: cost.count,
      },
      count: cost.count,
      position: cost.position,
      outputBinding: null,
    },
  ];
}

export type FabRevealCostRequirement = {
  readonly key: string;
  readonly target: Extract<FabTarget, { readonly selector: "object" }>;
  readonly outputBinding: string | null;
};

/** Reveal-a-card activation costs (Librarian JDG062: reveal a Tome from
 * inventory). Mirrors {@link activationDiscardRequirements}; the revealed card
 * is stamped 'revealed-this-way' in the payment stage. */
export function activationRevealRequirements(
  cost: FabCost,
  path: readonly number[] = [],
): readonly FabRevealCostRequirement[] {
  if (cost.class === "mixed") {
    return cost.type === "all"
      ? cost.costs.flatMap((part, index) => activationRevealRequirements(part, [...path, index]))
      : [];
  }
  if (
    cost.class !== "effect" ||
    cost.type !== "reveal" ||
    typeof cost.count !== "number" ||
    cost.count !== 1 ||
    (cost.from !== undefined && cost.from !== "hand" && cost.from !== "inventory")
  )
    return [];
  const fromZone = cost.from === "inventory" ? "inventory" : "hand";
  return [
    {
      key: `cost-${path.join(".") || "0"}:reveal`,
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: [fromZone],
        ...(cost.filter ? { filter: cost.filter } : {}),
        count: 1,
      },
      outputBinding: cost.outputBinding ?? null,
    },
  ];
}

export type FabTurnFaceUpCostRequirement = {
  readonly key: string;
  readonly target: Extract<FabTarget, { readonly selector: "self" | "object" }>;
  readonly outputBinding: string | null;
};

export type FabDestroyCostRequirement = {
  readonly key: string;
  readonly target: Extract<FabTarget, { readonly selector: "object" }>;
  readonly outputBinding: string | null;
  readonly count: number;
};

export function activationDestroyRequirements(
  cost: FabCost,
  path: readonly number[] = [],
): readonly FabDestroyCostRequirement[] {
  if (cost.class === "mixed") {
    return cost.type === "all"
      ? cost.costs.flatMap((part, index) => activationDestroyRequirements(part, [...path, index]))
      : [];
  }
  if (cost.class !== "effect" || cost.type !== "destroy") return [];
  const count = cost.count === undefined ? 1 : typeof cost.count === "number" ? cost.count : 0;
  if (count < 1) return [];
  const destroyUnderThis = cost.from === "under-this" || cost.filter?.hasStatus === "under-this";
  return [
    {
      key: `cost-${path.join(".") || "0"}:destroy`,
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: destroyUnderThis ? ["under"] : ["permanent"],
        ...(cost.filter && !destroyUnderThis ? { filter: cost.filter } : {}),
        count,
      },
      outputBinding: cost.outputBinding ?? null,
      count,
    },
  ];
}

/** "{t} a cog you control" — tap one filtered controlled permanent as a cost. */
export type FabTapCostRequirement = {
  readonly key: string;
  readonly target: Extract<FabTarget, { readonly selector: "object" }>;
  readonly outputBinding: string | null;
};

export function activationTapRequirements(
  cost: FabCost,
  path: readonly number[] = [],
): readonly FabTapCostRequirement[] {
  if (cost.class === "mixed") {
    return cost.type === "all"
      ? cost.costs.flatMap((part, index) => activationTapRequirements(part, [...path, index]))
      : [];
  }
  if (
    cost.class !== "effect" ||
    cost.type !== "tap" ||
    !cost.filter ||
    (cost.count !== undefined && cost.count !== 1)
  )
    return [];
  return [
    {
      key: `cost-${path.join(".") || "0"}:tap`,
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: ["permanent"],
        filter: cost.filter,
        count: 1,
      },
      outputBinding: null,
    },
  ];
}

/** "{u} a cog you control" — untap one filtered controlled permanent as a cost. */
export type FabUntapCostRequirement = {
  readonly key: string;
  readonly target: Extract<FabTarget, { readonly selector: "object" }>;
  readonly outputBinding: string | null;
};

export function activationUntapRequirements(
  cost: FabCost,
  path: readonly number[] = [],
): readonly FabUntapCostRequirement[] {
  if (cost.class === "mixed") {
    return cost.type === "all"
      ? cost.costs.flatMap((part, index) => activationUntapRequirements(part, [...path, index]))
      : [];
  }
  if (
    cost.class !== "effect" ||
    cost.type !== "untap" ||
    !cost.filter ||
    (cost.count !== undefined && cost.count !== 1)
  )
    return [];
  return [
    {
      key: `cost-${path.join(".") || "0"}:untap`,
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: ["permanent"],
        filter: cost.filter,
        count: 1,
      },
      outputBinding: null,
    },
  ];
}

/**
 * "Remove a suspense counter from an aura you control" (Pleiades) — named
 * counter removal from a filtered controlled permanent.
 *
 * "Remove a +1{p} counter from an attacking sword you control" (Paragon Plate)
 * — numeric property-counter removal from a filtered permanent (weapons live
 * under `permanent` expansion → weapon seats).
 */
export type FabRemoveCounterCostRequirement = {
  readonly key: string;
  readonly target: Extract<FabTarget, { readonly selector: "object" }>;
  /**
   * Named counter identity for `counter-removed`, or numeric ±property for
   * `numeric-counter-removed`. Display label for decision prompts.
   */
  readonly counter:
    | { readonly kind: "named"; readonly name: string }
    | {
        readonly kind: "numeric";
        readonly property: "power" | "defense" | "life";
        readonly value: number;
      };
  readonly amount: number;
  readonly outputBinding: string | null;
};

/** Catalog filter token for numeric counters (`+1{p}`, `-1{d}`, …). */
export function numericCounterFilterToken(
  property: "power" | "defense" | "life",
  value: number,
): string {
  const sign = value > 0 ? `+${value}` : `${value}`;
  const abbr = property === "power" ? "p" : property === "defense" ? "d" : "h";
  return `${sign}{${abbr}}`;
}

export function activationRemoveCounterRequirements(
  cost: FabCost,
  path: readonly number[] = [],
): readonly FabRemoveCounterCostRequirement[] {
  if (cost.class === "mixed") {
    return cost.type === "all"
      ? cost.costs.flatMap((part, index) =>
          activationRemoveCounterRequirements(part, [...path, index]),
        )
      : [];
  }
  if (
    cost.class !== "effect" ||
    cost.type !== "remove-counters" ||
    typeof cost.count !== "number" ||
    cost.count < 1 ||
    !cost.filter
  ) {
    return [];
  }
  const zones: Extract<FabTarget, { selector: "object" }>["zones"] = cost.zone
    ? ([cost.zone] as Extract<FabTarget, { selector: "object" }>["zones"])
    : (["permanent"] as const);

  if (cost.counter.kind === "named") {
    return [
      {
        key: `cost-${path.join(".") || "0"}:remove-counter`,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones,
          filter: {
            and: [cost.filter, { hasCounter: cost.counter.name }],
          },
          count: 1,
        },
        counter: { kind: "named", name: cost.counter.name },
        amount: cost.count,
        outputBinding: cost.outputBinding ?? null,
      },
    ];
  }

  if (cost.counter.kind === "numeric" && typeof cost.counter.value === "number") {
    const hasCounter = numericCounterFilterToken(cost.counter.property, cost.counter.value);
    return [
      {
        key: `cost-${path.join(".") || "0"}:remove-counter`,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones,
          filter: {
            and: [cost.filter, { hasCounter }],
          },
          count: 1,
        },
        counter: {
          kind: "numeric",
          property: cost.counter.property,
          value: cost.counter.value,
        },
        amount: cost.count,
        outputBinding: cost.outputBinding ?? null,
      },
    ];
  }

  return [];
}

export function activationTurnFaceUpRequirements(
  cost: FabCost,
  path: readonly number[] = [],
): readonly FabTurnFaceUpCostRequirement[] {
  if (cost.class === "mixed") {
    return cost.type === "all"
      ? cost.costs.flatMap((part, index) =>
          activationTurnFaceUpRequirements(part, [...path, index]),
        )
      : [];
  }
  if (
    cost.class !== "effect" ||
    cost.type !== "turn-face-up" ||
    (cost.target.selector !== "self" && cost.target.selector !== "object")
  )
    return [];
  return [
    {
      key: `cost-${path.join(".") || "0"}:turn-face-up`,
      target: cost.target,
      outputBinding: cost.outputBinding ?? null,
    },
  ];
}

export type FabTurnFaceDownCostRequirement = {
  readonly key: string;
  readonly target: Extract<FabTarget, { readonly selector: "object" }>;
};

export function activationTurnFaceDownRequirements(
  cost: FabCost,
  path: readonly number[] = [],
): readonly FabTurnFaceDownCostRequirement[] {
  if (cost.class === "mixed") {
    return cost.type === "all"
      ? cost.costs.flatMap((part, index) =>
          activationTurnFaceDownRequirements(part, [...path, index]),
        )
      : [];
  }
  if (
    cost.class !== "effect" ||
    cost.type !== "turn-face-down" ||
    cost.target.selector !== "object"
  )
    return [];
  return [
    {
      key: `cost-${path.join(".") || "0"}:turn-face-down`,
      target: cost.target,
    },
  ];
}
