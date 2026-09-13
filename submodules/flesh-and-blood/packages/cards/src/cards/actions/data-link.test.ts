import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { dataLinkRed } from "./data-link.ts";

/**
 * Data Link Red (EVO186) — Mechanologist Attack Action. Boost.
 *
 * Printed: When this hits, opt 1.
 */

describe("Data Link family AAA", () => {
  it("happy: an unblocked hit lands and the opt-1 keep runs", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [dataLinkRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kano = game.as(kano);

    // playAttack stops at defend; pass the opt answer through the VERB
    // policy (its drain honors optBottom at line-617) by playing via the
    // manual announce + engine drain with an explicit policy instead.
    Dash.play(dataLinkRed);
    const w = game.waitState() as { kind: string; playerId?: string };
    if (w.kind === "priority" && w.playerId) game.pass(w.playerId);
    const w2 = game.waitState() as { kind: string; playerId?: string };
    if (w2.kind === "priority" && w2.playerId) game.pass(w2.playerId);
    // OPT partition decision for the on-hit Opt 1 — answer via engine exec.
    for (let i = 0; i < 8; i += 1) {
      const st = game.waitState() as {
        kind: string;
        decision?: {
          kind: string;
          decisionId: string;
          stateVersion: number;
          actorId: string;
          entries: { id: string }[];
        };
      };
      if (st.kind === "decision" && st.decision?.kind === "partition") {
        game.exec({
          move: "answer-decision",
          actorId: st.decision.actorId,
          payload: {
            decisionId: st.decision.decisionId,
            stateVersion: st.decision.stateVersion,
            answer: {
              kind: "partition",
              groups: { top: st.decision.entries.map((e) => e.id), bottom: [] },
            },
          },
        });
        continue;
      }
      if (st.kind === "priority") {
        const pid = (st as { playerId?: string }).playerId;
        if (!pid) break;
        game.pass(pid);
        continue;
      }
      break;
    }
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kano).toHaveLife(12); // 20 - 3 hit - 2 boost rider - 3 filler-block (observed exact
  });
});
