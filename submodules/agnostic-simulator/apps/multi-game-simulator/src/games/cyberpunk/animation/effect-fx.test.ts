import { describe, expect, it } from "vite-plus/test";
import type { AnimationStepV2 } from "@tcg/protocol";

import {
  classifyCyberpunkEffectFx,
  omitCyberpunkOwnedAudioCues,
  type CyberpunkCompiledFxStep,
  type CyberpunkFxEntityIdentity,
} from "./effect-fx";

const compiled = (
  id: string,
  step: AnimationStepV2,
  startAtMs = 0,
  durationMs = 400,
): CyberpunkCompiledFxStep => ({ step, startAtMs, durationMs });

const defeatTransfer = (id: string, entityId: string, startAtMs = 0, durationMs = 400) =>
  compiled(
    id,
    {
      id,
      type: "entityTransfer",
      entity: { kind: "entity", id: entityId },
      from: { kind: "zone", id: "p-field", ownerId: "p1" },
      to: { kind: "zone", id: "p-trash", ownerId: "p1" },
      sourceFace: "public",
      destinationFace: "public",
      sourcePresentation: "hold",
      audioCue: "card.destroy",
    },
    startAtMs,
    durationMs,
  );

const identities: Record<string, CyberpunkFxEntityIdentity> = {
  "smasher-1": {
    canonicalId: "adam-smasher-metal-over-meat",
    cardType: "unit",
    title: "Adam Smasher, Metal Over Meat",
  },
  "legend-1": {
    canonicalId: "adam-smasher-ender-of-legends",
    cardType: "legend",
    title: "Adam Smasher, Ender of Legends",
  },
  "gear-7": { canonicalId: "some-gear", cardType: "gear", title: "Some Gear" },
};
const resolve = (entityId: string) => identities[entityId];

