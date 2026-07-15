import { describe, expect, it } from "bun:test";
import { createRuntimeMutativeCreators } from "./mutative";

describe("runtime mutative creators", () => {
  it("freezes created state outside production", () => {
    const { createRuntimeState } = createRuntimeMutativeCreators("development");

    const nextState = createRuntimeState({ nested: { value: 1 } }, (draft) => {
      draft.nested.value = 2;
    });

    expect(Object.isFrozen(nextState)).toBe(true);
    expect(Object.isFrozen(nextState.nested)).toBe(true);
  });

  it("skips auto-freezing in production", () => {
    const { createRuntimeState } = createRuntimeMutativeCreators("production");

    const nextState = createRuntimeState({ nested: { value: 1 } }, (draft) => {
      draft.nested.value = 2;
    });

    expect(Object.isFrozen(nextState)).toBe(false);
    expect(Object.isFrozen(nextState.nested)).toBe(false);
  });
});
