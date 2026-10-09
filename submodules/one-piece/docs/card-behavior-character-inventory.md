# One Piece Character Behavior Inventory

Generated from the exported card catalog in canonical ID order. Re-running
`bun scripts/generate-card-behavior-queue.ts character` preserves reviewed
verified evidence and unresolved gap notes, refreshes pending timing hints, and
reconciles catalog entries.

| Canonical ID | Card                                            | Status  | Behavior or next evidence                                                |
| ------------ | ----------------------------------------------- | ------- | ------------------------------------------------------------------------ |
| EB01-002     | Izo                                             | verified | On Play rested-DON!! count and recipient; compound Leader trait; opponent-attack hand cost and opposing power target                                                                                     |
| EB01-003 | Kid & Killer | verified | whenAttacking |
| EB01-004     | Koza                                            | verified | Active-Leader -5000 power activation cost; optional opposing Character -3000 power target                                                                                                                |
| EB01-005     | Doma                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB01-006     | Tony Tony.Chopper                               | verified | Public Blocker selection and retarget; DON!! x2 When Attacking opposing Character power reduction                                                                                                        |
| EB01-007     | Yamato                                          | verified | Once-per-turn rested-DON!! count; Leader-or-Character recipient mapping and attachment                                                                                                                   |
| EB01-008     | LittleOars Jr.                                  | verified | Effect-only K.O. replacement; Event-or-Stage payment mapping; battle K.O. exclusion                                                                                                                      |
| EB01-012     | Cavendish                                       | verified | On Play and When Attacking rested-DON!! count; compound Leader type; source exclusion and second-copy boundary                                                                                           |
| EB01-013     | Kouzuki Hiyori                                  | verified | Self-trash cost; included Land of Wano type and name/cost filters; effect-play choice followed by draw                                                                                                   |
| EB01-014     | Sanji                                           | verified | DON!! x1 and your-turn conditions; live power per complete group of 3 rested DON!! cards                                                                                                                 |
| EB01-015     | Scratchmen Apoo                                 | verified | Opposing Character ownership and up-to-2-cost rest target mapping                                                                                                                                        |
| EB01-016     | Bingoh                                          | verified | Self-rest cost; opposing rested 1-cost Character mapping and K.O.                                                                                                                                        |
| EB01-017     | Blueno                                          | verified | Blocker decision retargets the attack and resolves battle against Blueno                                                                                                                                 |
| EB01-018     | Mountain God                                    | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB01-022     | Inazuma                                         | verified | End of Your Turn draws 2 at the two-card hand boundary only                                                                                                                                              |
| EB01-023     | Edward Weevil                                   | verified | On Play draws 1 after paying the Character's DON!! cost                                                                                                                                                  |
| EB01-024     | Hamlet                                          | verified | At four cards, all own SMILE Characters including Hamlet gain +1000                                                                                                                                      |
| EB01-025     | Fourtricks                                      | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB01-026     | Prince Bellett                                  | verified | DON!! x1 attack can return an eligible Character owned by either player                                                                                                                                  |
| EB01-027     | Mr.1(Daz.Bonez) | verified | On Play draw-2/discard-1; live +1000 per complete pair of trashed Events                                                                                                                                 |
| EB01-031     | Kalifa                                          | verified | DON!! -1 then up-to-2 low-cost Character recovery from trash                                                                                                                                             |
| EB01-032     | Army Wolves                                     | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB01-033     | Blueno                                          | verified | DON!! -1; included Water Seven cost-5 play mapping across hand and trash                                                                                                                                 |
| EB01-034     | Ms. Wednesday                                   | verified | Opponent-attack DON!! recycling into active DON!! followed by Blocker                                                                                                                                    |
| EB01-035     | Ms. Monday                                      | verified | Life Trigger DON!! payment plays itself, then maps On Play power target                                                                                                                                  |
| EB01-036     | Minochihuahua                                   | verified | Rush attack plus battle K.O. maps rested DON!! recovery                                                                                                                                                  |
| EB01-037     | Mr. 9                                           | verified | Opponent attack auto-pays DON!! -1, maps low-cost K.O., and gates once                                                                                                                                   |
| EB01-041     | Crocus                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB01-042     | Scarlet                                         | verified | Trashes itself, plays Dressrosa rested, then reduces cost before On Play                                                                                                                                 |
| EB01-043     | Spandine                                        | verified | Ordered 3-card included-CP trash cost then filtered rested trash play                                                                                                                                    |
| EB01-044     | Funkfreed                                       | verified | Rests itself and maps only Spandam for the turn power bonus                                                                                                                                              |
| EB01-045     | Brook                                           | verified | Effective cost-0 condition grants Rush for a same-turn public attack                                                                                                                                     |
| EB01-046     | Brook                                           | verified | On Play and When Attacking each reduce cost before mapping a cost-0 K.O.                                                                                                                                 |
| EB01-047     | Laboon                                          | verified | Self battle K.O. still draws then maps the mandatory hand discard                                                                                                                                        |
| EB01-048     | Laboon                                          | verified | Rests itself and maps an opponent Character for -4 cost this turn                                                                                                                                        |
| EB01-049     | T-Bone                                          | verified | On Play maps only opponent Characters with cost 2 or less for K.O.                                                                                                                                       |
| EB01-052     | Viola                                           | verified | Reorders opposing Life, flips own Life face-down, and blocks                                                                                                                                             |
| EB01-053     | Gastino                                         | verified | Chooses opposing Life position and maps two Trigger power targets                                                                                                                                        |
| EB01-054     | Gan.Fall                                        | verified | Life-count-gated low-cost K.O. and public Blocker mapping                                                                                                                                                |
| EB01-055     | Charlotte Compote                               | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB01-056     | Charlotte Flampe                                | verified | Pays optional top/bottom Life-to-hand cost before drawing                                                                                                                                                |
| EB01-057     | Shirahoshi                                      | verified | Blocks; only effect K.O. adds top deck to Life                                                                                                                                                           |
| EB01-058     | Mont Blanc Cricket                              | verified | DON!!, Life, and turn gates apply its live power bonus                                                                                                                                                   |
| EB01-061     | Mr.2.Bon.Kurei(Bentham)                        | verified | Adds active DON!! and copies a chosen opposing Character's current power; official rules name enforces same-name revival exclusion |
| EB02-001     | Karoo                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB02-002     | Sabo                                            | verified | Rests itself and maps another included Revolutionary Army target                                                                                                                                         |
| EB02-003     | Tony Tony.Chopper                               | verified | Gives rested DON!! then gains opponent-turn power with DON!! x2                                                                                                                                          |
| EB02-004     | Don Accino                                      | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB02-005     | Fake Straw Hat Crew                             | verified | Public turn handoff switches its power from +2000 to -2000                                                                                                                                               |
| EB02-006     | Yamato                                          | verified | Leader trait-or-name gate; rested-DON!! transfer; same-turn Rush attack                                                                                                                                  |
| EB02-011     | Arlong                                          | verified | Compound Leader gate; rested-DON!! transfer; attack, rest-cost, and Blocker prevention                                                                                                                   |
| EB02-012     | Gaimon                                          | verified | Sarfunkel-gated permanent Blocker through the public battle choice                                                                                                                                       |
| EB02-013     | Carrot                                          | verified | Three-DON!! gate; private top-7 Zou search/order; revealed Zou hand play                                                                                                                                 |
| EB02-014     | Sarfunkel                                       | verified | Gaimon-only hand-play candidate mapping and effect-driven play                                                                                                                                           |
| EB02-015     | Jewelry Bonney                                  | verified | Rested-Character freeze; source-independent end-turn DON!! activation                                                                                                                                    |
| EB02-016     | Chopperman                                      | verified | Compound Animal hand play; alternate Tony Tony.Chopper rules name                                                                                                                                        |
| EB02-017     | Nami                                            | verified | Compound Straw Hat search, Nami exclusion, and ordered bottom remainder                                                                                                                                  |
| EB02-018     | Buggy                                           | verified | No-other-name Double Attack boundary and cost-filtered Life Trigger rest                                                                                                                                 |
| EB02-019     | Roronoa Zoro                                    | verified | Compound Leader rest; live two-Character Rush: Character boundary                                                                                                                                        |
| EB02-022     | Usopp                                           | verified | Self-inclusive power threshold and printed no-base-effect hand play                                                                                                                                      |
| EB02-023     | Crocodile                                       | verified | Self-caused opposing return, top-3 order/position, and once per turn                                                                                                                                     |
| EB02-024     | Sogeking                                        | verified | Ordered hand bottom, either-field return, and alternate Usopp identity                                                                                                                                   |
| EB02-025     | Donquixote Rosinante                            | verified | Atomic DON!!/self-rest costs and rested cost-2 top-5 Character play                                                                                                                                      |
| EB02-026     | Nefeltari Vivi                                  | verified | Multicolor Leader and exact post-play five-card hand draw boundary                                                                                                                                       |
| EB02-027     | Vista                                           | verified | Current-power-1000 opposing target and owner-deck bottom placement                                                                                                                                       |
| EB02-028     | Portgas.D.Ace                                   | verified | Compound Leader gate, cost-2 search/order, and rested hand play                                                                                                                                          |
| EB02-029     | Grandpa Ryu                                     | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB02-032     | Iceburg                                         | verified | Three-DON!! field gate, seven-card name search/order, and Stage play                                                                                                                                     |
| EB02-033     | Klabautermann                                   | verified | Merry Go-gated permanent Blocker through public battle interaction                                                                                                                                       |
| EB02-034     | Komei                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB02-035 | Sanji & Pudding | verified | whenDonReturned, onPlay |
| EB02-036     | Nico Robin                                      | verified | Blocker K.O., optional chosen DON!! return, and compound-type search                                                                                                                                     |
| EB02-037     | Franky                                          | verified | Compound Leader and DON!! comparison gates at both printed timings                                                                                                                                       |
| EB02-038     | Magellan                                        | verified | Up-to hand play with compound Impel Down type and cost boundary                                                                                                                                          |
| EB02-042     | All-Hunt Grount                                 | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB02-043     | Jonathan                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB02-044     | Sengoku                                         | verified | Included Navy rested trash play filters and public Blocker interaction                                                                                                                                   |
| EB02-045     | Trafalgar Law                                   | verified | Ordered optional trash cost, both choices, and opponent-owned discard                                                                                                                                    |
| EB02-046     | Hildon                                          | verified | Top-two deck trash, optional −1 cost target, and turn expiration                                                                                                                                         |
| EB02-047     | Blueno                                          | verified | Atomic hand/self-trash costs and included CP cost/name/category play filters                                                                                                                             |
| EB02-048     | Brook                                           | verified | Laboon trash recovery and On K.O. hand play                                                                                                                                                              |
| EB02-049     | Monkey.D.Garp                                   | verified | Rested DON!! count/Leader recipient and self-rest cost-1 K.O. boundary                                                                                                                                   |
| EB02-052     | Enel                                            | verified | Conditional Rush; post-cost Life gate covers both top-deck Life and power                                                                                                                                     |
| EB02-053     | Myskina Olga                                    | verified | Private either-owner top-Life look and top/bottom placement at both timings                                                                                                                              |
| EB02-054     | Sanji                                           | verified | Two-Life draw/trash mapping and public Blocker interaction                                                                                                                                               |
| EB02-055     | Jinbe                                           | verified | Included Fish-Man Leader/Life boundary and physical Trigger-card play                                                                                                                                    |
| EB02-056     | Vegapunk                                        | verified | Scientist search/play filters, bottom order, conditional trash, Blocker, and Trigger draw                                                                                                                |
| EB02-057     | Mad Treasure                                    | verified | Top/bottom Life cost, opposing cost filter, and face-up Life placement                                                                                                                                   |
| EB02-061     | Monkey.D.Luffy                                  | verified | Conditional Rush, active-DON!!-only cost, restand, top-Life removal, and once limit                                                                                                                     |
| EB03-002     | Ain                                             | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB03-003     | Uta (SP)                                        | verified | Uta Leader draw-2 and printed no-base-effect power-6000 hand play                                                                                                                                        |
| EB03-004 | Carina | verified | Opponent-turn power and Blocker; real Shuraiya base-power copy removes the bonus |
| EB03-005     | Sugar                                           | verified | Compound Donquixote Pirates power boundary and rested effect play                                                                                                                                        |
| EB03-006 | Nami | verified | Active Leader power payment below zero draws; rested Leader cannot pay; turn expiry |
| EB03-007     | Baccarat                                        | verified | Public Blocker K.O. and printed no-base-effect power-6000 hand play                                                                                                                                      |
| EB03-008 | Hibari | verified | Koby permits self as active-Character attack recipient; actual same-turn attack and When Attacking choice |
| EB03-009     | Makino                                          | verified | Self-rest cost and printed no-base-effect Character power target                                                                                                                                         |
| EB03-010     | Monet                                           | verified | Low-power-Character-or-Event search/order and public Blocker interaction                                                                                                                                 |
| EB03-012     | Otama                                           | verified | Self-rest cost and player choice between opposing DON!! or Animal target                                                                                                                                 |
| EB03-013 | Carrot | verified | Play-turn only KO activation; skipping KO still plays physical Zou |
| EB03-014     | Kuina                                           | verified | Self-rest cost, optional 0-2 rested DON!! count, and Slash Leader attachment                                                                                                                             |
| EB03-015 | Camie | verified | Separate DON transfer and rest choices; zero eligible rested DON still permits rest |
| EB03-016     | Kouzuki Hiyori                                  | verified | Kouzuki Oden draw; self-trash and included Wano Leader DON!! attachment                                                                                                                                  |
| EB03-017 | Jewelry Bonney | verified | Supernovas gate covers both DON reactivation and next-turn rest prohibition; wrong Leader negative |
| EB03-018     | Tashigi                                         | verified | Opponent-turn Blocker/effect-K.O. protection and dual-cost end restand                                                                                                                                   |
| EB03-019     | Wanda                                           | verified | Public Blocker candidate, redirection, and rested state                                                                                                                                                  |
| EB03-021 | Alvida | verified | Simultaneous base-cost groups and owner ordering; reduced current-cost eight excluded from base-three target |
| EB03-022     | Isuka                                           | verified | Either-field cost-4 deck return and public Blocker interaction                                                                                                                                           |
| EB03-023     | Kaya                                            | verified | Five-card private deck order and chosen top-or-bottom placement                                                                                                                                          |
| EB03-024 | Nefeltari Vivi | verified | Declined Character play still restricts later play; DON retained on failed play; restriction expires next turn |
| EB03-025 | Hina | verified | Base-6000/current-7000 bounce eligibility; base-5000/current-6000 excluded |
| EB03-026 | Boa Hancock | verified | Self-bottom payment or another eligible Character; separate Leader and Character DON recipients |
| EB03-027     | Marguerite                                      | verified | Either-field exact-base-power return including the source                                                                                                                                                |
| EB03-028     | Yu                                              | verified | Chosen On Play discard and post-cost hand-gated self-trash draw                                                                                                                                          |
| EB03-030     | Viola                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB03-031     | Vinsmoke Reiju                                  | verified | DON!! -1 and filtered Event Main activation from trash                                                                                                                                                   |
| EB03-032 | Charlotte Flampe | verified | Named Leader or Character power target; physical Katakuri Leader bonus and turn expiry |
| EB03-033     | Charlotte Brulee                                | verified | Own-effect DON!! return provenance, Leader gate, rested add, once per turn                                                                                                                               |
| EB03-034     | Charlotte Linlin                                | verified | Ordered draw/hand top-deck/DON!! add and paid On K.O. top-deck Life add                                                                                                                                  |
| EB03-035     | Charlotte Pudding                               | verified | DON!! field comparison, rested DON!! add, and public Blocker interaction                                                                                                                                 |
| EB03-036     | Baby 5                                          | verified | Chosen DON!! return and up-to-two opposing base-cost K.O. selection                                                                                                                                      |
| EB03-037     | Lim                                             | verified | DON!!-field threshold, all own ODYSSEY targets, through-opponent-turn duration                                                                                                                           |
| EB03-039     | Ulti                                            | verified | Leader gate, draw then mandatory discard, effectless power-filtered trash play                                                                                                                           |
| EB03-040     | Kalifa                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| EB03-041     | Kujyaku                                         | verified | Optional included-type hand cost, draw 2, opponent-turn SWORD power boundary                                                                                                                             |
| EB03-042 | Koala | verified | On-KO included Nico Robin trash play or Revolutionary Army hand play; controller choice |
| EB03-043     | Stussy                                          | verified | Blocker, ordered included-type trash cost, opposing cost-filtered K.O.                                                                                                                                   |
| EB03-044 | Black Maria | verified | Real Onigashima Island selection; multicolor Leader Blocker; single-color negative with actual Life damage |
| EB03-045     | Perona                                          | verified | Blocker, optional rested DON!! attach, trash threshold, inclusive-type rested play                                                                                                                       |
| EB03-046     | Miss Doublefinger(Zala)                         | verified | Effective cost-0 or cost-8 field gate, draw, and top-two deck trash on K.O.                                                                                                                              |
| EB03-047     | Miss.Valentine(Mikita)                          | verified | Top-three deck trash on play and draw after battle K.O.                                                                                                                                                  |
| EB03-048 | Rebecca | verified | Search and play clauses; actual Blocker redirect and KO preserve Leader Life |
| EB03-050     | Conis                                           | verified | Correct counter/type metadata, inclusive Sky Island target, Double Attack, and duration cleanup                                                                                                          |
| EB03-051     | Charlotte Smoothie                              | verified | Face-up-Life gate, cost-2 opposing K.O. choice, and all-Life face-down result even after declining or finding no K.O. target                                                                                                                            |
| EB03-052     | Shirahoshi                                      | verified | Self-trash paid before Shirahoshi gate covers top-deck Life and all Neptunian +1000 power |
| EB03-053     | Nami                                            | verified | Rested DON!! transfer, opponent top-Life routing, face-up Life cost, filtered K.O. hand play                                                                                                             |
| EB03-054     | Nico Robin                                      | verified | Top-Life trash before optional replacement; hand-trash Trigger plays the same physical card                                                                                                              |
| EB03-055 | Nico Robin | verified | Life cost and included Leader gate; optional opponent-turn effect damage permits Life Trigger and wins at zero Life; synthetic keyword fixtures prove Banish/Double Attack exclusion |
| EB03-056     | Belo Betty                                      | verified | Optional top-Life face-up cost and opposing base-cost-3 K.O. target boundary                                                                                                                             |
| EB03-057     | Yamato                                          | verified | Inclusive Land of Wano Leader DON!! transfer and opposing top-Life trash on K.O.                                                                                                                         |
| EB03-058 | Lilith | verified | Main and Life Trigger gates; wrong-Leader Trigger leaves card unplayed |
| EB03-059 | S-Snake | verified | Paid play and Life condition; wrong Leader and one-Life negatives retain eligible hand card |
| EB03-061     | Uta (Manga)                                     | verified | Once-per-turn DON!! activation, mixed opposing rest target even with no own rested DON!!, and paid FILM restand                                                                                                                        |
| EB03-062     | Trafalgar Law                                   | verified | Rush, hand/self-trash costs, top-deck Life add, and filtered Law hand play                                                                                                                               |
| EB04-002 | Jewelry Bonney | verified | onPlay |
| EB04-003 | Smoker & Tashigi | verified | Rush; opponent-turn base power 7000 applies only to Navy Leaders; non-Navy damage negative |
| EB04-004 | Zeff | verified | Printed behavior is unstructured |
| EB04-005 | Trafalgar Law | verified | Base-power target threshold excludes a lower-base card boosted to 5000; existing reactive and play clauses |
| EB04-006 | Moda | verified | onPlay |
| EB04-007 | Roronoa Zoro | verified | Leader +2000 through opponent turn; 8000 threshold grants Rush: Character, forbids Leader attacks, shared once-per-turn limit |
| EB04-011 | Scaled Neptunian | verified | Choice effect and Rush Character; active Character remains an illegal attack target |
| EB04-012     | Kikunojo - EB04-012                             | verified | Played-this-turn gate, included Land of Wano Leader restand, and once-per-turn limit                                                                                                                     |
| EB04-013 | Carrot | verified | Skip Character selection still readies Leader; wrong-Leader negative |
| EB04-014     | Kouzuki Sukiyaki                                | verified | Blocker and once-per-turn rested-DON!! transfer to an included Land of Wano Leader                                                                                                                       |
| EB04-015 | Jinbe - EB04-015 | verified | Printed rest payment excludes Jinbe itself; existing actual rest and subsequent result |
| EB04-016 | Bird Neptunian | verified | Ready prohibition stops Urouge End Turn effect and expires on later turn |
| EB04-017 | Mystoms | verified | Cost discount applies only after the third Minks Character actually enters play |
| EB04-018 | Megalo | verified | Real Moria-played rested Megalo cannot pay rest-this cost; normal activation retained |
| EB04-021     | Igaram                                          | verified | Vivi-gated draw/discard and once-per-turn discard-to-rested-DON!! transfer                                                                                                                               |
| EB04-022     | Issho - EB04-022                                | verified | Post-cost hand threshold, opponent-owned ordered hand bottom, and paid attack power target                                                                                                               |
| EB04-023     | Chaka & Pell - EB04-023                         | verified | Active-Leader power cost, draw 2, rested-cost rejection, and Double Attack                                                                                                                               |
| EB04-024     | Terracotta                                      | verified | Self-rest and hand-trash costs, included Alabasta target, and Unblockable                                                                                                                                |
| EB04-025 | Nefeltari Vivi | verified | On Play Alabasta hand play and opposing hand-bottom result; printed +1000 Counter prevents battle damage |
| EB04-026     | Bluegrass                                       | verified | Opposing cost-1 bottom-deck boundary and attack draw-before-trash ordering                                                                                                                               |
| EB04-027     | Boa Hancock - EB04-027                          | verified | On Play draw 2 then trash and filtered Life Trigger hand play                                                                                                                                            |
| EB04-030     | Kaido                                           | verified | DON!! −2 paid before Leader trait gates both Rush and opposing rest; battle replacement retained |
| EB04-031     | King                                            | verified | No-other-King gate, active/rested DON!! adds, once per turn, and battle K.O. replacement                                                                                                                 |
| EB04-032     | Queen                                           | verified | Included-type hand cost and draw; post-cost Leader gate and rested DON!! add                                                                                                                             |
| EB04-033     | Groggy Monsters                                 | verified | DON!! return cost, included Foxy Pirates count, and base-power K.O. boundary                                                                                                                             |
| EB04-034 | Charlotte Pudding | verified | Fourth Event in trash after attack payment enables same-battle power; expiry and Blocker |
| EB04-035     | Hitokiri Kamazo                                 | verified | Blocker and Leader-gated once-per-turn rested DON!! add after DON!! return                                                                                                                               |
| EB04-036     | Foxy                                            | verified | DON!! return paid before Foxy Pirates gate covers draw, hand trash, and rest; separate DON!! ability retained |
| EB04-037     | Porche                                          | verified | Leader-gated included-trait search, reveal-to-hand, and ordered deck-bottom remainder                                                                                                                    |
| EB04-038 | Rosinante & Law | verified | Both printed alternate names work with real named consumers; unrelated card excluded; actual Blocker; equal/higher-DON draw and addition |
| EB04-039     | Eustass"Captain"Kid - EB04-039                  | verified | Active DON!! add and optional self-trash to play an included Kid Pirates Character                                                                                                                       |
| EB04-042 | Alpha | verified | onPlay |
| EB04-043 | Kaku | verified | onPlay, replacement |
| EB04-044 | Koby | verified | Included Navy Leader permits Former Navy replacement; shared turn limit and non-Navy negative; printed On KO draw |
| EB04-045 | Ginny | verified | Optional rest cost before both-field base-cost-6 count; own/split/opponent field cases, wrong threshold, decline, repeated activation |
| EB04-046 | Doll | verified | permanent |
| EB04-047 | Helmeppo | verified | activateMain |
| EB04-048 | Rob Lucci | verified | onPlay |
| EB04-051 | Emet | verified | Only an eligible 12000-power Character enables attack; a Leader cannot satisfy it; Life Trigger retained |
| EB04-052 | Sanji | verified | whenAttacking, onKo |
| EB04-053 | Sentomaru | verified | onBlock |
| EB04-054 | Bartholomew Kuma | verified | Actual On Play top-deck-to-Life at two Life; three-Life negative; On KO opposing Life-to-hand result |
| EB04-055 | Bartholomew Kuma | verified | On KO Character play; actual Life Trigger at combined five versus six; wrong-Leader negative |
| EB04-056 | Pacifista | verified | permanent |
| EB04-057 | Vegapunk | verified | permanent |
| EB04-058 | Borsalino | verified | Life On Play threshold and actual Blocker interception |
| EB04-061 | Monkey.D.Luffy | verified | Actual nine/ten-DON payment by Life threshold; discard grants Leader power and actual Blocker; both expire; decline retained |
| OP01-004     | Usopp                                           | verified | DON!!-attached opponent Event trigger and once-per-turn draw limit                                                                                                                                       |
| OP01-005     | Uta                                             | verified | Filtered red non-Uta trash recovery with cost and category boundaries                                                                                                                                    |
| OP01-006     | Otama                                           | verified | Opponent Character power reduction and end-of-turn cleanup                                                                                                                                               |
| OP01-007     | Caribou                                         | verified | Battle K.O. provenance and opponent power-bounded On K.O. target                                                                                                                                         |
| OP01-008     | Cavendish | verified | Optional top-Life cost, physical card recovery, and conditional Rush                                                                                                                                     |
| OP01-009     | Carrot                                          | verified | Life Trigger plays the resolving physical Character card                                                                                                                                                 |
| OP01-010     | Komachiyo                                       | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-011     | Gordon                                          | verified | Optional ordered hand-to-bottom cost before draw                                                                                                                                                         |
| OP01-012     | Sai                                             | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-013     | Sanji                                           | verified | Official top-Life cost, turn power, rested DON!! transfer, and once per turn                                                                                                                             |
| OP01-014     | Jinbe                                           | verified | Blocker, attached-DON On Block timing, filtered hand play, and battle resume                                                                                                                             |
| OP01-015     | Tony Tony.Chopper                               | verified | Attached-DON attack, hand-trash cost, and included-trait trash recovery                                                                                                                                  |
| OP01-016     | Nami                                            | verified | Included Straw Hat search, self-name exclusion, reveal, and remainder ordering                                                                                                                           |
| OP01-017     | Nico Robin                                      | verified | DON!! x1 When Attacking; opposing current-power filter; selected Character K.O.                                                                                                                          |
| OP01-018     | Hajrudin                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-019     | Bartolomeo                                      | verified | Public Blocker retarget; DON!! x2 opponent-turn power and Refresh cleanup                                                                                                                                |
| OP01-020     | Hyogoro                                         | verified | Optional self-rest cost; own Leader-or-Character power target and turn cleanup                                                                                                                           |
| OP01-021     | Franky                                          | verified | Permanent DON!! x1 active-Character attack permission and missing-DON rejection                                                                                                                          |
| OP01-022     | Brook                                           | verified | DON!! x1 When Attacking; 0–2 opposing power targets and turn cleanup                                                                                                                                     |
| OP01-023     | Marco                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-024     | Monkey.D.Luffy                                  | verified | Once-per-turn 0–2 rested DON!! grant; Strike Character battle K.O. protection; Strike Leader excluded                                                                                                                                 |
| OP01-025     | Roronoa Zoro                                    | verified | Rush permits a public attack on the turn this Character is played                                                                                                                                        |
| OP01-032     | Ashura Doji                                     | verified | DON!! x1 and exact two-rested-opponent threshold for live power bonus                                                                                                                                    |
| OP01-033     | Izo                                             | verified | On Play opposing ownership and up-to cost-4 Character rest filter                                                                                                                                        |
| OP01-034     | Inuarashi                                       | verified | DON!! x2 When Attacking optional rested-DON!! reactivation                                                                                                                                               |
| OP01-035     | Okiku                                           | verified | DON!! x1 When Attacking cost filter, rest result, and once-per-turn identity                                                                                                                             |
| OP01-036     | Otsuru                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-037     | Kawamatsu                                       | verified | Life Trigger activation plays the resolving physical card itself                                                                                                                                         |
| OP01-038     | Kanjuro                                         | verified | DON!! x1 attack K.O. of rested cost-2-or-less Character; active/high-cost/no-DON exclusions; On K.O. opponent-owned discard                                                                                                                                  |
| OP01-039     | Killer                                          | verified | Public Blocker; DON!! x1 and three-Character On Block draw boundary                                                                                                                                      |
| OP01-040     | Kin'emon                                        | verified | Oden-gated included-trait hand play; DON!! x1 included-trait ready target                                                                                                                                |
| OP01-041     | Kouzuki Momonosuke                              | verified | Optional DON!! and self-rest costs; included-trait search, reveal, and remainder order                                                                                                                   |
| OP01-042     | Komurasaki                                      | verified | DON!! payment before Oden gate; included-trait low-cost Character ready target                                                                                                                           |
| OP01-043     | Shinobu                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-044     | Shachi                                          | verified | Public Blocker; no-Penguin condition and physical Penguin hand play                                                                                                                                      |
| OP01-045     | Jean Bart                                       | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-046     | Denjiro                                         | verified | DON!! x1 and Oden gates; 0–2 rested DON!! reactivation when attacking                                                                                                                                    |
| OP01-047     | Trafalgar Law                                   | verified | Public Blocker; optional Character-return cost before low-cost hand play                                                                                                                                 |
| OP01-048     | Nekomamushi                                     | verified | On Play opposing ownership, cost-3 filter, and selected Character rest                                                                                                                                   |
| OP01-049     | Bepo                                            | verified | DON!! x1 attack; included Heart Pirates, cost, and self-name hand filters                                                                                                                                |
| OP01-050     | Penguin                                         | verified | Public Blocker; no-Shachi condition and physical Shachi hand play                                                                                                                                        |
| OP01-051     | Eustass"Captain"Kid                             | verified | Self-rest low-cost hand play; opponent-turn DON!! attack-target lock                                                                                                                                     |
| OP01-052     | Raizo                                           | verified | Two-rested-Character attack draw threshold and once-per-turn identity                                                                                                                                    |
| OP01-053     | Wire                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-054     | X.Drake                                         | verified | On Play opposing rested cost-4 Character K.O. boundary                                                                                                                                                   |
| OP01-063     | Arlong                                          | verified | Opaque hand reveal gates controller-selected optional Life-to-deck-bottom                                                                                                                                |
| OP01-064     | Alvida                                          | verified | DON!! attack; chosen hand-trash cost before opposing cost-3 return                                                                                                                                       |
| OP01-065     | Vergo                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-066     | Krieg                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-067     | Crocodile                                       | verified | Public Banish and attached-DON!! blue Event hand-cost discount                                                                                                                                           |
| OP01-068     | Gecko Moria                                     | verified | Own-turn five-card hand threshold grants Double Attack                                                                                                                                                   |
| OP01-069     | Caesar Clown                                    | verified | On K.O. physical Smiley deck play followed by public deterministic shuffle                                                                                                                               |
| OP01-070     | Dracule Mihawk                                  | verified | On Play optional cost-7-or-less Character deck-bottom across either field                                                                                                                                |
| OP01-071     | Jinbe                                           | verified | On Play either-field low-cost deck-bottom; Life Trigger plays physical self                                                                                                                              |
| OP01-072     | Smiley                                          | verified | DON!! x1 own-turn power scales with current hand size                                                                                                                                                    |
| OP01-073     | Donquixote Doflamingo                           | verified | Public Blocker; chosen top-five order moves to chosen deck end                                                                                                                                           |
| OP01-074     | Bartholomew Kuma                                | verified | Public Blocker; optional filtered physical Pacifista hand play on K.O.                                                                                                                                   |
| OP01-075     | Pacifista                                       | verified | Public Blocker; unlimited-copy text remains a deck-construction boundary                                                                                                                                 |
| OP01-076     | Bellamy                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-077     | Perona                                          | verified | Chosen top-five order moves to the chosen deck end on play                                                                                                                                               |
| OP01-078     | Boa Hancock                                     | verified | Public Blocker; DON!! and five-card hand gates for attack/block draws                                                                                                                                    |
| OP01-079     | Ms. All Sunday                                  | verified | Public Blocker; Baroque Works-gated Event recovery on K.O.                                                                                                                                               |
| OP01-080     | Miss Doublefinger(Zala)                         | verified | On K.O. draws the exact deck-top card with visible count changes                                                                                                                                         |
| OP01-081     | Mocha                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-082     | Monet                                           | verified | Life Trigger plays the exact physical Monet card                                                                                                                                                         |
| OP01-083     | Mr.1 (Daz.Bonez)                                | verified | DON!!, turn, Leader, Event-pair, and floor-scaling power gates                                                                                                                                           |
| OP01-084     | Mr.2.Bon.Kurei(Bentham)                        | verified | DON!! attack included-trait Event search and ordered remainder bottom; official rules name enforces same-name revival exclusion |
| OP01-085     | Mr.3 (Galdino)                                  | verified | Leader-gated low-cost attack lock; own-turn and opponent-Counter expiry, including a synthetic extra turn                                                                                                                                  |
| OP01-092     | Urashima                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-093     | Ulti                                            | verified | Paid On Play adds the chosen rested DON!! from the DON!! deck                                                                                                                                            |
| OP01-094     | Kaido                                           | verified | Optional DON!! -6 acceptance and decline; Leader-gated all-other K.O.                                                                                                                                    |
| OP01-095     | Kyoshirou                                       | verified | On Play draw succeeds at eight field DON!! and fails at seven                                                                                                                                            |
| OP01-096     | King                                            | verified | DON!! −2; two independently bounded target groups selected before one K.O. |
| OP01-097     | Queen                                           | verified | DON!! -1 grants Rush and a turn-scoped opposing power reduction                                                                                                                                          |
| OP01-098     | Kurozumi Orochi                                 | verified | On Play full-deck SMILE search, candidate filtering, hand movement, and shuffle                                                                                                                          |
| OP01-099     | Kurozumi Semimaru                               | verified | Permanent Kurozumi Clan battle K.O. protection excludes every Semimaru copy                                                                                                                              |
| OP01-100     | Kurozumi Higurashi                              | verified | Public Blocker choice rests Higurashi and redirects the Leader attack                                                                                                                                    |
| OP01-101     | Sasaki                                          | verified | DON!! gate, optional chosen hand-trash cost, and optional rested DON!! add                                                                                                                               |
| OP01-102     | Jack                                            | verified | Exact DON!! return precedes opponent-owned physical hand discard choice                                                                                                                                  |
| OP01-103     | Scratchmen Apoo                                 | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-104     | Speed                                           | verified | Life Trigger plays the exact physical Speed card                                                                                                                                                         |
| OP01-105     | Bao Huang                                       | verified | Controller chooses two opaque opposing hand cards that become public                                                                                                                                     |
| OP01-106     | Basil Hawkins                                   | verified | Life Trigger plays physical self, then optional On Play rested DON!! add                                                                                                                                 |
| OP01-107     | Babanuki                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-108     | Hitokiri Kamazo                                 | verified | Battle K.O. pays DON!! -1, then K.O.s an optional cost-5-or-less target                                                                                                                                  |
| OP01-109     | Who's.Who | verified | DON!! x1, own-turn, and eight-field-DON!! permanent power boundaries                                                                                                                                     |
| OP01-110     | Fukurokuju                                      | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP01-111     | Black Maria                                     | verified | Blocker redirects, On Block returns DON!!, and turn power expires                                                                                                                                        |
| OP01-112     | Page One                                        | verified | Once-per-turn DON!! cost grants active-target attacks for one turn                                                                                                                                       |
| OP01-113     | Holedem                                         | verified | Battle K.O. offers optional rested DON!! from the DON!! deck                                                                                                                                             |
| OP01-114     | X.Drake                                         | verified | On Play DON!! return precedes opponent-owned chosen hand trash                                                                                                                                           |
| OP01-120     | Shanks                                          | verified | Rush attack excludes only power-2000-or-less Blockers from activation                                                                                                                                    |
| OP01-121     | Yamato                                          | verified | Kouzuki Oden rules name; Double Attack banishes two Life without Trigger                                                                                                                                 |
| OP02-003     | Atmos                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-004     | Edward.Newgate                                  | verified | On Play Leader boost and own-effect Life-to-hand lock; DON!! x2 attack K.O.                                                                                                                              |
| OP02-005     | Curly.Dadan                                     | verified | Choose zero to five before looking; red cost-1 Character search and chosen remainder order; saved-state/retry proof                                                                                                                                    |
| OP02-006     | Kingdew                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-007     | Thatch                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-008     | Jozu                                            | verified | DON!!, Life, and compound Leader-type gates grant same-turn Rush                                                                                                                                         |
| OP02-009     | Squard                                          | verified | Compound Leader gate, opposing power target, and top-Life-to-hand result                                                                                                                                 |
| OP02-010     | Dogura                                          | verified | Optional self-rest cost, red cost-1 hand play filters, and decline path                                                                                                                                  |
| OP02-011     | Vista                                           | verified | Opposing power-3000 K.O. boundary and ineligible-target exclusion                                                                                                                                        |
| OP02-012     | Blenheim                                        | verified | Public Blocker selection, Leader-attack redirect, and battle K.O.                                                                                                                                        |
| OP02-013     | Portgas.D.Ace                                   | verified | Up-to-two power targets, compound Leader Rush gate, and no-Rush boundary                                                                                                                                 |
| OP02-014     | Whitey Bay                                      | verified | DON!! x1 active-Character attack permission and no-DON rejection                                                                                                                                         |
| OP02-015     | Makino                                          | verified | Optional self-rest, red cost-1 target filter, power duration, and decline                                                                                                                                |
| OP02-016     | Magura                                          | verified | Own red cost-1 target ownership/filtering and turn-scoped power                                                                                                                                          |
| OP02-017     | Masked Deuce                                    | verified | DON!! x2 attack gate and opposing power-2000 K.O. boundary                                                                                                                                               |
| OP02-018     | Marco                                           | verified | Blocker, filtered hand cost, post-cost Life gate, and rested self-replay                                                                                                                                 |
| OP02-019     | Rakuyo                                          | verified | DON!! x1, controller-turn boundary, and inclusive all-Character power                                                                                                                                    |
| OP02-020     | LittleOars Jr.                                  | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-027     | Inuarashi                                       | verified | All-DON-rested gate and opponent-effect removal protection boundary                                                                                                                                      |
| OP02-028     | Usopp                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-029     | Carrot                                          | verified | End-of-turn controller choice and up-to-one rested DON!! reactivation                                                                                                                                    |
| OP02-030     | Kouzuki Oden                                    | verified | Once-per-turn restand cost; On K.O. deck-play filters and shuffle                                                                                                                                        |
| OP02-031     | Kouzuki Toki                                    | verified | Conditional Blocker from Kouzuki Oden alternate rules name and absence boundary                                                                                                                          |
| OP02-032     | Shishilian                                      | verified | Optional DON!! cost, compound Minks filter, ready result, and decline                                                                                                                                    |
| OP02-033     | Jinbe                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-034     | Tony Tony.Chopper                               | verified | DON!! x1 attack gate and opposing cost-2 rest boundary                                                                                                                                                   |
| OP02-035     | Trafalgar Law                                   | verified | Optional DON!! and self-return costs; exact cost-3 hand play and decline                                                                                                                                 |
| OP02-036     | Nami                                            | verified | On Play and attack search success; FILM/Nami filters, paid DON!!, ordering, and decline                                                                                                                                  |
| OP02-037     | Nico Robin                                      | verified | Alternative compound FILM/Straw Hat Crew and cost/category hand filters                                                                                                                                  |
| OP02-038     | Nekomamushi                                     | verified | Public Blocker redirect, battle K.O., and protected Leader Life                                                                                                                                          |
| OP02-039     | Franky                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-040     | Brook                                           | verified | FILM/Straw Hat Crew disjunction, cost/category filtering, and hand play                                                                                                                                  |
| OP02-041     | Monkey.D.Luffy                                  | verified | FILM/Straw Hat Crew hand play, cost boundary, and Blocker battle redirect                                                                                                                                |
| OP02-042     | Yamato                                          | verified | Kouzuki Oden rules name and opposing cost-6-or-less rest boundary                                                                                                                                        |
| OP02-043     | Roronoa Zoro                                    | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-044     | Wanda                                           | verified | Minks compound trait, excluded name, cost boundary, and hand play                                                                                                                                        |
| OP02-050     | Inazuma                                         | verified | Hand-count permanent power boundary and Blocker redirect/K.O.                                                                                                                                            |
| OP02-051     | Emporio.Ivankov                                 | verified | Draw-to-3 hand size and blue Impel Down cost-6 hand play filtering                                                                                                                                       |
| OP02-052     | Cabaji                                          | verified | Mohji field gate, draw 2, chosen hand discard, and absent-gate boundary                                                                                                                                  |
| OP02-053     | Crocodile                                       | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-054     | Gecko Moria                                     | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-055     | Dracule Mihawk                                  | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-056     | Donquixote Doflamingo                           | verified | Top-3 rearrange choice; DON!! x1 attack, optional discard, cost-1 return                                                                                                                                 |
| OP02-057     | Bartholomew Kuma                                | verified | Warlords search, optional selection, remainder order, and top/bottom choice                                                                                                                              |
| OP02-058     | Buggy                                           | verified | Blue Impel Down search, excluded name, compound trait, ordered remainder                                                                                                                                 |
| OP02-059     | Boa Hancock                                     | verified | Attack draw, exact discard, optional up-to-3 discard, and zero choice                                                                                                                                    |
| OP02-060     | Mohji                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-061     | Morley                                          | verified | Hand-count gate and cost-5-or-less Blocker prevention during battle                                                                                                                                      |
| OP02-062     | Monkey.D.Luffy                                  | verified | Both timings, chosen two-card cost, either-field return; Double Attack still applies with zero return targets                                                                                                                               |
| OP02-063     | Mr.1 (Daz.Bonez)                                | verified | Blue Event hand recovery, color/category filtering, and excluded card                                                                                                                                    |
| OP02-064     | Mr.2.Bon.Kurei(Bentham)                        | verified | Paid either-field return, battle-delayed self-return, and decline; official rules name enforces same-name revival exclusion |
| OP02-065     | Mr.3 (Galdino)                                  | verified | Public Blocker; end-turn hand-trash accept/decline and ready result                                                                                                                                      |
| OP02-073     | Little Sadi                                     | verified | Included Jailer Beast hand filter, excluded card, and physical play                                                                                                                                      |
| OP02-074     | Saldeath                                        | verified | Named Blugori-only permanent Blocker grant and source-presence boundary                                                                                                                                  |
| OP02-075     | Shiki                                           | verified | Life Trigger activation, optional DON!! return, play, and decline                                                                                                                                        |
| OP02-076     | Shiryu                                          | verified | Optional DON!! return, cost-1 K.O. filter, physical result, and decline                                                                                                                                  |
| OP02-077     | Solitaire                                       | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-078     | Daifugo                                         | verified | Optional DON!! -2, included SMILE filter, same-name exclusion, physical play, and decline                                                                                                                |
| OP02-079     | Douglas Bullet                                  | verified | Optional DON!! -1, opposing cost-4 rest target, physical result, and decline                                                                                                                             |
| OP02-080     | Dobon                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-081     | Domino                                          | verified | Public Blocker selection, retarget, K.O., and protected Leader Life                                                                                                                                      |
| OP02-082     | Byrnndi World                                   | verified | Optional DON!! -8, +792000 power, decline, and turn-end cleanup                                                                                                                                          |
| OP02-083     | Hannyabal                                       | verified | Exact/compound Impel Down search, exclusions, decline, and bottom order                                                                                                                                  |
| OP02-084     | Blugori                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-085     | Magellan                                        | verified | Optional On Play DON!! returns and opponent-turn On K.O. DON!! -2                                                                                                                                        |
| OP02-086     | Minokoala                                       | verified | Blocker, compound Leader gate, rested DON!! choice, and failed gate                                                                                                                                      |
| OP02-087     | Minotaur                                        | verified | Double Attack, compound Leader On K.O. DON!! choice, and failed gate                                                                                                                                     |
| OP02-088     | Sphinx                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-094     | Isuka                                           | verified | Own battle-K.O. provenance, DON!! x1, reactivation, and once per turn                                                                                                                                    |
| OP02-095     | Onigumo                                         | verified | Dynamic cost-0 condition, Banish Life result, and ordinary damage                                                                                                                                        |
| OP02-096     | Kuzan                                           | verified | On Play draw; optional opposing -4 cost target and turn-end cleanup                                                                                                                                      |
| OP02-097     | Komille                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-098     | Koby                                            | verified | Optional hand-trash cost, cost-3 K.O. boundary, decline, and zero target                                                                                                                                 |
| OP02-099     | Sakazuki                                        | verified | Optional hand-trash cost, cost-5 K.O. boundary, decline, and zero target                                                                                                                                 |
| OP02-100     | Jango                                           | verified | Fullbody field condition and battle-only K.O. protection                                                                                                                                                 |
| OP02-101     | Strawberry                                      | verified | Cost-0 field gate and cost-5 Blocker restriction during its battle                                                                                                                                       |
| OP02-102     | Smoker                                          | verified | Effect-K.O. immunity, battle K.O., cost-0 power gate, and battle cleanup                                                                                                                                 |
| OP02-103     | Sengoku                                         | verified | DON!! x1 gate, opposing -2 cost choice, zero target, and turn cleanup                                                                                                                                    |
| OP02-104     | Sentomaru                                       | verified | Life Trigger plays the same physical card from Life                                                                                                                                                      |
| OP02-105     | Tashigi                                         | verified | DON!! x1 gate, opposing -3 cost choice, and turn cleanup                                                                                                                                                 |
| OP02-106     | Tsuru                                           | verified | On Play opposing -2 cost choice, zero target, and turn cleanup                                                                                                                                           |
| OP02-107     | Doberman                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-108     | Donquixote Rosinante                            | verified | Blocker owner, retargeting, battle result, and decline                                                                                                                                                   |
| OP02-109     | Jaguar.D.Saul                                   | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-110     | Hina                                            | verified | Blocker, On Block owner, cost-6 filter, attack lock, and zero target                                                                                                                                     |
| OP02-111     | Fullbody                                        | verified | Jango field gate, battle-only +3000 power, and cleanup                                                                                                                                                   |
| OP02-112     | Bell-mere                                       | verified | Rest cost, optional targets, cost/power modifiers, decline, and cleanup                                                                                                                                  |
| OP02-113     | Helmeppo                                        | verified | Any-field cost-0 battle bonus, reduction, cleanup, and physical Trigger                                                                                                                                  |
| OP02-114     | Borsalino                                       | verified | Opponent-turn power/effect-K.O. protection, Blocker, and battle K.O.                                                                                                                                     |
| OP02-115     | Monkey.D.Garp                                   | verified | DON!! x2 gate, opposing cost-0 filter, up-to choice, and failed gate                                                                                                                                     |
| OP02-116     | Yamakaji                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP02-120     | Uta                                             | verified | Optional DON!! -2; current own-field power bonus excludes later arrivals; decline and expiry                                                                                                                                 |
| OP02-121     | Kuzan                                           | verified | Your-turn opposing cost reduction; On Play cost-0 K.O.; zero target                                                                                                                                      |
| OP03-002     | Adio                                            | verified | DON!! gate; low-power Blocker exclusion; legal Blocker battle result                                                                                                                                     |
| OP03-003     | Izo                                             | verified | Included-trait search; name exclusion; zero choice; bottom-deck order                                                                                                                                    |
| OP03-004     | Curiel                                          | verified | DON-gated Rush; independent played-turn Leader prohibition; later-turn Leader attack |
| OP03-005     | Thatch                                          | verified | Once-per-turn power; delayed end-turn self-trash                                                                                                                                                         |
| OP03-006     | Speed Jil                                       | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-007     | Namule                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-008     | Buggy                                           | verified | Slash battle-K.O. protection; red Event search; zero choice; bottom order                                                                                                                                |
| OP03-009     | Haruta                                          | verified | Once-per-turn rested DON!! choice; Leader/Character recipient; zero choice                                                                                                                               |
| OP03-010     | Fossa                                           | verified | Public Blocker selection, retargeting, battle result, and protected Life                                                                                                                                 |
| OP03-011     | Blamenco                                        | verified | DON!! gate; opposing target; turn power reduction and cleanup                                                                                                                                            |
| OP03-012     | Marshall.D.Teach                                | verified | Optional filtered Character-trash cost; no On K.O.; draw; battle power; attached DON!! return                                                                                                            |
| OP03-013     | Marco                                           | verified | Your-turn low-power K.O.; optional Event payment; separate replay choice; same physical rested replay |
| OP03-014     | Monkey.D.Garp                                   | verified | Red cost-1 Character hand filter; selected physical effect-play identity                                                                                                                                 |
| OP03-015     | Lim                                             | verified | Blocker K.O.; opponent-turn gate; Leader/Character power target and cleanup                                                                                                                              |
| OP03-023     | Alvida                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-024     | Gin                                             | verified | Included Leader trait; up-to-two cost filter; wrong-Leader boundary                                                                                                                                      |
| OP03-025     | Krieg                                           | verified | Optional discard; rested cost filter; K.O.; DON!!-gated Double Attack                                                                                                                                    |
| OP03-026     | Kuroobi                                         | verified | Included Leader trait; optional opposing rest; same-card Life Trigger play                                                                                                                               |
| OP03-027     | Sham                                            | verified | Included Leader trait; cost filter; conditional named hand play                                                                                                                                          |
| OP03-028     | Jango                                           | verified | Choice owner; included trait/cost active target; self-and-opponent rests                                                                                                                                 |
| OP03-029     | Chew                                            | verified | Rested/cost K.O. filter; optional target; same-card Life Trigger play                                                                                                                                    |
| OP03-030     | Nami                                            | verified | Filtered top-five search; zero choice; bottom order; same-card Trigger play                                                                                                                              |
| OP03-031     | Pearl                                           | verified | Public Blocker choice; attack retarget; battle K.O.                                                                                                                                                      |
| OP03-032     | Buggy                                           | verified | Slash battle-K.O. prevention; non-Slash battle boundary                                                                                                                                                  |
| OP03-033     | Hatchan                                         | verified | Included Leader trait; same-card Trigger play; failed-condition Trash                                                                                                                                    |
| OP03-034     | Buchi                                           | verified | Optional opposing rested/cost K.O. filter; selected physical identity                                                                                                                                    |
| OP03-035     | Momoo                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-041     | Usopp                                           | verified | Rush; DON!! gate; Life damage; optional exact-seven self-mill                                                                                                                                            |
| OP03-042     | Usopp's Pirate Crew                             | verified | Blue named Trash filter; selected identity; zero choice                                                                                                                                                  |
| OP03-043     | Gaimon                                          | verified | Any-own-attacker damage trigger; optional exact-three mill; dependent self-trash                                                                                                                         |
| OP03-044     | Kaya                                            | verified | Draw 2, then controller chooses exactly 2 physical hand cards to trash                                                                                                                                   |
| OP03-045     | Carne                                           | verified | Blocker; opponent-turn and deck-at-most-20 power gates with both boundaries                                                                                                                              |
| OP03-046     | Genzo                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-047     | Zeff                                            | verified | Either-field low-cost return; optional exact-two deck trash; DON!! damage trigger accept, decline, and no-DON!! gate                                                                                     |
| OP03-048     | Nojiko                                          | verified | Nami Leader gate; opponent cost filter; owner-hand return; zero choice                                                                                                                                   |
| OP03-049     | Patty                                           | verified | Exact 20-card deck boundary; either-field cost-3 return; above-boundary exclusion                                                                                                                        |
| OP03-050     | Boodle                                          | verified | Public Blocker retarget; battle K.O.; optional exact-one mill accept and decline                                                                                                                         |
| OP03-051     | Bell-mere                                       | verified | Life Trigger precedence; DON!! gate; optional exact-seven damage mill and exact-three K.O. mill                                                                                                          |
| OP03-052     | Merry                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-053     | Yosaku & Johnny                                 | verified | DON!! gate and exact 20-card deck boundary for live +2000 power                                                                                                                                          |
| OP03-059     | Kaku                                            | verified | Optional DON!! -1 attack cost; battle-scoped Banish; Life Trigger suppression; decline                                                                                                                   |
| OP03-060     | Kalifa                                          | verified | Optional DON!! -1 attack cost; ordered draw-two then exact-one hand trash; decline                                                                                                                       |
| OP03-061     | Kiwi & Mozu                                     | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-062     | Kokoro                                          | verified | Top-five included Water Seven search; name exclusion; chosen identity; bottom ordering                                                                                                                   |
| OP03-063     | Zambai                                          | verified | Blocker; optional DON!! -1; included Leader trait gate; draw and decline boundaries                                                                                                                      |
| OP03-064     | Tilestone                                       | verified | Battle K.O.; included Leader trait gate; controller 0–1 rested DON!! choice                                                                                                                              |
| OP03-065     | Chimney & Gonbe                                 | verified | Public Blocker selection, attack retarget, and battle K.O.                                                                                                                                               |
| OP03-066     | Paulie                                          | verified | Optional rested-DON!! cost; 0–1 active DON!!; field threshold; filtered opposing K.O.                                                                                                                    |
| OP03-067     | Peepley Lulu                                    | verified | DON!! and included Leader trait gates; controller 0–1 rested DON!! choice                                                                                                                                |
| OP03-068     | Minozebra                                       | verified | Banish; battle K.O.; included Leader trait gate; controller rested-DON!! choice                                                                                                                          |
| OP03-069     | Minorhinoceros                                  | verified | Battle K.O.; included Leader trait gate; draw two then chosen hand trash                                                                                                                                 |
| OP03-070     | Monkey.D.Luffy                                  | verified | Optional exact cost-5 Character trash and DON!! return costs; same-turn Rush                                                                                                                             |
| OP03-071     | Rob Lucci                                       | verified | Optional DON!! return; opposing cost-5-or-less rest target; decline                                                                                                                                      |
| OP03-078     | Issho                                           | verified | Exact opposing hand threshold and choice; DON!!-gated Your Turn all-opponent cost reduction                                                                                                              |
| OP03-079     | Vergo                                           | verified | DON!!-gated battle K.O. immunity and unprotected battle boundary                                                                                                                                         |
| OP03-080     | Kaku                                            | verified | Optional ordered included-CP trash cost; opposing cost-3-or-less K.O.; decline                                                                                                                           |
| OP03-081     | Kalifa                                          | verified | Draw two; chosen exact-two hand trash; optional opposing cost modifier and expiry                                                                                                                        |
| OP03-082     | Kumadori                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-083     | Corgy                                           | verified | Top-five physical 0–2 trash choice; chosen identities; ordered bottom remainder                                                                                                                          |
| OP03-084     | Jerry                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-085     | Jabra                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-086     | Spandam                                         | verified | CP Leader gate; included-CP and name filtering; optional identity; remainder trash                                                                                                                       |
| OP03-087     | Nero                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-088     | Fukurou                                         | verified | Blocker choice and battle K.O.; permanent effect-K.O. protection                                                                                                                                         |
| OP03-089     | Brannew                                         | verified | Exact Navy search includes compound Navy types but excludes Former/Neo Navy; name filter and remainder trash |
| OP03-090     | Blueno                                          | verified | DON-attached Blocker boundary; rested On K.O. play includes a companion K.O.d simultaneously |
| OP03-091     | Helmeppo                                        | verified | No-base-effect filter; absolute cost 0 survives Kuzan removal and saved state; turn expiry |
| OP03-092     | Rob Lucci                                       | verified | Optional ordered included-CP trash cost; Rush attack; decline                                                                                                                                            |
| OP03-093     | Wanze                                           | verified | Optional chosen hand cost; post-cost included-CP gate; K.O. boundary                                                                                                                                     |
| OP03-100     | Kingbaum                                        | verified | Trigger top-or-bottom Life payment; physical play; decline; cannot pay with the last resolving Life card |
| OP03-101     | Camie                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-102     | Sanji                                           | verified | DON x2 attack gate; optional top-or-bottom Life cost; top-deck Life replacement                                                                                                                          |
| OP03-103     | Bobbin the Disposer                             | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-104     | Shirley                                         | verified | Blocker; private either-player top-Life look; optional skip; top/bottom physical identity                                                                                                                |
| OP03-105     | Charlotte Oven                                  | verified | DON x1 attack gate; optional Trigger-card hand cost; +3000 battle duration and cleanup                                                                                                                   |
| OP03-106     | Charlotte Opera                                 | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-107     | Charlotte Galette                               | verified | Blocker redirect and battle target replacement                                                                                                                                                           |
| OP03-108     | Charlotte Cracker                               | verified | Optional Trigger payment and replay; DON/lower-Life keyword gates; allocated second damage survives condition loss |
| OP03-109     | Charlotte Chiffon                               | verified | Optional top-or-bottom Life trash; top-deck Life replacement; decline                                                                                                                                    |
| OP03-110     | Charlotte Smoothie                              | verified | Optional top-or-bottom Life-to-hand cost; battle-scoped +2000 and decline                                                                                                                                |
| OP03-111     | Charlotte Praline                               | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP03-112     | Charlotte Pudding                               | verified | Sanji-or-included-trait search; name exclusion; physical selection/zero; ordered bottom remainder                                                                                                        |
| OP03-113     | Charlotte Perospero                             | verified | On K.O. included-trait search/zero and ordered remainder; optional Trigger hand cost and physical play/decline                                                                                           |
| OP03-114     | Charlotte Linlin                                | verified | Included Leader trait gate; controller-owned top-deck Life and opposing top-Life trash choices; both zero branches                                                                                       |
| OP03-115     | Streusen                                        | verified | Optional Trigger-card hand cost; candidate filtering/physical payment; opposing cost-1 K.O.; zero target and decline                                                                                     |
| OP03-116     | Shirahoshi                                      | verified | Direct On Play and Trigger play/decline; draw 3; physical hand-trash 2                                                                                                                                   |
| OP03-117     | Napoleon                                        | verified | Optional rest cost/decline; Linlin Leader-or-Character target/zero; +1000 duration; Trigger play/decline                                                                                                 |
| OP03-122     | Sogeking                                        | verified | Either-field cost-6 return/zero; draw 2; physical hand-trash 2; Usopp alias                                                                                                                              |
| OP03-123     | Charlotte Katakuri                              | verified | Either-field cost-8 target/zero; controller-owned top-or-bottom choice; owner Life face-up                                                                                                               |
| OP04-002     | Igaram                                          | verified | Optional self-rest and active-Leader -5000 costs; included-Alabasta search/zero; physical reveal; ordered bottom remainder; duration cleanup                                                             |
| OP04-003     | Usopp                                           | verified | Battle On K.O.; opponent base-power-5000-or-less candidates; physical K.O.; zero target                                                                                                                  |
| OP04-004     | Karoo                                           | verified | Optional self-rest; exact Alabasta recipients; rested-DON shortage excludes attached DON; zero recipients |
| OP04-005     | Kung Fu Jugon                                   | verified | Dynamic Blocker only with another physical Kung Fu Jugon; source exclusion; battle redirect                                                                                                              |
| OP04-006     | Koza                                            | verified | Optional active-Leader -5000 attack cost; +2000 through next-turn start; decline and inactive-Leader gate                                                                                                |
| OP04-007     | Sanji                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP04-008     | Chaka                                           | verified | DON x1 and Vivi Leader gates; ordered power reduction then refreshed 0-power K.O.; zero target                                                                                                           |
| OP04-009     | Super Spot-Billed Duck Troops                   | verified | Optional active-Leader -5000 attack cost; delayed self-return; decline and inactive-Leader gate                                                                                                          |
| OP04-010     | Tony Tony.Chopper                               | verified | Exact Animal membership; Animal Kingdom Pirates excluded; power limit; physical hand selection; zero play |
| OP04-011     | Nami                                            | verified | Public top-card reveal; Character/power threshold; +3000 duration; successful reveal bottom placement; failed condition retains top                                                                                                             |
| OP04-012     | Nefeltari Cobra                                 | verified | Your-turn included-Alabasta boost; source exclusion; opponent-turn cleanup                                                                                                                               |
| OP04-013     | Pell                                            | verified | DON!! x1 gate; opposing power-4000 K.O. target; physical result; zero choice                                                                                                                             |
| OP04-014     | Monkey.D.Luffy                                  | verified | Banish sends damaged Trigger Life to Trash without activation                                                                                                                                            |
| OP04-015     | Roronoa Zoro                                    | verified | Opposing target; -2000 power this turn; zero choice; turn-end cleanup                                                                                                                                    |
| OP04-021     | Viola                                           | verified | Opponent-attack timing; optional rest-2-DON!! cost; controller chooses zero or one opposing DON!!; decline and insufficient-cost boundaries                                                              |
| OP04-022     | Eric                                            | verified | Optional self-rest; active opposing cost-1 target; ownership, cost, and rested exclusions; zero choice and decline                                                                                       |
| OP04-023     | Kuro                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP04-024     | Sugar                                           | verified | Mandatory opponent-play reaction; removed-source negative; Leader gate; optional target; once per turn |
| OP04-025     | Giolla                                          | verified | Opponent-attack timing; optional rest-2-DON!! cost; active opposing cost-4 target; zero, decline, and insufficient-cost boundaries                                                                       |
| OP04-026     | Senor Pink                                      | verified | Optional rest-1-DON!! cost; post-cost Leader gate; active opposing cost-4 target; delayed DON!! activation survives source leaving; decline                                                              |
| OP04-027     | Daddy Masterson                                 | verified | DON!! x1 end-turn self-activation and failed-gate boundary                                                                                                                                               |
| OP04-028     | Diamante                                        | verified | Blocker redirect; DON!! x1 gate; two-active-DON!! boundary excludes rested DON!!; end-turn self-activation                                                                                               |
| OP04-029     | Dellinger                                       | verified | End-turn controller-owned 0-1 rested-DON!! activation choice; one and zero branches                                                                                                                      |
| OP04-030     | Trebol                                          | verified | On Play opposing rested cost-5 K.O./zero; opponent-attack optional rest-2-active-DON!! cost; opposing active cost-4 target; attacker, ownership, cost, rested, decline, and insufficient-cost boundaries |
| OP04-031     | Donquixote Doflamingo                           | verified | On Play opposing rested Leader/Character 0-3 choice; next-Refresh prevention; unselected refresh; following-cycle cleanup                                                                                |
| OP04-032     | Baby 5                                          | verified | End-turn optional self-trash cost; controller-owned 0-2 rested-DON!! activation; zero and decline branches                                                                                               |
| OP04-033     | Machvise                                        | verified | Donquixote Pirates Leader gate; opposing active cost-5 rest/zero; delayed end-turn 0-1 DON!! activation survives source leaving play; failed-gate boundary                                               |
| OP04-034     | Lao.G                                           | verified | End-turn 3-active-DON!! gate; opposing rested cost-3 K.O./zero; active, cost, state, and rested-DON!! boundaries                                                                                         |
| OP04-041     | Apis                                            | verified | Optional exact-2 hand trash; included-East Blue top-5 search/zero; physical reveal; ordered bottom remainder; decline and insufficient-cost boundaries                                                   |
| OP04-042     | Ipponmatsu                                      | verified | On Play own Slash-only 0-1 target; +3000 this turn and cleanup; mandatory top-deck trash after either choice                                                                                             |
| OP04-043     | Ulti                                            | verified | DON!! x1 attack gate; controller-owned hand-or-bottom choice; either-field cost-2 target; owner routing, physical identity, zero, and failed-gate boundaries                                             |
| OP04-044     | Kaido                                           | verified | Either-field cost-8 and cost-3 groups selected before one return-to-hand; zero may be chosen per group |
| OP04-045     | King                                            | verified | On Play physical top-card draw; visible hand/deck result                                                                                                                                                 |
| OP04-046     | Queen                                           | verified | Included-Animal Kingdom Pirates Leader gate; named Plague Rounds/Ice Oni top-7 search 0-2; exclusions; physical reveal; ordered bottom remainder; failed gate                                            |
| OP04-047     | Ice Oni                                         | verified | Your-turn end-of-battle provenance; battled opposing cost-5 target; owner-deck bottom; cost-6, opponent-turn, battle-K.O., source/target identity, and queue-finalization boundaries                     |
| OP04-048     | Sasaki                                          | verified | On Play post-play whole-hand return; concealed identity/events/logs; owner routing; deterministic shuffle; redraw exact returned count; zero-hand branch                                                 |
| OP04-049     | Jack                                            | verified | Unqualified On K.O. physical top-card draw from both battle and opposing-effect origins                                                                                                                  |
| OP04-050     | Hanger                                          | verified | Optional hand-trash and self-rest costs; exact candidates; draw; decline; insufficient-cost and repeat boundaries                                                                                        |
| OP04-051     | Who's.Who                                       | verified | Included-Animal Kingdom Pirates top-5 search; own-name/unrelated exclusions; physical reveal; zero choice; ordered bottom remainder                                                                      |
| OP04-052     | Black Maria                                     | verified | Optional rest-2-DON!! and self-rest costs; draw; decline and insufficient-cost rejection; physical Life Trigger play/decline                                                                             |
| OP04-053     | Page One                                        | verified | DON!! x1 and once-per-turn gates; own Main/Counter Event origins; draw-before-physical hand bottom; opponent/no-DON!! exclusions                                                                         |
| OP04-054     | Rokki                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP04-059     | Iceburg                                         | verified | Opponent-attack optional DON!! -1; post-cost Water Seven gate; temporary Blocker and redirect; decline, wrong-Leader, insufficient-cost boundaries                                                       |
| OP04-060     | Crocodile                                       | verified | Optional On Play DON!! -2 before Baroque Works Life add/zero; opponent-attack DON!! -1, draw-before-trash, decline, insufficient cost, once per turn                                                     |
| OP04-061     | Tom                                             | verified | Optional self-trash cost; post-cost Water Seven gate; rested DON!! add/zero; wrong-Leader and decline branches                                                                                           |
| OP04-062     | Bananagator                                     | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP04-063     | Franky                                          | verified | Opponent-attack optional DON!! -1; post-cost Water Seven gate; own Leader/Character power target/zero; decline, insufficient cost, once, battle cleanup                                                  |
| OP04-064     | Ms. All Sunday                                  | verified | Rested DON!! add/zero before six-field-DON!! draw gate; Trigger DON!! -2 accept/decline; physical play; Crocodile Q&A ordering                                                                           |
| OP04-065     | Miss.Goldenweek(Marianne)                       | verified | Included-Baroque Works gate; opposing cost-5 attack lock through next-turn start; cleanup; Trigger DON!! -1 accept/decline and physical play                                                             |
| OP04-066     | Miss.Valentine(Mikita)                          | verified | Included-Baroque Works top-5 search/zero; same-name and unrelated mapping; physical reveal; ordered bottom; Trigger DON!! -1 accept/decline and nested On Play                                           |
| OP04-067     | Miss.MerryChristmas(Drophy)                     | verified | Public Blocker redirect; Trigger DON!! -1 accept/decline; physical play/trash routing; Life Trigger decline-to-hand                                                                                      |
| OP04-068     | Yokozuna                                        | verified | Opponent-attack optional DON!! -1; opposing cost-2 return/zero; attacker exclusion; decline and insufficient cost; subsequent Blocker redirect                                                           |
| OP04-069     | Mr.2.Bon.Kurei(Bentham)                        | verified | Opponent-attack optional DON!! -1; physical attacking Leader/Character base-power copy; turn cleanup; decline and insufficient cost; Trigger physical play; official rules name enforces same-name revival exclusion |
| OP04-070     | Mr.3 (Galdino)                                  | verified | Opponent-attack optional DON!! -1; opposing Character -1000/zero; decline, insufficient cost, once per turn                                                                                              |
| OP04-071     | Mr.4 (Babe)                                     | verified | Opponent-attack optional DON!! -1; battle-scoped Blocker and +1000; redirect/survival; decline and insufficient cost                                                                                     |
| OP04-072     | Mr.5 (Gem)                                      | verified | Opponent-attack optional DON!! -2 and self-rest; opposing cost-4 K.O./zero; decline, insufficient cost, once per turn                                                                                    |
| OP04-073     | Mr.13 & Ms.Friday                               | verified | Optional self-trash plus distinct included-Baroque Works Character trash; filtered physical payment; active DON!! add; decline; Trigger play/decline                                                     |
| OP04-077     | Ideo                                            | verified | Public Blocker selection and attack retarget                                                                                                                                                             |
| OP04-078     | Oimo & Kashii                                   | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP04-079     | Orlumbus                                        | verified | Opposing cost reduction; top-2 trash; mandatory Dressrosa selection permits protected Character; protected card survives |
| OP04-080     | Gyats                                           | verified | Included-Dressrosa active-Character attack permission/zero; turn cleanup                                                                                                                                 |
| OP04-081     | Cavendish                                       | verified | DON!! x1 active-Character attacks; optional Leader-rest cost; opposing cost-1 K.O./zero; exact top-2 deck trash; decline and gate boundaries                                                             |
| OP04-082     | Kyros                                           | verified | Self-only battle/effect K.O. replacement; Leader-or-Corrida payment/decline; Rebecca cost-1 K.O.; exact top-deck trash                                                                                   |
| OP04-083     | Sabo                                            | verified | Blocker; protected cards remain selectable and survive effect K.O.; next-turn cleanup; draw 2 then trash 2 |
| OP04-084     | Stussy                                          | verified | Top-3 included-CP Character play; cost/name/category filters; zero choice; trash remainder                                                                                                               |
| OP04-085     | Suleiman                                        | verified | On Play and When Attacking Dressrosa gate; opposing cost -2/zero; exact top-deck trash; cleanup                                                                                                          |
| OP04-086     | Chinjao                                         | verified | DON!! x1 own battle-K.O. provenance; draw-before-exact-trash; decision owner; unrelated and effect-K.O. exclusions                                                                                       |
| OP04-087     | Trafalgar Law                                   | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP04-088     | Hajrudin                                        | verified | Leader-rest cost; optional opposing cost reduction; zero choice; turn cleanup and unpayable rejection                                                                                                    |
| OP04-089     | Bartolomeo                                      | verified | Public Blocker selection, attack redirection, and battle resolution                                                                                                                                      |
| OP04-090     | Monkey.D.Luffy                                  | verified | Active-Character attacks; ordered seven-trash cost; reactivation; once per turn; next-Refresh freeze and recovery                                                                                        |
| OP04-091     | Leo                                             | verified | Leader rest paid before Dressrosa gate covers K.O. and top-two deck trash |
| OP04-092     | Rebecca                                         | verified | Attack prohibition; included-Dressrosa top search, optional hand selection, and trash remainder                                                                                                          |
| OP04-097     | Otama                                           | verified | Opposing cost filter; alternative included Animal/SMILE traits; face-up top-Life placement                                                                                                               |
| OP04-098     | Toko                                            | verified | Physical Trigger-card play and nested On Play Life recovery boundaries                                                                                                                                   |
| OP04-099     | Olin                                            | verified | Optional Trigger payment, physical-card play, and post-play continuation                                                                                                                                 |
| OP04-100     | Capone"Gang"Bege                                | verified | Physical Life Trigger resolution and printed opposing attack restriction                                                                                                                                 |
| OP04-101     | Carmel                                          | verified | Turn-scoped draw; physical Trigger play; opposing cost-2 K.O.                                                                                                                                            |
| OP04-102     | Kin'emon                                        | verified | DON!! and top/bottom Life costs; reactivation; decline and once-per-turn rejection                                                                                                                       |
| OP04-103     | Kouzuki Hiyori                                  | verified | Inclusive Land of Wano target; turn cleanup; physical Trigger play                                                                                                                                       |
| OP04-104     | Sanji                                           | verified | Public Blocker and paid physical Trigger-card play                                                                                                                                                       |
| OP04-105     | Charlotte Amande                                | verified | Trigger-filtered hand cost; optional opposing cost-2 target; decline and once per turn                                                                                                                   |
| OP04-106     | Charlotte Bavarois                              | verified | Conditional power and physical Life Trigger payment, play, and decline                                                                                                                                   |
| OP04-107     | Charlotte Perospero                             | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP04-108     | Charlotte Moscato                               | verified | DON!!-conditioned Banish and physical Trigger payment, play, and decline                                                                                                                                 |
| OP04-109     | Tonoyasu                                        | verified | Self-trash cost; included Land of Wano power target; decline and duration cleanup                                                                                                                        |
| OP04-110     | Pound                                           | verified | Blocker; battle/effect K.O.; ownership/cost filters; optional face-up Life placement                                                                                                                     |
| OP04-111     | Hera                                            | verified | Other included-Homies trash and self-rest costs; Linlin reactivation; physical Trigger play                                                                                                              |
| OP04-112     | Yamato                                          | verified | On Play timing, filtered target ownership, and visible result                                                                                                                                            |
| OP04-113     | Rabiyan                                         | verified | Physical Life Trigger flow, payment boundary, and visible result                                                                                                                                         |
| OP04-114     | Randolph                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP04-118     | Nefeltari Vivi                                  | verified | Permanent attack prohibition and legal activated path through public commands                                                                                                                            |
| OP04-119     | Donquixote Rosinante                            | verified | On Play; simultaneous K.O. retains initial protection after source leaves; saved replacement continuation |
| OP05-003     | Inazuma                                         | verified | Another 7000-power Character condition dynamically grants same-turn Rush                                                                                                                                 |
| OP05-004     | Emporio.Ivankov                                 | verified | Effective-power activation gate; included-trait hand play; name exclusion; once per turn                                                                                                                 |
| OP05-005     | Karasu                                          | verified | On Play and When Attacking timing with printed target/result boundaries                                                                                                                                  |
| OP05-006     | Koala - OP05-006                                | verified | On Play choice ownership, filtering, and visible result                                                                                                                                                  |
| OP05-007     | Sabo                                            | verified | Optional two-target K.O. with aggregate 4000-power enforcement                                                                                                                                           |
| OP05-008     | Chaka                                           | verified | DON!! gate; rested-DON!! count; recipient ownership; once-per-turn rejection                                                                                                                             |
| OP05-009     | Toh-Toh                                         | verified | Draws only while the controller's Leader has effective power 0 or less                                                                                                                                   |
| OP05-010     | Nico Robin                                      | verified | Optional opposing 1000-power Character K.O. and candidate filtering                                                                                                                                      |
| OP05-011     | Bartholomew Kuma                                | verified | Multicolored-Leader Trigger; physical play; nested On Play K.O.; false branch to Trash                                                                                                                   |
| OP05-012     | Hack                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP05-013     | Bunny Joe                                       | verified | Public Blocker selection, redirection, and battle result                                                                                                                                                 |
| OP05-014     | Pell                                            | verified | DON!! gate; optional opposing Character power reduction and turn cleanup                                                                                                                                 |
| OP05-015     | Belo Betty                                      | verified | Five-card included-trait search; name exclusion; optional selection; ordered bottom remainder                                                                                                            |
| OP05-016     | Morley                                          | verified | Power-based Blocker suppression boundary and optional multicolor physical Trigger play                                                                                                                   |
| OP05-017     | Lindbergh                                       | verified | When Attacking and physical Life Trigger behavior across printed gates                                                                                                                                   |
| OP05-023     | Vergo                                           | verified | When Attacking timing, target filtering, and visible result                                                                                                                                              |
| OP05-024     | Kuween                                          | verified | Public Blocker selection, redirection, and battle result                                                                                                                                                 |
| OP05-025     | Gladius                                         | verified | Activate Main costs, target filtering, and visible result                                                                                                                                                |
| OP05-026     | Sarquiss                                        | verified | DON!! gate; cost-3 Character rest payment; reactivation; once per turn                                                                                                                                   |
| OP05-027     | Trafalgar Law                                   | verified | Optional self-trash cost; opposing cost filter; rest result                                                                                                                                              |
| OP05-028     | Donquixote Doflamingo                           | verified | Optional self-trash cost; rested/cost filters; K.O. result                                                                                                                                               |
| OP05-029     | Donquixote Doflamingo                           | verified | Optional DON!! payment; opponent-attack reaction; rest target; decline and once per turn                                                                                                                 |
| OP05-030     | Donquixote Rosinante                            | verified | Public Blocker and opponent-turn rested-Character removal replacement with self-trash                                                                                                                    |
| OP05-031     | Buffalo                                         | verified | Rested-Character threshold; cost/state filters; reactivation; once per turn                                                                                                                              |
| OP05-032     | Pica                                            | verified | End-turn reactivation plus optional self-only removal replacement, decline, and once-per-turn boundary                                                                                                   |
| OP05-033     | Baby 5                                          | verified | Optional rest-DON!! and self-rest costs before included Donquixote Pirates play                                                                                                                          |
| OP05-034     | Baby 5                                          | verified | Included Donquixote Pirates search, zero selection, and submitted bottom order                                                                                                                           |
| OP05-035     | Bellamy                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP05-036     | Monet                                           | verified | Public Blocker redirection followed by optional opposing cost-4 rest                                                                                                                                     |
| OP05-042     | Issho                                           | verified | Opposing cost-7 restriction duration through the controller's next turn                                                                                                                                  |
| OP05-043     | Ulti                                            | verified | Multicolor-Leader gate, private top-three choice with opponent-log secrecy, remainder order, and deck-end choice                                                                                                                   |
| OP05-044     | John Giant                                      | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP05-045     | Stainless                                       | verified | Hand-trash and self-rest costs before either-player cost-2 deck-bottom choice                                                                                                                            |
| OP05-046     | Dalmatian                                       | verified | Battle K.O. draw then physical hand-card deck-bottom choice                                                                                                                                              |
| OP05-047     | Basil Hawkins                                   | verified | Blocker; one pre-draw hand condition gates draw and power together; failed-condition negative |
| OP05-048     | Bastille                                        | verified | DON!! gate and either-player cost-2 owner-deck-bottom target                                                                                                                                             |
| OP05-049     | Haccha                                          | verified | DON!! gate and either-player cost-3 owner-hand return target                                                                                                                                             |
| OP05-050     | Hina                                            | verified | Exact five-card post-play hand boundary for On Play draw                                                                                                                                                 |
| OP05-051     | Borsalino                                       | verified | Optional either-player cost-4 owner-deck-bottom target                                                                                                                                                   |
| OP05-052     | Maynard                                         | verified | Public Blocker selection, attack redirection, and rested state                                                                                                                                           |
| OP05-053     | Mozambia                                        | verified | Your-turn outside-Draw-Phase reaction and visible once-per-turn power gain                                                                                                                               |
| OP05-054     | Monkey.D.Garp                                   | verified | Draw two then exactly two physical hand cards to deck bottom in submitted order                                                                                                                          |
| OP05-055     | X.Drake                                         | verified | Private top-five order, top-or-bottom placement, and public Blocker behavior                                                                                                                             |
| OP05-056     | X.Barrels                                       | verified | Optional other-Character deck-bottom payment before draw                                                                                                                                                 |
| OP05-061     | Uso-Hachi                                       | verified | DON!! and eight-field-DON!! gates before opposing cost-4 rest                                                                                                                                            |
| OP05-062     | O-Nami                                          | verified | Dynamic Blocker at exactly ten field DON!! cards and nine-card boundary                                                                                                                                  |
| OP05-063     | O-Robi                                          | verified | Eight-field-DON!! gate before opposing cost-3 K.O.                                                                                                                                                       |
| OP05-064     | Killer                                          | verified | Included Kid Pirates search, name exclusion, zero selection, and bottom order                                                                                                                            |
| OP05-065     | San-Gorou                                       | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP05-066     | Jinbe                                           | verified | Opponent-turn ten-DON!! power and Blocker grant with negative boundaries                                                                                                                                 |
| OP05-067     | Zoro-Juurou                                     | verified | Three-Life attack gate before optional active DON!! addition                                                                                                                                             |
| OP05-068     | Chopa-Emon                                      | verified | Post-payment eight-DON!! gate and included purple Straw Hat reactivation                                                                                                                                 |
| OP05-069     | Trafalgar Law                                   | verified | Fewer-DON!! gate, included Heart Pirates search, and remainder order                                                                                                                                     |
| OP05-070     | Fra-Nosuke                                      | verified | DON!! and eight-field-DON!! gates grant same-turn Rush                                                                                                                                                   |
| OP05-071     | Bepo                                            | verified | Fewer-field-DON!! attack gate and opposing power reduction                                                                                                                                               |
| OP05-072     | Hone-Kichi                                      | verified | Eight-field-DON!! gate and up-to-two opposing power targets                                                                                                                                              |
| OP05-073     | Miss Doublefinger(Zala)                         | verified | Optional hand-trash rested-DON!! On Play and physical Life Trigger play                                                                                                                                  |
| OP05-074     | Eustass"Captain"Kid                             | verified | Public Blocker and once-per-turn active DON!! replacement                                                                                                                                                |
| OP05-075     | Mr.1 (Daz.Bonez)                                | verified | Optional opponent-attack DON!! payment and included Baroque Works play                                                                                                                                   |
| OP05-079     | Viola                                           | verified | Opponent-owned three-card trash choice and submitted deck-bottom order                                                                                                                                   |
| OP05-080     | Elizabello II                                   | verified | Exact twenty-card trash payment, shuffle, battle power, and Double Attack                                                                                                                                |
| OP05-081     | One-Legged Toy Soldier                          | verified | Optional self-trash cost and opposing cost reduction target                                                                                                                                              |
| OP05-082     | Shirahoshi                                      | verified | Self-rest and ordered trash payment before six-card hand condition                                                                                                                                       |
| OP05-083     | Sterry                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP05-084     | Saint Charlos                                   | verified | Your-turn all-opponent cost reduction with inclusive Celestial Dragons field gate                                                                                                                        |
| OP05-085     | Nefeltari Cobra                                 | verified | Top-deck trash On Play followed by public Blocker behavior                                                                                                                                               |
| OP05-086     | Nefeltari Vivi                                  | verified | Dynamic Blocker at ten trash cards and nine-card boundary                                                                                                                                                |
| OP05-087     | Hakuba                                          | verified | DON!! gate and optional other-Character K.O. cost before cost reduction                                                                                                                                  |
| OP05-088     | Mansherry                                       | verified | DON!!, self-rest, ordered trash costs, and black Character cost-3-to-5 recovery                                                                                                                          |
| OP05-089     | Saint Mjosgard                                  | verified | DON!!, self-rest, and other-Character rest costs before black cost-1 recovery                                                                                                                            |
| OP05-090     | Riku Doldo III                                  | verified | Included Dressrosa power targets at On Play and On K.O. plus Blocker                                                                                                                                     |
| OP05-091     | Rebecca                                         | verified | Non-Rebecca black cost-3-to-7 recovery, rested hand play, and Blocker                                                                                                                                    |
| OP05-092     | Saint Rosward                                   | verified | Inclusive Celestial Dragons-only field gate and all-opponent cost reduction                                                                                                                              |
| OP05-093     | Rob Lucci                                       | verified | Ordered three-card trash payment; cost-2 and cost-1 groups selected before one K.O.; joint replacement payment/decline; returned-state duplicate-target rejection preserves paid cost and first group for retry |
| OP05-099     | Amazon                                          | verified | Opponent attack self-rest; feasible Life-payment choice; zero-Life mandatory power fallback |
| OP05-100     | Enel                                            | verified | uses Rush to attack on the turn it is played; trashes top Life instead of leaving the field only once per turn; does not offer the replacement while either player has a Monkey.D.Luffy Character |
| OP05-101     | Ohm                                             | verified | reveals a Holly from the top five, bottoms the rest in order, then plays a Holly from hand; gains +1000 power at two Life, but not at three |
| OP05-102     | Gedatsu                                         | verified | K.O.'s up to one Character whose cost does not exceed the opponent's Life count |
| OP05-103     | Kotori                                          | verified | with Hotori, K.O.'s up to one Character at the opponent-Life cost boundary; without Hotori, does not offer a K.O. target |
| OP05-104     | Conis                                           | verified | places a chosen Stage at the bottom of the deck before drawing and trashing |
| OP05-105     | Satori                                          | verified | trashes a chosen hand card and plays the resolving Life Trigger card |
| OP05-106     | Shura                                           | verified | finds an included Sky Island type, excludes Shura, and orders the remainder; plays the resolving physical Life Trigger card before its On Play search |
| OP05-107     | Lieutenant Spacey                               | verified | gains +2000 during its turn when Life is added to hand |
| OP05-108     | Nola                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP05-109     | Pagaya                                          | verified | Own and opponent Trigger observation; draw two then trash two; once-per-turn limit |
| OP05-110     | Holly                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP05-111     | Hotori                                          | verified | plays Kotori from hand as the optional activation cost before choosing a Life target; may decline without playing Kotori or moving an opposing Character to Life |
| OP05-112     | Captain McKinley                                | verified | blocks, is K.O.'d in battle, and plays a cost-1 compound Sky Island Character |
| OP05-113     | Yama                                            | verified | redirects a Leader attack through the defending player's Blocker choice |
| OP05-118     | Kaido                                           | verified | draws four on play while the opponent has three Life cards; does not draw while the opponent has four Life cards |
| OP05-119     | Monkey.D.Luffy                                  | verified | rests one DON!! to add one active DON!! only once per turn; takes an extra turn after paying DON!! -10 on play; keeps itself in play and lets its controller order every other Character for deck bottom |
| OP06-002     | Inazuma                                         | verified | gains Banish at 7000 power and trashes damaged Life; deals ordinary Life damage below 7000 power |
| OP06-003     | Emporio.Ivankov                                 | verified | plays an included Revolutionary Army power-5000 Character and bottoms the rest in order |
| OP06-004     | Baron Omatsuri                                  | verified | may play only Lily Carnation from hand without paying its cost |
| OP06-005     | Gasparde                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP06-006     | Saga                                            | verified | with DON!! x1 gains power until its next turn and trashes a FILM Character at end of turn; without a given DON!! neither gains power nor schedules a trash |
| OP06-007     | Shanks                                          | verified | K.O.s up to one opposing power-10000-or-less Character |
| OP06-008     | Schneider                                       | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP06-009     | Shuraiya                                        | verified | copies the opposing Leader's base power when attacking until the start of its next turn; copies the opposing Leader's base power on block before the Counter Step |
| OP06-010     | Douglas Bullet                                  | verified | gains Blocker only while its Leader has the FILM type |
| OP06-011     | Tot Musica                                      | verified | rests an Uta card to gain +5000 power once per turn |
| OP06-012     | Bear.King                                       | verified | survives battle when the opponent has a base-6000 Leader or Character; is K.O.'d when only the attacker's modified power reaches 6000 |
| OP06-013     | Monkey.D.Luffy                                  | verified | on play searches the top three for a card whose type includes FILM; Life Trigger activates the On Play search without playing the resolving card |
| OP06-014     | Ratchet                                         | verified | on an opponent's attack trashes any chosen FILM cards to scale one battle target |
| OP06-015     | Lily Carnation                                  | verified | once per turn trashes a 6000-power Character to play only a 2000-to-5000 FILM Character rested |
| OP06-016     | Raise Max                                       | verified | returns itself and its DON!! to reduce an opposing Character for the turn |
| OP06-023     | Arlong                                          | verified | trashes a hand card to stop a rested opposing Leader through its next turn; Life Trigger rests only an opposing cost-4-or-less Character |
| OP06-024     | Ikaros Much                                     | verified | with a New Fish-Man Pirates Leader plays an included cost-4 Fish-Man, then takes Life; does nothing when the Leader lacks New Fish-Man Pirates |
| OP06-025     | Camie                                           | verified | searches either included Fish-Man or Merfolk type, excludes Camie, and bottoms the rest in order |
| OP06-026     | Koushirou                                       | verified | reactivates only a cost-4-or-less Slash Character and stops current cards attacking a Leader; also stops a Rush Character played after Koushirou from attacking a Leader |
| OP06-027     | Gyro                                            | verified | after battle K.O., rests only an opposing cost-3-or-less Character |
| OP06-028     | Zeo                                             | verified | with attached DON!! and an included New Fish-Man Pirates Leader, activates DON!!, gains power, and takes Life; does nothing when the Leader lacks New Fish-Man Pirates |
| OP06-029     | Daruma                                          | verified | with attached DON!! and an included Leader, reactivates once, gains power, and takes one Life; does not reactivate or take Life without attached DON!! |
| OP06-030     | Dosun                                           | verified | with a New Fish-Man Pirates Leader gains power and battle protection, takes Life, then expires next turn |
| OP06-031     | Hatchan                                         | verified | its Life Trigger plays only a cost-3-or-less Fish-Man or Merfolk from its controller's hand |
| OP06-032     | Hammond                                         | verified | may rest to become the target of an opposing attack |
| OP06-033     | Vander Decken IX                                | verified | may trash a Fish-Man from hand to K.O. only an opposing rested Character; may decline without trashing a card or K.O.'ing a Character; may trash The Ark Noah from the field as the activation cost |
| OP06-034     | Hyouzou                                         | verified | once per turn may rest a cost-4-or-less opponent, gains power, and takes Life |
| OP06-035     | Hody Jones                                      | verified | rests a total of two opposing Characters or DON!! and takes the top Life card |
| OP06-036     | Ryuma                                           | verified | on play may K.O. only an opposing rested cost-4-or-less Character; on K.O. may remove an opposing rested cost-4-or-less Character |
| OP06-037     | Wadatsumi                                       | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP06-043     | Aramaki                                         | verified | trashes a hand card and bottom-decks either player's low-cost Character for +3000; may block an attack directed at its controller's Leader; returned-state rejection preserves paid prefix and permits retry |
| OP06-044     | Gion                                            | verified | during its turn makes the opponent bottom-deck their chosen card after activating an Event |
| OP06-045     | Kuzan                                           | verified | draws two and places two chosen physical hand cards at deck bottom in order |
| OP06-046     | Sakazuki                                        | verified | on play may bottom either player's cost-2-or-less Character |
| OP06-047     | Charlotte Pudding                               | verified | on play shuffles the opponent's entire hand into their deck, then draws five |
| OP06-048     | Zeff                                            | verified | during its controller's turn may trash four when the opponent activates Blocker; during its controller's turn may trash four when the opponent activates a Counter Event |
| OP06-049     | Sengoku                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP06-050     | Tashigi                                         | verified | searches an included Navy type, excludes every Tashigi, and orders the remainder |
| OP06-051     | Tsuru                                           | verified | may trash two hand cards, then lets the opponent return one of their Characters; may decline without trashing cards or returning a Character |
| OP06-052 | Tokikake | verified | Battle K.O. prevention requires one DON!! and four-or-fewer cards in hand; both failure boundaries |
| OP06-053 | Jaguar.D.Saul | verified | Battle On K.O. may bottom-deck either player's cost-2-or-less Character; decline path |
| OP06-054 | Borsalino | verified | Conditional Blocker at four hand cards and its five-card boundary |
| OP06-055 | Monkey.D.Garp | verified | DON!! and hand-count attack restriction prevents Blocker; both condition boundaries |
| OP06-060 | Vinsmoke Ichiji | verified | Ordered DON!!/self-trash costs; conditional cost-7 named play from hand or trash |
| OP06-061 | Vinsmoke Ichiji | verified | Equal-DON!! opposing power reduction and same-turn Rush; greater-DON!! failure boundary |
| OP06-062 | Vinsmoke Judge | verified | Ordered DON!!/hand costs; distinct-name GERMA play filtering; paid DON!! rest activation and once-per-turn |
| OP06-063 | Vinsmoke Sora | verified | Ordered costs and low-power Family recovery; post-cost DON!! condition failure |
| OP06-064 | Vinsmoke Niji | verified | Ordered DON!!/self-trash costs and conditional named cost-5 hand play |
| OP06-065 | Vinsmoke Niji | verified | Equal-DON!! K.O.-or-return choice with separate cost bounds; greater-DON!! boundary |
| OP06-066 | Vinsmoke Yonji | verified | Ordered DON!!/self-trash costs and conditional named cost-4 hand play |
| OP06-067 | Vinsmoke Yonji | verified | Dynamic equal-or-lower DON!! power bonus and conditional public Blocker |
| OP06-068 | Vinsmoke Reiju | verified | Ordered DON!!/self-trash costs and conditional named cost-4 trash play |
| OP06-069 | Vinsmoke Reiju | verified | Equal-DON!! draw with post-play hand threshold; both failure boundaries |
| OP06-070     | Eldoraggo                                       | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP06-071 | Gild Tesoro | verified | DON!! payment and up-to-two low-cost FILM trash recovery; Leader-condition failure |
| OP06-072 | Cosette | verified | Blocker requires an included GERMA Leader and a two-DON!! field deficit |
| OP06-073 | Shiki | verified | Eight-DON!! draw then chosen discard; seven-DON!! boundary; public Blocker |
| OP06-074 | Zephyr (Navy) | verified | DON!! payment, effect negation, same-target 5000-power K.O., high-power and decline branches |
| OP06-075 | Count Battler | verified | DON!! payment before up-to-two opposing low-cost rest; decline branch |
| OP06-076 | Hitokiri Kamazo | verified | Own-turn DON!!-return K.O. trigger, cost filter, once-per-turn, and opponent-turn exclusion |
| OP06-081 | Absalom | verified | Ordered two-card trash-to-deck cost then either-player low-cost K.O.; decline branch |
| OP06-082 | Inuppe | verified | Included Leader On Play draw/discard and On K.O. resolution from trash |
| OP06-083 | Oars | verified | Cannot attack until qualified Character K.O. cost negates its permanent effect |
| OP06-084 | Jigoro of the Wind | verified | Battle On K.O. resolves from trash and grants own Leader turn power |
| OP06-085 | Kumacy | verified | DON!! x2 trash-group power scaling and controller-turn duration |
| OP06-086 | Gecko Moria | verified | Two distinct trash choices with cost-4 active play and cost-2 rested play |
| OP06-087 | Cerberus | verified | Public Blocker selection, attack retargeting, and Leader protection |
| OP06-088 | Sai | verified | Dynamic +2000 only while an included Dressrosa Leader is active |
| OP06-089 | Taralan | verified | Exact three-card self-mill on both On Play and battle On K.O. |
| OP06-090 | Dr. Hogback | verified | Ordered trash-to-deck cost and another included Thriller Bark recovery |
| OP06-091 | Victoria Cindry | verified | Included Leader gate and exact five-card On Play self-mill |
| OP06-092 | Brook | verified | Controller chooses low-cost opposing trash or opponent-owned ordered trash return |
| OP06-093 | Perona | verified | Opponent-owned hand discard at threshold; turn-scoped cost reduction and no-choice boundary |
| OP06-094     | Lola                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP06-099 | Aisa | verified | Private top-Life inspection for either player and chosen bottom movement |
| OP06-100 | Inuarashi | verified | DON!! x2 hand cost and opponent-Life-bounded K.O.; physical-card Life Trigger play |
| OP06-101 | O-Nami | verified | Chosen turn-scoped Banish grant; Life Trigger opposing cost-5 K.O. |
| OP06-102 | Kamakiri | verified | Cost-1 Stage-to-owner-deck activation cost, low-cost K.O., once-per-turn, unpaid rejection; Life Trigger plays at own Life two or less |
| OP06-103 | Kawamatsu | verified | Two-card hand cost and chosen top-or-bottom face-up Life movement for a 0-power Character; Life Trigger plays at opponent Life three or less |
| OP06-104 | Kikunojo | verified | On K.O. Life creation threshold and physical-card Life Trigger success/failure boundaries |
| OP06-105     | Genbo                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP06-106 | Kouzuki Hiyori | verified | Optional top-or-bottom Life removal before adding a hand card to top Life; decline branch |
| OP06-107 | Kouzuki Momonosuke | verified | Other included Land of Wano Character to owner Life face-up; public Blocker |
| OP06-108 | Tenguyama Hitetsu | verified | Life Trigger included-type turn power grant and physical-card play |
| OP06-109 | Denjiro | verified | Conditional physical-card Life Trigger play and DON!! x2 effect-K.O. protection |
| OP06-110 | Nekomamushi | verified | Conditional physical-card Life Trigger play and DON!! x2 active-Character attack/K.O. |
| OP06-111 | Braham | verified | Conditional Life Trigger play; cost-1 Stage payment, low-cost rest, once-per-turn, and unpaid rejection |
| OP06-112 | Raizo | verified | When Attacking chosen hand cost and opposing DON!! rest; Life Trigger threshold |
| OP06-113 | Raki | verified | Dynamic Blocker from another included Shandian Warrior Character; same-name exclusion |
| OP06-114 | Wyper | verified | Either-player cost-1 Stage payment, owner destination, name-or-trait search, and remainder order |
| OP06-118 | Roronoa Zoro | verified | Separate paid When Attacking and Activate Main once-per-turn reactivations |
| OP06-119 | Sanji | verified | Mandatory public top-card reveal; optional non-Sanji cost-nine-or-less play; declined and ineligible bottom-deck fallback |
| OP07-002 | Ain | verified | Selected opposing Character power set to 0 for the turn and cleanup |
| OP07-003 | Outlook III | verified | Optional self-trash cost; up-to-two opposing power reductions; decline |
| OP07-004 | Curly.Dadan | verified | Optional chosen hand trash; top-five power-filtered search; ordered remainder; decline |
| OP07-005 | Carina | verified | On Play opposing power reduction, turn cleanup, and public Blocker redirect |
| OP07-006 | Sterry | verified | Optional active-Leader power cost; ordered draw then chosen hand trash; decline |
| OP07-007     | Dice                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP07-008 | Mr. Tanaka | verified | Physical Life Trigger play and public Blocker redirect |
| OP07-009 | Dogura & Magura | verified | Red cost-1 target filtering; temporary Double Attack; zero choice |
| OP07-010 | Baccarat | verified | Opponent-attack optional hand cost; battle power; decline; once per turn; Blocker |
| OP07-011 | Bluejam | verified | DON!! x1 attack gate and opposing power-2000-or-less K.O. filtering |
| OP07-012 | Porchemy | verified | Opposing Character -1000 for the turn, zero choice, and cleanup |
| OP07-013 | Masked Deuce | verified | Exact Leader gate; name-or-red-Event search; physical reveal; ordered remainder |
| OP07-014 | Moda | verified | Your-turn named Leader-or-Character target and temporary +2000 power |
| OP07-015 | Monkey.D.Dragon | verified | Two rested DON!! assigned to one field card and same-turn Rush attack |
| OP07-020 | Aladine | verified | Blocker; battle K.O.; included Leader trait; low-cost Fish-Man-or-Merfolk hand play |
| OP07-021 | Urouge | verified | End-turn up-to-one rested DON!! activation and public Blocker redirect |
| OP07-022 | Otama | verified | Green included-Land of Wano search; name exclusion; physical choice; ordered remainder |
| OP07-023 | Caribou | verified | Dynamic six-rested-DON!! +1000 power threshold and public Blocker redirect |
| OP07-024 | Koala | verified | Opponent-attack self-rest cost; filtered temporary Blocker; decline and cleanup |
| OP07-025 | Coribou | verified | Optional exact-name cost-4-or-less hand play rested |
| OP07-026 | Jewelry Bonney | verified | Opposing rested Character-or-DON!! target; next-Refresh freeze and expiry |
| OP07-027     | Jinbe                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP07-028     | Scratchmen Apoo                                 | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP07-029 | Basil Hawkins | verified | Conditional Blocker; opponent-effect removal replacement; opposing rest payment; once per turn |
| OP07-030 | Pappag | verified | Dynamic named-Character Blocker condition and absent-condition boundary |
| OP07-031 | Bartolomeo | verified | Public Blocker; own-effect Character-rest reaction including Stainless rest cost; ordered draw/trash; once per turn |
| OP07-032 | Fisher Tiger | verified | Included Leader trait; opposing cost filter/rest; zero choice; same-turn Character attack |
| OP07-033 | Monkey.D.Luffy | verified | Three-Character threshold; low-cost ally effect-K.O. protection; name/cost/self exclusions |
| OP07-034 | Roronoa Zoro | verified | Three-Character attack threshold and temporary +2000 power |
| OP07-039 | Edward Weevil | verified | DON!! x1 attack gate; private top-three ordering; top-or-bottom placement |
| OP07-040 | Crocodile | verified | Optional DON!! rest; either-field low-cost return to owner hand; decline |
| OP07-041 | Gloriosa (Grandma Nyon) | verified | Alternative included-trait top-five search; self exclusion; ordered remainder |
| OP07-042 | Gecko Moria | verified | Leader gate; other-Character bottom-deck replacement; source provenance; once per turn |
| OP07-043 | Salome | verified | Your-turn named Leader-or-Character target and temporary +2000 power |
| OP07-044 | Dracule Mihawk | verified | Physical top-card draw with concealed opponent view |
| OP07-045 | Jinbe | verified | Included-Warlords low-cost hand play; all-Jinbe name exclusion; zero choice |
| OP07-046 | Sengoku | verified | Included-Warlords any-category search; physical reveal; ordered remainder |
| OP07-047 | Trafalgar Law | verified | Optional self-return cost before hand threshold; opponent-owned hand-bottom choice; decline |
| OP07-048 | Donquixote Doflamingo | verified | Paid once-per-turn top reveal; filtered optional rested play; failed-condition top retention; declined eligible play goes to bottom |
| OP07-049 | Buckin | verified | Optional exact-name cost-4-or-less hand play rested |
| OP07-050 | Boa Sandersonia | verified | Mixed alternative-trait count; opposing low-cost hand return; failed threshold |
| OP07-051 | Boa Hancock | verified | Non-Luffy attack lock through next turn; either-field low-cost bottom choice and cleanup |
| OP07-052 | Boa Marigold | verified | Mixed alternative-trait count; either-field low-cost bottom choice; failed threshold |
| OP07-053 | Portgas.D.Ace | verified | Draw two; chosen exact-two hand cards; explicit order; shared top-or-bottom position; Blocker |
| OP07-054 | Marguerite | verified | Physical On Play draw and public Blocker redirect |
| OP07-060 | Itomimizu | verified | Included Leader/no-other-copy gates; rested DON!! add; once per turn; rejection |
| OP07-061 | Vinsmoke Sanji | verified | Optional DON!! -1; post-cost included Leader gate; draw and decline boundaries |
| OP07-062 | Vinsmoke Reiju | verified | DON!! parity gate; included-trait exact-cost owner-hand return; failed gate |
| OP07-063 | Capote | verified | Optional DON!! -1; post-cost Leader gate; opposing cost filter; next-turn attack lock |
| OP07-064 | Sanji | verified | Conditional in-hand -3 cost projection/payment; Law effect-play after DON return checks two-DON gap; public Blocker redirect |
| OP07-065 | Gina | verified | Included Leader plus DON!! parity gates; optional active DON!! add; failed gates |
| OP07-066 | Tony Tony.Chopper | verified | DON!! parity gate; optional rested DON!! add; public Blocker redirect |
| OP07-067     | Tonjit                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP07-068 | Hamburg | verified | DON!! x1 plus parity attack gates; optional rested DON!! add; failed gates |
| OP07-069 | Pickles | verified | DON!! parity grants effect-K.O. protection to other Foxy Pirates only; battle K.O. remains legal |
| OP07-070 | Big Bun | verified | DON!! parity-gated rested play of an included low-cost Foxy Pirates Character |
| OP07-071 | Foxy | verified | Opponent-turn field-wide cost reduction; once-per-turn rested DON!! activation |
| OP07-072 | Porche | verified | Optional DON!! return, included-trait search and order, then low-power purple play |
| OP07-073 | Monkey.D.Luffy | verified | Once-per-turn DON!! return and conditional reactivation after the cost |
| OP07-074 | Monda | verified | Optional self-trash; Foxy Pirates Leader gate applies only to the rested DON!! result |
| OP07-080 | Kaku | verified | Ordered included-CP trash cost before temporary opposing cost reduction |
| OP07-081 | Kalifa | verified | DON!! x1 and own-turn gated field-wide opposing cost reduction |
| OP07-082 | Captain John | verified | Exact two-card deck trash before temporary opposing cost reduction |
| OP07-083 | Gecko Moria | verified | Ordered four-card Thriller Bark trash return grants Banish and temporary power |
| OP07-084 | Gismonda | verified | Blocker prompt and attack redirection |
| OP07-085 | Stussy | verified | Optional own-Character trash cost before opposing Character K.O. choice |
| OP07-086 | Spandam | verified | Two-card self-mill before temporary opposing cost reduction |
| OP07-087 | Baskerville | verified | Own-turn +3000 while an opposing cost-0 Character exists |
| OP07-088 | Hattori | verified | Rob Lucci Leader-or-Character target receives temporary +2000 |
| OP07-089     | Maha                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP07-090 | Morgans | verified | Opponent-selected discard, full-hand reveal, then opponent draw; newly drawn card remains private |
| OP07-091 | Monkey.D.Luffy | verified | Opposing low-cost trash, variable eligible trash return and order, +1000 per complete three; five versus six returned cards |
| OP07-092 | Joseph | verified | Ordered two-card CP trash return before opposing cost-1 K.O. |
| OP07-093 | Rob Lucci | verified | Ordered three-card cost, opponent discard, then controller-chosen optional opponent-trash return |
| OP07-098 | Atlas | verified | Life comparison battle-K.O. immunity; Vegapunk Life Trigger physical-card play |
| OP07-099 | Usopp | verified | Egghead target +2000 through the end of its controller's next turn |
| OP07-100 | Edison | verified | Two-Life On Play draw/trash sequence; Vegapunk Life Trigger physical-card play |
| OP07-101 | Shaka | verified | Vegapunk Life Trigger physical-card play and later Blocker behavior |
| OP07-102 | Jinbe | verified | Life Trigger returns opposing cost-4-or-less Character, then adds self to hand |
| OP07-103 | Tony Tony.Chopper | verified | Life Trigger grants temporary Blocker to Egghead Character, then adds self to hand |
| OP07-104 | Nico Robin | verified | Egghead Leader-gated Life Trigger draw |
| OP07-105 | Pythagoras | verified | Two-Life On K.O. rested Egghead trash play; Vegapunk Life Trigger play |
| OP07-106 | Fuza | verified | DON!! x1 and one-Life gated attacking K.O. of cost-3-or-less Character |
| OP07-107 | Franky | verified | Life Trigger draw, then one-Life play or higher-Life self-trash branch |
| OP07-108     | Vega Force 01                                   | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP07-109 | Monkey.D.Luffy | verified | Self-trash paid before low-Life gate covers K.O. and draw; Life Trigger K.O. retained |
| OP07-110 | York | verified | Bottom-Life payment before opposing low-cost K.O.; Vegapunk Life Trigger play |
| OP07-111 | Lilith | verified | Included Egghead search excluding self with ordered remainder; Trigger play activates On Play |
| OP07-112 | Lucy | verified | Life payment, opposing rest, then conditional Life replenishment |
| OP07-113 | Roronoa Zoro | verified | Egghead Leader-gated Life Trigger rests opposing Leader or Character |
| OP07-118 | Sabo | verified | Hand-trash cost; cost-5 and cost-3 groups selected before one K.O. |
| OP07-119 | Portgas.D.Ace | verified | Optional top-deck Life add; post-resolution Life count condition grants Rush even when Life addition is declined |
| OP08-003 | Twenty Doctors | verified | Blocker prompt and attack redirection |
| OP08-004 | Kuromarimo | verified | Chess field condition gates opposing 3000-power-or-less K.O. |
| OP08-005 | Chess | verified | Opposing -2000 power, then conditional Kuromarimo play |
| OP08-006 | Chessmarimo | verified | Printed behavior is unstructured |
| OP08-007 | Tony Tony.Chopper | verified | Dual own-turn timings; Animal/power search filter and rested play |
| OP08-008 | Dalton | verified | Temporary opposing -1000; DON!! x1, Life payment and once-per-turn Rush |
| OP08-009     | Maria Onion Bear                                | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP08-010 | Hiking Bear | verified | DON!! x1 once-per-turn boost to another included Animal Character |
| OP08-011     | Musshuru                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP08-012 | Lapins | verified | DON!! x2 and included Drum Kingdom Leader gate attacking 4000-power K.O. |
| OP08-013 | Robson | verified | DON!! x2 grants Rush only while attached |
| OP08-014 | Wapol | verified | Opposing temporary -2000 and self-power through opponent's next turn |
| OP08-015 | Dr.Kureha | verified | Tony Tony.Chopper-or-included Drum Kingdom search excluding self |
| OP08-016 | Dr.Hiriluk | verified | Self-rest cost before Leader gate; field-wide Tony Tony.Chopper +2000 |
| OP08-022 | Inuarashi | verified | Minks Leader-gated freeze of up to two rested cost-5-or-less Characters |
| OP08-023 | Carrot | verified | On Play and When Attacking freeze through target's next Refresh |
| OP08-024 | Concelot | verified | When Attacking freeze of rested cost-4-or-less Character |
| OP08-025 | Shishilian | verified | On Play Minks Character recovery from trash and public hand result |
| OP08-026 | Giovanni | verified | DON!! x1 When Attacking rested-DON!! transfer to a Minks recipient |
| OP08-027     | Tristan                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP08-028 | Nekomamushi | verified | On Play seven-rested-card boundary including rested DON!! and draw |
| OP08-029 | Pekoms | verified | Blocker and opponent-turn K.O. replacement draw behavior |
| OP08-030 | Pedro | verified | On K.O. filtered Minks play from hand and normal On Play continuation |
| OP08-031 | Miyagi | verified | On Play Minks Leader gate and rested DON!! addition |
| OP08-032 | Milky | verified | Once-per-turn rest cost, Minks gate, and Character power modifier |
| OP08-033 | Roddy | verified | On Play six-rested-card boundary including rested DON!! and draw |
| OP08-034 | Wanda | verified | On Play included-Minks search, reveal, and ordered remainder |
| OP08-035     | BB                                              | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP08-040 | Atmos | verified | Inclusive Whitebeard Pirates hand reveal cost and opponent Character return |
| OP08-041 | Aphelandra | verified | Rest cost and cost-filtered opponent Character return |
| OP08-042 | Edward Weevil | verified | DON!! x1 When Attacking Leader-type gate and draw |
| OP08-043 | Edward.Newgate | verified | Selected-Character attack tax, repeated payment, unaffected later entrant, and duration |
| OP08-044 | Kingdew | verified | Inclusive Whitebeard Pirates reveal cost and Character power gain |
| OP08-045 | Thatch | verified | Mandatory opponent-effect and battle-K.O. replacement, self-trash, and draw |
| OP08-046 | Shakuyaku | verified | Self-effect removal provenance, opposing hand choice, rest, and once per turn |
| OP08-047 | Jozu | verified | Return-other-Character cost, Leader gate, and opposing return target |
| OP08-048     | Sweetpea                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP08-049 | Speed Jil | verified | Top-card reveal, top-or-bottom choice, included trait condition, and Rush |
| OP08-050 | Namule | verified | On Play hand threshold and draw |
| OP08-051 | Buckin | verified | On Play name-gated trash recovery and public hand result |
| OP08-052 | Portgas.D.Ace | verified | Public top-card reveal, eligible Whitebeard Pirate cost-4 play, skipped/invalid reveal top-or-bottom placement and subsequent draw |
| OP08-059 | Alber | verified | Once-per-turn rest cost, DON!! return, and opponent Character K.O. |
| OP08-060 | King | verified | DON!! -1 On Play and cost-filtered opponent Character K.O. |
| OP08-061 | Charlotte Oven | verified | Printed 1000 Counter through battle; When Attacking DON!! -1 and opposing power reduction |
| OP08-062 | Charlotte Katakuri | verified | Dynamic cost range bounded by opponent DON!! and hand play |
| OP08-063 | Charlotte Katakuri | verified | Face-up top-Life cost turns face-down before conditional hand discard |
| OP08-064 | Charlotte Cracker | verified | DON!! -1 activation and filtered Big Mom Pirates hand play |
| OP08-065     | Charlotte Smoothie                              | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP08-066 | Charlotte Brulee | verified | Blocker retarget, battle K.O., and rested DON!! addition |
| OP08-067 | Charlotte Pudding | verified | Self-effect DON!! return reaction and once-per-turn draw |
| OP08-068 | Charlotte Perospero | verified | DON!! -1, On K.O. Life addition, and Life Trigger play |
| OP08-069 | Charlotte Linlin | verified | DON!! -1 On Play, post-cost Life gate, and opposing Life trash |
| OP08-070 | Baron Tamago | verified | Blocker and On K.O. Count Niwatori play from hand |
| OP08-071 | Count Niwatori | verified | Blocker and On K.O. Viscount Hiyoko play from hand |
| OP08-072 | Biscuit Warrior | verified | Unlimited-copy deck rule and public Blocker retarget/battle result |
| OP08-073 | Viscount Hiyoko | verified | Blocker and On K.O. Baron Tamago play from hand |
| OP08-074 | Black Maria | verified | Once-per-turn DON!! addition and live end-turn DON!! equalization |
| OP08-078     | Ulti                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP08-079 | Kaido | verified | Hand trash paid before played-this-turn gate covers opposing field trash and hand discard |
| OP08-080 | Queen | verified | On Play hand-trash cost and draw |
| OP08-081 | Guernica | verified | When Attacking DON!! return cost and cost reduction |
| OP08-082 | Sasaki | verified | Printed 2000 Counter through battle; compound DON!!/self-rest cost and opposing cost reduction |
| OP08-083 | Sheepshead | verified | Live opponent-turn cost reduction for Animal Kingdom Pirates Characters |
| OP08-084 | Jack | verified | Rest cost, hand-trash cost, draw, and once per turn |
| OP08-085 | Jinbe | verified | When Attacking DON!! attachment transfer and recipient filtering |
| OP08-086 | Ginrummy | verified | On Play hand threshold and draw |
| OP08-087 | Scratchmen Apoo | verified | Rest cost, DON!! -1, opposing rest target, and once per turn |
| OP08-088 | Duval | verified | On Play selects an opposing Character and applies the printed timed cost increase |
| OP08-089     | Basil Hawkins                                   | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP08-090 | Hamlet | verified | On Play maps the inclusive SMILE Leader trait and power modifier |
| OP08-091 | Who's.Who | verified | Exact Who's.Who name exclusion through real search; optional hand cost and both printed K.O. timings |
| OP08-092 | Page One | verified | Optional named cost-filtered Character play from trash |
| OP08-093 | X.Drake | verified | Conditional permanent effective-cost modifier and failure boundary |
| OP08-099     | Kalgara                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP08-100 | South Bird | verified | Top-7 Stage play works with a full Character area and orders the remainder |
| OP08-101 | Charlotte Angel | verified | Immediate Life cost, conditional delayed deck-to-Life result, and once limit |
| OP08-102 | Charlotte Opera | verified | Optional hand cost and dynamic self-Life play-cost modifier |
| OP08-103 | Charlotte Custard | verified | Top-Life cost and power duration through the opponent's next turn |
| OP08-104 | Charlotte Poire | verified | Life Trigger hand cost, physical self-play, and draw continuation |
| OP08-105 | Jewelry Bonney | verified | Opponent-Life provenance, DON and turn gates, once limit, draw-trash order, and Life Trigger |
| OP08-106 | Nami | verified | Trigger-card hand cost, cost-5 K.O., conditional draw, and Life Trigger activation |
| OP08-107 | Nitro | verified | Self-rest cost and Charlotte Pudding Leader-or-Character target restriction |
| OP08-108     | Mont Blanc Cricket                              | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP08-109 | Mont Blanc Noland | verified | Inclusive Leader trait and named-Character gate add top deck to Life |
| OP08-110 | Wyper | verified | Private top-5 search, ordered remainder, and selected Stage play |
| OP08-111 | S-Shark | verified | DON-gated Blocker suppression and post-cost conditional Life Trigger self-play |
| OP08-112 | S-Snake | verified | Filtered attack restriction and Life Trigger activation of On Play |
| OP08-113 | S-Bear | verified | Hand cost, Life threshold, physical self-play, and cost-3 K.O. continuation |
| OP08-114 | S-Hawk | verified | DON and Life-gated Slash battle protection, power bonus, and conditional Trigger play |
| OP08-118 | Silvers Rayleigh | verified | Ordered unequal power reductions, independent targets, live-power K.O., and duration expiry |
| OP08-119 | Kaido & Linlin | verified | whenAttacking |
| OP09-002 | Uta | verified | Inclusive Red-Haired Pirates search, reveal, hand move, and ordered remainder |
| OP09-003 | Shachi & Penguin | verified | When Attacking opposing Character power reduction and turn expiry |
| OP09-004 | Shanks | verified | Global opposing Character power reduction and same-turn Rush attack |
| OP09-005 | Silvers Rayleigh | verified | Blocker plus base-power-count draw and controller-owned discard |
| OP09-006     | Howling Gab                                     | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP09-007 | Heat | verified | Blocker and eligible-Leader-only power bonus boundary |
| OP09-008 | Building Snake | verified | Physical self return-to-deck cost and opposing Character power reduction |
| OP09-009 | Benn.Beckman | verified | On Play power-filtered opposing field trash |
| OP09-010 | Bonk Punch | verified | Filtered hand play and DON-attached attack power bonus |
| OP09-011 | Hongo | verified | Self-rest cost, inclusive Leader gate, and official negative power modifier |
| OP09-012 | Monster | verified | Named Bonk Punch effect-K.O. replacement, physical Monster payment, and battle exclusion |
| OP09-013 | Yasopp | verified | Official negative opposing modifier and Leader power bonus duration |
| OP09-014     | Limejuice                                       | verified | Keyword-filtered low-power Blocker choice and non-Blocker exclusion                                                                                                                                      |
| OP09-015 | Lucky.Roux | verified | Blocker and inclusive Leader-gated On K.O. base-power target |
| OP09-016     | Rockstar                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP09-017 | Wire | verified | DON, live Leader power, and inclusive trait jointly gate permanent Rush |
| OP09-023 | Adio | verified | Leader-gated DON activation and opponent-attack DON cost with battle-duration power |
| OP09-024 | Usopp | verified | Rested-Character count gate followed by draw 2 and trash 2 |
| OP09-025 | Crocodile | verified | Inclusive Leader gate protects only against battle K.O. by Leaders |
| OP09-026 | Sakazuki | verified | Rested-count condition and optional cost-5 opposing Character K.O. |
| OP09-027 | Sabo | verified | Once-per-turn rested-count attack draw boundary |
| OP09-028 | Sanji | verified | Top-or-bottom Life cost and inclusive trash play rested |
| OP09-029 | Tony Tony.Chopper | verified | End-turn inclusive-trait restand and cost boundary |
| OP09-030 | Trafalgar Law | verified | Return-Character cost, inclusive hand-play filter, and name exclusion |
| OP09-031 | Donquixote Doflamingo | verified | Blocker and conditional end-turn self-reactivation |
| OP09-032 | Donquixote Rosinante | verified | Blocker and once-per-turn opponent-attack self-reactivation before Block Step |
| OP09-033 | Nico Robin | verified | Rested-count threshold, either-trait effect-K.O. protection, battle exclusion, and expiry |
| OP09-034 | Perona - OP09-034 | verified | Name-or-inclusive-trait search, ordered remainder, and hand-trash continuation |
| OP09-035 | Portgas.D.Ace | verified | Rested-Character threshold, opposing cost filter, selected rest, and below-threshold boundary |
| OP09-036 | Monkey.D.Luffy | verified | Rested-Character threshold and executable Character-or-active-DON!! rest branches |
| OP09-037 | Lim | verified | Included ODYSSEY search/exclusion/order and three-rested-Character end-turn reactivation |
| OP09-038 | Rob Lucci | vanilla | Parameterized vanilla invariant batch |
| OP09-043 | Alvida | verified | Cross Guild Leader gate, filtered hand play, nested On Play continuation, and negative Leader boundary |
| OP09-044 | Izo | verified | Attack timing, alternative trait search, remainder order, mandatory hand trash, and physical identities |
| OP09-045 | Cabaji | verified | Buggy-or-Mohji battle K.O. prevention and no-companion battle boundary |
| OP09-046 | Crocodile | verified | Cross Guild-or-included-Baroque Works hand play, selected identity, and prompt cleanup |
| OP09-047 | Kouzuki Oden | verified | Double Attack Life damage and On K.O. draw-2 then selected physical hand trash |
| OP09-048 | Dracule Mihawk | verified | Blocker retarget/rest and On Play draw-2 then selected physical hand trash |
| OP09-049     | Jozu                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP09-050     | Nami                                            | verified | whenAttacking                                                                                                                                                                                            |
| OP09-051     | Buggy                                           | verified | onPlay                                                                                                                                                                                                   |
| OP09-052     | Marco                                           | verified | onKo                                                                                                                                                                                                     |
| OP09-053     | Mohji                                           | verified | onPlay                                                                                                                                                                                                   |
| OP09-054     | Richie                                          | verified | Blocker                                                                                                                                                                                                  |
| OP09-055     | Mr.1(Daz.Bonez)                                 | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP09-056     | Mr.3(Galdino)                                   | verified | onPlay                                                                                                                                                                                                   |
| OP09-063     | Usopp                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP09-064     | Killer                                          | verified | onPlay                                                                                                                                                                                                   |
| OP09-065     | Sanji                                           | verified | onPlay                                                                                                                                                                                                   |
| OP09-066     | Jean Bart                                       | verified | onPlay                                                                                                                                                                                                   |
| OP09-067     | Jinbe                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP09-068     | Tony Tony.Chopper                               | verified | endOfYourTurn                                                                                                                                                                                            |
| OP09-069     | Trafalgar Law                                   | verified | onPlay                                                                                                                                                                                                   |
| OP09-070     | Nami                                            | verified | onPlay                                                                                                                                                                                                   |
| OP09-071     | Nico Robin                                      | verified | Blocker                                                                                                                                                                                                  |
| OP09-072     | Franky                                          | verified | onPlay                                                                                                                                                                                                   |
| OP09-073     | Brook                                           | verified | whenAttacking                                                                                                                                                                                            |
| OP09-074     | Bepo                                            | verified | whenDonReturned                                                                                                                                                                                          |
| OP09-075     | Eustass"Captain"Kid                             | verified | onPlay                                                                                                                                                                                                   |
| OP09-076     | Roronoa Zoro                                    | verified | onPlay                                                                                                                                                                                                   |
| OP09-082     | Avalo Pizarro                                   | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP09-083     | Van Augur                                       | verified | activateMain, onKo                                                                                                                                                                                       |
| OP09-084 | Catarina Devon | verified| activateMain |
| OP09-085     | Gecko Moria                                     | verified | onPlay                                                                                                                                                                                                   |
| OP09-086 | Jesus Burgess | verified| permanent |
| OP09-087     | Charlotte Pudding                               | verified | onPlay                                                                                                                                                                                                   |
| OP09-088     | Shiryu                                          | verified | whenAttacking                                                                                                                                                                                            |
| OP09-089     | Stronger                                        | verified | Hand trash and source trash paid before Blackbeard Pirates gate covers draw and opposing cost reduction |
| OP09-090     | Doc Q                                           | verified | activateMain, onKo                                                                                                                                                                                       |
| OP09-091     | Vasco Shot                                      | verified | Blocker                                                                                                                                                                                                  |
| OP09-092     | Marshall.D.Teach                                | verified | activateMain                                                                                                                                                                                             |
| OP09-093     | Marshall.D.Teach                                | verified | Blackbeard and played-this-turn gates; separate Leader and Character targets; Character negation and attack restriction through opponent next turn; expiry, Blocker, OPT and decline choices |
| OP09-094     | Peachbeard                                      | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP09-095     | Laffitte                                        | verified | activateMain                                                                                                                                                                                             |
| OP09-100 | Karasu | verified| Life Trigger |
| OP09-101     | Kuzan                                           | verified | Mandatory opposing cost-3 Character-to-Life payment; chosen face-up top/bottom placement before opponent discard; no activation when payment is unavailable |
| OP09-102     | Professor Clover                                | verified | onPlay, Life Trigger                                                                                                                                                                                     |
| OP09-103     | Koala                                           | verified | onPlay                                                                                                                                                                                                   |
| OP09-104 | Sabo | verified | Face-up Life placement, top-or-bottom Life choice, and multicolored-Leader Trigger draw |
| OP09-105 | Sanji | verified | Egghead-gated Trigger adds top deck to Life, then trashes two from hand |
| OP09-106 | Nico Olvia | verified | On Play and Trigger Life behavior with legal and gated boundaries |
| OP09-107 | Nico Robin | verified | Opponent-Life gate and yellow cost-3 hand-play Trigger |
| OP09-108 | Bartholomew Kuma | verified | Revolutionary Army and total-Life gated self-play Trigger |
| OP09-109 | Jaguar.D.Saul | verified | Blocker plus Nico Robin-gated self-play Trigger |
| OP09-110 | Pierre | verified | On Play draw/trash sequence and self-play Trigger |
| OP09-111 | Brook | verified | Egghead and opponent-hand gated Trigger trash |
| OP09-112 | Belo Betty | verified | Low-Life draw and Revolutionary Army total-Life self-play Trigger |
| OP09-113 | Morley | vanilla | Parameterized vanilla invariant batch |
| OP09-114 | Lindbergh | verified | Total-Life gated power K.O. and self-play Trigger |
| OP09-118 | Gol.D.Roger | verified | Rush and either-player-zero-Life win on opponent Blocker activation |
| OP09-119 | Monkey.D.Luffy | verified | Variable DON!! return, draw, and temporary Rush |
| OP10-004 | Vergo | verified | Punk Hazard search, self-name exclusion, and ordered remainder |
| OP10-005 | Sanji | verified | On K.O. behavior and permanent clause |
| OP10-006 | Caesar Clown | verified | On Play behavior and legal target boundary |
| OP10-007 | Ceaser Soldier | verified | Punk Hazard cost-2-or-less hand play |
| OP10-008 | Scotch | verified | Blocker behavior and printed clauses |
| OP10-009 | Smiley | verified | Punk Hazard Leader gate and opponent Character -3000 power |
| OP10-010 | Chadros.Higelyges (Brownbeard) | verified | When Attacking behavior and boundaries |
| OP10-011 | Tony Tony.Chopper | verified | Permanent behavior and applicable target boundary |
| OP10-012 | Dragon Number Thirteen | verified | Blocker behavior |
| OP10-013 | Nami | vanilla | Parameterized vanilla invariant batch |
| OP10-014 | Franky | vanilla | Parameterized vanilla invariant batch |
| OP10-015 | Mocha | verified | Official -1000 On Play behavior |
| OP10-016 | Monet | verified | Official -1000 Activate Main behavior |
| OP10-017 | Rock | verified | On Play behavior and legal target boundary |
| OP10-023 | Issho | verified | Inclusive Navy Leader gate and two cost-5 rest targets |
| OP10-024 | Edward.Newgate | verified | On Play behavior and boundaries |
| OP10-025 | Enel | verified | On Play behavior and boundaries |
| OP10-026 | Kin'emon | verified | Combined field-and-trash payment with chosen bottom order, saved decisions, invalid retries and attached DON return; optional exact Kinemon play |
| OP10-027 | Kin'emon | verified | Combined field-and-trash payment with chosen bottom order, saved decisions, invalid retries and attached DON return; optional exact Kinemon play |
| OP10-028 | Kouzuki Momonosuke | verified | Activate Main cost, search, two-card choice, and ordered remainder |
| OP10-029 | Dracule Mihawk | verified | Rested-count gate and ODYSSEY reactivation |
| OP10-030 | Smoker | verified | Banish, DON!! reactivation, and Character-effect restriction |
| OP10-031 | Sengoku | vanilla | Parameterized vanilla invariant batch |
| OP10-032 | Tashigi | verified | Rests itself instead of opponent-effect removal of another green Character |
| OP10-033 | Nami | verified | Rested ODYSSEY gate, DON-only freeze target, and Refresh expiry |
| OP10-034 | Franky | verified | Once-per-turn battle K.O. Life replacement |
| OP10-035 | Brook | verified | On K.O. behavior and boundaries |
| OP10-036 | Perona | verified | Character-rested-by-effect trigger |
| OP10-037 | Lim | verified | Opponent-effect removal replacement and end-turn reactivation |
| OP10-038 | Roronoa Zoro | verified | Permanent behavior and boundaries |
| OP10-043 | Moocy | verified | Printed Counter 2000 in a real battle; conditional Banish attack and Leader gate |
| OP10-044 | Cub | verified | Dressrosa Stage cost and opponent cost-1 return |
| OP10-045 | Cavendish | verified | When Attacking behavior and boundaries |
| OP10-046 | Kyros | verified | Either-player cost-5 Character return |
| OP10-047 | Koala | verified | Inclusive Revolutionary Army return cost and +3000 power |
| OP10-048 | Sai | verified | Dressrosa Leader cost and opponent cost-1 return |
| OP10-049 | Sabo | verified | Other cost-7-or-less Character removal replacement by returning self |
| OP10-050     | Hajrudin                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP10-051 | Hack | verified | DON!! x1 attack searches an included Revolutionary Army Character |
| OP10-052 | Bartolomeo | verified | Either-player cost-1 bottom-deck choice and public Blocker redirect |
| OP10-053 | Bian | verified | Other-Tontatta conditional Blocker and self-only exclusion |
| OP10-054     | Blue Gilly                                      | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP10-055 | Marco | verified | Blocker and On K.O. opposing cost-4 return |
| OP10-056 | Mansherry | verified | Ordered Dressrosa Leader-or-Stage rest and cost-4 Character return payments; opposing return |
| OP10-057 | Leo | verified | Leader-or-Stage payment; Usopp-gated top-5 search and hand trash |
| OP10-058 | Rebecca | verified | Cost-8 field condition gates draw and physical reveal/grouped play; active/rested placement preserved |
| OP10-062 | Violet | verified | On K.O. DON!! return followed by purple Event recovery |
| OP10-063 | Vinsmoke Sanji | verified | Included GERMA Leader search and ordered bottom remainder |
| OP10-064 | Clone Soldier | verified | Defender-owned Blocker choice and attack redirect |
| OP10-065 | Sugar | verified | Self/DON!! rest costs; included Donquixote search and ordering |
| OP10-066 | Giolla | verified | Once-per-turn two-DON!! payment and opposing low-cost rest |
| OP10-067 | Senor Pink | verified | DON!! return; purple Event recovery; DON!! reactivation |
| OP10-068     | Diamante                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP10-069 | Fighting Fish | verified | Attached DON condition rechecked after DON return payment; sole attached payment stops KO while separate DON payment permits it |
| OP10-070 | Trebol | verified | Base-power-1000 effect-K.O. protection duration and Blocker |
| OP10-071 | Donquixote Doflamingo | verified | DON!! return hand play; opponent-attack DON!! rest and active DON!! gain |
| OP10-072 | Donquixote Rosinante | verified | Event-only hand trash/draw; seven-DON!! end-turn reactivation |
| OP10-073     | Buffalo                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP10-074 | Pica | verified | Effect-K.O. replacement rests two DON!! once; battle K.O. excluded |
| OP10-075 | Foxy | verified | Self-trash cost and equal-DON!! draw boundary |
| OP10-076 | Baby 5 | verified | Hand trash before included-Leader active-DON!! addition |
| OP10-077 | Bellamy | verified | Blocker; two-DON!! On Block payment; active DON!! addition |
| OP10-081 | Usopp | verified | Dressrosa Leader-or-Stage rest; low-cost K.O.; deck trash |
| OP10-082 | Kuzan | verified | Opponent-effect removal exclusion; self-trash draw and filtered trash play |
| OP10-083 | Kouzuki Momonosuke | verified | Self plus Dressrosa Leader-or-Stage rest before cost reduction |
| OP10-084     | Sanjuan.Wolf                                    | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP10-085 | Jesus Burgess | verified | DON!!/trash-gated Rush and seven-trash negative boundary |
| OP10-086 | Shiryu | verified | Opponent-turn power duration and same-turn Blackbeard K.O. activation |
| OP10-087 | Tony Tony.Chopper | verified | Compound rest paid before opponent hand-count gate; successful discard below threshold still mills two |
| OP10-088 | Nami | verified | Compound rest costs; draw then deck trash |
| OP10-089     | Nico Robin                                      | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP10-090 | Franky | verified | Blocker and battle/effect K.O. rested Dressrosa play |
| OP10-091 | Brook | verified | Compound rest costs; low-cost K.O.; deck trash |
| OP10-092 | Perona | verified | Included Thriller Bark ordered trash-to-deck cost and non-Perona power target |
| OP10-093 | Saint Homing | verified | Self-trash and black-Character +3 cost through opponent's next turn |
| OP10-094 | Ryuma | verified | DON!! x1 Double Attack and unattached single-damage boundary |
| OP10-095 | Roronoa Zoro | verified | Dressrosa Leader-or-Stage rest; cost-4 K.O.; deck trash |
| OP10-100 | Inazuma | verified | Combined-Life rest limit and Life Trigger play boundary |
| OP10-101     | Urouge                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP10-102 | Emporio.Ivankov | verified | Revolutionary Army power target and once-per-turn top-Life payment |
| OP10-103 | Capone"Gang"Bege | verified | Top/bottom Life payment and compound Supernovas face-up Life placement |
| OP10-104 | Caribou | verified | DON!!/Supernovas/three-Life battle protection |
| OP10-105     | Cavendish                                       | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP10-106 | Killer | verified | On K.O. included Supernovas-or-Kid Pirates search and ordering |
| OP10-107 | Jewelry Bonney | verified | Blocker; top/bottom Life payment; exact-cost Supernovas face-up Life placement |
| OP10-108 | Scratchmen Apoo | verified | Other yellow included-Supernovas conditional Blocker |
| OP10-109 | Basil Hawkins | verified | On K.O. opposing top-Life trash |
| OP10-110 | Heat & Wire | verified | onPlay, Life Trigger |
| OP10-111 | Monkey.D.Luffy | verified | Included Supernovas search, self-name exclusion, and ordered deck-bottom remainder |
| OP10-112 | Eustass"Captain"Kid | verified | Self-rest Life trash; two-Life end-turn draw and chosen hand trash |
| OP10-113 | Roronoa Zoro | verified | Lower-Life Rush and Supernovas-gated Life Trigger hand payment and play |
| OP10-114 | X.Drake | verified | Self-rest cost before Life gate and opposing cost-4 rest boundary |
| OP10-118 | Monkey.D.Luffy | verified | Ordered three-card trash-to-deck attack cost; opposing discard; once-per-turn effect K.O. prevention |
| OP10-119 | Trafalgar Law | verified | Public Supernovas reveal, same physical card to face-down Life, and rested DON!! attachment |
| OP11-002 | Ain | verified | Opposing -1000 power followed by K.O. at effective 0 power |
| OP11-003     | Usopp                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-004 | Kujyaku | verified | Included Navy search with self-name exclusion; self-trash activation and own power target |
| OP11-005 | Smoker | verified | Blocker; DON!!-gated protection from non-Special Character-effect K.O. only |
| OP11-006 | Zephyr | verified | DON!! x1 opposing Special Character -5000 and no-DON!! boundary |
| OP11-007 | Tashigi | verified | Self-rest payment before Navy Leader gate and included Character power target |
| OP11-008 | Doll | verified | Blocker; chosen hand trash before Navy gate and opposing -6000 power |
| OP11-009 | Nico Robin | verified | DON!! x2 opposing power reduction through the opponent's next turn |
| OP11-010 | Hibari | verified | On Play opposing -2000; attack power gain and Navy Leader active-Character permission |
| OP11-011     | Bins                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-012 | Franky | verified | Own-turn opponent Event Counter provenance, all-Character boost, and once-per-turn limit |
| OP11-013 | Prince Grus | verified | Attack-time Blocker suppression for power-2000-or-less Characters |
| OP11-014 | Borsalino | verified | Blocker; self-rest activation and included Navy active-Character attack permission |
| OP11-015     | Mocha                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-016 | Roronoa Zoro | verified | Once-per-turn selectable rested DON!! attachment to own Leader or Character |
| OP11-017     | X.Drake                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-023 | Arlong | verified | Three live hand-cost conditions; additive minus-three discount and four-DON payment; opposing low-cost Trigger rest |
| OP11-024 | Aladine | verified | Opponent-effect K.O. provenance, compound costs, and eligible hand play |
| OP11-025 | Ishilly | verified | Opponent-attack compound rests and own-card battle power target |
| OP11-026     | Scaled Neptunian                                | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-027 | Bulge-Eyed Neptunian | verified | Shirahoshi-gated Character Rush and nonmatching-Leader attack rejection |
| OP11-028 | Lord of the Coast | verified | Rested-Character freeze duration; damaged-player Life Trigger and rested cost-3 K.O. |
| OP11-029 | Charlotte Praline | verified | Opposing cost-1 rest followed by public Blocker retarget |
| OP11-030 | Shirahoshi | verified | Compound activation costs, alternative-trait private search, and ordered remainder |
| OP11-031 | Jinbe | verified | Fish-Man/Merfolk Leader-gated opposing rest and once-per-turn selected Character Rush |
| OP11-032     | Surume                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-033     | Bird Neptunian                                  | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-034 | Hatchan | verified | Self-rest before Leader gate and low-cost opponent protection through next turn |
| OP11-035 | Fisher Tiger | verified | Optional opposing rest; opponent-effect K.O. costs and eligible hand play; battle exclusion |
| OP11-036 | Spotted Neptunian | verified | Shirahoshi gate, Neptunian-or-name search, ordered remainder, and negative boundary |
| OP11-042 | Vito | verified | Included hand-trash payment, play-turn Rush, and decline boundary |
| OP11-043 | Vinsmoke Ichiji | verified | Blocker; opponent-attack target choice before deck trash and all-GERMA gate |
| OP11-044 | Vinsmoke Judge | verified | Chosen hand trash and once-per-turn all-GERMA power boost |
| OP11-045     | Vinsmoke Niji                                   | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-046 | Vinsmoke Yonji | verified | Blocker and all-GERMA protection from opponent-effect rest and K.O. |
| OP11-047 | Vinsmoke Reiju | verified | Vinsmoke Family Leader-gated included GERMA search, trash remainder, and negative gate |
| OP11-048 | Capone"Gang"Bege | verified | Alternative included traits, cost-2-or-more search, and ordered remainder |
| OP11-049 | Carrot | verified | Top-three deck ordering; opponent-attack self-trash and Leader battle power |
| OP11-050 | Gotti | verified | Filtered hand cost, controller-owned destination choice, owner hand or deck-bottom movement |
| OP11-051 | Sanji | verified | Opponent-effect K.O. search/play with battle exclusion; own base-power return choice |
| OP11-052     | Charlotte Lola                                  | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-053     | Tony Tony.Chopper                               | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-054 | Nami | verified | Multicolored-Leader draw and chosen deck-end hand ordering; Blocker |
| OP11-055     | Bartolomeo                                      | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-056 | Brook | verified | Public Blocker and either-owner base-cost-1 Character deck-bottom mapping |
| OP11-057 | Pedro | verified | Four-card hand threshold dynamically grants and removes Blocker |
| OP11-058 | Monkey.D.Luffy | verified | Blocker plus five-card hand attack prohibition and boundary |
| OP11-063 | Little Sadi | verified | Optional DON!! return, post-cost Impel Down Leader gate, and cost-3 rest target |
| OP11-064     | Saldeath                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-065 | Charlotte Anana | verified | Other purple included Big Mom Pirates Character dynamically grants Blocker |
| OP11-066 | Charlotte Oven | verified | Rest cost, guessed opponent top-deck cost, bounded K.O., and rested DON!! gain |
| OP11-067 | Charlotte Katakuri | verified | Blocker; filtered cost-3 Character reactivation and rested DON!! gain at turn end |
| OP11-068     | Charlotte Daifuku                               | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-069 | Charlotte Brulee | verified | Optional top-Life payment, included Leader gate, and active DON!! gain |
| OP11-070 | Charlotte Pudding | verified | Filtered top-five search/order plus DON!!/rest costs and private opponent-deck inspection |
| OP11-071 | Charlotte Perospero | verified | Hand-trash cost, guessed-cost match, draw, active DON!! gain, and once per turn |
| OP11-072 | Charlotte Mont-d'or | verified | DON!!/rest costs; opponent-owned typed trash selection and order; top Life to hand |
| OP11-073 | Charlotte Linlin | verified | Conditional Rush; optional DON!! -5 attack reaction; guessed-cost Leader boost; once per turn |
| OP11-074 | Streusen | verified | DON!!/rest costs, guessed-cost match, bounded opposing Character rest, and once per turn |
| OP11-075 | Jaguar.D.Saul | verified | Nico Robin and DON!! gates for On Play draw plus executable Life Trigger |
| OP11-076 | Hannyabal | verified | Blocker and included Impel Down hand-play filters with cost boundary |
| OP11-077 | Randolph | verified | Own-turn DON!!-return provenance, filtered cost boost, once per turn, and delayed expiry |
| OP11-078     | Decuplets                                       | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-082 | Aramaki | verified | Self-trash paid before Navy gate covers active-target attack permission and top-two deck trash |
| OP11-083 | Caribou | verified | Blocker and exact two-card On Play hand trash |
| OP11-084 | Kuzan | verified | Top-three mill and included Navy active-target attack permission |
| OP11-085 | Kurozumi Orochi | verified | Included SMILE trash recovery with card-category and cost-5 boundaries |
| OP11-086 | Coribou | verified | Hand discard; self-trash cost; filtered Caribou effect-play from trash |
| OP11-087     | Miss Sarahebi                                   | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-088 | Shu | verified | Blocker; Character attack activation; post-activation Slash check with retained attacker context; battle-only +5000 and once per turn |
| OP11-089     | Black Maria                                     | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-090 | Briscola | verified | Public Blocker selection retargets and protects Life |
| OP11-091 | Berry Good | verified | Opponent chooses exactly three Events from trash and privately orders deck-bottom placement |
| OP11-092 | Helmeppo | verified | Optional discard, draw, included SWORD trash play, and exact played-card delayed deck bottom |
| OP11-093     | Bogard                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-094     | Morgan                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-095 | Monkey.D.Garp | verified | Ordered Navy trash cost, rested DON!! attachment, conditional cost-7 K.O., and threshold |
| OP11-096 | Ripper | verified | Other black included Navy Character dynamically grants Blocker |
| OP11-100 | Otohime | verified | Shirahoshi gate, optional top-Life face-down cost, and draw |
| OP11-101 | Capone"Gang"Bege | verified | Blocker; opponent-effect removal replacement puts exact Supernovas Character face-down in Life once |
| OP11-102 | Camie | verified | Opponent Event-or-Trigger provenance; optional activation before current Life threshold; shared once per turn and both-Life trash |
| OP11-103 | Long-Jaw Neptunian | verified | Shirahoshi gate, atomic rest/Life costs, and bounded opposing Character K.O. |
| OP11-104 | Shirley | verified | Blocker; optional Life cost; private Fish-Man Island search and top-or-bottom remainder ordering |
| OP11-105     | Charlotte Chiffon                               | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-106 | Zeus | verified | Optional top-or-bottom Life payment and cost-5 opposing Character K.O. |
| OP11-107 | Topknot Neptunian | verified | Blocker; Shirahoshi-gated Life cost; once-per-turn delayed reactivation |
| OP11-108 | Neptune | verified | Shirahoshi gate, optional Life cost, draw two, and chosen hand discard |
| OP11-109 | Pappag | verified | Camie presence gate, draw two, and exact two-card hand discard |
| OP11-110 | Fukaboshi | verified | Optional K.O. replacement rests eligible Leader; Life payment and cost-1 K.O. |
| OP11-111     | Mamboshi                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-112 | Megalo | verified | Blocker and Shirahoshi-gated opponent-turn-only +4000 power |
| OP11-113     | Ryuboshi                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP11-118 | Monkey.D.Luffy | verified | Rush; optional hand cost; either-owner Character return; rested DON!! attachment |
| OP11-119 | Koby | verified | Active-target attack grant; ordered trash-to-deck cost; cross-turn +1000 and expiry |
| OP12-002     | Edward.Newgate                                  | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-003 | Crocus | verified | On K.O. reveals two Events and plays an eligible red Character from hand |
| OP12-004 | Kouzuki Oden | verified | Once per turn reveals two Events and gains +2000 power for the turn |
| OP12-005     | Shiki                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-006 | Shakuyaku | verified | Searches for either Monkey.D.Luffy or a red Event |
| OP12-007 | Shanks | verified | Gives Rush to another included Roger Pirates Character for the turn |
| OP12-008 | Shanks | verified | Once per turn trashes a hand card on an opponent attack to reduce opposing power |
| OP12-009 | Jinbe | verified | Reveals two Events for Rush and cross-turn power |
| OP12-010     | Douglas Bullet                                  | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-011     | Duval                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-012 | Buggy | verified | Gives another Roger Pirates Character Blocker through the next opponent End Phase |
| OP12-013 | Hatchan | verified | Self-rest cost, exact two-Event reveal, and two rested DON!! attachment |
| OP12-014 | Boa Hancock | verified | Name-or-red-Event search with ordered remainder; self-trash DON!! attachment |
| OP12-015 | Monkey.D.Luffy | verified | Given-DON!! power condition; Event reveal, play, and rested DON!! continuation |
| OP12-021 | Ipponmatsu | verified | Slash Leader plus six rested DON!! prevents opponent-effect rest; Blocker |
| OP12-022 | Inuarashi | verified | Self-rest cost and eligible rested Character Refresh lock |
| OP12-023     | Kawamatsu                                       | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-024 | Gyukimaru | verified | Active opponent-effect K.O. protection; given-DON!! attack rest target |
| OP12-025     | Kin'emon                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-026 | Kuina | verified | Eligible opposing rest, then three rested DON!! to Roronoa Zoro |
| OP12-027 | Koushirou | verified | Self-rest replacement for opponent-effect K.O. of an eligible Slash Character; Blocker |
| OP12-028 | Kouzuki Hiyori | verified | Ordered costs and Slash-or-green-Event search gated by Zoro Leader |
| OP12-029 | Shimotsuki Kouzaburou | verified | Rests cost-2-or-less Character, then K.O.s rested base-cost-1 Character |
| OP12-030 | Dracule Mihawk | verified | Sets four DON!! active, blocks base-cost-7 Character plays for turn, and Blocker |
| OP12-031 | Tashigi | verified | Rests base-cost-6-or-less opponent, then gives three rested DON!! to Zoro |
| OP12-032     | Nekomamushi                                     | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-033 | Helmeppo | verified | Blocker, Life protection, and eligible opponent rest on block |
| OP12-034 | Perona | verified | Slash-Leader-gated Slash-card-or-green-Event search |
| OP12-035     | Morgan                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-036 | Roronoa Zoro | verified | Hand-only effect-play restriction permits trash play; Slash Leader power and battle K.O. protection |
| OP12-042 | Alvida | verified | Base-cost Character-count cost bonus and opposing base-cost-1 bottom-deck |
| OP12-043 | Kuzan | verified | Five-card hand cost bonus; hand cost and cross-turn attack restriction |
| OP12-044 | Sakazuki | verified | Navy Leader draw; chosen discard, rested DON!! attachment, and once per turn |
| OP12-045     | Jango                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-046 | Zephyr(Navy) | verified | Trashes two on play; optional self-trash returns either owner's cost-5 Character |
| OP12-047 | Sengoku | verified | Hand cost, up-to-two included Navy search excluding Sengoku, and ordered remainder |
| OP12-048 | Donquixote Rosinante | verified | Opponent-turn self-rest and discard replacement for blue Navy removal |
| OP12-049     | Buggy                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-050 | Jaguar.D.Saul | verified | Blocker |
| OP12-051     | Hina                                            | verified | Optional self-rest and hand-trash costs; opposing low-base-cost Blocker lock                                                                                                                             |
| OP12-052     | Fullbody                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-053 | Borsalino | verified | Once-per-turn discard removal replacement; Navy Leader opponent-turn power and Blocker |
| OP12-054 | Marshall.D.Teach | verified | Warlords-Leader-gated return of either owner's cost-1 Character excluding self |
| OP12-055 | Mohji & Cabaji | vanilla | Parameterized vanilla invariant batch |
| OP12-056 | Monkey.D.Garp | verified | Chosen hand trash before eligible blue Navy Character play |
| OP12-062 | Vinsmoke Sora | verified | Sanji and DON!! comparison gate; rested DON!! gain then draw |
| OP12-063 | Vinsmoke Reiju | verified | Four-Event trash threshold grants +2000 power, +5 cost, and Blocker |
| OP12-064     | Vergo                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-065 | Emporio.Ivankov | verified | Four-Event Blocker threshold and battle-K.O. Event return |
| OP12-066 | Carne | verified | Four-Event trash threshold grants Blocker |
| OP12-067     | Carmen                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-068     | Gin                                             | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-069 | Crocodile | verified | Once per turn returns DON!! on opponent attack to grant battle power |
| OP12-070     | Sanji                                           | verified | gains 1000 power for each complete group of five Events in trash |
| OP12-071     | Charlotte Pudding                               | verified | searches the top four for either Sanji or an Event |
| OP12-072     | Zeff                                            | verified | with a Sanji Leader gains Rush when a field DON!! returns to the DON!! deck |
| OP12-073     | Trafalgar Law                                   | verified | buffs Donquixote Rosinante and included Heart Pirates after its DON!! comparison |
| OP12-074     | Patty                                           | verified | with a Sanji Leader trashes one selected Event to add an active DON!! |
| OP12-075     | Ms. All Sunday                                  | verified | K.O.s an opposing cost-3-or-less Character before that opponent adds active DON!! |
| OP12-076     | Monet                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-082     | Issho                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-083     | Inazuma                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-084     | Emporio.Ivankov                                 | verified | with an included Revolutionary Army Leader trashes the top three deck cards on play |
| OP12-085     | Karasu                                          | verified | gains cost with an included Revolutionary Army Leader and makes the opponent discard |
| OP12-086     | Koala                                           | verified | with a Revolutionary Army Leader searches either an eligible trait card or Nico Robin |
| OP12-087     | Nico Robin                                      | verified | with a Koala Leader gains cost and can block |
| OP12-088     | Bastille                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-089     | Hack                                            | verified | with a Revolutionary Army Leader gains cost and can block |
| OP12-090     | Belo Betty                                      | verified | when attacking trashes two top cards before giving an opponent +2 cost |
| OP12-091     | Poker                                           | verified | orders three trash cards as cost and boosts up to two included SMILE Characters once |
| OP12-092     | Mizerka                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-093     | Morley                                          | verified | validates its ability through OnePieceTestEngine |
| OP12-094     | Monkey.D.Dragon                                 | verified | orders three Revolutionary Army cards as cos |
| OP12-095     | Lindbergh                                       | verified | gains 4 cost with a Revolutionary Army Leade |
| OP12-099     | Kalgara                                         | verified | draws when own Life is remove |
| OP12-100     | Sabo                                            | verified | takes top Life as its optional cos |
| OP12-101     | Jewelry Bonney                                  | verified | Rest-self Leader boost through opponent next turn; restored Supernovas-gated Life Trigger play |
| OP12-102     | Shirahoshi                                      | verified | boosts included Neptunians only on the opponent's turn with no other base-cost-2 Shirahoshi |
| OP12-103     | Seto                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-104     | Sentomaru                                       | verified | its Life Trigger K.O.s an opposing cost-4-or-less Character |
| OP12-105     | Trafalgar Lammy                                 | verified | on play gives an own Trafalgar Law 2000 power for the turn |
| OP12-106     | Trafalgar Law                                   | verified | can block and protect its Leader from an opposing attack |
| OP12-107     | Donquixote Doflamingo                           | verified | at two Life gains Rush and can attack the turn it is played |
| OP12-108     | Donquixote Rosinante                            | verified | finds only Trafalgar Law among the top five and orders the remainder on the bottom |
| OP12-109     | Pacifista                                       | verified | its Life Trigger K.O.s only an opponent cost-1 Character and adds itself to hand |
| OP12-110     | Buffalo                                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-111     | Baby 5                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-112     | Baby 5                                          | verified | its Life Trigger draws two only for a multicolored Leader |
| OP12-113     | Roronoa Zoro                                    | verified | on K.O. plays an eligible Supernovas Character from hand rested |
| OP12-114     | Wyper                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP12-118     | Jewelry Bonney                                  | verified | at eight rested cards draws tw |
| OP12-119     | Bartholomew Kuma                                | verified | may trash a chosen hand card to add top deck to Life and gain 2 cost through the opponent's next End Phase |
| OP13-005     | Inazuma                                         | verified | on play gives up to one rested DON!! to its Leader |
| OP13-006     | Woop Slap                                       | verified | gives a chosen count of rested DON!! only to an own Monkey.D.Luffy |
| OP13-007     | Ace & Sabo & Luffy                              | verified | gives active DON!! to an own car |
| OP13-008     | Emporio.Ivankov                                 | verified | trashes itself instead of an opponent effect K.O.'ing a Revolutionary Army ally |
| OP13-009     | Curly.Dadan                                     | verified | validates its ability through OnePieceTestEngine |
| OP13-010     | Lord of the Coast                               | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-011     | Nefeltari Cobra                                 | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-012     | Nefeltari Vivi                                  | verified | finds either included trait at cost 2 or more and bottom-orders the remainder |
| OP13-013     | Higuma                                          | verified | K.O.'s only an opposing Character currently at 0 power or less |
| OP13-014     | Portgas.D.Rouge                                 | verified | Life Trigger gives a chosen Portgas.D.Ace +3000 for the turn |
| OP13-015     | Makino                                          | verified | rests itself to give a chosen Monkey.D.Luffy +2000 for the turn |
| OP13-016     | Monkey.D.Garp                                   | verified | Three printed Leader-name gates, cost-3 search boundary, physical selection/order, and negative Leader gate |
| OP13-017 | Monkey.D.Dragon | verified | Opponent-effect removal replacement gives -2000, permits negative power, expires at turn end, and uses once per turn |
| OP13-018     | Wapol                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-023 | Uta | verified | Up-to-2 DON!! activation, base-cost-5 play restriction, On K.O. hand filtering, selected identity, and rested entry |
| OP13-024 | Gordon | verified | Optional owner, Music/FILM reveal filtering and identity, delayed end-turn up-to-2 DON!! activation, and decline branch |
| OP13-025 | Koby | verified | Blocker decision/retargeting, FILM and Strike Leader alternatives, DON!! result, and nonmatching Leader boundary |
| OP13-026 | Sunny-Kun | verified | Rest-1-DON!! cost, once-per-turn rejection, +2000 duration through the opponent's next turn, and no-DON!! boundary |
| OP13-027 | Sanji | verified | On Play 0-2 DON!! choice, both FILM/Straw Hat Crew end-turn gates, end-turn DON!! result, and negative Leader boundary |
| OP13-028 | Shanks | verified | All-DON!! activation; command hand-play prohibition permits effect play under special FAQ; saved restriction and expiry |
| OP13-029     | Jinbe                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-030 | Tony Tony.Chopper | verified | Controller-owned 0-2 rested-DON!! choice and visible activation result |
| OP13-031 | Trafalgar Law | verified | Optional return cost, cost-filtered selected rested play and nested On Play, decline path, and dynamic Life-gated Blocker |
| OP13-032 | Nico Robin | verified | Opposing cost filter, optional target identity, rest prevention through the opponent's next End Phase, expiration, and no-target branch |
| OP13-033 | Franky | verified | Battle K.O. provenance, opponent-only mixed Leader/Character/Stage/DON!! candidates, up-to-2 selected identities/results, and zero-target branch |
| OP13-034 | Brook | verified | FILM and independent Straw Hat Crew Leader gates, 0-1 DON!! choice/result, and negative Leader boundary |
| OP13-035 | Bepo | verified | End-turn owner choice between this Character and 0-1 DON!!, with branch-specific visible results |
| OP13-036     | Helmeppo                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-037 | Roronoa Zoro | verified | Both Leader-trait alternatives, 0-2 On Play DON!! activation, negative gate, and end-turn self activation |
| OP13-041 | Izo | verified | On Play draws exactly two cards for its controller with visible hand/deck counts |
| OP13-042 | Edward.Newgate | verified | Blocker; On Play draw two and selected hand trash; separate Leader and Character rested-DON!! count and recipient choices |
| OP13-043 | Otama | verified | Three-Life On Play draw-two and selected hand trash, plus four-Life negative boundary |
| OP13-044 | Curiel | verified | When Attacking optional rested DON!! to an included-type own Leader or Character; battle On K.O. exact draw |
| OP13-045 | Haruta | verified | When Attacking draws at exactly four cards in hand and not at five |
| OP13-046 | Vista | verified | Double Attack; filtered battle/effect removal replacement payment; shared once-per-turn identity across both origins |
| OP13-047 | Fossa | verified | Optional self-trash replaces only an opponent-effect K.O. of an included Whitebeard Pirates Character; trait and battle-origin negatives |
| OP13-048     | Blamenco                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-049     | Blenheim                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-050 | Boa Sandersonia | verified | Boa Hancock Leader gate; optional hand play filtered by name and cost; decline and wrong-Leader boundaries |
| OP13-051 | Boa Hancock | verified | Battle On K.O. draw-two under either a Boa Hancock Leader or a multicolored Leader; monocolored negative |
| OP13-052 | Boa Marigold | verified | Blocker; Boa Hancock Leader gate and selected cost-6-or-less Boa Hancock hand play |
| OP13-053 | Marshall.D.Teach | verified | Optional included-trait Character trash cost, draw, turn-scoped Banish damage, decline, and candidate filtering |
| OP13-054 | Yamato | verified | Official three-Life gate over both draw two and subsequent optional rested-DON!! transfer; four-Life negative boundary |
| OP13-055 | Rakuyo | verified | Four-card hand boundary; all own exact/composite Whitebeard Pirates +1000 this turn; ownership, exclusion, and cleanup |
| OP13-056 | LittleOars Jr. | verified | Included Whitebeard Pirates Leader When Attacking draw with nonmatching-Leader boundary |
| OP13-060 | Amatsuki Toki | verified | Optional self-trash replaces only opponent-effect K.O. of an included Roger Pirates Character; trait and battle negatives |
| OP13-061 | Inuarashi | verified | Given-DON!! gate; optional rested DON!!-deck addition followed by opposing cost-1 K.O.; zero and gate boundaries |
| OP13-062 | Crocus | verified | Given-DON!! On Play active addition and gate; When Attacking opposing base-power filtering and return-to-owner hand |
| OP13-063 | Kouzuki Oden | verified | Given-DON!! On Play rested addition and gate; Blocker target redirection and battle result |
| OP13-064 | Gol.D.Roger | verified | Optional DON!! -3; both power modifiers through opponent End Phase; permanent Leader/non-Roger effect negation with included-trait exclusion |
| OP13-065 | Shanks | verified | Private top-5 included Roger Pirates search excluding Shanks; optional zero selection and ordered deck-bottom remainder |
| OP13-066 | Silvers Rayleigh | verified | Rush; given-DON!! gate; cost-5 opposing rest; delayed optional active DON!! addition at turn end |
| OP13-067 | Scopper Gaban | verified | Included Roger Pirates Leader gate; draw two, selected hand trash, then optional rested DON!! addition; nonmatching boundary |
| OP13-068 | Douglas Bullet | verified | Included Roger Pirates On Play rested DON!! choice; independent dynamic eight-field-DON!! +2000 threshold and zero choice |
| OP13-069 | Tom | verified | Optional DON!! -1 with explicit payment selection; own trash Stage cost/category filtering, recovery, and decline |
| OP13-070     | Napoleon                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-071 | Nekomamushi | verified | Eight-field-DON!! boundary; optional opposing base-power-3000 K.O. target, exclusion, and zero choice |
| OP13-072 | Buggy | verified | Compound included Roger Pirates Leader plus given-DON!! gate; optional rested DON!! addition and each missing-condition boundary |
| OP13-073     | Prometheus                                      | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-074 | Hera | verified | Optional included Homies power-3000-or-less hand play; power, trait, selected identity, and decline boundaries |
| OP13-080 | St. Ethanbaron V. Nusjuro | verified | Seven-trash Rush and opponent-effect removal protection; ten-trash optional opposing -2000 attack modifier, duration, and threshold |
| OP13-081 | Koala | verified | Included Revolutionary Army Leader cost gain; once-per-turn selected trash-to-deck cost, optional rested DON!! transfer to an own card, and decline |
| OP13-082 | Five Elders | verified | activateMain |
| OP13-083 | St. Jaygarcia Saturn | verified | Optional included Five Elders top-five search, ordered deck-bottom remainder, and seven-trash opponent-effect removal protection |
| OP13-084 | St. Shepherd Ju Peter | verified | Seven-trash opponent-effect removal protection; own-turn ten-trash base-power-7000 aura, including lowering higher base power and retaining DON bonus |
| OP13-085     | Saint Jalmac                                    | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-086 | Saint Shalria | verified | Optional included Celestial Dragons search excluding Shalria; selected identity, looked-card trash, and mandatory hand trash |
| OP13-087 | Saint Charlos | verified | Physical top-deck trash on play plus defender-owned optional Blocker selection, retargeting, battle result, and decline |
| OP13-088     | Terry Gilteo                                    | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-089 | St. Topman Warcury | verified | Seven-trash opponent-effect removal protection and Blocker; battle-origin removal remains legal and On K.O. draws one |
| OP13-090     | Hack                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-091 | St. Marcus Mars | verified | Optional selected hand-trash cost and opposing base-cost-5 K.O.; seven-trash opponent-effect removal protection and Blocker |
| OP13-092 | Saint Mjosgard | verified | Three-Life optional cost-1 included Mary Geoise Stage play from own trash; trait, cost, identity, and four-Life boundaries |
| OP13-093 | Morgans | verified | On Play draw two then controller-selected two-card hand trash; public Blocker selection, retargeting, and battle result |
| OP13-094 | York | verified | Optional own included Celestial Dragons Character +2000 power; ownership, trait, selected identity, decline, and turn cleanup |
| OP13-095 | Saint Rosward | verified | Optional selected hand-trash cost; only-included-Celestial-Dragons gate; up-to-two opposing base-cost-3 K.O. targets and decline |
| OP13-101     | Atlas                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-102 | Edison | verified | Self-trash remains payable at higher Life; post-cost comparison gates draw and rest; Life Trigger retained |
| OP13-103     | Gyogyo                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-104 | Kouzuki Hiyori | verified | Public Blocker; optional On K.O. selected hand cost; multicolored-Leader top-deck Life addition, monocolored gate, and decline |
| OP13-105 | Kouzuki Momonosuke | verified | Controller-private all-Life ordering with every physical identity preserved in the submitted order |
| OP13-106 | Conney | verified | Physical Life Trigger play; existing field Conney gains Blocker only after that Trigger and only for the opponent turn |
| OP13-107     | Shaka                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-108 | Jewelry Bonney | verified | Included Egghead Leader gates both Rush and opposing top-Life removal per official Q&A Q1064; Life Trigger threshold, optional cost-7 rest target, filtering, and negative boundary |
| OP13-109 | Jewelry Bonney | verified | Optional self-only opponent-effect removal replacement via top-Life face-up; official already-face-up boundary, battle origin negative, and draw-two/trash-one Life Trigger |
| OP13-110 | Stussy | verified | Included Egghead Leader hand-play choice filtered to cost-5 Trigger Characters, decline and Leader negative; public Blocker redirection and battle result |
| OP13-111     | Pythagoras                                      | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP13-112 | Vegapunk | verified | Aggregate given-DON!! threshold across Leader and Characters; dynamic Blocker grant and one-DON!! negative boundary |
| OP13-113 | Lilith | verified | Top-4 Trigger Character search with private filtered identity choice and ordered remainder; Life Trigger activates On Play without playing Lilith per official Q&A Q1066 |
| OP13-114 | S-Snake | verified | Optional face-up top-Life cost for On Play and When Attacking, selected opposing power reduction and expiry, decline path, and physical Life Trigger hand-trash/play |
| OP13-118 | Monkey.D.Luffy | verified | Multicolor-only up-to-4 active DON!! recovery, cost-5-or-more play restriction and expiry, monocolor negative per official Q&A Q1067, and Double Attack |
| OP13-119 | Portgas.D.Ace | verified | Life-threshold Rush; 0–1 DON!! grant, optional own cost-3 return, opponent-owned filtered up-to-one play choice, no-return boundary, and opponent decline per official Q&A Q1068–Q1070 |
| OP13-120 | Sabo (SP) | verified | Public Blocker; once-per-turn optional own Character +2 cost through the opponent's next turn, optional rested DON!! grant to Leader, ownership, duration, and choose-zero boundaries |
| OP14-002 | Urouge | verified | At-current-power threshold draws before an optional K.O.; base-power target filtering, decline, and below-5000 full-block negative per official Q&A Q1097 |
| OP14-003 | Capone"Gang"Bege | verified | Opponent Character effect protection at the 5000 base-power boundary and legal removal by a 7000-base-power Character effect per official Q&A Q1098 |
| OP14-004 | Cavendish | verified | Dynamic Rush exactly at 5000 current power and rejected play-turn attack below the threshold |
| OP14-005 | Killer | verified | Once-per-turn 0–1 rested DON!! choice, own Leader/Character recipient filtering, physical attachment, and choose-zero branch |
| OP14-006 | Shachi & Penguin | verified | At-5000 When Attacking selected opposing −2000 power and turn expiry, choose-zero branch, ownership, and below-threshold negative |
| OP14-007     | Jewelry Bonney                                  | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP14-008     | Scratchmen Apoo                                 | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP14-009 | Trafalgar Law - OP14-009 | verified | Errata-corrected Heart Pirates/Supernovas traits (excluded from Warlords search); Rush, optional selected two-card hand cost, own Leader/Character base-power swap for one battle, expiry, ownership per Q1099, decline, and once-per-turn |
| OP14-010 | Basil Hawkins | verified | Battle On K.O. top-5 play search with included Supernovas trait, name/power/category filtering, selected physical identity, and ordered remainder |
| OP14-011 | Bartolomeo | verified | Dynamic Blocker and public redirection at DON!! x2, with one-DON!! negative boundary |
| OP14-012 | Bepo | verified | At-5000 When Attacking 0–2 rested DON!! choice, one own Leader/Character recipient, physical attachment, ownership, and below-threshold negative |
| OP14-013 | Monkey.D.Luffy | verified | Correct rules identity; top-5 included Supernovas search excluding Monkey.D.Luffy with physical identity/order, plus optional When Attacking −1000 and expiry |
| OP14-014 | Eustass"Captain"Kid - OP14-014 | verified | Included Supernovas Leader gate, filtered optional red power-2000 hand play, negative/decline branches, and public Blocker |
| OP14-015 | Roronoa Zoro - OP14-015 | verified | Rush play-turn attack, optional selected opposing −1000 When Attacking modifier, and turn expiry |
| OP14-016 | X.Drake | verified | Opponent-turn optional once-per-turn included-Supernovas removal replacement with Leader −2000; own-turn negative; DON!! x1 attack reduction and no-DON!! boundary |
| OP14-021 | Issho | verified | Self-only own-turn rest provenance, optional physical top-Life addition, rested opposing Character freeze through next Refresh, decline, and other-card-rest negative per official Q1103 |
| OP14-022 | Usopp | verified | End-of-turn up-to-2 DON!! activation with included FILM/Straw Hat Crew Leader gates, both trait branches, zero choice, and negative Leader boundary |
| OP14-023 | Kikunojo - OP14-023 | verified | End-of-turn self activation after attacking, preserving the selected physical Character identity |
| OP14-024 | Kin'emon | verified | On Play up-to-3 DON!! activation, current-turn Character play restriction and expiry; battle On K.O. optional mixed-field opposing rest with owner/candidate proof |
| OP14-025 | Kuro | verified | Kuro Leader gate, optional selected cost-6-or-less included East Blue Character hand play, cost/trait filtering, and negative Leader boundary |
| OP14-026 | Kouzuki Oden | verified | Rested-only +2000 power during the opponent's turn, with active-state and controller-turn negatives |
| OP14-027 | Shanks | verified | Self-only own-turn rest trigger, optional base-power-7000 opposing rest boundary, rested-only opponent-turn all-Character −1000 aura, ownership, and cleanup |
| OP14-028 | Johnny | verified | Self-only own-turn rest trigger, optional rested cost-2-or-less opposing K.O. filtering, ownership, selected identity, visible trash result, and decline |
| OP14-029 | Tashigi | verified | Opponent-turn self-removal replacement with optional selected own-card rest and decline; Activate: Main optional two-card rest cost, +2000 duration through opponent next End Phase, cleanup, and once-per-turn |
| OP14-030     | Chaka & Pell - OP14-030                         | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP14-031 | Nami | verified | Printed Counter +1000 through battle; Blocker; On Play optional two-target cost-8 rest filtering and physical identities; independent delayed end-of-turn up-to-5 DON!! activation |
| OP14-032 | Humandrill | verified | Self-only own-turn rest trigger, optional cost-4-or-less opposing Character filtering, ownership, selected rest result, and other-card-rest negative |
| OP14-033 | Perona - OP14-033 | verified | On Play optional two-target cost-5 cannot-rest selection through opponent next End Phase and expiry; On K.O. optional own-card rest cost, filtered green cost-5 hand play, ownership, and decline |
| OP14-034 | Monkey.D.Luffy - OP14-34 | verified | Own-turn all-green included Straw Hat base-cost-4 +1000 aura with negatives/cleanup; once-per-turn opponent-effect K.O. replacement for another matching Character, own-Character rest, decline, trait/source negatives, and battle exclusion |
| OP14-035 | Yosaku | verified | Self-only own-turn rest trigger, optional rested cost-4 opposing freeze target, ownership/filtering, other-card-rest negative, and next-Refresh persistence |
| OP14-042 | Arlong | verified | Included Fish-Man Leader gate; top-4 optional cost-2-or-more search, candidate filtering, selected physical identity, ordered bottom remainder, and negative Leader boundary |
| OP14-043 | Aladine | verified | On Play optional included Fish-Man/Merfolk cost-3 hand play with both trait branches and cost/trait filtering; battle On K.O. exact draw |
| OP14-044 | Edward.Newgate | verified | Blocker; On Play top-card reveal with included Whitebeard Pirates matching, draw 2, selected exact hand trash, and nonmatching-type negative |
| OP14-045 | Kuroobi | verified | Effect-origin own-hand trash grants Rush for the turn, rule-based Event trash negative, and effect K.O. exact draw |
| OP14-046 | Koala | verified | Activate: Main self-trash cost; optional included Fish-Man/Merfolk Leader-or-Character +2000 through turn end, filtering, decline, and expiry |
| OP14-047 | Shirahoshi | verified | Blocker; On Play exact draw followed by optional included Fish-Man/Merfolk cost-3-or-less hand play with trait, cost, and category filtering |
| OP14-048 | Shiryu | verified | On Play opponent-owned up-to-one Character return followed by mandatory all-hand trash, including the zero-target branch |
| OP14-049 | Jinbe | verified | Effect-origin own-hand trash grants Rush with rule-trash negative; optional two-DON!! rest cost, exact draw 2, either-owner cost-7 return choice, zero-target branch, and decline |
| OP14-050 | Chew | verified | On Play included Fish-Man Leader-gated exact draw with nonmatching Leader negative |
| OP14-051 | Hatchan | verified | DON!!×2 On K.O. exact draw with one-attached-DON!! negative boundary |
| OP14-052 | Hannyabal | verified | Blocker; optional selected three-card hand-trash cost and included Impel Down cost-6 hand play with filtering and decline |
| OP14-053 | Vista | verified | Blocker; opponent-turn hand-at-most-seven live Leader base-power copy; both source orders with base setter, Counter additive exclusion, source removal and turn expiry; threshold negative; Ace K.O. reaction |
| OP14-054 | Fisher Tiger | verified | Included Fish-Man Leader-gated exact draw 3 with negative Leader boundary; End Phase selected hand trash down to exactly 5 and at-five no-op |
| OP14-055     | The Macro Gang                                  | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP14-056 | Wadatsumi | verified | Permanent cannot-attack rejection; effect-origin own-hand trash negates that effect for the turn, enables attack, and expires next turn |
| OP14-061 | Vergo | verified | Once-per-turn included Donquixote Pirates opponent-effect removal replacement via selected DON!! return with decline; optional When Attacking DON!!−1, opposing −2000 target, decline, and expiry |
| OP14-062 | Gladius | verified | Optional On K.O. DON!!−1 cost; K.O. or rest choice, opponent-owned base-power-6000 filtering, visible branch results, and decline |
| OP14-063 | Sugar | verified | On Play optional 0–1 active DON!! addition; On K.O. opponent-six-DON threshold and included Donquixote Pirates cost-5 hand play with filtering and negative boundary |
| OP14-064 | Giolla | verified | On K.O. optional 0–1 rested DON!! addition followed by opponent-owned base-power-0 K.O. filtering, selected identity, and both zero branches |
| OP14-065 | Senor Pink | verified | On K.O. opponent-owned physical DON!! return choice across active, rested, and attached sources, plus no-DON no-op |
| OP14-066     | Diamante                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP14-067 | Dellinger | verified | On K.O. optional rested DON!! addition then private top-5 included Donquixote Pirates search, candidate filtering, selected identity, and ordered bottom remainder |
| OP14-068 | Trebol | verified | Opponent-turn included Donquixote Pirates Leader-gated own-DON-return trigger, optional rested DON!! replacement, once-per-turn, and own-turn negative |
| OP14-069 | Donquixote Doflamingo - OP14-069 | verified | Optional DON!!−3 cost; Leader-gated cost-8 K.O. branch with negative gate; up-to-3 cost-7 cannot-rest branch through opponent next End Phase and expiry; decline |
| OP14-070     | Buffalo                                         | verified | Blocker; opposing Character-effect rest provenance; optional physical DON!! return; dependent self activation; decline and battle-rest negative                                                         |
| OP14-071     | Pica                                            | verified | Included Donquixote Pirates Leader gate at End Phase; optional active DON!! addition; decline and nonmatching-Leader negative                                                                            |
| OP14-072     | Baby 5                                          | verified | On Play optional active DON!! addition; On K.O. optional DON!!−1 followed by exact top-deck card to top Life; decline                                                                                    |
| OP14-073     | Machvise                                        | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP14-074     | Monet                                           | verified | Included Donquixote Pirates Leader-gated active DON!! addition with negative gate; On K.O. draw 2, selected hand trash, and optional rested DON!! addition                                               |
| OP14-075     | Lao.G                                           | verified | On K.O. optional rested DON!! addition followed by opponent-owned up-to-one −2000 power target and turn-end expiry                                                                                       |
| OP14-081     | Spider Mice                                     | verified | On Play exact top-three deck trash; On K.O. opponent base-cost-1 filtering, selected physical K.O., and zero-target branch                                                                               |
| OP14-082     | Oinkchuck                                       | verified | On K.O. included Thriller Bark Pirates +4 cost through opponent next End Phase and expiry; Life Trigger private filtered rested trash play and decline                                                   |
| OP14-083     | Ms. Wednesday                                   | verified | Optional self-trash activation cost; opponent current-cost-0 filtering; −3000 power duration, expiry, and decline                                                                                       |
| OP14-084     | Ms. All Sunday                                  | verified | Included Baroque Works Leader gate; joint distinct cost-4-or-less and exact-cost-1 trash selection before active placement; nonmatching-Leader negative                                                         |
| OP14-085     | Miss.Goldenweek(Marianne)                       | verified | On K.O. mandatory draw 2 followed by controller-owned exact two-card hand-trash choice and selected physical identities                                                                                 |
| OP14-086     | Miss Doublefinger(Zala)                         | verified | Seven-trash threshold; self +1000 power; all own exact/included Baroque Works +2 cost; ownership and six-trash negatives                                                                                |
| OP14-087     | Miss.Valentine(Mikita) (Dash Pack)              | verified | Included Leader gate; private top-4 included Baroque Works search; self-name exclusion; selected reveal, no-selection, trash remainder, and negative gate                                               |
| OP14-088     | Miss.MerryChristmas(Drophy)                     | verified | Included Baroque Works Leader-gated On K.O. draw then optional opposing cost-1 Stage K.O.; nonmatching-Leader negative                                                                                  |
| OP14-089     | Ryuma                                           | verified | On K.O. draw 2 then selected exact hand trash 2; Life Trigger included cost-4 trash filtering, rested play, and invalid candidates                                                                      |
| OP14-090     | Mr.1(Daz.Bonez)                                 | verified | On Play opposing current-cost-0 rest; same-turn Character attack from cost-0 or cost-8-plus field conditions; no-condition rejection                                                                    |
| OP14-091     | Mr.2.Bon.Kurei(Bentham)                        | verified | On K.O. controller-owned hand-or-trash play; included Baroque Works, cost, category, and self-name filtering; selected physical identity and decline                                                    |
| OP14-092     | Mr.3(Galdino)                                   | verified | Self-only opponent-turn K.O. replacement; exact three-card ordered trash-to-bottom payment; effect and battle origins; decline, once-per-turn, and own-turn negative                                    |
| OP14-093     | Mr.4(Babe)                                      | verified | Blocker retarget and Life protection; On K.O. optional included Baroque Works cost-8 trash recovery with ownership and wrong-trait filtering                                                            |
| OP14-094     | Mr.5(Gem)                                       | verified | Official Special attribute with Zephyr selection proof; Blocker; independent cost-0 and cost-8-plus field gates; ordered draw 2 then selected hand trash 1; no-condition negative                                                                                |
| OP14-095     | Mr.9                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP14-100     | Absalom                                         | verified | On K.O. private top-3 included Thriller Bark search and chosen bottom order; Life Trigger filtered cost-4 trash play rested                                                                              |
| OP14-101     | Oars                                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| OP14-102     | Kumacy                                          | verified | Life Trigger included Thriller Bark cost/category filtering, optional selection, physical identity, and rested trash play                                                                              |
| OP14-103     | Gloriosa (Grandma Nyon)                         | verified | Optional top-or-bottom Life-to-hand cost, selected hand card to top Life, decline, and physical self-play Life Trigger                                                                                   |
| OP14-104     | Gecko Moria                                     | verified | On Play choice between filtered trash play and face-up top-Life placement; broader cost-4 trash-play Life Trigger                                                                                       |
| OP14-105     | Gorgon Sisters                                  | verified | Exact alternative-trait reveal cost, rested DON!! distribution to Leader and all own Characters, once-per-turn rejection, and Leader-gated self-play Trigger                                           |
| OP14-106     | Salome                                          | verified | Physical self-play Life Trigger plus public Blocker redirection and Leader Life protection                                                                                                              |
| OP14-107     | Shakuyaku                                       | verified | Opponent-Life threshold, draw-before-exact-trash ordering, negative boundary, and included Kuja Leader-gated physical self-play Trigger                                                                |
| OP14-108     | Silvers Rayleigh                                | verified | Multicolored-Leader and Life conjunction, base-power filtering, On Play K.O., and Life Trigger activation with physical Trigger disposal                                                               |
| OP14-109     | Victoria Cindry                                 | verified | Included Thriller Bark cost/category filtering and rested trash play through Life Trigger; public Blocker redirection                                                                                   |
| OP14-110     | Dr. Hogback                                     | verified | On K.O. non-self Trigger-Character filtering and play; separate included Thriller Bark cost-4 rested trash-play Life Trigger                                                                            |
| OP14-111     | Perona                                          | verified | On Play and On K.O. cost-6 attack restriction through opponent next End Phase; included Thriller Bark rested trash-play Life Trigger                                                                    |
| OP14-112     | Boa Hancock                                     | verified | Included Warlords Leader gate; optional own deck-to-Life and opposing Life-to-hand exchange; Trigger power, keyword, and category filters with physical disposal                                        |
| OP14-113     | Marguerite                                      | verified | Included alternative-trait top-5 search, reveal, ordered bottom remainder, mandatory post-search trash, and included Kuja Leader-gated physical self-play Trigger                                      |
| OP14-114     | Ran                                             | verified | Included Kuja Leader/Character rested-DON!! targeting, zero-or-one count, once-per-turn rejection, and included-Leader physical self-play Trigger                                                       |
| OP14-115     | Rindo                                           | verified | Opponent-turn On K.O. optional deck-to-Life before self-damage, zero branch, and included Kuja Leader-gated physical self-play Trigger                                                                  |
| OP14-119     | Dracule Mihawk (Manga)                          | verified | Your-turn self-rest provenance, opposing cost-9 rest restriction and expiry; optional hand cost, own battle target, +2000 duration, decline, and once-per-turn attack reaction                         |
| OP14-120     | Crocodile - OP14-120                            | verified | Opposing cost-9 attack restriction and expiry; opponent-owned cost-0/8+ draw gate; optional physical hand cost, self-only On K.O. replay, and decline                                                   |
| OP15-003 | Alvida | verified | Printed behavior is unstructured |
| OP15-004 | Sea Cat | verified |Leader-power-0 gate via temporary printed-power override; up-to-1 opposing -3000 this turn; over-0-power negative|
| OP15-005 | Cabaji | verified | Printed behavior is unstructured |
| OP15-006 | Cavendish | verified |Trash-4-Events boundary +2000; three-Event negative keeps base power|
| OP15-007 | Gin | verified |East-Blue-Leader gate; cost<=5 hand play excluding cost-6; no-trait negative leaves hand|
| OP15-008 | Krieg | verified |Opp rested DON redistribution to opponent Character with live cap; Rush same-turn attack; once-per-activation -1000x attached DON; post-turn negative|
| OP15-009 | Koby | verified | Printed one-DON play; simultaneous base-power-limited replacement and Leader power payment |
| OP15-010 | Nezumi | verified | Printed behavior is unstructured |
| OP15-011 | Pearl | verified |Opponent-turn East-Blue blocker with +2000; on-K.O. up-to-1 6000-base-power K.O.; battleBlocker candidate proof|
| OP15-012 | Buggy | verified |When-attacking optional opponent rested DON to owner Leader/Character; on-K.O. draw through effect K.O.|
| OP15-013 | Pincers | verified |Hand cost -2 under 0-power Leader play+block; full-cost negative above 0 power|
| OP15-014 | Bartolomeo | verified |On-play Dressrosa base-cost<=3 Event activation with boost target; self-K.O. replacement by Event trash|
| OP15-015 | Higuma | verified | Printed behavior is unstructured |
| OP15-016 | Fullbody | vanilla | Parameterized vanilla invariant batch |
| OP15-017 | Morgan | verified | Printed behavior is unstructured |
| OP15-018 | Mohji | verified | Printed behavior is unstructured |
| OP15-023 | Arlong | verified | Printed Slash attribute; Arlong erratum permits active or rested DON assignment while activation cost requires rested DON |
| OP15-024 | Usopp | verified |On-K.O. up-to-1 cost<=7 rest; opponent-turn blocker via battleBlocker; cannotBeRested candidate exclusion under opponent rest effect|
| OP15-025 | Kuro | verified | Either-owner rested Character remains selectable; delayed freeze only applies in the opponent Refresh Phase |
| OP15-026 | Jango | verified |Top-3 look with East Blue reveal to hand and ordered bottom remainder; optional self-trash cost moving one rested DON|
| OP15-027 | Dracule Mihawk | verified | Printed behavior is unstructured |
| OP15-028 | Meowban Brothers | verified | Printed behavior is unstructured |
| OP15-029 | Bartholomew Kuma | verified |On-play up-to-1 cost<=5 cannotBeRested shield excluded from opponent rest candidates; unshielded Character rested|
| OP15-030 | Hyouzou | vanilla | Parameterized vanilla invariant batch |
| OP15-031 | Purinpurin | verified | Select any opposing rested Character; only then compare its cost with attached DON for K.O. |
| OP15-032 | Brook | verified |On-play mixed rest of opposing card; Straw-Hat self-trash cost with base-cost<=8 set-active target|
| OP15-033 | Hody Jones | verified |Fish-Man Leader activation from rested state plus top-Life-to-hand payment|
| OP15-034 | Yorki | verified |Your-turn on-play +2000 limited to name-filtered Brook cards|
| OP15-035 | Laboon | verified |Opponent effect removal replacement by resting 2 own cards; decline lets K.O. through|
| OP15-036 | Ryuma | verified |On-play and when-attacking K.O. of rested cost<=4 Characters with active-Character exclusion|
| OP15-040 | Viola | verified |Top-3 look with Dressrosa reveal and ordered bottom remainder|
| OP15-041 | Orlumbus | verified |On-K.O. draw; optional return-character-to-deck cost grants Rush with once-per-turn lock|
| OP15-042 | Kyros | verified |Rebecca-Leader trash-cost Rush with decline negative; on-K.O. self-return from trash|
| OP15-043 | Kelly Funk | verified |On-play name-filtered Bobby Funk hand play|
| OP15-044 | Koala | verified |Blocker keyword; on-K.O. Dressrosa-Event top-3 reveal with ordered remainder|
| OP15-045 | Sai | verified |Blocker keyword; optional Event-trash draw 2 with decline boundary|
| OP15-046 | Sabo | verified |Blocker keyword; Dressrosa-Leader gated Event activation incl. boost resolution|
| OP15-047 | Sanji | verified |Blocker keyword; on-play Unblockable grant proven through unblocked attack|
| OP15-048 | Chinjao | verified |Optional Event-trash draw 2; opponent-turn on-K.O. opaque hand pick to deck bottom|
| OP15-049 | Hajrudin | vanilla | Parameterized vanilla invariant batch |
| OP15-050 | Bobby Funk | verified |Kelly-Funk-adjacency +3000 with and without the named partner|
| OP15-051 | Monkey.D.Luffy | verified |Dressrosa-Leader opponent-turn +3000; base power on own turn|
| OP15-052 | Leo | verified |7000-base-power removal replacement placing the card at deck bottom; deck growth and trash absence|
| OP15-053 | Rebecca | verified |DON-x1 gated Blocker through battleBlocker; top-3 Dressrosa reveal with ordered remainder|
| OP15-059 | Amazon | verified | Opponent may return active DON only when available; otherwise the power reduction is compulsory |
| OP15-060 | Enel | verified |6-or-less-DON removal protection excluded from K.O. pool plus +2000; 7-DON boundary removable; DON-1 cost blocker activation with hand trash|
| OP15-061 | Ohm | verified |DON-1 return cost draw; when-attacking -1000 to one opposing Character under 6-DON gate (sign corrected from unsigned upstream text)|
| OP15-062 | Captain Seamars | vanilla | Parameterized vanilla invariant batch |
| OP15-063 | Gedatsu | verified |DON-1 return cost draw; on-K.O. 2000-power-or-less K.O. under 6-DON gate|
| OP15-064 | Kotori | verified | Optional DON return is payable before Hotori presence check; no companion means no draw |
| OP15-065 | Goro | verified |Reveal-top-deck cost<=2 conditional resting one DON with over-cost negative|
| OP15-066 | Satori | verified |DON-1 return cost draw; when-attacking 6-DON-gated top-2 deck reorder with topOrBottom position choice after ordering|
| OP15-067 | Shura | verified |6-DON-gated Rush proven through same-turn attack; 7-DON attack rejection|
| OP15-068 | Heavenly Warriors | verified |6-DON-gated Blocker via battleBlocker; 7-DON battle resolves for damage with no blocker prompt|
| OP15-069 | Nola | verified |Removal replacement by returning one field DON to the DON deck with decline boundary|
| OP15-070 | Fuza | verified |Name-based Shura Unblockable grant proven through unblocked 6000-power attack vs a Blocker; opponent-turn base-power 6000 swap|
| OP15-071 | Holly | verified |Name-based Ohm Double Attack grant proven through two-Life leader damage; opponent-turn base-power 6000 swap|
| OP15-072 | Hotori | verified | Optional DON return is payable before Kotori presence check; no companion means no draw |
| OP15-073 | Yama | verified |Blocker keyword; on-play cost-1 Heavenly Warriors hand play|
| OP15-079 | Absalom | verified |On-K.O. Thriller Bark Pirates trash-to-hand return incl. self candidate|
| OP15-080 | Oars | verified |Gecko-Moria-10000 and no-other-Oars gated +7000; on-K.O. three-trash-cards cost replays itself from trash (printed base power 0 flagged as upstream-unverified)|
| OP15-081 | Sanji | verified |Straw-Hat-Leader gated 5-card deck trash|
| OP15-082 | Charlotte Lola | verified |On-play 3-card deck trash; on-K.O. cost<=8 Character trash return incl. self candidate|
| OP15-083 | Spoil | verified |On-play 3-card deck trash; 15-trash gated self-trash for rested DON give|
| OP15-084 | Dr. Hogback | verified |Thriller-Bark-Leader gated 5-card deck trash; hand<=6 on-K.O. draw|
| OP15-085 | Tony Tony.Chopper | verified |On-play 3-card deck trash; Straw-Hat-gated self-trash returning named-excluded Character from trash|
| OP15-086 | Nami | verified | Printed behavior is unstructured |
| OP15-087 | Nico Robin | verified |10-trash Blocker via battleBlocker; on-play draw-2 with hand trash|
| OP15-088 | Pirates Docking Six | verified |Hand-zone +6 cost play gate; on-play deck-3 trash cost replaying Straw Hat <=2 from trash|
| OP15-089 | Franky | vanilla | Parameterized vanilla invariant batch |
| OP15-090 | Perona | verified | Opponent non-K.O. removal replacement; base3000/current8000 eligible and base8000/current6000 ineligible; exact hand payment preserves target |
| OP15-091 | Margarita | verified |On-play opposing trash card to owner deck bottom|
| OP15-092 | Monkey.D.Luffy | verified | Printed Special attribute and Zephyr selection boundary; existing printed action proofs |
| OP15-093 | The Risky Brothers | verified | Post-payment 15-trash gate, self-trash, freshly played Luffy Rush: Character with Leader exclusion, Slash grant and turn expiry; decline |
| OP15-094 | Roronoa Zoro | verified |Straw-Hat removal replacement trashing itself; non-Straw-Hat negative K.O.s normally|
| OP15-099 | Urouge | verified |Supernovas trash cost Rush same-turn attack; turn-Life-face-up cost with rested DON give (wording corrected from upstream face-down)|
| OP15-100 | Kamakiri | verified |Self-trash plus top-Life cost into K.O. cost<=6 target|
| OP15-101 | Kalgara | verified | Printed behavior is unstructured |
| OP15-102 | Gan.Fall | verified |Sky-Island-7000 hand cost -3 gate; on-play rest opposing Character at cost<=opponent Life|
| OP15-103 | Genbo | verified |Life Trigger draw and self-replay at Life<=2 through leader damage|
| OP15-104 | Conis | verified |Life-below-opponent gate draw-2 trash-2; equal-Life negative|
| OP15-105 | Jewelry Bonney | verified |7000-base-power removal replacement paying top Life to hand with decline boundary|
| OP15-106 | Octoballoon | verified |Life Trigger draw and yellow cost<=2 hand replay through leader damage with counter decline|
| OP15-107 | Tony Tony.Chopper | vanilla | Parameterized vanilla invariant batch |
| OP15-108 | Nami | verified | onPlay |
| OP15-109 | Nico Robin | verified | Life payment precedes Straw Hat Crew gate; failed gate allows neither Life gain nor Sky Island play |
| OP15-110 | Braham | verified | onKo |
| OP15-111 | Mont Blanc Noland | verified | whenAttacking |
| OP15-112 | Raki | verified | onPlay |
| OP15-113 | Roronoa Zoro | verified | onPlay |
| OP15-114 | Wyper | verified | Top-Life face-up payment or decline; all opposing minus2000 then zero-power K.O.; expiry; rested DON to Sky Island Leader or Character, exclusions and payable once-per-turn control |
| OP15-118 | Enel | verified | On Play and permanent behavior; unrestricted hand-search choice remains secret in opponent log and hand |
| OP15-119 | Monkey.D.Luffy | verified | permanent |
| OP16-002 | Izo | verified | On Play reveal 8000 Character from hand pays for the draw 1; decline and empty-pool boundaries |
| OP16-003 | Edward.Newgate | verified | Your-turn Leader +2000 power; On Play reveal 2x8000 Characters pays for up-to-1 -6000 this turn with decline boundary |
| OP16-004 | Curiel | vanilla | Parameterized vanilla invariant batch |
| OP16-005 | Thatch | verified | Conditional in-hand -3 cost gated by an 8000+ power Whitebeard Pirates Character; full-cost boundary without the condition |
| OP16-006 | Shanks | verified | On Play rest-2-DON!! cost K.O.s up to 1 Character of 4000 power or less; decline keeps DON and board |
| OP16-007 | Jozu | verified | On Play reveal 8000 Character pays for up-to-1 -1000 this turn; decline boundary |
| OP16-008 | Squard | verified | On Play trash-own-10000-base-power cost K.O.s up to 1 Character of 8000 power or less; unpayable-cost boundary |
| OP16-009 | Speed Jil | verified | On Play trash 8000 Character from hand grants [Rush] and +2000; decline leaves no same-turn attack |
| OP16-010 | Namule | verified | On Play reveal 8000 Character pays for K.O. of 2000-base-power-or-less; filter and decline boundaries |
| OP16-011 | Vista | verified | On Play reveal 8000 Character draws; DON!! x1 When Attacking K.O.s up to 2 of 2000 base power or less; no-DON boundary |
| OP16-012 | Benn.Beckman | verified | On Play rest-1 cost with Red-Haired Pirates Leader and 10 DON!! gates effect-playing a [Shanks] from hand |
| OP16-013 | McGuy | verified | On K.O. up-to-1 K.O. of 8000 base power or less; empty selection declines |
| OP16-014 | Marco | verified | Removal replacement K.O.s itself instead of an opposing-effect removal; allow and decline boundaries |
| OP16-015 | Monkey.D.Luffy | verified | Printed behavior is unstructured |
| OP16-016 | Ramba | vanilla | Printed +1000 Counter prevents battle damage; otherwise vanilla |
| OP16-017 | LittleOars Jr. | verified | Conditional -4000 power without a cost-8+ Whitebeard Pirates Character; satisfied and unsatisfied boundaries |
| OP16-018 | Rockstar | verified | Printed behavior is unstructured |
| OP16-023 | Arlong | vanilla | Parameterized vanilla invariant batch |
| OP16-024 | Inazuma | verified | On K.O. by opposing effect rests up to 1 opposing Character with decline boundary |
| OP16-025 | Bunkov | verified | When Attacking with [Antlerkov] plays a cost-2-or-less Character; missing-partner boundary |
| OP16-026 | Emporio.Ivankov | verified | On Play look-3 reveal up to 1 Impel Down to hand, bottom-order remainder, then optional cost-2 play |
| OP16-027 | Jinbe | verified | DON!! x1 +2000 power with and without an attached DON!! |
| OP16-028 | Smoker | vanilla | Parameterized vanilla invariant batch |
| OP16-029 | Antlerkov | verified | When Attacking with [Bunkov] plays a cost-2-or-less Character; missing-partner boundary |
| OP16-030 | Trafalgar Law | verified | On Play freezes a rested opposing Character through refresh; End of Your Turn activates green cost-5-or-less |
| OP16-031 | Buggy | verified | On K.O. plays a [Prisoner of Impel Down] from hand; empty-hand boundary |
| OP16-032 | Boa Hancock | verified | On Play target cannot be rested (attack denied) while others may; excludeName and empty-selection boundaries |
| OP16-033 | Morley | verified | Battle K.O. replacement rests 2 own cards instead; decline allows the K.O. |
| OP16-034 | Monkey.D.Luffy | verified | DON!! x1 your-turn +1000 per differently-named Character incl. turn boundary; On Play search reveal/order chain |
| OP16-035 | Roronoa Zoro | verified | Single ordered On Play: optional mixed rest, then optional hand discard before rested DON assignment; zero rest still permits later action |
| OP16-036 | Mr.2.Bon.Kurei | verified | On Play rests cost-4-or-less target (cost filter); When Attacking sets base power to opposing Leader's |
| OP16-037 | Mr.3 | verified | On Play gated by Impel Down Leader rests a cost-5-or-less Character; missing-trait boundary |
| OP16-042 | Prisoner of Impel Down | verified | Printed behavior is unstructured |
| OP16-043 | Usopp | verified | On K.O. returns an opposing cost-5-or-less Character to hand; cost filter boundary |
| OP16-044 | Emporio.Ivankov | verified | Blocker intercepts the attack and is K.O.'d while the Leader takes no damage |
| OP16-045 | Crocodile | verified | On Play return-cost-2-or-more cost plays an Impel Down cost-2-or-less Character; decline boundary |
| OP16-046 | Jinbe | vanilla | Parameterized vanilla invariant batch |
| OP16-047 | Donquixote Doflamingo | verified | Printed behavior is unstructured |
| OP16-048 | Buggy | verified | On Play Impel Down Leader gate draws and plays a Prisoner; once-per-turn on-attack blocker grant intercepts |
| OP16-049 | Portgas.D.Ace | verified | Activate Main rest-this cost draws 1; decline keeps active |
| OP16-050 | Miss Olive | verified | On Play return cost draws 2 then trashes 1; decline skips exchange |
| OP16-051 | Mohji & Cabaji | verified | On Play hand-5-or-less gate draws 2; six-card boundary draws nothing |
| OP16-052 | Monkey.D.Luffy | verified | Activate Main once per turn gives a rested DON!! to Leader or Character; second activation rejected |
| OP16-053 | Roronoa Zoro | verified | When Attacking hand-6-or-less gate draws 1; seven-card boundary |
| OP16-054 | Mr.1(Daz.Bonez) | verified | DON!! x1 your-turn hand-5-or-more +3000 power with hand-size boundary; On Play draws 1 |
| OP16-055 | Mr.2.Bon.Kurei | verified | On Play draws 1; DON!! x1 When Attacking sets base power to opposing Leader's with no-DON boundary |
| OP16-056 | Mr.3 | verified | Activate Main self-trash draws 2 and stops a Character attacking through the next end phase; decline boundary |
| OP16-061 | Older Brother Marine | vanilla | Parameterized vanilla invariant batch |
| OP16-062 | Younger Brother Marine | vanilla | Parameterized vanilla invariant batch |
| OP16-063 | Kuzan | verified | On Play adds two rested DON; optional DON return for once-per-turn Blocker prohibition; payable decline leaves DON and Blocker unchanged |
| OP16-064 | Koby | verified | On Play look-5 takes a non-Koby Navy card and bottom-orders the remainder |
| OP16-065 | Sakazuki | verified | Official Sakazuki name affects distinct-name counts; On Play power reduction and Navy Leader DON activation |
| OP16-066 | Sengoku | verified | On Play Navy Leader gate adds 2 rested DON!!, draws 2, trashes 2; non-Navy boundary |
| OP16-067 | Tsuru | verified | On Play look-5 Navy reveal, bottom-order, then trash 1 from hand |
| OP16-068 | Trafalgar Law | verified | On Play adds 1 active DON!!; When Attacking Donquixote Leader gate gives +3000 with boundary |
| OP16-069 | Donquixote Doflamingo | verified | On Play and When Attacking each add up to 1 active DON!! from the DON!! deck |
| OP16-070 | Donquixote Rosinante | verified | On Play rest-2 cost with Navy Leader adds a rested DON!!; decline boundary |
| OP16-071 | Benevolent King of the Waves | verified | On Play trash cost adds a rested DON!!; On K.O. adds another |
| OP16-072 | Hannyabal | verified | On Play look-5 takes an Impel Down card and bottom-orders the remainder |
| OP16-073 | Borsalino | verified | On Play adds 1 active and 1 rested DON!!; End of Your Turn DON!! -2 re-stands with [Blocker] |
| OP16-074 | Magellan | verified | On Play Impel Down gate returns an opposing DON!!; On K.O. returns 4 |
| OP16-075 | Monkey.D.Garp | verified | On Play Navy Leader gate adds 1 active and 1 rested DON!!; non-Navy boundary |
| OP16-081 | Otama | verified | Erratum checks either field for cost-eight Character after self-rest payment; opponent-only positive and absent-target negative |
| OP16-082 | Kin'emon | verified | +3 cost raises play cost to 7; On Play Land of Wano Leader gate look-5 takes a LoW card and trashes the rest |
| OP16-083 | Kouzuki Oden | verified | On Play trash cost-8-or-more Character cost draws 2; empty-pool boundary |
| OP16-084 | Kouzuki Momonosuke | verified | Cost-20 gate rejects self-trash until raised; raised chain plays cost-9 Kouzuki Momonosuke from trash |
| OP16-085 | Kouzuki Momonosuke | verified | On Play plays a Land of Wano cost-6-or-less Character from trash with decline boundary |
| OP16-086 | Sanji | vanilla | Parameterized vanilla invariant batch |
| OP16-087 | Shinobu | verified | On Play self-trash with LoW Leader draws and gives [Kouzuki Momonosuke] +20 cost; non-LoW boundary |
| OP16-088 | Shimotsuki Ushimaru | verified | Blocker intercepts the attack and is K.O.'d while the Leader takes no damage |
| OP16-089 | Dracule Mihawk | verified | Exact On Play draw2 and trash2, opposing minus4 cost, and fresh Rush: Character attack |
| OP16-090 | Tony Tony.Chopper | verified | On Play draws 2, trashes 2, then K.O.s a cost-1-or-less Character; cost filter boundary |
| OP16-091 | Nami | verified | On Play LoW Leader gate look-4 takes a non-Nami LoW card and trashes the rest |
| OP16-092 | Nico Robin | verified | On Play trash cost-8-or-more Character cost draws 2; empty-pool boundary |
| OP16-093 | Bartholomew Kuma | verified | On Play draws 2, trashes 2, then gives a rested DON!! to the Leader or a Character |
| OP16-094 | Portgas.D.Ace | verified | On K.O. makes the opponent trash 2; Activate Main once per turn gives a rested DON!! to a LoW card |
| OP16-095 | Monkey.D.Luffy | verified | On Play grants a black LoW Character [Unblockable] and the blocker cannot intercept |
| OP16-096 | Yamato | verified | On K.O. plays a [Yamato] of cost 6 or less from trash |
| OP16-097 | Yamato | verified | On Play returns a LoW cost-6-or-less Character from trash to hand then plays cost-2-or-less |
| OP16-098 | Yamato | verified | On Play draws and trashes 1; Activate Main self-trash plays a black [Yamato] of cost 8 from trash |
| OP16-102 | Avalo Pizarro | verified | On K.O. draws 1 and plays a [Fullalead] stage from hand; empty-pool draw-only boundary |
| OP16-103 | Van Augur | verified | On K.O. Blackbeard Leader gate draws and gives an opposing card -3000 power |
| OP16-104 | Catarina Devon | verified | When Attacking copies the base power of a chosen opposing Character with no-selection boundary |
| OP16-105 | Gecko Moria | verified | [Trigger] at 1-or-less Life jointly selects Absalom, Dr. Hogback, and Perona from trash before active placement; per-name limits and owner-chosen On Play order; returned-state duplicate-name rejection preserves trash and choice for retry |
| OP16-106 | Sanjuan.Wolf | verified | On K.O. Blackbeard Leader gate draws and sets a card's base power to 7000 |
| OP16-107 | Jesus Burgess | verified | On K.O. moves the top card of the opponent's Life to its owner's hand |
| OP16-108 | Shiryu | verified | On Play trash cost adds a Blackbeard card to Life face-up; [Trigger] draws 2 on life damage |
| OP16-109 | Doc Q | verified | On K.O. Blackbeard Leader gate draws and K.O.s up to 2 cost-1-or-less Characters |
| OP16-110 | Vasco Shot | verified | On K.O. draws 1 and rests a cost-6-or-less opposing Character with cost filter |
| OP16-111 | Boa Sandersonia | verified | Blocker intercepts the attack and rests while the Leader takes no damage |
| OP16-112 | Boa Hancock | vanilla | Parameterized vanilla invariant batch |
| OP16-113 | Boa Marigold | verified | Conditional [Blocker] at 2-or-less Life intercepts and is K.O.'d; no-blocker boundary above the threshold |
| OP16-114 | Laffitte | verified | On K.O. K.O.s up to 1 opposing Character of cost 4 or less |
| OP16-118 | Portgas.D.Ace | verified | Hand counters of 8000-power Characters become +2000 (counter battle save); On Play/K.O. look-5 search |
| OP16-119 | Marshall.D.Teach | verified | On Play look-3 adds a card face-down to the top of Life and bottom-orders the rest; decline boundary |
| OP17-002 | Atmos | verified | Opponent-turn power applies and expires through turn handoff |
| OP17-003 | Izo | verified | RushCharacter |
| OP17-004 | Inuarashi & Nekomamushi | verified | Printed behavior is unstructured |
| OP17-005 | Edward.Newgate | verified | permanent |
| OP17-006 | Kingdew | vanilla | Parameterized vanilla invariant batch |
| OP17-007 | Kouzuki Oden | verified | Either Wano or inclusive Whitebeard Character at 6000 power or less; named-or-Wano Leader gate; payable decline; generated parser proof |
| OP17-008 | Jozu | verified | On Play power choice and highest concurrent base-power setter; expiry |
| OP17-009 | Haruta | verified | onPlay, permanent |
| OP17-010 | Fossa | verified | Filtered hand play excludes every name of a multi-name Leader; optional activation |
| OP17-011 | Blamenco | verified | whenAttacking |
| OP17-012 | Blenheim | verified | onKo |
| OP17-013 | Portgas.D.Ace | verified | onPlay, permanent |
| OP17-014 | Whitey Bay | verified | On Play actual base-power K.O.; opponent-attack self-trash saves Leader for one battle; payable decline |
| OP17-015 | Marco | verified | Grouped self-K.O. replacement; payable inclusive-Whitebeard discard revives the same physical Marco active; decline retains hand |
| OP17-016 | Rakuyo | verified | On Play chooses zero, one or two real K.O. targets; base-2000 target remains eligible at current power 5000; base-3000 excluded |
| OP17-021 | Crone Oli | verified | Grouped K.O. replacement rests itself once and saves both Characters; decline; official name |
| OP17-022 | Shanks | verified | onPlay |
| OP17-023 | Nami | verified | Grouped K.O. replacement rests itself once and saves both Characters |
| OP17-024 | Howling Gab | verified | On Play rests actual opposing target or chooses none; later Banish trashes Trigger Life without activating it |
| OP17-025 | Building Snake | verified | Zero/one rested DON goes only to Shanks Leader; once-per-turn enforced; On K.O. removes actual opposing rested cost-qualified target |
| OP17-026 | Fugar | verified | One-DON normal play; attack and K.O. effects |
| OP17-027 | Benn.Beckman | verified | On Play effect; no printed Counter and Counter submission rejected |
| OP17-028 | Bonk Punch & Monster | verified | onPlay |
| OP17-029 | Hongo | verified | Actual DON reactivation followed by two cost-qualified rest targets; actual Blocker redirects attack |
| OP17-030 | Monkey.D.Luffy | verified | Paid On Play Rush enables same-turn attack; payable decline; hand-count Main reactivation and once-per-turn boundary |
| OP17-031 | Yasopp | verified | Actual On Play draw and cost-qualified rest; end-turn inclusive Allies reactivation or zero choice |
| OP17-032 | Limejuice | verified | Filtered look-three, positive/declined reveal, physical hand addition and ordered bottom remainder; saved-state continuation |
| OP17-033 | Lucky.Roux | verified | Filtered search/reveal and physical ordered remainder; accepted self-trash rests opposing Leader or active nonattacker; payable decline |
| OP17-034 | Rockstar | verified | Opponent-leader 6000+ gate (mutation killed), DON!! set, Red-Haired Leader 6000 base with cross-turn expiry |
| OP17-035 | Roronoa Zoro | vanilla | Parameterized vanilla invariant batch |
| OP17-040 | Edward.Newgate | verified | onPlay |
| OP17-041 | Wang Zhi | verified | Blocker |
| OP17-042 | Kaido | verified | onPlay |
| OP17-043 | Ganzui | verified | Base-power increase loses to concurrent base setter; expiry; existing replacement payment proof |
| OP17-044 | Captain John | verified | Optional rest/draw/discard; simultaneous named-target restrictions allow either named Character and reject Leader/unrelated targets |
| OP17-045 | Kyo | verified | On Play draws exact next physical card; existing replacement full-payment proofs |
| OP17-046 | Gloriosa | verified | Actual either-owner cost-qualified bottom movement; actual Blocker battle |
| OP17-047 | Shiki | verified | endOfYourTurn |
| OP17-048 | Shiki | verified | Played Rush:Character attacks Character but not Leader; filtered payment debuff for both attack triggers; shared turn limit, decline and expiry |
| OP17-049 | Charlotte Linlin | verified | onOpponentAttack |
| OP17-050 | Streusen | verified | Both top and bottom branches reorder exact physical pair; later draw follows selected order |
| OP17-051 | Jinbe | vanilla | Parameterized vanilla invariant batch |
| OP17-052 | Don Marlon | verified | Recovers exact blue cost-zero Event; excludes wrong color, cost and category |
| OP17-053 | Barbell | verified | On K.O. opponent chooses and orders two hand cards to deck bottom; Main power bonus |
| OP17-054 | Miss Buckingham Stussy | verified | Actual attack prevention after On Play and compound Main payment; base-cost selection, payable decline and expiry |
| OP17-059 | Aramaki | verified | onPlay |
| OP17-060 | Ulti & Page One | verified | On Play K.O. and one active DON addition; payable conditions |
| OP17-061 | Lead Performers | verified | onPlay, activateMain |
| OP17-062 | Kaido | verified | whenDonReturned |
| OP17-063 | Kaido | verified | activateMain |
| OP17-064 | King | verified | onOpponentAttack |
| OP17-065 | Queen | verified | onPlay |
| OP17-066 | Kurozumi Orochi | verified | Paid draw2/trash1 with own cost10+ Character; accepted DON return with no own qualifier or opponent-only qualifier suppresses results |
| OP17-067 | Kurozumi Kanjuro | verified | Paid opposing rest with own cost10+ Character; accepted DON return with no own qualifier or opponent-only qualifier suppresses result |
| OP17-068 | Sasaki | verified | Printed behavior is unstructured |
| OP17-069 | Jack | verified | onPlay |
| OP17-070 | Scratchmen Apoo | vanilla | Parameterized vanilla invariant batch |
| OP17-071 | Who's.Who | verified | Life Trigger plays same physical card; returns DON then chooses zero/one/two real K.O. targets; payable decline |
| OP17-072 | Black Maria | verified | Declined first attack does not consume once-per-turn use; later attack activation |
| OP17-073 | Basil Hawkins | verified | Printed behavior is unstructured |
| OP17-074 | Yamato | verified | Blocker |
| OP17-075 | X.Drake | verified | DON payment followed by controller-owned unseen opposing discard; saved choice and payable decline |
| OP17-080 | Usopp | verified | Elbaph search/remainder trash; live plus3000 lost after last qualifying opposing Character leaves |
| OP17-081 | Gerd | verified | Elbaph cost14 versus other-Leader cost2; paid recovery and payable decline with exact hand/trash preservation |
| OP17-082 | Sanji | verified | Draw2/trash2 independent of cost12+ condition; live plus3000 lost after last qualifying opposing Character leaves |
| OP17-083 | Jinbe | verified | Opposing cost12+ grants Blocker and +3000; no qualifying Character leaves base power and no Blocker interception |
| OP17-084 | Tony Tony.Chopper | verified | Cost12+ gates real Unblockable grant; opposing Blocker is bypassed only during the grant turn and can intercept after expiry |
| OP17-085 | Dorry | verified | Cost+12; hand/trash Brogy play; zero choice still locks Character plays; next-own-turn expiry and wrong-Leader exclusion |
| OP17-086 | Nami | verified | onPlay |
| OP17-087 | Nico Robin | verified | permanent |
| OP17-088 | Hajrudin | vanilla | Parameterized vanilla invariant batch |
| OP17-089 | Jaguar.D.Saul | verified | onPlay, permanent |
| OP17-090 | Franky | verified | Cost12+ gates On Play K.O. and +3000; no field qualifier means neither result; live power drops when last qualifier leaves |
| OP17-091 | Brook | verified | Cost12+ gates opposing hand trash and +3000; no field qualifier means neither result; live power drops when last qualifier leaves |
| OP17-092 | Brogy | verified | Cost+12; hand/trash Dorry play; zero choice still locks Character plays; next-own-turn expiry and wrong-Leader exclusion |
| OP17-093 | Monkey.D.Luffy | verified | Draw and trash revival; conditional Rush permits a new-card attack only while a cost12+ Character remains on the field |
| OP17-094 | Rodo | verified | Field-only cost increase; hand play cost and trash cost unchanged |
| OP17-095 | Roronoa Zoro | verified | permanent |
| OP17-100 | Capone"Gang"Bege | vanilla | Parameterized vanilla invariant batch |
| OP17-101 | Caribou | verified | activateMain, Life Trigger |
| OP17-102 | Charlotte Oven | verified | onKo, Life Trigger |
| OP17-103 | Charlotte Katakuri | verified | Own-turn Life addition and minus3000, zero Life and expiry; wrong Leader gates both results; opponent-turn Trigger skips On Play |
| OP17-104 | Charlotte Cracker | verified | Own-turn paid Life addition, payable decline, and paid wrong-Leader exclusion; opponent-turn Trigger skips On Play |
| OP17-105 | Charlotte Chiffon | verified | onPlay |
| OP17-106 | Charlotte Smoothie | verified | Own-turn paid Life addition and opponent discard, zero Life, payable decline and insufficient DON; opponent-turn Trigger skips On Play |
| OP17-107 | Charlotte Daifuku | verified | Life Trigger |
| OP17-108 | Charlotte Brulee | verified | Life Trigger |
| OP17-109 | Charlotte Pudding | verified | Trigger-card payment draws three; Life Trigger reveals selected Big Mom card and preserves physical remainder order or declines selection |
| OP17-110 | Charlotte Perospero | verified | Printed On Play and Life Trigger; opponent-turn Trigger play does not gain own-turn Rush |
| OP17-111 | Charlotte Mont-d'or | verified | Hand-play reveal payment, shortage and decline; opponent-turn Life Trigger plays this card and resolves reveal plus two K.O.s |
| OP17-112 | Charlotte Linlin | verified | onPlay |
| OP17-113 | Streusen | verified | Big Mom search selects/reveals or declines; saved-state continuation preserves chosen physical bottom order |
| OP17-114 | Sweet 3 Generals | verified | Paid draw, Life addition or zero Life, two-target minus3000 and expiry; payable decline; opponent-turn Trigger skips On Play |
| OP17-118 | Rocks.D.Xebec | verified | On Play draw and Rocks play; both-seat saved aggregate and different-name rejection with atomic retry; zero selection |
| OP17-119 | Loki | verified | Printed behavior is unstructured |
| P-001 | Monkey.D.Luffy | verified | Paid Rush play, attached-DON threshold and actual same-turn attack |
| P-003 | Eustass"Captain"Kid | verified | Actual Double Attack damage, attached-DON threshold and wrong-recipient negative |
| P-004 | Crocodile | verified | Actual Blocker interception, DON threshold and decline |
| P-005 | Kaido | verified | Repeatable DON-return Banish payment, actual Life trash, decline and turn expiry |
| P-006 | Monkey.D.Luffy | verified | Attached-DON threshold, actual attack and owner-turn power expiry |
| P-007 | Monkey.D.Luffy | verified | Strike Leader/Character battle protection, DON threshold and opposing effect K.O. |
| P-008 | Yamato | verified | Optional self-rest cost, cost-2 rest boundary, no eligible target and decline |
| P-009 | Trafalgar Law | verified | Mandatory opponent top-Life-to-hand at six-card hand; five-card and empty-Life negatives |
| P-010 | Kaido | verified | Own End Turn active-DON ramp, no On Play ramp and empty DON deck |
| P-012 | Jellyfish Pirates | vanilla | No printed effect; catalog metadata and vanilla invariants |
| P-013 | Gordon | verified | Self-bottom payment and attachment return, opponent power reduction, expiry and decline |
| P-014        | Koby (Jolly Roger Foil)                         | verified | Controller-owned Blocker redirection and battle result; physical self-play Life Trigger and decline-to-hand branch                                                                                    |
| P-015 | Sunny-Kun | vanilla | No printed effect; catalog metadata and vanilla invariants |
| P-016 | Shanks | vanilla | No printed effect; catalog metadata and vanilla invariants |
| P-017 | Trafalgar Law | verified | On Play opponent-only power reduction, expiry and zero selection |
| P-018 | Bartolomeo | verified | Actual Blocker interception, battle K.O. and decline |
| P-019 | Bepo | verified | DON-gated attack trigger, opponent power-3000 K.O. boundary and zero selection |
| P-020 | Helmeppo | verified | Own Leader/Character On Play power choice, expiry and zero selection |
| P-021 | Benn.Beckman | vanilla | No printed effect; catalog metadata and vanilla invariants |
| P-022 | Monkey.D.Luffy | vanilla | No printed effect; catalog metadata and vanilla invariants |
| P-023 | Yasopp | vanilla | No printed effect; catalog metadata and vanilla invariants |
| P-025 | Smoker | verified | DON-gated non-Special Character battle protection; Special, dual-attribute, Leader and effect-K.O. negatives |
| P-026 | Morgan | verified | Attack-triggered opposing Character cost reduction, zero choice and turn expiry |
| P-027 | General Franky | verified | Opponent-turn base-power aura and expiry; explicit synthetic named-consumer proof of Franky alias |
| P-028 | Portgas.D.Ace | verified | Actual Double Attack damage; paid play does not gain Rush |
| P-029 | Bartolomeo (P-029) (Jolly Roger Foil) | verified | Current printed exact FILM type; paid self rest, excluded Bartolomeo, real target readiness and decline |
| P-030 | Jinbe | verified | On K.O. either-owner cost-three bottom-deck choice, physical destination and zero selection |
| P-031 | Uta | verified | On Play rested DON ramp, zero choice and empty DON-deck boundary |
| P-032 | Sengoku | verified | Attached-DON own-turn opposing field cost aura and expiry |
| P-033 | Monkey.D.Luffy | verified | Physical self-bottom payment then draw, attached-DON return and decline |
| P-034 | Sanji | verified | Own-turn DON and Life thresholds for power bonus |
| P-035 | Monkey.D.Luffy | verified | DON-gated attack, optional hand cost and cost-zero opposing K.O. |
| P-036 | Monkey.D.Luffy | verified | Optional top/bottom Life cost, guaranteed self boost and independent Leader choice; expiry |
| P-037 | Monkey.D.Luffy | verified | Attack-triggered rested-Character count and power expiry |
| P-038 | Trafalgar Law | verified | Optional active-Leader rest payment; opposing cost-one K.O.; cost-two and rested-Leader exclusions; decline |
| P-039 | Bellamy | verified | Actual Banish and DON/Life power thresholds |
| P-040 | Kaido | verified | Opponent field-DON nine/ten boundary for battle and effect K.O.; non-K.O. removal stays legal |
| P-041 | Monkey.D.Luffy | vanilla | No printed effect; catalog metadata and vanilla invariants |
| P-042 | Roronoa Zoro | verified | Life Trigger opposing cost-four K.O. boundary and zero selection |
| P-043 | Monkey.D.Luffy | verified | On Play either-owner cost-three return-to-hand choice and zero selection |
| P-044        | Sabo - P-044 (Pirate Foil)                      | verified | Dynamic DON!! x1 and four-card hand conjunction, visible attached-DON!! power, and five-card negative boundary                                                                                         |
| P-045 | Roronoa Zoro | verified | Actual Banish suppresses damaged Life Trigger; later ordinary attack adds Life to hand |
| P-046 | Yamato | verified | Optional entire-hand bottom ordering, private saved prompt, equal redraw, empty hand and short deck |
| P-048 | Arlong | verified | DON and Life thresholds, opponent-owned hand-bottom choice and empty-hand continuation |
| P-049 | Usopp | verified | Private top-five ordering, whole-group top or bottom placement, saved prompt and short deck |
| P-050 | Sanji | verified | Actual Blocker, own-turn hand-size power threshold, hand change and turn expiry |
| P-051 | Shanks | verified | Optional zero-to-all hand trash, actual-count battle power and expiry |
| P-052 | Dracule Mihawk | verified | DON-gated Slash Leader/Character battle protection; wrong attribute and effect K.O. |
| P-053        | Nami (P-053) (Full Art)                         | verified | Post-play three-card hand gate, opponent-owned current-cost-3 filtering, selected physical return-to-hand, and four-card negative                                                                      |
| P-054 | Monkey.D.Garp | verified | DON-gated Strike Leader/Character battle protection; wrong attribute and effect K.O. |
| P-055 | Monkey.D.Luffy (P-055) (Jolly Roger Foil) | verified | Opponent-owned return choice; exact two-hand payment also works with empty opposing field; insufficient hand and decline |
| P-056 | Roronoa Zoro | verified | Optional rest-two-DON cost, either-owner cost-5 bounce, decline and zero selection |
| P-061 | Monkey.D.Luffy | vanilla | No printed effect; catalog metadata and vanilla invariants |
| P-062 | Hody & Hyouzou | verified | Optional opposing cost-four rest followed by mandatory self power and Life movement; OPT and empty Life |
| P-063        | Jinbe - P-063 (Pirate Foil)                     | verified | Opponent-owned current-cost-1 rest filtering, selected physical result, own/higher-cost exclusions, and zero-target branch                                                                              |
| P-064 | Kouzuki Momonosuke | vanilla | Parameterized catalog invariant and public paid-play batch |
| P-065 | Tony Tony.Chopper | verified | Current opposing cost-zero condition; power retained through opponent turn and expires at next own start |
| P-066 | Boa Hancock | verified | Dynamic own-turn exact-Kuja aura; hand five/six boundary, another Kuja, unrelated Character and turn expiry |
| P-067 | Eustass"Captain"Kid | verified | Active/rested restriction, no DON requirement, other named Kid and exact Captain John FAQ union; illegal Leader/ordinary target rejected |
| P-068 | Sanji - P-068 (Pirate Foil) | verified | Whole looked group ordered physically at top or bottom; decline and printed gate |
| P-069        | Koala (Pirate Foil)                             | verified | Zero-or-one rested DON!! count, own Leader/Character recipient filtering, physical attachment, once-per-turn rejection, and zero branch                                                               |
| P-070        | Carrot - P-070 (Pirate Foil)                    | verified | Public Blocker candidate, attack redirection, battle result, and Leader Life protection                                                                                                                 |
| P-071 | Marco | verified | Optional physical-source return after battle/effect K.O., attachment return and duplicate-copy exclusion |
| P-072 | Ryuma | verified | On Play and On K.O. opposing cost-four rest; zero selection |
| P-073 | Sabo - P-073 (Pirate Foil) | verified | Top or bottom physical Life payment; a paid Trigger card does not activate its Trigger; subsequent draw/DON result |
| P-074 | Portgas.D.Ace - P-074 (Pirate Foil) | verified | Whole looked group ordered physically at top or bottom; printed attack effect and decline |
| P-075 | Monkey.D.Luffy - P-075 (Pirate Foil) | verified | Printed DON gift and cost-eight attack draw/discard; zero gift; non-card reprint prose removed |
| P-077 | Ulti | verified | Own grouped DON-return minimum two, optional ramp then purple Stage activation, OPT and opponent-turn reaction |
| P-078 | Adio (Pirate Foil) | verified | Permanent +1000 power with two rested included-ODYSSEY Characters; live refresh recalculation and below-boundary exclusion |
| P-079 | Lim (Pirate Foil) | verified | Public Blocker redirection; end-turn two-rested included-ODYSSEY threshold; self reactivation and below-boundary exclusion |
| P-080 | Monkey.D.Luffy | vanilla | Parameterized catalog invariant and public paid-play batch |
| P-081 | Dracule Mihawk - P-081 (Pirate Foil) | verified | Optional physical self-return; post-cost three-blue-included-Cross-Guild condition; filtered up-to-one cost-5 hand play; decline and below-boundary paths |
| P-082 | Crocodile - P-082 (Pirate Foil) | verified | Real Alvida On KO play during opposing turn does not activate own-turn bottom-deck effect; Leader gates |
| P-083 | Shanks - P-083 (Pirate Foil) | verified | Character hand payment; skip debuff still draws; payable no-DON negative; power expires at turn end |
| P-084 | Buggy | verified | Printed Four Emperors/Cross Guild and Slash repaired; real Buggy Leader effect play and Ipponmatsu buff; own attack prohibition; both-player cost-three/four ban and Leader gate |
| P-085 | Jewelry Bonney - P-085 (Pirate Foil) | verified | Equal-Life boundary; selected physical Character goes face-up to top or bottom Life; Leader and category limits |
| P-087 | Nico Robin | vanilla | Parameterized catalog invariant and public paid-play batch |
| P-088 | Trafalgar Law - P-088 (Pirate Foil) | verified | Actual Life Trigger play at exactly five remaining total Life; six and wrong-Leader negatives; reprint prose removed |
| P-089 | Tony Tony.Chopper | vanilla | No printed effect; catalog metadata and vanilla invariants |
| P-090 | Charlotte Smoothie | verified | Opponent-turn battle/effect K.O., DON-return cost, Big Mom hand play scaled by opposing total DON, decline and own-turn negative |
| P-091 | Shirahoshi | verified | On Play either exact type hand play at cost ceiling; optional self-rest grants actual Character-only immediate attack |
| P-092 | Koby | verified | Opponent-turn self power reduction; Navy Leader base-power change, additive DON and printed duration |
| P-093 | Trafalgar Law | verified | Total field-DON comparison including attachments, optional On Play ramp and actual Blocker |
| P-094 | Roronoa Zoro | verified | Rested cost-two K.O.; active and cost-three exclusions; zero-target decline |
| P-095 | Sanji | verified | Event-only hand payment; Leader and Character battle bonus, expiry, payable OPT retry and decline |
| P-096 | Girl | verified | Draw then hand discard; exact Nami Leader/Character rested-DON recipients, OPT, zero choice and saved rejection state |
| P-097 | Shanks | verified | On Play and attack prevent opposing Blocker for the turn; normal Blocker returns after expiry |
| P-098 | Buggy | verified | Five qualifying cost-five Characters including source, failing condition self-bottom and actual Blocker |
| P-099 | Monkey.D.Luffy | verified | Optional ten-DON attack payment, saved prompt, reactivation and actual second attack; decline and insufficient payment |
| P-100 | Marshall.D.Teach | verified | Attack negates opposing Leader aura and Character Blocker, preserves own effects and restores effects after expiry |
| P-101 | Tony Tony.Chopper | verified | Optional On Play rested-DON gift to Leader, zero choice and actual Blocker interception |
| P-102 | Nami | verified | Straw Hat Leader gate for optional two-DON activation; wrong Leader and zero choice |
| P-103 | Portgas.D.Ace | verified | Draw two, physical hand selection and top/bottom ordering, then optional rested-DON gift |
| P-104 | Shanks | verified | Either player's ten-DON field immunity against opposing bottom-deck removal; nine-DON and battle negatives |
| P-105 | Sabo | verified | Actual Blocker and Revolutionary Army cost change; top/bottom Life payment; saved bottom choice; zero DON independent; zero Life unpayable |
| P-106 | Monkey.D.Luffy | verified | Top-Life orientation End Turn cost and Egghead activation; actual Life Trigger draw and cost-two K.O. |
| P-107 | Gol.D.Roger | verified | Own or opposing ten-DON condition; nine-DON negative; actual Leader attack; power persists through opposing turn and expires |
| P-108 | Monkey.D.Luffy | verified | Public Blocker interception; On K.O. zero/one/two rested-DON activation and Blocker decline |
| P-109 | Portgas.D.Ace | verified | Private top-three order at top or bottom before rested-DON giving; actual Blocker battle |
| P-110 | Monkey.D.Luffy | vanilla | No printed effect; catalog metadata and vanilla invariants |
| P-111 | Nico Robin | verified | Paid opposing effect K.O./removal replacement, saved prompt, shared OPT and turn reset; decline and battle negative |
| P-112 | Nami | verified | Named Nami Leader gate, independent optional DON gift and cost-two hand play |
| P-113 | Jewelry Bonney | verified | Opponent-turn two-DON power and actual Blocker; Life Trigger cost-three K.O. and zero choice |
| P-114 | Roronoa Zoro | verified | End-turn zero/one active-DON boundary enables or prevents next-turn Blocker |
| P-115 | Boa Hancock | verified | Optional rested-DON Leader/Character gift; Life Trigger yellow printed-Trigger hand play at power threshold |
| P-116 | Nico Robin | verified | Own K.O. enters trash before seven-card condition; ordered draw and discard at boundary |
| P-118 | Lilith | verified | Egghead Leader gate; Egghead-only and non-Egghead Trigger branches; cost/category exclusions and wrong Leader |
| P-119 | Portgas.D.Ace | vanilla | No printed effect; catalog metadata and vanilla invariants |
| P-121 | Brook | verified | Public play mills three; battle K.O. opponent-owned two-card discard including partial hand |
| P-135 | Monkey.D.Luffy | verified | On Play cost-five rest and actual Blocker interception; independent declines |
| P-136 | Usopp | verified | Optional self-rest; Straw Hat Leader or unrelated Character receives rested DON; wrong Leader excluded |
| P-137 | Sanji | verified | Attack gives rested DON; actual Double Attack with positive and zero-DON choices |
| P-138 | Tony Tony.Chopper | verified | Opponent-turn power survives battle; own-turn bonus removal changes battle result |
| P-139 | Nami | verified | On Play rested-DON giving; attack draw with DON and no-DON negative |
| P-140 | Monkey.D.Luffy | verified | On Play gives two rested DON to one recipient; actual next-turn Blocker |
| P-141 | Roronoa Zoro | verified | Leader and Character turn debuff, expiry; actual Rush including zero debuff choice |
| P-143 | Crocodile | verified | On Play Rush from either field cost zero; real Air Door and Tsuru create own-field-only zero cost; Rush persists after opposing zero-cost card leaves |
| P-144 | Ms. All Sunday | verified | Optional self-K.O. payment precedes exact draw; decline keeps field and deck |
| P-145 | Ms. Wednesday | verified | Draw before chosen hand discard; K.O. opposing hand five/six boundary and opponent-owned discard |
| P-146 | Miss.Goldenweek(Marianne) | verified | K.O. draws then rests opposing cost-zero target; positive rest, cost-three exclusion and no-target draw |
| P-147 | Miss.Valentine(Mikita) | verified | Either-owner cost-eight and live cost-zero power gates; K.O. recovers itself with wrong-trait exclusion |
| P-148 | Mr.3(Galdino) | verified | Cost-zero/eight gate, rested-DON Leader or Character recipient and payable OPT retry; real Blocker |
| P-149 | Mr.5(Gem) | verified | Cost-zero/eight draw-two then discard; Character-only Rush and rejected Leader attack; negative condition |
| P-155 | Trafalgar Law | verified | Attack Trigger-card hand cost, opponent power reduction and expiry; physical Life Trigger play at opponent-Life threshold |
| P-157 | Monkey.D.Luffy | verified | Optional physical hand-trash payment; active cost-limited Elbaph trash play; wrong-trait/high-cost exclusions and decline |
| P-159 | Monkey.D.Luffy | verified | Real Leader DON attachment and K.O.; cost-independent power-six-thousand Straw Hat hand play, wrong-trait/high-power exclusions |
| PRB02-001 | Koby | verified | Included-Navy opponent-turn power and expiry; optional base-power-3000 K.O.; ordered six-card draw gate after both selection branches; seven-card exclusion |
| PRB02-002 | Trafalgar Law - PRB02-002 | verified | Optional attack power reduction and expiry; self-only opponent-effect removal replacement; owner choice; once-per-turn, decline, and battle K.O. boundaries |
| PRB02-003 | Lucky.Roux | verified | Character-only 6000-power hand-trash cost; ordered draw two; decline; public Blocker redirection and battle result |
| PRB02-004 | Jewelry Bonney -PRB02-004 | verified | Opponent-attack zero-or-one DON!! reactivation; once-per-turn enforcement; later Blocker redirection and battle result |
| PRB02-005 | Monkey.D.Luffy - PRB02-005 | verified | Multicolored-Leader and seven-DON!! gates; no immediate rest; opponent-owned exact rest at their next Main Phase; both negative boundaries |
| PRB02-006    | Roronoa Zoro - PRB02-006 (SP)                   | verified | Opponent-Character-effect rest replacement, alternate Character rest, opponent-turn gate, and Blocker                                                                                                  |
| PRB02-007    | Jinbe - PRB02-007                               | verified | Included Seven Warlords top-five search and ordering plus cost-1 bottom-deck When Attacking                                                                                                             |
| PRB02-008    | Marco                                           | verified | Public Blocker choice plus K.O. draw-two reaction                                                                                                                                                        |
| PRB02-009    | Mr.3(Galdino) - PRB02-009                       | verified | Opponent-effect rested reaction, optional self-trash, draw two, and Blocker                                                                                                                             |
| PRB02-010    | Charlotte Pudding - PRB02-010                   | verified | DON!! −2 paid before both Leader and opponent-DON gates cover draw and filtered Character play |
| PRB02-011    | Donquixote Doflamingo                           | verified | Multicolored-Leader On Play rested DON!! addition and public Blocker choice                                                                                                                             |
| PRB02-012    | Nami                                            | verified | Physical Life Trigger play and included Straw Hat Crew top-five search excluding Nami                                                                                                                  |
| PRB02-013    | Gecko Moria                                     | verified | Included Thriller Bark Pirates Leader gate, low-cost trash play rested, and DON!! addition                                                                                                             |
| PRB02-014    | Sabo - PRB02-014                                | verified | Fifteen-card trash in-hand cost reduction and public Blocker choice                                                                                                                                      |
| PRB02-015    | Shiryu                                          | verified | Included Blackbeard Pirates Leader gate, conditional cost and Blocker, and base-cost K.O. reaction                                                                                                      |
| PRB02-016    | Otama                                           | verified | Optional self-rest and top-or-bottom Life-to-hand costs before the power modifier                                                                                                                        |
| PRB02-017    | Boa Hancock                                     | verified | Optional Trigger-card hand cost, Leader-or-Character action choice, Luffy exclusion, duration, and Trigger K.O.                                                                                          |
| PRB02-018    | Portgas.D.Ace - PRB02-018                       | verified | Face-up Life gate; cost-2 Sabo, Ace, or Luffy play from hand or trash                                                                                                                                    |
| ST01-002 | Usopp | verified | Same physical Life Trigger play; DON!! ×2 gate; power-5000-or-more Blocker restriction; lower-power allowance and below-DON!! boundary |
| ST01-003     | Karoo                                           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| ST01-004 | Sanji | verified | Dynamic DON!! ×2 Rush on the play turn and one-DON!! negative boundary |
| ST01-005 | Jinbe | verified | DON!! ×1 attack gate; optional own Leader-or-other-Character target; source exclusion; turn power and expiry |
| ST01-006     | Tony Tony.Chopper (ST01-006) (Jolly Roger Foil) | verified | Public Blocker choice and attack redirection                                                                                                                                                             |
| ST01-007     | Nami (TR)                                       | verified | Activate Main printed action and eligibility boundaries through public commands                                                                                                                         |
| ST01-008     | Nico Robin                                      | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| ST01-009     | Nefeltari Vivi                                  | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| ST01-010     | Franky                                          | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| ST01-011     | Brook - ST01-011 (Pirate Foil)                  | verified | On Play printed action and eligibility boundaries through public commands                                                                                                                               |
| ST01-012     | Monkey.D.Luffy (Wanted Poster)                  | verified | When Attacking printed action and synchronized printing behavior                                                                                                                                        |
| ST01-013 | Roronoa Zoro | verified | Dynamic DON!! ×1 printed power modifier stacking with the attached DON!! card's own power |
| ST02-002 | Vito | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST02-003 | Urouge | verified | DON attachment and three-Character threshold for permanent power |
| ST02-004     | Capone"Gang"Bege (ST02-004) (Jolly Roger Foil)  | verified | Public Blocker choice and attack redirection                                                                                                                                                             |
| ST02-005 | Killer | verified | On Play rested-Character cost limit; legal zero-target choice |
| ST02-006 | Koby | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST02-007     | Jewelry Bonney (SP)                             | verified | Activate Main included trait filtering and printed action boundaries                                                                                                                                    |
| ST02-008 | Scratchmen Apoo | verified | DON-gated attacking rest effect and opposing DON selection |
| ST02-009 | Trafalgar Law | verified | On Play Supernovas or Heart Pirates cost-five ready target; legal zero choice |
| ST02-010 | Basil Hawkins | verified | DON-gated Character battle reactivation once per turn; canceled battles excluded |
| ST02-011 | Heat | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST02-012 | Bepo | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST02-013 | Eustass"Captain"Kid | verified | Blocker and DON-gated end-of-own-turn reactivation |
| ST02-014 | X.Drake | verified | Rested, own-turn Supernovas or Navy power; overlapping types count once |
| ST03-002 | Edward Weevil | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST03-003 | Crocodile | verified | Blocker; DON-gated On Block either-owner bottom-deck; attacker removal ends battle |
| ST03-004     | Gecko Moria (SP)                                | verified | Alternative included traits, cost ceiling, own-name exclusion, and canonical identity                                                                                                                   |
| ST03-005     | Dracule Mihawk (ST03-005) (Full Art)            | verified | When Attacking printed action and eligibility boundaries through public commands                                                                                                                        |
| ST03-006 | Jinbe | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST03-007 | Sentomaru | verified | DON gate, optional two-DON payment, filtered Pacifista play and shuffle even on no match |
| ST03-008     | Trafalgar Law (ST03-008) (Jolly Roger Foil)     | verified | Public Blocker choice and attack redirection                                                                                                                                                             |
| ST03-009     | Donquixote Doflamingo (Wanted Poster)           | verified | Any-player cost-7 Character return, including self-target                                                                                                                                                |
| ST03-010 | Bartholomew Kuma | verified | Private top-three whole-group top/bottom order; Trigger play and short-deck On Play |
| ST03-011 | Buggy | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST03-012 | Pacifista | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST03-013     | Boa Hancock (ST03-013) (Jolly Roger Foil)       | verified | Life Trigger canonical self-play and resulting field placement                                                                                                                                           |
| ST03-014 | Marshall.D.Teach | verified | Either-owner cost-three return and legal zero-target choice |
| ST04-002 | Ulti | verified | Optional On Play DON return for cost-four-or-less Page One hand play; decline |
| ST04-003     | Kaido (Wanted Poster)                           | verified | Decline-or-pay DON!! cost before K.O. and Rush                                                                                                                                                           |
| ST04-004 | King | verified | Optional DON-return On Play K.O. and cost boundary |
| ST04-005     | Queen (SP)                                      | verified | Optional physical DON!! −1 On Play path and synchronized variant behavior                                                                                                                               |
| ST04-006 | Sasaki | verified | Optional On Play DON return to draw one; decline |
| ST04-007 | Sheepshead | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST04-008 | Jack | verified | Optional hand-trash On Play DON addition; decline and empty-hand boundary |
| ST04-009 | Ginrummy | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST04-010 | Who's.Who | verified | Optional DON-return On Play K.O.; Trigger self-play |
| ST04-011 | Black Maria | verified | Blocker interception and battle K.O. |
| ST04-012 | Page One | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST04-013 | X.Drake | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST05-002 | Ain | verified | On Play rested DON addition with resource limits |
| ST05-003 | Ann | verified | Blocker intercepts the Leader attack |
| ST05-004 | Uta | verified | Blocker; DON-return On Block rest and activation boundaries |
| ST05-005 | Carina | verified | FILM discard and self-rest costs; DON comparison and declined payment |
| ST05-006 | Gild Tesoro | verified | Attacking DON-return draw and decline |
| ST05-007 | Gordon | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST05-008 | Shiki | verified | Eight-DON battle-K.O. protection; lower-count and effect-K.O. negatives |
| ST05-009 | Scarlet | verified | Life Trigger plays the physical card active; decline adds it to hand |
| ST05-010 | Zephyr | verified | Completed Strike-Character battles grant cumulative turn power; canceled battle negative and paid activation |
| ST05-011 | Douglas Bullet | verified | Optional DON return, opposing rest choices and Double Attack; decline |
| ST05-012 | Baccarat | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST05-013 | Bins | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST05-014 | Buena Festa | verified | Printed search filters, hand addition and remainder order |
| ST05-015 | Dr. Indigo | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST06-002 | Koby | verified | Optional hand-trash On Play cost-zero K.O.; decline and empty-hand boundary |
| ST06-003 | Jango | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST06-004 | Smoker | verified | Own/opposing effect-K.O. immunity; DON and either-field cost-zero Double Attack gates; battle-K.O. negative and dynamic loss before damage |
| ST06-005 | Sengoku | verified | When Attacking opposing cost minus four; zero-target choice and turn expiry |
| ST06-006     | Tashigi (SP)                                    | verified | Counter 2000 metadata and Activate Main −2 cost modifier                                                                                                                                                 |
| ST06-007 | Tsuru | verified | Public Blocker interception and decline |
| ST06-008     | Hina (Reprint)                                  | verified | Clean canonical On Play behavior without importer disclaimer text                                                                                                                                        |
| ST06-009 | Fullbody | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST06-010     | Helmeppo (Full Art)                             | verified | On Play printed action and eligibility boundaries through public commands                                                                                                                               |
| ST06-011 | Momonga | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST06-012 | Monkey.D.Garp | verified | Hand-trash and self-rest costs for cost-four-or-less K.O.; decline and incomplete-cost boundary |
| ST06-013 | T-Bone | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST07-002 | Charlotte Anana | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST07-003 | Charlotte Katakuri | verified | Private Life look or skip before independent Rush condition; fewer-Life and equal-Life boundaries |
| ST07-004 | Charlotte Snack | verified | DON-gated Life payment for battle power and Banish; actual Trigger suppression, decline and no-DON boundary |
| ST07-005 | Charlotte Daifuku | verified | DON-gated top-Life-to-hand payment then deck-to-Life addition; decline and no-DON boundary |
| ST07-006 | Charlotte Flampe | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST07-007     | Charlotte Brulee (Jolly Roger Foil)             | verified | Life Trigger canonical self-play and resulting field placement                                                                                                                                           |
| ST07-008 | Charlotte Pudding | verified | Private own/opposing Life top-or-bottom movement and skipped look |
| ST07-009 | Charlotte Mont-d'or | verified | Self-rest and Life payment for cost-three-or-less K.O.; decline; hand-trash Trigger self-play |
| ST07-010 | Charlotte Linlin | verified | Opponent chooses Life trash or controller Life addition; zero-Life trash remains selectable |
| ST07-011 | Zeus | verified | Optional self-rest grants turn Banish to named Leader or Character; decline and Trigger self-play |
| ST07-012 | Baron Tamago | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST07-013 | Prometheus | verified | Optional self-rest grants turn Double Attack to named Leader or Character; decline and Trigger self-play |
| ST07-014 | Pekoms | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST08-002 | Uta | verified | Leader battle immunity, Character-battle and effect-KO negatives; optional self-rest for temporary cost reduction and decline |
| ST08-003 | Gaimon | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST08-004 | Koby | verified | Optional self-rest for opposing cost-two-or-less K.O.; friendly exclusion and declined payment |
| ST08-005 | Shanks | verified | Optional hand-trash payment before all cost-one Characters on both fields are K.O.d; higher-cost survival and decline |
| ST08-006 | Shirahoshi | verified | On Play temporary cost reduction or zero targets; Blocker intercepts a Leader attack |
| ST08-007 | Nefeltari Vivi | verified | Blocker intercepts a Leader attack; Life Trigger plays the same physical card active without DON payment |
| ST08-008 | Higuma | verified | On Play cost reduction, turn-end expiry and zero-target choice |
| ST08-009 | Makino | verified | On Play draw with a cost-zero Character on either field; no draw when all costs exceed zero |
| ST08-010 | Monkey.D.Garp | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST08-011 | Monkey.D.Luffy | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST08-012 | Laboon | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST08-013 | Mr.2.Bon.Kurei(Bentham) | verified | DON-gated end-of-battle K.O. of the exact opposing battle object, then self only on success; decline, defending survival, immunity, replacement and stale-object boundaries |
| ST09-002 | Uzuki Tempura | verified | Life Trigger rests an opposing cost-two-or-less Character then returns self to hand; zero targets still return self |
| ST09-003 | Ulti | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST09-004 | Kaido | verified | DON-gated battle protection at two or fewer Life; no-DON and three-Life negatives; effect K.O. remains possible |
| ST09-005 | Kouzuki Oden | verified | DON-gated Double Attack damage; On K.O. hand-trash payment adds deck top to Life; declined payment |
| ST09-006 | Kouzuki Momonosuke | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST09-007 | Shinobu | verified | Blocker with optional bottom-Life payment for battle power; paid survival, expiry and declined-payment K.O. |
| ST09-008 | Shimotsuki Ushimaru | verified | DON-gated attack Life payment and yellow Wano cost-four-or-less hand play; independent color, trait, cost and card-type exclusions; decline and no-DON boundary |
| ST09-009 | Fugetsu Omusubi | verified | Life Trigger K.O.s an opposing cost-one-or-less Character then returns self to hand; zero targets still return self |
| ST09-010 | Portgas.D.Ace | verified | Top-or-bottom Life K.O. replacement for battle and either-owner effects; snapshot retry, private Life choice, decline, zero Life, once-per-turn use and reset |
| ST09-011 | Monkey.D.Luffy | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST09-012 | Yamato | verified | Attack Life payment grants power through the opposing turn until own Refresh; declined payment |
| ST09-013 | Yamato | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST10-004 | Sanji | verified | On Play Rush at opposing Character power 5000; immediate attack remains after that Character leaves; lower power and Leader-only exclusions |
| ST10-005     | Jinbe - ST10-005 (Pirate Foil)                  | verified | DON!! x1 When Attacking opposing power reduction and correct base-power result                                                                                                                           |
| ST10-006 | Monkey.D.Luffy | verified | Immediate Rush; opposing Blocker KO ends battle; alternate eligible KO target; power threshold; once per turn; zero target and friendly Blocker exclusion |
| ST10-007 | Killer | verified | Own DON return permits rested cost-three KO; zero choice; opponent-caused return qualifies; repeat limit; opponent-turn and opponent-owned DON exclusions |
| ST10-008     | Shachi & Penguin (Pirate Foil)                  | verified | On Play printed action and negative eligibility boundaries                                                                                                                                               |
| ST10-009 | Jean Bart | verified | Optional extra DON rest on play adds active DON; declined payment preserves the extra DON |
| ST10-010     | Trafalgar Law (TR)                              | verified | Optional physical DON!! −1, action-scoped seven-card hand gate, controller choice, and official text                                                                                                    |
| ST10-011 | Heat | verified | Own-turn DON return grants power through opponent turn; next-own-turn expiry; once per turn; opponent-caused return qualifies; wrong-turn and wrong-owner exclusions |
| ST10-012 | Bepo | verified | On Play and When Attacking add rested DON while behind; zero choice and equal-total DON exclusion |
| ST10-013 | Eustass"Captain"Kid | verified | On Play and When Attacking optionally return DON for Leader power through opponent turn; next-own-turn expiry; separate declined payments |
| ST10-014 | Wire | verified | Blocker redirect and decline; mandatory draw then discard on either turn after own DON return; opponent-caused return qualifies; once per turn; opponent-owned DON exclusion |
| ST11-002 | Uta | verified | Blocker redirect; end-turn Event-only discard; own FILM reactivation including self; non-FILM exclusion and declined or unavailable payment |
| ST12-002 | Kuina | verified | Optional self-rest payment; opposing cost filter; declined cost; Life Trigger plays this physical card |
| ST12-003 | Dracule Mihawk | verified | Muggy Kingdom or Slash hand-play alternatives; cost-four and same-name exclusions; rested play; decline; total-Character gate counts Mihawk itself |
| ST12-004 | Humandrill | vanilla | Printed vanilla; shared catalog invariant verifies no structured behavior |
| ST12-005     | Perona (Pirate Foil)                            | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| ST12-006 | Yosaku & Johnny | verified | Both attack choices with target filters; DON gate; optional KO target may be declined |
| ST12-007 | Rika | verified | Two-DON payment before opposing Life condition; Slash and cost filters; declined payment |
| ST12-008 | Roronoa Zoro | verified | Attack rest choice through opposing cost six; cost-seven exclusion; DON gate; zero-target choice |
| ST12-009 | Elephant True Bluefin | vanilla | Printed vanilla; shared catalog invariant verifies no structured behavior |
| ST12-010 | Emporio.Ivankov | verified | Only revealed cost-two Characters play; remainder top or bottom; declined play; six-card draw gate; once-per-turn draw after real reactivation |
| ST12-011 | Sanji | verified | DON and hand gates; attack power persists after hand growth; next-turn expiry; repeated attacks stack +4000 |
| ST12-012     | Charlotte Pudding (SP)                          | verified | Activate Main self-return cost and printed follow-up action through public commands                                                                                                                      |
| ST12-013 | Zeff | verified | Three-card ordering; only the revealed exact-cost-two Character plays rested; wrong-card exclusions; declined play |
| ST12-014     | Duval (Jolly Roger Foil)                        | verified | On Play private top-three placement and public Blocker behavior                                                                                                                                          |
| ST12-015 | Patty & Carne | vanilla | Printed vanilla; shared catalog invariant verifies no structured behavior |
| ST13-004     | Edward.Newgate - ST13-004 (Pirate Foil)         | verified | Adds deck top to Life, privately moves one Life card to deck top, reorders the remainder, and preserves face state                                                                                       |
| ST13-005 | Emporio.Ivankov | verified | Blocker; optional top-or-bottom Life trash; exact-cost-five hand reveal; same physical card enters face-down Life; wrong cost and Event exclusions; declined cost and zero reveal |
| ST13-006 | Curly.Dadan | verified | Three distinct named cost-two groups play active together; duplicate-name submission rejected; zero play; Blocker redirect and decline |
| ST13-007     | Sabo - ST13-007 (Pirate Foil)                   | verified | Self-trash activation, exact-name cost-5 Life play, Leader power duration, and expiry                                                                                                                    |
| ST13-008 | Sabo | verified | Optional Life trash pays before opposing cost-five KO; cost-six exclusion; declined cost and empty-Life shortage |
| ST13-009 | Shanks | verified | Any face-up Life can pay face-down cost; invalid face-down selection rejected; saved choice resumes; payment precedes opposing seven-card hand gate; declined cost and shortage |
| ST13-010     | Portgas.D.Ace - ST13-010 (Pirate Foil)          | verified | Self-trash activation, canonical Ace identity play from Life, Leader power duration, and expiry                                                                                                         |
| ST13-011     | Portgas.D.Ace (SP)                              | verified | Canonical Portgas.D.Ace alternate identity, conditional Rush, and immediate public attack legality                                                                                                      |
| ST13-012 | Makino | verified | Optional top-or-bottom Life-to-hand payment; private Life ordering preserves face-up and face-down states; declined payment preserves hand and order |

