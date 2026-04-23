# Graph Report - .  (2026-04-23)

## Corpus Check
- 25 files · ~225,494 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 123 nodes · 188 edges · 11 communities detected
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_HTML Shell & Vendor Libs|HTML Shell & Vendor Libs]]
- [[_COMMUNITY_Deduction Engine & Dev Notes|Deduction Engine & Dev Notes]]
- [[_COMMUNITY_UI Controls & Edit Flow|UI Controls & Edit Flow]]
- [[_COMMUNITY_Calculator Orchestration (snp.js main)|Calculator Orchestration (snp.js main)]]
- [[_COMMUNITY_Character Animation Pipeline|Character Animation Pipeline]]
- [[_COMMUNITY_Design Research (Gigantic Teardown)|Design Research (Gigantic Teardown)]]
- [[_COMMUNITY_SourceLevel Input Controls|Source/Level Input Controls]]
- [[_COMMUNITY_Selectors & Target Level UI|Selectors & Target Level UI]]
- [[_COMMUNITY_Config Code Encoding & Share|Config Code Encoding & Share]]
- [[_COMMUNITY_Config Code Decoding (versioned)|Config Code Decoding (versioned)]]
- [[_COMMUNITY_Type-to-Color Mapping|Type-to-Color Mapping]]

## God Nodes (most connected - your core abstractions)
1. `index.html (V2.0 entry)` - 10 edges
2. `loadCode()` - 9 edges
3. `updatedatadone()` - 7 edges
4. `skillColor()` - 7 edges
5. `main()` - 7 edges
6. `README V2.0 (XuanYu fork)` - 7 edges
7. `animate()` - 6 edges
8. `computesuperpower()` - 6 edges
9. `refreshspsrcbtn()` - 6 edges
10. `Character Live2D Animation Module` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Concept: Live2D-style character` --rationale_for--> `Character Live2D Animation Module`  [INFERRED]
  README.md → js/character-live2d.js
- `Task: validate inputs` --rationale_for--> `validateUrlData() schema guard`  [INFERRED]
  docs/memo/log.txt → js/snp.core.js
- `index.html (V2.0 entry)` --references--> `snp.js - UI Controller (IIFE)`  [INFERRED]
  index.html → js/snp.js
- `Task: URL/cookie storage mechanism` --rationale_for--> `encodeState() bitpacking + base62 config-code`  [INFERRED]
  docs/memo/log.txt → js/snp.js
- `Pending: remainder/deficit test cases` --rationale_for--> `snp.core.test.js (vitest, 66 tests)`  [INFERRED]
  docs/memo/log.txt → tests/snp.core.test.js

## Hyperedges (group relationships)
- **Deduction core: data + compute + validation** — snp_core_skills_data, snp_core_levels_data, snp_core_computesuperpower, snp_core_same_shop_conversion, snp_core_keep_set, snp_core_validate_url_data [EXTRACTED 0.95]
- **Config code + localStorage share/persist flow** — snp_js_encode_state, snp_js_decode_state, snp_js_share_code, snp_js_localstorage_persistence, readme_concept_config_code_sharing, readme_concept_autosave [INFERRED 0.85]
- **Live2D character rendering pipeline** — character_live2d_module, character_live2d_pixi_app, character_live2d_displacement_filter, character_live2d_eye_blink, character_live2d_animate, character_live2d_fit_sprite, readme_concept_live2d_character [EXTRACTED 0.90]

## Communities

### Community 0 - "HTML Shell & Vendor Libs"
Cohesion: 0.1
Nodes (25): Character Live2D Animation Module, Rationale: asset load failure falls through; calculator still works, index.html (V2.0 entry), Bootstrap 5.3.8 CDN, #charCanvas element, jQuery vendor, lz-string.min.js vendor, PixiJS 7.3.3 CDN script tag (+17 more)

### Community 1 - "Deduction Engine & Dev Notes"
Cohesion: 0.13
Nodes (22): tsum MutationObserver refit trigger, docs/memo/log.txt (dev roadmap checklist), Task: validate inputs, Task: URL/cookie storage mechanism, Pending: remainder/deficit test cases, bounds[] (5 realms), computeSourceTotals(), computeTargetTotals() (+14 more)

### Community 2 - "UI Controls & Edit Flow"
Cohesion: 0.16
Nodes (3): discardSource(), discardTarget(), refreshDirtyIndicators()

### Community 3 - "Calculator Orchestration (snp.js main)"
Cohesion: 0.28
Nodes (13): computesuperpower(), getStateObject(), isInt(), loadCode(), loadFromLocalStorage(), main(), refreshdata(), refreshkeepview() (+5 more)

### Community 4 - "Character Animation Pipeline"
Cohesion: 0.24
Nodes (11): animate(), Single-pass Displacement Filter, Per-eye Patch Blink System, fitSprite() responsive head anchor, fitSprite(), getSize(), PIXI Application (character canvas), placeEye() (+3 more)

### Community 5 - "Design Research (Gigantic Teardown)"
Cohesion: 0.22
Nodes (9): Build Plan for Calculator Redesign, Citation: GSAP 3.11.5 + ScrollTrigger, Citation: Webflow + Forwwward Studio, Decorative dot system (red blurred circles), Palette: cream/near-black/coral-red, Glassmorphism advantage-box pattern, Rationale: calculator is a tool, not marketing site, Gigantic Media Teardown research note (+1 more)

### Community 6 - "Source/Level Input Controls"
Cohesion: 0.33
Nodes (7): refresholdlevel(), refreshspsrcbtn(), slonchanged(), sponchanged(), srEdit(), sronminus(), sronplus()

### Community 7 - "Selectors & Target Level UI"
Cohesion: 0.4
Nodes (5): buildKeepSelector(), buildShopSelector(), refreshtargetlevel(), skillColor(), tponchanged()

### Community 8 - "Config Code Encoding & Share"
Cohesion: 0.5
Nodes (4): bitsToBase62(), encodeState(), generateCode(), showShareToast()

### Community 9 - "Config Code Decoding (versioned)"
Cohesion: 0.67
Nodes (4): base62ToBits(), decodeState(), decodeStateV0(), decodeStateV1()

### Community 11 - "Type-to-Color Mapping"
Cohesion: 1.0
Nodes (2): types[] (fire/sword/thunder/tribe), skillColor() type-to-css-class

## Knowledge Gaps
- **24 isolated node(s):** `PIXI Application (character canvas)`, `Per-eye Patch Blink System`, `tsum MutationObserver refit trigger`, `Rationale: Single filter pass on shared container`, `Rationale: mobile 50% vs desktop 65% head anchor` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Type-to-Color Mapping`** (2 nodes): `types[] (fire/sword/thunder/tribe)`, `skillColor() type-to-css-class`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `encodeState() bitpacking + base62 config-code` connect `HTML Shell & Vendor Libs` to `Deduction Engine & Dev Notes`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `Task: URL/cookie storage mechanism` connect `Deduction Engine & Dev Notes` to `HTML Shell & Vendor Libs`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `index.html (V2.0 entry)` (e.g. with `Character Live2D Animation Module` and `snp.js - UI Controller (IIFE)`) actually correct?**
  _`index.html (V2.0 entry)` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PIXI Application (character canvas)`, `Per-eye Patch Blink System`, `tsum MutationObserver refit trigger` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTML Shell & Vendor Libs` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Deduction Engine & Dev Notes` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._