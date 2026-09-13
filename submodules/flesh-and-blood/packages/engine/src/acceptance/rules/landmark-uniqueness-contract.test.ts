import { describe, expect, it } from "vitest";
import { defineFleshAndBloodCard } from "@tcg/flesh-and-blood-types";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";
import { trainerId } from "../../rules/test-trainers.ts";
import { korshemCrossroadOfElements } from "../../../../cards/src/cards/actions/korshem-crossroad-of-elements.ts";
import { greatLibraryOfSolana } from "../../../../cards/src/cards/actions/great-library-of-solana.ts";

// A Landmark whose "when this leaves the arena" trigger creates a Gold token.
// Used to verify CR 8.2.9b clears still fire leave-arena observations even
// though the clear is no longer routed as a `destroy` event (previously a raw
// arena.splice bypassed them and this trigger would never have fired on a
// cleared Landmark).
const leaveTriggerLandmark = defineFleshAndBloodCard({
  canonicalId: trainerId("fx-landmark-leave"),
  slug: "fx-landmark-leave",
  types: ["Landmark", "Action"],
  cost: 0,
  defense: 3,
  abilities: [
    {
      kind: "static",
      staticKind: "triggered",
      id: "fx-landmark-leave-a1",
      text: "When this leaves the arena, create a Gold token under your control.",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "create-token", token: "gold", controller: "controller" },
      },
    },
  ],
});

// A Landmark whose "when this is destroyed" trigger creates a Gold token.
// CR 3.0.12 defines clearing as distinct from destroy: clearing a Landmark via
// CR 8.2.9b must move it to the graveyard WITHOUT firing destroy triggers. This
// card distinguishes the fix from the pre-fix `destroy`-event routing, which
// would have wrongly created a Gold on clear.
const destroyTriggerLandmark = defineFleshAndBloodCard({
  canonicalId: trainerId("fx-landmark-destroy"),
  slug: "fx-landmark-destroy",
  types: ["Landmark", "Action"],
  cost: 0,
  defense: 3,
  abilities: [
    {
      kind: "static",
      staticKind: "triggered",
      id: "fx-landmark-destroy-a1",
      text: "When this is destroyed, create a Gold token under your control.",
      trigger: {
        kind: "event",
        event: {
          name: "destroy",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "create-token", token: "gold", controller: "controller" },
      },
    },
  ],
});

describe("CR 8.2.9b Landmark uniqueness", () => {
  it("entering a Landmark clears the previous Landmark from the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [greatLibraryOfSolana],
        hand: [korshemCrossroadOfElements],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    // Great Library is present before the second landmark resolves.
    expect(Bravo.zone("arena")).toContain(greatLibraryOfSolana.canonicalId);

    Bravo.play(korshemCrossroadOfElements);
    game.helpers.resolveRestOfCombat();

    // Korshem is now the only landmark in the arena; Great Library was cleared.
    expect(Bravo.zone("arena")).toContain(korshemCrossroadOfElements.canonicalId);
    expect(Bravo.zone("arena")).not.toContain(greatLibraryOfSolana.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(greatLibraryOfSolana.canonicalId);
  });

  it("clears an OPPONENT's existing Landmark too (CR 8.2.9b is global, not controller-scoped)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [korshemCrossroadOfElements],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [greatLibraryOfSolana], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    // Dash controls a Landmark before Bravo plays one.
    expect(Dash.zone("arena")).toContain(greatLibraryOfSolana.canonicalId);

    Bravo.play(korshemCrossroadOfElements);
    game.helpers.resolveRestOfCombat();

    // CR 8.2.9b: ALL other Landmark permanents are cleared — including the
    // opponent's. Pre-fix this was scoped to the entering controller only, so
    // Dash's Great Library wrongly survived.
    expect(Bravo.zone("arena")).toContain(korshemCrossroadOfElements.canonicalId);
    expect(Dash.zone("arena")).not.toContain(greatLibraryOfSolana.canonicalId);
    expect(Dash.zone("graveyard")).toContain(greatLibraryOfSolana.canonicalId);
  });

  it("a leave-arena trigger observes the cleared Landmark (CR 8.2.9b event pipeline)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [leaveTriggerLandmark],
        hand: [korshemCrossroadOfElements],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arena")).toContain(leaveTriggerLandmark.canonicalId);

    Bravo.play(korshemCrossroadOfElements);
    game.helpers.resolveRestOfCombat();

    // Korshem cleared the leave-trigger Landmark via a destroy follow-up. The
    // cleared Landmark's leave-arena trigger observed the departure → a Gold
    // token is created. Pre-fix (raw arena.splice) leave-arena never fired, so
    // no Gold would appear.
    expect(Bravo.zone("arena")).not.toContain(leaveTriggerLandmark.canonicalId);
    expect(Bravo.zone("arena")).toContain(korshemCrossroadOfElements.canonicalId);
    expect(Bravo.zone("arena")).toContain("token:gold");
  });

  it("does NOT fire a destroy trigger when a Landmark is cleared (CR 3.0.12 clear ≠ destroy)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [destroyTriggerLandmark],
        hand: [korshemCrossroadOfElements],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.play(korshemCrossroadOfElements);
    game.helpers.resolveRestOfCombat();

    // The destroy-trigger Landmark was CLEARED to the graveyard by Korshem...
    expect(Bravo.zone("arena")).not.toContain(destroyTriggerLandmark.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(destroyTriggerLandmark.canonicalId);
    // ...but clearing is not destruction (CR 3.0.12), so its "when this is
    // destroyed" trigger must NOT have fired — no Gold token. Pre-fix the clear
    // was a `destroy` event, so this would have wrongly created a Gold.
    expect(Bravo.zone("arena")).not.toContain("token:gold");
  });
});
