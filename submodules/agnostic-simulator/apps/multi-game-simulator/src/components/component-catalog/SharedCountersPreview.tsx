import { useState } from "react";
import { CounterBadge, type CounterKind } from "@tcg/simulator-presentation/counters";
import { CounterToken } from "@tcg/simulator-presentation/three";
import { TabletopCanvas } from "@tcg/simulator-presentation/tabletop";
import classes from "./SharedCountersPreview.module.css";

/** Production counter renderers, with display-only values and orientation controls. */
export function SharedCountersPreview() {
  const [count, setCount] = useState(12);
  const [angle, setAngle] = useState(90);
  return (
    <section className={classes.section} aria-label="Shared simulator counters">
      <header>
        <h2>Shared counters</h2>
        <p>
          One token family for card overlays and 3D boards. Color and symbols identify each type.
        </p>
      </header>
      <div className={classes.tokens}>
        {(["damage", "health", "shield", "energy", "bonus", "neutral"] satisfies CounterKind[]).map(
          (kind) => {
            return (
              <div key={kind}>
                <CounterBadge kind={kind} label={kind} count={count} size={52} />
                <span>{kind}</span>
              </div>
            );
          },
        )}
        <div>
          <CounterBadge label="Boost" count={count} kind="bonus" variant="named" size={44} />
          <span>Named counter</span>
        </div>
      </div>
      <div className={classes.controls}>
        <label>
          Counter value{" "}
          <input
            type="number"
            min={0}
            max={999}
            value={count}
            onChange={(event) => setCount(Math.min(999, Math.max(0, Number(event.target.value))))}
          />
        </label>
        <label>
          Card rotation{" "}
          <select value={angle} onChange={(event) => setAngle(Number(event.target.value))}>
            <option value={0}>Ready · 0°</option>
            <option value={90}>Sideways · 90°</option>
            <option value={180}>Opponent · 180°</option>
          </select>
        </label>
      </div>
      <div className={classes.comparison}>
        <div>
          <h3>Board sizes</h3>
          <div className={classes.tokens}>
            {[24, 32, 44].map((size) => (
              <div key={size}>
                <CounterBadge label="Damage" kind="damage" count={count} size={size} />
                <span>{size} px</span>
              </div>
            ))}
          </div>
          <p>The number stays clear at small sizes. Values use the full number, including zero.</p>
        </div>
        <div>
          <h3>3D orientation</h3>
          <div
            className={classes.scene}
            role="img"
            aria-label={`Damage: ${count}. Card rotated ${angle} degrees; counter remains upright.`}
          >
            <TabletopCanvas orthographic camera={{ position: [0, 0, 5], zoom: 130 }}>
              <group rotation={[0, 0, (angle * Math.PI) / 180]}>
                <mesh>
                  <boxGeometry args={[1, 1.4, 0.02]} />
                  <meshBasicMaterial color="#263542" />
                </mesh>
                <CounterToken
                  count={count}
                  label="Damage"
                  kind="damage"
                  variant="round"
                  orientation="screen"
                  position={[0.3, -0.43, 0.07]}
                />
              </group>
            </TabletopCanvas>
          </div>
          <p>The token follows the card. Its face stays upright for the viewer.</p>
        </div>
      </div>
      <p>
        Games control counter meaning, visibility and placement. These samples test presentation
        only.
      </p>
    </section>
  );
}
