import { useContext, useId, useState } from "react";
import { Drawer } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ChevronsRight, Menu, SlidersHorizontal, Undo2 } from "lucide-react";
import { CreatorMenuAction, CreatorSceneShortcut } from "../../pages/creator/CreatorMenuContext";
import { CreatorMenuContext } from "../../pages/creator/CreatorContext";
import { BotShortcuts } from "./BotShortcuts";
import type { SimulatorViewportShellProps } from "@tcg/simulator-ui";
import { useCyberpunkBoardRuntime } from "../BoardRuntimeContext";
import { useEngine } from "../../engine";
import {
  LocalTableControls,
  LocalTableControlsContext,
} from "../AiControlPanel/LocalTableControls";
import { CombatPriorityShortcut } from "../PaymentSelection/CombatPriorityShortcut";
import { CyberpunkPaymentSelectionShortcut } from "../PaymentSelection/PaymentSelectionPlayerAction";
import { BoardSurfacePicker } from "./BoardSurfacePicker";
import { MatchUtilitiesContext } from "./MatchUtilitiesContext";
import { SoundMuteShortcut } from "./SoundMuteShortcut";
import { ReturnToV1 } from "./version";
import { resolveBoardSurface, useBoardSurfaceId } from "./boardSurface";
import classes from "./MatchViewportV2.module.css";

/**
 * One floating control cluster over the board (Match, undo, payment and
 * priority toggles) plus one shared sidebar drawer, including on phones.
 * Never duplicate its actions.
 */
export function MatchViewportV2({
  tabletop,
  sidebar,
  children,
  className,
}: SimulatorViewportShellProps) {
  const [opened, setOpened] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const toolbarId = useId();
  const creator = useContext(CreatorMenuContext);
  const mobile = useMediaQuery("(max-width: 600px)");
  const { canUndo, dispatch, humanSide, isRemote } = useEngine();
  const surface = resolveBoardSurface(useBoardSurfaceId());
  // Hosted spectator views must not offer player controls.
  const { liveMatchSidebar } = useCyberpunkBoardRuntime();
  const spectator = Boolean(liveMatchSidebar && !liveMatchSidebar.localPlayerId);
  return (
    <main
      className={`${classes.viewport} ${className ?? ""}`}
      data-game="cyberpunk"
      data-theme="dark"
    >
      <MatchUtilitiesContext.Provider
        value={
          <div className={classes.utilities} aria-label="Match utilities">
            <button
              type="button"
              className={collapsed ? classes.menu : classes.undo}
              aria-label={collapsed ? "Expand toolbar" : "Collapse toolbar"}
              title={collapsed ? "Show match controls" : "Hide match controls"}
              aria-expanded={!collapsed}
              aria-controls={toolbarId}
              onClick={() => setCollapsed((value) => !value)}
            >
              {collapsed ? (
                <SlidersHorizontal size={18} aria-hidden="true" />
              ) : (
                <ChevronsRight size={18} aria-hidden="true" />
              )}
              {collapsed && <span>Controls</span>}
            </button>
            <div id={toolbarId} className={classes.utilitiesRow} hidden={collapsed}>
              <button
                className={classes.menu}
                type="button"
                aria-label="Match"
                title="Match menu"
                onClick={() => setOpened(true)}
                aria-haspopup="dialog"
                aria-expanded={opened}
              >
                <Menu size={18} aria-hidden="true" />
                <span>Match</span>
              </button>
              {!spectator && (
                <button
                  className={classes.undo}
                  type="button"
                  aria-label="Undo last move"
                  title="Undo last move"
                  disabled={!canUndo}
                  onClick={() => dispatch({ type: "undo" })}
                >
                  <Undo2 size={18} aria-hidden="true" />
                </button>
              )}
              <CreatorSceneShortcut />
              {!spectator ? <BotShortcuts alwaysVisible={Boolean(creator)} /> : null}
              <div className={classes.toggles} key={humanSide}>
                {/* Listening preference: available to spectators too. */}
                <SoundMuteShortcut />
                {!spectator && (
                  <>
                    <CyberpunkPaymentSelectionShortcut labeled />
                    <CombatPriorityShortcut labeled />
                  </>
                )}
              </div>
            </div>
          </div>
        }
      >
        <div className={classes.tabletop}>{tabletop}</div>
      </MatchUtilitiesContext.Provider>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Match controls"
        position={mobile ? "bottom" : "right"}
        size={mobile ? "88dvh" : 360}
        zIndex={1000}
        classNames={{
          content: classes.drawer,
          header: classes.header,
          title: classes.title,
          body: classes.body,
        }}
        closeButtonProps={{ "aria-label": "Close" }}
        overlayProps={{ backgroundOpacity: 0.55 }}
      >
        <CreatorMenuAction onClose={() => setOpened(false)} />
        <LocalTableControls />
        <LocalTableControlsContext.Provider value={!isRemote}>
          {sidebar}
        </LocalTableControlsContext.Provider>
        <div className={classes.drawerExtras}>
          <BoardSurfacePicker surface={surface} />
          <ReturnToV1 className={classes.drawerReturn} />
        </div>
      </Drawer>
      {children}
    </main>
  );
}
