import { describe, expect, it } from "vite-plus/test";
import type { FilteredCardView, PacketAnimation } from "@tcg/gundam-engine";
import type { AnimationStepV2 } from "@tcg/protocol";
import {
  gundamAnimationPlan,
  gundamLifecycleAnimationSteps,
  gundamPacketAnimationToAnimationPlans,
  prepareGundamSharedAnimationSteps,
  sequenceGundamAnimationGroups,
  type GundamAnimationView,
} from "./gundam-animation.js";

const empty: GundamAnimationView = { zones: { zones: {} }, players: [] };
function card(id: string, zoneId: string): FilteredCardView {
  return {
    instanceId: id,
    definition: null,
    definitionId: null,
    meta: null,
    ownerId: "p2",
    controllerId: "p2",
    faceDown: true,
    zoneId,
  };
}
function view(zoneId: string, cards: FilteredCardView[]): GundamAnimationView {
  return { zones: { zones: { [zoneId]: { cards, count: cards.length } } }, players: [] };
}
describe("Gundam animation authoring", () => {
  it("uses the same transfer plan for local and server events", () => {
    const animation: PacketAnimation = {
      id: "draw",
      type: "cardMove",
      duration: 420,
      data: { kind: "cardMove", cardId: "card", ownerId: "p2", fromZone: "deck", toZone: "hand" },
    };
    const local = prepareGundamSharedAnimationSteps(
      gundamPacketAnimationToAnimationPlans({ animation }, empty, null).flatMap(
        (plan) => plan.steps,
      ),
    );
    expect(gundamAnimationPlan("server", [animation], "p2", empty)?.steps).toEqual(local);
    expect(local[0]).toMatchObject({
      durationMs: 800,
      sourceFace: "hidden",
      destinationFace: "hidden",
    });
  });
  it("keeps causal groups sequential and simultaneous results together", () => {
    const first: AnimationStepV2 = { id: "entry", type: "hold", durationMs: 800 };
    const result: AnimationStepV2 = { id: "result", type: "hold", durationMs: 1400 };
    expect(
      sequenceGundamAnimationGroups([
        { steps: [first], durationMs: 800 },
        { steps: [result, { ...result, id: "other-result" }], durationMs: 1750 },
        { steps: [{ ...first, id: "cleanup" }], durationMs: 800 },
      ]).map((step) => step.startAtMs),
    ).toEqual([0, 800, 800, 2550]);
  });
  it("does not add another delay or reading pause to an already normalized server plan", () => {
    const steps: AnimationStepV2[] = [
      {
        id: "damage",
        type: "combat",
        source: { kind: "entity", id: "a" },
        target: { kind: "entity", id: "b" },
        reason: "resolved",
      },
      {
        id: "trash",
        type: "entityTransfer",
        entity: { kind: "entity", id: "b" },
        to: { kind: "zone", id: "trash:p2" },
        sourceFace: "public",
        destinationFace: "public",
      },
    ];
    const normalized = prepareGundamSharedAnimationSteps(steps);
    expect(prepareGundamSharedAnimationSteps(normalized)).toEqual(normalized);
    expect(normalized.find((step) => step.id === "trash")?.startAtMs).toBe(1750);
  });
  it("caps deal staggering and keeps opponent setup cards concealed", () => {
    const after = view(
      "hand:p2",
      Array.from({ length: 10 }, (_, i) => card(`card-${i}`, "hand:p2")),
    );
    const steps = prepareGundamSharedAnimationSteps(
      gundamLifecycleAnimationSteps(empty, after, [], "p1"),
    );
    const moves = steps.filter((step) => step.type === "entityTransfer");
    expect(moves).toHaveLength(10);
    expect(
      moves.every((step) => step.sourceFace === "hidden" && step.destinationFace === "hidden"),
    ).toBe(true);
    expect(moves.at(-1)?.startAtMs).toBe(600);
    expect(gundamLifecycleAnimationSteps(empty, after, steps, "p1")).toEqual([]);
  });
  it("derives lifecycle resource placement from the resource deck", () => {
    const steps = gundamLifecycleAnimationSteps(
      empty,
      view("resourceArea:p2", [card("resource", "resourceArea:p2")]),
      [],
      "p1",
    );
    expect(steps[0]).toMatchObject({
      from: { id: "resourceDeck:p2" },
      to: { id: "resourceArea:p2" },
      sourceFace: "hidden",
      destinationFace: "public",
    });
  });
  it.each(["resourcesSpent", "hpRecovered"])(
    "preserves zero and rejects invalid %s amounts",
    (name) => {
      const map = (amount: unknown) =>
        gundamPacketAnimationToAnimationPlans(
          {
            animation: {
              id: "numeric",
              type: "generic",
              duration: 320,
              data: { kind: "generic", name, params: { playerId: "p2", cardId: "card", amount } },
            },
          },
          empty,
          "p2",
        ).flatMap((plan) => plan.steps);
      expect(map(0).some((step) => step.type === "valueDelta" && step.delta === 0)).toBe(true);
      for (const invalid of [undefined, null, "0", NaN, Infinity]) expect(map(invalid)).toEqual([]);
    },
  );
  it("gives source-less resource packets one deck-to-area transfer on both paths", () => {
    const after = view("resourceArea:p2", [card("resource", "resourceArea:p2")]);
    const animation: PacketAnimation = {
      id: "resource-placed",
      type: "cardMove",
      duration: 420,
      data: { kind: "cardMove", cardId: "resource", ownerId: "p2", toZone: "resourceArea" },
    };
    const local = gundamPacketAnimationToAnimationPlans({ animation }, after, "p2").flatMap(
      (plan) => plan.steps,
    );
    const server = gundamAnimationPlan("server", [animation], "p2", after)!.steps;
    for (const steps of [local, server]) {
      expect(steps.filter((step) => step.type === "entityTransfer")).toEqual([
        expect.objectContaining({
          from: { kind: "zone", id: "resourceDeck:p2", ownerId: "p2" },
          to: { kind: "zone", id: "resourceArea:p2", ownerId: "p2" },
          sourceFace: "hidden",
          destinationFace: "public",
        }),
      ]);
      expect(gundamLifecycleAnimationSteps(empty, after, steps, "p2")).toEqual([]);
    }
  });
});
