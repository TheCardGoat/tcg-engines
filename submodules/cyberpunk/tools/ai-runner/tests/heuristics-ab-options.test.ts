import { describe, expect, it } from "vite-plus/test";
import {
  parseHeuristicsAbConfig,
  parseHeuristicsAbProfileOverride,
} from "../src/heuristics-ab-options.ts";

describe("heuristics A/B options", () => {
  it("parses the supported typed tactical options", () => {
    expect(
      parseHeuristicsAbConfig("maxDepth=4,maxNodes=128,branchLimit=16,abilityAware=true"),
    ).toEqual({ maxDepth: 4, maxNodes: 128, branchLimit: 16, abilityAware: true });
  });

  it("rejects unknown, non-finite, and wrong-type tactical options", () => {
    expect(() => parseHeuristicsAbConfig("maxDepht=4")).toThrow(/Unknown tactical config key/);
    expect(() => parseHeuristicsAbConfig("maxDepth=deep")).toThrow(/finite number/);
    expect(() => parseHeuristicsAbConfig("abilityAware=1")).toThrow(/true or false/);
  });

  it("parses only supported deck profile overrides", () => {
    expect(
      parseHeuristicsAbProfileOverride("blockDirectStealsAtLeast=1,pacing=develop-first"),
    ).toEqual({ blockDirectStealsAtLeast: 1, pacing: "develop-first" });
  });

  it("rejects misspelled, structured, and invalid profile overrides", () => {
    expect(() => parseHeuristicsAbProfileOverride("blockDirectStealAtLeast=1")).toThrow(
      /Unknown deck profile override key/,
    );
    expect(() => parseHeuristicsAbProfileOverride("coreCards=one")).toThrow(
      /Unknown deck profile override key/,
    );
    expect(() => parseHeuristicsAbProfileOverride("blockDirectStealsAtLeast=NaN")).toThrow(
      /finite number/,
    );
    expect(() => parseHeuristicsAbProfileOverride("pacing=fast")).toThrow(
      /develop-first or attack-first/,
    );
  });
});
