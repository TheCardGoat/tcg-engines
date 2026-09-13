import type { FabCost } from "@tcg/flesh-and-blood-types";
import type { FabActivationCreateTokenCost, FabActivationSelfMoveToDeckCost } from "./types.ts";

/**
 * Resolve the cost declared for an activated ability. Alternative costs are a
 * player declaration, never an implicit engine preference (CR 5.1.3c).
 */
export function selectedActivationCost(
  cost: FabCost,
  alternativeCostIndex: number | null | undefined,
): FabCost | null {
  if (cost.class !== "mixed" || cost.type !== "alternative") {
    return alternativeCostIndex === null || alternativeCostIndex === undefined ? cost : null;
  }
  if (
    alternativeCostIndex === null ||
    alternativeCostIndex === undefined ||
    !Number.isInteger(alternativeCostIndex) ||
    alternativeCostIndex < 0 ||
    alternativeCostIndex >= cost.costs.length
  ) {
    return null;
  }
  return cost.costs[alternativeCostIndex] ?? null;
}

/**
 * CR 5.1.3c: alternative costs are a player declaration. When the test/client
 * omits the index, a **unique payable** arm is determined (only one legal
 * declaration). Two payable arms still require an explicit index.
 */
export function declaredActivationCost(
  cost: FabCost,
  alternativeCostIndex: number | null | undefined,
  armPayable: (arm: FabCost) => boolean,
): FabCost | null {
  const explicit = selectedActivationCost(cost, alternativeCostIndex);
  if (explicit) return explicit;
  if (cost.class !== "mixed" || cost.type !== "alternative") return null;
  const payable = cost.costs.filter(armPayable);
  return payable.length === 1 ? (payable[0] ?? null) : null;
}

export function zeroEffectCosts(
  overrides: Partial<{
    resources: number;
    chi: number;
    life: number;
    actionPoints: number;
  }>,
) {
  return {
    resources: 0,
    chi: 0,
    life: 0,
    actionPoints: 0,
    destroySelf: false,
    banishSelf: false,
    tapSelf: false,
    tapHero: false,
    discardSelf: false,
    turnFaceUpSelf: false,
    turnFaceUpSelfBinding: null,
    turnFaceUpTargets: false,
    turnFaceDownTargets: false,
    discardTargets: false,
    banishTargets: false,
    destroyTargets: false,
    /** "{t} a cog you control" — tap a filtered controlled permanent as a cost. */
    tapTargets: false,
    /** "{u} a cog you control" — untap a filtered controlled permanent as a cost. */
    untapTargets: false,
    /** Charge a card from hand into soul (V for Valor). */
    chargeTargets: false,
    /**
     * Put a declared card from hand and/or arsenal onto the deck
     * (Mask of Malicious Manifestations, Longdraw Half-glove, …).
     */
    moveToDeckTargets: false,
    /** Move the activation source itself into its owner's deck. */
    selfMoveToDeck: null as FabActivationSelfMoveToDeckCost | null,
    /** Reveal a card from a zone (inventory/hand) as an activation cost (Librarian). */
    revealTargets: false,
    /** Remove counters from a filtered controlled object (not self). */
    removeCounterTargets: false,
    /**
     * Variable (X) self counter cost — amount chosen at declaration
     * (Blaze Firemind "Remove X energy counters").
     */
    xCounterCost: null as { operation: "add" | "remove"; counter: string } | null,
    xResourceCost: null as { multiplier: number; plus: number } | null,
    xBanishCost: false,
    counterCosts: [] as { operation: "add" | "remove"; counter: string; amount: number }[],
    createTokenCosts: [] as FabActivationCreateTokenCost[],
    ...overrides,
  };
}

