# Pending bug reports — worksheet (2026-05-16)

Source: `bug_reports.md` (1551 reports). Companion: `bug_reports_triage.md`.

**Pending (this file): 1247 reports across 240 clusters + 558 singletons.**  
Closed (auto-classified): 252.  
Out-of-engine-scope (separate section): 52.

## How to use

1. Pick a cluster or singleton.
2. Pull the listed replay (`gameId` + `turn`) and confirm whether the bug reproduces.
3. Tick the action box, fill the blanks, and (if a fix is needed) hand off to an
   implementation agent — point it at the cluster anchor (`#cluster-<slug>`).
4. Once every member of a cluster has a tick, the cluster is done; if some members
   diverge (e.g. one is duplicate, one is reproducible), split them by adding
   per-member notes below the table.
5. Mark singletons individually. Reports that cannot be reproduced after honest
   effort should be ticked `Not reproducible` with a reason; that is a valid
   resolution per the goal.

## Legend

- `gameId` (column) — replay id; feed to the replay CLI to inspect the turn.
- `turn` — turn number reported by the client at submit time.
- `platform` — desktop / mobile when the report was filed.
- A cluster anchor is `#cluster-<slug>`; reference it in fixes / PRs to close all members.

---

## Card clusters (231)

Each cluster contains every pending report whose description matched the same
card. Resolve the cluster once; apply the decision to all members.

### cluster-hercules — hercules (21 reports) <a id="cluster-hercules"></a>

Representative descriptions:
- _My 1 cost Hercules will not let me boost it_
- _boosted hercules and did no dmg_
- _Boost Hercules had a card under him (gets +*3 when boosted) and challenged Prince Philip - Prince Philip should  have been banished but did not sustain any damage)_
- _The Boost on the 1 cost Hercules to give him +3 challenge did not work._
- _Hercules is not getting strength gain from boost_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-27 13:40 | `CxE6tO2Z7s` | mgogOBolBNmm2Z-hMSNzv_r | 6 | desktop | My 1 cost Hercules will not let me boost it |
| 2026-04-14 08:27 | `bAZWqTauGV` | game-1776154807710-wawknosgl | 7 | desktop | boosted hercules and did no dmg |
| 2026-04-13 03:00 | `Yb3oSlTDn1` | game-1776048877017-o6xr2k4r3 | 10 | desktop | Boost Hercules had a card under him (gets +*3 when boosted) and challenged Prince Philip - Prince Philip should  have been banished but d... |
| 2026-04-12 18:18 | `pJnHS16fT8` | game-1776017484300-usvytmdsc | 9 | mobile | The Boost on the 1 cost Hercules to give him +3 challenge did not work. |
| 2026-04-12 14:04 | `_92x10FhuJ` | game-1776002436806-kj9traqbw | 8 | desktop | Hercules is not getting strength gain from boost |
| 2026-04-12 07:56 | `55TA5BDRDe` | game-1775980272847-jf1ow4zgz | 11 | desktop | when i boost my hercules he does not get the plus 3 attack |
| 2026-04-11 20:09 | `-U_IruadcL` | game-1775938000228-dkbnvp0li | 7 | desktop | Hercules whisper does not gain attack strength when boosted |
| 2026-04-11 17:48 | `hgZGdk5_KN` | game-1775928850644-yrzqkkulx | 21 | desktop | When hercules 1 drop was boosted it attacked for 0 instead of 3. |
| 2026-04-11 10:50 | `CZErtu18dv` | game-1775903871287-yu2nvtgpt | 23 | mobile | Hercules Migjty Leader still Buggy. Its impossble to play the Deck right, if he gets damage while he Attacked. Hercules only gets Damaged... |
| 2026-04-11 10:37 | `YAHZE9CFLR` | game-1775903421143-bgyfn7qj9 | 10 | mobile | AI Duel. Chemie Cat Effekt cant be Resolved by AI.  Hercules Effect still Buggy. Hercules gets Damaged , if he Attacks. |
| 2026-04-11 08:12 | `10foYRxsjd` | game-1775894000257-wngmqvadl | 18 | desktop | My Hercules died when challenging. |
| 2026-04-10 20:24 | `79FronTTMt` | game-1775852169118-ganq1nqvi | 10 | desktop | The card "Hercules-Sectral Demi-God" will not do damage even though the card is boosted. It should gave 3 power and be able to challenge ... |
| 2026-04-10 16:43 | `XJazDGE3Cw` | game-1775838484645-acm2k83ig | 17 | mobile | Hercules Set 10 was Banned, when I Attack opponent. Hercules gets no Damage unless he is Challanged |
| 2026-04-09 19:13 | `-PRqWO6TvD` | game-1775760881167-zym9p9kb3 | 18 | desktop | hercules effect is working wrong |
| 2026-04-09 18:49 | `DexGd_te5U` | game-1775760163385-utjr58eca | 10 | desktop | After being challenged hercules doesn't get banished |
| 2026-04-09 13:08 | `iVqZgpkC5B` | game-1775739417492-uzxics4yp | 16 | desktop | Hercules ability gliched. it prevents all damage even if hes challanged |
| 2026-04-08 23:19 | `hRNHjFOIJb` | game-1775689616988-cboiya87u | 16 | desktop | 1 cost Hercules doesn't get the benefit of his boost |
| 2026-04-08 23:10 | `8bm2AufmZa` | game-1775689616988-cboiya87u | 6 | desktop | Hercules did not get +3 attack after getting his boost |
| 2026-04-08 14:11 | `r8F_L9Yxdg` | game-1775656361829-riwa74gas | 22 |  | Opponent doesnt deal damage to my hercules even tho he should be able to. since his ability only sais he cant be damaged unless hes being... |
| 2026-04-08 12:38 | `EzgFApCGev` | game-1775651241670-9lkt6fwq9 | 21 |  | He challenged my Hercules with a Sven, the sven was banished but herc should have been banished too since he was dealt damage in a challe... |
| 2026-04-08 12:34 | `B0pEHaRu1M` | game-1775651241670-9lkt6fwq9 | 13 |  | Sven challenged hercules dealing 5 damage, but hercules didnt die? |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-be-king-undisputed — be king undisputed (20 reports) <a id="cluster-be-king-undisputed"></a>

Representative descriptions:
- _Be king undisputed won't let me choose a target and confirm?_
- _wont let be king undisputed resolve_
- _Be King Undisputed doesn't allow opponent to choose target_
- _Opponent played be king undisputed with maui shark in play.  Game would not let me select my character to banish from be king with the shark trigger on the stack. Game ended because my clock ran out, unable to select ..._
- _I can't confirm "be king undisputed"_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-07 16:07 | `VYZVq5Sgch` | mg4jr2TZ_tQCGL1ZThgEW3T | 8 | desktop | Be king undisputed won't let me choose a target and confirm? |
| 2026-05-07 15:57 | `sgL5YX7vG5` | mgdddRW5-bjveeCBHigmy4g | 11 | desktop | wont let be king undisputed resolve |
| 2026-05-07 15:38 | `xOtyJhW8bH` | mgq4xFetx4Orrc4Sz7Fz9Go | 8 | desktop | Be King Undisputed doesn't allow opponent to choose target |
| 2026-05-07 15:08 | `6MgLeNLfUD` | mggXgny0UumOSRY-6TCxg_B | 13 | desktop | Opponent played be king undisputed with maui shark in play.  Game would not let me select my character to banish from be king with the sh... |
| 2026-05-07 13:28 | `Dr11Hu_hdl` | mgvKfKW5ws-5xHyqElS87lx | 11 | desktop | I can't confirm "be king undisputed" |
| 2026-05-07 12:00 | `0JkN9Jzzr8` | mgiZnOsO-harNaoZfRpzLN1 | 9 | desktop | When trying to resolve the be king disputed, I selected which character I wanted to banish but it wouldn't let me hit the confirm |
| 2026-05-07 09:37 | `Hr1IGVgMdG` | mgxZcpUm5NgKNmGM_2hn9ll | 18 | desktop | I can't select a target for be king undisputed |
| 2026-05-07 08:29 | `bEIauc_U6S` | mgxvkyOybfIBYmok_YVWhly | 7 | desktop | be king undisputed is not selecting car |
| 2026-05-07 04:57 | `FfHhPweeJ4` | mgViRZHx2RoBK2nYLIYROUp | 11 | mobile | I was unable to confirm my selection when my opponent played “Be King Undesputed” |
| 2026-05-06 16:11 | `BgA4nPpN5r` | mgtaoGnKjvdRmrmRG3kyaT- | 11 | desktop | Opponent played Be King Undisputed and I cannot choose a character. I am locked in trying to choose the effect but it not letting me. The... |
| 2026-04-22 19:16 | `3DD_KyyfLU` | game-1776884829329-q96fqey4x | 16 | desktop | Be King Undisputed sometimes requires me to choose an opponent BUT the card states that the opponent gets to chose who goes, which means ... |
| 2026-04-20 02:32 | `z4WfGsQuVS` | game-1776651297263-lsc0058ra | 20 | mobile | Be king undisputed didnt activated opponent to discard a character |
| 2026-04-19 19:04 | `8GnaSW_RP4` | game-1776624810210-wtht57vdi | 14 | desktop | Be King Undisputed is not working. It's asking me to select a target (which shouldn't) and nothing happens. |
| 2026-04-17 06:26 | `V_ke-csEKq` | game-1776406876103-7bqhtrory | 7 | desktop | playing instead of singing be king undisputed doesn't let the opponent vhoose the card, it asks me instead |
| 2026-04-16 00:15 | `mQCOqFa-jK` | game-1776297966365-ediy4fp0p | 17 | desktop | Be King Undisputed will not execute. It says it cannot be played right now even when characters are out to be banished and the cost is pl... |
| 2026-04-11 17:46 | `f4_lWXjeob` | game-1775928850644-yrzqkkulx | 20 | desktop | Be King Undisputed wont work |
| 2026-04-08 23:34 | `FXegyaGIWo` | game-1775690433892-vgxqf5gpe | 16 | desktop | Cannot play 'Be King Undisputed' on an Ariel because she is uninked. Needs fixing. |
| 2026-04-08 22:17 | `5kSVuoGPYP` | game-1775685985795-arlkt0fid | 22 | mobile | hard casting BE KING UNDISPUTED makes the active play choose... that is not how it works |
| 2026-04-08 16:54 | `WqdB3iI1h_` | game-1775666562874-74q4ukvt3 | 16 |  | It's trying to get me to pick a target for Be King Undisputed when my opponent has to pick |
| 2026-04-01 17:53 | `fF-KMg6zqm` | game-1775065815552-hj52mib1j | 9 |  | Be KIng Undisputed doesnt work properly. forces player selection that isnt possible per the cards effect |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mulan — mulan (20 reports) <a id="cluster-mulan"></a>

Representative descriptions:
- _Mulan did not trigger_
- _Mulan skill did not work during challenge_
- _When I play actions like Triple Shot or Mulan Archer the game will not allow me to choose ready characters._
- _Mulan's effect didn't hit more than one target._
- _when mulan is banished in a challenge she makes, it is not allowing me to deal the damage to 2 other characters as per her ability_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-04 20:36 | `7_0JEeJkI1` | mgCT-LcKM0oIjH6NM6FamXw | 12 | mobile | Mulan did not trigger |
| 2026-05-04 19:02 | `op8qcTdlpT` | mgjfGg9otV9bX6b-sY_1rSa | 12 | desktop | Mulan skill did not work during challenge |
| 2026-05-02 23:49 | `TZE5IlCrVg` | mgdW_B3n8EmesFLVhNgkFi6 | 12 | desktop | When I play actions like Triple Shot or Mulan Archer the game will not allow me to choose ready characters. |
| 2026-04-29 04:14 | `LF_Q6Enbc_` | mgNS3AE6cTVCLFj2d5n7Z5T | 10 | desktop | Mulan's effect didn't hit more than one target. |
| 2026-04-27 10:16 | `ETmIF4LH23` | game-1777284549815-f95ekllkw | 15 | desktop | when mulan is banished in a challenge she makes, it is not allowing me to deal the damage to 2 other characters as per her ability |
| 2026-04-23 00:45 | `hEt_DNY3sB` | game-1776904972044-dzmx8flii | 5 | desktop | Mulan 6 drop doesnt take out 2 characters after the challenge |
| 2026-04-22 20:27 | `8l8KPdMj5s` | game-1776889342434-5dtxnqlq5 | 10 | mobile | Big mulan can just choose 1 target after trigger ability |
| 2026-04-19 05:19 | `x0NzNifRqr` | game-1776574864284-tfvulaz6j | 21 | desktop | Mulan's Triple Arrow effect is not working correctly. She should be able to pick two targets to also deal damage to. However the resoluti... |
| 2026-04-18 07:59 | `IDfJBTPs6o` | game-1776498771002-d7axnwvl0 | 11 | desktop | mulan archer effect |
| 2026-04-18 05:32 | `oGoLNliukz` | game-1776489087855-n8acwkkxi | 22 | mobile | Could not target 2 with the mulan effect |
| 2026-04-16 23:14 | `ilQofbfC88` | game-1776380583387-ivd7lrv8e | 18 | desktop | Mulan archer didn't give me trigger to do damage to other 2 characters |
| 2026-04-15 21:10 | `A8nwTGg7eR` | game-1776286548461-g7h1et6ex | 16 | desktop | I was not able to select targets using Mulan Elite |
| 2026-04-15 17:19 | `2ulsT4obDF` | game-1776273090362-ve6n5waot | 11 | desktop | mulan doesnt work |
| 2026-04-15 14:56 | `53m8GBTzns` | game-1776263754927-wfcfp1owk | 29 | mobile | Couldn't choose 2 characters when activating Mulan- Skilled Archer's effect of banishing a character and dealing damage up to 2 other cha... |
| 2026-04-14 19:04 | `JdcCIKNTmI` | game-1776192607065-43y2c6giw | 15 | desktop | Mulan only selects one unit  support in Mulan did not trigger |
| 2026-04-12 02:21 | `DE0jMtIzxN` | game-1775959944991-i9bmey46e | 11 | desktop | Mulan Archer is supposed to ping damage to 2 additional characters. It only allowed me to do one. |
| 2026-04-11 20:12 | `N4E6mq1c4v` | game-1775938000228-dkbnvp0li | 9 | desktop | Mulan's splash damage did not used the boosted attack strength. |
| 2026-04-11 19:06 | `_V2YKbRi5N` | game-1775933700137-c86432ktw | 16 | desktop | I cant choose opponents for Mulan archers effect |
| 2026-04-10 02:15 | `PGC4JrS_-Y` | game-1775786638365-wt3bz70xg | 11 | desktop | I just found this button, but in my previous game my opponent challenged with Mulan archer and it incorrectly killed my 2-cost Nala that ... |
| 2026-04-09 16:22 | `pFdssl5qeF` | game-1775751075004-tpe4adune | 10 | desktop | Mulan no effect no trigger |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-genie — genie (19 reports) <a id="cluster-genie"></a>

Representative descriptions:
- _cant boost genie_
- _Returning Genie to hand from discard, damage is still on him in hand._
- _Won't allow me to Boost Genie_
- _I can't boost Genie  Magical_
- _could not boost genie_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-03 13:26 | `zbFHQ_8M_D` | mgn3Pkjhf6XNHSp-f6v1Ce7 | 16 | desktop | cant boost genie |
| 2026-05-02 16:14 | `6xiDSjy3Pa` | mgRiYbPRH3wVoVIB-aDp-xk | 12 | desktop | Returning Genie to hand from discard, damage is still on him in hand. |
| 2026-04-10 05:15 | `AwQrSzcCUc` | game-1775797335306-qyfxh7ykq | 22 | desktop | Won't allow me to Boost Genie |
| 2026-04-10 00:25 | `aoq1EBcwtO` | game-1775780087188-2e6ljhqtq | 10 | desktop | I can't boost Genie  Magical |
| 2026-04-09 18:11 | `MiLtnJdZsN` | game-1775757610398-30g3c8afq | 24 | desktop | could not boost genie |
| 2026-04-09 16:21 | `DW3k_Q_lWN` | game-1775750983218-g7oh32og4 | 15 | desktop | can't boost with genie |
| 2026-04-09 12:54 | `K1QWWLDqwk` | game-1775738909279-w4dhe83le | 9 | desktop | It will not let me boost genie |
| 2026-04-09 12:35 | `WzOJx-B8Z3` | game-1775737884566-k8e8a1sdd | 7 | desktop | wont let me boost genie |
| 2026-04-09 04:13 | `DM_36Pc6s6` | game-1775707589055-gy9xkt80a | 13 | desktop | Can't Boost my genie |
| 2026-04-08 23:16 | `9HI92sjuhi` | game-1775689757110-4n3zq7tug | 11 | desktop | we cannot boost the genie |
| 2026-04-08 22:30 | `VPx6kQfC9S` | game-1775687032952-1uc2daoi1 | 15 | desktop | cant boost the genie when you play him? |
| 2026-04-08 22:15 | `KY6cxbh0w-` | game-1775685791374-uc4k7lo4y | 12 | desktop | Boost with genie does not work |
| 2026-04-08 22:07 | `CUpkmrVAUq` | game-1775685568606-23pvr4yuk | 8 | desktop | Have 4 ink. Played genie for 3. Tried to boost -- it wouldn't let me do so. |
| 2026-04-08 21:46 | `zWs85lcRR6` | game-1775684015812-y6uydkxe7 | 16 | desktop | Boost does not work on genie |
| 2026-04-08 14:17 | `4FvQv3Vyyt` | game-1775656855030-kgag4yqx4 | 20 |  | i dont think 3 drop boost 1 genie is letting me boost on the turn i play it |
| 2026-04-08 12:41 | `NXfbNqUi9U` | game-1775651707132-9ksilkmt9 | 8 |  | Couldn't boost my genie with my remaining ink |
| 2026-04-01 22:44 | `ZNrSOJe2zB` | game-1775082885790-o1og22u40 | 14 |  | Genie cannot boost. |
| 2026-04-01 19:27 | `YN93izJkEq` | game-1775070955622-8nrn6e3xa | 16 |  | Not able to boost a genie character |
| 2026-03-31 13:25 | `q7SUUVzR-3` | game-1774963330860-ddsvmwk5x | 6 |  | Royal Guard did not gain extra attack for draw with genie |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mickey-mouse — mickey mouse (17 reports) <a id="cluster-mickey-mouse"></a>

Representative descriptions:
- _de mickey mouse expidition don't turned_
- _mickey mouse let my opponent discard a card afte a challenge, while he was still in play_
- _The new *mickey *Amber can't enter exhausted_
- _can't play mickey mouse exerted_
- _wrong artwork for dash - comes up as mickey_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-13 12:10 | `CdRpTtw9C0` | mgOiNu2b5KlCGBqX-B4MJSF | 14 | desktop | de mickey mouse expidition don't turned |
| 2026-05-12 18:52 | `kFpGx_znuv` | mg6Y-ItxBRKVybWo5Xw4ILa | 20 | desktop | mickey mouse let my opponent discard a card afte a challenge, while he was still in play |
| 2026-05-12 16:59 | `AAAu_6oEQz` | mgsMm2DR_6VFb1i2Q9hVUnL | 7 | desktop | The new *mickey *Amber can't enter exhausted |
| 2026-05-12 11:32 | `imeVQmGYoR` | mgOGTBRNzhZzKQlySiKtpMO | 6 | desktop | can't play mickey mouse exerted |
| 2026-05-07 07:58 | `1Tas9itK8s` | mgcI2PjtuCWrgki-vq1kEJd | 11 | desktop | wrong artwork for dash - comes up as mickey |
| 2026-05-03 21:11 | `xLjYlmL8Kc` | mgtC8utWJfasZYJCbdu2zN2 | 12 | desktop | mickey mouse does not enter exerted |
| 2026-05-03 19:02 | `2p9HRE04nG` | mgv19QapOTF9uL_c8lPxQiq | 13 | mobile | Mickey expedition leafer doesn't have a trigger to enter exerted |
| 2026-04-25 16:50 | `lcfS8aXsko` | mg1K8LfU7PCGpoE-UhHH2GC | 15 | desktop | Not letting the set 12 mickey enter play exerted |
| 2026-04-18 02:19 | `kpTh7ueIMW` | game-1776478350105-f8hec7lip | 17 | desktop | Opponent discarded when mickey challenged another character |
| 2026-04-15 20:55 | `PhOZZbjX1b` | game-1776285700540-l78m1g4l4 | 21 | desktop | Ember Champion Mickey is removed but a card isn't banished when they have 5 willpower and 5 damage |
| 2026-04-15 16:11 | `dP3DVKbpWq` | game-1776268659450-b70d0kkji | 15 | mobile | Angel 2c has 3 damage counters after Mickey Amber Champion dies. Angel should die. |
| 2026-04-15 15:33 | `wvNpBmk2Cs` | game-1776266900469-ldgqw191c | 11 | desktop | Lilo has 2 damage but was buffed by mickey amber champion.  When he was removed she did not die |
| 2026-04-11 08:03 | `DgkQqnKgxH` | game-1775893913518-gz0p6g9vz | 17 | desktop | Nanie should have died when Mickey died |
| 2026-04-11 01:03 | `tbxGLndteb` | game-1775868949815-ywrwn4sk9 | 10 | desktop | scrooge putting card under mickey brave little prince triggered ward but not mickey effect |
| 2026-04-10 02:47 | `BIHAzk5g3M` | game-1775788516486-xa80h6ze5 | 15 | desktop | I had a yellow mickey that gives 2 extra health to all yellow characters. Opponent placed it in my inkwell. My other characters had enoug... |
| 2026-04-09 14:39 | `ZGsvenfsTD` | game-1775744879080-7ctkftsr5 | 22 | desktop | Let it Go was used mickey amber champion but still kept chief pow in play with 5 damage on him |
| 2026-04-09 03:09 | `QemQW-JK0A` | game-1775703347296-lni8b1a0b | 19 | desktop | After amber mickey was destroyed, characters weren't taken off even though they had more damage then health |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-hades — hades (15 reports) <a id="cluster-hades"></a>

Representative descriptions:
- _hades could choose an Ward hades as target_
- _Purple Hades does not let you see what card they selected._
- _Hades sapphire card, ability interaction is wrong, the game let me chose the card to be inked rather than the player choosing_
- _Hades made me choose the target rather than the person who played Hades_
- _blue hades effect not letting you select player to put into inkwell_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-12 19:17 | `mLFQGWk542` | mgoXqrK-mSt87KxF59Ob0j0 | 15 | desktop | hades could choose an Ward hades as target |
| 2026-05-02 14:20 | `jMRb2YipWO` | mgJCXY3KT2FaZIi4oD3B-p- | 8 | desktop | Purple Hades does not let you see what card they selected. |
| 2026-04-24 09:25 | `uvauFa3SD7` | game-1777022398545-ekakvp5fa | 10 | desktop | Hades sapphire card, ability interaction is wrong, the game let me chose the card to be inked rather than the player choosing |
| 2026-04-24 04:56 | `Kj2V7tbUuQ` | game-1777006159361-14eup78c6 | 9 | desktop | Hades made me choose the target rather than the person who played Hades |
| 2026-04-24 04:38 | `tXalXZ6DxM` | game-1777005015902-kn095yack | 12 | desktop | blue hades effect not letting you select player to put into inkwell |
| 2026-04-24 02:09 | `kCbVvXoFsh` | game-1776995903400-1oxemk9t1 | 18 | desktop | 7 drop blue hades has oppnent choose which card when it should be the player that played the hades that chooses the card to go into inwell |
| 2026-04-24 01:10 | `kj7tzLR3wc` | game-1776992537272-iix8tky1j | 13 | desktop | hades notworking right |
| 2026-04-23 21:43 | `8Qep0w617J` | game-1776980255836-gbi4ou210 | 15 | desktop | Opponent played hades and it let me choose what to ink |
| 2026-04-23 20:31 | `ZgZ5rGvOuO` | game-1776975912588-u40zjpap1 | 9 | desktop | When played, Sapphire hades. I wasn't able to pick the opponent's character. They picked. |
| 2026-04-23 19:27 | `-4iMLBkWM0` | game-1776971715098-uox7zrgre | 19 | desktop | I played hades 7drop but the computer let the oppenet choose whom to ink? |
| 2026-04-23 18:33 | `_HLsA7vM7D` | game-1776968564472-kimblh34q | 21 | desktop | i cannot target with the effect from hades ( blue 7 ink). only my opponent move itself his charackter in the ink |
| 2026-04-23 13:50 | `A6znQZVPn9` | game-1776951817147-bsxvzbcbr | 10 | desktop | Robin Sharpshooter was readied after question for no reason. When I played Hades I could not target anything, and the game targeted their... |
| 2026-04-08 23:24 | `Azpx_pzvU8` | game-1775690194401-axfyxs32i | 9 | desktop | the abilty from  resloving  hades doesnt work |
| 2026-04-03 09:43 | `Ky_fSs1Ziz` | game-1775208877685-huwimvvzh | 14 |  | AI plays Hades what da ya say, I can't resolve the effect |
| 2026-03-30 17:50 | `P2rRY9bNJx` | game-1774892392139-tsqttnjc2 | 18 |  | Hades tried to target a warded character and the action can't be resolved |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mulan-elite-archer — mulan elite archer (14 reports) <a id="cluster-mulan-elite-archer"></a>

Representative descriptions:
- _The Mulan Elite Archer trigger has not been happing when she dies in a challenge._
- _When I attack with Mulan Elite Archer, I should do the same damage to 2 other characters_
- _mulan elite archer card, when you do damage to 1 charecter you can do the same damage to up to 2 other chosen charecters. it only allows you to select one other charecter not 2 like the card states, also from another ..._
- _Mulan - Elite Archer only gives option to deal damage to only one additional character instead of two._
- _Mulan - Elite Archer can only select (1) target with her effect._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-06 20:26 | `SfP17tv6px` | mg-Cf42svR9_3HQe3RIikT1 | 17 | desktop | The Mulan Elite Archer trigger has not been happing when she dies in a challenge. |
| 2026-05-01 01:11 | `V6O60lS2q3` | mgAGL1WvOu2HeIZF2-2qdSC | 21 | desktop | When I attack with Mulan Elite Archer, I should do the same damage to 2 other characters |
| 2026-04-22 04:19 | `7HGMmqLxDi` | game-1776831014922-0wau8x5i0 | 17 | desktop | mulan elite archer card, when you do damage to 1 charecter you can do the same damage to up to 2 other chosen charecters. it only allows ... |
| 2026-04-21 17:44 | `1x-4AmFwVS` | game-1776792569544-iy22nwkc4 | 15 | desktop | Mulan - Elite Archer only gives option to deal damage to only one additional character instead of two. |
| 2026-04-20 05:57 | `uk5njLcUQM` | game-1776664255222-c1ja8opug | 19 | desktop | Mulan - Elite Archer can only select (1) target with her effect. |
| 2026-04-17 05:28 | `ogA0p6YSro` | game-1776402658328-d1wsmkfy8 | 15 | desktop | Mulan elite archer cannot choose 2 characters, it only allows you to choose one |
| 2026-04-17 02:26 | `v_i3R2iQz_` | game-1776392211683-j7cvnl8mv | 21 | desktop | Mulan Elite Archer - when she challenges, she should be able to deal damage to TWO characters not just one. |
| 2026-04-16 19:38 | `xUIYMkgJyd` | game-1776367317629-qvsjbjkru | 23 | desktop | Mulan - Elite Archer's Triple Shot ability triggers and once selected 0 characters cannot be chosen and their is no way to cancel accepti... |
| 2026-04-16 19:36 | `OLIudkkmpL` | game-1776367317629-qvsjbjkru | 21 | desktop | Mulan - Elite Archer's triple shot ability only allowed me to target one character and not two. |
| 2026-04-15 09:42 | `jamVzPUezc` | game-1776245600589-bq33cyxz1 | 14 | desktop | Mulan Elite Archer really won't let me target a 2nd target for triple shot |
| 2026-04-13 01:24 | `w7psTqcSBp` | game-1776042341878-e86662q4a | 30 | desktop | Mulan Elite Archer doesn't perform the double attack. |
| 2026-04-12 00:26 | `SvzjUZPuuQ` | game-1775952815943-lna25enem | 17 | desktop | Mulan Elite archer not having choices causes the game to glitch out and not fully resolve |
| 2026-04-11 14:49 | `OTLIFoT77u` | game-1775918289866-a3i8yljm4 | 13 | desktop | Could only select 1 additional target for Mulan Elite Archer |
| 2026-04-11 12:41 | `YnVGrIFZB_` | game-1775910680230-qawwenti7 | 16 | desktop | when using mulan elite archer's ability you can only select 1 opposing character not the max 2 that the ability allows |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-cinderella — cinderella (14 reports) <a id="cluster-cinderella"></a>

Representative descriptions:
- _my opponenet draw with empty had with cinderella  effect  the  blue  4 unink one_
- _I played Mowgli to reveal their hand. Then on their turn, when they played Cinderella, it revealed their hand again._
- _Cinderella trigger let me draw a card without inking a card. I had no cards in hand at the time and the trigger resolved_
- _cinderella drew without inking a card/ no cards in hand_
- _On turn 5 I played 4 drop Cinderella. I skipped her effect (put a card from my hand into my inkwell to draw another card) on purpose. The bug happened in the subsequent turns (5,6,7 etc), which all gave me the option ..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-03 12:19 | `VR-nRFilwF` | mgEEL-VKWxLoPwJHAQaNTFa | 10 | desktop | my opponenet draw with empty had with cinderella  effect  the  blue  4 unink one |
| 2026-05-02 15:40 | `W8D2pMN-VJ` | mgk8zciQoxbkFg1Doi4zmPc | 12 | desktop | I played Mowgli to reveal their hand. Then on their turn, when they played Cinderella, it revealed their hand again. |
| 2026-04-27 20:00 | `HGZuSMdM6g` | mgM9j3XAVYzXVCK9xIl_qfd | 21 | desktop | Cinderella trigger let me draw a card without inking a card. I had no cards in hand at the time and the trigger resolved |
| 2026-04-25 03:44 | `StJEMvLjPY` | game-1777088350971-nmekz4h04 | 11 | desktop | cinderella drew without inking a card/ no cards in hand |
| 2026-04-14 15:36 | `kZxHTADSCU` | game-1776180048255-zfjd9o4jp | 30 | desktop | On turn 5 I played 4 drop Cinderella. I skipped her effect (put a card from my hand into my inkwell to draw another card) on purpose. The... |
| 2026-04-13 09:08 | `4meujpIklP` | game-1776071077424-o2fkssngd | 10 | desktop | Cinderella dream comes true triggers every turn |
| 2026-04-13 04:06 | `raDdsd0-0H` | game-1776052841903-liucpsn55 | 9 | desktop | I just ended up being allowed to do a Cinderella ramp twice while only having played her once, last turn. |
| 2026-04-13 01:51 | `7n72itLuqK` | game-1776044520293-eag9pey5b | 21 | desktop | Cinderella was able to boost even when I didnt play a princess |
| 2026-04-12 22:47 | `VlILC4KgGa` | game-1776033454852-x7yxn063p | 20 | desktop | Cinderella activating every time whitout a princess being played, Lady tremaine boost activating even if she did not boost that turn, Kri... |
| 2026-04-12 21:41 | `K5_fGTIHi5` | game-1776029424618-836nww2h8 | 14 | desktop | I could do the ability of cinderella every turn |
| 2026-04-12 19:08 | `N08cEorJhg` | game-1776019984036-aq0zaszdf | 18 | desktop | Cinderella's effect to ink a card triggerred after every turn even when I did not play a princess card. |
| 2026-04-12 10:41 | `3PzMMfX3s-` | game-1775990044194-1pr4zanlk | 15 | mobile | 4 Coste Saphhire Cinderella effect Trigger showed up at each round. Even, if no Princess was played. |
| 2026-04-12 06:14 | `3B5Kzv0q5b` | game-1775974332885-3ftv3d6gb | 11 | mobile | Blue Cinderella triggers every end of turn for no reason |
| 2026-04-12 05:03 | `y0Hp-ssckp` | game-1775969983396-m3f6g7pzi | 9 | desktop | Cinderella wish fufil shouldn't be asking for an effect each turn when no princess is played |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-emerald-chromicon — emerald chromicon (12 reports) <a id="cluster-emerald-chromicon"></a>

Representative descriptions:
- _emerald chromicon Rarely triggers its ability for the player, but consistently triggers for the Practice AI_
- _Emerald chromicon is not working/trigggering_
- _emerald chromicon not working_
- _emerald chromicon not working_
- _emerald chromicon not working_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-04 15:54 | `HfYh8Yv9xM` | game-1777909940960-pyxfu7z1h | 7 | desktop | emerald chromicon Rarely triggers its ability for the player, but consistently triggers for the Practice AI |
| 2026-05-03 04:21 | `ba_HZYARxk` | game-1777781932851-t13nxogb5 | 7 | desktop | Emerald chromicon is not working/trigggering |
| 2026-05-01 17:42 | `-um02Q2f-y` | mgzSycyhzp9Oo3rs0Lqriek | 10 | desktop | emerald chromicon not working |
| 2026-04-29 00:30 | `2HoyCIZwJI` | mgKQx_cyUsIwrStYZPKGRql | 12 | desktop | emerald chromicon not working |
| 2026-04-28 01:18 | `lYTscAInfg` | mg6UmDUaPm0DCw1YlYAumgg | 11 | desktop | emerald chromicon not working |
| 2026-04-26 03:14 | `QQhsPBhcXR` | mg8_powmzdcledICEoV942E | 10 | desktop | Emerald chromicon not working! |
| 2026-04-23 14:46 | `xOWZAYbAtD` | game-1776955364277-3hk0sgewc | 7 | desktop | emerald chromicon didn't go off |
| 2026-04-12 21:52 | `nwctC0vuv0` | game-1776030585636-lz1u98z62 | 7 | desktop | Emerald Chromicon doesnt trigger on my opponents turn as Expected |
| 2026-04-12 16:56 | `MZtLQuHrdv` | game-1776012401772-32a059bvw | 14 | desktop | Emerald Chromicon doesnt trigger if more then 2 effects take action after a banish |
| 2026-04-12 16:55 | `DLSJRzV4Pd` | game-1776012401772-32a059bvw | 14 | desktop | The emerald chromicon doesnt trigger every time |
| 2026-04-12 11:05 | `opYCQuE-gW` | game-1775991110822-3xnwxys4a | 15 | desktop | Emerald Chromicon not working, When opponent is banishing my characters, it is not giving me the option to return one of their characters... |
| 2026-04-11 20:49 | `ae_bPNT5Xz` | game-1775939968749-216uh1bbx | 20 | desktop | Emerald Chromicon bounce effect unavailable unless Scrooge bounces himself back. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-belle — belle (12 reports) <a id="cluster-belle"></a>

Representative descriptions:
- _belle didn't work_
- _i can only see the first 3 items i play so when i play blue green items and have 20ish i cant use scrooge mc duck or belle or fish bone quill_
- _when I used unconvetional tool banning it to play belle, i must use the ability where I would play an item paying 2 inks less, but the game not permited/actived my hero's medal._
- _wont let me banish item belle ability_
- _He killed my Belle and it didn't allow me to put her in my inkwell._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-01 06:04 | `fxPSSELBty` | mgGuJklI5laHgwOMUXhFmLt | 17 | desktop | belle didn't work |
| 2026-04-27 21:18 | `piX-8R1voO` | mgS72kR-Xk0vFZL0_ZYReH4 | 12 | desktop | i can only see the first 3 items i play so when i play blue green items and have 20ish i cant use scrooge mc duck or belle or fish bone q... |
| 2026-04-24 15:58 | `VdNc-p_ZBQ` | game-1777046034525-66niq34a3 | 1 | desktop | when I used unconvetional tool banning it to play belle, i must use the ability where I would play an item paying 2 inks less, but the ga... |
| 2026-04-15 12:59 | `rW-bOR2isR` | game-1776257799984-fr1yvbibq | 3 | desktop | wont let me banish item belle ability |
| 2026-04-09 17:36 | `akqzgdip5O` | game-1775755857988-1aolwun13 | 10 | desktop | He killed my Belle and it didn't allow me to put her in my inkwell. |
| 2026-04-09 13:13 | `95KIwLWoXJ` | game-1775740144398-hezqa5d48 | 10 | desktop | Belle should trigger herself and go to ink when she is banished, she does not. |
| 2026-04-09 12:57 | `mdo6y18ryZ` | game-1775738909279-w4dhe83le | 11 | desktop | When Belle is banished, she doesn't go to the Ink Zone. |
| 2026-04-08 21:14 | `0I7KNpEYJK` | game-1775682031403-ymsm6w1qt | 14 | desktop | Belle damage moving is not working |
| 2026-04-08 19:09 | `sqaffc-BnN` | game-1775675198665-cni7u6lsz | 4 | desktop | Can't play Belle for free banishing an item |
| 2026-04-08 13:51 | `1x1ulD37wl` | game-1775656137403-24s47v7xs | 5 |  | can't play belle with her alternativge cost |
| 2026-04-04 05:31 | `_9LmjYr1Ov` | game-1775280457614-dtmu0synf | 5 |  | cant banish an item to play belle acomplished mystic |
| 2026-03-31 01:07 | `A5lh80BU8h` | game-1774919106000-1xv2v8tcl | 1 |  | can use belle to banish an item to play her for free |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-merida — merida (12 reports) <a id="cluster-merida"></a>

Representative descriptions:
- _when using the Merida effect I think the character I choose is just getting banished no matter what. even if they were not dealt enough damage to banish them._
- _Merida doesn't work_
- _Merida's +2 damage ability didn't trigger after using thunderbolt and strength. Also the new Kida's ability only worked for my opponent which makes the card incredibly unfair_
- _Steel Merida's affect doesnt seem to work_
- _Merida's Steady Aim ability is not activating when I play an action that deals damage._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-28 22:47 | `pBd1lYbB3A` | mgZEN491pJVe9whNclH2epS | 21 | desktop | when using the Merida effect I think the character I choose is just getting banished no matter what. even if they were not dealt enough d... |
| 2026-04-28 16:47 | `Eg9Y80zhcf` | mgLrTleRttTPT8TdtryEXnP | 21 | desktop | Merida doesn't work |
| 2026-04-28 13:49 | `u2gwfCegIR` | mgiEkUUnTTbeZwfXAdBNjff | 14 | desktop | Merida's +2 damage ability didn't trigger after using thunderbolt and strength. Also the new Kida's ability only worked for my opponent w... |
| 2026-04-28 09:18 | `8aoijc3hBe` | mg6k2Kuq_T9A7iRorgwQwVG | 14 | desktop | Steel Merida's affect doesnt seem to work |
| 2026-04-27 23:11 | `2Da1uaB6V7` | mgb4M2WkxVzKv1ESfOvnhrn | 16 | desktop | Merida's Steady Aim ability is not activating when I play an action that deals damage. |
| 2026-04-27 22:28 | `M9VN_N-FmV` | mgDN5Rd18FJ-b6DUxxrCJCx | 12 | desktop | Merida's ability to do 2 extra damage from Actions, is not triggering on Card 2 Arrows |
| 2026-04-27 20:26 | `EZbVKPAUw9` | game-1777321358620-06pwo15op | 13 | desktop | Merida - Former acher isn't implemented yet. Second ability doens't work |
| 2026-04-27 15:58 | `LQJ2Bawn4T` | mgvPO92pQWDVZa4TGgPjo3d | 13 | mobile | Merida effect of doing two more damage is not applying |
| 2026-04-26 05:15 | `xTruWp0y3X` | mgviN3QYWbIUQkBVhPRAeNz | 36 | desktop | Merida's effect not implemented yet! |
| 2026-04-25 15:14 | `-wCBIRxLqD` | mgsMalTqDPBU_Zj8OoQaAX_ | 24 | mobile | Merida legendary second ability "Stready aim" doesn't trigger at all |
| 2026-04-25 11:21 | `i0jCGtf6bA` | game-1777115649764-w07ew4rwo | 13 | desktop | Merida doesnt deal extra damage |
| 2026-04-24 23:06 | `sVeSc6hqC3` | game-1777071149024-d29ynu818 | 22 | desktop | Merida Effekt did not Trigger. So the Strenght Effekt just deal the normal amount of Damage instead of the +2 Dmg |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-touch-the-sky — touch the sky (11 reports) <a id="cluster-touch-the-sky"></a>

Representative descriptions:
- _Touch the Sky allows targets to be chosen, but unable to confirm choices_
- _could not hit confirm button when using Touch the Sky_
- _cannot resolve effect for Touch the Sky_
- _touch the sky - action song - it would not allow me to choose character to move to which location or confirm_
- _touch the sky isnt working, im trying to sing it and put that character at a location but will not confirm_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-05 09:04 | `GNPPCGsaKv` | mgLVUf21RgHprK5IYlpvmaL | 13 | desktop | Touch the Sky allows targets to be chosen, but unable to confirm choices |
| 2026-05-05 08:31 | `BrZhUdqw8V` | game-1777969782991-gx1vaq1d3 | 7 | desktop | could not hit confirm button when using Touch the Sky |
| 2026-05-05 01:24 | `CD5WAu5leP` | mgsRqU-t69avG-3aVZzj9CG | 13 | desktop | cannot resolve effect for Touch the Sky |
| 2026-05-04 18:32 | `rCHOdM3X-5` | mgS7pjndJN0SLwZ5ULQ8vFW | 13 | desktop | touch the sky - action song - it would not allow me to choose character to move to which location or confirm |
| 2026-05-03 21:19 | `NcmKSFRFU-` | mgWctofgWUvijAdMq-9UPcd | 7 | desktop | touch the sky isnt working, im trying to sing it and put that character at a location but will not confirm |
| 2026-05-03 10:57 | `mVrfeh_u5N` | mgI5ZSu4PvFc9-6NSw6OBLk | 17 | desktop | touch the sky is broken. it wont let me choose which location to play and it wont let me move carachters to draw cards |
| 2026-05-03 04:27 | `3onZi6jN2k` | mg8IMtvElLxBj6s36YsVG-O | 5 | desktop | I can't select "confirm 2/2" using Touch the Sky |
| 2026-05-03 04:25 | `sC_oqqk0mT` | mgXWm9fyS-kxxNUVWxm23GU | 13 | desktop | Touch the Sky does not allow you to move a character after singing |
| 2026-05-02 09:01 | `bgU6a9LGhW` | mgFLetZezRIw6XCX7a8Mcic | 10 | desktop | Touch the sky was working properly, but now it doesn't allow to move |
| 2026-05-01 20:12 | `Sz9SlQKhNe` | mgw7uVNsNoGMV2ro1yiaZcc | 17 | desktop | I can't use a card"touch the sky" |
| 2026-05-01 12:59 | `jf-5vBVBSU` | mgxXmF9SvxSyafDnIgF5Oyl | 9 | desktop | Wont allow me to confirm moving a character to a location with Action Touch the Sky |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-pete — pete (10 reports) <a id="cluster-pete"></a>

Representative descriptions:
- _Can't pay 1 ink to boost Pete_
- _Pete - Ghost did not trigger even with a boost._
- _Cant boost pete :(_
- _Pete will not boost!_
- _it doesnt let me make the pete action with the boost_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-10 07:30 | `3EkG10q1EI` | mgFox8i2WlICDLNHUzmZGI4 | 9 | desktop | Can't pay 1 ink to boost Pete |
| 2026-04-20 02:22 | `vRzKvoF_f4` | game-1776651088200-h63lnen16 | 16 | desktop | Pete - Ghost did not trigger even with a boost. |
| 2026-04-13 01:47 | `hXMWbz12Db` | game-1776044520293-eag9pey5b | 10 | desktop | Cant boost pete :( |
| 2026-04-09 07:35 | `IVNhZVL5SQ` | game-1775719042948-6vreelc1s | 24 | mobile | Pete will not boost! |
| 2026-04-08 14:55 | `IYuPwuREkL` | game-1775659188627-2a8u39yjh | 13 |  | it doesnt let me make the pete action with the boost |
| 2026-04-08 14:36 | `KFXTBDlKGw` | game-1775658744700-c8j6y6ewz | 9 |  | Pete's ability not working with boost |
| 2026-04-08 13:49 | `mKJoZ_ABIr` | game-1775655299811-opb57o9dl | 23 |  | Cannot resolve Pete's effect |
| 2026-04-08 13:32 | `ApGnLaYhaQ` | game-1775654819609-cv2pe5mfn | 9 |  | Pete effect is not trigger correctly |
| 2026-04-02 19:16 | `997ogYYh4_` | game-1775156979156-ba4uqm610 | 11 |  | Quested with everyone at once, and Pete trigger cannot resolve |
| 2026-04-02 18:33 | `ix2vzOS9ck` | game-1775154095572-95skm9onv | 22 |  | Cant resolve effects on boosted characters. Pete is the main on having issues |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-hades-looking-for-a-deal — hades looking for a deal (10 reports) <a id="cluster-hades-looking-for-a-deal"></a>

Representative descriptions:
- _Hamish, Hubert and Harris doesn't allow exert on play.  Nani - Stage Manager doesn't reveal the selected card.  Hades - Looking for a Deal doesn't show which card was selected obviously. Need to scroll through the log..._
- _Match log said I played Elsa - Fifth Spirit when I actually played Hades - Looking for a Deal_
- _The dialogue prompt for Hades - Looking For a Deal doesn't indicate which target the active player selected, which makes the dialogue confusing._
- _Hades Looking for a Deal (AI) attempted to target Elsa Ice Artisan (me). A dialogue asking me to resolve, however unable to as it's looking for something in the back end. Game unable to proceed._
- _"Hades - Looking for a deal" effect won't resolve._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-07 22:33 | `egnGaxK4bL` | mg6vY_YcxO2jiXR0Mzbhave | 13 | desktop | Hamish, Hubert and Harris doesn't allow exert on play.  Nani - Stage Manager doesn't reveal the selected card.  Hades - Looking for a Dea... |
| 2026-04-12 15:31 | `1ajClfXRym` | game-1776006800058-jley0hhou | 27 | desktop | Match log said I played Elsa - Fifth Spirit when I actually played Hades - Looking for a Deal |
| 2026-04-08 22:26 | `1zQ5q4xrtA` | game-1775686477348-hctijmbyr | 14 | desktop | The dialogue prompt for Hades - Looking For a Deal doesn't indicate which target the active player selected, which makes the dialogue con... |
| 2026-04-02 03:53 | `0H-hpauZ5J` | game-1775101560357-80lotp0se | 13 |  | Hades Looking for a Deal (AI) attempted to target Elsa Ice Artisan (me). A dialogue asking me to resolve, however unable to as it's looki... |
| 2026-04-01 07:33 | `wU-HEVW1aU` | game-1775028185190-w93ep48is | 13 |  | "Hades - Looking for a deal" effect won't resolve. |
| 2026-03-31 21:55 | `Tr4S4_tfOk` | game-1774994014943-31zbsauck | 9 |  | Every time that Hades -  Looking for a deal there's no way to resolve the effect |
| 2026-03-31 12:40 | `wEZyiONMjy` | game-1774960134615-azzejreok | 12 |  | Hades - Looking for a Deal effect stalls. AI does not make a selection. Effect doesn't process and the game is halted.  Royal Guard's Cha... |
| 2026-03-31 11:29 | `d44jjscYxs` | game-1774956012411-gy1rf53ou | 14 |  | AI played Hades looking for a deal no character on my board, can't seem to skip the effect |
| 2026-03-31 04:30 | `qyDKbr5FGy` | game-1774930845748-9m14scykz | 12 |  | AI Played 'Hades Looking for a Deal' targeting 'Scrooge McDuck SHUCH Agent'. When player selects 'resolve effect' error message "resolveE... |
| 2026-03-30 19:23 | `S6E8gFnRMh` | game-1774897961880-9pyerujrt | 15 |  | unable to resolve or proceed after  Hades - Looking for a Deal: WHAT D'YA SAY? on play effect activated |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-the-black-cauldron — the black cauldron (10 reports) <a id="cluster-the-black-cauldron"></a>

Representative descriptions:
- _I cannot play cards from under the Black Cauldron. It shows them in my hand, but does not give me the option to play those cards (I have enough ink)._
- _black cauldron can't work_
- _Can't play cards from under cauldron_
- _It won't allow me to play a card under the Cauldron_
- _not allowing card to be played from under cauldron_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-07 17:25 | `OXXmNdW5Wc` | mgBc6O-S4_teGk3ju1n-_NJ | 18 | desktop | I cannot play cards from under the Black Cauldron. It shows them in my hand, but does not give me the option to play those cards (I have ... |
| 2026-04-25 03:40 | `yg728V7pQB` | game-1777087763063-mq7erf7l5 | 22 | mobile | black cauldron can't work |
| 2026-04-23 02:10 | `X56FwjJA4z` | game-1776909548009-i95b7gy6g | 19 | desktop | Can't play cards from under cauldron |
| 2026-04-22 03:12 | `LZdNFipNLa` | game-1776826641188-ch3yx4iz7 | 17 | desktop | It won't allow me to play a card under the Cauldron |
| 2026-04-18 18:36 | `y6Zx4-5cHs` | game-1776536181046-57dcdb7c2 | 23 | desktop | not allowing card to be played from under cauldron |
| 2026-04-17 03:23 | `NYKfJO4Z0L` | game-1776395638030-xluym6biq | 13 | desktop | It could be UI or it could be a bug. If UI - I can't find how to play a character from The Black Cauldron. I have successfully exerted th... |
| 2026-04-16 11:03 | `8nlb6jzm2Q` | game-1776336688035-vibmmcij7 | 13 | desktop | I was not able to play my character from cauldron |
| 2026-04-13 17:53 | `2_6A6xRNWm` | game-1776102336642-tcmwpp3a0 | 15 | mobile | The second effect of the Black Cauldron doesn't apply, it only selects the card but you can't summon it. |
| 2026-04-08 14:51 | `YWuZfsP05Y` | game-1775658781538-mvkfemo41 | 21 |  | Can't play card from under The Black Cauldron |
| 2026-04-08 13:22 | `pOFOlrSo2v` | game-1775653379268-ztjp8prqy | 22 |  | Couldn't use black cauldron cards |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-anna-soothing-sister — anna soothing sister (10 reports) <a id="cluster-anna-soothing-sister"></a>

Representative descriptions:
- _Anna Soothing Sister doesnt give extra lore. Horned King Triumphant Ghoul is not triggered when anna's ability fails to work properly on her- it also fails to give him the extra 2 lore._
- _Anna Soothing Sister gives no extra lore when she uses her questing ability._
- _Anna Soothing Sister's Warm Heart ability gives no extra lore after selecting a character from my discard with the effect. please fix asap_
- _Anna Soothing Sister's "Warm Heart" ability is bugged: 1. Cannot choose non character cards 2. Gives no extra lore please remedy this, horned king and anna brave little sister so they all work together as intended! asap!_
- _Anna Soothing Sister does not give any additional lore when i select a character from my discard with her effect._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-03 23:13 | `6uCbONhCzn` | mgXEC7tRUFwVHRjoveokzWt | 9 | desktop | Anna Soothing Sister doesnt give extra lore. Horned King Triumphant Ghoul is not triggered when anna's ability fails to work properly on ... |
| 2026-05-02 19:49 | `PkmzRI2CcM` | mgpB4jBhIVNG2FFv4NqmoTM | 8 | desktop | Anna Soothing Sister gives no extra lore when she uses her questing ability. |
| 2026-05-01 23:21 | `w7ncUPv8GL` | mgEekyUP9d7YfL_vSsxP7OZ | 11 | desktop | Anna Soothing Sister's Warm Heart ability gives no extra lore after selecting a character from my discard with the effect. please fix asap |
| 2026-04-30 19:14 | `i7OEAzU5Eq` | mgB-MdxiCKrOYiC31kR2wJz | 9 | desktop | Anna Soothing Sister's "Warm Heart" ability is bugged: 1. Cannot choose non character cards 2. Gives no extra lore please remedy this, ho... |
| 2026-04-29 23:45 | `RN5_gi-JOx` | mg8kTjDdtlJE5KJn2BRgIgA | 9 | desktop | Anna Soothing Sister does not give any additional lore when i select a character from my discard with her effect. |
| 2026-04-28 22:23 | `S8jkCpGjGS` | mgtY1d8NhqaO1DxM_znXKzp | 13 | desktop | Anna - soothing sister doesn't allow you to pick from your own discard |
| 2026-04-28 21:25 | `_hLlUyBozq` | mgY3Pr_zDsUuZj3lI46-IEs | 12 | desktop | anna soothing sister not giving additional lore when questing despite me choosing a character card with positive lore from my own discard... |
| 2026-04-28 20:01 | `-sEjUFBRrS` | mguenSJNdj7CHSsPGwpoKeP | 9 | desktop | Anna Soothing Sister's effect gives no extra lore when i choose my character and put it on the bottom of the deck. breaks anna entirely. |
| 2026-04-27 07:15 | `dQ0E4B4y9B` | game-1777273521861-uez8xc9fp | 17 | desktop | Anna Soothing Sister Effect did not resolve correctly. I did not gain the amount of lore I should have when I chose a character from my d... |
| 2026-04-11 16:21 | `8bka6iJoLJ` | game-1775923175286-f0ilycfl1 | 20 | desktop | Anna soothing sister questing effect not working. Targeted prince phillip in discards, but still only quested for 1 |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-moana — moana (9 reports) <a id="cluster-moana"></a>

Representative descriptions:
- _Moana not inking from discard_
- _Can't use the effect of moana_
- _ancestral legeend moana does not work_
- _Moana is drawing cards instead of inking them._
- _moana ancestral legacy not working  Not allowing to boost pete_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-10 08:42 | `Ga0yworvAT` | mgL-Fnhggt528wWQSSI69-7 | 12 | desktop | Moana not inking from discard |
| 2026-04-29 15:31 | `GTZaqXVmd9` | mgKnWbs0CLXRu-mYJ737Pas | 11 | desktop | Can't use the effect of moana |
| 2026-04-28 23:44 | `pYYfyWjNZD` | mgN7C4eaZzpi2ZWJlZI-hi3 | 13 | desktop | ancestral legeend moana does not work |
| 2026-04-27 20:00 | `S05XlsdcfN` | mgM9j3XAVYzXVCK9xIl_qfd | 21 | desktop | Moana is drawing cards instead of inking them. |
| 2026-04-16 00:56 | `seFAaF5XRT` | game-1776300487813-iwd93khuq | 12 | desktop | moana ancestral legacy not working  Not allowing to boost pete |
| 2026-04-10 00:46 | `cG5URNH37d` | game-1775781207828-dbch5nk92 | 16 | desktop | Moana Ancestry Ability did not proc |
| 2026-04-08 22:09 | `JtBLlTyqaX` | game-1775685915891-uo8fszfbb | 11 | desktop | Having issues with inking from Discard with Moana on the board. Currently is wet, with Malicous mean and Scary in discard and no hand. Un... |
| 2026-04-08 14:31 | `cxB4IgsOTK` | game-1775657239206-h989foabk | 42 |  | Cannot Ink with Moana ink from discard card, lost me the game |
| 2026-03-30 22:08 | `7e5LMZ6OMl` | game-1774908031114-9h0qqha8e | 9 |  | could not use Ancestral legacy from Moana and Ink from Discard? |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-hades-infernal-schemer — hades infernal schemer (8 reports) <a id="cluster-hades-infernal-schemer"></a>

Representative descriptions:
- _Hades Infernal Schemer blue is not allowing one to choose the character to banish. it allows opponent to choose._
- _Hades Infernal Schemer has been letting the opponent pick which character to banish rather than the person who plays it, which isn't correct._
- _When I played Hades Infernal Schemer my opponent got to choose the card affected instead of me choosing._
- _Hades - Infernal Schemer just allowed the  opponent to choose which card to banish when it should be the players choice._
- _When I play Hades-Infernal Schemer, my opponent can choose the character_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-24 02:32 | `0xdXH9C0b8` | game-1776997372991-3og3v53dq | 15 | desktop | Hades Infernal Schemer blue is not allowing one to choose the character to banish. it allows opponent to choose. |
| 2026-04-23 17:41 | `0FrWOIQ0tY` | game-1776965518707-952aih5y9 | 16 | desktop | Hades Infernal Schemer has been letting the opponent pick which character to banish rather than the person who plays it, which isn't corr... |
| 2026-04-23 15:10 | `KQCiu3hKV7` | game-1776956008333-a4ttmc373 | 22 | mobile | When I played Hades Infernal Schemer my opponent got to choose the card affected instead of me choosing. |
| 2026-04-23 14:56 | `yiNxloLUU7` | game-1776955729834-sdhriu9pu | 15 | desktop | Hades - Infernal Schemer just allowed the  opponent to choose which card to banish when it should be the players choice. |
| 2026-04-23 14:54 | `S2orHyniLJ` | game-1776955729834-sdhriu9pu | 12 | desktop | When I play Hades-Infernal Schemer, my opponent can choose the character |
| 2026-04-23 13:45 | `RGbrKVZwZ6` | game-1776951450520-ddvmpokf0 | 9 | desktop | I was able to resolve the effect of hades - infernal schemer instead of my opponent who played it |
| 2026-04-23 13:14 | `oRUzXENEDS` | game-1776949713546-xvhr4et5z | 14 | desktop | When an opponent plays Hades - Infernal Schemer, it has me choose the target, when it should be the player who played the Hades |
| 2026-04-15 18:06 | `Qo1rV6VDY0` | game-1776275894871-r0tx13zmi | 15 | desktop | When my boosted Genie was put into the inkwell by Hades - Infernal Schemer, I could see the card that was under Genie. I believe that sho... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-the-leviathan — the leviathan (7 reports) <a id="cluster-the-leviathan"></a>

Representative descriptions:
- _You lose, the oponent player the leviathan the cost 10 for 5 in 3 play  Perdí,  el oponente jugo the leviathan de coste 10 por 5 en las 3 partidas y eso con las acciones que tenía nose podía hacer, debe de haber algún..._
- _Leviathan selected 4 targets to banish but only 2 of the 4 were banished. the strength of the characters was not above 10_
- _Leviathan's effect doesn't work_
- _The Leviathan's effect is broken. It will often fail to destroy all characters that you target, even when they have 10 or less attack in total_
- _The Leviathan often doesn't work. It will let you target properly but then randomly leave some characters alive. I think there's something wrong with the way it counts attack._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-16 00:32 | `G_rKnff1Yv` | mgmsoxEPpmxst3r7_HA_G7w | 18 | mobile | You lose, the oponent player the leviathan the cost 10 for 5 in 3 play  Perdí,  el oponente jugo the leviathan de coste 10 por 5 en las 3... |
| 2026-05-06 15:54 | `T-y-y-2D_a` | mg37bgtuklGH_UqM0QjHmsV | 12 | desktop | Leviathan selected 4 targets to banish but only 2 of the 4 were banished. the strength of the characters was not above 10 |
| 2026-05-02 23:06 | `GHSzI0-044` | mgigwJxNEDpnoloEBEJLXIV | 24 | desktop | Leviathan's effect doesn't work |
| 2026-05-02 22:40 | `E1n-Z2nkY2` | mgF47f_bheAen2j1yAHwQ3o | 14 | desktop | The Leviathan's effect is broken. It will often fail to destroy all characters that you target, even when they have 10 or less attack in ... |
| 2026-05-02 21:12 | `NlK3qVukSu` | mgjVXNlgJ4kpzV0Yo4b4jk1 | 14 | desktop | The Leviathan often doesn't work. It will let you target properly but then randomly leave some characters alive. I think there's somethin... |
| 2026-05-02 20:59 | `-N1ftGBOmN` | mgEaUbNbcd6hBnwtrZHQ598 | 14 | desktop | Leviathan and Dale have glitched interaction |
| 2026-04-28 20:52 | `IJpsG4ppej` | game-1777408991436-ofqdxlnl4 | 19 | desktop | Leviathan should be attack not total cost |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-kida — kida (7 reports) <a id="cluster-kida"></a>

Representative descriptions:
- _Wont let me put cards into my inkwell from my opponents Kida's ability._
- _kida error_
- _Kida doesnt resolve_
- _I am confused as to why Kida was banished here._
- _New Kida from set 12 is not letting opponent put discard into ink_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-06 22:00 | `UmUOTUcEWb` | mgyVjdrHjjYIV4StFSdAOit | 18 | desktop | Wont let me put cards into my inkwell from my opponents Kida's ability. |
| 2026-05-06 13:21 | `kyx-kcewrF` | mgE9LblfYudwrQq2IktwBfw | 15 | desktop | kida error |
| 2026-05-03 21:10 | `EH3HBIkwji` | mgVfuJ_xGpTdqgL7427shOi | 11 | desktop | Kida doesnt resolve |
| 2026-04-28 21:32 | `1ZR9W8LUo-` | mgkUw_zaEr3Jyo5N0FysW9q | 19 | desktop | I am confused as to why Kida was banished here. |
| 2026-04-28 14:07 | `wcTWiVuqM5` | mg-_cSCJYoMSHSmnr5luFIW | 23 | desktop | New Kida from set 12 is not letting opponent put discard into ink |
| 2026-04-28 12:35 | `tqcl1V3RhR` | mgMI-BCdAFc7HZNoepGRmu6 | 12 | desktop | New Legendary Kida, doesnt let the opponent ink 5 cards |
| 2026-04-27 21:49 | `-URmInBx9A` | mgQz85zRnjLq9dUBpHiXVX1 | 10 | desktop | New saphire Kida effect only triggered the person itself, not the enemey (me). |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-elsa — elsa (6 reports) <a id="cluster-elsa"></a>

Representative descriptions:
- _was not able to use elsa's effect  — Chosen character gains Challenger +2 and Rush this turn. (They get +2 while challenging. They can challenge the turn they're played.)_
- _Can’t use characters to sing second star. Selected two 5 cost Elsa’s unable to activate second star. Just says no card’s available. Tried different combo of sing together 10 cost. Same error. Have lost multiple matche..._
- _Cost 2 purple Elsa did not gain another lore when an Anna was in play_
- _Elsa (one which causes two characters to tap down ) was selected by their own player and then readied at the beginning of their turn._
- _pluto whit damage still killing my elsa 5th spirit_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-15 10:18 | `kSUCmdchQv` | mgkO9cXlEJQQxNRbQrulhWl | 10 | desktop | was not able to use elsa's effect  — Chosen character gains Challenger +2 and Rush this turn. (They get +2 while challenging. They can ch... |
| 2026-05-04 04:30 | `5PHvTPzgVy` | mgOx1XJ78ciJbWvuYLsvVFa | 21 | desktop | Can’t use characters to sing second star. Selected two 5 cost Elsa’s unable to activate second star. Just says no card’s available. Tried... |
| 2026-04-30 02:12 | `POs7ufoe2n` | game-1777514685304-7igc97012 | 15 | mobile | Cost 2 purple Elsa did not gain another lore when an Anna was in play |
| 2026-04-20 02:11 | `kUUJqGhIwY` | game-1776650393766-1uyufohr1 | 18 | desktop | Elsa (one which causes two characters to tap down ) was selected by their own player and then readied at the beginning of their turn. |
| 2026-04-19 22:33 | `0r2BrzGfhV` | game-1776637176345-oc8yhx11h | 18 | desktop | pluto whit damage still killing my elsa 5th spirit |
| 2026-03-31 04:47 | `6D5rwgPywK` | game-1774932035780-wsh9756ib | 11 |  | I just played Elsa and I seem to be unable to move her to a location while she's drying - hovering the mouse over the card doesn't bring ... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-he-hurled-his-thunderbolt — he hurled his thunderbolt (6 reports) <a id="cluster-he-hurled-his-thunderbolt"></a>

Representative descriptions:
- _Unable to sing He Hurled His Thunderbolt on any opposing characters_
- _Cannot sing He Hurled His Thunderbolt on John Silver Alien Pirate when playing the song with ink_
- _He hurled his thunderbolt.  If chosen by accident, and no choice on the oppoents side is choosable, it forces you to choose your own target._
- _Merida, Steady Aim did not trigger after playing He Hurled His Thunderbolt_
- _He hurled his thunderbolt is giving resist two to all characters not just deitiies_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-07 16:28 | `ZRGbvob19s` | mgPHEkd2yCJheqb__K4ckLn | 24 | desktop | Unable to sing He Hurled His Thunderbolt on any opposing characters |
| 2026-05-07 01:10 | `YFjryjxplj` | mgku0f2XYSDtzbQzDbZ1yr9 | 17 | desktop | Cannot sing He Hurled His Thunderbolt on John Silver Alien Pirate when playing the song with ink |
| 2026-04-27 01:35 | `RahXq-7Hrl` | mgmd09LsSKqNGXc0MtAoxLs | 9 | desktop | He hurled his thunderbolt.  If chosen by accident, and no choice on the oppoents side is choosable, it forces you to choose your own target. |
| 2026-04-26 20:44 | `EwNm94tEOk` | mgTezgDVfLnTjHvDsD19epq | 13 | desktop | Merida, Steady Aim did not trigger after playing He Hurled His Thunderbolt |
| 2026-04-26 05:27 | `Lohltn4D1h` | game-1777180996913-hintdcvzl | 18 | desktop | He hurled his thunderbolt is giving resist two to all characters not just deitiies |
| 2026-04-08 15:38 | `TbDByZ6UBg` | game-1775662337850-fhrb4185g | 9 |  | I played "He hurled his thunderbolt" on turn 5 without singing or paying Ink |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-ohana-means-family — ohana means family (6 reports) <a id="cluster-ohana-means-family"></a>

Representative descriptions:
- _Ohana means family removes all damage from all characters instead of chosen character._
- _Ohana Means Family healed all damage on the board and drew that many cards._
- _Ohana means family, healed everyone on the board, even opponents.... then gave me that amount of cards.... should only by 1 character and my own_
- _Ohana means family heals and draws for all damage_
- _Ohana means family works on all my characters not just 1_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-15 13:00 | `3lADhcpaYM` | game-1776257412196-tizap8k7u | 14 | desktop | Ohana means family removes all damage from all characters instead of chosen character. |
| 2026-04-15 00:28 | `GsCuD0rHAY` | game-1776212636147-veg0lxcyx | 9 | desktop | Ohana Means Family healed all damage on the board and drew that many cards. |
| 2026-04-14 12:57 | `7qAf6_fd3Z` | game-1776170547189-5x0yqd9mf | 17 | desktop | Ohana means family, healed everyone on the board, even opponents.... then gave me that amount of cards.... should only by 1 character and... |
| 2026-04-13 09:02 | `hISpSwlSxD` | game-1776070322980-4j121oagb | 17 | desktop | Ohana means family heals and draws for all damage |
| 2026-04-10 18:56 | `zV23IXUDD7` | game-1775846855896-x04q5d7jc | 15 | mobile | Ohana means family works on all my characters not just 1 |
| 2026-04-08 23:19 | `61pwVZhoQ-` | game-1775688876486-29qmla45s | 19 |  | Let it go is not resolving. I am able to target a valid opossing character, but get a -cannot resolve- error. The same hapened with Ohana... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-bibbidi-bobbidi-boo — bibbidi bobbidi boo (5 reports) <a id="cluster-bibbidi-bobbidi-boo"></a>

Representative descriptions:
- _Bibbity boppity boo does not work_
- _Bibbidi Bobbidi Boo still doesn't work_
- _i cant play with bibbidi bobbidi boo the same card_
- _Early access is gone but Bibbidi Bobbidi Boo still doesn't work. It lets me bounce a character back but won't let me replay them for free._
- _Bibbidi Babbido Boo won't let me bounce and replay the same card_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-15 15:12 | `xzaCnYZyVq` | mghKcUrp4WhkNs9bWzoTm1X | 11 | desktop | Bibbity boppity boo does not work |
| 2026-05-13 20:52 | `g2OcxZ71M4` | game-1778705229267-filis3jbq | 14 | desktop | Bibbidi Bobbidi Boo still doesn't work |
| 2026-05-13 13:30 | `IenLR8ysez` | mgSDU4wEZlRp_p8iU4vSDfs | 7 | desktop | i cant play with bibbidi bobbidi boo the same card |
| 2026-05-09 08:12 | `cK1F3sdqO_` | game-1778313756871-xiit9kjso | 18 | desktop | Early access is gone but Bibbidi Bobbidi Boo still doesn't work. It lets me bounce a character back but won't let me replay them for free. |
| 2026-05-02 19:07 | `p8MrBPJZXG` | game-1777748074668-0uk5pmgkv | 15 | desktop | Bibbidi Babbido Boo won't let me bounce and replay the same card |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-let-it-go — let it go (5 reports) <a id="cluster-let-it-go"></a>

Representative descriptions:
- _Hi can't hold it back any more do not work_
- _The card underneath my Ariel was revealed when Let It Go put both in the inkwell. It should have remained hidden_
- _Opponent was just able to use "Let It Go" on cards with ward_
- _I was able to play more ink that what I had. I was able to play a 7 cost surfer sitch, and a 5 cost let it go witih 10 ink._
- _Looks like I played a let it go for free_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-13 11:04 | `XzHkFbf_cS` | mgFyID9Rkm80NTXdLkJ4bYS | 15 | mobile | Hi can't hold it back any more do not work |
| 2026-04-29 16:13 | `kwkpNiEI4y` | mgj3D1gIgYOIPJxe1N6APWs | 11 | desktop | The card underneath my Ariel was revealed when Let It Go put both in the inkwell. It should have remained hidden |
| 2026-04-23 14:58 | `aBtMZ0bHQZ` | game-1776955729834-sdhriu9pu | 17 | desktop | Opponent was just able to use "Let It Go" on cards with ward |
| 2026-04-08 15:44 | `Z4YFSNoZl9` | game-1775662530042-omrywr7ah | 14 |  | I was able to play more ink that what I had. I was able to play a 7 cost surfer sitch, and a 5 cost let it go witih 10 ink. |
| 2026-04-08 13:11 | `UwQI5j4U5e` | game-1775653379268-ztjp8prqy | 9 |  | Looks like I played a let it go for free |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-three-arrows — three arrows (5 reports) <a id="cluster-three-arrows"></a>

Representative descriptions:
- _After playing Three Arrows with Merida in play, the two damage counters from Three arrows shows on the characters banished after Merida's trigger resolves._
- _When I played Three Arrows, I clicked the first target, and skipped the second target, it ended up skipping the first target and applied 1 damage instead of two. when I tried to take the action back, it bugged out and..._
- _Three Arrows does not do the extra damage when Merida is in play_
- _Merida's ability to deal 2 extra damage is no activated when I play three arrows_
- _merida did not do extra dmg on three arrows_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-04 11:31 | `LiNTvBD-FH` | mg70XYvphjVCCFkcmUhmAgi | 18 | desktop | After playing Three Arrows with Merida in play, the two damage counters from Three arrows shows on the characters banished after Merida's... |
| 2026-05-03 17:40 | `oY5T4NOXeo` | mgXbNn---tz8_KXuLKPSBDJ | 20 | desktop | When I played Three Arrows, I clicked the first target, and skipped the second target, it ended up skipping the first target and applied ... |
| 2026-04-28 18:29 | `qvAmHF4cGf` | mgQcVgab4J9DqmEFOxfIxfM | 20 | desktop | Three Arrows does not do the extra damage when Merida is in play |
| 2026-04-27 09:59 | `sFVNzFw2Us` | game-1777283702042-06mm92qyk | 13 | desktop | Merida's ability to deal 2 extra damage is no activated when I play three arrows |
| 2026-04-26 04:13 | `WOE3dYiyic` | mg5jX4Mh0LBfIW7G32L4b8A | 15 | desktop | merida did not do extra dmg on three arrows |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-the-horned-king-triumphant-ghoul — the horned king triumphant ghoul (5 reports) <a id="cluster-the-horned-king-triumphant-ghoul"></a>

Representative descriptions:
- _the horned king - triumphant ghoul: hei hei persistent presence returned to hand from discard but does not give extra lore to horned king_
- _the horned king - triumphant ghoul. ability gives no extra lore despite condition being met._
- _The Horned King - Triumphant Ghoul Ability does not give extra lore after I use Hei Hei to challenge - which dies and comes back to hand after hitting discard pile. Trigger is not working for the extra lore. Please fi..._
- _Heihei - Persistent Presence should mechanically pass through discard before being returned to hand - so should trigger The Horned King - Triumphant Ghoul's effect and lore bonus. It did not._
- _I exerted The Black Cauldron and put a character from my discard under it. It didn't trigger The Horned King Triumphant Ghoul's extra lore bonus due to a card leaving a player's discard on my turn._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-04 00:24 | `39PGIqCuy1` | mgBChYC27EVjdYrUVhLbX2s | 10 | desktop | the horned king - triumphant ghoul: hei hei persistent presence returned to hand from discard but does not give extra lore to horned king |
| 2026-05-01 21:46 | `w-Wty9geDo` | mgRGqkka37W7xuT7GMZvYMl | 14 | desktop | the horned king - triumphant ghoul. ability gives no extra lore despite condition being met. |
| 2026-04-30 19:59 | `4zndVY411-` | mgM31wk1AzpGfI_HfeihH3Y | 8 | desktop | The Horned King - Triumphant Ghoul Ability does not give extra lore after I use Hei Hei to challenge - which dies and comes back to hand ... |
| 2026-04-17 03:28 | `fGsyilLdkx` | game-1776396293195-i8xf9xmeb | 7 | desktop | Heihei - Persistent Presence should mechanically pass through discard before being returned to hand - so should trigger The Horned King -... |
| 2026-04-14 22:57 | `WkIKI4jB4j` | game-1776206736731-gpwfio2h6 | 15 | desktop | I exerted The Black Cauldron and put a character from my discard under it. It didn't trigger The Horned King Triumphant Ghoul's extra lor... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-lilo — lilo (5 reports) <a id="cluster-lilo"></a>

Representative descriptions:
- _Lilo died on first challenge_
- _YOU CANNOT PUT DMG ON LILO WITHOUT DAMAGING HER FIRST IT IS ALLOWING DMG TO BE PUT ON LILO EVEN THOUGH THE WORDING IS ''TAKE''_
- _lilo ability layers; does not work she should not take damgage the first time she is supposed to_
- _quand je joue 3 action je ne peut pas jouer la lilo gratuitement_
- _Charged me the 2 for lilo with a willow in play_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-03 01:27 | `xcGtCANRKy` | mgRvOGUaoA80EMiVjtxopbA | 5 | mobile | Lilo died on first challenge |
| 2026-04-23 16:11 | `rODzCNPBnf` | game-1776960334931-we4ewmazg | 13 | desktop | YOU CANNOT PUT DMG ON LILO WITHOUT DAMAGING HER FIRST IT IS ALLOWING DMG TO BE PUT ON LILO EVEN THOUGH THE WORDING IS ''TAKE'' |
| 2026-04-19 07:29 | `Om06ohTxLO` | game-1776583189949-udzxhpn6e | 9 | desktop | lilo ability layers; does not work she should not take damgage the first time she is supposed to |
| 2026-04-09 16:26 | `c2fL6nbUOr` | game-1775751718776-z6myrsud9 | 10 | desktop | quand je joue 3 action je ne peut pas jouer la lilo gratuitement |
| 2026-04-08 23:52 | `dCQrT1u5i3` | game-1775692065526-6dcm9mfp1 | 7 | desktop | Charged me the 2 for lilo with a willow in play |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mr-incredible — mr incredible (5 reports) <a id="cluster-mr-incredible"></a>

Representative descriptions:
- _I have Thunderquack item in play that makes every character a Villain classification. So when I play the 4-cost Mr. Incredible, he should be able to deal 2 damage to anybopposing character b/c they all have the Villai..._
- _My Thunderquack item should give all opposing characters the Villain classification. So then when I play Mr. Incredible, his ability allows me to deal 2 damage to chosen opposing Villain character. i should have been ..._
- _Mr. Incredible is incorrectly drawing cards when Supers are challenging locations._
- _Mr. Incredible challenging a location allows to draw cards_
- _Mr Incredible drew a card when challenging my location_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-02 13:18 | `JSxMa_igTC` | mgVt5CxDtj5o-nmbyeg0NIF | 7 | mobile | I have Thunderquack item in play that makes every character a Villain classification. So when I play the 4-cost Mr. Incredible, he should... |
| 2026-05-01 19:29 | `mtIcwQ1F_9` | mgjAvxY9yWcR3qyeCR7yagb | 11 | mobile | My Thunderquack item should give all opposing characters the Villain classification. So then when I play Mr. Incredible, his ability allo... |
| 2026-05-01 13:53 | `wSOR7kX5j1` | mgtZX7iNfeUcNrTR1MxMZKI | 6 | desktop | Mr. Incredible is incorrectly drawing cards when Supers are challenging locations. |
| 2026-04-29 15:42 | `SyHQJSPnqd` | mgaM5yW_pSYOFjssc75SK-q | 22 | desktop | Mr. Incredible challenging a location allows to draw cards |
| 2026-04-29 15:42 | `rgwcOg2nY4` | mgaM5yW_pSYOFjssc75SK-q | 22 | desktop | Mr Incredible drew a card when challenging my location |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-goliath-clan-leader — goliath clan leader (5 reports) <a id="cluster-goliath-clan-leader"></a>

Representative descriptions:
- _I was unable to select Goliath clan leader as a target when I played the card, Next stop Olympus to ready him._
- _Goliath - Clan Leader from opponent did not trigger at the end of my turn, I did not draw the 2 mandatory cards since my hand was empty._
- _Goliath clan leader effect not triggering_
- _Goliath Clan Leader is forcing me to discard at the end of my opponent's turn - it should not._
- _goliath clan leader if active player has 3 cards in hand it will untap_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-13 09:40 | `5Gne4PG2I9` | game-1776071728816-2dfrcs63i | 22 | desktop | I was unable to select Goliath clan leader as a target when I played the card, Next stop Olympus to ready him. |
| 2026-04-09 00:54 | `xv9r9qQVBR` | game-1775695487269-kegod5rmt | 17 | desktop | Goliath - Clan Leader from opponent did not trigger at the end of my turn, I did not draw the 2 mandatory cards since my hand was empty. |
| 2026-04-08 21:07 | `newHWbt7tE` | game-1775682031403-ymsm6w1qt | 11 | desktop | Goliath clan leader effect not triggering |
| 2026-04-08 15:43 | `lDNG0ZIcPY` | game-1775662466629-rr65vt1ne | 10 |  | Goliath Clan Leader is forcing me to discard at the end of my opponent's turn - it should not. |
| 2026-04-08 14:19 | `98r2fTdbyr` | game-1775657507730-h3cj54wjf | 14 |  | goliath clan leader if active player has 3 cards in hand it will untap |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-ariel — ariel (5 reports) <a id="cluster-ariel"></a>

Representative descriptions:
- _can't boost ariel for draw 1 card when singing_
- _Sang I2I with ariel out. shows as a pending effect but cant do anything_
- _Boost does not work on 4 drop Ariel - Etheral Voice_
- _ariel couldnt boost_
- _Not showing the song they found when they play ariel, also I had qued for core contructed BO! not infinity and this was infinity._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-13 01:51 | `C1MHZTfynL` | game-1776044520293-eag9pey5b | 21 | desktop | can't boost ariel for draw 1 card when singing |
| 2026-04-11 01:21 | `k6-7Dr4hMw` | game-1775870036097-sxp118opq | 7 | desktop | Sang I2I with ariel out. shows as a pending effect but cant do anything |
| 2026-04-09 17:44 | `lur8RRo1ea` | game-1775756090766-qa4s8zk8e | 18 | desktop | Boost does not work on 4 drop Ariel - Etheral Voice |
| 2026-04-08 14:06 | `jtEJBXN6VT` | game-1775656774847-49w6zk5gf | 6 |  | ariel couldnt boost |
| 2026-04-08 13:12 | `nU72XjnHhK` | game-1775653554314-gkm4c8lmk | 10 |  | Not showing the song they found when they play ariel, also I had qued for core contructed BO! not infinity and this was infinity. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-pete-ghost-of-christmas-future — pete ghost of christmas future (5 reports) <a id="cluster-pete-ghost-of-christmas-future"></a>

Representative descriptions:
- _Pete - Ghost of Christmas referred to as kuzco in text report_
- _Could not resolve effect for Pete - Ghost of Christmas Future. It says arrange cards but won't let me click on it._
- _I had 5 ink available and played Pete, ghost of christmas future, and it still said I had 5 ink available to play another card. This also happened when I played my tipo on turn 2_
- _Will not allow Pete - Ghost of Christmas Future ability Foreboding Glance to resolve_
- _Using Pete Ghost of Christmas Future always gives an error and doesn't let you look at cards and select them.  Then times out the game.  I can't use or play any cards after the trigger_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-12 13:03 | `xfiXDGOGtJ` | game-1775997903280-rpone5mpa | 17 | desktop | Pete - Ghost of Christmas referred to as kuzco in text report |
| 2026-04-08 14:39 | `k68GXTFK-E` | game-1775658624915-p6mpfpfcb | 11 |  | Could not resolve effect for Pete - Ghost of Christmas Future. It says arrange cards but won't let me click on it. |
| 2026-04-08 14:36 | `pR_5L9L8HT` | game-1775658624915-p6mpfpfcb | 11 |  | I had 5 ink available and played Pete, ghost of christmas future, and it still said I had 5 ink available to play another card. This also... |
| 2026-04-08 14:35 | `FPCTKjHyPd` | game-1775658424839-qjtq0pcji | 11 |  | Will not allow Pete - Ghost of Christmas Future ability Foreboding Glance to resolve |
| 2026-04-02 17:42 | `haGCH2utJc` | game-1775151041036-lik4xa6nf | 20 |  | Using Pete Ghost of Christmas Future always gives an error and doesn't let you look at cards and select them.  Then times out the game.  ... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-genie-magical-researcher — genie magical researcher (5 reports) <a id="cluster-genie-magical-researcher"></a>

Representative descriptions:
- _I wasn't allowed to boost Genie - Magical Researcher on play with 1 ink available._
- _Genie Magical Researcher is not able to use his boost ability while in play. I had to use Lonely Grave in order to put cards under it._
- _Boost didn't work for Genie - Magical Researcher. Can't click to boost_
- _I wasn't allowed to Boost Genie - Magical Researcher upon play even though I had 1 ink left to use. Royal Guard also acted like a 2/2 when challenged by a Lilo - Escape Artist on the AI's turn (should have only dealt ..._
- _can't boost genie magical researcher_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 23:10 | `zylIz1FxnR` | game-1775775835521-nsvu3xcvh | 13 | desktop | I wasn't allowed to boost Genie - Magical Researcher on play with 1 ink available. |
| 2026-04-09 05:11 | `ZSK537NuXG` | game-1775710542617-xv6ijjh9r | 19 | desktop | Genie Magical Researcher is not able to use his boost ability while in play. I had to use Lonely Grave in order to put cards under it. |
| 2026-04-08 22:19 | `TffbFv4GdQ` | game-1775685886421-u2ukh8haq | 16 | desktop | Boost didn't work for Genie - Magical Researcher. Can't click to boost |
| 2026-03-31 14:39 | `WsMYaFdfeg` | game-1774967672394-bet87dybm | 6 |  | I wasn't allowed to Boost Genie - Magical Researcher upon play even though I had 1 ink left to use. Royal Guard also acted like a 2/2 whe... |
| 2026-03-30 18:09 | `RlF-e66ECW` | game-1774893703679-4gy3eetjt | 9 |  | can't boost genie magical researcher |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-horseman-s-strike — horseman's strike (4 reports) <a id="cluster-horseman-s-strike"></a>

Representative descriptions:
- _Played horseman's strike on a character that was supposed to be evasive until the start of their next turn and I was not able to banish it._
- _Horseman Strikes does not work on Mrs. Incredible if the opponent chose to make her evasive until the start of their turn_
- _Can't challenge after playign horseman_
- _playing vincenzo causes horseman strikes and not his ability_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-15 21:01 | `C51U8XdrVq` | mg1CAj9tTq5y_dtRDdCcsKS | 23 | desktop | Played horseman's strike on a character that was supposed to be evasive until the start of their next turn and I was not able to banish it. |
| 2026-05-10 03:27 | `O_x9cas5PK` | mg34CB9Ah3_3hodGpsa2llo | 13 | desktop | Horseman Strikes does not work on Mrs. Incredible if the opponent chose to make her evasive until the start of their turn |
| 2026-04-25 03:58 | `iZ80YioGvy` | game-1777089040820-3jg4f06ia | 15 | desktop | Can't challenge after playign horseman |
| 2026-04-12 18:02 | `HjnxiOeikR` | game-1776016267532-gtsa3gfyg | 17 | desktop | playing vincenzo causes horseman strikes and not his ability |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-how-far-i-ll-go — how far i'll go (4 reports) <a id="cluster-how-far-i-ll-go"></a>

Representative descriptions:
- _sang "how far i'll go" with grama tala and had an sapphire coil. could not target an opponents character to reduce the attack_
- _How Far I'll go, pops up a window to choose between Hand and Inkwell, but does not show the two top cards from the deck_
- _I was not able to see cards from How Far I'll Go. It wanted me to select but I could not see them._
- _How Far I'll Go Doesnt reveal cards_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-14 20:58 | `lCIqCt_saL` | mgVfFoCgC4asJGm3zayRoVA | 19 | desktop | sang "how far i'll go" with grama tala and had an sapphire coil. could not target an opponents character to reduce the attack |
| 2026-04-10 00:23 | `lRtMGIR_Q9` | game-1775780201295-b7buz3xy2 | 9 | desktop | How Far I'll go, pops up a window to choose between Hand and Inkwell, but does not show the two top cards from the deck |
| 2026-04-10 00:18 | `HvYcIczLlJ` | game-1775779752930-98ky5g525 | 9 | desktop | I was not able to see cards from How Far I'll Go. It wanted me to select but I could not see them. |
| 2026-04-08 18:53 | `az14sUV4iT` | game-1775674078011-6q4561c3q | 5 | desktop | How Far I'll Go Doesnt reveal cards |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-beast — beast (4 reports) <a id="cluster-beast"></a>

Representative descriptions:
- _rush not working on beast_
- _Beast challenged my Pizza Planet location.  I lost one Lore and my opponent gained one Lore.  Since Beast challenged a location, this should not have happened._
- _I couldn't attack with my Beast that had rush_
- _Ignore that last bug report, re Beast not being able to challenge - I'm an idiot._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-13 16:10 | `ybfHRLaHKa` | mgPuHF7nzjvbLgrisWOT1vQ | 6 | desktop | rush not working on beast |
| 2026-05-07 03:54 | `9Qi8SC6To1` | mgqZ6-M_nnsiqJQlkqglX2N | 8 | desktop | Beast challenged my Pizza Planet location.  I lost one Lore and my opponent gained one Lore.  Since Beast challenged a location, this sho... |
| 2026-04-14 09:33 | `6i8VhBipy5` | game-1776158290179-uaot9wb7l | 19 | desktop | I couldn't attack with my Beast that had rush |
| 2026-04-05 05:27 | `tnVTgjMohx` | game-1775366651338-rlm4ovei1 | 3 |  | Ignore that last bug report, re Beast not being able to challenge - I'm an idiot. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mickey-mouse-expedition-leader — mickey mouse expedition leader (4 reports) <a id="cluster-mickey-mouse-expedition-leader"></a>

Representative descriptions:
- _Mickey Mouse - Expedition Leader doesn't give you the option to enter the field tapped._
- _Mickey Mouse Expedition Leader  Long Journey ability does not trigger when entering play_
- _Mickey Mouse - Expedition Leader Its not possible to play this card exerted._
- _Mickey Mouse Expedition Leader doesn't have the choice to enter exerted when you cast him._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-13 13:12 | `GzE9gCGWNV` | mgptMEFJpE8n1DUH9NrupSE | 19 | desktop | Mickey Mouse - Expedition Leader doesn't give you the option to enter the field tapped. |
| 2026-05-03 02:15 | `DWMyrX2j4o` | mgS3SOwebvwXforvp6zLGmi | 1 | desktop | Mickey Mouse Expedition Leader  Long Journey ability does not trigger when entering play |
| 2026-04-30 15:01 | `0-rWSBsR2i` | mg9K0wDvA8BbA3n_LMceud9 | 28 | desktop | Mickey Mouse - Expedition Leader Its not possible to play this card exerted. |
| 2026-04-29 03:57 | `XaSm2AlRPl` | mg9sUr1ut6vtmh6P6ph7b-O | 17 | desktop | Mickey Mouse Expedition Leader doesn't have the choice to enter exerted when you cast him. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mickey-mouse-amber-champion — mickey mouse amber champion (4 reports) <a id="cluster-mickey-mouse-amber-champion"></a>

Representative descriptions:
- _Mickey Mouse - Amber Champion Effect “Friendly Chorus” is not activating upon conditions met for neither solo singer nor when singing together._
- _Mickey Mouse Amber Champion isn't able to be Singer 8 when I have 2 other amber characters in play. Please fix._
- _Mickey Mouse - Amber Champion is not giving +2 health to characters. Managed to banish Lady - Miss Park Avenue with Seven Dwarfs' Mine and Lilo - Escape Artist with Angel - Experiment 624_
- _Mickey Mouse (amber champion) ability-when 2 other amber characters in play this character gets singer 8--doesn't take effect   The Mob Song-- should be able to select 3 characters and or locations and it is only allo..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-12 04:42 | `I1tcOR50dh` | game-1778559963132-p1n1kbdy2 | 20 | mobile | Mickey Mouse - Amber Champion Effect “Friendly Chorus” is not activating upon conditions met for neither solo singer nor when singing tog... |
| 2026-05-02 13:36 | `PnD_9s-_N9` | mg43eHsZyRdT3dwXm9Cw67S | 17 | desktop | Mickey Mouse Amber Champion isn't able to be Singer 8 when I have 2 other amber characters in play. Please fix. |
| 2026-04-15 17:29 | `6g7pv_R-tM` | game-1776273506279-afkmv93fe | 15 | desktop | Mickey Mouse - Amber Champion is not giving +2 health to characters. Managed to banish Lady - Miss Park Avenue with Seven Dwarfs' Mine an... |
| 2026-04-13 04:07 | `WLL4X0Qn2m` | game-1776052683790-otld1xz33 | 16 | desktop | Mickey Mouse (amber champion) ability-when 2 other amber characters in play this character gets singer 8--doesn't take effect   The Mob S... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-goofy — goofy (4 reports) <a id="cluster-goofy"></a>

Representative descriptions:
- _goofy groundbreaking chefs is removing damage and readying opponents exerted damaged cards._
- _using Goofy to move another character to a location, but its not letting me select the location to move to._
- _cant use goofy effekt to take character to a location_
- _goofy is broken and making it so every character only has 1 strength despite all the strength buff modifiers put on him_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-09 08:54 | `n1RuWcZJM_` | mgbZKN9BYqSm72mr13wz5on | 15 | desktop | goofy groundbreaking chefs is removing damage and readying opponents exerted damaged cards. |
| 2026-05-04 20:27 | `yLhBM03SsT` | mgfHRKBMX7cgL0RpBQ1rY0h | 10 | desktop | using Goofy to move another character to a location, but its not letting me select the location to move to. |
| 2026-05-04 18:31 | `n5my4-MAHK` | mgcLhj73JN93SbqT0hwDOs9 | 9 | desktop | cant use goofy effekt to take character to a location |
| 2026-04-08 18:38 | `jrRasFFAh8` | game-1775673232469-a6ppkphfn | 9 | desktop | goofy is broken and making it so every character only has 1 strength despite all the strength buff modifiers put on him |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-woody-jungle-guide — woody jungle guide (4 reports) <a id="cluster-woody-jungle-guide"></a>

Representative descriptions:
- _Set 12 Woody Jungle Guide when he quests his ability Let s Get Moving doesnt allow you to progress and tha game hangs._
- _Woody - Jungle Guide trigger bug where I drew a card but am now stuck where I cannot play a 2 cost or less character, let alone do anything else._
- _Woody - Jungle Guide doesn't allow for on play effects of the card that is played off of the on-quest ability. Also, can't choose whether or not to play the card that is revealed_
- _I quested with Woody Jungle Guide and played Rex using Woody's ability. I wasn't able to play Rex exerted, even though he's a bodyguard_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-04 04:22 | `_1lbOtC8F8` | mg1bEZj_kk46EI5qJ45rxr1 | 14 | desktop | Set 12 Woody Jungle Guide when he quests his ability Let s Get Moving doesnt allow you to progress and tha game hangs. |
| 2026-05-03 03:51 | `dkbhozu66d` | mgz6R30sL9hV1yZKpAyv0n_ | 5 | desktop | Woody - Jungle Guide trigger bug where I drew a card but am now stuck where I cannot play a 2 cost or less character, let alone do anythi... |
| 2026-04-30 03:47 | `t_O1Es1Wm_` | mggQMlkEzwsae9q8_31VT1Z | 11 | desktop | Woody - Jungle Guide doesn't allow for on play effects of the card that is played off of the on-quest ability. Also, can't choose whether... |
| 2026-04-28 19:05 | `MJL-qtCj1P` | mgFtSkwzsY1kQDypDJ6rrZS | 6 | desktop | I quested with Woody Jungle Guide and played Rex using Woody's ability. I wasn't able to play Rex exerted, even though he's a bodyguard |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-robin-hood-sharpshooter — robin hood sharpshooter (4 reports) <a id="cluster-robin-hood-sharpshooter"></a>

Representative descriptions:
- _when questing with robin hood - sharpshooter and finding an action, sometimes it goes into the ink well_
- _Robin Hood Sharpshooter cannot play Down in New Orleans when triggering his ability via questing._
- _Robin Hood Sharpshooter reveals develop your brain when questing to play it for free. Develop your brain effect is skipped and does not resolve_
- _5 cost red legendary lilo was not able to be played even though I played 3 actions in the turn. 2 I played using ink and 1 I played for free using robin hood sharpshooter_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-29 21:20 | `5f2DIJs7MX` | mgdNuDhHZE16_EA3uvLR3OC | 7 | desktop | when questing with robin hood - sharpshooter and finding an action, sometimes it goes into the ink well |
| 2026-04-29 01:29 | `DNzqDMI2fB` | mgudj83FOpeOPviVk_jMbNX | 14 | desktop | Robin Hood Sharpshooter cannot play Down in New Orleans when triggering his ability via questing. |
| 2026-04-24 14:55 | `CYCpxg3egg` | game-1777042117744-dumg8vfbb | 16 | desktop | Robin Hood Sharpshooter reveals develop your brain when questing to play it for free. Develop your brain effect is skipped and does not r... |
| 2026-04-15 16:54 | `mJTvaUzaGM` | game-1776271491546-4jtscay46 | 16 | desktop | 5 cost red legendary lilo was not able to be played even though I played 3 actions in the turn. 2 I played using ink and 1 I played for f... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-strength-of-a-raging-fire — strength of a raging fire (4 reports) <a id="cluster-strength-of-a-raging-fire"></a>

Representative descriptions:
- _Merida - Formidable Archer is not applying her additional damage effect. I didn't get additional damage off of Strength of a Raging Fire or Three Arrows._
- _lilo bundled up seems broken. challenged with a mowgli then attempted to strength of a raging fire and it did not remove._
- _Whenever I have to "choose a character" like choosing a character to deal damage to from Strength of a Raging Fire, or moving damage with Chesire Cat, it is very difficult to click the character in a way that my phone..._
- _The game wouldn’t let me select a target for strength of a raging fire. Then suddenly it played all the cards from my hand and skipped my turn._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-28 16:08 | `MQ-S8hda6V` | mg9xrgsf1i6dOLpgH4j16sf | 25 | desktop | Merida - Formidable Archer is not applying her additional damage effect. I didn't get additional damage off of Strength of a Raging Fire ... |
| 2026-04-24 21:46 | `OSdOHsU4z2` | game-1777066851488-l49z03i8w | 8 | desktop | lilo bundled up seems broken. challenged with a mowgli then attempted to strength of a raging fire and it did not remove. |
| 2026-04-18 03:25 | `CAVvUrpOXM` | game-1776482201827-lbnx52q67 | 10 | mobile | Whenever I have to "choose a character" like choosing a character to deal damage to from Strength of a Raging Fire, or moving damage with... |
| 2026-04-11 18:37 | `eUmbrpLwgX` | game-1775931537100-u6fk9ei16 | 26 | mobile | The game wouldn’t let me select a target for strength of a raging fire. Then suddenly it played all the cards from my hand and skipped my... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-maui-half-shark — maui half shark (4 reports) <a id="cluster-maui-half-shark"></a>

Representative descriptions:
- _Player quested with Maui - Half Shark, then readied and challenged my location without playing anything that would ready Maui,_
- _I challenged a location with maui half shark and game made me do the maui trigger, but i couldnt even select a card_
- _Maui Half Shark Challenged a location and got an action card back from discard. It should only be a character._
- _Maui Half Shark did not trigger after a raging storm_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-25 01:40 | `0Dh2HR0xiM` | game-1777080549395-v1hfxmzxa | 17 | desktop | Player quested with Maui - Half Shark, then readied and challenged my location without playing anything that would ready Maui, |
| 2026-04-20 11:14 | `S_wzZ96D62` | game-1776683329691-qiqxgvnf5 | 16 | desktop | I challenged a location with maui half shark and game made me do the maui trigger, but i couldnt even select a card |
| 2026-04-19 02:25 | `RwRsfqQ5lf` | game-1776564250676-c6zh4yjno | 24 | desktop | Maui Half Shark Challenged a location and got an action card back from discard. It should only be a character. |
| 2026-04-11 07:16 | `WCV-Ko3GxP` | game-1775890825159-6d8zatez3 | 26 | desktop | Maui Half Shark did not trigger after a raging storm |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-donald-duck — donald duck (4 reports) <a id="cluster-donald-duck"></a>

Representative descriptions:
- _I passed my turn, accepted opponent's Donald Duck card draw option. Game locked up. It said I had priority but had no way to pass turn (again)._
- _Donald effect along with guard royal blocked the game_
- _The Daisy Duck - Donald's Date is not showing the card at the top of the deck._
- _Opponents cards are not being revealed when I quest with Daisy Duck - Donald's Date_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-21 16:54 | `S9bPEXXcNZ` | game-1776789704432-0a3kfren7 | 23 | desktop | I passed my turn, accepted opponent's Donald Duck card draw option. Game locked up. It said I had priority but had no way to pass turn (a... |
| 2026-04-12 09:56 | `CaxKw8qAyd` | game-1775987140718-ytdcrgvui | 22 | desktop | Donald effect along with guard royal blocked the game |
| 2026-04-10 18:00 | `5HtfJZYAfZ` | game-1775843271713-jrcycn7v4 | 19 | desktop | The Daisy Duck - Donald's Date is not showing the card at the top of the deck. |
| 2026-04-08 21:24 | `5_N7PXZP3K` | game-1775682976428-r87hjvx9k | 13 | desktop | Opponents cards are not being revealed when I quest with Daisy Duck - Donald's Date |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-dinky-has-the-brains — dinky has the brains (4 reports) <a id="cluster-dinky-has-the-brains"></a>

Representative descriptions:
- _Dinky - Has the Brains continues to appear to be broken. It is supposed to cause the opponent to deal damage to one  of their characters, but opponents seem to be unable to do this and the game cannot progress until t..._
- _Dinky Has the Brains has a bug -opponent cant select target for 1 damage_
- _Whenever I play Dinky - Has the Brains, my opponent is unable to choose a character for their ability_
- _Dinky - Has The Brains when played triggers his ability but the opponent cannot select a target with the current UI so they are stuck and cannot proceed with the game._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-21 13:18 | `FN8f85nJEQ` | game-1776776589882-h5wdlhupg | 22 | desktop | Dinky - Has the Brains continues to appear to be broken. It is supposed to cause the opponent to deal damage to one  of their characters,... |
| 2026-04-20 06:13 | `YeTS_c_bDQ` | game-1776665162698-edzjnuua8 | 11 | desktop | Dinky Has the Brains has a bug -opponent cant select target for 1 damage |
| 2026-04-17 00:38 | `m-KJKeuCWA` | game-1776385861584-lvvfg08az | 11 | desktop | Whenever I play Dinky - Has the Brains, my opponent is unable to choose a character for their ability |
| 2026-04-16 22:12 | `3BYfjMDc5B` | game-1776377090304-4jnb11x94 | 11 | desktop | Dinky - Has The Brains when played triggers his ability but the opponent cannot select a target with the current UI so they are stuck and... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-madam-mim — madam mim (4 reports) <a id="cluster-madam-mim"></a>

Representative descriptions:
- _Mim Elephant wont let me past the pop up.  no damage to move but wont let me past the option.  Mim has 0 damage so nothing to move!_
- _Mim elephant, cant select target or skip_
- _Can’t ignore Mim ability but can’t confirm without damage_
- _Mim shouldnt allow a player to choose a target.  the source of the damage removal is always herself.  also- the way it is coded now it is backwards._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-18 16:36 | `B8d67C9twB` | game-1776529587555-ct1e4f9sj | 13 | desktop | Mim Elephant wont let me past the pop up.  no damage to move but wont let me past the option.  Mim has 0 damage so nothing to move! |
| 2026-04-17 22:57 | `97ksKJP266` | game-1776465354499-yph0js3n5 | 32 | desktop | Mim elephant, cant select target or skip |
| 2026-04-16 20:17 | `nRfZ6OUq7V` | game-1776369844857-4k4o0j1vt | 16 | desktop | Can’t ignore Mim ability but can’t confirm without damage |
| 2026-04-16 02:12 | `cXPzNXQu4S` | game-1776305013635-iubbrfrk0 | 11 | desktop | Mim shouldnt allow a player to choose a target.  the source of the damage removal is always herself.  also- the way it is coded now it is... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-hercules-mighty-leader — hercules mighty leader (4 reports) <a id="cluster-hercules-mighty-leader"></a>

Representative descriptions:
- _Hercules mighty leader take damage when he challenge._
- _Hercules Mighty Leader does not take damage when being challenged_
- _Hercules - mighty leader. takes no damage when challenged and prevents other cards being damaged when challenged_
- _Hercules - Mighty Leader when exerted prevents ANY damage dealt to all cards, even damage dealt by Challenge._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-11 08:06 | `oP47RkpjRV` | game-1775894623970-7fr2vaqs7 | 10 | desktop | Hercules mighty leader take damage when he challenge. |
| 2026-04-09 20:28 | `3i_A8xDdtJ` | game-1775765979301-yfmjgn474 | 15 | desktop | Hercules Mighty Leader does not take damage when being challenged |
| 2026-04-09 19:42 | `MeOPQ2drg8` | game-1775761340323-mm9nyd086 | 18 | desktop | Hercules - mighty leader. takes no damage when challenged and prevents other cards being damaged when challenged |
| 2026-04-09 19:42 | `TcMD2bozZD` | game-1775761340323-mm9nyd086 | 18 | desktop | Hercules - Mighty Leader when exerted prevents ANY damage dealt to all cards, even damage dealt by Challenge. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-right-behind-you — right behind you (3 reports) <a id="cluster-right-behind-you"></a>

Representative descriptions:
- _I played Right Behind You but was not allowed to play a Seven Dwarfs Character for free_
- _RIGHT BEHIND YOU If you have a Seven Dwarfs character "and" a Princess character in play, you may play a Seven Dwarfs character for free.  But now only have of them can play dwarf for free_
- _the card Right behind you is triggering even without having the Princess / Dwarf in play_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-16 02:59 | `f3sVwWB7yT` | mgOuthIJSM1jjglD-JCWmEW | 14 | desktop | I played Right Behind You but was not allowed to play a Seven Dwarfs Character for free |
| 2026-05-15 16:40 | `3LgbcwiclL` | mgqQE0eXS9g5T4Zz4US-dZZ | 13 | desktop | RIGHT BEHIND YOU If you have a Seven Dwarfs character "and" a Princess character in play, you may play a Seven Dwarfs character for free.... |
| 2026-04-28 15:01 | `GGNSg_ZGQQ` | mg9-ytBkGqjGuNMkfh7kvSq | 22 | desktop | the card Right behind you is triggering even without having the Princess / Dwarf in play |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-julieta-madrigal — julieta madrigal (3 reports) <a id="cluster-julieta-madrigal"></a>

Representative descriptions:
- _Julieta's Arepas won't let me choose a character who has no damage to resolve the effect (no characters have damage) so I get stuck and can't continue playing._
- _No le deja elegir personaje para remover daños con las arepas de julieta_
- _When Julieta gives the option to remove up to 2 damage, there doesn't seem to be a way to choose removing just 1 damage instead of 2._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-15 23:57 | `3-TkVs2GTg` | mgQXMvVTFsBO1y5B-qHmTQm | 13 | desktop | Julieta's Arepas won't let me choose a character who has no damage to resolve the effect (no characters have damage) so I get stuck and c... |
| 2026-05-15 23:57 | `iimxAEvJ8J` | mgQXMvVTFsBO1y5B-qHmTQm | 13 | desktop | No le deja elegir personaje para remover daños con las arepas de julieta |
| 2026-05-10 20:11 | `vz-NThWSP8` | mgbtm1Tq8I0TRCgE7ws1klC | 13 | desktop | When Julieta gives the option to remove up to 2 damage, there doesn't seem to be a way to choose removing just 1 damage instead of 2. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-sail-the-azurite-sea — sail the azurite sea (3 reports) <a id="cluster-sail-the-azurite-sea"></a>

Representative descriptions:
- _Wouldnt let me ink the second time for sail the azurite sea_
- _The sidebar of what has happened is calling Sail the Azurite Sea a different card._
- _Unable to ink from discard, possibly tied to when I have no cards in hand, with Moana on board and having played sail the azurite sea._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-14 18:37 | `QVBQ8vFgO7` | mgDIrw6jGs4F8QNR4EcgUfo | 5 | desktop | Wouldnt let me ink the second time for sail the azurite sea |
| 2026-04-10 19:16 | `heVVRE_Zuz` | game-1775848344541-xcb90sseb | 9 | desktop | The sidebar of what has happened is calling Sail the Azurite Sea a different card. |
| 2026-04-09 05:29 | `7PXrYCbQfo` | game-1775711759137-q04dp1m3t | 16 | desktop | Unable to ink from discard, possibly tied to when I have no cards in hand, with Moana on board and having played sail the azurite sea. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-desperate-plan — desperate plan (3 reports) <a id="cluster-desperate-plan"></a>

Representative descriptions:
- _the action card "desperate plan" does not let you discard when you have cards in your hand_
- _Desperate plan wont let me discard_
- _Desperate plan is not functioning correctly. It is not letting me discard cards to draw cards._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-14 16:17 | `M-gi4Vj9AL` | mg_t6IuvJ8n_vDk-Am2Uw3y |  | desktop | the action card "desperate plan" does not let you discard when you have cards in your hand |
| 2026-04-30 20:21 | `BbGjA04AZh` | game-1777580141524-d6xxlaavz | 10 | mobile | Desperate plan wont let me discard |
| 2026-04-27 20:24 | `wpSZlaiBio` | mgX8rMKPx_HY_DTgsGiHv3n | 7 | desktop | Desperate plan is not functioning correctly. It is not letting me discard cards to draw cards. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-syndrome — syndrome (3 reports) <a id="cluster-syndrome"></a>

Representative descriptions:
- _I can't pass turn if i quest with Syndrome Out of Revenge without Robots on the discard_
- _Syndrome 6 can add non robot creature back to hand_
- _Syndrome can get back any characters of the discard not only robot_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-11 19:47 | `xqni_EXTx9` | mgtdgmUeURIoE8WfLGH1x37 | 21 | desktop | I can't pass turn if i quest with Syndrome Out of Revenge without Robots on the discard |
| 2026-04-30 15:09 | `BQIuk77UOo` | mgexCnUVXjSsst3ojJcsD3a | 15 | desktop | Syndrome 6 can add non robot creature back to hand |
| 2026-04-30 06:25 | `cPJVKqEW5j` | mgJcyVgUHLRR2g_3uqjSb0t | 22 | mobile | Syndrome can get back any characters of the discard not only robot |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-fergus — fergus (3 reports) <a id="cluster-fergus"></a>

Representative descriptions:
- _when fergus quested while at a locvation i didnt get to choose what location to play. it auto chose for me_
- _fergus didnt get to deal damage when a location he was at was challanged and banished_
- _Can't choose which location to play from Fergus's ability_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-11 19:05 | `93K7Jcxhg7` | mgalfdQQN_a5UizDCtA3KHL | 17 | desktop | when fergus quested while at a locvation i didnt get to choose what location to play. it auto chose for me |
| 2026-05-11 19:04 | `FB7qbH43Va` | mgalfdQQN_a5UizDCtA3KHL | 16 | desktop | fergus didnt get to deal damage when a location he was at was challanged and banished |
| 2026-05-11 03:07 | `YxThjHEssf` | mgpbgxeOMEeh89vnSfxGxm7 | 17 | desktop | Can't choose which location to play from Fergus's ability |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-we-know-the-way — we know the way (3 reports) <a id="cluster-we-know-the-way"></a>

Representative descriptions:
- _We Know the Way did not resolve properly. I was playing Monstro Combo and shuffled a card into my empty deck, it should have them played for free due to the effect of We Know the Way, but instead it would not resolve._
- _We know the way does not see itself_
- _had a we know the way in the discard and one on the stack the we know the way on the stack woudnt show the we know the way in the discard_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-08 22:08 | `HScSXng8sd` | mgUZQdmZMdWBS5p5pT1gDqI | 18 | desktop | We Know the Way did not resolve properly. I was playing Monstro Combo and shuffled a card into my empty deck, it should have them played ... |
| 2026-04-17 15:44 | `sjm35BKQKT` | game-1776439992886-z7m8py7cu | 33 | desktop | We know the way does not see itself |
| 2026-04-08 13:45 | `tupPFyZ1cS` | game-1775654854883-ft23ljtd5 | 13 |  | had a we know the way in the discard and one on the stack the we know the way on the stack woudnt show the we know the way in the discard |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-fergus-outpost-builder — fergus outpost builder (3 reports) <a id="cluster-fergus-outpost-builder"></a>

Representative descriptions:
- _Fergus - Outpost Builder's abilities are not working properly_
- _Neither of Fergus - Outpost Builder effects are working properly_
- _Fergus Outpost Builder's effect doesn't allow to play a location from discard_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-07 15:07 | `6uVoLkdN0v` | mgCDbQxIT4U9NdLajAHstLU | 24 | desktop | Fergus - Outpost Builder's abilities are not working properly |
| 2026-05-05 11:34 | `e44EbnVXb4` | mgKqwsxfs8KG0NgAt8WOYWo | 19 | desktop | Neither of Fergus - Outpost Builder effects are working properly |
| 2026-05-02 19:14 | `JiM1hVVjZD` | mgSXET9tMILQwRFMVYUSCS- | 24 | desktop | Fergus Outpost Builder's effect doesn't allow to play a location from discard |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-card-advantage — card advantage (3 reports) <a id="cluster-card-advantage"></a>

Representative descriptions:
- _I used "Card Advantage" and banished a card, but I didn't draw 2 after that_
- _Lord mcgruffen doesn't work at all.  Card advantage doesn't work at all._
- _Card Advantage card is not drawing cards after opponent creature died_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-07 00:52 | `H-7on3vHBx` | mgyWfwmoCMkKwE6DMMPJx7W | 10 | desktop | I used "Card Advantage" and banished a card, but I didn't draw 2 after that |
| 2026-04-27 16:11 | `y6LA4_0ujD` | mg63ZL6nCHsMlbgqL0-8Naa | 22 | mobile | Lord mcgruffen doesn't work at all.  Card advantage doesn't work at all. |
| 2026-04-27 16:02 | `ITNzvrrqQH` | mg63ZL6nCHsMlbgqL0-8Naa | 11 | desktop | Card Advantage card is not drawing cards after opponent creature died |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-cinderella-dream-come-true — cinderella dream come true (3 reports) <a id="cluster-cinderella-dream-come-true"></a>

Representative descriptions:
- _Cinderella - Dream Come True allowed the opponent to draw a card even when they could not ink because they no cards in hand_
- _Cinderella Dream Come True's effect is triggered by legendary clarabelle_
- _The Cinderella Dream Come True is bugged, she's activating the ability every turn even if i dont play any princess_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-06 23:05 | `0BjUIMnisw` | mgfA9cu0WYR7WCwRpSQ2Qq3 | 14 | desktop | Cinderella - Dream Come True allowed the opponent to draw a card even when they could not ink because they no cards in hand |
| 2026-04-12 14:48 | `SbpnJ1ks1C` | game-1776004940759-hzxde5x9l | 12 | desktop | Cinderella Dream Come True's effect is triggered by legendary clarabelle |
| 2026-04-10 19:51 | `AbgX4ZMpAn` | game-1775849916706-jn0r8ikl5 | 21 | desktop | The Cinderella Dream Come True is bugged, she's activating the ability every turn even if i dont play any princess |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-sugar-rush-speedway-finish-line-enchanted — sugar rush speedway finish line enchanted (3 reports) <a id="cluster-sugar-rush-speedway-finish-line-enchanted"></a>

Representative descriptions:
- _Sugar rush speedway isn't working properly.  It is making there be multiple characters to trigger the effect to move from the one drop location to another_
- _can not use sugar rush speedway_
- _Sugar Rush Speedway (Yellow) don't proc if the character, moved from Sugar Rush Speedway (Red) with the effect,  have only 1 hp left._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-04 23:47 | `C0ZXt9gnUb` | mgYyqGV11de5UnnEbS7m6vM | 17 | desktop | Sugar rush speedway isn't working properly.  It is making there be multiple characters to trigger the effect to move from the one drop lo... |
| 2026-04-28 16:15 | `oWaCmJpj2M` | mgsMyVru3wQCP_diH2U-bJv | 5 | desktop | can not use sugar rush speedway |
| 2026-04-22 16:53 | `EHBlNEfME1` | game-1776876290721-mjerytt7y | 14 | desktop | Sugar Rush Speedway (Yellow) don't proc if the character, moved from Sugar Rush Speedway (Red) with the effect,  have only 1 hp left. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-goofy-set-for-adventure — goofy set for adventure (3 reports) <a id="cluster-goofy-set-for-adventure"></a>

Representative descriptions:
- _Goofy - Set For Adventure doesn't work. The game lets me select a character to move, but won't let me actually move them to the location Goofy just moved to. This also means the card draw does not trigger. Please fix ..._
- _Goofy - Set for Adventure's ability doesnt work properly, player can choose character to move but not location indicated in Goofy's text_
- _I am trying to activate goofy set for adventure, but when i selected a character, the confirm button acknowledges the selection, but stays grayed out._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-04 17:45 | `xP_gw_9apm` | game-1777916205887-jdafdentr | 12 | desktop | Goofy - Set For Adventure doesn't work. The game lets me select a character to move, but won't let me actually move them to the location ... |
| 2026-05-04 16:20 | `vKi07vEdWz` | game-1777911422714-auu5jze15 | 5 | desktop | Goofy - Set for Adventure's ability doesnt work properly, player can choose character to move but not location indicated in Goofy's text |
| 2026-05-03 15:49 | `eeciawkAUV` | game-1777822946120-sqpoojqen | 7 | desktop | I am trying to activate goofy set for adventure, but when i selected a character, the confirm button acknowledges the selection, but stay... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-ranger-plane — ranger plane (3 reports) <a id="cluster-ranger-plane"></a>

Representative descriptions:
- _Ranger plane is not giving characters support. or gadget hackwrench's ability of your characters with support gain +1 lore_
- _the effect from trixie (your characters with Support get +1 lore) doesn't work in comination with the item Ranger Plane_
- _Ranger plane gives all of my characters support  Gadget Hackwrench gives all of my characters with support plus one lore  The characters are not questing for the extra plus one lore_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-03 17:49 | `M4s0EKa0kO` | mgSeet5BFVFVRc4s29nZmzy | 16 | desktop | Ranger plane is not giving characters support. or gadget hackwrench's ability of your characters with support gain +1 lore |
| 2026-04-29 15:29 | `HktJEv8WD-` | mgKqBCMSwEAODfOmE6taPyY | 25 | desktop | the effect from trixie (your characters with Support get +1 lore) doesn't work in comination with the item Ranger Plane |
| 2026-04-29 13:43 | `fdBbuKjsmp` | mgqFRjAGgZqH4pBxVoTsOsu | 11 | desktop | Ranger plane gives all of my characters support  Gadget Hackwrench gives all of my characters with support plus one lore  The characters ... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-the-horned-king — the horned king (3 reports) <a id="cluster-the-horned-king"></a>

Representative descriptions:
- _Horned king effect says during your turn if card left discard gain Two lore.  Why is he triggering when half shark is bringing back actions during my turn._
- _cards returning to hand after being banished in a challenge (eg will o wisp, heihei) dont trigger the 2 cost horned king for the extra lore. ruins my deck._
- _heihei returning to hand doesnt trigger my horned king for the extra lore. losing repeatedly when deck doesnt work ruins my record and experience._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-29 09:47 | `LT2usM-X8v` | mgdbecosJNkNw8cT9VX_BlX | 22 | mobile | Horned king effect says during your turn if card left discard gain Two lore.  Why is he triggering when half shark is bringing back actio... |
| 2026-04-27 23:05 | `hLD60d5HwX` | mgiLlxIpzVIFbrgSJ5Jte_n | 11 | desktop | cards returning to hand after being banished in a challenge (eg will o wisp, heihei) dont trigger the 2 cost horned king for the extra lo... |
| 2026-04-27 22:30 | `dmkCW4Yk_k` | mgq0VQ5Jhu__0uyjhN3UfdD | 5 | desktop | heihei returning to hand doesnt trigger my horned king for the extra lore. losing repeatedly when deck doesnt work ruins my record and ex... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-anna-little-sister — anna little sister (3 reports) <a id="cluster-anna-little-sister"></a>

Representative descriptions:
- _anna little sister seems to not allow me to choose opponent discarded cards when only one card is in each discard, thus forcing me to choose my own card (thus ruining creeper when he's that card!)_
- _Anna little sister not allowing me to choose cards from my opponent's discard_
- _Couldn't resolve effect of anna little sister to put an opponent's card from their discard to the bottom of their deck_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-28 21:24 | `XdGd_ntnYb` | mgY3Pr_zDsUuZj3lI46-IEs | 9 | desktop | anna little sister seems to not allow me to choose opponent discarded cards when only one card is in each discard, thus forcing me to cho... |
| 2026-04-11 16:15 | `f4Oa74sLP7` | game-1775923175286-f0ilycfl1 | 14 | desktop | Anna little sister not allowing me to choose cards from my opponent's discard |
| 2026-04-02 06:13 | `vuMdKuq77O` | game-1775110242947-xuu73cxrf | 4 |  | Couldn't resolve effect of anna little sister to put an opponent's card from their discard to the bottom of their deck |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-scrooges-counting-house-ebenezers-office — scrooges counting house ebenezers office (3 reports) <a id="cluster-scrooges-counting-house-ebenezers-office"></a>

Representative descriptions:
- _I have transportation pod in play and scrooges counting house. At the start of my turn it wants me to resolve transportation pod but there is no target so I am stuck._
- _scrooges counting house location is not gaining the bonus lore for having cards under it._
- _scrooges counting house only giving one lore each turn no matter how many cards under_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-28 17:24 | `pYnjZPC1qY` | mgxRaph07amT7znmrxGyX-F | 6 | desktop | I have transportation pod in play and scrooges counting house. At the start of my turn it wants me to resolve transportation pod but ther... |
| 2026-04-10 05:59 | `Ffi-kwTDmx` | game-1775800379001-fi6ylgo25 | 18 | desktop | scrooges counting house location is not gaining the bonus lore for having cards under it. |
| 2026-04-08 14:10 | `eF7ky9BwA8` | game-1775656675495-jyu56x663 | 22 |  | scrooges counting house only giving one lore each turn no matter how many cards under |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-tamatoa-happy-as-a-clam — tamatoa happy as a clam (3 reports) <a id="cluster-tamatoa-happy-as-a-clam"></a>

Representative descriptions:
- _tamatoa happy as a clam won't get the items from the discard_
- _when playing tamatoa happy as a clam and you do not have items, you don't have the options to cancel your effect succesfully_
- _can't skip resolving tamatoa happy as a clam cooles collection there arent any items in the discard_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-25 02:00 | `62g4Qp8iMU` | game-1777081574835-p8ennty7d | 17 | desktop | tamatoa happy as a clam won't get the items from the discard |
| 2026-04-16 13:32 | `IcotEz1obw` | game-1776345559266-kcmjnlo8q | 26 | desktop | when playing tamatoa happy as a clam and you do not have items, you don't have the options to cancel your effect succesfully |
| 2026-03-31 11:17 | `iMojSp10xP` | game-1774955182511-z15rucb5o | 19 |  | can't skip resolving tamatoa happy as a clam cooles collection there arent any items in the discard |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-stitch-carefree-surfer — stitch carefree surfer (3 reports) <a id="cluster-stitch-carefree-surfer"></a>

Representative descriptions:
- _Stitch carefree surfer was getting stuck, unable to resolve the effect when I had just 1 other character in play_
- _played stitch carefree surfer with 2 characters in play and did not draw 2_
- _Goliath not triggering in opponents turn of bot play, stitch-carefree surfer not triggering for draw, and other draw effects not triggering on play_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-25 01:08 | `Dc7Gawus41` | game-1777077971202-ekj2v79ad | 38 | desktop | Stitch carefree surfer was getting stuck, unable to resolve the effect when I had just 1 other character in play |
| 2026-04-09 17:43 | `SfZn4sYRnI` | game-1775756257291-mqosaw9fd | 7 | desktop | played stitch carefree surfer with 2 characters in play and did not draw 2 |
| 2026-04-08 22:42 | `IvJk3goJOu` | game-1775687621768-fsm9g8vg8 | 21 | desktop | Goliath not triggering in opponents turn of bot play, stitch-carefree surfer not triggering for draw, and other draw effects not triggeri... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-tiana — tiana (3 reports) <a id="cluster-tiana"></a>

Representative descriptions:
- _Tiana's pay 3 does not trigger when you attack her_
- _NEVER LET ME USE MY INK TO PAY FOR OPPONENTS TIANA EFFECT , NOT ONCE AND LOST DUE TO THAT BUG, WOULDVE WON AGES AGO IF IT NOT FOR THAT_
- _DOESNT LET ME PAY INK FOR TIANA EFFECT WHEN I ATTACK_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-10 02:53 | `zEXNrIBjj-` | game-1775789031970-ixd2d9slk | 14 | desktop | Tiana's pay 3 does not trigger when you attack her |
| 2026-04-08 19:58 | `Ajg0bh0wPA` | game-1775677602810-6k88m905x | 14 | desktop | NEVER LET ME USE MY INK TO PAY FOR OPPONENTS TIANA EFFECT , NOT ONCE AND LOST DUE TO THAT BUG, WOULDVE WON AGES AGO IF IT NOT FOR THAT |
| 2026-04-08 19:56 | `4_IvgT4c_k` | game-1775677602810-6k88m905x | 13 | desktop | DOESNT LET ME PAY INK FOR TIANA EFFECT WHEN I ATTACK |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-belle-snowfield-strategist — belle snowfield strategist (3 reports) <a id="cluster-belle-snowfield-strategist"></a>

Representative descriptions:
- _Belle Snowfield Strategist did not proc for herself._
- _Belle - Snowfield Strategist was banished by a song (He Hurled His ThunderBolt) and she went into the discard. I wasn't given the option to turn her into ink._
- _belle snowfield strategist is not counting herself for ink. it does not trigger for herself._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-10 00:40 | `4xRvfs5r24` | game-1775781207828-dbch5nk92 | 10 | desktop | Belle Snowfield Strategist did not proc for herself. |
| 2026-04-10 00:37 | `oHv_Z00v4j` | game-1775781075656-f74lhslmi | 9 | desktop | Belle - Snowfield Strategist was banished by a song (He Hurled His ThunderBolt) and she went into the discard. I wasn't given the option ... |
| 2026-04-09 16:11 | `ZBgKfYeKMa` | game-1775750696991-6sr2bdcp9 | 12 | desktop | belle snowfield strategist is not counting herself for ink. it does not trigger for herself. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-bruno-madrigal — bruno madrigal (2 reports) <a id="cluster-bruno-madrigal"></a>

Representative descriptions:
- _I played bruno returns and selected a character to returm to my hand but it did not work_
- _We Don’t Talk About Bruno trigger Discard a card doesnt work_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-15 18:26 | `V3bAYMNZnz` | mg5nYvzc7nuCEHBKkQsLwDb | 13 | desktop | I played bruno returns and selected a character to returm to my hand but it did not work |
| 2026-04-27 09:03 | `HYGcLyqXqB` | mgsMf55oj4ozToTDJocoHJD | 18 | desktop | We Don’t Talk About Bruno trigger Discard a card doesnt work |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-captain-hook — captain hook (2 reports) <a id="cluster-captain-hook"></a>

Representative descriptions:
- _Captian Hook Underhanded   can't quest for whatever reason_
- _Captain hook can't quest for no reason_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-13 22:20 | `hdiYN7hwG5` | mggHWL--JxQ7CBD-0N9R1C0 | 22 | desktop | Captian Hook Underhanded   can't quest for whatever reason |
| 2026-04-29 11:43 | `CbakXXTns8` | mgVef0qKrco6CYlL8FvHyXb | 14 | mobile | Captain hook can't quest for no reason |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-alien — alien (2 reports) <a id="cluster-alien"></a>

Representative descriptions:
- _Alien effect is not working. Card is not returning back to hand._
- _the card Alien triggered itself and returned back to hand. it should be another Alien, there were 0 Alien in discard at the time it was banished_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-13 04:37 | `Jd_HXuTMKP` | mgphHjtKLH9QJkQJXlFFW5- | 14 | desktop | Alien effect is not working. Card is not returning back to hand. |
| 2026-04-27 22:49 | `YdOAgRGE-D` | mgJLDiD4joyuGOCz76s4bS7 | 9 | desktop | the card Alien triggered itself and returned back to hand. it should be another Alien, there were 0 Alien in discard at the time it was b... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mushu-majestic-dragon — mushu majestic dragon (2 reports) <a id="cluster-mushu-majestic-dragon"></a>

Representative descriptions:
- _Mushu - Majestic Dragon - the resist effect appears to have stacked with every challenge_
- _Mulan took 5 damage, from a character with 5 strength, while Mushu Majestic dragon was on the table_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-12 09:55 | `jjAMSsDDlm` | mgqVa-EW0a7xijMDjWUgqa- | 14 | desktop | Mushu - Majestic Dragon - the resist effect appears to have stacked with every challenge |
| 2026-04-12 00:27 | `RjlPKIDMVE` | game-1775953089697-lvnoaa5ms | 14 | desktop | Mulan took 5 damage, from a character with 5 strength, while Mushu Majestic dragon was on the table |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-down-in-new-orleans — down in new orleans (2 reports) <a id="cluster-down-in-new-orleans"></a>

Representative descriptions:
- _could not play bodyguard character exerted after revealing from Down in New Orleans_
- _The Powerline World's Greatest Rock Star ability won't let me choose the song "Down in New Orleans"._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-10 20:55 | `rMiMTQhxJ_` | mgIkWFaJZPQEZ1EMb5iWXsK | 11 | desktop | could not play bodyguard character exerted after revealing from Down in New Orleans |
| 2026-04-09 20:48 | `9ueXLjG2JT` | game-1775766951207-wo40ksgcp | 12 | desktop | The Powerline World's Greatest Rock Star ability won't let me choose the song "Down in New Orleans". |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-moana-curious-explorer — moana curious explorer (2 reports) <a id="cluster-moana-curious-explorer"></a>

Representative descriptions:
- _merida comes up as moana curious explorer_
- _Moana Curious Explorer wasn't letting me ink from my inkwell... or at least I can't figure out how it's supposed to work._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-10 04:49 | `zAgA5SalYZ` | mgJtI3wXTR-fi5qtx3jAllK | 9 | desktop | merida comes up as moana curious explorer |
| 2026-05-10 00:54 | `wptdN8EJIT` | mgVpSldTAT96u2llAR-bxm- | 14 | desktop | Moana Curious Explorer wasn't letting me ink from my inkwell... or at least I can't figure out how it's supposed to work. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-syndrome-out-for-revenge — syndrome out for revenge (2 reports) <a id="cluster-syndrome-out-for-revenge"></a>

Representative descriptions:
- _Syndrome, Out for Revenge I was unable to put a robot from my hand into play unless there was one in the graveyard to start._
- _Syndrome - Out for Revenge's ability allows you to choose supers too on accident. only robot characters are written_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-09 15:17 | `dXJRLCRJ0D` | mgVCCxFjeRTERGTUDPNJv0L | 11 | desktop | Syndrome, Out for Revenge I was unable to put a robot from my hand into play unless there was one in the graveyard to start. |
| 2026-04-30 19:46 | `ZufF4P5pdS` | game-1777578200757-w2lser1yh | 10 | desktop | Syndrome - Out for Revenge's ability allows you to choose supers too on accident. only robot characters are written |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-scrump — scrump (2 reports) <a id="cluster-scrump"></a>

Representative descriptions:
- _Scrump ability not working? mowgli is availble..._
- _There is no way to activate Scrump's ability._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-08 23:09 | `rY0Djh-VIl` | mgEuweldi7EiMjINdPiS0aD | 19 | desktop | Scrump ability not working? mowgli is availble... |
| 2026-04-08 20:26 | `wThXLThXlm` | game-1775679282635-mgsy2vh0x | 16 | mobile | There is no way to activate Scrump's ability. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-sugar-rush-speedway-finish-line — sugar rush speedway finish line (2 reports) <a id="cluster-sugar-rush-speedway-finish-line"></a>

Representative descriptions:
- _When I used Tuk Tuk - Lively Partner to move a character from a location into Sugar Rush Speedway - Finish Line, "Bring it Home, Kid!" was resolved for both Tuk Tuk and the character moved by him, despite the fact tha..._
- _Islands I Pulled from the Sea did not let me choose which location card from my deck to reveal and add to my hand. It just gave me Sugar Rush Speedway Finish Line._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-08 18:10 | `aBj_n2mOz6` | game-1778263534773-vtncmmkb6 | 10 | desktop | When I used Tuk Tuk - Lively Partner to move a character from a location into Sugar Rush Speedway - Finish Line, "Bring it Home, Kid!" wa... |
| 2026-04-11 22:41 | `OynYwrRFE8` | game-1775947131314-60ppo7dzy | 7 | desktop | Islands I Pulled from the Sea did not let me choose which location card from my deck to reveal and add to my hand. It just gave me Sugar ... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mrs-incredible — mrs incredible (2 reports) <a id="cluster-mrs-incredible"></a>

Representative descriptions:
- _I wasn't able to ready mrs incredible after a second challenge. You should be able to ready mrs incredible any amount of times, including when she banishes a character_
- _My opponent just challenged and banished Mrs. Incredible. But she should have had Resist +1 and not have gotten banished in the challengr_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-07 20:26 | `j5rVcCdWo_` | mg5LB_J_7YRlWEXaK5wqydS | 31 | desktop | I wasn't able to ready mrs incredible after a second challenge. You should be able to ready mrs incredible any amount of times, including... |
| 2026-05-03 01:32 | `WZxtFOmpkz` | mgRvOGUaoA80EMiVjtxopbA | 12 | mobile | My opponent just challenged and banished Mrs. Incredible. But she should have had Resist +1 and not have gotten banished in the challengr |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-willie-the-giant-ghost-of-christmas-present — willie the giant ghost of christmas present (2 reports) <a id="cluster-willie-the-giant-ghost-of-christmas-present"></a>

Representative descriptions:
- _Willie the giant is not usable._
- _Willie the Giant - Ghost of Christmas Present  when played it erros out and will not allow any games moves_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-07 15:52 | `DrRWt7bSt0` | mgRN09VW2xmiabJ_QkwZgpx | 20 | mobile | Willie the giant is not usable. |
| 2026-04-27 13:45 | `Z6dM8Ur1kY` | mgRMHAJ_6XWx9wdLV6yhW-J | 4 | desktop | Willie the Giant - Ghost of Christmas Present  when played it erros out and will not allow any games moves |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-belle-accomplished-mystic — belle accomplished mystic (2 reports) <a id="cluster-belle-accomplished-mystic"></a>

Representative descriptions:
- _Belle Accomplished Mystic is not moving damage. You select both targets and then nothing happens._
- _Used Belle, Accomplished Mystic to move one damage. Selected both targets and hit confirm, but the damage didn't actually move from one target to the other._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-06 18:38 | `voGtfeKA5i` | mgPNpagigao72B9Hc9_xf2x | 13 | desktop | Belle Accomplished Mystic is not moving damage. You select both targets and then nothing happens. |
| 2026-04-16 15:44 | `jgqdXX7Zr1` | game-1776353522260-gj42seved | 14 | desktop | Used Belle, Accomplished Mystic to move one damage. Selected both targets and hit confirm, but the damage didn't actually move from one t... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-alien-true-believer — alien true believer (2 reports) <a id="cluster-alien-true-believer"></a>

Representative descriptions:
- _Alien - True Believer I understand that when is banoshed it should allow ANOTHER Alien to be returned, instead it is allowing to return the same card that is being banished_
- _hello, please check the card effect "Alien - true believer" i used this card effects successful whether i dont had another "alien" in discard. I think it needs another "alien" in discard to use this effect. please che..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-05 06:52 | `cZE0Eborf3` | mg2o6_Z71R3XRvmXqeheoFb | 11 | desktop | Alien - True Believer I understand that when is banoshed it should allow ANOTHER Alien to be returned, instead it is allowing to return t... |
| 2026-05-03 19:46 | `1uLjaCd0xh` | mgH7ZWSNXwU_iVi9qBU3JZ9 | 28 | desktop | hello, please check the card effect "Alien - true believer" i used this card effects successful whether i dont had another "alien" in dis... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-alice-growing-girl — alice growing girl (2 reports) <a id="cluster-alice-growing-girl"></a>

Representative descriptions:
- _I had Alice Growing Girl and Gadget Hackwrench Resourcefull Mechanic in Play.   Alice gives all my characters Support and Gadget should then give all Charecters with Support +1 Lore.   The support skill was correctly ..._
- _Gadget Hackwrench is supossed to give characters with support +1 lore. I have an Alice Growing Girl on the board, but Gadget wasn't seeing that the other characters in play had support_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-04 01:55 | `OX5VvcPIvg` | mgKepye-8Abn7pvgzcyrZ-z | 17 | desktop | I had Alice Growing Girl and Gadget Hackwrench Resourcefull Mechanic in Play.   Alice gives all my characters Support and Gadget should t... |
| 2026-04-28 18:37 | `wtqfVF-g7L` | mgWbmCjbxkD2GqPJU6SpVNz | 13 | desktop | Gadget Hackwrench is supossed to give characters with support +1 lore. I have an Alice Growing Girl on the board, but Gadget wasn't seein... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-the-glass-slipper — the glass slipper (2 reports) <a id="cluster-the-glass-slipper"></a>

Representative descriptions:
- _The glass slipper doent’t work_
- _The glass slipper is broken._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-03 21:52 | `TVI0pUai1W` | mgAbyKUiparCLnOSGxiOdxF | 26 | mobile | The glass slipper doent’t work |
| 2026-05-02 19:28 | `v8Q8AaZ7iz` | mg4EnMXTxCs-O8BJauzz9vp | 15 | desktop | The glass slipper is broken. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-medallion-weights — medallion weights (2 reports) <a id="cluster-medallion-weights"></a>

Representative descriptions:
- _Hamish, Harris, and Hubert - Making Mischief doesn't present the option to exert on play.  With no cards in their hand, opponent uses medallion weights on their character then challenges Cursed Merfolk. Merfolk trigge..._
- _I activated two medallion weights, but when my character challenged I only drew 1 card, not 2 from both effects._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-03 16:37 | `kCHbiozJfw` | mgaCuLXjGhDejWPUwRGj5Bt | 21 | desktop | Hamish, Harris, and Hubert - Making Mischief doesn't present the option to exert on play.  With no cards in their hand, opponent uses med... |
| 2026-04-26 13:50 | `nluakDwEQg` | mgjN1-TiOKMG0y3ElXOdHuh | 30 | desktop | I activated two medallion weights, but when my character challenged I only drew 1 card, not 2 from both effects. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-transport-pod — transport pod (2 reports) <a id="cluster-transport-pod"></a>

Representative descriptions:
- _transport pod is not allowing me to move characters. the confirm button acknowledges the selection but stays grayed out._
- _Transport pod doesn't work, there is the confirmation button with 2/2 but it doesn't allow me to click on it._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-03 15:54 | `yHUYTGXrZ8` | game-1777823390196-xmdj92hzw | 11 | desktop | transport pod is not allowing me to move characters. the confirm button acknowledges the selection but stays grayed out. |
| 2026-05-03 15:30 | `dgTszlzeZW` | game-1777821951654-jyyal6ifz | 7 | desktop | Transport pod doesn't work, there is the confirmation button with 2/2 but it doesn't allow me to click on it. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-king-candy-royal-racer — king candy royal racer (2 reports) <a id="cluster-king-candy-royal-racer"></a>

Representative descriptions:
- _King Candy - Royal racer effect allow me to choose which character I want to banished instead of allowing my opponent to choose._
- _King Candy: Royal Racer is not working as it should - players should be forced to banish a character of their choice._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-03 06:04 | `2Y_8cpWAYi` | mggjdXNY7fHkuQJI_MBjpUY | 12 | desktop | King Candy - Royal racer effect allow me to choose which character I want to banished instead of allowing my opponent to choose. |
| 2026-04-08 13:33 | `s0mOdBYWjM` | game-1775654765778-u7bij13vr | 11 |  | King Candy: Royal Racer is not working as it should - players should be forced to banish a character of their choice. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-jasmine-fearless-princess — jasmine fearless princess (2 reports) <a id="cluster-jasmine-fearless-princess"></a>

Representative descriptions:
- _When i use Jasmine Fearless Princess ability, she stays exerted and cant challenge_
- _When using the Now's My Chance ability with Jasmine Fearless Princess, she automatically exerts.  This is incorrect.  She should not exert when using that ability._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-01 23:19 | `eo43-7pHIu` | mgmBDUn-LrR2Soj-q0WlM7E | 20 | mobile | When i use Jasmine Fearless Princess ability, she stays exerted and cant challenge |
| 2026-04-17 12:54 | `VXXUjES81W` | game-1776429848906-hpgfwz43d | 13 | desktop | When using the Now's My Chance ability with Jasmine Fearless Princess, she automatically exerts.  This is incorrect.  She should not exer... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-donald-duck-fred-honeywell — donald duck fred honeywell (2 reports) <a id="cluster-donald-duck-fred-honeywell"></a>

Representative descriptions:
- _When Donald Duck - Fred Honeywell is on the field, you are allowed to draw cards when a character or location with cards under it is banished during an opponent's turn, equal to the number of cards under it. I had 2 D..._
- _Donald Duck fred Honeyhail draw does not Activate Robin Hood with boost on steel, we cant target 2 characters with abilities,_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-30 20:57 | `9UkAHtL46g` | mghAAwutjM8Ff4d94pHGGXq | 17 | desktop | When Donald Duck - Fred Honeywell is on the field, you are allowed to draw cards when a character or location with cards under it is bani... |
| 2026-04-17 10:27 | `u0I06vlJTu` | game-1776421178121-cyx9evsxg | 19 | desktop | Donald Duck fred Honeyhail draw does not Activate Robin Hood with boost on steel, we cant target 2 characters with abilities, |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-max-goof-chart-topper — max goof chart topper (2 reports) <a id="cluster-max-goof-chart-topper"></a>

Representative descriptions:
- _Max Goof - Chart Topper ability does not work, when i click accept when he quests it doesnt let me choose a song from discard_
- _when i quest with Max Goof - chart topper i cant play a song from discard_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-29 20:46 | `EcVUqKL_A7` | mgVWOcIE9ntGONXv5eVJ-PU | 21 | desktop | Max Goof - Chart Topper ability does not work, when i click accept when he quests it doesnt let me choose a song from discard |
| 2026-04-28 18:44 | `2v-Ne8Htsi` | game-1777401357979-02zk18d8c | 11 | desktop | when i quest with Max Goof - chart topper i cant play a song from discard |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-pull-the-lever — pull the lever (2 reports) <a id="cluster-pull-the-lever"></a>

Representative descriptions:
- _In the game log is another card name than the picture of the one that as put in the inkwell (white rabbit vs pull the lever)_
- _I played "pull the lever" on an Iago. He has Vanish. He should have been removed but went to the players hand instead._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-29 13:03 | `LrpRNkM95c` | mgv5_pqplRs8pj2x7P727JM | 9 | desktop | In the game log is another card name than the picture of the one that as put in the inkwell (white rabbit vs pull the lever) |
| 2026-04-19 03:35 | `l2GBoufoHN` | game-1776569113859-zz7vo80z8 | 16 | desktop | I played "pull the lever" on an Iago. He has Vanish. He should have been removed but went to the players hand instead. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-vision-of-the-future — vision of the future (2 reports) <a id="cluster-vision-of-the-future"></a>

Representative descriptions:
- _when robin hood quests and finds vision of the future and plays it, it doesn't give you the options to play it and pick a card, just goes straight into the discard_
- _I quested with Robin Hood Sharp shooter and chose Vision of the future and it didn't trigger_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-28 22:22 | `9p-qhXljDf` | mgtY1d8NhqaO1DxM_znXKzp | 13 | desktop | when robin hood quests and finds vision of the future and plays it, it doesn't give you the options to play it and pick a card, just goes... |
| 2026-04-15 02:59 | `fiC23gYolP` | game-1776221393696-q60kvpak3 | 12 | desktop | I quested with Robin Hood Sharp shooter and chose Vision of the future and it didn't trigger |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-kida-crystal-scion — kida crystal scion (2 reports) <a id="cluster-kida-crystal-scion"></a>

Representative descriptions:
- _Kida Crystal Scion did not give me the option to ink from discard. I was not the player with the card_
- _Kida Crystal Scion does not allow opponent to choose cards from discard to inkwell_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-28 17:58 | `xke4udxiao` | mgXAMKWEoQu55ClUAAt5geN | 12 | desktop | Kida Crystal Scion did not give me the option to ink from discard. I was not the player with the card |
| 2026-04-28 16:38 | `RSbs-h1ZAq` | mgKUtsrXDyPpllJD7GnjfFs | 11 | desktop | Kida Crystal Scion does not allow opponent to choose cards from discard to inkwell |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-violet-parr — violet parr (2 reports) <a id="cluster-violet-parr"></a>

Representative descriptions:
- _violet par ability did not work_
- _violet par ability did not work correctly. Damage was not moved_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-27 21:33 | `8F8UaFn6w-` | mglFPrXxTIOdRdUEOoaMes_ | 8 | desktop | violet par ability did not work |
| 2026-04-27 18:40 | `G_l_XQDVOT` | mgbXy4KcKJdQblHs8oCTL2z | 14 | desktop | violet par ability did not work correctly. Damage was not moved |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-pluto-steel-champion — pluto steel champion (2 reports) <a id="cluster-pluto-steel-champion"></a>

Representative descriptions:
- _Pluto (Steel Champion)'s effect is not working properly. When another Steel character is played, I should have the option to banish chosen item. The dialog that appears on play of a Steel character presents items in p..._
- _pluto steel champion effect to banish item would not resolve_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-24 01:34 | `raqBUI97HQ` | game-1776993761677-92guriwx7 | 18 | desktop | Pluto (Steel Champion)'s effect is not working properly. When another Steel character is played, I should have the option to banish chose... |
| 2026-04-23 18:27 | `8BHMddqsLq` | game-1776968525812-av9hl0xza | 10 | desktop | pluto steel champion effect to banish item would not resolve |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mickey-mouse-trumpeter — mickey mouse trumpeter (2 reports) <a id="cluster-mickey-mouse-trumpeter"></a>

Representative descriptions:
- _mickey mouse- trumpeter ability is auto playing the charater furtherst right in my hand instead of letting me pick_
- _Mickey Mouse - Trumpeter not allowing me to select the target of its effect_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-23 01:28 | `003cmvBKJx` | game-1776907059846-r4h8lge43 | 8 | desktop | mickey mouse- trumpeter ability is auto playing the charater furtherst right in my hand instead of letting me pick |
| 2026-03-30 18:47 | `KvWdJh2nPg` | game-1774895911955-uvdx9oam9 | 13 |  | Mickey Mouse - Trumpeter not allowing me to select the target of its effect |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-goofy-emerald-champion — goofy emerald champion (2 reports) <a id="cluster-goofy-emerald-champion"></a>

Representative descriptions:
- _Goofy Emerald Champion didn't give my character ward._
- _Goofy emerald champion effect doesnt work giving all emerald characters ward._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-22 20:24 | `iW9C8OhQCC` | game-1776888417041-z7ncymw05 | 25 | desktop | Goofy Emerald Champion didn't give my character ward. |
| 2026-04-21 05:13 | `-hwuv11NKx` | game-1776748150855-bbgbl3z7i | 11 | desktop | Goofy emerald champion effect doesnt work giving all emerald characters ward. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-and-then-along-came-zeus — and then along came zeus (2 reports) <a id="cluster-and-then-along-came-zeus"></a>

Representative descriptions:
- _And then along came zeus can't select locations._
- _and then along came Zeus wasn't able to target the library_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-22 18:50 | `pyscpSFAoM` | game-1776883727630-v60hztcbe | 9 | desktop | And then along came zeus can't select locations. |
| 2026-04-21 08:14 | `ROLCIyFmA9` | game-1776758801939-ww0t3kf6j | 13 | desktop | and then along came Zeus wasn't able to target the library |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-prince-phillip-warden-of-the-woods — prince phillip warden of the woods (2 reports) <a id="cluster-prince-phillip-warden-of-the-woods"></a>

Representative descriptions:
- _I had a prince phillip warden of the woods out that should have given my Stitch Rock Start ward, but opponent was able to use Hades to remove it._
- _Prince Phillip - Warden of the Woods did not give Ward to my Prince Phillip - Vanquisher of Foes despite the Hero classification. My opponent was able to target Vanquisher of Foes with Horseman Strikes_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-22 16:28 | `z6iAKIMSTw` | game-1776874829526-quju8qpuk | 10 | desktop | I had a prince phillip warden of the woods out that should have given my Stitch Rock Start ward, but opponent was able to use Hades to re... |
| 2026-04-12 03:47 | `ma1LcFCDRN` | game-1775964622525-xxa9ta9vr | 27 | desktop | Prince Phillip - Warden of the Woods did not give Ward to my Prince Phillip - Vanquisher of Foes despite the Hero classification. My oppo... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-aurora — aurora (2 reports) <a id="cluster-aurora"></a>

Representative descriptions:
- _Aurora didn't give my other characters ward_
- _While having a Aurora (161EN9) in play, a Penny (17EN7) was tarjgeted by an elsa an exerted If there is an Hero she has Ward and should not be able to be targeted, right?_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-22 06:21 | `fAlul4AKWt` | game-1776838541239-uuyoczjbz | 10 | desktop | Aurora didn't give my other characters ward |
| 2026-04-11 18:54 | `Q4QzP5DpNh` | game-1775932783067-afoetwvv7 | 18 | desktop | While having a Aurora (161EN9) in play, a Penny (17EN7) was tarjgeted by an elsa an exerted If there is an Hero she has Ward and should n... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-jafar-aspiring-ruler — jafar aspiring ruler (2 reports) <a id="cluster-jafar-aspiring-ruler"></a>

Representative descriptions:
- _Jafar aspiring ruler automatically giving himself challenger 2 rather than allowing the player to choose._
- _Jafar aspiring ruler didn't give me an option to choose a character. It just chose itself immediately when I played it_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-22 01:47 | `byHIwlJeCQ` | game-1776822055853-6wikbbnre | 6 | desktop | Jafar aspiring ruler automatically giving himself challenger 2 rather than allowing the player to choose. |
| 2026-04-21 00:36 | `wExoAkOTmy` | game-1776731238012-fynkneus1 | 13 | desktop | Jafar aspiring ruler didn't give me an option to choose a character. It just chose itself immediately when I played it |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-flynn — flynn (2 reports) <a id="cluster-flynn"></a>

Representative descriptions:
- _cant boost flynn rider? when i try to click the green boost tag it does nothing._
- _Could not use boost on flynn Ryder_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-21 23:35 | `8SU9iPaVlI` | game-1776814153552-fp9kgcm9y | 8 | desktop | cant boost flynn rider? when i try to click the green boost tag it does nothing. |
| 2026-04-09 18:27 | `F5uN-KQIrx` | game-1775758036191-wcqwyra0e | 18 | desktop | Could not use boost on flynn Ryder |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-aurora-dreaming-guardian — aurora dreaming guardian (2 reports) <a id="cluster-aurora-dreaming-guardian"></a>

Representative descriptions:
- _ai targeted Rapunzel with they never come back although ward active from aurora dreaming guardian_
- _I had a Grandmother Willow in play and it somehow went to my discard when my opponent played Headless Horseman when Grandmother Willow received Ward from Aurora - Dreaming Guardian and wasn’t challenged by any charact..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-20 10:46 | `R7VGz4qhGF` | game-1776681651337-2gtma4jxq | 9 | desktop | ai targeted Rapunzel with they never come back although ward active from aurora dreaming guardian |
| 2026-04-20 01:49 | `22UWb0cUKP` | game-1776649014599-zrsi0njwz | 14 | mobile | I had a Grandmother Willow in play and it somehow went to my discard when my opponent played Headless Horseman when Grandmother Willow re... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-tinker-bell — tinker bell (2 reports) <a id="cluster-tinker-bell"></a>

Representative descriptions:
- _my tinkerbell was beaten by elsa but thats not right. my opponet readyd elsa again after that .._
- _Tinkerbell banished an opponents only character and could not resolve effect._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-19 17:46 | `tOf1pEEiSF` | game-1776619901139-th9cnmghz | 16 | desktop | my tinkerbell was beaten by elsa but thats not right. my opponet readyd elsa again after that .. |
| 2026-04-18 08:39 | `dFnB7xTKg8` | game-1776500521638-0kxqfqmic | 18 | desktop | Tinkerbell banished an opponents only character and could not resolve effect. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-meeko-skittish-scrounger — meeko skittish scrounger (2 reports) <a id="cluster-meeko-skittish-scrounger"></a>

Representative descriptions:
- _meeko - skittish scrounger ability: bottomless pit, is triggering even though the character is still drying and not exerted._
- _Meeko - Skittish Scrounger's effect has been triggered, even though he wasn't exerted._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-17 20:27 | `360zCSDiEZ` | game-1776457454157-li4dao0pb | 4 | desktop | meeko - skittish scrounger ability: bottomless pit, is triggering even though the character is still drying and not exerted. |
| 2026-04-17 03:02 | `mgSu-VwZxo` | game-1776394660742-fdb8kzok0 | 5 | desktop | Meeko - Skittish Scrounger's effect has been triggered, even though he wasn't exerted. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-donald-duck-perfect-gentleman — donald duck perfect gentleman (2 reports) <a id="cluster-donald-duck-perfect-gentleman"></a>

Representative descriptions:
- _when donald duck - perfect gentlemen triggers start at the start of my turn its causing my opponent to have to ink, playand quest with all cards before it passes back to me_
- _Donald Duck Perfect Gentleman allowed for my opponent to also draw at the start of my turn, but it should not._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-17 11:51 | `wNU7wDlqmn` | game-1776425490364-u4tehwutv | 17 | desktop | when donald duck - perfect gentlemen triggers start at the start of my turn its causing my opponent to have to ink, playand quest with al... |
| 2026-04-08 15:45 | `WPKXApdPZG` | game-1775662466629-rr65vt1ne | 12 |  | Donald Duck Perfect Gentleman allowed for my opponent to also draw at the start of my turn, but it should not. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-basil-disguised-detective — basil disguised detective (2 reports) <a id="cluster-basil-disguised-detective"></a>

Representative descriptions:
- _Basil Disguised Detective can't do the twist and turns ability system doesn't let me select the ink to pay nor an opponent's hand trigger doesn't work_
- _Basil disguised detective doesn't allow me to choose my opp to discard a card when inking_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-13 01:16 | `wJVWf_u_9s` | game-1776041985020-6htfq3vpx | 22 | desktop | Basil Disguised Detective can't do the twist and turns ability system doesn't let me select the ink to pay nor an opponent's hand trigger... |
| 2026-04-11 14:59 | `EQU2Uullp_` | game-1775919162410-gs43llyom | 14 | desktop | Basil disguised detective doesn't allow me to choose my opp to discard a card when inking |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-the-horseman-strikes — the horseman strikes (2 reports) <a id="cluster-the-horseman-strikes"></a>

Representative descriptions:
- _the horseman strikes effect does not work on removing an evasive character_
- _The Horseman Strikes is, according to the log, drawing two cards, not one._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 20:54 | `gAkd1PhSj2` | game-1775767760879-jlcs9jotq | 11 | desktop | the horseman strikes effect does not work on removing an evasive character |
| 2026-04-09 03:17 | `yJ4pvqneFH` | game-1775703652436-fu27u9b59 | 20 | desktop | The Horseman Strikes is, according to the log, drawing two cards, not one. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-olaf-snowman-of-action — olaf snowman of action (2 reports) <a id="cluster-olaf-snowman-of-action"></a>

Representative descriptions:
- _Olaf, Snowman of Action is not being discounted by actions in the discard pile. Still costs 9_
- _Olaf Snowman of Action  Ability doesn't work, doesn't reduce his total cost with actions in the discard_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 20:50 | `EZfHsalN5k` | game-1775767167485-moh8fl4tx | 14 | desktop | Olaf, Snowman of Action is not being discounted by actions in the discard pile. Still costs 9 |
| 2026-04-08 18:21 | `JVe3umd3PV` | game-1775671681935-3ilek6kxo | 24 |  | Olaf Snowman of Action  Ability doesn't work, doesn't reduce his total cost with actions in the discard |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-how-far-ill-go — how far ill go (2 reports) <a id="cluster-how-far-ill-go"></a>

Representative descriptions:
- _sung how far ill go with 5c maui and it dindnt show any cards to pick for the effect_
- _cant play How Far Ill go_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 18:54 | `sOtaJwjlj0` | game-1775760198007-4xc645028 | 17 | desktop | sung how far ill go with 5c maui and it dindnt show any cards to pick for the effect |
| 2026-04-01 15:54 | `oSiH91BY0s` | game-1775058709516-wm6ju6ygb | 9 |  | cant play How Far Ill go |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-you-came-back — you came back (2 reports) <a id="cluster-you-came-back"></a>

Representative descriptions:
- _I have a card 'you came back'  which allows me to ready a character - it readied the character but then would not allow me to quest_
- _Using You Came Back doesnt allow the character to quest. It should. It only gives you the option to challenge._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 18:33 | `tpsXi45Q-O` | game-1775758954277-a13p2rpu9 | 12 | desktop | I have a card 'you came back'  which allows me to ready a character - it readied the character but then would not allow me to quest |
| 2026-04-09 04:44 | `3G_j8F6uMe` | game-1775708941311-1zc199io0 | 14 | desktop | Using You Came Back doesnt allow the character to quest. It should. It only gives you the option to challenge. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-wreck-it-ralph-ham-hands-enchanted — wreck it ralph ham hands enchanted (2 reports) <a id="cluster-wreck-it-ralph-ham-hands-enchanted"></a>

Representative descriptions:
- _wreck it Ralph bugged. opponent boosted Ralph and used lonely grave and my two 4 cost characters did not banish._
- _Wreck-It Ralph not banishing characters when banished with Lonely Grave_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 16:28 | `ucRpUPMHuD` | game-1775751642771-y3vt8cy5w | 13 | desktop | wreck it Ralph bugged. opponent boosted Ralph and used lonely grave and my two 4 cost characters did not banish. |
| 2026-04-08 14:11 | `hVdJqL6u2z` | game-1775656550803-pb0izqk7e | 21 |  | Wreck-It Ralph not banishing characters when banished with Lonely Grave |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-into-the-unknown — into the unknown (2 reports) <a id="cluster-into-the-unknown"></a>

Representative descriptions:
- _into the unknown my ready merfolk_
- _AI used Into the Unknown on readied Genie._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 09:10 | `0jpQTM-6Ua` | game-1775725085563-wqbcbn2ek | 17 | desktop | into the unknown my ready merfolk |
| 2026-03-30 16:55 | `iXAt6HM6cT` | game-1774889414976-500kgdit2 | 9 |  | AI used Into the Unknown on readied Genie. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-circle-of-life — circle of life (2 reports) <a id="cluster-circle-of-life"></a>

Representative descriptions:
- _When activating circle of life it automatically selects the first character in the discard and won’t let you select a character_
- _Circle of life is supposed to be a single song.It won't let me sing it_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 07:27 | `Jn2XIa-K9y` | game-1775718876375-p5ejtn8u9 | 13 | mobile | When activating circle of life it automatically selects the first character in the discard and won’t let you select a character |
| 2026-04-04 06:26 | `U7ghDho3bn` | game-1775283352040-qv0pvja5d | 7 |  | Circle of life is supposed to be a single song.It won't let me sing it |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-akood-et-emuti — akood et emuti (2 reports) <a id="cluster-akood-et-emuti"></a>

Representative descriptions:
- _Opponent sang Akood Et Emuti, and the discounted ink cost applied to every charachter played, not just one._
- _I'm playing steel song, I play the ariel and draw akood et emuti but couldn't drag it to my hand_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 16:36 | `0tUQIkq7Us` | game-1775665921667-srhe1o344 | 7 |  | Opponent sang Akood Et Emuti, and the discounted ink cost applied to every charachter played, not just one. |
| 2026-04-01 09:09 | `oElPOzn0H1` | game-1775033441348-88xh566yg | 19 |  | I'm playing steel song, I play the ariel and draw akood et emuti but couldn't drag it to my hand |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-bambi-ethereal-fawn — bambi ethereal fawn (2 reports) <a id="cluster-bambi-ethereal-fawn"></a>

Representative descriptions:
- _Cannot resolve Bambi - Ethereal Fawn's pending effect after questing with 2 cards underneath._
- _Challenging with Bambi - Ethereal Fawn triggers his effect but does not allow me to select cards to put in my hand. The game gets stuck._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 14:22 | `jMOPL2j1nX` | game-1775657068497-9gjdxnysm | 19 |  | Cannot resolve Bambi - Ethereal Fawn's pending effect after questing with 2 cards underneath. |
| 2026-04-02 14:36 | `G6W4YSIwg0` | game-1775140087282-r5iu4e7mk | 11 |  | Challenging with Bambi - Ethereal Fawn triggers his effect but does not allow me to select cards to put in my hand. The game gets stuck. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-pawpsicle — pawpsicle (2 reports) <a id="cluster-pawpsicle"></a>

Representative descriptions:
- _Turn 1 in this Match logs stated that opponent played Pawpsicle, Banished it to draw 2 Cards, then proceeded to play a 1 Cost 2/2 1 Lore Robin Hood_
- _cant play Belle after playing a pawpsicle_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 12:58 | `7JhfTj7a4y` | game-1775652087234-6c7f0piie | 17 |  | Turn 1 in this Match logs stated that opponent played Pawpsicle, Banished it to draw 2 Cards, then proceeded to play a 1 Cost 2/2 1 Lore ... |
| 2026-03-30 23:24 | `lFZPzArs9N` | game-1774912831646-2q752s5k8 | 3 |  | cant play Belle after playing a pawpsicle |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-malicious-means — malicious means (1 reports) <a id="cluster-malicious-means"></a>

Representative descriptions:
- _Malicious mean etc can’t kill Mrs incredible she has resist plus 1_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-16 01:45 | `cHn1tDcsmc` | mgCfdGRgNu_UVohn_xS4lQX | 14 | desktop | Malicious mean etc can’t kill Mrs incredible she has resist plus 1 |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-frozone — frozone (1 reports) <a id="cluster-frozone"></a>

Representative descriptions:
- _Put damage from demona onto frozone and it just took all damange off and readied_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-16 00:04 | `ye8Cdoy9kv` | mgQLD3ixdboXs6R_rUzQfGh | 22 | desktop | Put damage from demona onto frozone and it just took all damange off and readied |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-roller-bob — roller bob (1 reports) <a id="cluster-roller-bob"></a>

Representative descriptions:
- _The card "roller bob" should have let me put 2 character cards from my discards on the bottom of my deck to give this character "rush", but the app wouldn't let me do that_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-15 16:04 | `AfXMVNB8nE` | mgetVyM4r9YK6IU-BVkLxZu | 14 | desktop | The card "roller bob" should have let me put 2 character cards from my discards on the bottom of my deck to give this character "rush", b... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-peter-pan — peter pan (1 reports) <a id="cluster-peter-pan"></a>

Representative descriptions:
- _Not letting me gain lore after challening peter pan. also not sure if I am always getting SIDS double prize lore.._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-14 19:20 | `nHVSpQ6QMV` | mgrDQT809iMX3jhuhf3Av30 | 16 | desktop | Not letting me gain lore after challening peter pan. also not sure if I am always getting SIDS double prize lore.. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mulan-injured-soldier — mulan injured soldier (1 reports) <a id="cluster-mulan-injured-soldier"></a>

Representative descriptions:
- _louisa madrigal will not allow me to move my damage from mulan injured soldier to her. i paid the 1 ink and clicked mulan, louisa did not take her damage_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-13 19:31 | `iTy_83Tdk2` | mgmnkpH32gQjHEdlltMwb0x | 12 | desktop | louisa madrigal will not allow me to move my damage from mulan injured soldier to her. i paid the 1 ink and clicked mulan, louisa did not... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-the-family-scattered — the family scattered (1 reports) <a id="cluster-the-family-scattered"></a>

Representative descriptions:
- _The Family Scattered doesn't work properly._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-13 18:34 | `s-MwcLXxfh` | mgP74J6esy0kEw-OAJZYWeV | 21 | desktop | The Family Scattered doesn't work properly. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-sword-of-shan-yu — sword of shan yu (1 reports) <a id="cluster-sword-of-shan-yu"></a>

Representative descriptions:
- _unable to use sword of shan yu item, played but no action_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-13 17:09 | `5wr-Vwp7vg` | mgh8i6FUyv815Ph-uVVDERK | 18 | desktop | unable to use sword of shan yu item, played but no action |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-captain-hook-underhanded — captain hook underhanded (1 reports) <a id="cluster-captain-hook-underhanded"></a>

Representative descriptions:
- _Captain Hook - Underhanded can never quest_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-13 15:21 | `dzF2V4-GB7` | mg7RP5m0mETywA6F4IY9Nxm | 12 | desktop | Captain Hook - Underhanded can never quest |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-hiro-hamada — hiro hamada (1 reports) <a id="cluster-hiro-hamada"></a>

Representative descriptions:
- _Baymax triggered Hiro when it shouldn't have_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-13 02:28 | `ogcHcoBZdG` | mgmoch6FSfHD-Z5o78IVhoj | 10 | desktop | Baymax triggered Hiro when it shouldn't have |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-this-growing-pressure — this growing pressure (1 reports) <a id="cluster-this-growing-pressure"></a>

Representative descriptions:
- _"this growing pressure" song is not working the opposing character is not being forced to quest, it only says they cant challenge_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-12 00:44 | `rWvVNnomM5` | mgYeTviuiHU1pNzVB5rM-0I | 18 | desktop | "this growing pressure" song is not working the opposing character is not being forced to quest, it only says they cant challenge |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-merryweather — merryweather (1 reports) <a id="cluster-merryweather"></a>

Representative descriptions:
- _Card Log is still incorrect. played Merryweather, but read as Cincerella - among other_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-11 19:42 | `HUCa69XfZI` | mgzItiixtWjP0Xn14tgS810 | 11 | desktop | Card Log is still incorrect. played Merryweather, but read as Cincerella - among other |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mirabel-madrigal — mirabel madrigal (1 reports) <a id="cluster-mirabel-madrigal"></a>

Representative descriptions:
- _daisy donald's date sent mirabel, family gatherer to the bottom of the deck rather than into my hand._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-11 02:23 | `_asW9i6WVW` | game-1778466092595-mazdxn39f | 5 | desktop | daisy donald's date sent mirabel, family gatherer to the bottom of the deck rather than into my hand. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-minnie-mouse-daring-defender — minnie mouse daring defender (1 reports) <a id="cluster-minnie-mouse-daring-defender"></a>

Representative descriptions:
- _Minnie Mouse daring defender did not register as having 3 strength when she had 3 damage and was banished by headless horseman even though she had more than 2 strength_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-10 17:53 | `NyKm12vam3` | mgMByd3hjobxbvwE4t0PXLJ | 11 | desktop | Minnie Mouse daring defender did not register as having 3 strength when she had 3 damage and was banished by headless horseman even thoug... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-robin-hood-desert-wanderer — robin hood desert wanderer (1 reports) <a id="cluster-robin-hood-desert-wanderer"></a>

Representative descriptions:
- _Robin hood-Desert Wanderer was unable to attack Locations._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-10 17:28 | `6AEQc-p_FG` | mgVDqHlEZf1rVCu5DMNoaDV | 15 | desktop | Robin hood-Desert Wanderer was unable to attack Locations. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-firefly-swarm — firefly swarm (1 reports) <a id="cluster-firefly-swarm"></a>

Representative descriptions:
- _firefly swarm not working as intented. I select the 2nd option and nothing happens, I select the first option and it only lets me banish a character with 2 strength or less. no option is letting me use its second effe..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-10 01:01 | `4KEImzvEr_` | mg3t8KOaFZtkqJIInuupG6n | 14 | desktop | firefly swarm not working as intented. I select the 2nd option and nothing happens, I select the first option and it only lets me banish ... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-winnie-the-pooh-hunny-pirate — winnie the pooh hunny pirate (1 reports) <a id="cluster-winnie-the-pooh-hunny-pirate"></a>

Representative descriptions:
- _Mickey Mouse - Pirate Captain quested and gave Winnie the Pooh Hunny Pirate +2 strength but did not give the "this character takes no damage from challenges this turn" text._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-08 18:04 | `_atTJYPLY1` | game-1778263203469-ltn8p0rf0 | 10 | desktop | Mickey Mouse - Pirate Captain quested and gave Winnie the Pooh Hunny Pirate +2 strength but did not give the "this character takes no dam... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-the-sword-of-shan-yu — the sword of shan yu (1 reports) <a id="cluster-the-sword-of-shan-yu"></a>

Representative descriptions:
- _The Sword of Shan-Yu does not work_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-08 17:38 | `NLew5qeP6Q` | mg9uJw6cdJrJprqWT9KtWOi | 14 | desktop | The Sword of Shan-Yu does not work |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mr-incredible-super-strong — mr incredible super strong (1 reports) <a id="cluster-mr-incredible-super-strong"></a>

Representative descriptions:
- _On several occassions I could not challange with calhoun and Mr. Incredible super strong_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-08 14:42 | `HpBWXzkUqI` | mgnNpmQscTYkB3TleZ5TY9C | 21 | mobile | On several occassions I could not challange with calhoun and Mr. Incredible super strong |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-potion-of-might — potion of might (1 reports) <a id="cluster-potion-of-might"></a>

Representative descriptions:
- _Potion of Might didn't give Taursa Bulba, a Villain plus 4 strength_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-07 16:16 | `1j5UszNmel` | mg6-IdOCfYRSnwg_9pXG3OR | 11 | desktop | Potion of Might didn't give Taursa Bulba, a Villain plus 4 strength |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-im-stuck — im stuck (1 reports) <a id="cluster-im-stuck"></a>

Representative descriptions:
- _cant choose a target for king undisputed now im stuck_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-07 12:24 | `xZbLXSA4FY` | mgGJi7JhdHRtDAzAceFlVmc | 7 | desktop | cant choose a target for king undisputed now im stuck |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-jasmine — jasmine (1 reports) <a id="cluster-jasmine"></a>

Representative descriptions:
- _When I choose Jasmine's ability to discard a card and give her Challenger +3, it is exerting her. She should not be exerted_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-06 19:45 | `l_CdN-T2gJ` | mgwoV7wIaRzUzAK1cZmcSLR | 11 | mobile | When I choose Jasmine's ability to discard a card and give her Challenger +3, it is exerting her. She should not be exerted |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-kristoffs-lute — kristoffs lute (1 reports) <a id="cluster-kristoffs-lute"></a>

Representative descriptions:
- _Kristoffs Lute Doesn t work_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-06 19:04 | `z7NLhAf8cS` | mgmcNpgpnZ37co6lFDEJ9Ou | 14 | desktop | Kristoffs Lute Doesn t work |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-brawl — brawl (1 reports) <a id="cluster-brawl"></a>

Representative descriptions:
- _can not cast brawl for some reason . and maui with rush couldnt challenge_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-05 19:29 | `0J_EUtpilB` | mgdowIXaq4cAwxn69oRUVcE | 9 | mobile | can not cast brawl for some reason . and maui with rush couldnt challenge |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-lilo-bundled-up — lilo bundled up (1 reports) <a id="cluster-lilo-bundled-up"></a>

Representative descriptions:
- _tinkerbell puts damage on lilo bundled up, was the first time during my opponents turn that damage was dealt_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-05 08:52 | `ZpNv-cEI7X` | mgCMXziI9o3dMO7rsBAGuug | 18 | desktop | tinkerbell puts damage on lilo bundled up, was the first time during my opponents turn that damage was dealt |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-minnie-mouse — minnie mouse (1 reports) <a id="cluster-minnie-mouse"></a>

Representative descriptions:
- _Cannot enter minnie mouse exerted_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-05 08:43 | `fNkETf7IRv` | mgsAyRnqP317_qoD_1P22yj | 14 | desktop | Cannot enter minnie mouse exerted |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-lucifer-cunning-cat — lucifer cunning cat (1 reports) <a id="cluster-lucifer-cunning-cat"></a>

Representative descriptions:
- _The bot is not discarding due the effect of Lucifer - Cunning Cat_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-05 00:29 | `fF4AAVmQtt` | game-1777940498322-3rjk7l8ik | 10 | desktop | The bot is not discarding due the effect of Lucifer - Cunning Cat |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mad-hatter-eccentric-host — mad hatter eccentric host (1 reports) <a id="cluster-mad-hatter-eccentric-host"></a>

Representative descriptions:
- _Mad Hatter Eccentric Host effect is not resolving. It should allow you to look at the top of either player's deck and then discard or keep the card there._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-04 15:14 | `v-c-hQ95ng` | mg-FS6pAeXIFGaxTzBtPlOZ | 3 | desktop | Mad Hatter Eccentric Host effect is not resolving. It should allow you to look at the top of either player's deck and then discard or kee... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-the-queen-jealous-beauty — the queen jealous beauty (1 reports) <a id="cluster-the-queen-jealous-beauty"></a>

Representative descriptions:
- _[The Queen - Jealous Beauty]  Player was able to target three cards from their own discard for the lore gain despite The Queen only being able to target the opponent's discard pile._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-03 20:05 | `B_4A0zjSAF` | mglHxVIOB12eVDb-14kQKvL | 11 | desktop | [The Queen - Jealous Beauty]  Player was able to target three cards from their own discard for the lore gain despite The Queen only being... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-bounce — bounce (1 reports) <a id="cluster-bounce"></a>

Representative descriptions:
- _Bibbido Bobbido Boo won't let me target the same character for the return to hand and the play for free effects. It says "return to hand, then you can [...]" implying the character is already in your hand when the pla..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-03 15:56 | `B5cQw8MAmE` | game-1777823310335-8221zdk15 | 18 | desktop | Bibbido Bobbido Boo won't let me target the same character for the return to hand and the play for free effects. It says "return to hand,... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-the-thunderquack — the thunderquack (1 reports) <a id="cluster-the-thunderquack"></a>

Representative descriptions:
- _Mr Incredible did not work because the Thunderquack is bugged and didn't give my opponents characters villain classification_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-03 03:12 | `vCR1LmH7_n` | mgOvv3d_ErO0EUf3ua3SWXI | 12 | desktop | Mr Incredible did not work because the Thunderquack is bugged and didn't give my opponents characters villain classification |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-pongo-dear-old-dad — pongo dear old dad (1 reports) <a id="cluster-pongo-dear-old-dad"></a>

Representative descriptions:
- _Pongo - Dear old dad ability does not works right_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-02 21:39 | `OY9F_PytDz` | game-1777757656499-wzxpyvvnm | 11 | desktop | Pongo - Dear old dad ability does not works right |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-someone-will-lose-his-head — someone will lose his head (1 reports) <a id="cluster-someone-will-lose-his-head"></a>

Representative descriptions:
- _The Leviathan's interaction with Dale - Ready for his Shot and Someone Will Lose Their Head is glitched. It seems like it counts their health instead of their attack, which is wrong since Dale only says they use their..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-02 20:58 | `u9DAaZrxwC` | mgEaUbNbcd6hBnwtrZHQ598 | 14 | desktop | The Leviathan's interaction with Dale - Ready for his Shot and Someone Will Lose Their Head is glitched. It seems like it counts their he... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-simba — simba (1 reports) <a id="cluster-simba"></a>

Representative descriptions:
- _For 4 games in a row I can’t use my glass slipper. I am winning if the app let me use it with simba and after I play Cindy._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-02 19:27 | `GVL091HUfk` | mg4EnMXTxCs-O8BJauzz9vp | 15 | desktop | For 4 games in a row I can’t use my glass slipper. I am winning if the app let me use it with simba and after I play Cindy. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-second-star-to-the-right — second star to the right (1 reports) <a id="cluster-second-star-to-the-right"></a>

Representative descriptions:
- _can't choose player with Second Star to the Right_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-01 18:05 | `O1joBXGS-y` | mglrS51j2_kcg1FQ5CTAok7 | 15 | desktop | can't choose player with Second Star to the Right |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-minnie-mouse-drum-major — minnie mouse drum major (1 reports) <a id="cluster-minnie-mouse-drum-major"></a>

Representative descriptions:
- _Minnie Mouse - Drum Major won't let me select any characters. It says they are all invalid targets. This freezes up the game until skip is selected._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-01 16:31 | `VpfvdS2P-M` | mgW20pqwM-3G6WwYVXsBJIY | 12 | desktop | Minnie Mouse - Drum Major won't let me select any characters. It says they are all invalid targets. This freezes up the game until skip i... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-ichabod-crane-scared-out-of-his-mind — ichabod crane scared out of his mind (1 reports) <a id="cluster-ichabod-crane-scared-out-of-his-mind"></a>

Representative descriptions:
- _Some thing strange happened with Olaf He triggered although he was not banished   Challenged Ichabod Crane - Scared Out of His Mind with Olaf - Helping Hand. Olaf - Helping Hand dealt 0 damage to Ichabod Crane - Scare..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-01 14:15 | `OrGcG-wZ-D` | mgmLxU-BJi6TIszP4-XfD7x | 9 | desktop | Some thing strange happened with Olaf He triggered although he was not banished   Challenged Ichabod Crane - Scared Out of His Mind with ... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-roller-bob-sids-toy — roller bob sids toy (1 reports) <a id="cluster-roller-bob-sids-toy"></a>

Representative descriptions:
- _I went to play roller bob - sids toy but it forces you to resolve the trigger of his "Time to Move" ability even though it is a 'may' effect to place to toys on the bottom of the deck. There was no way to deny / cance..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-30 20:44 | `2gQskAmG7l` | mgjIHo4ECIyDAwu1osweVk7 | 20 | desktop | I went to play roller bob - sids toy but it forces you to resolve the trigger of his "Time to Move" ability even though it is a 'may' eff... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-dolores-madrigal — dolores madrigal (1 reports) <a id="cluster-dolores-madrigal"></a>

Representative descriptions:
- _|It was presenting cards as the wrong card during gameplay, i.e. saying kuzko was dolores madrigal_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-30 18:30 | `w6vjuxCYC6` | game-1777572814181-l8il13cn4 | 18 | desktop | \|It was presenting cards as the wrong card during gameplay, i.e. saying kuzko was dolores madrigal |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-kida-discovering-the-unknown — kida discovering the unknown (1 reports) <a id="cluster-kida-discovering-the-unknown"></a>

Representative descriptions:
- _Kida: Discovering the Unknown. She she quests and two cards have been placed in the discard, put a card facedown in your inkwell from the top of your deck. Discarded a Beast: Aggressive Lord with BOOST and did not rec..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-30 17:30 | `qDN3axTXQG` | game-1777569946283-56nxlbs8g | 9 | desktop | Kida: Discovering the Unknown. She she quests and two cards have been placed in the discard, put a card facedown in your inkwell from the... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-heihei-expanded-consciousness — heihei expanded consciousness (1 reports) <a id="cluster-heihei-expanded-consciousness"></a>

Representative descriptions:
- _heihei expanded consciousness will not ink all cards in the hand like it should_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-30 15:48 | `P1aql8Kv6M` | mgbpC0fqW43xb-h8WWM99zR | 18 | desktop | heihei expanded consciousness will not ink all cards in the hand like it should |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-jessie-lively-cowgirl — jessie lively cowgirl (1 reports) <a id="cluster-jessie-lively-cowgirl"></a>

Representative descriptions:
- _I paid two or less for a character while having Jessie - Lively Cowgirl in play and it didn't let choose a character two get one less attack. It just showed the ability and wouldn't let me do anything. So I just timed..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-30 15:35 | `2wlven23-Z` | mg6EAhzFFH-700-NSTE6B_q | 12 | desktop | I paid two or less for a character while having Jessie - Lively Cowgirl in play and it didn't let choose a character two get one less att... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-lady-family-dog — lady family dog (1 reports) <a id="cluster-lady-family-dog"></a>

Representative descriptions:
- _When playing a bodyguard for free from Lady Family Dog trigger, it didn't give the option to play the bodyguard exerted_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-30 07:32 | `mHHr76-foJ` | game-1777534069928-ucvqh18vv | 7 | desktop | When playing a bodyguard for free from Lady Family Dog trigger, it didn't give the option to play the bodyguard exerted |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-fire-the-cannons — fire the cannons (1 reports) <a id="cluster-fire-the-cannons"></a>

Representative descriptions:
- _Fire the cannons did not banish Palace guard_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-29 18:31 | `TGkl5RRpGV` | game-1777487246252-ssusrggaq | 7 | desktop | Fire the cannons did not banish Palace guard |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-lady-miss-park-avenue — lady miss park avenue (1 reports) <a id="cluster-lady-miss-park-avenue"></a>

Representative descriptions:
- _Picked 2 cards with "Lady - Miss Park Avenue" but only 1 went to hand. Browser Firefox_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-29 10:27 | `pGcfdtuPXC` | mgKmbB4C2bqZL6NQWmITvWk | 20 | desktop | Picked 2 cards with "Lady - Miss Park Avenue" but only 1 went to hand. Browser Firefox |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-moana-island-explorer — moana island explorer (1 reports) <a id="cluster-moana-island-explorer"></a>

Representative descriptions:
- _Moana Island explorer boosted Mulan eventhough Moana didn't challenge a character_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-28 21:19 | `3ByIxnRIJ6` | mgocCKMYwXQRsl0I0DDnFAU | 12 | desktop | Moana Island explorer boosted Mulan eventhough Moana didn't challenge a character |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-kida-creative-thinker — kida creative thinker (1 reports) <a id="cluster-kida-creative-thinker"></a>

Representative descriptions:
- _Kida - Creative thinker isn't putting the correct card onto the top of the deck when you use her ability Key to the Puzzle._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-28 14:21 | `5T3epIciJw` | mgr0LV_drvVFi9iG04Dagh6 | 22 | desktop | Kida - Creative thinker isn't putting the correct card onto the top of the deck when you use her ability Key to the Puzzle. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-what-else-can-i-do — what else can i do (1 reports) <a id="cluster-what-else-can-i-do"></a>

Representative descriptions:
- _trying to use what else can i do no effect happens wether i sing it or hard cast it just goes straight to discard with no draw no ink_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-27 16:02 | `gZxh7Aru7l` | mghF9CXsTqLpL0Ya_LSzDm0 | 9 | desktop | trying to use what else can i do no effect happens wether i sing it or hard cast it just goes straight to discard with no draw no ink |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-broadway-sturdy-and-strong — broadway sturdy and strong (1 reports) <a id="cluster-broadway-sturdy-and-strong"></a>

Representative descriptions:
- _Broadway Sturdy and Strong still isn't registering as having bodyguard._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-27 15:36 | `7venc1Wn01` | game-1777303867441-qa75josua | 17 | mobile | Broadway Sturdy and Strong still isn't registering as having bodyguard. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-metamorphosis — metamorphosis (1 reports) <a id="cluster-metamorphosis"></a>

Representative descriptions:
- _metamorphosis broken didn't let me play the character_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-27 11:25 | `sZ-jn8Bex_` | mgNulFdSgQjY1OC7ec2SdVq | 6 | mobile | metamorphosis broken didn't let me play the character |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-sugar-rush-speedway-starting-line — sugar rush speedway starting line (1 reports) <a id="cluster-sugar-rush-speedway-starting-line"></a>

Representative descriptions:
- _Can't use sugar rush speedway starting line to select a character at the location to move them_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-27 03:07 | `GmprHGSzaL` | mgfKWuegVvQtuwVnJ4hlv4P | 6 | desktop | Can't use sugar rush speedway starting line to select a character at the location to move them |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-daisy-duck-donalds-date — daisy duck donalds date (1 reports) <a id="cluster-daisy-duck-donalds-date"></a>

Representative descriptions:
- _Daisy Duck - Donalds Date does not reveal the card to the opponent_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-26 19:35 | `qgnyxqJpVq` | mgyHnSvDMsGxh3_HV-ajRie | 12 | desktop | Daisy Duck - Donalds Date does not reveal the card to the opponent |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-merlin-crab — merlin crab (1 reports) <a id="cluster-merlin-crab"></a>

Representative descriptions:
- _merlin crab is giving the challenger three on attack as well as enter and leave_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-26 04:48 | `k-Hv3GB14w` | game-1777178744903-d5s5w0v9n | 9 | desktop | merlin crab is giving the challenger three on attack as well as enter and leave |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-genie-wish-fulfilled — genie wish fulfilled (1 reports) <a id="cluster-genie-wish-fulfilled"></a>

Representative descriptions:
- _AI played Horseman Strikes. I had two evasive characters on the board (Genie - Wish Fulfilled, Elsa - Fifth Spirit). They chose to not banish either of them. They definitely should have chosen to banish one of them; l..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-25 16:26 | `fCPeN1KTck` | game-1777134243546-gaqzvfoyp | 9 | desktop | AI played Horseman Strikes. I had two evasive characters on the board (Genie - Wish Fulfilled, Elsa - Fifth Spirit). They chose to not ba... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-stitch — stitch (1 reports) <a id="cluster-stitch"></a>

Representative descriptions:
- _game gets stuck on if a trigger can't be resolved (stitch surfer with 1 charecter)_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-25 07:59 | `ATN-RVI32O` | game-1777103176041-ycjb66yzc | 25 | desktop | game gets stuck on if a trigger can't be resolved (stitch surfer with 1 charecter) |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-the-headless-horseman-terror-of-sleepy-hollow-enchanted — the headless horseman terror of sleepy hollow enchanted (1 reports) <a id="cluster-the-headless-horseman-terror-of-sleepy-hollow-enchanted"></a>

Representative descriptions:
- _After playing the Headless horseman, my alladin and pluto should've had enough strength to banish the opponents Ariel and Goliath. I was unable to challenge and while trying to trouble shoot, my opponent requested to ..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-25 04:01 | `cxVhWJG9K3` | game-1777089040820-3jg4f06ia | 17 | desktop | After playing the Headless horseman, my alladin and pluto should've had enough strength to banish the opponents Ariel and Goliath. I was ... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-clarabelle-light-on-her-hooves — clarabelle light on her hooves (1 reports) <a id="cluster-clarabelle-light-on-her-hooves"></a>

Representative descriptions:
- _opponent cannot resolve Clarabelle - Light on Her Hooves KEEP IN STEP  Not actionable from this view right now.  Waiting for opponent. so we have to wait 2 minutes until skip opp turn_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-25 03:31 | `TRasFz5kDk` | game-1777087710693-43c5fsj7b | 8 | desktop | opponent cannot resolve Clarabelle - Light on Her Hooves KEEP IN STEP  Not actionable from this view right now.  Waiting for opponent. so... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-magica-de-spell-shadowy-and-sinister — magica de spell shadowy and sinister (1 reports) <a id="cluster-magica-de-spell-shadowy-and-sinister"></a>

Representative descriptions:
- _magica de spell didn't seem to  be removing damage points from one opponent to another. Also, I kept getting stuck after playing meeko._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-24 22:21 | `q4OPtr-5W6` | game-1777067890306-e3yz9gn2v | 20 | desktop | magica de spell didn't seem to  be removing damage points from one opponent to another. Also, I kept getting stuck after playing meeko. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-scar — scar (1 reports) <a id="cluster-scar"></a>

Representative descriptions:
- _wont let me skip scar's trigger_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-24 17:17 | `-ly3Jx2NAK` | game-1777050758079-o4xfepu7d | 11 | desktop | wont let me skip scar's trigger |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-donald-duck-along-for-the-ride — donald duck along for the ride (1 reports) <a id="cluster-donald-duck-along-for-the-ride"></a>

Representative descriptions:
- _Played Donald Duck - Along for the ride coming through.  It would not select the item in play._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-24 17:00 | `BXfKWfEixM` | game-1777049373144-d743rsmcq | 16 | desktop | Played Donald Duck - Along for the ride coming through.  It would not select the item in play. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-megara — megara (1 reports) <a id="cluster-megara"></a>

Representative descriptions:
- _megara did not trigger a discard_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-24 02:43 | `Asp4iPnVda` | game-1776998046446-jvzleqfnb | 13 | desktop | megara did not trigger a discard |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-stitch-rock-star — stitch rock star (1 reports) <a id="cluster-stitch-rock-star"></a>

Representative descriptions:
- _The Ward seemed broken for Prince Phillip ward to heroes card. Opponent was able to use Hades to banish both Stitch Rock Star (hero) and another Prince Phillip (hero). And those shouldn't have been able to be selected._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-22 16:33 | `7Fhmi2dZY2` | game-1776874829526-quju8qpuk | 15 | desktop | The Ward seemed broken for Prince Phillip ward to heroes card. Opponent was able to use Hades to banish both Stitch Rock Star (hero) and ... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-simba-pride-protector — simba pride protector (1 reports) <a id="cluster-simba-pride-protector"></a>

Representative descriptions:
- _Simba pride protector is giving the option to ready my opponents cards at the end of their turn and at the end of my turn. it should only ready my exerted cards when exerted_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-22 02:19 | `XK7nDhJoUC` | game-1776823722045-n460rj18j | 14 | desktop | Simba pride protector is giving the option to ready my opponents cards at the end of their turn and at the end of my turn. it should only... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-namaari-single-minded-rival — namaari single minded rival (1 reports) <a id="cluster-namaari-single-minded-rival"></a>

Representative descriptions:
- _Mulan - Ready for battle only gave 1 discount even though I had Namaari - Single-Minded Rival with damage on board  with poer +5 and 3 damage_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-21 17:28 | `bx6TlqOcRX` | game-1776791678762-8vyle1qdy | 19 | desktop | Mulan - Ready for battle only gave 1 discount even though I had Namaari - Single-Minded Rival with damage on board  with poer +5 and 3 da... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-fa-zhou-war-hero — fa zhou war hero (1 reports) <a id="cluster-fa-zhou-war-hero"></a>

Representative descriptions:
- _Fa Zhou, War Hero, the text says when a character banishes another character in a challenge, if it was the second challenge, gain 3 lore.  I had the character take out a location and it gave me the lore when it should..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-21 12:41 | `flqURxUjpn` | game-1776774604172-t9kwx3uwn | 14 | desktop | Fa Zhou, War Hero, the text says when a character banishes another character in a challenge, if it was the second challenge, gain 3 lore.... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-next-stop-olympus — next stop olympus (1 reports) <a id="cluster-next-stop-olympus"></a>

Representative descriptions:
- _Won't allow me to play next stop Olympus for free when I have 2 characters in play with 5 attack_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-20 13:02 | `r_ipeaBGG9` | game-1776689679343-saqv093rq | 10 | desktop | Won't allow me to play next stop Olympus for free when I have 2 characters in play with 5 attack |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-education-or-elimination — education or elimination (1 reports) <a id="cluster-education-or-elimination"></a>

Representative descriptions:
- _Tod did not ready when targeted by Education or Elimination_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-19 02:50 | `6lkZBmo6Za` | game-1776566562062-f0gn5ipy2 | 13 | desktop | Tod did not ready when targeted by Education or Elimination |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-graveyard-of-christmas-future-lonely-resting-place — graveyard of christmas future lonely resting place (1 reports) <a id="cluster-graveyard-of-christmas-future-lonely-resting-place"></a>

Representative descriptions:
- _when Another Chance from Graveyard of Christmas Future is activated, the log showed it as being an activation of 2-cost Lilo_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-18 09:54 | `CE3MytTMcn` | game-1776505005602-h0ei99gsu | 18 | desktop | when Another Chance from Graveyard of Christmas Future is activated, the log showed it as being an activation of 2-cost Lilo |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-kuzco — kuzco (1 reports) <a id="cluster-kuzco"></a>

Representative descriptions:
- _The kuzco's effect is wrong I cannot be able to select_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-18 01:58 | `z9BTiDVBhT` | game-1776477113529-eek9j6z2n | 10 | desktop | The kuzco's effect is wrong I cannot be able to select |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-darkwing-duck-cool-under-pressure-enchanted — darkwing duck cool under pressure enchanted (1 reports) <a id="cluster-darkwing-duck-cool-under-pressure-enchanted"></a>

Representative descriptions:
- _Darkwings chair set. effekt heals 4 damage it it is a Darkwing duck charakter. in my game against bot banishing the item only heald 2 damage from my Darkwing Duck cool under preasure_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-17 20:49 | `65GdN_EInp` | game-1776458232437-4d4mgqdoe | 13 | desktop | Darkwings chair set. effekt heals 4 damage it it is a Darkwing duck charakter. in my game against bot banishing the item only heald 2 dam... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-queens-sensor-core — queens sensor core (1 reports) <a id="cluster-queens-sensor-core"></a>

Representative descriptions:
- _could get daisy duck with queens sensor core_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-16 18:24 | `0Trx8Bs8OG` | game-1776362962817-djmb4cqzg | 25 | desktop | could get daisy duck with queens sensor core |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-raging-storm — raging storm (1 reports) <a id="cluster-raging-storm"></a>

Representative descriptions:
- _played "raging storm" with two maui sharks on board for the win, but it didnt give me any lore when i played it_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-16 11:00 | `V_Lx-_1Luk` | game-1776337184913-1zw14mfo3 | 1 | desktop | played "raging storm" with two maui sharks on board for the win, but it didnt give me any lore when i played it |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-ariel-ethereal-voice — ariel ethereal voice (1 reports) <a id="cluster-ariel-ethereal-voice"></a>

Representative descriptions:
- _Ariel Ethereal Voice allows you to draw a card even if there isn't a card under her_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-15 23:16 | `PMQVDTBMDt` | game-1776294786092-sesdrafg3 | 11 | desktop | Ariel Ethereal Voice allows you to draw a card even if there isn't a card under her |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-ed-hysterical-partygoer — ed hysterical partygoer (1 reports) <a id="cluster-ed-hysterical-partygoer"></a>

Representative descriptions:
- _Opponent has a tapped ed hysterical partygoer and i have a liquidator with one damage. The app will not let me pass turn because it want me to challenge even though i cant._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-15 13:45 | `txVTF0rjcH` | game-1776260699380-w7lm97mvj |  | desktop | Opponent has a tapped ed hysterical partygoer and i have a liquidator with one damage. The app will not let me pass turn because it want ... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-max-goof-chart-topper-enchanted — max goof chart topper enchanted (1 reports) <a id="cluster-max-goof-chart-topper-enchanted"></a>

Representative descriptions:
- _max goof chart toppers ability won't let me pick a card to use from discard_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-15 02:35 | `55MmMyc1Qj` | game-1776219780526-b4yevbgs9 | 15 | desktop | max goof chart toppers ability won't let me pick a card to use from discard |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-kristoff-icy-explorer — kristoff icy explorer (1 reports) <a id="cluster-kristoff-icy-explorer"></a>

Representative descriptions:
- _Kristoff Icy Explorer's "Hidden Depths" triggered and was able to be resolved without having an Anna in play. (There is an Anna in my inkwell)._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-14 22:51 | `puEyz2R8ld` | game-1776206736731-gpwfio2h6 | 7 | desktop | Kristoff Icy Explorer's "Hidden Depths" triggered and was able to be resolved without having an Anna in play. (There is an Anna in my ink... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-under-the-sea — under the sea (1 reports) <a id="cluster-under-the-sea"></a>

Representative descriptions:
- _under the sea triggered the library, under the sea is not a banish effect_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-14 14:54 | `pCeN90ibIr` | game-1776177959188-specywvjh | 13 | desktop | under the sea triggered the library, under the sea is not a banish effect |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-scrooge-mcduck-reformed-ebenezer — scrooge mcduck reformed ebenezer (1 reports) <a id="cluster-scrooge-mcduck-reformed-ebenezer"></a>

Representative descriptions:
- _Scrooge McDuck - Reformed Ebenezer does not trigger his effect when he is played. I should be able to put a card under each one of my characters but I get no such prompt, nothing happens._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-14 13:48 | `YVsAVJkmOo` | game-1776174006507-zja4hpgsv | 15 | desktop | Scrooge McDuck - Reformed Ebenezer does not trigger his effect when he is played. I should be able to put a card under each one of my cha... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-the-islands-i-pulled-from-the-sea — the islands i pulled from the sea (1 reports) <a id="cluster-the-islands-i-pulled-from-the-sea"></a>

Representative descriptions:
- _Playing "The Islands I Pulled From The Sea" didn't give me a choice of location from my deck - it autoselected one for me (no idea if random or if just 'the next one')._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-14 01:46 | `1wc8EvsKBP` | game-1776130633964-d9easzyaf | 9 | desktop | Playing "The Islands I Pulled From The Sea" didn't give me a choice of location from my deck - it autoselected one for me (no idea if ran... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-megabot — megabot (1 reports) <a id="cluster-megabot"></a>

Representative descriptions:
- _Megabot doesnt work_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-13 17:32 | `Kqq2g5UQ84` | game-1776101395555-9v43po0kb | 11 | desktop | Megabot doesnt work |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-food-fight — food fight (1 reports) <a id="cluster-food-fight"></a>

Representative descriptions:
- _Food Fight's ability can't be triggered after activation, even if the ink cost is met_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-13 16:00 | `X8x3lYUD_W` | game-1776095769488-7l0kczj9w | 9 | desktop | Food Fight's ability can't be triggered after activation, even if the ink cost is met |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-moana-kakamora-leader — moana kakamora leader (1 reports) <a id="cluster-moana-kakamora-leader"></a>

Representative descriptions:
- _Moana - Kakamora Leader can only move 1 character to a location_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-13 09:57 | `ZuLbNin-V-` | game-1776073511695-sd2o1tq4u | 14 | desktop | Moana - Kakamora Leader can only move 1 character to a location |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-anastasia-bossy-stepsister — anastasia bossy stepsister (1 reports) <a id="cluster-anastasia-bossy-stepsister"></a>

Representative descriptions:
- _The Anastasia - Bossy Stepsister ability is triggering on the wrong player. The opponent challenged my Anastasia, therefore, they should discard a card. However, I am being prompted to discard, but nothing is availabl..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-12 16:35 | `9FjTqJLJuT` | game-1776011325236-mtgy0exvw | 9 | desktop | The Anastasia - Bossy Stepsister ability is triggering on the wrong player. The opponent challenged my Anastasia, therefore, they should ... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mickey-mouse-brave-little-prince — mickey mouse brave little prince (1 reports) <a id="cluster-mickey-mouse-brave-little-prince"></a>

Representative descriptions:
- _Mickey Mouse - Brave Little Prince had a card underneath it but was taken out with 2 damage even tho it had higher stats because of the card under it. When Scrooge (6 cost that places cards under all cards on board) p..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-12 16:30 | `RowMtVW61b` | game-1776010631486-j4w7myot8 | 18 | desktop | Mickey Mouse - Brave Little Prince had a card underneath it but was taken out with 2 damage even tho it had higher stats because of the c... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-nani-stage-manager — nani stage manager (1 reports) <a id="cluster-nani-stage-manager"></a>

Representative descriptions:
- _The card chosen for Nani Stage Manager is not revealed to opponent_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-11 21:02 | `q95A252WO5` | game-1775940998336-k7elaxgkm | 6 | desktop | The card chosen for Nani Stage Manager is not revealed to opponent |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-donald-duck-flustered-sorcerer — donald duck flustered sorcerer (1 reports) <a id="cluster-donald-duck-flustered-sorcerer"></a>

Representative descriptions:
- _Game ended when oponent hit 20 lore but donald duck flustered sorcerer was in play_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-11 18:37 | `hHytxhmCLp` | game-1775932146959-k6c0gzg39 | 17 | desktop | Game ended when oponent hit 20 lore but donald duck flustered sorcerer was in play |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-swooping-strike — swooping strike (1 reports) <a id="cluster-swooping-strike"></a>

Representative descriptions:
- _swooping strike wont work_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-11 17:01 | `-nLyIyuceY` | game-1775926419104-0f6jm8fn3 | 11 | desktop | swooping strike wont work |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-infra-pink-ultra-scan-specs — infra pink ultra scan specs (1 reports) <a id="cluster-infra-pink-ultra-scan-specs"></a>

Representative descriptions:
- _Infra-Pink Ultra Scan Specs allowed me to play them for 0 ink._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-10 21:48 | `M2Q8dw2Vgz` | game-1775857197799-c941ebkcp | 14 | mobile | Infra-Pink Ultra Scan Specs allowed me to play them for 0 ink. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-lilo-escape-artist — lilo escape artist (1 reports) <a id="cluster-lilo-escape-artist"></a>

Representative descriptions:
- _Lilo Escape Artist is not coming out for 1 ink when Grandmother Willow is out._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-10 03:11 | `vVpRF93nYm` | game-1775790212458-5oh5npnmn | 11 | desktop | Lilo Escape Artist is not coming out for 1 ink when Grandmother Willow is out. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-li-shang-newly-promoted — li shang newly promoted (1 reports) <a id="cluster-li-shang-newly-promoted"></a>

Representative descriptions:
- _Li Shang - newly promoted, starts off with 4 attack rather then gaining 4 attack when damaged_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 20:28 | `My5Mf_ImwV` | game-1775765967813-b49q46050 | 8 | desktop | Li Shang - newly promoted, starts off with 4 attack rather then gaining 4 attack when damaged |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-nick-wilde-persistent-investigator — nick wilde persistent investigator (1 reports) <a id="cluster-nick-wilde-persistent-investigator"></a>

Representative descriptions:
- _During this game, Nick Wilde - Persistent Investigator wasn't triggering the draw when I challenged and banished Cursed Merfolk. The merfolk trigger forced me to discard but I never got the chance to draw one._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 19:25 | `e5raRWjtSC` | game-1775762323221-07b33kzav | 11 | desktop | During this game, Nick Wilde - Persistent Investigator wasn't triggering the draw when I challenged and banished Cursed Merfolk. The merf... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-winnie-the-pooh-having-a-think — winnie the pooh having a think (1 reports) <a id="cluster-winnie-the-pooh-having-a-think"></a>

Representative descriptions:
- _Winnie the Pooh - Having a think should send a card to inkwell ready to be used, not exerted._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 16:38 | `VgBMKxYVeD` | game-1775752343276-tepomty3a | 7 | desktop | Winnie the Pooh - Having a think should send a card to inkwell ready to be used, not exerted. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-kuzco-selfish-emperor — kuzco selfish emperor (1 reports) <a id="cluster-kuzco-selfish-emperor"></a>

Representative descriptions:
- _Played Kuzco - Selfish Emperor from Down in New Orleans and didn't get the choice to put a location or item into the inkwell_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 08:47 | `Ts3raAVPmE` | game-1775723533309-o8eie24ji | 18 | desktop | Played Kuzco - Selfish Emperor from Down in New Orleans and didn't get the choice to put a location or item into the inkwell |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-tod-knows-all-the-tricks — tod knows all the tricks (1 reports) <a id="cluster-tod-knows-all-the-tricks"></a>

Representative descriptions:
- _Tod - Knows All the Tricks : Does not ready when targeted by Item._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 04:31 | `wg7U1b-haq` | game-1775707959571-ll1lo0day | 24 | desktop | Tod - Knows All the Tricks : Does not ready when targeted by Item. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-lady-tremaine-sinister-socialite — lady tremaine sinister socialite (1 reports) <a id="cluster-lady-tremaine-sinister-socialite"></a>

Representative descriptions:
- _Lady Tremaine - Sinister Socialite - Does not let you choose the action from the discard.  You Came Back - Ready's character but does not allow to quest again._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 04:26 | `SHCbpms0Yq` | game-1775707959571-ll1lo0day | 18 | desktop | Lady Tremaine - Sinister Socialite - Does not let you choose the action from the discard.  You Came Back - Ready's character but does not... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-worlds-greatest-criminal-mind — worlds greatest criminal mind (1 reports) <a id="cluster-worlds-greatest-criminal-mind"></a>

Representative descriptions:
- _When a support character quests they cannot support opposing characters (which is desirable with cards like worlds greatest Criminal Minds)_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 03:08 | `bTazTcrM5B` | game-1775703652436-fu27u9b59 | 11 | desktop | When a support character quests they cannot support opposing characters (which is desirable with cards like worlds greatest Criminal Minds) |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-tug-of-war — tug of war (1 reports) <a id="cluster-tug-of-war"></a>

Representative descriptions:
- _The options for 'Tug of War' aren't clear on the UX - it just says "opetion 1" and "option 2" - need to refer back to card to understand what you're selecting._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 02:53 | `D10PvuwV0y` | game-1775702734802-nhdy4vbz7 | 12 | desktop | The options for 'Tug of War' aren't clear on the UX - it just says "opetion 1" and "option 2" - need to refer back to card to understand ... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-wreck-it-ralph-raging-wrecker — wreck it ralph raging wrecker (1 reports) <a id="cluster-wreck-it-ralph-raging-wrecker"></a>

Representative descriptions:
- _Wreck it Ralph Raging wrecker only banished characters 3 strength or less even though he had a card under him when he was banished (total strength was 4, should have banished 4 strength or less characters)_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-09 00:25 | `PC5kfslvxD` | game-1775693498127-0h8j9xnjc | 18 | desktop | Wreck it Ralph Raging wrecker only banished characters 3 strength or less even though he had a card under him when he was banished (total... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-prince-phillip — prince phillip (1 reports) <a id="cluster-prince-phillip"></a>

Representative descriptions:
- _Prince Phillip did not give ward to other Cinderella. Elsa was able to exert her._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 22:17 | `THTW7KxszS` | game-1775686337244-jqvkoee8e | 13 | desktop | Prince Phillip did not give ward to other Cinderella. Elsa was able to exert her. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-royal-guard-octopus-soldier — royal guard octopus soldier (1 reports) <a id="cluster-royal-guard-octopus-soldier"></a>

Representative descriptions:
- _ROYAL GUARD OCTOPUS DOESNT GET +1 CHALLENGE WHEN I DRAW THE FIRST CARD OF THE TURN BUT ONLY WITH DRAW ACTIONS LIKE PULL THE LEVER_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 20:24 | `sOvmo2mjyY` | game-1775679254271-kfnyzl9z9 | 8 | desktop | ROYAL GUARD OCTOPUS DOESNT GET +1 CHALLENGE WHEN I DRAW THE FIRST CARD OF THE TURN BUT ONLY WITH DRAW ACTIONS LIKE PULL THE LEVER |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-tiana-natural-talent — tiana natural talent (1 reports) <a id="cluster-tiana-natural-talent"></a>

Representative descriptions:
- _Tiana -Natural Talent effect is not allowed to be first in the bag to lower attack before under the sea gets played_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 18:53 | `v4JRirgmxr` | game-1775673285204-19phck0z3 | 16 | desktop | Tiana -Natural Talent effect is not allowed to be first in the bag to lower attack before under the sea gets played |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-ursula — ursula (1 reports) <a id="cluster-ursula"></a>

Representative descriptions:
- _Opponent inked for 2, played Ursula - Deciever and 2 1-cost Lady on the same turn_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 18:32 | `_c8Dmjsymc` | game-1775672926268-we3abuf7o | 4 | desktop | Opponent inked for 2, played Ursula - Deciever and 2 1-cost Lady on the same turn |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-maui — maui (1 reports) <a id="cluster-maui"></a>

Representative descriptions:
- _Maui ability triggered when challenging a location and banishing it gave him a action back, this shouldn't happen and should only trigger when banishing a character_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 17:55 | `FPqD8sXb8r` | game-1775670042961-d4zipkeue | 13 |  | Maui ability triggered when challenging a location and banishing it gave him a action back, this shouldn't happen and should only trigger... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-winterspell — winterspell (1 reports) <a id="cluster-winterspell"></a>

Representative descriptions:
- _Can't Boost 3 drop Genie from winterspell_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 16:45 | `YVb2-T9Ri4` | game-1775665921667-srhe1o344 | 19 |  | Can't Boost 3 drop Genie from winterspell |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-eilonwy — eilonwy (1 reports) <a id="cluster-eilonwy"></a>

Representative descriptions:
- _Eilonwy is showing fresh ink on 2nd turn when she was played on turn 1_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 15:16 | `AZezwaKxNW` | game-1775661148919-vtu0khqb7 | 5 |  | Eilonwy is showing fresh ink on 2nd turn when she was played on turn 1 |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-judy-hopps-lead-detective — judy hopps lead detective (1 reports) <a id="cluster-judy-hopps-lead-detective"></a>

Representative descriptions:
- _Judy Hopps - Lead Detective is failing to give other detectives challenger +2. Her ability does work with giving them Alert._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 14:02 | `dfX1hMeWYz` | game-1775656193127-jax8ll5xd | 12 |  | Judy Hopps - Lead Detective is failing to give other detectives challenger +2. Her ability does work with giving them Alert. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-develop-your-brain — develop your brain (1 reports) <a id="cluster-develop-your-brain"></a>

Representative descriptions:
- _Develop Your Brain is getting played for free and ink is not being used._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 13:53 | `noufyNmoFe` | game-1775656193127-jax8ll5xd | 3 |  | Develop Your Brain is getting played for free and ink is not being used. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-lantern — lantern (1 reports) <a id="cluster-lantern"></a>

Representative descriptions:
- _ITEM EFFECT LASTS FOR MY ENTIRE TURN. LANTERN_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 12:57 | `s5iHtSth0t` | game-1775652182913-2dmpvp81m | 28 |  | ITEM EFFECT LASTS FOR MY ENTIRE TURN. LANTERN |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-just-in-time — just in time (1 reports) <a id="cluster-just-in-time"></a>

Representative descriptions:
- _Just In time wont let me play a bodyguard._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 12:22 | `O22urzd6rn` | game-1775650563909-f7uv5vbqb | 10 |  | Just In time wont let me play a bodyguard. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-grab-your-bow — grab your bow (1 reports) <a id="cluster-grab-your-bow"></a>

Representative descriptions:
- _V small thing - AI keeps playing "Grab Your Bow" when there are no relevant targets on the field._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-05 08:29 | `jHzfPivY7P` | game-1775377376218-rhm56xzy2 | 16 |  | V small thing - AI keeps playing "Grab Your Bow" when there are no relevant targets on the field. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-beast-snowfield-troublemaker — beast snowfield troublemaker (1 reports) <a id="cluster-beast-snowfield-troublemaker"></a>

Representative descriptions:
- _Have just played Beast - Snowfield Troublemaker, and system isn't allowing me to challenge, despite Beast having Rush._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-05 05:27 | `B6A8UQ098q` | game-1775366651338-rlm4ovei1 | 3 |  | Have just played Beast - Snowfield Troublemaker, and system isn't allowing me to challenge, despite Beast having Rush. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-piglet-pooh-pirate-captain — piglet pooh pirate captain (1 reports) <a id="cluster-piglet-pooh-pirate-captain"></a>

Representative descriptions:
- _Game Log just displayed "Piglet - Pooh Pirate Captain" in text, when it was referring to "Mr Smee Bumbling Mate". Also it just played "Let The Storm Rage On" again its own character (I only had locations in play). Whi..._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-03 00:37 | `If9Qukp2tl` | game-1775176313602-a6zfxz5xm | 7 |  | Game Log just displayed "Piglet - Pooh Pirate Captain" in text, when it was referring to "Mr Smee Bumbling Mate". Also it just played "Le... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-grandmother-willow-ancient-advisor — grandmother willow ancient advisor (1 reports) <a id="cluster-grandmother-willow-ancient-advisor"></a>

Representative descriptions:
- _Resolving Hades - Looking for a Deal: WHAT D'YA SAY? targeting Grandmother Willow - Ancient Advisor._

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-01 16:18 | `xn1RSLzeE1` | game-1775059762648-lwh15cczb | 18 |  | Resolving Hades - Looking for a Deal: WHAT D'YA SAY? targeting Grandmother Willow - Ancient Advisor. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-keep-the-ancient-ways — keep the ancient ways (1 reports) <a id="cluster-keep-the-ancient-ways"></a>

Representative descriptions:
- _couldn't sing keep the ancient ways_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-01 11:21 | `1A7EdT6kMM` | game-1775040918240-tuf2uu9c2 | 16 |  | couldn't sing keep the ancient ways |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-belle-apprentice-inventor — belle apprentice inventor (1 reports) <a id="cluster-belle-apprentice-inventor"></a>

Representative descriptions:
- _Belle - Apprentice Inventor's "What a Mess" Ability is not able to be used in AI game_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-03-30 22:38 | `uRX_FtOeQE` | game-1774910147675-3nrwblg3r | 1 |  | Belle - Apprentice Inventor's "What a Mess" Ability is not able to be used in AI game |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-hercules-spectral-demigod — hercules spectral demigod (1 reports) <a id="cluster-hercules-spectral-demigod"></a>

Representative descriptions:
- _Hercules - Spectral Demigod Boost ability isnt triggered, despite having a card under him_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-03-30 19:16 | `u7VprYpRx-` | game-1774897961880-9pyerujrt | 6 |  | Hercules - Spectral Demigod Boost ability isnt triggered, despite having a card under him |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### cluster-mickey-mouse-giant-mouse — mickey mouse giant mouse (1 reports) <a id="cluster-mickey-mouse-giant-mouse"></a>

Representative descriptions:
- _Mickey Mouse - Giant Mouse Body guard ability not triggered on play_

Members:

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-03-30 18:48 | `2O5OezOQpe` | game-1774895911955-uvdx9oam9 | 13 |  | Mickey Mouse - Giant Mouse Body guard ability not triggered on play |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


---

## UI / surface clusters (9)

Grouped by the strongest UI keyword in the description (the matcher is loose;
individual reports may belong elsewhere).

### ui-stuck — "stuck" (11 reports) <a id="ui-stuck"></a>

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-13 19:18 | `xph1XkcZxH` | game-1778697006295-rdpclenhn | 13 | desktop | When client times out when on the main menu it takes you back to the last game you played but gets stuck. |
| 2026-05-12 22:34 | `9v2JkWtez8` | game-1778624201176-36im3yh13 | 29 | mobile | The AI opponent got stuck trying to resolve the effect of a card |
| 2026-05-04 18:56 | `7it6F33kpb` | mgsplOxjTRsAW2SCgRt8qsh |  | desktop | I have altered hand and I get stuck in the " my turn" phase unable to ink or have opp. alter hand. |
| 2026-04-30 18:15 | `VcqisEEhpH` | mgwPG5vx22Xqka8I64etKMu | 10 | mobile | match gets stuck after questing with big Woody and after the Let’s Get Movin’ ability triggers. I draw a card and the system automaticall... |
| 2026-04-28 18:08 | `-9_mSPwnII` | mgmyImBOs3VIdRoX_HM5HIW | 8 | desktop | Got stuck on Clarabelle's (1 drop) effect. It said I had an action pending but it never let me deny or allow her ability. |
| 2026-04-27 01:05 | `Tc7_nNme_O` | game-1777251518967-l951dzvhc | 7 | desktop | Anytime Ai plays a booster card it doesn't play the ability and times out. Then you're stuck in the game and can't exit. |
| 2026-04-25 06:56 | `3c36uevQNU` | game-1777099678477-x51rg7xxg | 11 | desktop | Cant confirm/deny Bambi effect after questing with 0 cards under Bambi. Stuck at screen and cant pass turn. |
| 2026-04-25 04:41 | `WgiEtkoeO0` | game-1777090761008-pi9b3yn52 | 19 | desktop | Leviathon appearing to have issues.  my opponent is stuck on it. |
| 2026-04-24 23:54 | `0kR94Bq_AY` | game-1777073973234-ycdvgx9iz | 18 | desktop | Clarabelle 7 stuck again after I pass |
| 2026-04-24 23:34 | `8YX0q0g_u4` | game-1777073184340-re4m7kyd6 | 13 | desktop | Clarabelle 7 ability not allowing me to pass turn when I do not draw cards... just stuck |
| 2026-04-08 17:43 | `fI7CZ24AVa` | game-1775669185813-151qgzfuh | 14 |  | When the opponent drops the game I get stuck in a loop where the game doesn't end and I can't leave to the main menu without waiting fore... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### ui-disconnect — "disconnect" (8 reports) <a id="ui-disconnect"></a>

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-15 21:12 | `WCA7-p-SRv` | mgnBuie6PjoFJBnxnHkeoNR | 13 | desktop | Game disconnected me.  Have internet and everything |
| 2026-05-14 02:07 | `pBjVShP3Ei` | mgPaPRgUqCjG9u-KsOijIDi | 21 | desktop | Can't drop opponent who disconnected. |
| 2026-05-12 14:06 | `FqkHWbTmNQ` | mge-riP698kYEVvNcgP5pVA |  | desktop | Ranked game. Opponent disconnected after game 1 and it won't let me drop them. It states that Drop is not valid in the current game state... |
| 2026-05-12 10:56 | `rN6yJSXf_Q` | mgbJ9J7MVl78gVgV_pLywa3 | 10 | desktop | The app says my opponent disconnected and suggest if  I want to claim victory. But he is still playing and online. The overlay however ma... |
| 2026-05-11 15:24 | `eL9gi5zF4o` | mgoJqAVYrxNzsYqFHZ1cuje | 18 | desktop | disconnected after singing you've got a friend then attempting to sing akood et |
| 2026-05-04 22:04 | `j4Qlks0LZz` | mgetbxS1Ja_fJNHgWSVstay | 17 | desktop | My opponent made a mistake and instead of undoing the action, they just disconnected, now the app wont let me drop the player. |
| 2026-04-19 21:47 | `6kQkAc0NOh` | game-1776634994908-f7vrvo79n |  | desktop | did the opponent really drop? I'm trying to complete and move on but says conditions not met to drop, even if in game it shows player dis... |
| 2026-04-12 11:35 | `l8tjaxP8dU` | game-1775993492198-lofofmlm0 | 5 | desktop | It keeps me disconnected from the playboard, i can do everything except use the boarded cards, challenge for example |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### ui-click — "click" (8 reports) <a id="ui-click"></a>

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-05-12 14:47 | `4kVrqlfBYr` | mgm1zO1gKp3LG2cxyibT6G8 | 18 | desktop | when cards are played, they show up on the screen too small to click on for challenges or actions |
| 2026-05-02 19:51 | `cUWkxxEuRf` | mgV11NvKM-JNYhcRlF4w9GK | 18 | desktop | Cannot click some cards because the status stay in front of them |
| 2026-04-28 22:41 | `FU39KKi2zj` | mgXDbrvO1EuTmggOIgH7YqH | 18 | desktop | doesn't let me click on anything to resolve webby's diary |
| 2026-04-28 01:06 | `JYShXbpHep` | mglv6ylt8Zvu0-U0MhTyIQb | 12 | desktop | Cards show up small, can't click on them to activate challenge |
| 2026-04-23 20:49 | `KX8KKQiznH` | game-1776976724569-zzz2to4p8 | 12 | mobile | I have Pluto in play. I just played a Steel character, so the game is asking me to select an item to banish, but the game wont let me sel... |
| 2026-04-08 13:35 | `HW3-vsDn5P` | game-1775654765778-u7bij13vr | 11 |  | Opponent's character has an ability: I have to banish one of my characters. I had multiple characters available, but I was only offered a... |
| 2026-04-05 03:49 | `qm0y_qPm8c` | game-1775360545215-omloyg680 | 17 |  | it says i have lost authentication but is letting me play. I just cant click on my played cards to challenge or use abilities |
| 2026-04-02 18:09 | `kHYZuBySdc` | game-1775152705419-wykzwtrww | 12 |  | How the heck do you even do anything thing? This new UI is so confusing I cant even make a move or finish my turn. Im having to quit game... |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### ui-skip — "skip" (2 reports) <a id="ui-skip"></a>

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-29 10:02 | `ote85r8c7S` | mgVvOmoUNfjqFBAha8QG7-R | 17 | desktop | I used a boost effect with Webby's diary in play but had no ink to pay for it. i couldn't pass turn or skip the effect |
| 2026-04-12 03:53 | `TSXR3nd2IO` | game-1775965296356-n3a4ikyzo | 13 | desktop | Wouldn't let me pass turn after questing with emerald John Silver. Opponent had an empty board so I couldn't resolve or skip his effect |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### ui-button — "button" (2 reports) <a id="ui-button"></a>

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-08 17:30 | `oAKe9wL72P` | game-1775668994473-tq2lif669 | 7 |  | The "pass turn" button disappeared even with several refreshes. I was not able to do anything but concede. |
| 2026-04-08 16:28 | `WmJqRStfFB` | game-1775664376775-fdtra4zkq | 27 |  | My opponent drop without conceding gamen, I push drop button but nothing happen. I can't go out from match, only closing the window. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### ui-kicked — "kicked" (1 reports) <a id="ui-kicked"></a>

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-27 03:49 | `1OAKXJQAAl` | mg46bmfhHeLXq4pw-id82kj | 23 | desktop | doesnt work.. it kicked us both out of the next match, for game 2 |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### ui-loading — "loading" (1 reports) <a id="ui-loading"></a>

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-16 18:45 | `jrKmrLFpib` | game-1776364952560-iav7ps8cu |  | desktop | When loading into the next match for BO3 it will not take you to next one without refreshing screen. |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### ui-tap — "tap" (1 reports) <a id="ui-tap"></a>

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-16 06:56 | `HAxo8P18rp` | game-1776322376250-pxzzkaprh | 9 | desktop | I cannot quest individual characters by tapping on them |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


### ui-reconnect — "reconnect" (1 reports) <a id="ui-reconnect"></a>

| Created | id | gameId | turn | platform | description |
| --- | --- | --- | ---: | --- | --- |
| 2026-04-14 21:03 | `e9iucsYrqh` | game-1776200050913-teuljdo28 | 11 | desktop | Opponent dropped but client says they have reconnected and dropping them isnt a legal action |

**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`


---

## Singletons (558)

Reports without an automatic card cluster. Pre-grouped by state. For each one,
record either the matched card (so the next pass can cluster it) or tick
`Not reproducible`.

### singletons / question-or-comment (21)

| Created | id | gameId | turn | description | Card? | Decision | Notes |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| 2026-05-14 19:21 | `rwlpiUgEY4` | mgcl0uaNVhUY8Fl9cLVjGJx | 13 | i quested B.E.N. but am unable to give his support to tipo??  thank  you | _____ | _____ | _____ |
| 2026-05-13 05:43 | `1caGEbeedS` | mgM4HJ8dIZz7AVm7THK0PAM | 17 | shouldnt mrs.icredible be able to re ready herself off the banish? | _____ | _____ | _____ |
| 2026-05-09 22:25 | `Fp6UpMtbWJ` | mgRulPifyVCJ8QzcQsJqjn2 | 12 | He didn’t play 2 card so how did he got the 4th lore. Could you fix those type of things its kind of frustrating | _____ | _____ | _____ |
| 2026-05-06 16:19 | `tA8BHO8qrM` | mgiV5YhaJaZ31S4MayoKbGP | 8 | server lag ? | _____ | _____ | _____ |
| 2026-05-06 16:02 | `pJRKaPw8WM` | mgTRuaDQ3LpoXZvJ9sWtfaV | 12 | I believe Sid is broken. I have had 2 opponents not make moves after I played him. I'm not sure why they can't select a character to banish. | _____ | _____ | _____ |
| 2026-05-01 13:49 | `9KzISA2zVW` | game-1777642558079-jgggijnur | 19 | Cards are too small to select after adding support. How do I enlarge the cards in the playing area? | _____ | _____ | _____ |
| 2026-04-27 16:21 | `Fzftb_3rwG` | mgmjxsLV1v0kIjnUU1h57_Y | 9 | Pluto has damage on him yet when i attack him it still says he has 5 strength?? | _____ | _____ | _____ |
| 2026-04-22 04:47 | `jYoNupb3YE` | game-1776832473642-ucbvlkgxi | 24 | all charecters vanished on both sides, they did not play any actions and i should have won my following turn, i still won but why did all... | _____ | _____ | _____ |
| 2026-04-21 18:24 | `O4YsORScjf` | game-1776795245233-80wjqxmiv | 12 | When questing with Pocahontas (Amethyst 2) it lets me choose Flinheartt (Emerald 2-3?) even  although it had Ward | _____ | _____ | _____ |
| 2026-04-18 18:21 | `JCbdHh-TG6` | game-1776536122673-1p3kh7wt5 | 11 | How did i löss? | _____ | _____ | _____ |
| 2026-04-09 16:03 | `R9Yn1Qtx5P` | game-1775750357985-ckxj1oxmu | 7 | Can't figure out how to boost | _____ | _____ | _____ |
| 2026-04-09 08:15 | `PWHMtOItng` | game-1775721645843-2ifcoo4wm | 21 | game history isn't shown on the side, don't know how some cards were removed from my field | _____ | _____ | _____ |
| 2026-04-09 07:12 | `c2TzeaV9od` | game-1775717778998-cte455ktb | 17 | u cant even boost and this is supposed to be the new version? | _____ | _____ | _____ |
| 2026-04-09 03:11 | `-ebQmh6jL_` | game-1775703268945-jr9isp9pl | 16 | Tried to play Chief Powhatan with 5 ink available. When it asked how do I want to play him exerted or ready neither option worked. Was fo... | _____ | _____ | _____ |
| 2026-04-08 18:56 | `B7TtrpztZu` | game-1775674246675-l4ok7bqga | 13 | when I play a card its not subtracting how much ink it had cost to play that card. Honeymarons ability is not activating correctly giving... | _____ | _____ | _____ |
| 2026-04-08 16:27 | `ZOOTUkrJpa` | game-1775664994321-vyyg34pto | 11 | Used discard option on Anna, and I think my opponent can't select? | _____ | _____ | _____ |
| 2026-04-08 15:08 | `4pxEu_KkcG` | game-1775660671080-kiat7ywxu | 5 | On turn two my opponent on green blue played two sails and then two donalds??? | _____ | _____ | _____ |
| 2026-04-08 14:33 | `KwI3FCTgU8` | game-1775657239206-h989foabk | 42 | Turn before my last turn, my ink doesn't count down, so I can use 13 ink every time. I don't know how many ink use so I pass my turn caus... | _____ | _____ | _____ |
| 2026-04-08 13:45 | `5hG4zoGwVq` | game-1775655124896-9j9wfxe4r | 14 | How to boost? Cant get my guinie to boost | _____ | _____ | _____ |
| 2026-04-08 12:37 | `x5KhWQEVoN` | game-1775651476007-7djqg8ewc | 10 | Alice - Savvy Salior bonus for questing not implemented, yet? | _____ | _____ | _____ |
| 2026-04-06 19:06 | `q54-vOesvo` | game-1775502273964-ofs2o24xq | 2 | I cannot selecct the cards on my side of the game because a banner appears stating that my session has expired. This appears since the be... | _____ | _____ | _____ |

### singletons / needs-card-identification (534)

| Created | id | gameId | turn | description | Card? | Decision | Notes |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| 2026-05-14 20:46 | `-bpJ9lhlDp` | mgn4SfO0SUd_l2oKcNTOMPx | 18 | Opponent was able to kill some of my characters and there was no indication to me how. Reading the playback was no help. | _____ | _____ | _____ |
| 2026-05-13 21:00 | `lUZi7DfHvy` | mgJZjM5KLd00oPe84mVTvJS | 21 | Die familie zerstört. es wird nur eine karte weg gelegt.... | _____ | _____ | _____ |
| 2026-05-13 08:23 | `7WjMaGXelc` | mgN-_r5OD8WLuRGI6EG6g6s | 12 | I believe my item was not working properly. I was drawing cards instead of putting them on my inkwell facedown and exerted. | _____ | _____ | _____ |
| 2026-05-13 02:02 | `dZFjUt-L41` | mgr6P86JasrerIk63LmIYy9 | 12 | the drop opponent wouldn't work | _____ | _____ | _____ |
| 2026-05-13 00:48 | `lxzM7XRTrd` | mgvSigBMxNwlHXtUIRkJhcW | 11 | I had a character with bodyguard and they challenged a different character first | _____ | _____ | _____ |
| 2026-05-13 00:22 | `Id8-e2nBJa` | mgwvlFqR0TNDtdrHmaBnNRl | 21 | The strength on my characters is not correct | _____ | _____ | _____ |
| 2026-05-12 20:18 | `Wk6FllHHLl` | mgdgIPSjdxCtHYJ-alct46a | 8 | It is not dropping the other person when I request the game to end after their time has run out. | _____ | _____ | _____ |
| 2026-05-12 20:09 | `gU29jn-xZn` | mgtbvglCC5WjmgwBiIHcoLe | 15 | error out | _____ | _____ | _____ |
| 2026-05-12 00:41 | `lNJWd3so6v` | mgYeTviuiHU1pNzVB5rM-0I | 16 | opposing character didnt quest when it was required through the song | _____ | _____ | _____ |
| 2026-05-12 00:11 | `4ihGLY9hAC` | mgu06cW1-zkhrSkhj_itftT | 18 | I can not see the cards to challenge and boost. I can not see the cards played | _____ | _____ | _____ |
| 2026-05-11 23:15 | `updFGzY9v_` | mgDe11IVVYkqbIzFAm44VNB | 16 | Legendary Lusia effect didnt trigger properly but still took the ink for the pay effect | _____ | _____ | _____ |
| 2026-05-11 22:45 | `hEIS0IYWgB` | mgxQKpcsESH1IlR6gJezTrN | 16 | the tianas affect didnt stack | _____ | _____ | _____ |
| 2026-05-11 22:02 | `cs7qn2syGe` | game-1778536492746-3qfzwtpve | 17 | The Wyvern Castle card is glitching when more than one character is placed in the area; it prevents you from selecting cards within that ... | _____ | _____ | _____ |
| 2026-05-11 21:54 | `g9ohorZBHs` | game-1778536436214-jk98ahjy1 | 2 | The Wyvern Castle card is glitching when more than one character is placed in the area; it prevents you from selecting cards within that ... | _____ | _____ | _____ |
| 2026-05-11 21:54 | `y5nMoZ9dOp` | game-1778536436214-jk98ahjy1 |  | The Wyvern Castle card is glitching when more than one character is placed in the area; it prevents you from selecting cards within that ... | _____ | _____ | _____ |
| 2026-05-11 21:50 | `IfDsbdsXvS` | mgs-fEhXUTNuzHTYncwDbr1 | 20 | I banished someone in a challenge while being in the location "Island of Nomanisan" and i couldn't deal 2 extra damage to another character | _____ | _____ | _____ |
| 2026-05-11 20:01 | `zrhByvHuai` | mgr28w3G-O2R-iebFfKWICu | 8 | Hjo | _____ | _____ | _____ |
| 2026-05-11 19:41 | `9V-jHn33Bk` | game-1778527857624-yvcowfty9 | 13 | Anna trusted sisther we can do this together ability not resolving | _____ | _____ | _____ |
| 2026-05-11 17:39 | `yi4VHkdRtp` | mgU3MaU71jTpMZMGX3b84P_ | 19 | Non vedo i punti lore | _____ | _____ | _____ |
| 2026-05-11 13:57 | `MTPx9-dQSv` | mg9AlUebh3tiEYNdMtAHGBG | 10 | Tamatoa did not bring my item from discard! \ | _____ | _____ | _____ |
| 2026-05-11 11:55 | `-WbMJZU5zO` | mgR9j7x8S-Nizw_gucxuq5H | 17 | melicious means with marida damaged both chracters with her ability | _____ | _____ | _____ |
| 2026-05-11 09:36 | `KVHBJ9valQ` | mgWoSbpOcTYBqj4xdrqLkP7 | 4 | alma madrigal doesnt trigger | _____ | _____ | _____ |
| 2026-05-11 08:54 | `Za2FCUNoLK` | mgcqfMaPt693-O_WTq0QM-Y | 10 | chica not drawing | _____ | _____ | _____ |
| 2026-05-11 02:24 | `nQQ7jpQvCM` | mgG0xsnLWwValKEjUGwNjag | 7 | Montory Jack cant quest by himself if he has more than 4 hp | _____ | _____ | _____ |
| 2026-05-11 00:02 | `QYPlBUSXIC` | mggZFE2o6RlWwQhPk-nVE2- | 10 | card 78 set 12 - Clever Swordsman does not activate the trigger to come in exerted to deal damage to damaged charcter :( | _____ | _____ | _____ |
| 2026-05-10 23:48 | `AffX46UWdG` | mgUF-bEZHFUubj7W_kI1sRx | 11 | Hamish, Hurbert, and Harris Making Mischief I can't trigger the may enter into play exerted abilty | _____ | _____ | _____ |
| 2026-05-10 19:29 | `EtgO1VXRAx` | mg37LGBolUxmU6pEYCTv2YA | 4 | I can't select the cards to put in my inkt | _____ | _____ | _____ |
| 2026-05-10 18:19 | `xvtGxGbUtg` | mgRk_G79quAOaNXtq_2-tWE | 12 | ma chity | _____ | _____ | _____ |
| 2026-05-10 14:57 | `lASbzgkeJI` | mg9j314kJ9CcwSiBsKF-l8p | 13 | Discard was shaking most of the screen when I hovered over it. | _____ | _____ | _____ |
| 2026-05-10 12:42 | `B81_iRfCF4` | game-1778416111958-74c6vzn2w | 14 | When I try to move a character to a location, I can't scroll without deselecting them so it won't let me move any characters. | _____ | _____ | _____ |
| 2026-05-10 11:41 | `t5fm0eVi8-` | mgaF7w2yZCENvbDmMGyoQrw | 11 | location lore doesn't ping at start of turn | _____ | _____ | _____ |
| 2026-05-10 04:29 | `Yp_VK0E5OA` | mg4UpegabxoiBub_1EM-zFJ | 14 | I do not like to new lorcanito. It is not user friendly | _____ | _____ | _____ |
| 2026-05-10 04:21 | `WQt0n5Qv7P` | mg2DNpmgrIsxWljcGWOmLeI | 16 | Would not let me look at discard. Would not let me ask to take back move. | _____ | _____ | _____ |
| 2026-05-09 16:53 | `CpoMQYhIV_` | mgvEMPyZ6MRceOALTF7uJIm | 14 | Couldn't play the top card with kristof's luth | _____ | _____ | _____ |
| 2026-05-09 11:54 | `G0C-OGUVnn` | mg3AoSAThW7MxCp2S0vVBN6 | 12 | 4 ink open and 2 grandmothers. game wont let me cast lady for 5 (3 with reductions) | _____ | _____ | _____ |
| 2026-05-09 11:11 | `b6G3YorZq4` | mgQL1NFhYq_6HeWRdbmwOST | 12 | help!!!!! lore (0) | _____ | _____ | _____ |
| 2026-05-09 04:27 | `XLu-q0Xy1O` | game-1778299980853-wppscxkia | 17 | Não consigo clicar em um personagem com muito efeitos para fazer missoes ou ativar suas  Habilidades | _____ | _____ | _____ |
| 2026-05-08 15:57 | `rPf19Bo420` | mgOHDgI0QtKNC7NV7cPFeSZ | 4 | he played a 4 cost card with only 1 ink | _____ | _____ | _____ |
| 2026-05-08 01:32 | `cDfImgIRAI` | mgS6tYDUtYjyOkuVqy3Fqxu | 16 | Cannot pass turn | _____ | _____ | _____ |
| 2026-05-08 01:18 | `uvSwzLcp2v` | mgVV4wSE0hI9DOmL4WRTBPh | 11 | Was unable to continue game because I was unable to banish a character as a result of sid effect | _____ | _____ | _____ |
| 2026-05-07 17:01 | `s6C9LvUgLz` | mgpnGLUYgqbRXAvUnDrbhxz | 23 | can’t use my discardpile on iphone | _____ | _____ | _____ |
| 2026-05-07 16:46 | `Krc1blU4pJ` | mgxQ7vgrfUut3Y9gIF7q_nZ | 16 | can’t switch to next game on mobile | _____ | _____ | _____ |
| 2026-05-07 16:38 | `xaO31LHtJL` | mgQSeXqKSCORe-KcbUohmk2 | 11 | ant resolve side effect | _____ | _____ | _____ |
| 2026-05-07 12:28 | `dkxJI0n4RG` | mgy-zaEax_PwWb4Zr5-ps24 | 13 | Whenever I play Sid and activate his ability, the opposing player seems to not be able to select a target and choose a character to banish | _____ | _____ | _____ |
| 2026-05-07 11:39 | `p5g7lWw0CP` | mgdBZ-8ntGDHhGCOr0iSper | 7 | dingy again | _____ | _____ | _____ |
| 2026-05-07 11:33 | `3u1aT9rOEj` | mgG3KyekBtj4tuomO5JIKME | 6 | The dingy effect blocked me (could not confirm) | _____ | _____ | _____ |
| 2026-05-07 11:31 | `0atvMpxYz1` | mgG3KyekBtj4tuomO5JIKME | 6 | can't confirm | _____ | _____ | _____ |
| 2026-05-07 10:22 | `Prt0OE2Q8n` | mgDp87VW1Ju6zA0AQt0ACZA | 3 | Games just keep ending after 1 or 2 turns. | _____ | _____ | _____ |
| 2026-05-07 09:48 | `noeK9vz_K3` | mgoWsKJxynnAdUeAoqsfB8n | 11 | PLAYING KING UNDISPUTED SEEMS TO BE UNRESOLVABLE AND LEADS TO EITHER TIME OUTS OR THE PLAYER UNABLE TO CHOOSE A TARGET FOR THE EFFECT, WH... | _____ | _____ | _____ |
| 2026-05-07 04:53 | `gHQg44ttrJ` | game-1778128600248-3urnczxn4 | 23 | Quando o personagem tem 3 bolinhas enbaixo da carta eu não consigo encostar na hit box dele, não consigo seleciona-lo | _____ | _____ | _____ |
| 2026-05-07 03:08 | `wAK0TLvM13` | mgXPf21IxDzCbxz6DjHMMeD | 17 | can't select my character for sid's edict effect | _____ | _____ | _____ |
| 2026-05-07 01:51 | `cuJcR4ruW5` | mguZgTANWsNipJZxXa7CzeK | 14 | SID ability does not allow you to discard a card and resolve trigger. it has happened twice now. hope this helps | _____ | _____ | _____ |
| 2026-05-06 23:43 | `mJz3c9xjw3` | game-1778110484245-fh2u2zdmt | 13 | Shows my Life as 3 when I won. | _____ | _____ | _____ |
| 2026-05-06 23:03 | `qvrbwVr-Eh` | mgMivrDHbSLdTP7l_7gyLj2 | 19 | cards are incorrectly mapped going to the Ink as displayed in Log. I put a Tipo it says in Log is visions of the future | _____ | _____ | _____ |
| 2026-05-06 21:20 | `8Gyxe8JMXG` | mgi4Zm7u-xTzk3W2XffTBPS | 16 | Sid istn working | _____ | _____ | _____ |
| 2026-05-06 20:17 | `m2o8BkLUiY` | mgBeZdweGaMhYYCgoKVVbvE | 10 | cant confirm banish off sid | _____ | _____ | _____ |
| 2026-05-06 19:04 | `KxW7BurcuZ` | mgryiMCFSbGzchSX32Fcv_3 | 15 | Not letting me confirm | _____ | _____ | _____ |
| 2026-05-06 18:57 | `I5eSp-gY0t` | mg3VB1Ebgvca2BiWT_DJGwA | 11 | After playing Sid i cannot select a character to banish and cannot progress the game | _____ | _____ | _____ |
| 2026-05-06 18:44 | `zrxP2fz1lQ` | mggyw402wTfooezQiw4tiJI | 9 | i chose effect but cant confirm | _____ | _____ | _____ |
| 2026-05-06 18:33 | `NtYyKbBiP-` | mgh91fh40U6K7v4wE6r0oTG | 15 | Could not properly fulfill the Character banishment requirement when opponent played Sid Phillips. | _____ | _____ | _____ |
| 2026-05-06 18:23 | `zNRX52rj_F` | mg0h1mZtNduEV7glMNLVoxV | 13 | I could not select a card to banish after I banished leviathans lair. | _____ | _____ | _____ |
| 2026-05-06 18:15 | `fWH9_l0ZWw` | mgubX6XsysJtGVwXviCj86L | 14 | Can't choose a character to banish | _____ | _____ | _____ |
| 2026-05-06 17:59 | `Zb9F86Y4W_` | mguoi6xj7-R08QFHyxpHUtD | 10 | lol cant take a target from the new sid phillips. my opponent play him i cant cant confirm a target... i lost in time then... | _____ | _____ | _____ |
| 2026-05-06 17:18 | `-SRr4_1tmQ` | mgSJcf5dw5F2-UkwiY_co5a | 11 | syd philips - to surgeon is not working, I couldnt choose a character to banish | _____ | _____ | _____ |
| 2026-05-06 16:20 | `_-3bvogAAJ` | mgiV5YhaJaZ31S4MayoKbGP | 8 | I tried to select a character to banish and it wouldn't let me choose and confirm | _____ | _____ | _____ |
| 2026-05-06 14:12 | `qopmuV0aEy` | mg3gMZZAsEp1WC5EXPggc4R | 14 | lore (0) please help!!!!!! | _____ | _____ | _____ |
| 2026-05-06 14:07 | `5M9EhwaPea` | mg-urf3o3fdV9GDoHu6yTKQ | 7 | I played two sapphire coils and only one showed up. So I could not play my Scrooge for free. I will lose now. I am very unhappy. | _____ | _____ | _____ |
| 2026-05-06 12:51 | `rju9QP7Mh_` | mgn7OufXSEREMr9k0IAux-X | 13 | Dinky ability after select the target it doenst advance | _____ | _____ | _____ |
| 2026-05-05 14:57 | `FOFFGvoFL_` | mgI8fzTRCoxgHijpydCygtQ | 7 | Issues with sugar rush locations effect. Can't apply it. | _____ | _____ | _____ |
| 2026-05-05 13:59 | `J5LhCAwI3r` | game-1777987133548-82pczj0bl | 16 | the bot wont stop thinking | _____ | _____ | _____ |
| 2026-05-05 12:20 | `ujtwYaEd8A` | mgQ-AhL6NAyskAWhJtbEAFL | 10 | Chief Bogo won't play the character for free | _____ | _____ | _____ |
| 2026-05-05 12:11 | `LXib4WYUsw` | mgHVDxjsffC5O9uJq_LNIZo | 18 | I attack with mirage on judy hops but only do 1 damage, the resist would only be on my opponents turn | _____ | _____ | _____ |
| 2026-05-05 01:42 | `AK_LvXx7xq` | game-1777944966129-39zegbp4y | 11 | cards are tiny and my characters won't ready despite no effects that would cause that. | _____ | _____ | _____ |
| 2026-05-05 01:40 | `Pk5G-OwTVk` | mgzMW-DrA1uiON3136ynJiX | 17 | the preview popup in the  top left corner sometimes wont go away on its own.  it pops up and stays until i close it.  even after a game h... | _____ | _____ | _____ |
| 2026-05-05 01:01 | `mMgL0D2SB9` | mgTKa6tSiTNrfnLtFzg0Clq | 22 | Second star doesn’t work still | _____ | _____ | _____ |
| 2026-05-04 20:09 | `3nMgRUmZUC` | mgGHnju-0T586XnWWINxqeO | 7 | Fix your shit | _____ | _____ | _____ |
| 2026-05-04 18:44 | `Cln3LBwfkS` | mg4ZokjXM1un7mK0o6IU3gv | 32 | lore (0) not level hup | _____ | _____ | _____ |
| 2026-05-04 18:05 | `V7UbMAaYcc` | mgN2XLaVqBwusicylKTT2yK | 7 | Lady's effect isn't working properly. | _____ | _____ | _____ |
| 2026-05-04 17:58 | `caTGOt1u33` | mgHzk_0KJdfKXJ9WM2B4vfZ | 31 | i don't look my lore (0) | _____ | _____ | _____ |
| 2026-05-04 12:51 | `94Z2DAy7oA` | game-1777898639162-y7w5buh2i | 17 | Problem on mobile when you have more than 3 charaxters on a location to choose then | _____ | _____ | _____ |
| 2026-05-04 11:16 | `ffcZmXTZOg` | mgfd2oCB3yNyfaLcvX-PDzr | 19 | The match was totally hacked, i was playing triyng to win anyway but in every turn opposing player did something to change the stats on t... | _____ | _____ | _____ |
| 2026-05-04 03:12 | `-t0e3WqzB4` | mgyHhzLm8E1xyyrdaF4R7VY | 13 | Woody's ability would not resolve | _____ | _____ | _____ |
| 2026-05-04 02:56 | `b9X9SZyKHA` | game-1777862580038-b5dyt00xd | 15 | The computer did not make next move and went over time when i tired to drop opponenet it wouldnt work and i had to concede myself | _____ | _____ | _____ |
| 2026-05-04 01:58 | `MiXHliwgNf` | mgdkltZFv1nNjpdIoai9shP | 13 | There is a glitch when you quest 5 cost Woody. When you play Rex with Woody's ability it doesn't give you the option of putting him exert... | _____ | _____ | _____ |
| 2026-05-04 00:43 | `jKg7cxD0St` | mg1SMoKEqtmAqsZZRARdsKz | 17 | I drew RC car when I quested with Woody the Jungle Guide.  I am now unable to make any play other than to concede the game.  There is sti... | _____ | _____ | _____ |
| 2026-05-04 00:40 | `_YQdUa96zC` | mg_FynVYWxv8JwSRxEGsaFt | 13 | Woody Legendary Set 12 trigger didn't pop up to be resolved. Had to refresh to be able to resolve the trigger. When trying to play a char... | _____ | _____ | _____ |
| 2026-05-04 00:03 | `Rz_7-O-Bi7` | mgFcZEisgjp-b1jEHxKoH0z | 12 | It wont let me resolve woody's ability. This is the second game in a row it wont let me, | _____ | _____ | _____ |
| 2026-05-03 20:14 | `gEaoV3G-Nw` | mgTMrikf-f1FzV6EXS_5fUU | 5 | Cant play a 2 cost character for free when questing woody | _____ | _____ | _____ |
| 2026-05-03 18:59 | `nS1X4aWHnm` | mgd_FpqdZZjbp7MrKhdMynu | 7 | Using Woody Legendary effect playing Character with 2 or  less for free doesnt work | _____ | _____ | _____ |
| 2026-05-03 16:29 | `LTllgDIq32` | mgTw59Lvsgxfp6-jwywSReY | 7 | Not allowing me to use sugar rush start line ability to move locations | _____ | _____ | _____ |
| 2026-05-03 16:01 | `keo4fwiTvW` | mg2HY3wUsH8YNO1m7kAuEjz | 11 | woody can not summon woody | _____ | _____ | _____ |
| 2026-05-03 00:58 | `nS1xCgNZv2` | mgIw-HyFb8vqKbI9YzKpf3Z | 11 | it won't let me select 2 cards to rush | _____ | _____ | _____ |
| 2026-05-03 00:07 | `KY-SNCsjiD` | mggoODdemEc7mS3jMINg-zs | 14 | the locattion cant be challengurd | _____ | _____ | _____ |
| 2026-05-02 23:59 | `PIiVrxwUZi` | mgyZOdd_ZdUZmgwBq-35iDq | 10 | i cant challengue the location so y loose all my time of the turn | _____ | _____ | _____ |
| 2026-05-02 23:58 | `Mkl-DN3krs` | mgyZOdd_ZdUZmgwBq-35iDq | 10 | i cant challengue the location | _____ | _____ | _____ |
| 2026-05-02 23:55 | `ODnsxm9Ew4` | mgyZOdd_ZdUZmgwBq-35iDq | 8 | i cant attack the location | _____ | _____ | _____ |
| 2026-05-02 22:59 | `PBhLIkKDia` | mguG9ZfRzaTs5g2Pv7NpBgt | 22 | Both You've got a Friend in Me and the Woody that let's you search for other toys don't reveal the cards that are put into the hand, even... | _____ | _____ | _____ |
| 2026-05-02 21:14 | `a4df-d6RGy` | mgwgFY-S88Ps7kIBrCnI1ty | 26 | Can't see/access more than 4 items in game. | _____ | _____ | _____ |
| 2026-05-02 19:44 | `LJTDsRBFOS` | mgbZSc6Ci7UJPiVtqwiHbtN | 5 | My woody doesnt give the option to challenge | _____ | _____ | _____ |
| 2026-05-02 18:13 | `efjxeJz5do` | mgNo8cdSdSL-Fo2JIdHYgTH | 21 | Gadget's ability isn't giving lore pip bonus to everyone with support when plane is in play | _____ | _____ | _____ |
| 2026-05-02 16:57 | `CvxmK3C1eP` | mg8HTquEYHsYR0abOafzCeJ | 19 | The cursor isn't always able to choose a certain card | _____ | _____ | _____ |
| 2026-05-02 15:41 | `BORB7ORcQ8` | mg1DhA7TTMkDkxFWi37hK_Z | 25 | lore est toujours à 0 même si je quête | _____ | _____ | _____ |
| 2026-05-02 15:20 | `XGd5Pa4C6-` | mgSz5EbPfJ_Hs7sPGebLn5I | 17 | While using Ham's ability to reduce a 3 cost character to 2, it wouldn't trigger Jessie's ability to allow me to reduce an opponents stre... | _____ | _____ | _____ |
| 2026-05-02 10:56 | `ru8CvwDvBR` | mgnRobTJ1eNmU_mclv8digA | 8 | Grand mother Fa spirited elder effect persists "until the start of your next turn" instead of "this turn" as written on the card | _____ | _____ | _____ |
| 2026-05-02 08:02 | `PRuVDODzdC` | mgNVIV_BbfIgWpPRzMtZeLC | 26 | I can draw cards even without sacrificing an item | _____ | _____ | _____ |
| 2026-05-02 00:27 | `ir-_t7Jor3` | mgwaHCdv4E7K1NV-0GFRVwZ | 16 | slushy got boosted to 8 strength with ruby champion on the board and only quested for 1 instead of 2 | _____ | _____ | _____ |
| 2026-05-02 00:02 | `5h5wCWeV03` | mgQ6aLgRFidabG1HiF9Jck1 | 20 | I just banished a character with Ms. Incredible, so I should be able to ready any Super charavter including her. But it wont let me ready... | _____ | _____ | _____ |
| 2026-05-01 21:30 | `4I7wUa-3-h` | mg2RJg1_NMIhAuY2kt4rlZL | 14 | You've Got A Friend In Me does not reveal the toys chosen. | _____ | _____ | _____ |
| 2026-05-01 19:40 | `MiPfAlwM2e` | mgSjzIe-yWIsIWl3diMmlS7 | 6 | Not revealing the character card drawn from the top of the deck for 1 cost Daisy Duck's questing ability | _____ | _____ | _____ |
| 2026-05-01 19:22 | `bY3LdHW6PX` | mgV3YrMzppuv7VrXijgNF8F | 9 | The cards are SO SMALL!! | _____ | _____ | _____ |
| 2026-05-01 19:09 | `ToI7UW7max` | mgp-1jmz4of5R9S9w31PaEb | 14 | I jusbanished a character with Ms. Incredible. I should be able to ready chosen "Super" character, but I wasn't given the option | _____ | _____ | _____ |
| 2026-05-01 17:56 | `MW4fK0ESVg` | mgMxyyIBAJ3kQXQSTGbaJgY | 8 | gadget not working with support plane to increase lore value | _____ | _____ | _____ |
| 2026-05-01 15:51 | `AsM6Wvuzix` | mgFBCSH5jA90ER4RDGqRMAL | 8 | Icons too small.  Can't challenge locations | _____ | _____ | _____ |
| 2026-05-01 05:14 | `nx_tIGNg29` | game-1777612101142-ggxl5h4ra | 15 | Charater should not have died because he had 2 resist. | _____ | _____ | _____ |
| 2026-05-01 01:53 | `FHdimLmay3` | mgfY4jEgYifjKKQdJ6aNz65 | 17 | Fire the cannon is only dealing one damage | _____ | _____ | _____ |
| 2026-05-01 00:34 | `ZLpQRYMDFJ` | mgG8fPHC1yP9cZUpxYiuY0F |  | locked up | _____ | _____ | _____ |
| 2026-04-30 23:17 | `rkGd6PFvIO` | mgJXfRb_SsZgCqfGMepaUpA | 10 | scrooge agent of shush not returned to hand when challenged | _____ | _____ | _____ |
| 2026-04-30 22:22 | `yZNaP8o5Qt` | mgLV1tZzHSlhD_GR-nvj4zv | 18 | opponent was able to challenge my characters through the rex bodyguard while he was exerted. | _____ | _____ | _____ |
| 2026-04-30 20:38 | `TxxWwNKE2l` | mgo1Q7ihqaqUlMxGV6ewCxT | 16 | Mirage dealt 4 damage in challenge, but I don't see in the log why. | _____ | _____ | _____ |
| 2026-04-30 16:23 | `X-ZkmpcYYZ` | mgSHeq0egi2nnm_51VQCp0v | 8 | 3 arrows was able to choose the same character for both damage instances | _____ | _____ | _____ |
| 2026-04-30 16:13 | `rH5rFWLXcL` | mg9M71bgduyr_yq2Wdh7XYD | 10 | Cards that are supposed to reveal, like Woody and You've got a friend in me, are not revealing. | _____ | _____ | _____ |
| 2026-04-30 15:32 | `jkL1DBwwkS` | mgDvS3EQFALiprqS6Eaqk1G | 11 | cant sing together | _____ | _____ | _____ |
| 2026-04-30 15:28 | `lleciLLdsq` | mgDvS3EQFALiprqS6Eaqk1G | 5 | After playing lady david could not enter play exerted, he should be able to as he is entering play | _____ | _____ | _____ |
| 2026-04-30 14:32 | `G4Rw_F78NL` | mgW_bCTqfaB_AkX3DY7hC0j | 13 | gadgets ability giving all suppo9rt characters extra lore did not work | _____ | _____ | _____ |
| 2026-04-30 14:23 | `w25CkX8D5p` | mgQwJvjL9qz4-IkIblxsUdB | 11 | Effects that require a card to be revelaed to an oppenent (Ex friend in me or judy detetive) are not revelaing info | _____ | _____ | _____ |
| 2026-04-30 03:41 | `D1J9h2vTMW` | mggQMlkEzwsae9q8_31VT1Z | 7 | Woody on quest effect does not allow for bodyguard to enter play exerted | _____ | _____ | _____ |
| 2026-04-30 01:32 | `VjBbQsAsPu` | mgZLYmsgW5SaH9P9Ixnzxwq | 7 | couldn't play after 5 coast woody summoned a card | _____ | _____ | _____ |
| 2026-04-30 00:36 | `VGOaTUIfGK` | mgHmTNrfvdnnhjXQ2phCkRi | 13 | cannot progress past woody.  bugged second trigger.  cannot play character of 2 cost and cannot move past. | _____ | _____ | _____ |
| 2026-04-29 23:45 | `gbVcvE7IQa` | mgWLXQ58_pvc-dIfIEaYvmm | 10 | when woody brings out a character, i am not able to select to bring them exerted (bodyguard ability) | _____ | _____ | _____ |
| 2026-04-29 23:17 | `fY3VehJdDE` | mg60k_Iljg5zcsImXt9pB0W | 7 | Friends in me is not revealing the chosen cards | _____ | _____ | _____ |
| 2026-04-29 21:43 | `JA7aG5cHd6` | game-1777498553271-b5oqv4yid | 20 | Could not use boost mechanic | _____ | _____ | _____ |
| 2026-04-29 21:28 | `AOXDfcc7bF` | mgYOh8-JLiJK3xj55twFbEl | 7 | Emerald Chromoticon is not working as intended. My opponent banished a character and the item did not trigger. | _____ | _____ | _____ |
| 2026-04-29 21:26 | `hBeBYlgjWK` | mgpkcBKjja-5PzSsAiRhs5_ | 9 | bug ability jessi | _____ | _____ | _____ |
| 2026-04-29 21:24 | `zNK5n8ZCz5` | mgpkcBKjja-5PzSsAiRhs5_ | 9 | error effect jessie | _____ | _____ | _____ |
| 2026-04-29 20:51 | `CVzl5T4Ctc` | mgwapJZeO4I0n5-cE-7RCBs | 23 | Maximus doesn't gove me 5 lore gor ma m. Indestructible with 14 strong.... | _____ | _____ | _____ |
| 2026-04-29 20:07 | `7BMnqUknV6` | mgddqx8EScQPpJ5ydiK1VVB | 13 | i play mad heir and damage wass not put onto angle it should not me effect by resist | _____ | _____ | _____ |
| 2026-04-29 18:13 | `Bj4tIZEvXp` | mgyyweA-0RWw-b-pNe7Z_jJ | 16 | max goof trigger not working | _____ | _____ | _____ |
| 2026-04-29 17:45 | `dsvD2onjAl` | mgAyaaEWxV_MRaMplq_PhXo | 21 | no se ve el lore | _____ | _____ | _____ |
| 2026-04-29 16:24 | `qKxrcSYPeF` | game-1777479273222-p2ky3ao4l | 9 | AI stalled when dealing with big tramp and choosing cards | _____ | _____ | _____ |
| 2026-04-29 16:01 | `zrDeHt3Yky` | mg5kOQ1Vsrv0-_Hll-zypco | 5 | I am unable to quest with Montegory Jack even though he is now at a location and has 6 shield so should be able to. | _____ | _____ | _____ |
| 2026-04-29 15:29 | `mAfXG38vZd` | mgKnWbs0CLXRu-mYJ737Pas | 9 | Can't swing with reckless. | _____ | _____ | _____ |
| 2026-04-29 14:45 | `WJeMSDbC8Z` | mgs8_cuA5DjjCkQNVQN7NsM | 7 | hei hei expanded consciousness does not ink all cards when played | _____ | _____ | _____ |
| 2026-04-29 10:07 | `G_4Vn8_2cO` | mgTAToWJnhtGgoMpoLUtZtR | 2 | No card images and or text | _____ | _____ | _____ |
| 2026-04-29 05:10 | `INIl1-Rl5b` | mgs_2mXGkUNvm4F0T3oDk_9 | 7 | wont allow to refuse webys diary when not having ink | _____ | _____ | _____ |
| 2026-04-29 04:36 | `CZjEAHrX0H` | mgU210N4BjazM6oj2WWevO8 | 8 | Hei Hei Expanded consciousness: the card states all cards in your hand get put into your ink well, but I was only able to put 1 card into... | _____ | _____ | _____ |
| 2026-04-29 00:17 | `JYWopNahRU` | mgTRwUSPZcGTtSRYDQ1tJiF | 12 | I cannot put multiple characters into a character or location with damage | _____ | _____ | _____ |
| 2026-04-28 22:34 | `QOoNCZvNFz` | game-1777415349929-mejdmbra3 | 9 | computer notes, says opp plaed stregnth of raging fire, but actually played zeus lighting bolt, in play by play notes | _____ | _____ | _____ |
| 2026-04-28 20:25 | `U656XA8_8L` | mghuFCkUcq5U26w36cgQVL8 | 13 | unable to select any of my characters to banish to trigger Sid's trigger | _____ | _____ | _____ |
| 2026-04-28 20:06 | `kDor_0JmVg` | mgTPk3cii775E2DwqryG7hA | 14 | with woody, it's a MAY play a character 2 cost or less for free. it keeps automatically playing a character. | _____ | _____ | _____ |
| 2026-04-28 20:03 | `G3mxcpSJb-` | mgGHKIEaUwDcbY-MTMa4cN9 | 22 | My opponent ran out of cards and was able to continue playing. I believe the correct ruling is if you cannot complete a draw action, you ... | _____ | _____ | _____ |
| 2026-04-28 19:30 | `A9r71qvP-2` | mgOxDAcClV6-zLT3OXFjtyU | 12 | sid. I banished a toy on play and it did not make my opponent banish a character. | _____ | _____ | _____ |
| 2026-04-28 19:24 | `meiOJAkhT4` | mgCUpL-8XiRVwIZZZAaJ5YR | 19 | Boost Mechanic is not working on Chesire Cat, Inexmplicable or Scrooge | _____ | _____ | _____ |
| 2026-04-28 17:56 | `VvprHBa914` | mgMiOs7DdgTLna6--XPyzu5 | 16 | I can't see some of the items I played. I suspect there should be a scroll bar somewhere. Maybe I missed it | _____ | _____ | _____ |
| 2026-04-28 15:15 | `4ekmcYHUK6` | mgVZqZEggKtPp3Npvajfqbk | 10 | Lady Misparker Ave - Something Wonderful only allows you to bring back 1 not 2 cards into hand. only allowed to select 1 | _____ | _____ | _____ |
| 2026-04-28 13:34 | `q1RlnE8FVC` | mgNHFKpQH7NjInvRhiftcD6 | 21 | Sugar rush speed way starting line was not functioning properly. I had a character there and when i activated its ability it said i neede... | _____ | _____ | _____ |
| 2026-04-28 05:26 | `4A0xlcWvVT` | game-1777353617188-m2ffsibj4 | 19 | Bodyguards aren't getting the option to enter play exerted. | _____ | _____ | _____ |
| 2026-04-28 03:28 | `AClOMywF9F` | mgg0pLW0VHz_OzJuk62NrRN | 12 | Buzz Lightyear does not cycle cards | _____ | _____ | _____ |
| 2026-04-28 01:29 | `e02DnjK4Xh` | game-1777339097145-qbmdzyh66 | 16 | cat didnt know what to do at the end | _____ | _____ | _____ |
| 2026-04-28 00:52 | `KATsv_GoXs` | mgAlrg2ERBlXO1a79rssluL | 16 | unable to play a toy for free when questing woody | _____ | _____ | _____ |
| 2026-04-27 22:28 | `Ovxg4gSnxl` | mgwc65Ply4hY1TUwAbP68dK | 15 | Marshmellow Cranky Climber, prevented my Lanterns from readying on my turn | _____ | _____ | _____ |
| 2026-04-27 20:03 | `HoLp9B2TO8` | mgAQwFIup9zd_8239-mN3Z4 | 8 | Pocahontas disallowed characters to challenge and then Boost on Chesire Cat is not allowed | _____ | _____ | _____ |
| 2026-04-27 18:48 | `Biov8kzGnQ` | mgIHSZLQ6pNLR8uAosIZSPv | 12 | Louisa madrigal ability did not work correctly | _____ | _____ | _____ |
| 2026-04-27 18:08 | `5VfksGoNb7` | mg4ITcgTS89-SVwzybl8qie | 6 | most of my cards do not work | _____ | _____ | _____ |
| 2026-04-27 17:26 | `Txs9WrrEO4` | mgpXj-RxAXiyFcB6XbIySWQ | 37 | Daisey Paranoid Investigator does not apply the proper strength as support. Causing me to lose the game | _____ | _____ | _____ |
| 2026-04-27 16:17 | `kUjni4qtP9` | mgY2FQe8nyKTkcpKMEQ7ilx | 8 | supporting from Daisey Duck internal investigator does not provide the correct amount of willpower to another character. In this case Tip... | _____ | _____ | _____ |
| 2026-04-27 16:05 | `MPnS6J5QQ5` | mg63ZL6nCHsMlbgqL0-8Naa | 16 | Lord McGuffin is not triggering exert to deal 3 damagae | _____ | _____ | _____ |
| 2026-04-27 15:47 | `4XVSH05Yab` | mgn48ucxPV_OxmoUqOZSKdG | 5 | Dragonfly swarm isn't working | _____ | _____ | _____ |
| 2026-04-27 15:34 | `5BIkboyLBo` | mgtdPi95OShC9Udu7z-ugeU | 6 | Firefly does not work | _____ | _____ | _____ |
| 2026-04-27 14:25 | `vxvNuK-OWj` | mgsF8SbrbgU_wY6aYTQPayT | 11 | John silver one does 1 turn damage to every character. Next turn not anymore. | _____ | _____ | _____ |
| 2026-04-27 14:09 | `3YsDAAjx9l` | mgnM65IG44NwiGyeRP8m9RU | 16 | I can't see the cards, just their names. | _____ | _____ | _____ |
| 2026-04-27 07:06 | `hlHV04oYaD` | mgUXo889r2sps_1XWP6GT8I | 6 | Set12 Raya During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn. ... | _____ | _____ | _____ |
| 2026-04-27 03:57 | `oKC6vM65JV` | mgwY08B4X1zf3Hbv1O3cNjF | 21 | Cant boost with Bambi same turn played | _____ | _____ | _____ |
| 2026-04-27 00:51 | `92SJza00SO` | mg7izAdGB1-xE6N5XxxdyPS | 13 | New Sid is targeting my characters not letting me choose which to banish. games busted til fixed. | _____ | _____ | _____ |
| 2026-04-27 00:51 | `ynsRhFSs6S` | mg7izAdGB1-xE6N5XxxdyPS | 13 | when I use Sid ability it does not give me the lore | _____ | _____ | _____ |
| 2026-04-26 22:35 | `fn8wmXgLN3` | mgvmSfgbQNb0zouaJ7QwMLs | 25 | also Sid Phillips character when triggering the Sca ability my opponent is choosing my character to sac, but should be me | _____ | _____ | _____ |
| 2026-04-26 22:28 | `W6w6IXY9XP` | mgvmSfgbQNb0zouaJ7QwMLs | 17 | Sid Philips did not enable ability after Toy banished | _____ | _____ | _____ |
| 2026-04-26 20:43 | `tAJeTzAqhp` | mgTezgDVfLnTjHvDsD19epq | 13 | Pepa Madrigal 2nd effect didnt work, when i move 1 damage i draw a card | _____ | _____ | _____ |
| 2026-04-26 20:30 | `6yS_vNTFD-` | mgTezgDVfLnTjHvDsD19epq | 10 | Alma Madrigal cost 5 effect does not trigger when i move 1 damage from and exert a character | _____ | _____ | _____ |
| 2026-04-26 19:02 | `kt_IcTEEFx` | mgxZpprdJVJf4kr0mXl9-6M | 11 | Gadget support characters get +1 lore didn’t wok | _____ | _____ | _____ |
| 2026-04-26 15:24 | `S60ts438vW` | mgQoXslEFSbRWk9KGhOgt7O | 12 | Opponent gain lore with playing 2 cards per turn for the inkcaster abilities | _____ | _____ | _____ |
| 2026-04-26 15:08 | `mNHkQUt_Hc` | mg4BlPz_7sHXNFxGFx-Gv8R | 11 | Daisy (donalds date) doesn't reveal the card when offered to opponent. | _____ | _____ | _____ |
| 2026-04-26 10:07 | `GZh4P2iuZx` | mgBH_M_tPRPVxdBf1oI16C8 | 15 | when you can play a dwarf for free, i could not choose which one on my hand | _____ | _____ | _____ |
| 2026-04-26 09:24 | `SeqACGgIjI` | mghZVZX4piCf0CTgGPMeROR | 9 | Pluto Bodyguard has damage but still does 5 damage what the f**k | _____ | _____ | _____ |
| 2026-04-26 03:17 | `EauQ5WSbB8` | mg8_powmzdcledICEoV942E | 12 | The chat box where it says what happened during the match is listing the wrong item when something is inked or played. | _____ | _____ | _____ |
| 2026-04-25 21:53 | `eo01P7uorY` | mgxOxe37sq6R4lXQ33Py-5U | 13 | Pass turn did not work | _____ | _____ | _____ |
| 2026-04-25 19:40 | `IpnQJ3LHYs` | mgRPvumMAqs3UmAe4Rqpqtt | 10 | Opponent timed out , but I couldn't drop him. Said match already ended. | _____ | _____ | _____ |
| 2026-04-25 13:25 | `LSIzxufNYW` | mgD90JQm2Z7eQIemnN3fEGZ | 5 | Again it wont let me end my turn after questing webby forcing the match to be dropped | _____ | _____ | _____ |
| 2026-04-25 13:14 | `aOuJ3e4bNK` | mgRbbckKCHNsfvgHI_H46CJ | 4 | Wont let me end my turn after questing webby | _____ | _____ | _____ |
| 2026-04-25 05:21 | `qw2cw1tT26` | game-1777093940856-cr3zdz42c | 9 | Can't see the cards in play, and can't select them for Boost ability. | _____ | _____ | _____ |
| 2026-04-25 03:06 | `5v0ZMwDunm` | game-1777085769665-3c90gxtr4 | 12 | unless im confused i cannot cancel elinors ability if there are not targets | _____ | _____ | _____ |
| 2026-04-25 02:37 | `429PoJwMMt` | game-1777083793807-ue2w2ifw9 | 17 | my 6 cost tomatoa wouldnt let me grab the two popcicles in my discard | _____ | _____ | _____ |
| 2026-04-25 02:14 | `A0jtEsTwxl` | game-1777082963198-sr3zl170m | 13 | Your still using a true ranom learn to write a simulated shulle instead of a true ranom this is not 1980 anymore | _____ | _____ | _____ |
| 2026-04-25 01:41 | `Q-yRwsbdbQ` | game-1777081129967-5vmcr64aa | 3 | Not letting me pass my turn | _____ | _____ | _____ |
| 2026-04-25 01:09 | `vfMIBoVFGe` | game-1777078773438-udbcyfdl6 | 18 | clarabelle trigger won't resolve | _____ | _____ | _____ |
| 2026-04-25 01:08 | `f_fFLhEJcW` | game-1777078852392-kh7ev8eo4 | 11 | cant end my turn or resolve effect on clarabelle 7 | _____ | _____ | _____ |
| 2026-04-25 00:59 | `uIN9X8W8B8` | game-1777077971202-ekj2v79ad | 21 | slow | _____ | _____ | _____ |
| 2026-04-25 00:41 | `43ZJ8iW7op` | game-1777077499329-joy2z90wh |  | The game won't let me do anything.  I can't mulligan any cards and it says that it's on my time clock even though the opponent has "turn"... | _____ | _____ | _____ |
| 2026-04-24 23:21 | `9zsPNoW45l` | game-1777072590092-e41wl12fc | 6 | again a bug with meeko | _____ | _____ | _____ |
| 2026-04-24 23:15 | `X09wY79wP1` | game-1777072058327-4i2kpd8eg | 8 | Meeko is buggy | _____ | _____ | _____ |
| 2026-04-24 22:50 | `WcM_ogkSpn` | game-1777070745341-z4hsmpmv2 | 9 | Archemdes can't destroy woodchuck | _____ | _____ | _____ |
| 2026-04-24 15:10 | `SAw1H5RYpQ` | game-1777042948060-u259b2yxv | 12 | pluto doesnt lose strength when he takes damage. | _____ | _____ | _____ |
| 2026-04-24 11:56 | `dwI6Y6-ak6` | game-1777031327076-1izfpthln | 17 | blue steel 4 cost yasmin. if my oppoenent used her effect i cant see the card wich she takes in her hand.. | _____ | _____ | _____ |
| 2026-04-24 08:56 | `i6zM4mgofK` | game-1777020432459-yk6dk89iw | 12 | cannot choose an item to banish while using pluto effect | _____ | _____ | _____ |
| 2026-04-24 06:57 | `ICimhng8gX` | game-1777013594390-ni85eyhun | 16 | she | _____ | _____ | _____ |
| 2026-04-24 04:35 | `3Ygz9bX71Q` | game-1777004038398-kccn2nedx | 22 | Please fix the robinhood trigger when picking visions of the future.   This has cost me the game many times | _____ | _____ | _____ |
| 2026-04-24 04:28 | `uQrv3pTdfm` | game-1777004161045-avcvwy6g7 | 16 | benja effect of discarding item not working. | _____ | _____ | _____ |
| 2026-04-24 00:15 | `qR688GpObJ` | game-1776988337607-ylcjx0dxy | 22 | I can not see an option to exert a bodyguard character when played | _____ | _____ | _____ |
| 2026-04-23 23:39 | `PFAniOyRMM` | game-1776986955970-d8nwpdqd5 | 14 | When i quest with Robin hood, i selected visions of future to play free and it did not play. | _____ | _____ | _____ |
| 2026-04-23 21:50 | `iv7okgWURw` | game-1776980676694-99yiom28q | 8 | I can’t scroll up to see all enemy cards on mobile | _____ | _____ | _____ |
| 2026-04-23 21:45 | `AUs73cR0jV` | game-1776980486681-gtr1bopfg | 12 | OPPONENT NEEDS TO REVEAL KEPT CARDS OFF OF DAISY TRIGGERS | _____ | _____ | _____ |
| 2026-04-23 21:18 | `KH0BT0O0e4` | game-1776978781807-lgq6jhh0n | 4 | winner of game one was allowed to pick to start game two | _____ | _____ | _____ |
| 2026-04-23 17:04 | `1lo_ivLbTI` | game-1776963388203-ezbkblau0 | 15 | There was not an option to exert a character with Alma when I moved damage | _____ | _____ | _____ |
| 2026-04-23 16:11 | `O6-VP2nWxr` | game-1776959286025-zpl78tdyr | 27 | flickering when trying to resolve challenge or quest | _____ | _____ | _____ |
| 2026-04-23 15:08 | `qND7s54H-4` | game-1776956008333-a4ttmc373 | 22 | On the mobile version, when my opponent has more than 3 characters I cannot scroll to see them all. This means I can only challenge or ch... | _____ | _____ | _____ |
| 2026-04-23 13:52 | `1LlJgXUvjM` | game-1776951459312-i0cfsknym | 13 | WET characters attacking on turn they are played | _____ | _____ | _____ |
| 2026-04-23 01:31 | `phBK6TOEzO` | game-1776907059846-r4h8lge43 | 9 | mob song only allows targeting of 1 opposing character not upto 3 characters/ locations | _____ | _____ | _____ |
| 2026-04-23 00:32 | `gGWfT2yOm-` | game-1776904213515-hhy81afov | 5 | Opponent won game 2 and was given the option of selecting who went first in game 3 | _____ | _____ | _____ |
| 2026-04-23 00:32 | `y4ZYMK6gNj` | game-1776903720206-1zll439nw | 12 | giant tink cant choose ward and there isnt a way around it | _____ | _____ | _____ |
| 2026-04-22 23:01 | `aVULD5lVw4` | game-1776898693245-vild1wtgb | 3 | It would not let me "resolve" a damage | _____ | _____ | _____ |
| 2026-04-22 22:43 | `417BKMd1uP` | game-1776896927935-xutu7cbbh | 14 | Doing best of three but second game always ends immediately | _____ | _____ | _____ |
| 2026-04-22 22:28 | `soKSt5laRf` | game-1776895204511-59yuuwsf3 | 2 | The game is telling me to discard a card but meeko is not exerted, i just played it | _____ | _____ | _____ |
| 2026-04-22 19:53 | `5NJ8FV12wV` | game-1776887500163-u17da8y99 | 3 | It keeps saying authentication lost but the message never goes away after refreshing. | _____ | _____ | _____ |
| 2026-04-22 19:20 | `Yr4F9iIO3K` | game-1776885002809-l0u2fa55z | 14 | i couldnt choose which to ready versus a marshmallow. it readied the first char on the board, i had 5 or 6 chars. | _____ | _____ | _____ |
| 2026-04-22 18:34 | `ixGyaKs3Ns` | game-1776882777723-y2lrz1jgj |  | i banished a 2 cost uninkable scrooge with 1 damage on it and 2 boosts with only a good aim from angel (4 cost steel). i think it thought... | _____ | _____ | _____ |
| 2026-04-22 17:01 | `YIaBgUbM9_` | game-1776877015466-prgqlp0n4 | 10 | rush isnt working | _____ | _____ | _____ |
| 2026-04-22 14:03 | `K0lhtUyFE1` | game-1776866426468-8jgn480ip | 1 | Meeko rtriggering when not exerted a | _____ | _____ | _____ |
| 2026-04-22 12:04 | `iHwdcud-zk` | game-1776858665593-ug9kkrbi2 | 22 | It doesn’t let me choose a target for actions when im in a vertical display on mobile. I need to orient my phone horizontally to select. | _____ | _____ | _____ |
| 2026-04-22 10:36 | `nf2Zktm64D` | game-1776853759551-20lwr1zxv | 8 | i HAVE PLAYED DINKY, GOT THE BRAINS SEVERAL TIMES AND MY OPONENT CAN NEVER CHOOSE A CAHRACTER TO ADD THE DAMAGE TOO | _____ | _____ | _____ |
| 2026-04-22 10:36 | `rQm5HaVyts` | game-1776853759551-20lwr1zxv | 8 | Dinky on opp side - not allowing me to select one of my characters to deal damage to, even though I have multiple valid options | _____ | _____ | _____ |
| 2026-04-22 10:17 | `hd55KWKQp8` | game-1776852688762-0a9heh049 | 6 | dinky is bugged doesnt let you select glimmer to deal damage to | _____ | _____ | _____ |
| 2026-04-21 18:57 | `ogekZlcALV` | game-1776796677180-4zpx159p6 | 20 | Would not advance to game 2 in a private BO3 match | _____ | _____ | _____ |
| 2026-04-21 13:37 | `CZkhDOa9lZ` | game-1776777988697-vgpuj6j9v | 21 | AI is unable to resolve chershire cat boost trigger due to no damaged characters being in play. | _____ | _____ | _____ |
| 2026-04-21 05:32 | `AaifF8VRy4` | game-1776749177603-vs9h3p182 | 13 | can't play song even though i have enough ink | _____ | _____ | _____ |
| 2026-04-21 02:51 | `gKdAH1BTvh` | game-1776736169533-p7nwz1ifa | 31 | vincenzo must deal 3 damage instead of it being optional | _____ | _____ | _____ |
| 2026-04-21 00:30 | `2V_pLhihOS` | game-1776730775742-4l31o9l4j | 13 | i received a loss but the opponent played a card to gain two lore- but still didnt gain twenty lore and received a win | _____ | _____ | _____ |
| 2026-04-20 22:13 | `hebDPc-fkZ` | game-1776723006434-813d08yo5 | 7 | rush powerline did not work after playing a song | _____ | _____ | _____ |
| 2026-04-20 20:17 | `wsuCTIJz46` | game-1776715753027-8u7ib4wcd | 8 | it is not letting me pick a card to resolve an effect of DINKY | _____ | _____ | _____ |
| 2026-04-20 18:21 | `ofqba8bQao` | game-1776708991066-ajfvgzj9d | 4 | Would not let me resolve Dinky to select herc or olaf on my board. No options showed up. | _____ | _____ | _____ |
| 2026-04-20 16:28 | `qq6-q_YV5h` | game-1776702298720-dvgr4cmvc | 3 | couldn't place a damage with Dinky.  said no valid target | _____ | _____ | _____ |
| 2026-04-20 13:09 | `MsQ-L2Cpk9` | game-1776689679343-saqv093rq | 14 | won't let me choose action from discard | _____ | _____ | _____ |
| 2026-04-20 12:50 | `TVoOMaS1FJ` | game-1776689062512-v24bpm4vl | 13 | Bagheera on the ohter side, I had library with damage - banished bagheera but then it banished my library as it did damage to everything | _____ | _____ | _____ |
| 2026-04-20 03:22 | `323gcyg90f` | game-1776654658534-d702z1cvr | 14 | Anastasias "Oh I hate this" appears bugged. Once challenged instead of making my opponent discard a card it was asking me to discard a ca... | _____ | _____ | _____ |
| 2026-04-20 02:20 | `tZ14KFEpnp` | game-1776651145326-r4cw01j0m | 11 | I can't resolve King Undisputed action. It wants me to target but the action doesn't allow for that. | _____ | _____ | _____ |
| 2026-04-20 01:56 | `CYEGfNta5a` | game-1776648735221-cw1hlu50u | 17 | Maxgoof top chart quest and didn’t play the song from discard | _____ | _____ | _____ |
| 2026-04-19 23:50 | `78OtcIgC_e` | game-1776641934024-83wah7axl | 22 | Webby's diary did not activate with scrooge putting a card under a character | _____ | _____ | _____ |
| 2026-04-19 23:21 | `mg7uuSa2r_` | game-1776640724414-xzh6qj6le | 5 | When playing in Samsung Galaxy tab, some cards are not able to be selected to interact ie. To challenge or individual lore | _____ | _____ | _____ |
| 2026-04-19 21:46 | `F9zwVCcbW4` | game-1776634414490-abybrjrqw | 21 | When playing Scrooge, it did not give the option to put a card under each character. It does appear they were given ward, so it seems lik... | _____ | _____ | _____ |
| 2026-04-19 17:20 | `--s6kRv0qb` | game-1776618234713-cuyisrlor | 12 | could not past turn | _____ | _____ | _____ |
| 2026-04-19 12:55 | `GfLd3UBQdf` | game-1776602862420-z8ar6hzzb | 16 | i couldnt challenge with powerline's powerstar rush ability after singing a song | _____ | _____ | _____ |
| 2026-04-19 11:50 | `vyamrpKNky` | game-1776599194708-kzg4ugj6n | 7 | Challenge nao eliminou oponente | _____ | _____ | _____ |
| 2026-04-19 02:09 | `OLVC3xJ4bL` | game-1776563709257-lqbuoioui | 19 | Best of 3, the second game never loaded and there wasn't any way to get back to the main area. | _____ | _____ | _____ |
| 2026-04-19 01:58 | `Oaars903MB` | game-1776563873823-f8qs1ob16 |  | This guy @callmejames keeps quitting.  over and over. | _____ | _____ | _____ |
| 2026-04-18 22:17 | `C5zkpart4l` | game-1776550082393-va8f7hypy | 15 | Should be able to challenge a location even if my opp has bodyguard but the client does not allow me to challenge the location | _____ | _____ | _____ |
| 2026-04-18 21:21 | `aokluR2CEn` | game-1776546081135-up4j97d2n | 19 | Glitches every time I hover over characters on the board. Keeps flashing as if I’m taking the pointer on and off really quickly. Makes it... | _____ | _____ | _____ |
| 2026-04-18 07:11 | `PXYfbS4gK_` | game-1776496151729-ppfl7fbc5 | 7 | Playmats and Sleeves can't be selected | _____ | _____ | _____ |
| 2026-04-18 07:09 | `T3a726qoZy` | game-1776496134666-hlenrhmu3 |  | no Mulligan | _____ | _____ | _____ |
| 2026-04-18 04:36 | `5NVXziS4Hu` | game-1776486101925-hwv6t3bd8 | 13 | Boost on cat is messed up.  I can boost and not move | _____ | _____ | _____ |
| 2026-04-17 23:26 | `TYpaLzrM7S` | game-1776467923263-cqjjjiogq | 10 | Mob song only allows the selection of one character | _____ | _____ | _____ |
| 2026-04-17 21:01 | `rCBlrRHy-u` | game-1776459063572-1eejvjsr4 | 12 | I have 4 ink and a randmother willow out but iut wont let me play by 5 cost Lady (with grandmother willow it sould be possible) | _____ | _____ | _____ |
| 2026-04-17 20:44 | `kx1TX2NX8b` | game-1776458159162-xl9sxlzno | 13 | Was asked to resolve royal guard trigger for strength at start of turn from draw but game interpreted it as marshmallow trigger | _____ | _____ | _____ |
| 2026-04-17 19:12 | `D6pfZaeK0_` | game-1776452395068-7i2ymir1m | 13 | Scrooge McDuck card did not return to hand when challenged by opponent | _____ | _____ | _____ |
| 2026-04-17 19:05 | `o_xZBx2jH4` | game-1776451901989-5nix5euvd | 16 | I played King Undisputed and the game made me select the opponent's card i want to remove. Then game dont let me use the card. | _____ | _____ | _____ |
| 2026-04-17 17:49 | `RPvmx7jUyi` | game-1776447769409-p9secmqxv | 8 | Meeko effects trigers when up | _____ | _____ | _____ |
| 2026-04-17 14:53 | `zEYX92di0g` | game-1776436433236-kax3eomgh | 21 | can't play the second game in a BO3 | _____ | _____ | _____ |
| 2026-04-17 13:37 | `h76rZ6zHUi` | game-1776432836083-4hmp5h4np | 4 | I don't know for sure, but I think there might be a bug with Dinky - Had the Brains. I've played it in two matches and the opponent has n... | _____ | _____ | _____ |
| 2026-04-17 12:35 | `G__YVR1WXj` | game-1776428812346-670x15vsb | 20 | I don't think Broadway is registering as having bodyguard. I didn't get the option to exert him when played, and the opponent challenged ... | _____ | _____ | _____ |
| 2026-04-17 10:01 | `R_pkHo6WK3` | game-1776419413855-u9ho2fiur | 12 | Habe verloren weil ich die gesammelten Legenden nicht sehen konnte, es stand die ganze Zeit 0 zu 0 | _____ | _____ | _____ |
| 2026-04-17 09:59 | `I2bozoAQ3R` | game-1776419413855-u9ho2fiur | 10 | Keine Legenden punkte | _____ | _____ | _____ |
| 2026-04-17 02:39 | `If5isbFIHs` | game-1776393070651-hvyyszda8 | 9 | Pluto (steel bodiguard) is keeping the +4 strength even after receiving damage. | _____ | _____ | _____ |
| 2026-04-17 01:58 | `NCZxTvfznQ` | game-1776390663194-m9n309nsr | 11 | boost only cost 1 and it charged me 2 ink | _____ | _____ | _____ |
| 2026-04-16 20:43 | `QyN52I4rOW` | game-1776371807607-hghextaw6 | 9 | Meeko should check if it is exerted before making you choose Currently it makes you choose between discarding and banishing and then chec... | _____ | _____ | _____ |
| 2026-04-16 19:51 | `5ODKlwLcHS` | game-1776368184000-8xx9taxqa | 16 | While using MMM on boost charactrers somethimes they die without proper hp loss | _____ | _____ | _____ |
| 2026-04-16 19:16 | `eg64sJ3tLt` | game-1776366563001-xlaprynjk | 11 | wont let me pick a character for effect none appear | _____ | _____ | _____ |
| 2026-04-16 15:36 | `gcLbIxGvPT` | game-1776353522260-gj42seved | 7 | The action log is one turn behind for ink.  Also opponents cards are showing right across the middle of the board, not in the center of t... | _____ | _____ | _____ |
| 2026-04-16 09:24 | `64U6y5rQ2J` | game-1776330930232-8zs7vm4dd | 10 | Cannot select 2 cards | _____ | _____ | _____ |
| 2026-04-16 07:48 | `AJgkYsjxGr` | game-1776325159571-o8k9gyb1u | 14 | pluto bodygaurd still does damge with damage on him he should do 0 damage | _____ | _____ | _____ |
| 2026-04-16 07:13 | `YGtROuPjNq` | game-1776322996124-nrvfywoyi | 11 | can't resolve effect | _____ | _____ | _____ |
| 2026-04-16 06:00 | `KCLEs2ve_d` | game-1776318045773-wh2i7t533 | 15 | bo3 doesnt progress to second match | _____ | _____ | _____ |
| 2026-04-16 04:07 | `c-KMK0AymL` | game-1776311776153-lbd2fgaj3 | 20 | Unable to sing | _____ | _____ | _____ |
| 2026-04-16 02:39 | `egN-BH3GJK` | game-1776306861210-w505x20bz | 11 | When I quested with Robin Hood Sharp shooter, develope your brain didn't work | _____ | _____ | _____ |
| 2026-04-16 00:44 | `zDvlivPxfz` | game-1776298842087-2qm35qotl | 26 | new game wont load | _____ | _____ | _____ |
| 2026-04-16 00:43 | `-yo-lUKjlp` | game-1776298842087-2qm35qotl | 26 | game would not go to next game | _____ | _____ | _____ |
| 2026-04-15 23:52 | `jaNObp1qRS` | game-1776296332499-u9yxzd85b | 9 | On Samsung tablet 8 left side of the cards when in a game will not open menu to see card details to quest use ability or challenge.  The ... | _____ | _____ | _____ |
| 2026-04-15 21:50 | `aRwocvHYwY` | game-1776289606220-26yqtkc6s | 1 | Can not access the controls on ios. | _____ | _____ | _____ |
| 2026-04-15 20:13 | `UhJKSmqONI` | game-1776283660423-t9j19fahd | 10 | Royal Guard should have more damage since 2 extra cards were drawn this turn. | _____ | _____ | _____ |
| 2026-04-15 17:08 | `5sv327YU4V` | game-1776271986239-38sald92b | 16 | Both players see it as opponents turn with neither able to play | _____ | _____ | _____ |
| 2026-04-15 17:07 | `QlJKpzMnhx` | game-1776271986239-38sald92b | 16 | cant send turn | _____ | _____ | _____ |
| 2026-04-15 16:41 | `YIu9pjdBTH` | game-1776270299130-2sekfb8k2 | 29 | Wasabi is not allowed to use Dumbo's ability to draw and gain lore | _____ | _____ | _____ |
| 2026-04-15 16:14 | `zIR6CyXaaG` | game-1776268659450-b70d0kkji | 17 | When my opponent plays more than 8 cards, the top row disappears.  I can’t scroll to see them | _____ | _____ | _____ |
| 2026-04-15 15:17 | `Qf3_yIJ-1z` | game-1776265384171-7idhmtxca | 18 | Character did not banish after willpower boost was removed. | _____ | _____ | _____ |
| 2026-04-15 13:39 | `T7io-_jvxi` | game-1776260057858-okn42ky5v | 10 | Swords released did not trigger when I have the largest character on the board. | _____ | _____ | _____ |
| 2026-04-15 13:25 | `NFEAJLogHA` | game-1776259081965-r65g3r534 | 19 | dumbo effect on Wasabi was not possible | _____ | _____ | _____ |
| 2026-04-15 09:07 | `aG34U8ehOQ` | game-1776243289820-rxti83yl8 | 19 | elite archer only allowed for 1 additional target | _____ | _____ | _____ |
| 2026-04-15 03:38 | `sakQJlqMOi` | game-1776223596602-l5dhjo2ih | 12 | Player has challenged my ready characters twice... | _____ | _____ | _____ |
| 2026-04-15 03:32 | `MwaU-viEQb` | game-1776223291725-op745qfvi | 13 | 7 cost Tod ability does not work | _____ | _____ | _____ |
| 2026-04-15 02:30 | `C6V_mtSqk1` | game-1776218188652-tsb3pxqba | 16 | Would not let me pass a trigger that no longer met criteria | _____ | _____ | _____ |
| 2026-04-15 02:16 | `VZLKB8VjbA` | game-1776218188652-tsb3pxqba | 12 | Gothels trigger is supposed to allow me to move any damage regardless of if it’s my character or opposing character to an opposing charac... | _____ | _____ | _____ |
| 2026-04-15 02:16 | `Sd4FMm_Ct_` | game-1776218390674-39hab6fun | 18 | Madam Nim Elephant works Backwards | _____ | _____ | _____ |
| 2026-04-15 02:10 | `WdFvKO6UXm` | game-1776218188652-tsb3pxqba | 12 | Damage counters did not move with the Gothenburg trigger | _____ | _____ | _____ |
| 2026-04-15 00:29 | `WFsJgqX48p` | game-1776212377671-dwwglc63u | 22 | when using ohana mean family it remove all damages from all my charaters and darwd card for all damages | _____ | _____ | _____ |
| 2026-04-14 22:52 | `Zk3UbvC20x` | game-1776206736731-gpwfio2h6 | 7 | Oh, I can see now from the log that it triggered and was able to be selected - but still registered in the log (and game state) as condit... | _____ | _____ | _____ |
| 2026-04-14 22:10 | `ybHDhPPlGX` | game-1776203847693-bgk5y2orr | 16 | Apparently I also can't drop my bot opponent from the match | _____ | _____ | _____ |
| 2026-04-14 22:02 | `dtIFIm6Si3` | game-1776203668146-34t35j9mc | 16 | Marshmellow didn't let me choose which character to ready | _____ | _____ | _____ |
| 2026-04-14 16:46 | `-7ae8Mksun` | game-1776184641992-5mvoodedy | 15 | The cards listed in the log do not match the actual cards played. | _____ | _____ | _____ |
| 2026-04-14 14:49 | `-GodKByz03` | game-1776177707800-dk1pr8y8w | 18 | scrooge got banished with 3 damage and 6 willpower when he only had 3 damage | _____ | _____ | _____ |
| 2026-04-13 22:45 | `CnCWpXtNCq` | game-1776119965489-8ujc9oenf | 15 | When Olaf leaves play, it causes the trigger to happen twice, letting you return two characters if you want | _____ | _____ | _____ |
| 2026-04-13 19:27 | `tjZ33n9yBp` | game-1776108159634-wlrumsfo7 | 9 | je ne peux pas choisir quelle carte j'envoie à l'aventure | _____ | _____ | _____ |
| 2026-04-13 15:51 | `yEgnoP5EEd` | game-1776095355577-661kmaa49 | 7 | ITU playable on ready characters | _____ | _____ | _____ |
| 2026-04-13 10:00 | `Lwa4NYvnVL` | game-1776073511695-sd2o1tq4u | 16 | can we make it so when you go to quest or challenge it doesn't highlight the unit makes it hard to resolve it flickers overtop the card | _____ | _____ | _____ |
| 2026-04-13 03:49 | `Pq8lnARL3H` | game-1776051227675-h9596t62s | 27 | Robin Hood sharp shooter doesnt resolve small spells like visions of the future | _____ | _____ | _____ |
| 2026-04-13 03:37 | `2EeJaMCiQ6` | game-1776050797964-anfqnzggj | 8 | Won’t let me select target for Angel | _____ | _____ | _____ |
| 2026-04-13 02:18 | `j4kbm6EENR` | game-1776046354163-isx1orh6h | 8 | computer quested, and then played a character but never passed turn, unable to continue the match | _____ | _____ | _____ |
| 2026-04-13 02:11 | `F5UpnyLRiy` | game-1776046198002-e1yztbbni | 6 | Cant boost :( | _____ | _____ | _____ |
| 2026-04-13 02:00 | `MJV42_CjvS` | game-1776045466408-6adcgqdnb | 2 | Meeko is not exerted and the game asks for me to discard. | _____ | _____ | _____ |
| 2026-04-13 01:52 | `k7zvz86pTd` | game-1776044520293-eag9pey5b | 22 | Playing best of 3.  Went to go to the 2nd game and it would not load. | _____ | _____ | _____ |
| 2026-04-13 00:21 | `IcTjvZBKf5` | game-1776038866721-zx90kulqt | 14 | Angel had resist even though the opponent had a card in hand | _____ | _____ | _____ |
| 2026-04-12 21:25 | `ErK2VhvF-b` | game-1776028578564-y2y9n44ae | 16 | Max goof ability to quest and play a song from discard for free does not work | _____ | _____ | _____ |
| 2026-04-12 17:50 | `j_k-EboXi-` | game-1776015884293-o4e9z8qfc | 10 | Played Ohana and healed all of my characters. Draw cards for all healed characters. | _____ | _____ | _____ |
| 2026-04-12 14:51 | `1ULae_ELFC` | game-1776004940759-hzxde5x9l | 12 | Can't end turn, can't resolve clarabelle's effect when opponent has an empty hand | _____ | _____ | _____ |
| 2026-04-12 14:48 | `FFZw6icC7r` | game-1776004853633-0drs8qutm | 15 | Scrooge was banished with 4 damage when he had 7 resist | _____ | _____ | _____ |
| 2026-04-12 13:02 | `4S1EKzDPJ4` | game-1775997903280-rpone5mpa | 15 | Rolly ability (support) triggered with quest all even though the card was wet | _____ | _____ | _____ |
| 2026-04-12 12:41 | `c8kHSRAb0A` | game-1775997046522-t60129u8r | 15 | Olaf dies but can't activate effect | _____ | _____ | _____ |
| 2026-04-12 09:44 | `Lz9Rxunfq1` | game-1775986501286-pqhjuf9kf | 11 | Op tablet modes kan je NIETS DOEN | _____ | _____ | _____ |
| 2026-04-12 02:46 | `GpLuExj28X` | game-1775961872921-vi67xdtmx | 1 | i mulliganed 3 and it took the 4 i asked to keep | _____ | _____ | _____ |
| 2026-04-12 02:11 | `v4g9udANdj` | game-1775959808662-eop7lwn4w | 3 | I selected amethyst steel deck and was put up against a saphire deck. | _____ | _____ | _____ |
| 2026-04-12 01:39 | `-mw0CdoGdn` | game-1775956925721-s7s88q0un | 18 | Max trigger didn’t activate to bring back song | _____ | _____ | _____ |
| 2026-04-12 00:19 | `6rfcawqHWJ` | game-1775953136979-zvwcnpa4y |  | Cannot remove the Ai control popup on mobile | _____ | _____ | _____ |
| 2026-04-11 23:58 | `uIuJfYtvPn` | game-1775951132723-90papcklc | 14 | Lore for the opponent went to 20, but the game shouldn't end like it did in my match. My turn should have passed, then end of turn game s... | _____ | _____ | _____ |
| 2026-04-11 23:47 | `iLQ2GjzPM9` | game-1775950627520-bd1t5oakf | 13 | cannot use basil distinguished detectives ability | _____ | _____ | _____ |
| 2026-04-11 23:26 | `9AGDUm5o-G` | game-1775948739012-vszwoli99 | 30 | Terror that flaps through the night (3 damage) banished my scrooge that had 3 cards underneath (he had 6 resist) | _____ | _____ | _____ |
| 2026-04-11 19:15 | `K9EZ9-ZWUK` | game-1775934850842-e7m8rbwqv | 1 | I can't pass. | _____ | _____ | _____ |
| 2026-04-11 18:57 | `ORx_pWgT4k` | game-1775933533005-dud4ga1ux | 14 | Ohana healed all characters and drew for each damage instead of having me choose 1 character | _____ | _____ | _____ |
| 2026-04-11 18:19 | `K3mALwNs7F` | game-1775928914724-ip7amnsqu | 23 | Opponent didn't get lore when banishing one of my characters with their character that was in Thebes. | _____ | _____ | _____ |
| 2026-04-11 16:27 | `muIJkD9LjR` | game-1775924343968-8ym2lyk3l | 10 | cant challenge or sing | _____ | _____ | _____ |
| 2026-04-11 13:51 | `2R605-7r9_` | game-1775914635989-qza0zmmdf | 18 | The octopus challenger did not work correctly. | _____ | _____ | _____ |
| 2026-04-11 13:49 | `eI-qEjAA8c` | game-1775914951552-x8bg8n7v8 | 16 | Ohana mean family creat bug | _____ | _____ | _____ |
| 2026-04-11 13:00 | `JxPVl4b9_E` | game-1775911084475-pvj48he3q | 22 | Ohana Means Familie Remove all damage is Fail. Fault. The text is fault. Chosen charachters. | _____ | _____ | _____ |
| 2026-04-11 12:27 | `-g6CluBoSq` | game-1775909746548-qjd9as6v8 | 32 | broke ai | _____ | _____ | _____ |
| 2026-04-11 11:54 | `BeMAD0Mf1A` | game-1775908082778-mha1wldsn | 8 | Retro Evolution doesn't allow me to play the next character after banishing the first one. | _____ | _____ | _____ |
| 2026-04-11 08:55 | `YjJGZG8_dG` | game-1775897441187-2lz4qt484 | 4 | cant ink second card after playing sail | _____ | _____ | _____ |
| 2026-04-11 08:55 | `MQmtnE5gmH` | game-1775897441187-2lz4qt484 | 4 | cant ink a second card after playing sail | _____ | _____ | _____ |
| 2026-04-11 08:44 | `aFVh0sokM9` | game-1775896476128-z7bf4soxz | 19 | goliath trigger | _____ | _____ | _____ |
| 2026-04-11 01:30 | `7MEIHL7xiK` | game-1775870854511-70dxg9z61 | 3 | Yellow 1-cost daisy- opposing player's drawn card is not revealing. | _____ | _____ | _____ |
| 2026-04-11 01:08 | `eeQqiRZAVn` | game-1775869389823-wsxunk9tj | 15 | System isn't prompting for Alice's "Ahoy" ability when questing. | _____ | _____ | _____ |
| 2026-04-10 21:43 | `stV0kfdwkD` | game-1775857197799-c941ebkcp | 6 | Darkwing's Chair Set showing as playable for 2 ink. | _____ | _____ | _____ |
| 2026-04-10 21:37 | `WC-nYvVcxA` | game-1775856788544-b9sjb6w5m | 9 | Cinderellas ability popped up for me without me playing a princess | _____ | _____ | _____ |
| 2026-04-10 21:11 | `L-j-vOBJkN` | game-1775854827697-js8gozqru | 21 | Darkwing's Chair Set only healed Darkwing Duck for 2 instead of 4. | _____ | _____ | _____ |
| 2026-04-10 20:22 | `3c21dKrNCc` | game-1775851472620-6va16lanv | 22 | got the choice to use cindi wo playing a princess | _____ | _____ | _____ |
| 2026-04-10 18:43 | `cBsUjxEHZQ` | game-1775846035218-9wa02qpwb | 10 | Couldn't select boost and slow | _____ | _____ | _____ |
| 2026-04-10 17:30 | `CkL-4NvKdj` | game-1775841845770-o5kng5ved | 21 | White Hot Agony Plains effect doesnt work | _____ | _____ | _____ |
| 2026-04-10 16:53 | `7kLJSbGGel` | game-1775839582679-ylqny42j2 | 8 | Cinderela's effect triggered without princess played this turn | _____ | _____ | _____ |
| 2026-04-10 16:24 | `uEeTEgAuCb` | game-1775838232804-sakdmc5yj |  | testing 123 | _____ | _____ | _____ |
| 2026-04-10 05:11 | `ofV2FtfG7Q` | game-1775796745364-j0ml6yk1l | 23 | Anna the ice breakers play event is targeting her instead of letting me choose a target | _____ | _____ | _____ |
| 2026-04-10 04:38 | `g2fDL5s14C` | game-1775795551555-7y0i4mtv4 | 9 | I attaacked with 2 genies into a location with 4 HP and it's not registering the 2nd atack so it wont die | _____ | _____ | _____ |
| 2026-04-10 03:48 | `VV8J2ca53s` | game-1775791972211-6yuhvwlf4 | 18 | When my opponent played a Goliath, it did not force me to discard down to 2 at the end of my turn. I was able to retain 3+ cards in my hand. | _____ | _____ | _____ |
| 2026-04-10 03:37 | `4z1BRRAI6y` | game-1775791760251-36j6v0h4w | 9 | Goliath should have made me discard | _____ | _____ | _____ |
| 2026-04-10 03:27 | `0qLmNdjeNM` | game-1775791386875-dv6hlkuwz | 7 | I think it's the opponent's turn but because it triggered a draw for me it thinks it's my turn | _____ | _____ | _____ |
| 2026-04-10 00:03 | `OpA_AGMSnq` | game-1775778813900-xppal8blp | 11 | Hudson, doesn't draw card, but still forces discard | _____ | _____ | _____ |
| 2026-04-09 21:34 | `WIcO6wlkw1` | game-1775769708491-pi2hv599q | 18 | - Can't use my Boost abilities; - Some actions aren't clear and the log is full or errors | _____ | _____ | _____ |
| 2026-04-09 21:08 | `Ux9XzffSV_` | game-1775767650398-1clbyynhz | 21 | It did not let me boost the chesire cat. | _____ | _____ | _____ |
| 2026-04-09 21:02 | `iM1TgmLmlW` | game-1775767650398-1clbyynhz | 18 | Not letting me boost | _____ | _____ | _____ |
| 2026-04-09 20:42 | `dJdjub7pWd` | game-1775767199360-vzwcmibqr | 1 | Underdog ability doesnt work | _____ | _____ | _____ |
| 2026-04-09 20:38 | `SBu-5Fgkj0` | game-1775766768222-n59ynv2le | 8 | Ratigan's Party Location is not giving lore at the beginning of a turn when I have a damaged character | _____ | _____ | _____ |
| 2026-04-09 20:02 | `FsjYtJeUKq` | game-1775764109266-hk2yl6hsd | 17 | Hello challenging doesn't work properly and when playing on a tablet I cannot choose a character because the preview is flickering | _____ | _____ | _____ |
| 2026-04-09 18:59 | `VUxW4cKfyO` | game-1775760943512-e1qn9mljo | 8 | Meeko end of turn checks even if not exerted | _____ | _____ | _____ |
| 2026-04-09 18:52 | `VfI1RlUpcH` | game-1775760163385-utjr58eca | 14 | honey maren effect isn't functionning | _____ | _____ | _____ |
| 2026-04-09 18:38 | `cDEOTMh4Er` | game-1775759514553-wv8rgto4f | 10 | Support didnt trigger | _____ | _____ | _____ |
| 2026-04-09 18:28 | `scmyo7-s4s` | game-1775758682054-r0x86m89a | 24 | when they delt damage to hydra i wasnt able to deal damage back | _____ | _____ | _____ |
| 2026-04-09 18:23 | `iYFdpV-mfg` | game-1775758036191-wcqwyra0e | 15 | Cannot boost characters | _____ | _____ | _____ |
| 2026-04-09 18:20 | `ych9KcHvCo` | game-1775758006779-11u2bifsx | 14 | When I quest and my character has 'support' - it only allows me to target my own characters, but I should also be able to give support to... | _____ | _____ | _____ |
| 2026-04-09 18:17 | `5FEKYsPrqU` | game-1775757459046-myquxkrlh | 17 | Auf dem iPad kann ich einzelne Karten nicht auswählen.. je mehr Karten ich lege und sie nach links rutschen flackert die Karte und sie is... | _____ | _____ | _____ |
| 2026-04-09 18:15 | `V1sIkD1Sba` | game-1775757089464-rdin3594g | 38 | Alin quest but support can't target opponent card | _____ | _____ | _____ |
| 2026-04-09 18:08 | `92tZH5uYPn` | game-1775757089464-rdin3594g | 29 | Support on opposing character | _____ | _____ | _____ |
| 2026-04-09 18:01 | `UruxJBY3mW` | game-1775757322405-4985dxwuo | 7 | goliath in play and opponent did not discard down to 2 cards | _____ | _____ | _____ |
| 2026-04-09 17:19 | `5lz11dytSu` | game-1775754341466-yes9hcgwp | 19 | Goliaths ability did not trigger for me with an empty hand at end of turn. | _____ | _____ | _____ |
| 2026-04-09 16:34 | `QgmZUHYp9Z` | game-1775751754860-4zm24qxc0 | 15 | It's not possible to use the boost ability of cards | _____ | _____ | _____ |
| 2026-04-09 16:25 | `rJGdPTJvQX` | game-1775751075004-tpe4adune | 11 | todd not be able to quest | _____ | _____ | _____ |
| 2026-04-09 16:23 | `6MMOT_lTsZ` | game-1775751075004-tpe4adune | 11 | todd not ready | _____ | _____ | _____ |
| 2026-04-09 16:00 | `ehLKX1v1hQ` | game-1775749687861-gpgyn435v | 15 | Goliath give my opponents cards at the end of their turn but did not give me 2 cards even with an empty hand at the end of my turn. | _____ | _____ | _____ |
| 2026-04-09 15:59 | `DqID9DIOcK` | game-1775749687861-gpgyn435v | 13 | My opponent is not always having to discard when using good aim, also the chat log does not list the card they discarded for using the sk... | _____ | _____ | _____ |
| 2026-04-09 15:27 | `kCBtYqjJfA` | game-1775747720464-fk6w90hj4 | 18 | honeymaren gain 1 lore on play mechanic does not trigger when opponent character exerted | _____ | _____ | _____ |
| 2026-04-09 15:19 | `I9i1T2ycO5` | game-1775747567742-ahvfi432d | 12 | AHOY! from Alice - Savvy Saliror does not ask for target, it atutomatically self-targets | _____ | _____ | _____ |
| 2026-04-09 14:05 | `tSmtw7DOqo` | game-1775742798966-vdgz9mgma | 14 | When I passed turn My opponents goliath trigger was not working didnt have an oppertunity to resolve the trigger | _____ | _____ | _____ |
| 2026-04-09 13:59 | `ZT4Z3iGuzp` | game-1775742798966-vdgz9mgma | 8 | I dont think willow works when she has been bounced | _____ | _____ | _____ |
| 2026-04-09 13:33 | `h-2kUaHD9I` | game-1775741440484-wl0cip0ms | 6 | Chicha's effect does not work. I should be drawing a card for 2nd ink | _____ | _____ | _____ |
| 2026-04-09 13:07 | `qJg0s8ua-g` | game-1775738909279-w4dhe83le | 26 | When readying little john, it doesnt let you quest again | _____ | _____ | _____ |
| 2026-04-09 12:54 | `hlMjhMsO4_` | game-1775738783547-lr95bz6nw | 10 | HAD 3 INK TO PAY FOR TIANNAS EFFECT AND IT DIDNT ASK ME TO PAY IT | _____ | _____ | _____ |
| 2026-04-09 12:34 | `tF-AGHUN9i` | game-1775737689729-8vm8j55aq | 14 | i didn't get any cards when my hand was empy from goliath at my turn | _____ | _____ | _____ |
| 2026-04-09 11:23 | `Oxd2hytQFY` | game-1775733330982-rvqp2ri8f | 11 | can not boost character | _____ | _____ | _____ |
| 2026-04-09 10:47 | `il7MCNYgl7` | game-1775731289611-xe7c7z9ia | 14 | Honeymaren ability isn't working | _____ | _____ | _____ |
| 2026-04-09 10:39 | `MMqd4iv6um` | game-1775730810854-6yw9zuvl1 | 9 | Freshly played characters cant boost | _____ | _____ | _____ |
| 2026-04-09 10:29 | `3UhbSy2CF-` | game-1775730002831-q7xzwzpjt | 11 | Cannt do anything | _____ | _____ | _____ |
| 2026-04-09 10:02 | `455WLDUThl` | game-1775728747155-409b26yut | 6 | the abilaty of honeymary Northuldra Guide doesnt work | _____ | _____ | _____ |
| 2026-04-09 07:44 | `45yTCNIHrk` | game-1775720166768-0d4chunyx | 10 | Angela doesn't appear to be working. I couldn't select this character to sing or to attack. | _____ | _____ | _____ |
| 2026-04-09 07:04 | `e0MtT1ChNk` | game-1775718090683-a4o7vi08r | 1 | i am accessing new.lorcanito via chrome under ubuntu, and textures are not rendered properly, e.g in game i only saw card names but no im... | _____ | _____ | _____ |
| 2026-04-09 06:30 | `-Sn9CbfcQ2` | game-1775715890598-2m72bk2kk | 6 | I can’t challenge anyone. I just get cards flashing and can’t do anything. | _____ | _____ | _____ |
| 2026-04-09 05:54 | `81aJ7RlwAL` | game-1775713397250-49qw3awbz | 14 | can not boost | _____ | _____ | _____ |
| 2026-04-09 04:26 | `GK7sgJ1mWb` | game-1775707927873-5fpkhthsu | 23 | Goliath was played on my opponent's board and I never drew cards at the end of my turn even though my opponent did | _____ | _____ | _____ |
| 2026-04-09 03:27 | `SRoNkmeivi` | game-1775703652436-fu27u9b59 | 20 | Card draw is being reported in the log as doubled - can't tell if it's being doubled in practice, but it shows as twice the number of car... | _____ | _____ | _____ |
| 2026-04-09 03:08 | `rmOlYJDHl_` | game-1775703347296-lni8b1a0b | 18 | Didn’t get my draw 2 trigger with Goliath all game | _____ | _____ | _____ |
| 2026-04-09 03:05 | `fDnIfT-54A` | game-1775703347296-lni8b1a0b | 14 | Didn’t get my draw off galitath | _____ | _____ | _____ |
| 2026-04-09 03:04 | `upM6Ct9hFZ` | game-1775703652436-fu27u9b59 | 6 | Palace guard does not gain strength when drawing cards | _____ | _____ | _____ |
| 2026-04-09 02:24 | `pO4Rxqqe3l` | game-1775700334359-ie58rjke8 | 17 | Honeymaren gain 1 lore ability didn't trigger when she entered while opponent had exerted characters in play | _____ | _____ | _____ |
| 2026-04-09 01:29 | `ylSP7b-5rx` | game-1775697570720-gux3ng0va | 15 | Unable to banish Darkwing's Chairs to use the healing ability. | _____ | _____ | _____ |
| 2026-04-09 01:24 | `SM0lFGpthk` | game-1775697570720-gux3ng0va | 7 | Honker Muddlefoot's ability of giving Darkwing Duck Resist +1 didn't take effect. | _____ | _____ | _____ |
| 2026-04-09 00:26 | `fpoyoH24c_` | game-1775693498127-0h8j9xnjc | 20 | Kristoff's Lute did not reveal the card before asking option 1/2. I had no idea what card I was playing until it was played | _____ | _____ | _____ |
| 2026-04-08 23:59 | `rULWNuXa1H` | game-1775692065526-6dcm9mfp1 | 14 | Opp. was able to target my charcters with ward from Aura on this turn. | _____ | _____ | _____ |
| 2026-04-08 23:37 | `LErHOKM_CY` | game-1775690433892-vgxqf5gpe | 20 | Uninkable Cards seem to circumvent a few actions. Need to be fixed. | _____ | _____ | _____ |
| 2026-04-08 23:22 | `uKK4XrSJOl` | game-1775690331550-ivraqpgbx | 1 | couldnt select a card for develope your brain. | _____ | _____ | _____ |
| 2026-04-08 23:15 | `9VPk4R28Aw` | game-1775688876486-29qmla45s | 19 | the abil;ety of Scrooge's Counting House  doesnt  work  i had 5 card under it and it gives me 1 lore  but i need to get 6 lore  1 lore fr... | _____ | _____ | _____ |
| 2026-04-08 23:07 | `rhMXN3OQf8` | game-1775689074849-bx63xvmjq | 13 | can quest another time with little john | _____ | _____ | _____ |
| 2026-04-08 22:53 | `02Xj9uOQfx` | game-1775688067364-2q0w64wru | 9 | Won’t let me pick charters they just blink | _____ | _____ | _____ |
| 2026-04-08 22:52 | `NRratgWBD8` | game-1775687402859-mpebbl3kl | 21 | At the end of my opponents turn, it made me discard one of my cards instead of my opponent discarding. | _____ | _____ | _____ |
| 2026-04-08 22:48 | `Ri_VTq7tLS` | game-1775687783148-v8sxrtlvi | 23 | Goliath is not giving opponent their two cards. Empty hand I see the Goliath trigger for my opponent who seems to get the choice of allow... | _____ | _____ | _____ |
| 2026-04-08 22:42 | `ykjkghD1wx` | game-1775687546536-4kas314xd | 13 | Scrooge Ebinezer wont boost | _____ | _____ | _____ |
| 2026-04-08 21:59 | `0d0Q4M0yxw` | game-1775684898204-0udqgiec7 | 26 | boosted location everyturn and only recieved 1 lore per turn. I lost due to no addtional lore being added by boost | _____ | _____ | _____ |
| 2026-04-08 21:53 | `zQ56Sr20w5` | game-1775684015812-y6uydkxe7 | 26 | wasn't gaining lore from passive card effects | _____ | _____ | _____ |
| 2026-04-08 21:53 | `lpKifdX1_D` | game-1775684015812-y6uydkxe7 | 25 | banished card with calhoun and steel champ pluto and sword of herc - didnt gain a lore | _____ | _____ | _____ |
| 2026-04-08 21:40 | `sxDDfrCZi5` | game-1775683911828-lucrxegum | 10 | Cant boost characters | _____ | _____ | _____ |
| 2026-04-08 21:40 | `K4l95B2Crf` | game-1775683911828-lucrxegum | 9 | I cant boost characters fix this | _____ | _____ | _____ |
| 2026-04-08 21:38 | `YTjBlnJkpw` | game-1775683911828-lucrxegum | 8 | Cant boost characters | _____ | _____ | _____ |
| 2026-04-08 21:37 | `7xJ6orkuz1` | game-1775683418962-0n599yu60 | 23 | I cant draw cards due to Goliath ability from my opponent, only he can draw | _____ | _____ | _____ |
| 2026-04-08 21:29 | `IM4zk8RZne` | game-1775682762324-lonmertxd | 22 | Didn't get cards from Goliath as the opponent. | _____ | _____ | _____ |
| 2026-04-08 21:06 | `3fVtUQjZDX` | game-1775682147275-g3qsv3n9k | 5 | palace gaurd (octopus) doesn't gain challenger +1 when drawing card for turn | _____ | _____ | _____ |
| 2026-04-08 21:04 | `JEkJx5Gw7Q` | game-1775681924227-7sim854nw | 13 | Ancestral Legacy Not working | _____ | _____ | _____ |
| 2026-04-08 19:46 | `trJ0NTyj6G` | game-1775677096172-59t8rds40 | 9 | Match dropped | _____ | _____ | _____ |
| 2026-04-08 19:11 | `I5UY8JeLM6` | game-1775674888974-mpd7b6b6g | 13 | I cannot select my opponent for Support effect to use World's Greatest Criminal Mind | _____ | _____ | _____ |
| 2026-04-08 19:10 | `xHJpS-8_ii` | game-1775673924340-4b5tv06tw | 15 | couldn't play "fire the canon" although I had enough ink. | _____ | _____ | _____ |
| 2026-04-08 19:08 | `eljlx2QUX1` | game-1775671224059-wudz7lc3f | 11 | New lorcanito sucks. Please fix it, it's impossible to play. | _____ | _____ | _____ |
| 2026-04-08 18:58 | `WdimWBCeUd` | game-1775674493219-5e7yhv7yf | 2 | I could not play my underdog christopher robin while going second | _____ | _____ | _____ |
| 2026-04-08 18:42 | `Lk4-oScHhS` | game-1775673285204-19phck0z3 | 10 | enemy was able to play 9 ink worth of cards with no effect on board | _____ | _____ | _____ |
| 2026-04-08 18:36 | `8NKFpoJpCD` | game-1775672536218-l5puh9le9 | 26 | My ink is notering reduceert when playing cards | _____ | _____ | _____ |
| 2026-04-08 18:34 | `GlIuD7t5Il` | game-1775672736790-d49zpl5wk | 17 | Ink dont exerce | _____ | _____ | _____ |
| 2026-04-08 18:14 | `c8I7fo__dq` | game-1775671128824-wmo4ymd5k | 21 | Game is not using up ink and is allowing unlimited card plays | _____ | _____ | _____ |
| 2026-04-08 18:10 | `Os-Q5f5KS8` | game-1775671681935-3ilek6kxo | 7 | Olaf ability doesn't work, for each action in your graveyard reduced the cost of this character by 1, doesn't apply to him | _____ | _____ | _____ |
| 2026-04-08 18:00 | `IofIN6AYq9` | game-1775670941904-azuamxcyy | 7 | They just played 2 items and a character at 3 cost with only 3 ink. | _____ | _____ | _____ |
| 2026-04-08 17:42 | `i_8e71UQGi` | game-1775669788085-keqxttq7c | 11 | unlimited ink to play characters | _____ | _____ | _____ |
| 2026-04-08 17:37 | `InsmkuAZrr` | game-1775669414795-juuirxnn8 | 8 | they used 7 ink with 5 in the inkwell | _____ | _____ | _____ |
| 2026-04-08 17:35 | `Ckqetbk5ld` | game-1775669495836-s0oqdinqd | 7 | 7-cost tramp doesnt cost correct ink. | _____ | _____ | _____ |
| 2026-04-08 17:35 | `1bX5anba_j` | game-1775669414795-juuirxnn8 | 8 | ink dosent exert | _____ | _____ | _____ |
| 2026-04-08 17:25 | `Z5TrIHffFN` | game-1775668471439-huld2899z | 8 | the other player dropped and it won't end the game | _____ | _____ | _____ |
| 2026-04-08 17:10 | `RmYcnUfXVI` | game-1775667786226-48p0f6d4i | 11 | Cards chosen by Nani were not revealed. Opponent played multipled cards without paying ink. | _____ | _____ | _____ |
| 2026-04-08 17:07 | `T-dxPINnzG` | game-1775667896686-nm24phlyw | 5 | I'm able to play multiple cards with the same amount of lore. It should not be possible. | _____ | _____ | _____ |
| 2026-04-08 17:05 | `PLuGKrF1lU` | game-1775667578837-bt27oadc3 | 9 | genit can't boost first turn played need to fix | _____ | _____ | _____ |
| 2026-04-08 17:04 | `32wuifDi3U` | game-1775666858877-8s70ckyvm | 16 | Turn 15 gave him way more ink then he should have rightfully had. Was at 7 ink, but used around 15. | _____ | _____ | _____ |
| 2026-04-08 17:04 | `_VwcZl2yAk` | game-1775667751606-fsc6g0bbm | 4 | already played Trobedeur and its letting me play grandmother willow still | _____ | _____ | _____ |
| 2026-04-08 17:03 | `_ZHefY4rDJ` | game-1775667077548-8k0el7nmr | 14 | My inkwell didn't go down and I was able to illegally play a character that I didn't have the ink requirements for. | _____ | _____ | _____ |
| 2026-04-08 16:59 | `c892DQSU5D` | game-1775667183213-jb1q0gkgs | 10 | I don't think paying less lore is working correctly | _____ | _____ | _____ |
| 2026-04-08 16:48 | `xGa_IIMy-J` | game-1775666294772-knlf6g2is | 12 | Can’t boost | _____ | _____ | _____ |
| 2026-04-08 16:44 | `OkRb_16g8m` | game-1775665730491-axb499bg2 | 30 | I reported a bug about ink that start again and can use all of them, I thik it's de actions/songs that cause the bug, cause at this match... | _____ | _____ | _____ |
| 2026-04-08 16:27 | `E1SHOVKARD` | game-1775664469299-0ei6xxps3 | 17 | Monstro + Library COMBO The order in which cards are drawn and discarded is relevant | _____ | _____ | _____ |
| 2026-04-08 16:26 | `tjYrRL7V21` | game-1775665217933-hpqzht5b6 | 7 | Able to play cards without spending ink | _____ | _____ | _____ |
| 2026-04-08 16:26 | `tvl7zTXhxH` | game-1775665217933-hpqzht5b6 | 7 | Was able to play cards even without ink | _____ | _____ | _____ |
| 2026-04-08 16:11 | `BIQVQ2BAAg` | game-1775663936505-r2l6laarx | 18 | Yeha boost and playing cards isn't using up ink | _____ | _____ | _____ |
| 2026-04-08 16:10 | `Qd10VbbZmh` | game-1775663936505-r2l6laarx | 17 | I don't think ink is calculating correctly. I am able to play more than Ink I have | _____ | _____ | _____ |
| 2026-04-08 16:09 | `1iwDnFbeK8` | game-1775663936505-r2l6laarx | 15 | not letting me boost aerial with ink available on the turn i play her | _____ | _____ | _____ |
| 2026-04-08 15:59 | `RJsWswum5q` | game-1775663117040-g664l1bft | 16 | When trying to select a character on the field to perform an action or sing a song, the image of the enlarged card flashes on the screen ... | _____ | _____ | _____ |
| 2026-04-08 15:43 | `HLulyUGdC0` | game-1775662517907-3j0re5vy9 | 21 | The ink did not exert to play characters from my side. | _____ | _____ | _____ |
| 2026-04-08 15:39 | `GC7YKhw0kz` | game-1775662421238-43wiy3252 | 16 | As I have previously reported, the ink doesn't exert after a player's like 3rd or 4th turn, meaning you can play infinite cards. | _____ | _____ | _____ |
| 2026-04-08 15:31 | `Uf7FNMBt5I` | game-1775661975609-71o041h7e | 8 | ink was not exerted after playing sven | _____ | _____ | _____ |
| 2026-04-08 15:29 | `K6wkgpEtvz` | game-1775661301618-qdi5zgjtx | 16 | There is no ink useage. It will let you play unlimited cards from your hand as long as the ink cost meets the amount of ink in your inkwe... | _____ | _____ | _____ |
| 2026-04-08 15:28 | `J-0Qe4-v2y` | game-1775661448231-1g3lzdqcf | 14 | opponent has infinite ink | _____ | _____ | _____ |
| 2026-04-08 15:25 | `V8RsUWDIP5` | game-1775661301618-qdi5zgjtx | 13 | Can play without exerting ink | _____ | _____ | _____ |
| 2026-04-08 15:20 | `mn7hqsRKM1` | game-1775661148919-vtu0khqb7 | 8 | It is not consuming my ink when I play a card | _____ | _____ | _____ |
| 2026-04-08 15:13 | `QgeG45NwdQ` | game-1775660534619-qgpok50nj | 11 | Bambi boost locks up the game, only option is to arrange the cards but unable to use. | _____ | _____ | _____ |
| 2026-04-08 15:12 | `E-Pv2ldmEY` | game-1775659439738-94asu37s9 | 32 | For most of the game, it wasn't exerting my ink when I played characters. I was definitely able to play more characters than I had ink fo... | _____ | _____ | _____ |
| 2026-04-08 15:11 | `MOl6kTlfXT` | game-1775660534619-qgpok50nj | 11 | Attacked with boosted Bambi, no damage done in combat and boost effect did not trigger | _____ | _____ | _____ |
| 2026-04-08 15:07 | `UWPjsQQbjd` | game-1775660534619-qgpok50nj | 7 | Able to use ink infinitely. | _____ | _____ | _____ |
| 2026-04-08 15:02 | `MQqzujXwGY` | game-1775658424839-qjtq0pcji | 11 | turn one after inking allowed me to play two one drops | _____ | _____ | _____ |
| 2026-04-08 14:52 | `8EX93bwkxd` | game-1775659776339-upl0f1dcz | 6 | was able to play another 2 cost character with no ink after mowgli ability resolved | _____ | _____ | _____ |
| 2026-04-08 14:45 | `Xsis-p87m5` | game-1775658907913-nlfrlustx | 12 | ink is not reduced after play a card | _____ | _____ | _____ |
| 2026-04-08 14:45 | `LBV1hWjFK9` | game-1775658569136-p492ttfe4 | 26 | Lady Tremain - Sinister socialite triggers the last action in my discard, not one i can choose :) | _____ | _____ | _____ |
| 2026-04-08 14:44 | `WNt8t92LKU` | game-1775659109726-0cn55k51h | 14 | ink doesnt work | _____ | _____ | _____ |
| 2026-04-08 14:38 | `dsoGb7Hmj9` | game-1775657239206-h989foabk | 42 | Another thing I can see at chat, it's that cards name are wrong some of them. | _____ | _____ | _____ |
| 2026-04-08 14:35 | `Nl05QPjzT2` | game-1775658569136-p492ttfe4 | 9 | Meeko, just played, ask for resolution (not exhausted) | _____ | _____ | _____ |
| 2026-04-08 14:32 | `0maEfUvKuh` | game-1775658222132-ps65r6wsu | 17 | Can't boost cards | _____ | _____ | _____ |
| 2026-04-08 14:31 | `DHwXBmSkT0` | game-1775657894822-1n7e2en1c | 13 | can not boost | _____ | _____ | _____ |
| 2026-04-08 14:29 | `El710dYY_v` | game-1775658424839-qjtq0pcji | 3 | opponent played 2 1 drops turns 1 with only 1 ink and no cantrips to assist | _____ | _____ | _____ |
| 2026-04-08 14:25 | `VEUFHDaFUP` | game-1775657835192-b5i7bb1kz | 11 | Bambi Ertheral fawn trigger not working | _____ | _____ | _____ |
| 2026-04-08 14:23 | `Ky7Ih2TQ1j` | game-1775657776483-w282ofv64 | 8 | royal gaurd missed a trigger, i drew a card for turn then for dumbo but when i challenged he only did two damage. it should have been three | _____ | _____ | _____ |
| 2026-04-08 14:17 | `jSX5Bbkeka` | game-1775657487966-mks72epli | 7 | Using ink isn't permanent for some reason. When a card is played, ink isn't being exerted properly. It seems that when a card is played, ... | _____ | _____ | _____ |
| 2026-04-08 14:16 | `oZlQ-a55_M` | game-1775657507730-h3cj54wjf | 10 | golith clan leader at active players end step does not make them discard to 2 | _____ | _____ | _____ |
| 2026-04-08 14:13 | `K-gOPhGDp9` | game-1775656550803-pb0izqk7e | 21 | After you play a card and use ink, the ink doesnt go used. and you can play as many cards as you want for the same amount of ink in your ... | _____ | _____ | _____ |
| 2026-04-08 14:09 | `ry3jzcFYVI` | game-1775656675495-jyu56x663 | 20 | Scrooge's Counting house only gave 1 lore, even though it had been boosted | _____ | _____ | _____ |
| 2026-04-08 14:07 | `xYtaxa9lF8` | game-1775656865426-9ikmeoi57 | 8 | cant boost | _____ | _____ | _____ |
| 2026-04-08 13:59 | `jsbaqUo1A8` | game-1775656222369-z1hcfxln9 | 9 | This is allowing me multiple moves when i dont have ink | _____ | _____ | _____ |
| 2026-04-08 13:58 | `K9cMnXsxd4` | game-1775656193127-jax8ll5xd | 10 | I was able to play all of my cards and didn't run out of lore. | _____ | _____ | _____ |
| 2026-04-08 13:57 | `L3hrLX7V7W` | game-1775656193127-jax8ll5xd | 10 | People are able to play characters and not pay ink at all. | _____ | _____ | _____ |
| 2026-04-08 13:56 | `XNR_8hn_Zk` | game-1775656299421-clrx04g27 | 6 | laggy | _____ | _____ | _____ |
| 2026-04-08 13:56 | `9sd9xB5hAh` | game-1775656299421-clrx04g27 | 6 | other player used his 4 ink in his 3rd turn without expaning it. he played 2 cindy and two visions | _____ | _____ | _____ |
| 2026-04-08 13:55 | `Z82bHRtUU4` | game-1775656137403-24s47v7xs | 9 | you cannot play scrooge by exerting 4 items either | _____ | _____ | _____ |
| 2026-04-08 13:44 | `9A6TWRfLIz` | game-1775655150116-zkymjpzyc | 10 | i cant boost my characters in lorcanito V2 | _____ | _____ | _____ |
| 2026-04-08 13:39 | `vPJXAU5CQM` | game-1775655429253-jq2ixfitk | 3 | Picutres of the card are not shown | _____ | _____ | _____ |
| 2026-04-08 13:33 | `_k9iG8FTsV` | game-1775654866257-81mqqdx37 | 9 | Royal Guard did not gain challenger one when the card was drawn for the turn. | _____ | _____ | _____ |
| 2026-04-08 13:31 | `qV3CZ8gRJB` | game-1775654947915-d4k233exa | 6 | Royal Guard is not gaining challenger from drawing a card at the beginning of your turn | _____ | _____ | _____ |
| 2026-04-08 13:16 | `PnoAdrVs_4` | game-1775653379268-ztjp8prqy | 15 | I'm not able to boost at all | _____ | _____ | _____ |
| 2026-04-08 13:13 | `NzJE8_Vl_u` | game-1775653379268-ztjp8prqy | 11 | I was not able to boost with Jimmy Cricket | _____ | _____ | _____ |
| 2026-04-08 13:06 | `90J6U_T0xB` | game-1775652857983-al3pjlr02 | 15 | I don't believe the inkwell was exerting ink properly when playing a card. I believe my 2nd to last turn I was able to 18 ink worth of ca... | _____ | _____ | _____ |
| 2026-04-08 13:05 | `9sOkrQs7Tv` | game-1775652495301-txb2m4gc6 | 19 | Playing cards does not exert ink | _____ | _____ | _____ |
| 2026-04-08 13:01 | `pB-ZSxcBcS` | game-1775652495301-txb2m4gc6 | 12 | Letting me use ink after I've already used it once. | _____ | _____ | _____ |
| 2026-04-08 12:56 | `tFxW-tOLK5` | game-1775652029863-z8rfqfjvo | 20 | unable to use dumbos breaking records ability on my other evasive characters, royal guard is not getting +1 attack for drawing a card. | _____ | _____ | _____ |
| 2026-04-08 12:55 | `QRJr3obEqr` | game-1775652761934-decxdhaw5 | 4 | The opponent played 2 2 ink cards on turn 2 | _____ | _____ | _____ |
| 2026-04-08 12:54 | `FXJUQJucDR` | game-1775652761934-decxdhaw5 | 4 | Can keep playing card when all the ink should be used | _____ | _____ | _____ |
| 2026-04-08 12:49 | `5pNZ7cTSKm` | game-1775651720573-tobu4rf15 | 14 | Playing Alice did not cost ink. Questing with Alice I her effect automatically applied to herself. Readying Alice in the next to last rou... | _____ | _____ | _____ |
| 2026-04-08 12:49 | `EthHaHvEVU` | game-1775651959186-2o0pfwq5l | 6 | ink counter is wrong theres a bug. upon using all inks, i can still continue playing my other cards | _____ | _____ | _____ |
| 2026-04-08 12:40 | `DxxBWbLnRf` | game-1775651520527-s1t8hxll5 | 10 | Boost does not work correctly. | _____ | _____ | _____ |
| 2026-04-08 12:38 | `ReVWfuNzVV` | game-1775651716436-3l87eer3z | 3 | Opponent can play multiple cards without ink: Example: turn 1 puts one card into inkwell and plays two vanilla charakters (each costing o... | _____ | _____ | _____ |
| 2026-04-08 12:36 | `nz55__qwe3` | game-1775651716436-3l87eer3z | 2 | If you play 1 ink you can keep plaing 1 ink cards | _____ | _____ | _____ |
| 2026-04-08 12:34 | `g4aib1J1mh` | game-1775651522300-1qwsybyge | 5 | I can keep inking the ink s not good | _____ | _____ | _____ |
| 2026-04-08 12:27 | `TsEOqWS8j5` | game-1775650625581-f280ty8e2 | 12 | I was able to play more cards than I had ink to play every turn. As long as I played a card that didnt use all of my ink, I could keep pl... | _____ | _____ | _____ |
| 2026-04-08 07:21 | `8JrLDAxCYP` | game-1775632731531-4fe5cwevp | 3 | Buuuuuuug | _____ | _____ | _____ |
| 2026-04-06 18:38 | `9ImrWgn_9b` | game-1775500616729-80mysrbcg | 3 | Cannot do anything, always says authentication lost and refreshing doesn't change it. Unplayable | _____ | _____ | _____ |
| 2026-04-06 02:30 | `FpjrkomurL` | game-1775442420264-y1tu1w5nk | 4 | cannot quest,only quest with all available | _____ | _____ | _____ |
| 2026-04-06 00:12 | `W2ofU7VYNc` | game-1775433923691-5d4pmqdqc | 17 | It keeps saying Authroization Lost even though I keep refreshing the page. It will not let me interact with my own characters on the board. | _____ | _____ | _____ |
| 2026-04-05 20:15 | `2rOBBJjEDK` | game-1775419970644-ybvf4vxvz | 1 | ´your session expired´mesassage displayed , not allowing to continue | _____ | _____ | _____ |
| 2026-04-05 05:32 | `2_pmLgA6Ik` | game-1775366651338-rlm4ovei1 | 13 | Resist +1 doesn't appear to be applying to Calhoun - keeps taking damage from opponents with 1 strength. | _____ | _____ | _____ |
| 2026-04-05 05:22 | `pX4vkjTwz3` | game-1775366356604-fcx5w589m | 6 | Last turn, AI played Akood et Amuti for three ink, and then played three characters costing one each. There was only 3 ink in AI's inkwel... | _____ | _____ | _____ |
| 2026-04-04 18:53 | `hKQGkrQ4Fk` | game-1775328701527-yhq5gncvq | 2 | Authentication lost message will not go away. Have closing all tabs and starting a new window and the same thing is happening. Also will ... | _____ | _____ | _____ |
| 2026-04-04 16:36 | `Zg92yPsfum` | game-1775320491873-1ztwxsumj | 5 | refresh to server. Cant make any moves other than questing | _____ | _____ | _____ |
| 2026-04-04 15:37 | `7kFJPsLNu_` | game-1775317011706-le8k7be8y | 2 | Authentication lost message keeps showing up despite refreshing and starting a new game | _____ | _____ | _____ |
| 2026-04-04 15:12 | `KrMK2b26-N` | game-1775315560515-gldr82sqc |  | "authentication lost " | _____ | _____ | _____ |
| 2026-04-04 12:15 | `cpCVR9ig9H` | game-1775304749590-9h8pnwhnv | 3 | i cant choose my own cards as it shows a message saying that my session has expired. The UI is very pretty, ut not being able to choose t... | _____ | _____ | _____ |
| 2026-04-04 08:35 | `V-1L8Lg7c1` | game-1775291342243-i2cmcwu1r | 13 | Goliath isn't triggering properly at end of turn - it only draws the player who owns it (in this case, the AI) up to 2, not both sides. | _____ | _____ | _____ |
| 2026-04-04 08:24 | `bBRvnwB9w1` | game-1775290872285-d12s0dm7q |  | My side of the board keeps showing an overlay saying “AUTHENTICATION LOST Your session expired” requesting to refresh in order to reload.... | _____ | _____ | _____ |
| 2026-04-03 11:43 | `ovI-tQLNZB` | game-1775216509080-628xfrfvt | 4 | Royal guard automatic +1 for draw isn't working. | _____ | _____ | _____ |
| 2026-04-02 22:25 | `1QDqnRBEXS` | game-1775168132182-062ld4b4j | 17 | Bambi effect isn't work, you can't get cards!!  Goliath only work's for person which play the goliath | _____ | _____ | _____ |
| 2026-04-02 03:26 | `QfEjaYs4w0` | game-1775099899513-ngg3m9eux | 7 | cannot move second character  prince john into location hidden cove, option is not available to "move to location" under prince john high... | _____ | _____ | _____ |
| 2026-04-01 18:28 | `iI6DC5la-U` | game-1775067363882-ec35h14ba | 19 | White Hot Agony Plains - Effect isnt working | _____ | _____ | _____ |
| 2026-04-01 02:24 | `m4gCWt-B5M` | game-1775009384884-y3fdsgev8 | 9 | Couldn't resolve Angel Effect after playing her. Also couldn't choose a target after questing with Mad Hatter. | _____ | _____ | _____ |
| 2026-03-31 01:59 | `ybMyGjytPZ` | game-1774922141971-2lmuzjucg | 9 | Unable to boost cards | _____ | _____ | _____ |
| 2026-03-30 22:19 | `SyXeR-Elk9` | game-1774908031114-9h0qqha8e | 23 | cannot target opponent with Basil - Detective | _____ | _____ | _____ |
| 2026-03-30 18:05 | `AJdOgFSkzr` | game-1774893703679-4gy3eetjt | 7 | won't let me use angels good aim ability | _____ | _____ | _____ |
| 2026-03-30 14:50 | `WM8YzEDmJz` | game-1774872952014-6ezstru6z |  | Buuugggg | _____ | _____ | _____ |
| 2026-03-24 15:18 | `tjaB7-q9Xl` |  |  | THe very first bug repot!!!! | _____ | _____ | _____ |

### singletons / vague-or-insufficient (3)

| Created | id | gameId | turn | description | Card? | Decision | Notes |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| 2026-05-12 20:17 | `FcVYxbu-Gs` | mgL7_Q1RcwuxvNnOFTzccJf |  | error | _____ | _____ | _____ |
| 2026-05-12 20:13 | `2kTs0gBWXg` | mgdHjcrH9hj1svQFGLWlqmP |  | error | _____ | _____ | _____ |
| 2026-04-07 18:44 | `7NDsfi_3rm` | game-1775586745583-ulvtyvdvu | 23 | TEst | _____ | _____ | _____ |

---

## Out-of-engine-scope (52)

These are auto-classified as out-of-scope for the card-rules engine. They still
need a human owner (network / matchmaking / UI / replay UI / undo / chat / timer /
client-crash). Confirm the routing; reports listed here will not be reopened as
engine bugs unless re-classified.

### out-of-engine-scope (skip-ability UX) (9)

| Created | id | gameId | description | Confirm route | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-05-15 18:06 | `ENdmvxnHxI` | mg0n4NlhZUhVmxDlNAMtid8 | Can't skip ability | _____ | _____ |
| 2026-05-11 22:06 | `1649dELkLg` | mgrqzPSrq6-8uFZk8Heeb9s | Unable to skip effect of Got me Monologuing from Syndrome - Out for Revenge, no targets in discard and could not resolve effect or pass turn | _____ | _____ |
| 2026-05-02 06:28 | `uLP9v6flbm` | game-1777702543465-g63017a4i | When Goofy moves and his ability to move another character is triggered. Another character can be selected, but the location cannot be se... | _____ | _____ |
| 2026-04-28 07:19 | `L4RQOCh7_T` | mgSqI3VY2WaD6k3mkuXOn5F | Cannot skip effect on Roller Bob - Sid's Toy and stuck on resolve screen | _____ | _____ |
| 2026-04-25 08:13 | `hoUr9S7GKt` | game-1777104198441-n2bgd9tof | When passing turn with new elenor card, it wouldn't let me pass turn at all even though the effect of her card couldn't work  No ability ... | _____ | _____ |
| 2026-04-22 20:31 | `qillZINjZZ` | game-1776888310136-zp6zvrcw7 | Wrack it ralph with a boost did not kill opponent ISIS on 4 strength.  Cheshire cat can't resolve ability when opponent has no character,... | _____ | _____ |
| 2026-04-21 21:28 | `JcCMoKmGrs` | game-1776806535174-b5dyzq2qw | Won't let me skip effect | _____ | _____ |
| 2026-04-18 17:12 | `Kvm6Ncwp8P` | game-1776530934897-kfmt12jkh | Tips is not a required effect.  Skip effect is not working | _____ | _____ |
| 2026-04-14 17:43 | `HI88mQN1LD` | game-1776187568121-u6ubtkzyf | belle accomplish mystic, i dont have decision to skip trigger. also same as madam mim, i don't have option to skip trigger | _____ | _____ |

### out-of-engine-scope (chat UX) (9)

| Created | id | gameId | description | Confirm route | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-05-13 09:52 | `5JszXsQOH0` | mgbZ8izr0U-O-6oI7e5uMfT | the free text mode isn't there after the request | _____ | _____ |
| 2026-05-12 02:03 | `JtkAAyrE9l` | mgmf44J655NjvkYIc6zvvJx | The free chat doesnt allow any typing..... | _____ | _____ |
| 2026-05-08 00:29 | `BCGjbrWQ3l` | mgOT_NLuC8zmeYBFL6TjHBQ | There is no where to type when free text mode is enabled | _____ | _____ |
| 2026-05-07 15:56 | `tdRX1OixFN` | mgdddRW5-bjveeCBHigmy4g | Free chat is not working | _____ | _____ |
| 2026-05-06 19:47 | `XvN8gzNsPY` | mgPOcu3fTeyBhgirl5MlsLN | Text free chat (and the normal preset chat buttons) are not working. | _____ | _____ |
| 2026-04-28 00:18 | `8zb3lc6xkm` | mgRluKm4GEpdWHgoJYK_y5A | free chat enablement not really working. i requeted it, it popped up saying enabled, but is not really enabled | _____ | _____ |
| 2026-04-27 18:40 | `zOi0nc2jvM` | mgbXy4KcKJdQblHs8oCTL2z | My opponent is trying to request free chat, but when I hit accept, it will not allow us to connect and talk. | _____ | _____ |
| 2026-04-26 22:42 | `AZwvn8W_u_` | mgvmSfgbQNb0zouaJ7QwMLs | cannot use Free Text mode anymore. opponnet accepted, but then there's no box to it | _____ | _____ |
| 2026-04-23 18:50 | `YaAr3HZ6_a` | game-1776969625929-x0m2cw3ut | Can't type into the text box after free chat was enabled. Will try rebooting client as Giratinna suggested. Game locked up when using Had... | _____ | _____ |

### out-of-engine-scope (client crash) (9)

| Created | id | gameId | description | Confirm route | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-05-12 17:46 | `12kjwa8za6` | game-1778607243745-xv99rjhws | i think the bot boosted it's Chesire cat but had no means to use its ability and i think it crashed and wouldn't let me dismiss the bot s... | _____ | _____ |
| 2026-05-11 02:53 | `LYYXvDy5Os` | game-1778467841976-5hgaalm01 | Frozen can't ink a card? | _____ | _____ |
| 2026-05-03 04:26 | `xnpRZGGGtj` | game-1777781932851-t13nxogb5 | Game froze on Cheshire | _____ | _____ |
| 2026-04-28 22:13 | `08sXbsckWK` | mgweh0NfXBkEIdSm_CPHURU | Have not been gaining lore from my location, should have lore from The frozen vine, have been at 9 lore for a while, even after questing. | _____ | _____ |
| 2026-04-22 01:26 | `YuUAnkViq6` | game-1776820392945-r907dmrqp | After playing the Cheshire Cat the bot crashed and didn't end it's turn. | _____ | _____ |
| 2026-04-16 12:34 | `Tu9I5rhWXE` | game-1776341994363-qp5jqtnbq | Elsa Spirit of Winter isn't working correctly. Opponent has nothing on the board, when i play Elsa it still wants me to freeze and exert ... | _____ | _____ |
| 2026-04-15 01:48 | `C-cYufhhvW` | game-1776216621273-n2aj5o46w | Cheshire cat trigger froze in Bot mode | _____ | _____ |
| 2026-04-14 10:44 | `8siKmOSMQ3` | game-1776162481447-0hdg9f7ax | Big elsa, says exert and freeze up to one. Ward on the other side, won't let me skip the effect when I should be able to. I can't move th... | _____ | _____ |
| 2026-04-09 18:10 | `LDKbPI4jdK` | game-1775757439225-udzyupbl2 | Goliath does not trigger draw card for the adverse player and is not affected by the « freeze » if the player has 3 cards in his hand at ... | _____ | _____ |

### out-of-engine-scope (undo UX) (8)

| Created | id | gameId | description | Confirm route | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-05-15 23:26 | `kAbZSMCD9g` | mgnrW2zV1fBJL4nSF73Ahqu | Unable to select Luisa for her ability as the target. Forces me to pick another character on my board. Even then I still can't resolve by... | _____ | _____ |
| 2026-04-27 23:18 | `Cl5kbfxKpR` | mg-Lgst4D6eb9bo2jcqv5Rf | unable to undo whole turne | _____ | _____ |
| 2026-04-27 14:18 | `3Lq-Yz1SFq` | mgB48KViV8Q8qTlB4ZRcDt1 | Can't undo a move. Sang MMS with Cinderella and it didn't work. Then played Philip and I tried undoing it but it wouldn't work | _____ | _____ |
| 2026-04-22 06:56 | `DZopjrkkqd` | game-1776840096867-34un4ivva | game played my prince phillip and wouldn't undo to let me shift him | _____ | _____ |
| 2026-04-20 07:46 | `PHQ9BeqSlQ` | game-1776670372155-q9r11skg1 | wrong level doesn't explain which is option 1 and option 2 and if you use it wrong, undo won't undo using the card entirely, only half way. | _____ | _____ |
| 2026-04-18 07:14 | `ds8JNpK1Sp` | game-1776496151729-ppfl7fbc5 | Can't undo my turn completely | _____ | _____ |
| 2026-04-16 04:26 | `ptPc9sxqqq` | game-1776312521037-uix3azsg4 | Cannot undo when an action/ability has been used. example laid willow, triggered +1 strength to lady, hit undo to not lay willow and it w... | _____ | _____ |
| 2026-04-13 03:35 | `uct3LZgCAE` | game-1776050797964-anfqnzggj | Will not pop up for me to confirm an undo for opponent | _____ | _____ |

### out-of-engine-scope (network) (8)

| Created | id | gameId | description | Confirm route | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-05-14 08:56 | `ShKcI0k1B2` | mgoqHKRqYqeEzrrXHA4ocQw | "Drop opponent" after disconnect does not work. He has no time left and still nothing happens when clicking "Drop opponent"... | _____ | _____ |
| 2026-04-30 01:39 | `2lzXNzncuP` | mg0RXalY1O8BLa4aZ7rP1k1 | No connection lost , but booted from game for connecting loss | _____ | _____ |
| 2026-04-18 19:21 | `SgQf6OyhxA` | game-1776539660083-pvfjxv9ss | authentication connection | _____ | _____ |
| 2026-04-08 23:51 | `jnC9I68G6e` | game-1775691895560-0xypw3pm5 | Opponent loses connection and I am unable to leave match. | _____ | _____ |
| 2026-04-08 14:26 | `7EMbtURs1o` | game-1775657894822-1n7e2en1c | Disconnect screen is on and player is still connected | _____ | _____ |
| 2026-04-08 02:26 | `mxz04RzOyS` | game-1775615087675-fapff3zb8 | I'm getting an error that says need to reconnect via refresh and I cannt play my hand. | _____ | _____ |
| 2026-04-07 14:10 | `weVp0MVGOU` | game-1775570679217-qsa9speqm | game keeps losing connection to the server but the game seems to still play, able to ink and play cards but cannot use characters abilities | _____ | _____ |
| 2026-04-04 22:38 | `3f822X-cSE` | game-1775342176861-bn4iqyceo | Cannot get rid of the authentication lost please refresh error. Have tried different devices different internet connection logging out an... | _____ | _____ |

### out-of-engine-scope (timer) (4)

| Created | id | gameId | description | Confirm route | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-05-07 17:36 | `miKi1v0Sr4` | mgmrt158ncs3tDVYzQF_pOo | Opponent's are not able to resolve Kida's FLOOD OF POWER ability. It causes them to time out and lose the game instead of being resolved. | _____ | _____ |
| 2026-05-06 18:17 | `cYvQBPP5FG` | mgubX6XsysJtGVwXviCj86L | Time out due to Sid triggering and could not choose my own character to banish. | _____ | _____ |
| 2026-05-06 16:34 | `ntGAVoPm3h` | mgzKmOchPWfTofm62EmaL7V | Be king undisputed wont let opponent choose a card. It makes it so they have to time out because they cant do anything. | _____ | _____ |
| 2026-04-08 22:54 | `uLHKrmk8LD` | game-1775688067364-2q0w64wru | Am I missing something? Did i just wait 10  mins for his timer to run out so I cant actually drop him for being over on time? Where is th... | _____ | _____ |

### out-of-engine-scope (matchmaking) (4)

| Created | id | gameId | description | Confirm route | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-05-04 06:07 | `LJjkHys5wj` | mgcQXVLd3PEOEcXLSje_txD | Copper- Hound Pup will not resolve and ends up in an endless loop. The pop-up says no cards are available (even when the opponent has an ... | _____ | _____ |
| 2026-04-26 04:39 | `Vku3gIUhLs` | mga4k-vCkTJEnwdbzqEYFCN | Mobile version stuck at end of match won’t give option to return to matchmaking | _____ | _____ |
| 2026-04-15 01:33 | `xp1gQk4ucj` | game-1776214419148-7y9su6y1j | Not letting me back onto matchmaking | _____ | _____ |
| 2026-04-08 14:21 | `TvpTGK9OzA` | game-1775656855030-kgag4yqx4 | opponent dc'd and i dont see a "return to matchmaking button" | _____ | _____ |

### out-of-engine-scope (replay UI) (1)

| Created | id | gameId | description | Confirm route | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-05-15 02:14 | `8aNmUG8o6c` | mgeA68vsRB8DJ_PlUEkybeQ | Save Replay and Download replay buttons not working at the end of the game | _____ | _____ |

---

## Done? 

Every entry above should end with a ticked decision box (or a filled-in
singleton row). When all are ticked:

- Re-run `python3 .triage/classify.py` after adding any new fix commits.
- Update the resolution status in the prod DB (set `status` to `resolved` and
  populate `resolution_note`).
- Re-render `bug_reports_triage.md` with `python3 .triage/render.py` if you want
  the read-only summary refreshed.
