import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { createDemoPracticeMatchConfig } from "../engine/practice/demoFixture";
import type { PracticeMatchConfig } from "../engine/practice/sessionStorage";
import {
  SimulatorSettingsBridgeProvider,
  useSimulatorSettings,
  type AnimationSpeed,
} from "../../../simulator/settings";
import { ReadyPracticeMatch } from "./PracticeMatch.page";
import { cyberpunkSimulatorPath } from "./simulatorPaths";
import classes from "./Practice.module.css";

export function DemoFixturePage() {
  const started = useRef(false);
  const [config, setConfig] = useState<PracticeMatchConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    try {
      const config = createDemoPracticeMatchConfig();
      setConfig(config);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start the demo match.");
    }
  }, []);

  if (config) {
    return (
      <DemoAnimationSettings>
        <ReadyPracticeMatch config={config} initialAiSpeed="slow" />
      </DemoAnimationSettings>
    );
  }

  return (
    <main className={classes.page}>
      <div className={classes.shell}>
        <header className={classes.header}>
          <p className={classes.eyebrow}>Cyberpunk · demo</p>
          <h1 className={classes.title}>{error ? "Demo unavailable" : "Setting the table…"}</h1>
          {error ? (
            <>
              <p className={classes.lead} role="alert">
                {error}
              </p>
              <Link to={cyberpunkSimulatorPath("/tests")}>Back to fixtures</Link>
            </>
          ) : (
            <p className={classes.lead}>Choosing decks and starting your game.</p>
          )}
        </header>
      </div>
    </main>
  );
}

function DemoAnimationSettings({ children }: { readonly children: ReactNode }) {
  const parent = useSimulatorSettings();
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>("normal");
  const value = useMemo(
    () => ({
      ...parent,
      settings: { ...parent.settings, animationSpeed },
      setAnimationSpeed,
    }),
    [animationSpeed, parent],
  );

  return (
    <SimulatorSettingsBridgeProvider value={value}>{children}</SimulatorSettingsBridgeProvider>
  );
}