| ST13-013 | Monkey.D.Garp | verified | All three exact names searched within cost five; wrong name and higher cost excluded; ordered bottom remainder; zero selection |

| ST13-014     | Monkey.D.Luffy - ST13-014 (Pirate Foil)         | verified | Physical top-Life reveal/play, source trash, Leader boost duration, and expiry                                                                                                                           |
| ST13-015 | Monkey.D.Luffy | verified | Unconditional power before Life-gated draw and Life trash; zero-Life boundary; once per turn; power persists through opponent turn and expires next own turn |
| ST13-016 | Yamato | verified | Chosen Life card moves face-down to deck top; remaining Life order and face states preserved; immediate Rush; empty-Life path |
| ST14-002 | Usopp | verified | Own modified cost-eight eligibility, DON gate, cost-four KO filter and decline |
| ST14-003     | Sanji (SP)                                      | verified | On Play cost-gated opposing Character K.O. and exclusion boundary                                                                                                                                        |
| ST14-004 | Jinbe | verified | Black Straw Hat filter, opponent-turn duration, expiry, decline and once-per-turn rejection |
| ST14-005 | Tony Tony.Chopper | vanilla | vanilla; catalog invariants, no bespoke behavior test |
| ST14-006 | Nami | verified | Both hand/count conditions, current modified cost and Blocker |
| ST14-007     | Nico Robin - ST14-007 (Pirate Foil)             | verified | On Play and When Attacking cost reductions through public commands                                                                                                                                       |
| ST14-008 | Haredas | verified | Self-rest payment, cost increase before threshold check, draw/trash, decline and expiry |
| ST14-009 | Franky | verified | Self-counting cost threshold, selected effect-KO immunity, power, expiry and battle vulnerability |

