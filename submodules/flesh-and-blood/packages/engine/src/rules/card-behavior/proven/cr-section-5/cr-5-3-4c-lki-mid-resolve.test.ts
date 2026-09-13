/**
 * CR 5.3.4c — last known information mid-resolution.
 *
 * "If the layer no longer exists after the generation of an effect, the last
 * known information of the layer is used to determine the remainder of the
 * resolution abilities and the effects that are generated."
 *
 * Arrange: a non-attack Action whose resolution is a `sequence` whose FIRST
 * effect destroys its own source (`destroy self`) and whose SECOND effect
 * references that source — drawing cards equal to the source's base power.
 * After the first effect commits, the source has left the stack (it is in the
 * graveyard), so reading "this's power" for the second effect is only possible
 * through the layer's retained last-known-information snapshot.
 *
 * Act: play the action and resolve it.
 *
 * Assert: the controller drew cards equal to the source's base power (3) even
 * though the source was destroyed mid-resolution, and the source is in the
 * graveyard. The draw count resolves through `resolveLayerAmount`, which
 * injects `layer.source` as LKI (`proposals/shared.ts`), and the
 * `base-power-of-source` countable reads `baseNumeric.power` off that LKI
 * snapshot (`evaluation/amounts/count.ts`).
 */
import { describe, expect, it } from "vitest";
import { defineFleshAndBloodCard } from "@tcg/flesh-and-blood-types";
import { FabTestEngine } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";

// Non-attack Action (power 3) whose resolution destroys its own source FIRST,
// then draws cards equal to the source's base power. The second effect must
// read the source through LKI once the first effect has destroyed it.
const lkiSelfDestroyDraw = defineFleshAndBloodCard({
  canonicalId: "cr-5-3-4c-lki-self-destroy-draw",
  slug: "cr-5-3-4c-lki-self-destroy-draw",
  types: ["Generic", "Action"],
  color: "Red",
  pitch: "1",
  cost: 0,
  power: 3,
  defense: 3,
  abilities: [
    {
      id: "cr-5-3-4c-lki-self-destroy-draw-a1",
      kind: "resolution",
      text: "Destroy this. Draw cards equal to this's power.",
      effect: {
        type: "sequence",
        steps: [
          { type: "destroy", target: { selector: "self" } },
          {
            type: "draw",
            count: { type: "count", what: "base-power-of-source" },
            player: "controller",
          },
        ],
      },
    },
  ],
});

describe("CR 5.3.4c — after an effect destroys the layer source, later effects use last known information", () => {
  it("a resolution sequence that destroys self then references self's power still draws via LKI", () => {
    // Arrange — Bravo holds only the self-destroying action and a 6-card deck.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [lkiSelfDestroyDraw], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Act — play the action and resolve it. The sequence's first effect
    // destroys the source; the second draws equal to its (now LKI) power.
    Bravo.play(lkiSelfDestroyDraw);
    game.helpers.resolveUntilIdle();

    // Assert — the source destroyed itself mid-resolution and is in the yard.
    expect(Bravo.zone("graveyard")).toContain(lkiSelfDestroyDraw.canonicalId);
    expect(Bravo.zone("stack")).not.toContain(lkiSelfDestroyDraw.canonicalId);

    // ... yet the second effect resolved against the layer's retained LKI: the
    // source's base power (3) was read AFTER destruction, drawing exactly 3.
    expect(Bravo.hand()).toHaveLength(3);

    // The destroy event committed against the source, and the 3 draws each
    // committed — observable proof the second effect ran off LKI.
    expect(
      game
        .committedEvents()
        .some(
          (event) =>
            event.name === "destroy" &&
            event.data.object.canonicalId === lkiSelfDestroyDraw.canonicalId,
        ),
    ).toBe(true);
    expect(
      game
        .committedEvents()
        .filter((event) => event.name === "draw" && event.data.playerId === game.as(bravo).id),
    ).toHaveLength(3);
  });
});
