import { useState } from "react";
import type { SimulatorTable } from "@tcg/simulator-contract";
import {
  ChessClock,
  ClockReadout,
  PriorityRing,
  SeatSummary,
  TabletopActionButton,
  TabletopCounterBadge,
  TabletopDie,
  TabletopDieButton,
  TokenRow,
} from "@tcg/simulator-ui";
import { LiveFixtureFrame as Frame } from "./LiveFixtureFrame";
import classes from "./LiveFixtures.module.css";

export const tabletopControlComponents = [
  "ChessClock",
  "ClockReadout",
  "PriorityRing",
  "SeatSummary",
  "TabletopActionButton",
  "TabletopCounterBadge",
  "TabletopDie",
  "TabletopDieButton",
  "TokenRow",
] as const;

/** Local presentation state only. Dice values are explicit samples, not game rolls. */
export default function TabletopControlFixtures({ table }: { table?: SimulatorTable }) {
  const [disabled, setDisabled] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [counter, setCounter] = useState(3);
  const [active, setActive] = useState(true);
  const [compact, setCompact] = useState(false);
  const [running, setRunning] = useState(false);
  const [timerMs, setTimerMs] = useState(45000);
  const [result, setResult] = useState("Select a die or use a preview action.");
  return (
    <>
      <div className={classes.grid}>
        <Frame
          title="Dice selection and action controls"
          components={["TabletopDie", "TabletopDieButton", "TabletopActionButton"]}
        >
          <div className={classes.controls}>
            <label>
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
              />{" "}
              Disable preview actions
            </label>
          </div>
          <div className={classes.controls}>
            {[4, 6, 8, 10, 12, 20].map((sides) => (
              <TabletopDieButton
                key={sides}
                actionLabel={`Select d${sides} showing 3`}
                selected={selected === sides}
                disabled={disabled}
                onClick={() => {
                  setSelected(sides);
                  setResult(`Selected d${sides}. The sample face remains 3.`);
                }}
              >
                <TabletopDie label={`D${sides}`} value={3} />
              </TabletopDieButton>
            ))}
            <TabletopDie label="Symbol die" value="★" />
            <TabletopDie label="Unresolved die" />
          </div>
          <div className={classes.controls}>
            <TabletopActionButton
              variant="primary"
              disabled={disabled}
              onClick={() => setResult("Primary preview action selected.")}
            >
              Confirm
            </TabletopActionButton>
            <TabletopActionButton
              aria-label="Clear die selection"
              disabled={disabled}
              onClick={() => {
                setSelected(null);
                setResult("Die selection cleared.");
              }}
            >
              ↺
            </TabletopActionButton>
          </div>
        </Frame>
        <Frame
          title="Counter shapes and token states"
          components={["TabletopCounterBadge", "TokenRow"]}
        >
          <div className={classes.controls}>
            <button
              onClick={() => setCounter((value) => Math.max(0, value - 1))}
              disabled={counter === 0}
            >
              Decrease sample counter
            </button>
            <button onClick={() => setCounter((value) => value + 1)}>
              Increase sample counter
            </button>
          </div>
          <div className={classes.controls}>
            <TabletopCounterBadge label="Sample" value={counter} variant="circle" />
            <TabletopCounterBadge label="Sample" value={counter} variant="compact" />
            <TabletopCounterBadge label="Sample" value={counter} mono />
          </div>
          <TokenRow
            tokens={[
              { label: "Active", value: String(counter), state: "active" },
              { label: "Rested", value: "2", state: "rested" },
              { label: "Hidden count", value: "?", state: "hidden" },
            ]}
          />
        </Frame>
        <Frame
          title="Clock and priority states"
          components={["ChessClock", "ClockReadout", "PriorityRing"]}
        >
          <div className={classes.controls}>
            <label>
              <input
                type="checkbox"
                checked={running}
                onChange={(e) => setRunning(e.target.checked)}
              />{" "}
              Run sample clock
            </label>
            <label>
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />{" "}
              Active priority
            </label>
            <label>
              Sample time{" "}
              <select value={timerMs} onChange={(e) => setTimerMs(Number(e.target.value))}>
                <option value={45000}>45 seconds</option>
                <option value={15000}>15 seconds</option>
                <option value={3000}>3 seconds</option>
                <option value={0}>Expired</option>
              </select>
            </label>
          </div>
          <div className={classes.controls}>
            <ChessClock
              timerMs={timerMs}
              timerState={timerMs === 0 ? "expired" : running ? "running" : "paused"}
            />
            <PriorityRing active={active} />
            <span>{active ? "Priority active" : "Priority inactive"}</span>
          </div>
          <div className={classes.controls}>
            {(["normal", "warning", "danger", "critical"] as const).map((urgency) => (
              <ClockReadout
                key={urgency}
                label={urgency}
                value={
                  urgency === "normal"
                    ? "12:00"
                    : urgency === "warning"
                      ? "00:30"
                      : urgency === "danger"
                        ? "00:10"
                        : "00:03"
                }
                active={active}
                urgency={urgency}
              />
            ))}
          </div>
        </Frame>
        {table && (
          <Frame title="Seat summaries" components={["SeatSummary"]}>
            <label className={classes.controls}>
              <input
                type="checkbox"
                checked={compact}
                onChange={(e) => setCompact(e.target.checked)}
              />{" "}
              Compact seat summary
            </label>
            <div className={classes.grid}>
              {table.seats.map((seat) => (
                <SeatSummary key={seat.id} table={table} seat={seat} compact={compact} />
              ))}
            </div>
          </Frame>
        )}
      </div>
      <p role="status" className={classes.result}>
        {result}
      </p>
    </>
  );
}
