import { describe, expect, it } from "bun:test";
import { probeSupport } from "../probe";
import { PROBE_REGISTRIES, PROBE_VERSION } from "../registries";

describe("support-probe / probeSupport", () => {
  describe("shorthand inputs", () => {
    it("returns ok for a known effect type", () => {
      const result = probeSupport({ effect: "deal-damage" });
      expect(result.ok).toBe(true);
      expect(result.checks).toHaveLength(1);
      expect(result.checks[0]).toMatchObject({
        surface: "effect",
        value: "deal-damage",
        status: "ok",
      });
    });

    it("returns missing for an unknown effect type", () => {
      const result = probeSupport({ effect: "imaginary-effect" });
      expect(result.ok).toBe(false);
      expect(result.missing).toHaveLength(1);
      expect(result.missing[0]).toMatchObject({
        surface: "effect",
        value: "imaginary-effect",
        status: "missing",
        registry: "ACTION_EFFECT_RESOLVER_TYPES",
      });
    });

    it("returns ok for a known condition type", () => {
      const result = probeSupport({ condition: "has-named-character" });
      expect(result.ok).toBe(true);
    });

    it("returns missing for an unknown condition type", () => {
      const result = probeSupport({ condition: "has-favorite-color" });
      expect(result.ok).toBe(false);
      expect(result.missing[0]?.registry).toBe("CONDITION_VARIANT_TYPES");
    });

    it("recognizes target enum aliases", () => {
      const result = probeSupport({ target: "CHOSEN_CHARACTER" });
      expect(result.ok).toBe(true);
      expect(result.checks[0]?.surface).toBe("target-enum");
    });

    it("recognizes target selector keywords", () => {
      const result = probeSupport({ target: { selector: "chosen" } });
      expect(result.ok).toBe(true);
      expect(result.checks[0]?.surface).toBe("target");
    });

    it("flags an unknown target enum", () => {
      const result = probeSupport({ target: "CHOSEN_NEMESIS" });
      expect(result.ok).toBe(false);
    });

    it("recognizes trigger event + subject pairs", () => {
      const result = probeSupport({ trigger: { event: "play", on: "SELF" } });
      expect(result.ok).toBe(true);
      expect(result.checks).toHaveLength(2);
    });

    it("flags an unknown trigger event", () => {
      const result = probeSupport({ trigger: { event: "imagine" } });
      expect(result.ok).toBe(false);
      expect(result.missing[0]?.surface).toBe("trigger-event");
    });
  });

  describe("ability traversal", () => {
    it("walks a triggered ability and reports each surface as ok", () => {
      const result = probeSupport({
        ability: {
          type: "triggered",
          trigger: { event: "play", on: "SELF", timing: "when" },
          condition: { type: "is-exerted" },
          effect: {
            type: "deal-damage",
            amount: 2,
            target: "CHOSEN_CHARACTER",
          },
        },
      });
      expect(result.ok).toBe(true);
      const valuesByPath = Object.fromEntries(result.checks.map((c) => [c.path, c.value]));
      expect(valuesByPath["ability.type"]).toBe("triggered");
      expect(valuesByPath["ability.trigger.event"]).toBe("play");
      expect(valuesByPath["ability.trigger.on"]).toBe("SELF");
      expect(valuesByPath["ability.condition.type"]).toBe("is-exerted");
      expect(valuesByPath["ability.effect.type"]).toBe("deal-damage");
      expect(valuesByPath["ability.effect.target"]).toBe("CHOSEN_CHARACTER");
    });

    it("recurses into sequence steps", () => {
      const result = probeSupport({
        ability: {
          type: "action",
          effect: {
            type: "sequence",
            steps: [
              { type: "draw", amount: 1, target: "CONTROLLER" },
              { type: "deal-damage", amount: 1, target: "CHOSEN_CHARACTER" },
            ],
          },
        },
      });
      expect(result.ok).toBe(true);
      const types = result.checks.filter((c) => c.surface === "effect").map((c) => c.value);
      expect(types).toContain("sequence");
      expect(types).toContain("draw");
      expect(types).toContain("deal-damage");
    });

    it("recurses into optional and choice", () => {
      const result = probeSupport({
        ability: {
          type: "triggered",
          trigger: { event: "quest", on: "SELF" },
          effect: {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "choice",
              choices: [
                { effect: { type: "draw", amount: 1, target: "CONTROLLER" } },
                { effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" } },
              ],
            },
          },
        },
      });
      expect(result.ok).toBe(true);
      const types = result.checks.filter((c) => c.surface === "effect").map((c) => c.value);
      expect(types).toEqual(expect.arrayContaining(["optional", "choice", "draw", "gain-lore"]));
    });

    it("recurses into and/or boolean conditions", () => {
      const result = probeSupport({
        ability: {
          type: "static",
          condition: {
            type: "and",
            conditions: [
              { type: "your-turn" },
              { type: "or", conditions: [{ type: "exerted" }, { type: "no-damage" }] },
            ],
          },
          effect: {
            type: "modify-stat",
            stat: "strength",
            modifier: 1,
            target: "SELF",
          },
        },
      });
      expect(result.ok).toBe(true);
      const condTypes = result.checks.filter((c) => c.surface === "condition").map((c) => c.value);
      expect(condTypes).toEqual(
        expect.arrayContaining(["and", "your-turn", "or", "exerted", "no-damage"]),
      );
    });

    it("flags a single bad surface inside an otherwise valid ability", () => {
      const result = probeSupport({
        ability: {
          type: "triggered",
          trigger: { event: "play", on: "SELF" },
          effect: {
            type: "sequence",
            steps: [
              { type: "draw", amount: 1, target: "CONTROLLER" },
              { type: "summon-the-beast", target: "CHOSEN_CHARACTER" },
            ],
          },
        },
      });
      expect(result.ok).toBe(false);
      expect(result.missing).toHaveLength(1);
      expect(result.missing[0]).toMatchObject({
        surface: "effect",
        value: "summon-the-beast",
        path: "ability.effect.steps[1].type",
      });
    });

    it("reports trigger-subject when supplied as a string", () => {
      const result = probeSupport({
        ability: {
          type: "triggered",
          trigger: { event: "challenge", on: "OPPONENT_CHARACTERS" },
        },
      });
      expect(result.ok).toBe(true);
      expect(
        result.checks.some(
          (c) => c.surface === "trigger-subject" && c.value === "OPPONENT_CHARACTERS",
        ),
      ).toBe(true);
    });

    it("accepts query-shape trigger subjects without flagging them", () => {
      const result = probeSupport({
        ability: {
          type: "triggered",
          trigger: {
            event: "play",
            on: { controller: "you", cardType: "character" },
          },
        },
      });
      expect(result.ok).toBe(true);
      expect(result.checks.every((c) => c.surface !== "trigger-subject")).toBe(true);
    });
  });

  describe("metadata", () => {
    it("stamps a probe version", () => {
      const result = probeSupport({ effect: "draw" });
      expect(result.probeVersion).toBe(PROBE_VERSION);
    });

    it("registries are non-empty and frozen", () => {
      expect(PROBE_REGISTRIES.effectTypes.length).toBeGreaterThan(0);
      expect(PROBE_REGISTRIES.conditionTypes.length).toBeGreaterThan(0);
      expect(PROBE_REGISTRIES.targetSelectors.length).toBeGreaterThan(0);
      expect(Object.isFrozen(PROBE_REGISTRIES)).toBe(true);
    });
  });
});
