import { Activity, Clock3, RadioTower, RotateCcw, Settings, Swords, UserRound } from "lucide-react";
import type { LegalCommandDescriptor } from "@tcg/op-engine/practice-st01";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SeatSummary,
} from "@tcg/simulator-ui";
import type { OnePieceStaticBoard } from "../data/staticBoard.ts";
import classes from "./OnePieceTabletopBoard.module.css";

export interface OnePieceSidebarProps {
  board: OnePieceStaticBoard;
  actions?: readonly LegalCommandDescriptor[];
  onAction?: (action: LegalCommandDescriptor) => void;
  modeLabel?: string;
}

export function OnePieceSidebar({
  board,
  actions = [],
  onAction,
  modeLabel = "Fixture",
}: OnePieceSidebarProps) {
  const player = board.table.seats.find((seat) => seat.id === "player");
  const opponent = board.table.seats.find((seat) => seat.id === "opponent");
  const activeSeatLabel = board.table.status.activeSeatId === "player" ? "You" : "Opponent";

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        collapsible="none"
        className={classes.sidebar}
        data-sidebar-variant="game-console"
        data-testid="one-piece-sidebar"
      >
        <SidebarHeader className={classes.sidebarHeader}>
          <div className={classes.sidebarTitleBlock}>
            <div className={classes.sidebarMark}>OP</div>
            <div className={classes.sidebarTitleCopy}>
              <span>One Piece simulator</span>
              <h1>One Piece TCG</h1>
              <p>{board.fixture.label}</p>
            </div>
            <div className={classes.sidebarLiveBadge}>
              <RadioTower size={13} />
              <span>{modeLabel}</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className={classes.sidebarContent}>
          <SidebarGroup className={classes.sidebarGroup}>
            <SidebarGroupLabel className={classes.sidebarGroupLabel}>Match</SidebarGroupLabel>
            <SidebarGroupContent>
              <dl className={classes.sidebarStats}>
                <div>
                  <dt>
                    <Activity size={13} />
                    <span>Phase</span>
                  </dt>
                  <dd>{board.table.status.phase}</dd>
                </div>
                <div>
                  <dt>
                    <Clock3 size={13} />
                    <span>Turn</span>
                  </dt>
                  <dd>{board.table.status.turn}</dd>
                </div>
                <div>
                  <dt>
                    <UserRound size={13} />
                    <span>Active</span>
                  </dt>
                  <dd>{activeSeatLabel}</dd>
                </div>
              </dl>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className={classes.sidebarGroup}>
            <SidebarGroupLabel className={classes.sidebarGroupLabel}>Seats</SidebarGroupLabel>
            <SidebarGroupContent className={classes.seatList}>
              {opponent && (
                <div
                  className={classes.seatFrame}
                  data-seat-active={board.table.status.activeSeatId === opponent.id}
                >
                  <SeatSummary table={board.table} seat={opponent} compact />
                </div>
              )}
              {player && (
                <div
                  className={classes.seatFrame}
                  data-seat-active={board.table.status.activeSeatId === player.id}
                >
                  <SeatSummary table={board.table} seat={player} compact />
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className={classes.sidebarGroup}>
            <SidebarGroupLabel className={classes.sidebarGroupLabel}>
              {actions.length > 0 ? "Actions" : "Prototype actions"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className={classes.actionMenu}>
                {actions.length > 0 ? (
                  actions.map((action, index) => (
                    <SidebarMenuItem
                      key={`${action.type}:${action.sourceId ?? action.promptId ?? index}`}
                    >
                      <SidebarMenuButton
                        className={index === 0 ? classes.actionButtonPrimary : classes.actionButton}
                        onClick={() => onAction?.(action)}
                      >
                        <Swords size={16} />
                        <span>{action.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton className={classes.actionButtonPrimary} disabled>
                        <Swords size={16} />
                        <span>Turn End</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton className={classes.actionButton} disabled>
                        <RotateCcw size={16} />
                        <span>Undo</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton className={classes.actionButton} disabled>
                        <Settings size={16} />
                        <span>Settings</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className={classes.sidebarFooter}>
          <p className={classes.sidebarFootnote}>
            {actions.length > 0
              ? "Practice mode uses a local One Piece engine match."
              : "Fixture projection only. No engine moves submitted."}
          </p>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
