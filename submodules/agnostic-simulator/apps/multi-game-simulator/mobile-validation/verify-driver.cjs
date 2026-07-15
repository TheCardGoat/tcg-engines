// Verify the mobile driver end-to-end against unitMoxIncitersRetail.
// Expected happy path: Mox Inciters is in hand; tap it -> tray shows play ->
// tap play -> it enters the field (Mox Inciters is a BLOCKER + must-attack unit).
const { chromium } = require("@playwright/test");
const D = require(__dirname + "/lib/mobile-driver.cjs");

void (async () => {
  const SCENARIO = process.env.SCENARIO || "unitMoxIncitersRetail";
  const DEFINITION_ID = process.env.DEFINITION_ID; // optional override
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: D.VIEWPORT });

  try {
    const { errors } = await D.openMobile(page, SCENARIO);
    const before = await D.getBoardState(page);
    console.log("BEFORE", JSON.stringify(before, null, 2));

    // Find the definitionId of the first hand card if not provided.
    let defId = DEFINITION_ID;
    if (!defId) {
      defId = before.hand[0]?.definitionId;
    }
    console.log("TARGET definitionId:", defId);

    // Supported moves from engine (detection).
    const moves = await D.getCardSupportedMoves(page, defId);
    console.log("SUPPORTED_MOVES", JSON.stringify(moves));

    // Native mobile: tap the hand card.
    const tray = await D.tapHandCard(page, defId);
    console.log("TRAY", JSON.stringify(tray));

    // Tap play if available.
    if (tray.actions.includes("hand-action-play")) {
      await D.tapHandAction(page, "play");
      await D.sleep(200);
      // may open a target choice (Mox Inciters must-attack -> select-action not target)
      const st = await D.getBoardState(page);
      console.log(
        "AFTER_PLAY",
        JSON.stringify({
          status: st.promptStatus,
          choice: st.pendingChoiceType,
          fieldCount: st.fieldCount,
          handCount: st.handCount,
        }),
      );
      if (st.promptStatus === "choice") {
        const r = await D.openAndPickFirstTarget(page);
        console.log("TARGET_PICK", JSON.stringify(r));
      }
    }

    const after = await D.getBoardState(page);
    console.log(
      "AFTER",
      JSON.stringify(
        {
          fieldCount: after.fieldCount,
          handCount: after.handCount,
          fieldDefs: after.field.map((f) => f.definitionId),
        },
        null,
        2,
      ),
    );
    await D.screenshot(page, `mobile-validation/screenshots/verify-${SCENARIO}.png`);
    console.log("PAGE_ERRORS", JSON.stringify(errors));
    console.log("OK");
  } catch (e) {
    console.error("VERIFY_FAILED", e);
    await D.screenshot(page, `mobile-validation/screenshots/verify-${SCENARIO}-fail.png`).catch(
      () => {},
    );
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
