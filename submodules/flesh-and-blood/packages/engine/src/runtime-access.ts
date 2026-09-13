/**
 * Capability key reserved for the package-local test harness. It is not
 * re-exported from the engine package, so production consumers cannot obtain
 * a mutable reference to runtime-owned state through the public API.
 */
export const FAB_RUNTIME_TEST_ACCESS: unique symbol = Symbol("fab-runtime-test-access");
/** Test-only receipt for assertions about a transaction's internal event order. */
export const FAB_RUNTIME_TEST_RECEIPT: unique symbol = Symbol("fab-runtime-test-receipt");
/** Package-private one-shot fault injection for atomic command rollback tests. */
export const FAB_RUNTIME_TEST_FAILURE: unique symbol = Symbol("fab-runtime-test-failure");
export type FabRuntimeTestFailureStage = "handler" | "automation" | "validator";
/**
 * Package-private one-shot ownership transfer for freshly constructed test
 * states. Production entrypoints cannot import this through package exports.
 */
const ownedTestStates = new WeakSet<object>();

export function transferFabRuntimeTestStateOwnership<State extends object>(state: State): State {
  ownedTestStates.add(state);
  return state;
}

export function consumeFabRuntimeTestStateOwnership(state: object): boolean {
  const owned = ownedTestStates.has(state);
  ownedTestStates.delete(state);
  return owned;
}
