import type { CardInstanceId, DeepReadonly } from "#core";
import type { LorcanaCardDefinition, LorcanaG } from "../../types";

type AdditionalInkwellAbility = {
  type?: string;
  effect?: {
    type?: string;
    amount?: unknown;
  };
};

type TurnMetadataLike = Pick<
  LorcanaG["turnMetadata"],
  "inkedThisTurn" | "additionalInkwellActions"
>;

export type TurnActionInkState = {
  readonly G: {
    readonly turnMetadata: TurnMetadataLike;
  };
  readonly ctx: {
    readonly priority?: {
      readonly holder?: string;
    };
    readonly zones: {
      readonly private: {
        readonly cardIndex: Record<
          string,
          | {
              readonly controllerID?: string;
              readonly zoneKey?: string;
            }
          | undefined
        >;
      };
    };
  };
};

type TurnActionInkAllowanceArgs = {
  state: DeepReadonly<TurnActionInkState>;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
  playerId?: string;
};

const BASE_TURN_ACTION_INK_LIMIT = 1;

function normalizeAllowance(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

function isCardInPlay(zoneKey: string | undefined): boolean {
  return zoneKey === "play" || (typeof zoneKey === "string" && zoneKey.startsWith("play:"));
}

export function getTemporaryAdditionalTurnActionInkAllowance(
  state: DeepReadonly<TurnActionInkState>,
): number {
  return normalizeAllowance(state.G.turnMetadata?.additionalInkwellActions);
}

export function getStaticAdditionalTurnActionInkAllowance({
  state,
  getDefinitionByInstanceId,
  playerId = state.ctx.priority?.holder,
}: TurnActionInkAllowanceArgs): number {
  if (!playerId || !getDefinitionByInstanceId) {
    return 0;
  }

  let allowance = 0;

  for (const [instanceId, indexEntry] of Object.entries(state.ctx.zones.private.cardIndex)) {
    if (!indexEntry || indexEntry.controllerID !== playerId || !isCardInPlay(indexEntry.zoneKey)) {
      continue;
    }

    const definition = getDefinitionByInstanceId(instanceId as CardInstanceId);
    if (!definition) {
      continue;
    }

    for (const ability of definition.abilities ?? []) {
      const staticAbility = ability as AdditionalInkwellAbility;
      if (staticAbility.type === "static" && staticAbility.effect?.type === "additional-inkwell") {
        allowance += normalizeAllowance(staticAbility.effect.amount ?? 1);
      }
    }
  }

  return allowance;
}

export function getAdditionalTurnActionInkAllowance(args: TurnActionInkAllowanceArgs): number {
  return (
    getTemporaryAdditionalTurnActionInkAllowance(args.state) +
    getStaticAdditionalTurnActionInkAllowance(args)
  );
}

export function getTurnActionInkLimit(args: TurnActionInkAllowanceArgs): number {
  return BASE_TURN_ACTION_INK_LIMIT + getAdditionalTurnActionInkAllowance(args);
}

export function canInkThisTurn(args: TurnActionInkAllowanceArgs): boolean {
  const inkedThisTurn = args.state.G.turnMetadata?.inkedThisTurn ?? [];
  return inkedThisTurn.length < getTurnActionInkLimit(args);
}
