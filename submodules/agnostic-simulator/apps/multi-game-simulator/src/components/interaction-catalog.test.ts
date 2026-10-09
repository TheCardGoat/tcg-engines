import { describe, expect, it } from "vitest";
import {
  EngineInteractionView,
  buildInteractionSubmission,
  validateInteractionSubmission,
} from "@tcg/protocol";
import { interactionCatalog } from "./interaction-catalog";

describe("interaction test inventory", () => {
  it("covers every protocol input kind", () => {
    expect(
      [
        ...new Set(
          interactionCatalog.flatMap((item) =>
            item.view.actions.flatMap((action) => action.inputs.map((input) => input.kind)),
          ),
        ),
      ].sort(),
    ).toEqual([
      "boolean",
      "entity-allocation",
      "entity-partition",
      "entity-selection",
      "number",
      "option-selection",
      "ordering",
    ]);
    expect(new Set(interactionCatalog.map((item) => item.id)).size).toBe(interactionCatalog.length);
  });
  for (const fixture of interactionCatalog) {
    it(`${fixture.id}: valid view and submittable answer`, () => {
      expect(EngineInteractionView.safeParse(fixture.view).success).toBe(true);
      const action = fixture.view.actions[0];
      if (!action) return;
      const submission = buildInteractionSubmission({
        view: fixture.view,
        action,
        values: fixture.validValues,
      });
      expect(validateInteractionSubmission(fixture.view, submission)).toMatchObject({ ok: true });
      expect(
        validateInteractionSubmission({ ...fixture.view, stateVersion: 8 }, submission),
      ).toMatchObject({ ok: false });
    });
  }
});