| ST14-010     | Brook - ST14-010 (Pirate Foil)                  | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| ST14-011 | Heracles | verified | Self-rest payment, both filters, decline and cost-duration expiry |
| ST14-012 | Monkey.D.Luffy | verified | Modified self-cost ten permits immediate attack; lower cost prevents it |
| ST14-013     | Roronoa Zoro - ST14-013 (Pirate Foil)           | vanilla  | Parameterized vanilla invariant batch                                                                                                                                                                    |
| ST15-001 | Atmos | verified | Named-Leader gate blocks own-effect Life additions and costs; restriction expires |
| ST15-002     | Edward.Newgate (SP)                             | verified | Rested-DON!! attachment, self-rest activation, and power-filtered K.O.                                                                                                                                   |
| ST15-003 | Kingdew | verified | Effect-KO reaction, opponent-turn gate, decline, expiry and Blocker battle-KO negative |
| ST15-004 | Thatch | verified | Trait gate, temporary debuff, mandatory Life addition after zero targets and zero-Life case |

| ST15-005 | Portgas.D.Ace | verified | replacement |
| ST16-001 | Uta | verified | FILM payment, both DON recipients, once-per-turn limit, decline and Blocker |
| ST16-002 | Gordon | verified | Two Music discards boost one recipient, zero discard, decline, expiry and Blocker |
| ST16-003 | Charlotte Katakuri (Pirate Foil) | verified | Included-FILM Leader and exact six-own-rested-card gates; opponent-card exclusion; permanent power visibility |
| ST16-004     | Shanks (SP)                                     | verified | On Play rested-only K.O. eligibility and exclusion boundaries                                                                                                                                           |
| ST16-005 | Monkey.D.Luffy - ST16-005 (Pirate Foil) | verified | Rested named-Uta condition; own-field ownership; active-Uta and opponent-Uta exclusions; permanent power visibility |
| ST17-001 | Crocodile | verified | Revealed qualifying card is drawn; hand card returns top; failed reveal stays top |
| ST17-002     | Trafalgar Law - ST17-002 (Reprint)              | verified | Optional own-Character return cost, action-scoped included Warlords Leader gate, and either-player cost-4 return                                                                                         |
| ST17-003     | Buggy - ST17-003 (Pirate Foil)                  | verified | Private top-three choice and ordered deck placement through public commands                                                                                                                              |
| ST17-004 | Boa Hancock | verified | Top/bottom ordering before filtered DON grant, zero grant and Blocker |
| ST17-005     | Marshall.D.Teach - ST17-005 (Pirate Foil)       | verified | Ordered hand-card-to-top-deck cost, rested-DON!! recipient, and once-per-turn enforcement                                                                                                                |
| ST18-001     | Uso-Hachi (SP)                                  | verified | Eight-DON!! positive and seven-DON!! negative boundaries with target cost exclusion                                                                                                                      |
| ST18-002     | O-Nami - ST18-002                               | verified | On Play printed action and eligibility boundaries through public engine commands                                                                                                                        |
| ST18-003     | San-Gorou (Pirate Foil)                         | verified | When Attacking printed action and eligibility boundaries through public engine commands                                                                                                                 |
| ST18-004     | Zoro-Juurou (ST18-004)                          | verified | On Play included Straw Hat Crew trait matching and printed action boundary                                                                                                                               |
| ST18-005     | Luffy-Tarou (SP)                                | verified | Optional physical DON!! −1 payment, included trait matching, and printed On Play action                                                                                                                  |
| ST19-001 | Smoker | verified | black AND exact Navy discard candidates exclude wrong color and black non-Navy; zero/one/two cost<=4 targets, actual attack rejection through opposing next turn, expiry, optional decline |
| ST19-002     | Sengoku - ST19-002 (Pirate Foil)                | verified | Two black included-Navy hand-trash cost and included-Navy Leader-gated draw                                                                                                                              |
| ST19-003 | Tashigi | verified | Smoker OnPlay cost−4, zero-cost trash without OnKO draw, wrong-Leader ActivateMain via real IceAge cost reduction, once per turn, played-turn restriction, zero selection and cost expiry |
| ST19-004 | Hina | verified | trash physical card placed deck bottom, rested DON to Leader or Character once, optional decline and empty trash; own/opponent turn and zero/one attached DON cost boundaries |
| ST19-005 | Monkey.D.Garp | verified | trash-bottom payment, cost−1 expiry and OPT, optional decline and empty trash; actual Blocker intercept and decline |
| ST20-001 | Charlotte Katakuri | verified | only top Life turns face-up and is public, lower Life remains hidden, rested DON to Leader/Character once, already-face-up top cannot use facedown bottom, emptyLife and optional decline; Blocker intercept/decline |
| ST20-002 | Charlotte Cracker | verified | own and opponent effect KO replacements, top Life exact card, spent/reset on same physical Character, zeroLife and decline, battle exclusion; physical LifeTrigger play after discard and decline |
| ST20-003 | Charlotte Brulee (Pirate Foil) | verified | Controller-owned Life Trigger; either-owner or skip choice; private physical top-Life placement; same Trigger card returned to hand |
| ST20-004 | Charlotte Pudding | verified | topLife payment readies exact BigMomPirates cost<=3, cost/trait negatives and decline; ST13Luffy replacement bottoms faceup payment but body does not ready; separate Trigger opposing cost<=3 rest |
| ST20-005 | Charlotte Linlin | verified | opponent owns branch and exact two-hand-card selection after JSON snapshot resume; topLife branch including zeroLife no-op, paid discard and optional decline |
| ST21-002 | Usopp | verified | opponent-turn DON1/DON2 battle outcomes and power, own-turn absence of defensive bonus |
| ST21-003 | Sanji - ST21-003 (Pirate Foil) | verified | Optional own included-Straw-Hat power-6000 target; selected-attacker-only Blocker prohibition; decline leaves attack blockable |
| ST21-004 | Jewelry Bonney | verified | battle KO at one/two attached DON draws only at two; effect KO also draws; attached DON returns to cost area without losing trigger snapshot |
| ST21-005 | Jinbe | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST21-006 | Stussy | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST21-007 | Sentomaru | verified | actual Blocker intercept prevents Leader damage, named Blocker decline allows damage |
| ST21-008 | Tony Tony.Chopper | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST21-009 | Nami | verified | two rested DON to Straw Hat Leader/Character, nonmatching Character excluded, zero-grant decline, once-per-turn retry rejection |
| ST21-010 | Nico Robin | verified | attacking with DON2 selects opposing power4000 but excludes5000, target decline retains opponent Character, DON1 does not activate KO |
| ST21-011 | Franky | verified | opponent-turn aura follows base power despite Sanji's lasting +2000 (current5000 becomes6000), excludes low-power non-Straw Hat Mihawk, excludes base6000 Chopper even after -5000, DON1 negative, turn boundaries remove aura and restore lasting modifier independently |
| ST21-012 | Brook | verified | attacking Brook grants one/two rested DON to self to change battle damage, can grant Leader instead, zero-grant decline leaves attack too weak |
| ST21-013 | Vegapunk | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST21-014 | Monkey.D.Luffy | verified | actual paid play attacks immediately with Rush; one rested DON granted to Leader/self, zero-grant decline retains pool and still deals damage |
| ST21-015 | Roronoa Zoro | verified | actual paid play cannot attack with DON1 then can with DON2; battle KO without attached DON offers red Character power<=6000 excluding another Zoro, blue Character, over6000 red Character and Event; named play decline retains eligible hand card |
| ST22-002 | Izo | verified | exact includes-Whitebeard search/exclude allIzo, optional0/1 and bottom order; opponentattack optional selftrash draw then chosen handbottom; decline and ownattacknegative; actual Whitebeard Pirates Allies positive search |
| ST22-003 | Edward.Newgate | verified | match draws2 including revealed top; nonmatch preserves top; DoubleAttack actual2Life; matching lastdeckcard terminal defeat |
| ST22-004 | Elmy | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST22-005 | Kouzuki Oden | verified | 3DON+anotherCharacter return, selfexclusion,1/2DONnegative, nootherCharacternegative, optionaldecline, real opponent-protectedKuzan canpay ownreturn, JSON compoundcostresume; opposing bottomdeck andKO replacements, exact2discard with snapshot, decline/insufficienthand, own-effect andbattle negatives; once-per-turn failure with sufficient remaining DON and Character |
| ST22-006 | Jozu | verified | matching top draws2 before chosen discard; nonmatch no draw/trash and top unchanged |
| ST22-007 | Squard | verified | matching reveal gives restedDON to Leader/Character without draw; zero grant and zero pool; mismatch and OPT; mismatch retains an available rested DON |
| ST22-008 | Decalvan Brothers | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST22-009 | Vista | verified | actual Blockerinterception/KO and explicitBlockerdecline |
| ST22-010 | Portgas.D.Ace | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST22-011 | Whitey Bay | verified | reveal2 matching cards publicly remainsinhand, wrongpaymentfilters, Leaderpower+2000expiry, decline, wrongLeader canpay butcannotbuff; real opposingturn AlvidaOnKO play doesnotofferreveal withavailablepayment |
| ST22-012 | Marco | verified | opposingeffectKO replacement discard, OPT spent/reset samephysicalcard, decline, ownKO/battle/nonKOremoval negatives; attackmatch/mismatch topstays andpowerexpiry throughopponentturn |
| ST22-013 | LittleOars Jr. | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST22-014 | A.O. | vanilla | Catalog stat, printing and identity invariants; no printed ability |
| ST23-001 | Uta | verified | actual paid discounted play when an attached-DON boost gives own Character10000currentpower; field cost remains6; strong Leader alone does not discount; actual Blocker intercept and named decline |
| ST23-002 | Shanks | verified | corrected missing parser output manually with opposing basePower>=8000 hand-only -3 and Red-Haired Pirates OR Uta Leader OnPlay+2000. Both Leader alternatives, wrongLeader, full and discounted payment, opponent8000base lowered to3000 still discounts, own8000base does not, field cost9 and duration through opponentturn then expires |
| ST23-003 | Benn.Beckman | verified | discard payment, exact Red-Haired Pirates Leader requirement, basepower<=4000 target filter and no Leader targeting. WrongLeader can pay but gets noKO; named optional discard decline. Real Franky aura raises Jinbe4000base to5000current while MolePistol lowers Chopper6000base to1000current; KO includes Jinbe and excludes Chopper |
| ST23-004 | Monkey.D.Luffy | verified | real rest1DON+restself payment gives -1000thisTurn and expires; named decline preserves both, noDON/restedself rejected. Real ST02-009 Law readies Luffy and second activation succeeds in same turn, stacking -2000 without invented OPT |
| ST23-005 | Yasopp | verified | one restedDON to either Leader or Character, OPT repeat rejected; named zero-grant decline preserves pool |
| ST24-001 | Capone"Gang"Bege | verified | actual cost2 payment crosses priorrested4→6 threshold;3→5 does not. Rested Leader supplies sixth card at priorDON3+paid2. Draw+mandatory handtrash and actual Blocker intercept/decline |
| ST24-002 | Kid & Killer | verified | search sees5 but permits only exactSupernovas, selectsphysicalcard and ownerorders4remaining, zero-search ordersall5; optional selftrash onopponentattack readies1DON, named decline retains Character/pool. Hidden deck order uses raw state only because public view exposes no deck array |
| ST24-003 | Basil Hawkins | verified | ownend readies1of2restedDON beforeopponentacts; namedzerochoice preservespool |
| ST24-004 | Law & Bepo | verified | corrected parser omission manually via rest followed by freeze.previousActionTargets. Selected physical Character alone staysrested atnextRefresh while alreadyrestedunselectedCharacter readies; restcreatessecondrested and grantsLeader+2000, onetargetonly doesnot; zero-restchoice withtwoalreadyrested stillgrantsbuff andfreezesneither; buffpersistsopponentturn thenexpires |
| ST24-005 | X.Drake | verified | Supernovas Leader gate, cost<=5opponentrest excludes8cost; DON remainsrested untilend thenreadies1. Restdecline and delayedreadydecline are independent; wrongLeader producesneither. Scheduledready survives actual returnofDraketo hand viaST22-005Oden cost beforeendturn |
| ST25-001 | Alvida | verified | Draw three and trash two with Buggy Leader; dynamic cost increase counts printed base cost, including cards with reduced current cost |
| ST25-002 | Cabaji | verified | Two qualifying base-cost Characters grant Blocker and cost increase; opponent-turn power; actual Blocker and decline |
| ST25-003 | Crocodile & Mihawk | verified | Draw, discard and optional Cross Guild play; opponent-effect removal replacement for self or another eligible Character, hand payment and shared turn limit; battle and own-effect exclusions |
| ST25-004 | Buggy | verified | Discard then self-trash payment; Buggy Leader gate; Cross Guild play through cost six, target exclusions and decline; self-trash is not K.O. |
| ST25-005 | Mohji | verified | Dynamic Blocker and cost increase; K.O. draw requires Buggy Leader and at most three hand cards |
| ST26-001 | Soba Mask | verified | Hand-only discount checks either named Character and base power; On Play returns all own San-Gorou and Sanji copies; current-power and wrong-name negatives |
| ST26-002 | Tony Tony.Chopper | verified | Actual Blocker; optional DON return then mixed opposing DON or cost-one Character rest; Character filter does not remove DON candidates |
| ST26-003 | Nico Robin | verified | Optional return of two DON then optional active DON addition; zero choice and pool accounting |
| ST26-004 | General Franky | verified | Optional return of two DON; zero, one or two opposing targets lose power until turn end |
| ST26-005 | Monkey.D.Luffy | verified | Dual-trigger DON!!-2 set-base-power 7000 on multicolored Straw Hat Leader (opponent-DON negative; expiry via duration) |
| ST27-001 | Avalo Pizarro | verified | Named Fullalead rest payment, Leader gate and power expiry; turn limit with a new active Fullalead available; independent battle K.O. draw |
| ST27-002 | Catarina Devon | verified | Self-trash payment and Leader-gated cost reduction with expiry; self-trash does not draw, battle K.O. does; decline |
| ST27-003 | Kuzan | verified | Actual Blocker; battle K.O. plays an eligible physical Blackbeard Pirates card from trash rested; cost/type exclusions and decline |
| ST27-004 | Sanjuan.Wolf | verified | Leader-gated Blocker at zero trash; cost groups at zero, three, four, seven and eight cards; On Play discard crosses a group boundary |
| ST27-005 | Marshall.D.Teach | verified | activateMain |
| ST28-001 | Ashura Doji | verified | Wano Leader and opposing Life gates; K.O. uses base cost despite current-cost increases; target decline |
| ST28-002 | Izo | verified | Two attached DON grant actual Blocker; On Play gives Wano Leader Banish for the turn, with damage and expiry proof |
| ST28-003 | Kin'emon | verified | Physical Life Trigger play; independent Wano Leader and opposing Life requirements; no DON payment |
| ST28-004 | Kouzuki Momonosuke | verified | Attached-only return to rested cost area grants Rush and power on played turn; own-turn Leader bonus at two Life; turn limit with payment available, decline and insufficient attachment boundary |
| ST28-005 | Yamato | verified | Printed zero power; two-DON own-turn power and real attack; exact Wano cost-two search, physical selection, remainder order and decline |
| ST29-002 | Usopp | verified | On Play and attack rest use opposing Life count as cost ceiling; zero selection |
| ST29-003 | Kaku | verified | Live Life comparison grants power on either turn; separate cost-three K.O. Trigger |
| ST29-004 | Sanji | verified | Straw Hat Character and Event search with physical order and saved choice; discard-paid physical Life Trigger play and On Play dispatch; decline |
| ST29-005 | Jinbe | verified | Physical Life Trigger play requires exact Luffy Leader; wrong Leader excluded |
| ST29-006 | Stussy | vanilla | Parameterized vanilla catalog invariant |
| ST29-007 | Tony Tony.Chopper | verified | K.O. top-or-bottom Life payment then optional hand-to-top-Life; separate named-Luffy power Trigger |
| ST29-008 | Nami | verified | Opponent K.O. replacement turns exact top Life face-up; saved choice, source and teammate, no-Life and already-face-up boundaries, repeat payment, battle and own-effect exclusions; separate Trigger play |
| ST29-009 | Nico Robin | verified | Actual Blocker and exact-Luffy physical Life Trigger play with decline and wrong Leader boundary |
| ST29-010 | Franky | vanilla | Parameterized vanilla catalog invariant |
| ST29-011 | Brook | verified | Actual Blocker interception and decline |
| ST29-012 | Monkey.D.Luffy | verified | Named Luffy Leader or Character receives optional rested DON; turn limit with DON available and physical Trigger play; printed zero power retained |
| ST29-013 | Rob Lucci | verified | Life Trigger K.O. uses total Life of both players as cost ceiling |
| ST29-014 | Roronoa Zoro | verified | Rush Character attack restriction; Trigger-card discard then draw and optional DON to Leader or Character; structured-only Trigger card accepted; turn limit and decline |
| ST30-002 | Inazuma | verified | Exact-power Character search with physical selection, ordered remainder and zero choice |
| ST30-003 | Edward.Newgate | verified | Own-turn base6000 aura includes self and boosted recipients but excludes current-only6000; real battle and expiry |
| ST30-004 | Emporio.Ivankov | verified | Reveal two exact6000 Characters without movement, draw three then discard two including revealed cards; decline and insufficient payment |
| ST30-005 | Jozu | vanilla | Parameterized vanilla catalog invariant |
| ST30-006 | Jinbe | verified | Exact6000 Character discard draws two; wrong power and decline |
| ST30-007 | Portgas.D.Ace | verified | Rest-DON payment grants immediate Rush; attack power reduction and expiry; separate payment and target declines |
| ST30-008 | Marco | verified | Actual Blocker K.O., exact-power discard and same physical rested replay; revival decline |
| ST30-009 | LittleOars Jr. | verified | Opponent removal replacement trashes source, returns attached DON then draws; saved K.O./bounce/deck choices, source-plus-teammate removal, last-card defeat, own-effect/battle and base-power boundaries |
| ST30-010 | Crocodile | verified | Only rested opposing targets freeze through next Refresh; actual Blocker and freeze decline |
| ST30-011 | Buggy | verified | Active-source rest replaces opposing K.O. and bottom-deck removal; rested-source, own-effect and battle exclusions; Blocker and decline |
| ST30-012 | Monkey.D.Luffy | verified | Paid immediate Rush and attack rest of opposing Blocker before blocking; decline prevents immediate attack |
| ST30-013 | Mr.2.Bon.Kurei(Bentham) | vanilla | Parameterized vanilla catalog invariant |
| ST30-014 | Mr.3(Galdino) | verified | Self-rest then distinct base6000 recipients with per-recipient DON choices: one/zero, one/one, two/one and two/two; saved allocation, active-DON exclusion, zero targets and decline |
| ST31-001 | Sanji | verified | Draw before cost-five Straw Hat play; excludes every Sanji; optional play and DON x2 Rush attack boundary |
| ST31-002 | Jinbe | verified | Draw then cost-one Straw Hat Character or Stage play; wrong trait and cost excluded; Blocker intercept and optional play |
| ST31-003 | Brook | verified | Distributed given-DON threshold; opponent-turn Blocker and power; live loss after donor removal; Blocker decline |
| ST31-004 | Monkey.D.Luffy | verified | On Play per-Straw-Hat debuff via amountFromMatchingCards (trait mutation killed); Rush threshold; self-count always >=1 |
| ST32-001 | Kin'emon | verified | Alternative Slash-Leader or active-DON rest cost; draw two then chosen discard; unavailable and declined payments |
| ST32-002 | Kouzuki Oden | verified | onPlay |

