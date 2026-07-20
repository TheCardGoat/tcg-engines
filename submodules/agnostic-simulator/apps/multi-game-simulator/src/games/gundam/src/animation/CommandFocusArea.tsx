import type { SimulatorEntity } from "@tcg/simulator-contract";
import { ResolvingEntityStage } from "@tcg/simulator-ui";

export const GUNDAM_COMMAND_FOCUS_ANCHOR_ID = "gundam-command-focus";

export function CommandFocusArea({
  entity,
  active,
}: {
  readonly entity: SimulatorEntity | null;
  readonly active: boolean;
}) {
  return (
    <ResolvingEntityStage
      entity={entity}
      active={active}
      anchorId={GUNDAM_COMMAND_FOCUS_ANCHOR_ID}
      label="Command resolving"
      testId="gundam-command-focus"
      className="pointer-events-none absolute left-1/2 top-[47%] z-[80] grid -translate-x-1/2 -translate-y-1/2 justify-items-center gap-2"
      labelClassName={`clip-hud-6 border border-hud-accent/70 bg-hud-deep/95 px-3 py-1 font-display text-[10px] font-black uppercase tracking-[0.22em] text-hud-accent shadow-[0_0_22px_rgba(76,195,255,.38)] transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0"}`}
      entityClassName={`h-[156px] w-[112px] transition-[opacity,filter] duration-150 [&_.sim-card-face]:h-full [&_.sim-card-face]:w-full ${active ? "drop-shadow-[0_0_18px_rgba(76,195,255,.72)]" : "opacity-0"}`}
    />
  );
}
