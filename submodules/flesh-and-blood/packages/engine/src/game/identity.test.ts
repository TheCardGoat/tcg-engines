import { describe, expect, it } from "vitest";
import {
  fabCanonicalCardId,
  fabObjectInstanceId,
  fabPlayerId,
  type FabCanonicalCardId,
  type FabObjectInstanceId,
  type FabPlayerId,
} from "./identity.ts";

type IsAssignable<From, To> = [From] extends [To] ? true : false;
type AssertFalse<Value extends false> = Value;

type _PlayerIsNotObject = AssertFalse<IsAssignable<FabPlayerId, FabObjectInstanceId>>;
type _ObjectIsNotPlayer = AssertFalse<IsAssignable<FabObjectInstanceId, FabPlayerId>>;
type _CanonicalIsNotObject = AssertFalse<IsAssignable<FabCanonicalCardId, FabObjectInstanceId>>;

describe("FAB identity domains", () => {
  it("passes non-empty strings through unchanged", () => {
    expect(fabPlayerId("player-one")).toBe("player-one");
    expect(fabObjectInstanceId("card-one")).toBe("card-one");
    expect(fabCanonicalCardId("WTR001")).toBe("WTR001");
  });

  it("rejects empty ingress identities", () => {
    expect(() => fabPlayerId("")).toThrow("player identity must not be empty");
    expect(() => fabObjectInstanceId("")).toThrow("object-instance identity must not be empty");
    expect(() => fabCanonicalCardId("")).toThrow("canonical-card identity must not be empty");
  });
});
