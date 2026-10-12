# Reference study

Observed on 2026-10-10. These references inform interaction design; their assets are not product assets. Historical articles are labelled. Source statements and recommendations are separate. [Annotated reference board](references.html) places numbered annotations over the captured views.

## MTG Arena — payment and complex choices

**Source:** [The Brothers’ War state of the game](https://magic.wizards.com/en/news/mtg-arena/mtg-arena-state-game-the-brothers-war), 2022-11-09. Historical client version, not a current-client audit. The article describes an auto-tap pause for strategic mana-color choices and a scry-like top/bottom interface.

**Observed image:** Payment source stays enlarged at right; gold marks identify resources; Cancel and payment confirmation share the lower-right action area. See [capture](evidence/reference-arena-payment.jpg). Still image; no timing claim.

**Recommendation:** Preview explicit resource assignments before commit, preserve chosen resources on recoverable rejection, and keep cancel local until submission. Reuse the same ordering surface for top/bottom choices. Alpha Clash payment legality comes from its engine. Do not add MTG mana rules.

## Legends of Runeterra — combat readability

**Source:** [Oracle’s Eye](https://support.riotgames.com/en-us/legends-of-runeterra/gameplay/oracle-s-eye), 2022-07-30. Official support illustration, not a current gameplay recording.

**Observed image:** The Eye sits between Nexus health indicators; the board carries predicted changes rather than putting the result only in a paragraph. See [capture](evidence/reference-lor-preview.jpg).

**Recommendation:** Keep attacker–target links and pending effects spatially aligned. Show known committed state changes at the affected object. The simulator has no verified native outcome-preview contract; do not imitate prediction with UI rules. Initiative and pending effects need additional current-gameplay observation before claiming a full Runeterra reference study.

### Runeterra follow-up — draft, commit and persistent relationship

**Source/date:** [Round FAQ](https://support.riotgames.com/en-us/legends-of-runeterra/gameplay/round-faq), July 30, 2022; inspected October 10, 2026. Historical official guide, not current-client gameplay proof.

**Documented interaction:** Dragging attackers forward changes the main control from Pass to Attack; activating it commits the attack. Defenders align in front of attackers. The guide describes a persistent blue blocked marker after a committed blocker is removed.

**Observed image:** The [official illustration](https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/f94a8c37ef358e9423551fa64c87673f9888fa18-335x595.png) shows an empty outlined rectangle and shield above an attacker. Both shape and position communicate the relationship. [Captured view](evidence/reference-lor-block-marker.jpg); annotations are in the reference board. This is a still image, with no timing/audio claim.

**Recommendation:** Keep draft and commit visibly distinct. Use a named action control and persistent native relationship marks when the engine still reports that relationship. Do not import Runeterra's removed-blocker rule into Alpha Clash or retain a link after native combat ends. This informs `ac-priority`, `ac-attack` and `ac-obstruct`.

**Developer context:** [Open beta patch notes](https://playruneterra.com/en-us/news/open-beta-patch-notes/) report that separate initiative and attack icons confused players, prompting a combined indicator. This historical design rationale supports a concise decision marker, not identical rules or icons. Alpha Clash must still distinguish active turn from current decision priority.

## Hearthstone — purpose, impact, sound

**Sources:** [Art Behind the Science](https://hearthstone.blizzard.com/en-us/news/22552047), 2018; [sound-team interview](https://hearthstone.blizzard.com/en-us/news/23964694), 2023. Both are historical developer material.

**Observed:** The VFX article discusses gameplay communication and differing visual weight. Its Magnetic illustration uses a directional attachment cue and a highlighted receiving object. [Official animation](https://bnetcmsus-a.akamaihd.net/cms/gallery/9c/9CFRDO0LQVJ01538087188621.gif) is a looping GIF, so no stable video timestamp is assigned. The sound interview relates cast and impact beats to turn-based timing and layered material sounds.

**Recommendation:** Use a low-cost hover cue, stronger confirmation, and one synchronized impact beat. Attachment previews must show the receiving card without presenting the choice as strategic advice. Sound should identify pick, place, commit, impact, and rejection; it must not reveal hidden card identity. Proposed durations and mixing limits in presentation.md are our targets, not measured Hearthstone values.

### Hearthstone follow-up — attachment states and audio hierarchy

**Historical source:** the same official VFX article is dated October26,2018; the sound interview is dated June9,2023. Revisited October10,2026. These are developer evidence, not current-client captures.

**Observed animation frames:** the official500×200 Magnetic GIF was opened in the in-app browser. One frame shows an enlarged blue-edged Spider Bomb beside an outlined host; another shows two separate2/2 bodies; another shows one4/4 body. Captures: [preview](evidence/reference-hearthstone-preview.jpg), [separate](evidence/reference-hearthstone-separate.jpg), [combined](evidence/reference-hearthstone-combined.jpg). They sample a repeating demonstration, not one instrumented playthrough. No stable timestamps, gesture duration or audio can be inferred. [Numbered annotations](references.html#hearthstone-attachment) identify only visible features.

**Developer explanation:** the VFX team replaced small attachment marks with larger connection shapes, while avoiding an effect that implied attachment was always strategically correct. The sound team describes separate cast/hit beats, layered creature sounds, and choosing which sounds to omit when the mix becomes crowded. These claims come from the linked articles; the silent GIF does not demonstrate them.

**Simulator recommendation:** a Weapon draft needs one clear host connection and separate source/host inspection. Use a neutral eligible outline, a stronger selected relationship and an accepted attachment settle. Let native results determine any stat changes. Give accepted impact higher audio priority than selection or movement, and make omission of redundant minor cues an explicit scheduler decision. The [mix review procedure](presentation.md#audio-review) defines our own acceptance targets and evidence requirements. No Hearthstone assets are proposed for production use.

## The Bazaar — placement and dense boards

**Sources:** [official game page](https://playthebazaar.com/game), [board video](https://playthebazaar.com/videos/the-bazaar-board.mp4?v=1.0), [patch notes](https://playthebazaar.com/patch-notes), observed 2026-10-10. The patch page showed Hotfix 19.1, dated 2026-10-07. The marketing video has no build label; it is not verified as 19.1 footage.

**Observed at 00:10.04 of 00:37.83:** A fixed lower item strip uses different item widths; health sits below it. Three choices occupy the upper area. Security Center has a gold hover outline and an adjacent explanation. See [capture](evidence/reference-bazaar-10s.jpg).

**Recommendation:** Give each zone a stable spatial role. Inspect beside the selected item and preserve the board’s geometry. Keep effect resolution readable through a short ordered queue. This clip supports placement and inspection, not a measured combat-pacing or sound claim. The [2018 gameplay preview](https://shop.playthebazaar.com/blogs/news/the-bazaar-gameplay-preview) is prototype material and is excluded from current-pattern evidence.

### Bazaar follow-up — spatial status and impact hierarchy

**Source/date:** [Official Steam listing](https://store.steampowered.com/app/1617400/The_Bazaar/), inspected October 10, 2026. Its embedded [Boulder combat clip](https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1617400/extras/bc52733e6a6a40ac1ded7ec3a0268073.mp4?t=1775066388) is currently published material, but has no visible build/date. Do not label it Hotfix 19.1 footage. The inline player reported 5.9 seconds; direct playback reported 6 seconds. Times below use direct playback.

**Observed frames:**

- **00:00.20:** Two fixed item rows, different item widths, and health strips. [Frame](evidence/reference-bazaar-combat-020.jpg).
- **00:01.65:** Ice covers three upper items; numeric countdowns sit on those items. Item positions remain fixed. [Frame](evidence/reference-bazaar-combat-165.jpg).
- **00:04.33:** A large boulder and impact burst cover part of the upper board. [Frame](evidence/reference-bazaar-combat-433.jpg).

**Recommendation:** Keep status indicators attached to their objects, combining shape and short numeric information. Reserve large effects for high-impact events; cap their area so targets and legal controls remain readable. Apply this to `ac-number`, `ac-damage` and `ac-destinations`. Do not import automatic combat or cooldown rules.

**Limits:** This short edited clip does not establish input behavior, full combat pacing, or sound synchronization. Screenshots include browser playback controls. [Annotations](references.html#bazaar-combat) separate the observations from the proposed simulator design.

## Research limits

Payment, inspection, visual hierarchy, and sound intent have direct source support. Complete contemporary playthroughs covering each requested reference family, complete annotated combat sequences, and measured timing/audio comparisons are still missing. Treat recommendations as proposed acceptance criteria, not as verified copies of those games’ behavior.
