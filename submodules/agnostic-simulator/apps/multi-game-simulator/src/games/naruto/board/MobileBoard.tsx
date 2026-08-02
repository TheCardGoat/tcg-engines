/**
 * Mobile board tree (<900px, portrait), design doc section 5: vertical
 * scroll column - opponent compact strip, opponent rows, sticky seam, your
 * rows, your leader+chakra row, scrollable hand fan, fixed bottom bar
 * (End Turn + log drawer). Tap = select, tap action pill (no hover).
 */

import { useState } from "react";

import { CharacterCard } from "./CharacterCard.tsx";
import { ChakraPips } from "./ChakraPips.tsx";
import { HandFan } from "./HandFan.tsx";
import { LeaderZone } from "./LeaderZone.tsx";
import { LogPanel } from "./LogPanel.tsx";
import { SeamPrompt } from "./SeamPrompt.tsx";
import { SupportSlot } from "./SupportSlot.tsx";
import animations from "./animations.module.css";
import classes from "./board.module.css";
import cards from "./cards.module.css";
import type { BoardKit } from "./types.ts";
import type { SeatView } from "../projection/projectSimulator.ts";

export interface MobileBoardProps {
  readonly kit: BoardKit;
}

function CompactStrip({ seat }: { readonly seat: SeatView }) {
  return (
    <div
      className={`${classes.mobileStrip} ${seat.isActive ? classes.mobileStripActive : ""}`}
      data-testid={`naruto-mobile-strip-${seat.player}`}
      data-active={seat.isActive || undefined}
    >
      <div className={classes.mobileStripInfo}>
        <p className={classes.mobileStripName}>{seat.name}</p>
        <div className={classes.mobileCounts}>
          <span>life {seat.leader.life}</span>
          <span>hand {seat.hand.length}</span>
          <span>deck {seat.deckCount}</span>
        </div>
      </div>
      <span className={cards.lifeBadge} key={seat.leader.life}>
        {seat.leader.life}
      </span>
    </div>
  );
}

function MobileRows({
  seat,
  side,
  kit,
}: {
  readonly seat: SeatView;
  readonly side: "top" | "bottom";
  readonly kit: BoardKit;
}) {
  return (
    <>
      <p className={classes.mobileZoneLabel}>{side === "top" ? "Opponent" : "Your"} characters</p>
      <div className={classes.slotRow} data-testid={`naruto-characters-${seat.player}`}>
        {seat.characters.map((character, index) =>
          character ? (
            <CharacterCard
              key={character.uid}
              character={character}
              owner={seat.player}
              side={side}
              kit={kit}
            />
          ) : (
            <span key={`empty-${index}`} className={cards.slot} data-slot-index={index} />
          ),
        )}
      </div>
      <div className={classes.slotRow} data-testid={`naruto-supports-${seat.player}`}>
        {seat.supports.map((support, index) =>
          support ? (
            <SupportSlot key={support.uid} support={support} owner={seat.player} kit={kit} />
          ) : (
            <span key={`empty-${index}`} className={cards.slot} data-slot-index={index} />
          ),
        )}
      </div>
    </>
  );
}

export function MobileBoard({ kit }: MobileBoardProps) {
  const { projection } = kit;
  const [logOpen, setLogOpen] = useState(false);
  const endTurnPill = projection.seamPills.find((pill) => pill.id === "end-turn");

  return (
    <div className={classes.mobileColumn} data-testid="naruto-mobile-board">
      <CompactStrip seat={projection.top} />
      <MobileRows seat={projection.top} side="top" kit={kit} />
      <SeamPrompt kit={kit} sticky />
      <MobileRows seat={projection.bottom} side="bottom" kit={kit} />
      <div className={classes.mobileStrip} data-testid="naruto-mobile-leader-row">
        <LeaderZone
          leader={projection.bottom.leader}
          owner={projection.bottom.player}
          side="bottom"
          kit={kit}
        />
        <div className={classes.mobileStripInfo}>
          <ChakraPips chakra={projection.bottom.chakra} owner={projection.bottom.player} />
          <div className={classes.mobileCounts} style={{ marginTop: 6 }}>
            <span>deck {projection.bottom.deckCount}</span>
            <span>trash {projection.bottom.trashCount}</span>
          </div>
        </div>
        <LeaderZone
          leader={projection.top.leader}
          owner={projection.top.player}
          side="top"
          kit={kit}
        />
      </div>
      <div className={classes.mobileHand} data-testid="naruto-mobile-hand">
        <div className={classes.mobileHandInner}>
          <HandFan hand={projection.bottom.hand} owner={projection.bottom.player} kit={kit} />
        </div>
      </div>

      <div className={classes.bottomBar} data-testid="naruto-bottom-bar">
        <button
          type="button"
          className={classes.bottomLogToggle}
          data-testid="naruto-log-toggle"
          onClick={() => setLogOpen(true)}
        >
          Log ({projection.logLines.length})
        </button>
        <span className={classes.bottomBarSpacer} />
        {kit.interactive && endTurnPill ? (
          <button
            type="button"
            className={classes.endTurnButton}
            data-testid="naruto-end-turn-mobile"
            disabled={!endTurnPill.enabled}
            title={endTurnPill.reason ?? undefined}
            onClick={() => kit.onPill(endTurnPill)}
          >
            End turn
          </button>
        ) : null}
      </div>

      {logOpen ? (
        <>
          <div className={classes.drawerBackdrop} onClick={() => setLogOpen(false)} aria-hidden />
          <div
            className={`${classes.drawer} ${animations.promptIn}`}
            data-testid="naruto-log-drawer"
            role="dialog"
            aria-label="Game log"
          >
            <h3 className={classes.railTitle}>Log</h3>
            <LogPanel lines={projection.logLines} />
            <div className={classes.dialogActions}>
              <button
                type="button"
                className={classes.cancelChip}
                onClick={() => setLogOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
