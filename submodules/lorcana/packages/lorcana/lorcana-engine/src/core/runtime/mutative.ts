import { makeCreator, type Draft, type Patch } from "mutative";

const PATCH_OPTIONS = {
  pathAsArray: true,
  arrayLengthAssignment: true,
} as const;

export function createRuntimeMutativeCreators(nodeEnv = process.env.NODE_ENV) {
  const isProduction = nodeEnv === "production";
  const baseOptions = {
    strict: !isProduction,
    enableAutoFreeze: !isProduction,
  } as const;

  return {
    createRuntimeState: makeCreator(baseOptions),
    createRuntimeStateWithPatches: makeCreator({
      ...baseOptions,
      enablePatches: PATCH_OPTIONS,
    }),
  };
}

const runtimeMutativeCreators = createRuntimeMutativeCreators();

export function createRuntimeState<TState extends object>(
  state: TState,
  recipe: (draft: Draft<TState>) => void,
): TState {
  return runtimeMutativeCreators.createRuntimeState(state, recipe) as TState;
}

export function createRuntimeStateWithPatches<TState extends object>(
  state: TState,
  recipe: (draft: Draft<TState>) => void,
): [TState, Patch[], Patch[]] {
  return runtimeMutativeCreators.createRuntimeStateWithPatches(state, recipe) as [
    TState,
    Patch[],
    Patch[],
  ];
}