describe("classifyCyberpunkEffectFx", () => {
  it("classifies card.destroy transfers as defeats and leaves other transfers alone", () => {
    const plan = classifyCyberpunkEffectFx([
      defeatTransfer("exit-1", "unit-1", 120),
      compiled("move-1", {
        id: "move-1",
        type: "entityTransfer",
        entity: { kind: "entity", id: "unit-2" },
        from: { kind: "zone", id: "p-hand", ownerId: "p1" },
        to: { kind: "zone", id: "p-trash", ownerId: "p1" },
        sourceFace: "public",
        destinationFace: "public",
        audioCue: "card.discard",
      }),
    ]);

    expect(plan.defeats).toHaveLength(1);
    expect(plan.defeats[0]).toMatchObject({ entityId: "unit-1", startAtMs: 120 });
    expect(plan.wipe).toBeNull();
  });

  it("classifies negative-tone emphasizes as lock-ons with their label", () => {
    const plan = classifyCyberpunkEffectFx([
      compiled("lock-1", {
        id: "lock-1",
        type: "emphasize",
        at: { kind: "entity", id: "unit-5" },
        style: "pulse",
        tone: "negative",
        label: "CAN'T ATTACK",
      }),
    ]);

    expect(plan.lockOns).toHaveLength(1);
    expect(plan.lockOns[0]).toMatchObject({
      entityId: "unit-5",
      label: "CAN'T ATTACK",
    });
  });

  it("classifies legendArea→field transfers as go solo, vetoing non-legends", () => {
    const goSoloTransfer = (id: string, entityId: string) =>
      compiled(id, {
        id,
        type: "entityTransfer",
        entity: { kind: "entity", id: entityId },
        from: { kind: "zone", id: "p-legendArea", ownerId: "p1" },
        to: { kind: "zone", id: "p-field", ownerId: "p1" },
        sourceFace: "hidden",
        destinationFace: "public",
        audioCue: "card.move",
      });

    const plan = classifyCyberpunkEffectFx(
      [goSoloTransfer("solo-1", "legend-1"), goSoloTransfer("solo-2", "gear-7")],
      resolve,
    );

    expect(plan.goSolos).toHaveLength(1);
    expect(plan.goSolos[0]).toMatchObject({ entityId: "legend-1" });
  });

  it("detects a Smasher board wipe from overlapping negative effect targets", () => {
    const plan = classifyCyberpunkEffectFx(
      [
        compiled(
          "effect-1",
          {
            id: "effect-1",
            type: "effect",
            source: { kind: "entity", id: "smasher-1" },
            targets: [
              { kind: "entity", id: "unit-a" },
              { kind: "entity", id: "unit-b" },
            ],
            tone: "negative",
            label: "Defeat",
            showText: false,
          },
          0,
          700,
        ),
        defeatTransfer("exit-a", "unit-a", 500),
        defeatTransfer("exit-b", "unit-b", 500),
      ],
      resolve,
    );

    expect(plan.wipe).not.toBeNull();
    expect(plan.wipe).toMatchObject({
      sourceEntityId: "smasher-1",
      sourceTitle: "ADAM SMASHER, METAL OVER MEAT",
      startAtMs: 0,
      impactAtMs: 500,
    });
    expect(plan.wipe?.targets.map((target) => target.entityId)).toEqual(["unit-a", "unit-b"]);
  });

  it("does not trigger a wipe for combat mutual kills without an effect beat", () => {
    const combatCovered = (id: string, entityId: string, startAtMs: number) =>
      compiled(
        id,
        {
          id,
          type: "combat",
          source: { kind: "entity", id: "attacker-1" },
          target: { kind: "entity", id: entityId },
          reason: "resolved",
          attackKind: "fight",
          defeatedCardIds: [entityId],
          showText: true,
        },
        startAtMs,
      );
    const plan = classifyCyberpunkEffectFx([
      combatCovered("fight-a", "unit-a", 600),
      combatCovered("fight-b", "unit-b", 600),
      defeatTransfer("exit-a", "unit-a", 700),
      defeatTransfer("exit-b", "unit-b", 700),
    ]);

    expect(plan.wipe).toBeNull();
    expect(plan.defeats).toHaveLength(2);
  });

  it("detects the wipe for an untargeted mass defeat and attributes the played unit", () => {
    const plan = classifyCyberpunkEffectFx(
      [
        compiled(
          "play-1",
          {
            id: "play-1",
            type: "entityTransfer",
            entity: { kind: "entity", id: "smasher-1" },
            from: { kind: "zone", id: "p-hand", ownerId: "p1" },
            to: { kind: "zone", id: "p-field", ownerId: "p1" },
            sourceFace: "public",
            destinationFace: "public",
            audioCue: "card.play",
          },
          0,
          800,
        ),
        defeatTransfer("exit-a", "unit-a", 600),
        defeatTransfer("exit-b", "unit-b", 600),
        defeatTransfer("exit-c", "unit-c", 600),
      ],
      resolve,
    );

    expect(plan.wipe).not.toBeNull();
    expect(plan.wipe).toMatchObject({
      sourceEntityId: "smasher-1",
      sourceTitle: "ADAM SMASHER, METAL OVER MEAT",
      impactAtMs: 600,
    });
    expect(plan.wipe?.targets).toHaveLength(3);
  });

  it("does not trigger a wipe for a single defeat", () => {
    const plan = classifyCyberpunkEffectFx(
      [
        compiled("effect-1", {
          id: "effect-1",
          type: "effect",
          source: { kind: "entity", id: "smasher-1" },
          targets: [{ kind: "entity", id: "unit-a" }],
          tone: "negative",
          label: "Defeat",
          showText: false,
        }),
        defeatTransfer("exit-a", "unit-a", 300),
      ],
      resolve,
    );

    expect(plan.wipe).toBeNull();
  });

  it("does not trigger a wipe without an Adam Smasher source", () => {
    const plan = classifyCyberpunkEffectFx(
      [
        compiled("effect-1", {
          id: "effect-1",
          type: "effect",
          source: { kind: "entity", id: "some-other-unit" },
          targets: [{ kind: "entity", id: "bystander" }],
          tone: "negative",
          label: "Defeat",
          showText: false,
        }),
        defeatTransfer("exit-a", "unit-a", 300),
        defeatTransfer("exit-b", "unit-b", 300),
      ],
      resolve,
    );

    expect(plan.wipe).toBeNull();
    // The defeats still render as their per-card moments.
    expect(plan.defeats).toHaveLength(2);
  });

  it("does not trigger a wipe when combat defeats leak past the combat step coverage", () => {
    // A blocker redirect: the killed blocker is absent from the combat step's
    // defeatedCardIds, so its exit reads as uncovered — it must still never
    // sweep the board without a Smasher effect behind it.
    const plan = classifyCyberpunkEffectFx([
      compiled("fight-1", {
        id: "fight-1",
        type: "combat",
        source: { kind: "entity", id: "attacker-1" },
        target: { kind: "entity", id: "unit-a" },
        reason: "resolved",
        attackKind: "fight",
        defeatedCardIds: ["unit-a"],
        showText: true,
      }),
      defeatTransfer("exit-a", "unit-a", 700),
      defeatTransfer("exit-b", "blocker-b", 700),
    ]);

    expect(plan.wipe).toBeNull();
    expect(plan.defeats).toHaveLength(2);
  });

  it("computes endAtMs across every classified moment", () => {
    const plan = classifyCyberpunkEffectFx([
      defeatTransfer("exit-a", "unit-a", 100, 400),
      compiled(
        "lock-1",
        {
          id: "lock-1",
          type: "emphasize",
          at: { kind: "entity", id: "unit-a" },
          style: "pulse",
          tone: "negative",
        },
        200,
        600,
      ),
    ]);

    expect(plan.endAtMs).toBe(800);
  });
});

describe("omitCyberpunkOwnedAudioCues", () => {
  it("drops the defeat cue the FX soundscape replaces and keeps the rest", () => {
    const cues = [
      { planId: "p", stepId: "s1", cue: "card.destroy", startAtMs: 0 },
      { planId: "p", stepId: "s2", cue: "card.discard", startAtMs: 10 },
      { planId: "p", stepId: "s3", cue: "combat.hit", startAtMs: 20 },
    ];

    expect(omitCyberpunkOwnedAudioCues(cues).map((cue) => cue.cue)).toEqual([
      "card.discard",
      "combat.hit",
    ]);
  });
});
