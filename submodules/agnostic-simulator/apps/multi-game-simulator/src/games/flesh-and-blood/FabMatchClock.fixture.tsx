import { useEffect, useMemo, useState } from "react";
import { Button, Text } from "@mantine/core";
import { createFabClock } from "@tcg/flesh-and-blood-server-adapter/clock";
import { FabMatchClock } from "./FabMatchClock";
import { getFabEngineScenario } from "./engineScenarios";
import { presentRuntime } from "./projection";
import { FleshAndBloodTabletop } from "./FleshAndBloodTabletop";
import { useFabCardPresentation } from "./useFabCardPresentation";
import { useFabCardArt } from "./FabPresentationCatalog";

/** Deterministic hosted-clock display fixture; no live match is changed. */
export function FabMatchClockFixture() {
  const [match] = useState(() => getFabEngineScenario("opening")!.boot());
  const [now, setNow] = useState(Date.now);
  const [clock] = useState(() =>
    createFabClock(
      { mode: "dynamic", initialReserveMs: 180_000, extras: { graceMs: 15_000 } },
      ["player-1", "player-2"],
      "player-2",
      Date.now() - 160_000,
    ),
  );
  const [claimed, setClaimed] = useState(false);
  const definitions = useMemo(
    () => Object.values(match.runtime.getState().cardDefinitions),
    [match],
  );
  useFabCardPresentation(definitions, "match-clocks");
  const resolver = useFabCardArt();
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, []);
  return (
    <FleshAndBloodTabletop
      state={presentRuntime(match.runtime, "player-1", resolver)}
      viewerId="player-1"
      legalCommands={[]}
      readOnly
      participantPresentation={{
        "player-1": {
          displayName: "You",
          clock: <FabMatchClock clock={clock} playerId="player-1" label="You" now={now} />,
        },
        "player-2": {
          displayName: "Opponent",
          clock: <FabMatchClock clock={clock} playerId="player-2" label="Opponent" now={now} />,
        },
      }}
      matchNotice={
        <div>
          <Text size="sm">{claimed ? "Fixture claim received." : "Opponent disconnected."}</Text>
          <Button onClick={() => setClaimed(true)} disabled={claimed}>
            Claim win
          </Button>
        </div>
      }
    />
  );
}
