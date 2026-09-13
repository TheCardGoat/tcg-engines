export interface FabActivationCreateTokenCost {
  readonly token: string;
  readonly controller: "controller" | "opponent" | "self";
  readonly count: number;
}

/** Deterministic movement of an activated ability's own source into its owner's deck. */
export interface FabActivationSelfMoveToDeckCost {
  readonly position: "top" | "bottom" | "shuffle";
}
