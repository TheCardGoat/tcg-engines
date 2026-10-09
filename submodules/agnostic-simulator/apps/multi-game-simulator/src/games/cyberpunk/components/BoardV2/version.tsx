import { Component, lazy, Suspense, type ReactNode } from "react";
import { useInRouterContext, useLocation, useNavigate, useSearchParams } from "react-router";
import { SimulatorViewportShell, type SimulatorViewportShellProps } from "@tcg/simulator-ui";
import type { SimulatorRendererProps } from "@tcg/simulator-contract";
import { CyberpunkBoard } from "../CyberpunkBoard";
import { MatchViewportV2 } from "./MatchViewportV2";
import classes from "./version.module.css";
const V2 = lazy(() => import("./CyberpunkBoardV2"));
export function useCyberpunkUiV2() {
  const [params] = useSearchParams();
  return params.get("ui") === "v2";
}
export function useCyberpunkUiVersion() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { hash } = useLocation();
  return {
    isV2: params.get("ui") === "v2",
    setVersion: (version: "v1" | "v2") => {
      const next = new URLSearchParams(params);
      if (version === "v2") next.set("ui", "v2");
      else next.delete("ui");
      navigate(
        { search: next.toString() ? `?${next}` : "", hash },
        { replace: true, preventScrollReset: true },
      );
    },
  };
}
export function ReturnToV1({ className }: { className?: string } = {}) {
  const { setVersion } = useCyberpunkUiVersion();
  return (
    <button type="button" className={className} onClick={() => setVersion("v1")}>
      Return to V1
    </button>
  );
}
class V2Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("[cyberpunk] V2 board render failed", error);
  }
  render() {
    return this.state.failed ? (
      <div className={classes.errorPage} role="alert" aria-labelledby="v2-error-title">
        <section className={classes.errorPanel}>
          <div className={classes.errorIcon} aria-hidden="true">
            !
          </div>
          <div className={classes.errorCopy}>
            <p className={classes.errorEyebrow}>V2 DISPLAY ERROR</p>
            <h1 id="v2-error-title">This board could not load</h1>
            <p>Your match is still active. Return to V1 to continue the same game.</p>
          </div>
          <ReturnToV1 className={classes.recoveryButton} />
        </section>
      </div>
    ) : (
      this.props.children
    );
  }
}
/** V1 is the default. Changing presentation does not remount EngineProvider. */
function RoutedBoard(props: SimulatorRendererProps) {
  const v2 = useCyberpunkUiV2();
  if (!v2) return <CyberpunkBoard {...props} />;
  return (
    <V2Boundary>
      <Suspense
        fallback={
          <div role="status">
            Loading V2… <ReturnToV1 />
          </div>
        }
      >
        <V2 {...props} />
      </Suspense>
    </V2Boundary>
  );
}

/** Standalone boards (tests and embeds) keep V1. V2 is an explicit route option. */
export function CyberpunkVersionedBoard(props: SimulatorRendererProps) {
  return useInRouterContext() ? <RoutedBoard {...props} /> : <CyberpunkBoard {...props} />;
}
function RoutedViewport(props: SimulatorViewportShellProps) {
  const v2 = useCyberpunkUiV2();
  return v2 ? <MatchViewportV2 {...props} /> : <SimulatorViewportShell {...props} />;
}
export function CyberpunkViewportShell(props: SimulatorViewportShellProps) {
  return useInRouterContext() ? (
    <RoutedViewport {...props} />
  ) : (
    <SimulatorViewportShell {...props} />
  );
}