| ST32-003 | Dracule Mihawk | verified | Slash Leader gates cost-five Perona-or-Slash play; own-turn rest by attack or cost draws/discards; opponent-turn exclusion |
| ST32-004 | Silvers Rayleigh | verified | Optional opposing cost-two rest up to two; Slash Leader grants Rush Character only; Leader attacks excluded |
| ST32-005 | Roronoa Zoro | verified | Unconditional Rush Character with first-turn and Leader-target restrictions; Slash Leader gates optional cost-two rest |
| ST33-001 | Koby | verified | Optional chosen hand cost before draw; unavailable cost; Blocker intercept and decline |
| ST33-002 | Sakazuki | verified | Attack hand cost before opponent six-card threshold and opponent-owned discard; On KO exact Navy cost-four play and decline |
| ST33-003 | Smoker | verified | Chosen hand cost; opposing cost-two bottom-deck selection zero to two; opponent order and saved continuation |
| ST33-004 | Borsalino | verified | Own or opposing effect hand-trash history gives hand-only cost reduction; saved paid play and turn expiry; Blocker |
| ST33-005 | Monkey.D.Garp | verified | Navy Leader gate; exact blue Navy and power-8000 hand-play limits; all named Garp copies excluded; zero play |
| ST34-001 | Charlotte Katakuri | verified | Own-turn DON-return reaction with independent per-copy turn limits; exact two-copy FAQ; rested-DON count; On KO power-8000 play |
| ST34-002 | Charlotte Cracker | verified | Big Mom Leader gate; independent zero-to-one rested DON and cost-two KO; wrong Leader and declined target |
| ST34-003 | Charlotte Brulee | verified | Top-three exact Big Mom Character/Event search; private choices, saved bottom order and decline |
| ST34-004 | Charlotte Linlin | verified | Ordered DON-four and chosen hand costs; independent Life addition and opposing base-power zero; additive power, concurrent base maximum and expiry |
| ST34-005 | Baron Tamago & Pekoms | verified | Optional attack DON-return cost; opposing base-power rather than current-power KO threshold; decline and zero selection |
| ST35-001 | Hack | verified | Blocker intercept and decline; On Play optional KO uses base power rather than current power |
| ST35-002 | Lindbergh | verified | Optional opposing Character minus-3000 power; other targets unchanged and turn-end expiry |
| ST35-003 | Karasu | verified | Optional deck-two payment before opponent seven-card hand check; opponent-owned discard; insufficient deck and last-card defeat |
| ST35-004 | Koala | verified | Field-only cost eight; Blocker; rested DON to Leader and independent exact Revolutionary Army power-4000 Character play from hand/trash |
| ST35-005 | Bartholomew Kuma | verified | Field-only cost eight; independent rested DON and exact Revolutionary Army power-4000 Character play from hand/trash |
| ST36-001 | Cavendish | verified | Battle KO optional chosen hand payment then top-deck Life addition; payment and Life-add declines |
| ST36-002 | Killer | verified | Own-turn Kid Pirates Leader Life addition; wrong Leader; physical Life Trigger play at three Life but not four |
| ST36-003 | Scratchmen Apoo | verified | Life Trigger draw independent of Supernovas Leader gate; base-7000 preserves additive battle power and expires at turn end |
| ST36-004 | Bartolomeo | verified | Exact Supernovas Character/Event hand cost before draw two; wrong trait, unavailable and declined payment |
| ST36-005 | Eustass"Captain"Kid | verified | Top-or-bottom Life orientation costs and saved physical selection; named Kid redirect base-power boundary; separate Main and reaction turn limits |

## Progress

- Canonical characters: 2215.
- Verified rows: 1930.
- Structured pending rows: 0.
- Printed but unstructured rows: 0.
- Canonical vanilla rows: 285.

Counts reflect current row labels, not a new semantic audit. See the October 7,
2026 audit checkpoint in `card-behavior-inventory.md` for confirmed corrections
and remaining limits.
