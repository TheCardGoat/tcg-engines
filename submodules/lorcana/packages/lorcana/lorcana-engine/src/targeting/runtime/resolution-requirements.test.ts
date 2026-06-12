import { describe, expect, it } from "bun:test";
import {
  analyzeResolutionRequirements,
  allowsExplicitEmptyTargetSelection,
  canAutoResolve,
  isOptionalResolution,
  requiresAmountSelection,
  requiresExplicitTargetSelection,
} from "./resolution-requirements";

describe("resolution-requirements", () => {
  it("classifies optional no-target effects as optional but not auto-resolvable", () => {
    const effect = {
      type: "optional",
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };

    expect(isOptionalResolution(effect)).toBe(true);
    expect(requiresExplicitTargetSelection(effect)).toBe(false);
    expect(canAutoResolve(effect)).toBe(false);
  });

  it("classifies optional chosen-target effects as optional and target-requiring", () => {
    const effect = {
      type: "optional",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
    };

    const analysis = analyzeResolutionRequirements(effect);
    expect(analysis.isOptional).toBe(true);
    expect(analysis.requiresExplicitTargetSelection).toBe(true);
    expect(analysis.allowsExplicitEmptyTargetSelection).toBe(false);
    expect(analysis.canAutoResolve).toBe(false);
  });

  it("classifies chosen-player effects as requiring explicit target selection", () => {
    expect(
      requiresExplicitTargetSelection({
        type: "gain-lore",
        amount: 1,
        target: "CHOSEN_PLAYER",
      }),
    ).toBe(true);
  });

  it("allows explicit empty target selection for up-to chosen targets", () => {
    const effect = {
      type: "exert",
      target: {
        selector: "chosen",
        count: { upTo: 1 },
        owner: "opponent",
        zones: ["play"],
        cardTypes: ["character"],
      },
    };

    expect(requiresExplicitTargetSelection(effect)).toBe(true);
    expect(allowsExplicitEmptyTargetSelection(effect)).toBe(true);
    expect(canAutoResolve(effect)).toBe(false);
  });

  it("classifies put-into-inkwell from hand as requiring explicit target selection", () => {
    const effect = {
      type: "put-into-inkwell",
      source: "hand",
      target: "CONTROLLER",
      facedown: true,
    };

    expect(requiresExplicitTargetSelection(effect)).toBe(true);
    expect(allowsExplicitEmptyTargetSelection(effect)).toBe(false);
  });

  it("classifies up-to remove-damage as amount-selectable but auto-resolvable", () => {
    const effect = {
      type: "remove-damage",
      amount: { type: "up-to", value: 3 },
      target: "YOUR_CHARACTERS",
    };

    expect(requiresAmountSelection(effect)).toBe(true);
    expect(canAutoResolve(effect)).toBe(true);
  });

  it("classifies up-to move-damage as amount-selectable but not target-free", () => {
    const effect = {
      type: "move-damage",
      amount: { type: "up-to", value: 2 },
      from: "CHOSEN_CHARACTER",
      to: "CHOSEN_OPPOSING_CHARACTER",
    };

    expect(requiresAmountSelection(effect)).toBe(true);
    expect(requiresExplicitTargetSelection(effect)).toBe(true);
    expect(canAutoResolve(effect)).toBe(false);
  });
});
