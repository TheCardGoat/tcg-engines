import type { FabEffect, FabTarget } from "@tcg/flesh-and-blood-types";
import type { FabTargetCandidate } from "../../kernel/trigger-declaration.ts";

export type FabAtResolutionObjectTarget = Omit<
  Extract<FabTarget, { readonly selector: "object" }>,
  "declared"
> & {
  readonly declared: "at-resolution";
};

export type FabUnansweredLayerDecision =
  | {
      readonly kind: "repeat-start" | "repeat-commit";
      readonly path: readonly number[];
      readonly repeatPath: readonly number[];
      readonly targetPath: string;
      readonly effect: Extract<FabEffect, { type: "repeat" }>;
      readonly limit: number;
      readonly index: number;
    }
  | {
      /** Internal resolution barrier, never a player choice. */
      readonly kind: "optional-commit";
      readonly path: readonly number[];
    }
  | {
      readonly kind: "payment-amount";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { readonly type: "pay" }>;
      readonly actorId: string;
      readonly max: number;
    }
  | {
      readonly kind: "payment-commit";
      readonly path: readonly number[];
      readonly optionalPath: readonly number[] | null;
      readonly effect: Extract<FabEffect, { readonly type: "pay" }>;
      readonly actorId: string;
      readonly amount: number;
    }
  | {
      readonly kind: "payment";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { readonly type: "pay" }>;
      readonly actorId: string;
      readonly amount: number;
      readonly candidates: readonly { readonly instanceId: string; readonly value: number }[];
    }
  | {
      readonly kind: "optional";
      readonly path: readonly number[];
      /** Effect-tree path used by declaration-time target bindings. */
      readonly targetPath: string;
      readonly effect: Extract<FabEffect, { readonly type: "optional" }>;
    }
  | {
      readonly kind: "opt";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { type: "opt" }>;
    }
  | {
      readonly kind: "reorder-deck";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { type: "reorder-deck" }>;
    }
  | {
      readonly kind: "group-choice";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { type: "choose-same-name-group" }>;
    }
  | {
      readonly kind: "choice";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { type: "choice" }>;
    }
  | {
      readonly kind: "choose-option";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { type: "choose-option" }>;
      readonly actorId: string;
    }
  | {
      readonly kind: "choose-number";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { type: "choose-number" }>;
      readonly actorId: string;
    }
  | {
      readonly kind: "name-card";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { type: "name-card" }>;
      /** Opaque identity is submitted; `name` is the canonical rules value. */
      readonly options: readonly {
        readonly id: string;
        readonly name: string;
      }[];
      readonly suggestionGroups: readonly {
        readonly id: string;
        readonly label: string;
        readonly optionIds: readonly string[];
      }[];
    }
  | {
      readonly kind: "choose-color";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { type: "choose-color" }>;
    }
  | {
      readonly kind: "guess-match";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { type: "guess" }>;
      readonly actorId: string;
    }
  | {
      readonly kind: "move-counter-selection";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { type: "move-counter" }>;
      readonly entries: readonly {
        readonly id: string;
        readonly label: string;
      }[];
    }
  | {
      readonly kind: "choose-and-create-token";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { type: "choose-and-create-token" }>;
      readonly actorId: string;
    }
  | {
      readonly kind: "search";
      readonly path: readonly number[];
      readonly effect: Extract<FabEffect, { type: "search" }>;
    }
  | {
      readonly kind: "target";
      readonly path: readonly number[];
      readonly target: FabAtResolutionObjectTarget | { readonly selector: "any-hero" };
      readonly actorId: string;
      /** Exact quoted legal alternatives for decisions whose source rules
       * already produced a narrower candidate set (CR 1.8.5f retargeting). */
      readonly candidates?: readonly FabTargetCandidate[];
      /**
       * Present when this hero choice belongs to an at-resolution object
       * target's declared player binding. It must be persisted in the layer
       * target map, separately from the later object selection at `path`.
       */
      readonly playerTargetPath?: string;
      readonly playerTargetBinding?: string;
    };
