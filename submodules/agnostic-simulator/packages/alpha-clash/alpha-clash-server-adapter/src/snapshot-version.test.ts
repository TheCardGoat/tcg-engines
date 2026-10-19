import { expect, it } from "vite-plus/test";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
import { alphaClashRestoreEngine, alphaClashSerializeEngine } from "./alpha-clash-engine-lifecycle";

const seats = { alice: "player-one", bob: "player-two" } as const;
const restoreContext = {
  gameSlug: "alpha-clash",
  player1Id: "alice",
  player2Id: "bob",
  seed: "restore",
};
const maps = { cardInstances: {}, owners: {} };
function saved() {
  const engine = new AlphaClashServerEngine(Spec.fromFixture().state, seats);
  const snapshot = alphaClashSerializeEngine(engine, maps);
  return JSON.parse(JSON.stringify(snapshot));
}
it.each([0, 37])(
  "restores version %i from the persistence envelope when native stateID is absent",
  async (stateVersion) => {
    const snapshot = saved();
    delete snapshot.state.stateID;
    snapshot.state.stateVersion = stateVersion;
    const restored = await alphaClashRestoreEngine(snapshot, restoreContext);
    expect(restored.getStateID()).toBe(stateVersion);
    const view = restored.getInteractionView?.("alice");
    const concede = view?.actions.find((action) => action.id === "concede");
    if (!view || !concede || !restored.submitInteraction)
      throw Error("Missing concede interaction");
    const result = restored.submitInteraction(
      "alice",
      buildInteractionSubmission({ view, action: concede, values: { confirm: true } }),
      { gameId: "restore", sourceAuthority: "server" },
    );
    expect(result.success).toBe(true);
    expect(restored.getStateID()).toBe(stateVersion + 1);
    expect(result.acceptedMoveRecord?.stateVersion).toBe(stateVersion + 1);
  },
);
it("keeps native stateID precedence consistent with platform persistence", async () => {
  const snapshot = saved();
  snapshot.state.stateID = 9;
  snapshot.state.stateVersion = 10;
  const restored = await alphaClashRestoreEngine(snapshot, restoreContext);
  expect(restored.getStateID()).toBe(9);
});
it.each([-1, 1.5, "2", null])("rejects invalid saved version %j", async (version) => {
  const snapshot = saved();
  delete snapshot.state.stateID;
  snapshot.state.stateVersion = version;
  await expect(alphaClashRestoreEngine(snapshot, restoreContext)).rejects.toThrow(
    "snapshot state version",
  );
});

it("retains log-count restoration for unversioned native snapshots", async () => {
  const snapshot = saved();
  delete snapshot.state.stateID;
  delete snapshot.state.stateVersion;
  const restored = await alphaClashRestoreEngine(snapshot, restoreContext);
  expect(restored.getStateID()).toBe(snapshot.state.moveLog.length);
});