export function activationCosts(cost: FabCost): {
  resources: number;
  chi: number;
  life: number;
  actionPoints: number;
  destroySelf: boolean;
  banishSelf: boolean;
  tapSelf: boolean;
  tapHero?: boolean;
  discardSelf: boolean;
  turnFaceUpSelf: boolean;
  turnFaceUpSelfBinding: string | null;
  turnFaceUpTargets: boolean;
  turnFaceDownTargets: boolean;
  discardTargets: boolean;
  banishTargets: boolean;
  destroyTargets: boolean;
  tapTargets: boolean;
  untapTargets: boolean;
  chargeTargets: boolean;
  moveToDeckTargets: boolean;
  selfMoveToDeck: FabActivationSelfMoveToDeckCost | null;
  revealTargets: boolean;
  removeCounterTargets: boolean;
  xCounterCost: { operation: "add" | "remove"; counter: string } | null;
  xResourceCost: { multiplier: number; plus: number } | null;
  xBanishCost: boolean;
  counterCosts: { operation: "add" | "remove"; counter: string; amount: number }[];
  createTokenCosts: FabActivationCreateTokenCost[];
} | null {
  if (cost.optional) return null;
  if (cost.class === "mixed") {
    if (cost.type !== "all") return null;
    const total = {
      resources: 0,
      chi: 0,
      life: 0,
      actionPoints: 0,
      destroySelf: false,
      banishSelf: false,
      tapSelf: false,
      tapHero: false,
      discardSelf: false,
      turnFaceUpSelf: false,
      turnFaceUpSelfBinding: null as string | null,
      turnFaceUpTargets: false,
      turnFaceDownTargets: false,
      discardTargets: false,
      banishTargets: false,
      destroyTargets: false,
      tapTargets: false,
      untapTargets: false,
      chargeTargets: false,
      moveToDeckTargets: false,
      selfMoveToDeck: null as FabActivationSelfMoveToDeckCost | null,
      revealTargets: false,
      removeCounterTargets: false,
      xCounterCost: null as { operation: "add" | "remove"; counter: string } | null,
      xResourceCost: null as { multiplier: number; plus: number } | null,
      xBanishCost: false,
      counterCosts: [] as { operation: "add" | "remove"; counter: string; amount: number }[],
      createTokenCosts: [] as FabActivationCreateTokenCost[],
    };
    for (const part of cost.costs) {
      const parsed = activationCosts(part);
      if (!parsed) return null;
      total.resources += parsed.resources;
      total.chi += parsed.chi;
      total.life += parsed.life;
      total.actionPoints += parsed.actionPoints;
      total.destroySelf ||= parsed.destroySelf;
      total.banishSelf ||= parsed.banishSelf;
      total.tapSelf ||= parsed.tapSelf;
      total.tapHero ||= parsed.tapHero === true;
      total.discardSelf ||= parsed.discardSelf;
      total.turnFaceUpSelf ||= parsed.turnFaceUpSelf;
      total.turnFaceUpTargets ||= parsed.turnFaceUpTargets;
      total.turnFaceDownTargets ||= parsed.turnFaceDownTargets;
      total.discardTargets ||= parsed.discardTargets;
      total.banishTargets ||= parsed.banishTargets;
      total.destroyTargets ||= parsed.destroyTargets;
      total.tapTargets ||= parsed.tapTargets;
      total.untapTargets ||= parsed.untapTargets;
      total.chargeTargets ||= parsed.chargeTargets;
      total.moveToDeckTargets ||= parsed.moveToDeckTargets;
      if (parsed.selfMoveToDeck) {
        // Paying two zone-resetting self moves is impossible: after the first
        // move the second cost cannot resolve. Reject the cost model rather
        // than silently choosing one position.
        if (total.selfMoveToDeck) return null;
        total.selfMoveToDeck = parsed.selfMoveToDeck;
      }
      total.revealTargets ||= parsed.revealTargets;
      total.xCounterCost = total.xCounterCost ?? parsed.xCounterCost;
      total.xResourceCost = total.xResourceCost ?? parsed.xResourceCost;
      if (total.xBanishCost && parsed.xBanishCost) return null;
      total.xBanishCost ||= parsed.xBanishCost;
      total.removeCounterTargets ||= parsed.removeCounterTargets;
      total.counterCosts.push(...parsed.counterCosts);
      total.createTokenCosts.push(...parsed.createTokenCosts);
      if (parsed.turnFaceUpSelfBinding) {
        if (
          total.turnFaceUpSelfBinding &&
          total.turnFaceUpSelfBinding !== parsed.turnFaceUpSelfBinding
        )
          return null;
        total.turnFaceUpSelfBinding = parsed.turnFaceUpSelfBinding;
      }
    }
    if (total.selfMoveToDeck && (total.destroySelf || total.banishSelf || total.discardSelf)) {
      // A source cannot pay two zone-resetting costs in one activation. Keep
      // this invalid model out of the event journal rather than relying on an
      // eventual atomic rollback.
      return null;
    }
    return total;
  }
  if (cost.class === "effect") {
    switch (cost.type) {
      case "destroy-self":
        if (cost.delayed !== undefined) return null;
        return {
          ...zeroEffectCosts({}),
          destroySelf: true,
        };
      case "banish-self":
        return {
          ...zeroEffectCosts({}),
          banishSelf: true,
        };
      case "tap-self":
        return {
          ...zeroEffectCosts({}),
          tapSelf: true,
        };
      case "tap-hero":
        return {
          ...zeroEffectCosts({}),
          tapHero: true,
        };
      case "discard-self":
        return {
          ...zeroEffectCosts({}),
          discardSelf: true,
        };
      case "turn-face-up":
        if (cost.target.selector === "self") {
          return {
            ...zeroEffectCosts({}),
            turnFaceUpSelf: true,
            turnFaceUpSelfBinding: cost.outputBinding ?? null,
          };
        }
        if (cost.target.selector === "object") {
          return {
            ...zeroEffectCosts({}),
            turnFaceUpTargets: true,
          };
        }
        return null;
      case "turn-face-down":
        if (cost.target.selector === "object") {
          return {
            ...zeroEffectCosts({}),
            turnFaceDownTargets: true,
          };
        }
        return null;
      case "discard":
        // Exact positive counts (Great Library) and "any number" (Hoodwink).
        // Random stays unsupported.
        if (
          ((typeof cost.count === "number" && cost.count >= 1) ||
            (typeof cost.count === "object" && cost.count.type === "any-number")) &&
          cost.random !== true &&
          (cost.from === undefined || cost.from === "hand")
        ) {
          return {
            ...zeroEffectCosts({}),
            discardTargets: true,
          };
        }
        return null;
      case "banish":
        if (
          typeof cost.count === "object" &&
          cost.count.type === "x" &&
          cost.random !== true &&
          ["hand", "graveyard", "arena", "hand-or-arsenal", "soul", "under-this"].includes(
            cost.from,
          )
        ) {
          return {
            ...zeroEffectCosts({}),
            banishTargets: true,
            xBanishCost: true,
          };
        }
        // Count ≥ 1 (Kassai 2 red + 2 yellow GY; single-card soul/hand bans;
        // DYN092 banish-under-this via the hosted sub-card seat).
        if (
          typeof cost.count === "number" &&
          cost.count >= 1 &&
          cost.random !== true &&
          ["hand", "graveyard", "arena", "hand-or-arsenal", "soul", "under-this"].includes(
            cost.from,
          )
        ) {
          return {
            ...zeroEffectCosts({}),
            banishTargets: true,
          };
        }
        return null;
      case "destroy":
        if (cost.count === undefined || (typeof cost.count === "number" && cost.count >= 1)) {
          return {
            ...zeroEffectCosts({}),
            destroyTargets: true,
          };
        }
        return null;
      case "remove-counters":
        // Variable X self-cost (Blaze: "Remove X energy counters from Blaze").
        if (
          typeof cost.count === "object" &&
          cost.count !== null &&
          "type" in cost.count &&
          cost.count.type === "x" &&
          cost.counter.kind === "named" &&
          cost.filter === undefined &&
          cost.zone === undefined
        ) {
          return {
            ...zeroEffectCosts({}),
            xCounterCost: { operation: "remove", counter: cost.counter.name },
          };
        }
        if (
          typeof cost.count === "number" &&
          cost.count > 0 &&
          cost.counter.kind === "named" &&
          cost.filter === undefined &&
          cost.zone === undefined
        ) {
          // Self: remove counters from the activation source.
          return {
            ...zeroEffectCosts({}),
            counterCosts: [{ operation: "remove", counter: cost.counter.name, amount: cost.count }],
          };
        }
        if (
          typeof cost.count === "number" &&
          cost.count > 0 &&
          cost.counter.kind === "named" &&
          cost.filter !== undefined
        ) {
          // Filtered object: declare a controlled permanent with those counters
          // (Pleiades "remove a suspense counter from an aura you control").
          return {
            ...zeroEffectCosts({}),
            removeCounterTargets: true,
          };
        }
        if (
          typeof cost.count === "number" &&
          cost.count > 0 &&
          cost.counter.kind === "numeric" &&
          typeof cost.counter.value === "number" &&
          cost.filter !== undefined
        ) {
          // Filtered permanent with a ±property counter (Paragon Plate:
          // "remove a +1{p} counter from an attacking sword you control").
          return {
            ...zeroEffectCosts({}),
            removeCounterTargets: true,
          };
        }
        return null;
      case "add-counter":
        if (
          typeof cost.count === "number" &&
          cost.count > 0 &&
          cost.counter.kind === "named" &&
          (cost.target === undefined || cost.target.selector === "self")
        ) {
          return {
            ...zeroEffectCosts({}),
            counterCosts: [{ operation: "add", counter: cost.counter.name, amount: cost.count }],
          };
        }
        return null;
      case "create-token": {
        // Chane: "Create a Soul Shackle token:" as the activation cost.
        // Controller is controller/self only in the activation cost slice.
        if (
          (cost.controller === "controller" || cost.controller === "self") &&
          typeof cost.token === "string" &&
          cost.token.length > 0
        ) {
          return {
            ...zeroEffectCosts({}),
            createTokenCosts: [
              {
                token: cost.token,
                controller: cost.controller === "self" ? "controller" : cost.controller,
                count: 1,
              },
            ],
          };
        }
        return null;
      }
      case "move-to-deck":
        // "Put/shuffle this into its owner's deck" is deterministic and must
        // not be routed through the player-selected hand/arsenal target path.
        // One source can pay exactly one self move; indexed positions remain
        // unsupported because no authored activation cost currently defines
        // that meaning.
        if (
          cost.from === "self" &&
          cost.count === 1 &&
          (cost.position === "bottom" || cost.position === "top" || cost.position === "shuffle")
        ) {
          return {
            ...zeroEffectCosts({}),
            selfMoveToDeck: { position: cost.position },
          };
        }
        // "Put a/N card(s) from your hand or arsenal on the bottom of your deck"
        // Count 1: Mask of Malicious Manifestations.
        // Count N: Longdraw Half-glove (2 from hand and/or arsenal).
        if (
          typeof cost.count === "number" &&
          cost.count >= 1 &&
          (cost.position === "bottom" || cost.position === "top") &&
          (cost.from === "hand" || cost.from === "arsenal" || cost.from === "hand-and-arsenal")
        ) {
          return {
            ...zeroEffectCosts({}),
            moveToDeckTargets: true,
          };
        }
        return null;
      case "tap":
        // "{t} a cog you control" (Rust Belt) — declare and tap one filtered permanent.
        if (cost.filter && (cost.count === undefined || cost.count === 1)) {
          return {
            ...zeroEffectCosts({}),
            tapTargets: true,
          };
        }
        return null;
      case "untap":
        if (cost.filter && (cost.count === undefined || cost.count === 1)) {
          return {
            ...zeroEffectCosts({}),
            untapTargets: true,
          };
        }
        return null;
      case "charge":
        return {
          ...zeroEffectCosts({}),
          chargeTargets: true,
        };
      case "reveal": {
        // Reveal a card from a zone (inventory/hand) as an activation cost.
        // The declared card is stamped 'revealed-this-way' in the payment stage
        // so the effect's move-card filter can find it (Librarian JDG062).
        if (
          typeof cost.count === "number" &&
          cost.count === 1 &&
          (cost.from === undefined || cost.from === "hand" || cost.from === "inventory")
        ) {
          return {
            ...zeroEffectCosts({}),
            revealTargets: true,
          };
        }
        return null;
      }
      default: {
        const _exhaustiveEffect: never = cost;
        void _exhaustiveEffect;
        return null;
      }
    }
  }
  if (cost.class !== "asset") return null;
  switch (cost.type) {
    case "resources":
      if (typeof cost.amount === "object" && cost.amount.type === "x") {
        return {
          ...zeroEffectCosts({}),
          xResourceCost: { multiplier: cost.amount.count ?? 1, plus: cost.amount.plus ?? 0 },
        };
      }
      if (typeof cost.amount !== "number") return null;
      return zeroEffectCosts({ resources: cost.amount });
    case "chi":
      if (typeof cost.amount !== "number") return null;
      return zeroEffectCosts({ chi: cost.amount });
    case "life":
      if (typeof cost.amount !== "number") return null;
      return zeroEffectCosts({ life: cost.amount });
    case "action-points":
      return zeroEffectCosts({ actionPoints: cost.amount });
    case "power":
      return null;
    default: {
      const _exhaustive: never = cost;
      void _exhaustive;
      return null;
    }
  }
}
