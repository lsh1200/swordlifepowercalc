import { describe, it, expect } from 'vitest';
import {
	shops, bounds, types, levels, skills,
	computesuperpower, computeSourceTotals, computeTargetTotals, validateUrlData
} from './snp.core.js';

// ============================================================
// Default data set (matches snp.js hardcoded defaults)
// ============================================================
const defaultSource = [
	{id:29, level:5, src:[{id:18, amount:80},{id:22, amount:120},{id:31, amount:40},{id:34, amount:40},{id:37, amount:40}]},
	{id:26, level:5, src:[{id:8, amount:40},{id:10, amount:120},{id:18, amount:80},{id:20, amount:40},{id:39, amount:40}]},
	{id:28, level:7, src:[{id:0, amount:80},{id:8, amount:40},{id:10, amount:240},{id:15, amount:40},{id:19, amount:40},{id:20, amount:40},{id:21, amount:40},{id:30, amount:40},{id:31, amount:40}]},
	{id:1, level:7, src:[{id:23, amount:40},{id:36, amount:40},{id:37, amount:40}]},
	{id:9, level:10, src:[{id:23, amount:40},{id:26, amount:80},{id:28, amount:200}]},
	{id:11, level:12, src:[{id:2, amount:40},{id:19, amount:160},{id:27, amount:40},{id:31, amount:80},{id:37, amount:80},{id:38, amount:40},{id:39, amount:120}]}
];
const defaultFrags = [{id:8, amount:160},{id:9, amount:40},{id:26, amount:40},{id:29, amount:80},{id:35, amount:40}];
const defaultFragp = 110;
const defaultFragb = 445;
const defaultTarget = [{id:26, level:6},{id:34, level:6},{id:20, level:10},{id:1, level:6},{id:32, level:6},{id:35, level:7}];


// ============================================================
// 1. Data Integrity Tests
// ============================================================
describe('Data Integrity', () => {
	it('has correct number of shops', () => {
		expect(shops).toHaveLength(5);
		expect(shops[0]).toBe("道蘊商店");
		expect(shops[4]).toBe("煞海寶箱");
	});

	it('has correct number of bounds', () => {
		expect(bounds).toHaveLength(3);
	});

	it('has correct number of types', () => {
		expect(types).toHaveLength(4);
	});

	it('has 3 level tiers with 13 levels each', () => {
		expect(levels).toHaveLength(3);
		for (let i = 0; i < 3; i++) {
			expect(levels[i]).toHaveLength(13);
		}
	});

	it('level 0 is always empty across all tiers', () => {
		for (let i = 0; i < 3; i++) {
			expect(levels[i][0]).toEqual({n:"無", f:0, g:0, p:0, b:0});
		}
	});

	it('level costs are monotonically non-decreasing within each tier', () => {
		for (let tier = 0; tier < 3; tier++) {
			for (let lv = 1; lv < levels[tier].length; lv++) {
				const curr = levels[tier][lv];
				const prev = levels[tier][lv - 1];
				expect(curr.f).toBeGreaterThanOrEqual(prev.f);
				expect(curr.g).toBeGreaterThanOrEqual(prev.g);
				expect(curr.p).toBeGreaterThanOrEqual(prev.p);
				expect(curr.b).toBeGreaterThanOrEqual(prev.b);
			}
		}
	});

	it('has exactly 40 skills', () => {
		expect(skills).toHaveLength(40);
	});

	it('skill IDs match array indices', () => {
		skills.forEach((sk, i) => {
			expect(sk.id).toBe(i);
		});
	});

	it('all skills reference valid shop, bound, and type indices', () => {
		skills.forEach((sk) => {
			expect(sk.shop).toBeGreaterThanOrEqual(0);
			expect(sk.shop).toBeLessThan(shops.length);
			expect(sk.bound).toBeGreaterThanOrEqual(0);
			expect(sk.bound).toBeLessThan(bounds.length);
			expect(sk.type).toBeGreaterThanOrEqual(0);
			expect(sk.type).toBeLessThan(types.length);
		});
	});

	it('human realm skills (bound=0) use shops 0-3', () => {
		skills.filter(s => s.bound === 0).forEach(sk => {
			expect(sk.shop).toBeLessThanOrEqual(3);
		});
	});

	it('demon realm skills (bound=1) use shops 0-3', () => {
		skills.filter(s => s.bound === 1).forEach(sk => {
			expect(sk.shop).toBeLessThanOrEqual(3);
		});
	});

	it('evil sea skills (bound=2) use shop 4', () => {
		skills.filter(s => s.bound === 2).forEach(sk => {
			expect(sk.shop).toBe(4);
		});
	});
});


// ============================================================
// 2. computeSourceTotals Tests
// ============================================================
describe('computeSourceTotals', () => {
	it('computes totals for default data set', () => {
		const result = computeSourceTotals(defaultSource, defaultFrags, defaultFragp, defaultFragb);
		// Manually verify:
		// Source skills: id29(lv5)=120f, id26(lv5)=120f, id28(lv7)=280f, id1(lv7)=240f, id9(lv10)=440f, id11(lv12)=680f
		// All are bound=1 except id1(bound=0), id9(bound=0), id11(bound=0)
		// id29: bound=1, lv5 -> f=160, f-40=120
		// id26: bound=1, lv5 -> f=160, f-40=120
		// id28: bound=1, lv7 -> f=320, f-40=280
		// id1: bound=0, lv7 -> f=280, f-40=240
		// id9: bound=0, lv10 -> f=480, f-40=440
		// id11: bound=0, lv12 -> f=720, f-40=680
		// totalBody = 120+120+280+240+440+680 = 1880
		expect(result.totalBody).toBe(1880);
		expect(result.totalPurple).toBeGreaterThan(0);
		expect(result.totalBlue).toBeGreaterThan(0);
	});

	it('includes fragp and fragb in totals', () => {
		const result = computeSourceTotals(defaultSource, defaultFrags, 100, 200);
		const resultZero = computeSourceTotals(defaultSource, defaultFrags, 0, 0);
		expect(result.totalPurple).toBe(resultZero.totalPurple + 100);
		expect(result.totalBlue).toBe(resultZero.totalBlue + 200);
	});

	it('counts all loose fragment amounts in totalOther', () => {
		const simpleFrags = [{id:0, amount:40}, {id:1, amount:80}];
		const minSource = [
			{id:0, level:1, src:[]},
			{id:1, level:1, src:[]},
			{id:2, level:1, src:[]},
			{id:3, level:1, src:[]},
			{id:4, level:1, src:[]},
			{id:5, level:1, src:[]},
		];
		const result = computeSourceTotals(minSource, simpleFrags, 0, 0);
		expect(result.totalOther).toBe(120); // 40+80
	});
});


// ============================================================
// 3. computeTargetTotals Tests
// ============================================================
describe('computeTargetTotals', () => {
	it('computes totals for default target set', () => {
		const result = computeTargetTotals(defaultTarget);
		// id26(lv6, bound=1): f=240, g=440, p=800, b=1900
		// id34(lv6, bound=1): f=240, g=440, p=800, b=1900
		// id20(lv10, bound=0): f=480, g=320, p=820, b=2060
		// id1(lv6, bound=0): f=240, g=80, p=240, b=620
		// id32(lv6, bound=1): f=240, g=440, p=800, b=1900
		// id35(lv7, bound=1): f=320, g=600, p=1150, b=2800
		// totalBody = (240-40)+(240-40)+(480-40)+(240-40)+(240-40)+(320-40) = 200+200+440+200+200+280 = 1520
		expect(result.totalBody).toBe(1520);
	});

	it('returns zero totals for level-1 targets', () => {
		const minTarget = Array.from({length: 6}, (_, i) => ({id: i, level: 1}));
		const result = computeTargetTotals(minTarget);
		// All level 1 in bound=0: f=40, so f-40=0 for each
		expect(result.totalBody).toBe(0);
	});
});


// ============================================================
// 4. computesuperpower Tests (Core Calculation)
// ============================================================
describe('computesuperpower', () => {
	it('returns structured result with all expected fields', () => {
		const result = computesuperpower(defaultSource, defaultFrags, defaultFragp, defaultFragb, defaultTarget);
		expect(result).toHaveProperty('conversions');
		expect(result).toHaveProperty('totalConversions');
		expect(result).toHaveProperty('deficits');
		expect(result).toHaveProperty('missingOther');
		expect(result).toHaveProperty('missingPurple');
		expect(result).toHaveProperty('missingBlue');
		expect(result).toHaveProperty('remainderGold');
		expect(result).toHaveProperty('remainderPurple');
		expect(result).toHaveProperty('remainderBlue');
		expect(result).toHaveProperty('remainderDetails');
	});

	it('produces conversions for the default data set', () => {
		const result = computesuperpower(defaultSource, defaultFrags, defaultFragp, defaultFragb, defaultTarget);
		expect(result.conversions.length).toBeGreaterThan(0);
		expect(result.totalConversions).toBeGreaterThan(0);
	});

	it('conversion amounts are always multiples of 40', () => {
		const result = computesuperpower(defaultSource, defaultFrags, defaultFragp, defaultFragb, defaultTarget);
		result.conversions.forEach(c => {
			expect(c.amount % 40).toBe(0);
		});
	});

	it('conversions only happen between skills in the same shop', () => {
		const result = computesuperpower(defaultSource, defaultFrags, defaultFragp, defaultFragb, defaultTarget);
		result.conversions.forEach(c => {
			expect(skills[c.fromId].shop).toBe(skills[c.toId].shop);
		});
	});

	it('does not convert a skill to itself', () => {
		const result = computesuperpower(defaultSource, defaultFrags, defaultFragp, defaultFragb, defaultTarget);
		result.conversions.forEach(c => {
			expect(c.fromId).not.toBe(c.toId);
		});
	});

	it('deficit amounts are non-negative', () => {
		const result = computesuperpower(defaultSource, defaultFrags, defaultFragp, defaultFragb, defaultTarget);
		expect(result.missingOther).toBeGreaterThanOrEqual(0);
		expect(result.missingPurple).toBeGreaterThanOrEqual(0);
		expect(result.missingBlue).toBeGreaterThanOrEqual(0);
		result.deficits.forEach(d => {
			expect(d.amount).toBeGreaterThan(0);
		});
	});

	it('remainder amounts are non-negative', () => {
		const result = computesuperpower(defaultSource, defaultFrags, defaultFragp, defaultFragb, defaultTarget);
		expect(result.remainderGold).toBeGreaterThanOrEqual(0);
		expect(result.remainderPurple).toBeGreaterThanOrEqual(0);
		expect(result.remainderBlue).toBeGreaterThanOrEqual(0);
	});

	it('handles trivial case: source equals target (no work needed)', () => {
		const source = [
			{id:0, level:1, src:[]},
			{id:1, level:1, src:[]},
			{id:2, level:1, src:[]},
			{id:3, level:1, src:[]},
			{id:4, level:1, src:[]},
			{id:5, level:1, src:[]},
		];
		const target = [
			{id:0, level:1},
			{id:1, level:1},
			{id:2, level:1},
			{id:3, level:1},
			{id:4, level:1},
			{id:5, level:1},
		];
		const result = computesuperpower(source, [], 0, 0, target);
		expect(result.totalConversions).toBe(0);
		expect(result.deficits).toHaveLength(0);
		expect(result.missingOther).toBe(0);
		expect(result.missingPurple).toBe(0);
		expect(result.missingBlue).toBe(0);
	});

	it('detects deficit when target requires more than available', () => {
		const source = [
			{id:0, level:1, src:[]},
			{id:1, level:1, src:[]},
			{id:2, level:1, src:[]},
			{id:3, level:1, src:[]},
			{id:4, level:1, src:[]},
			{id:5, level:1, src:[]},
		];
		const target = [
			{id:0, level:12}, // 天2 in bound=0: f=600, g=440, p=1120, b=2810
			{id:1, level:1},
			{id:2, level:1},
			{id:3, level:1},
			{id:4, level:1},
			{id:5, level:1},
		];
		const result = computesuperpower(source, [], 0, 0, target);
		// Source only has level 1 skills (f=40 each, f-40=0 body fragments)
		// Target id:0 level 12 needs f-40=560 body and g=440 other
		// With zero fragments and zero scrolls, there will be large deficits
		expect(result.missingOther).toBeGreaterThan(0);
		expect(result.missingPurple).toBeGreaterThan(0);
		expect(result.missingBlue).toBeGreaterThan(0);
	});

	it('uses same-shop conversion when possible', () => {
		// Give source lots of shop-0 fragments, target needs shop-0 skill
		const source = [
			{id:0, level:5, src:[]},  // 丹朱 shop:0, bound:0, lv5: f=200, f-40=160
			{id:4, level:5, src:[]},  // 風捲 shop:0, bound:0, lv5: f=200, f-40=160
			{id:1, level:1, src:[]},
			{id:2, level:1, src:[]},
			{id:3, level:1, src:[]},
			{id:5, level:1, src:[]},
		];
		const target = [
			{id:12, level:5}, // 龜蛇 shop:0, bound:0, lv5: f=200, needs 160 body
			{id:4, level:1},
			{id:1, level:1},
			{id:2, level:1},
			{id:3, level:1},
			{id:5, level:1},
		];
		const result = computesuperpower(source, [], 0, 0, target);
		// id:0(丹朱, shop:0) has 160 body frags, id:4(風捲, shop:0) has 160
		// id:12(龜蛇, shop:0) needs 160 body -> should convert from shop-0 skills
		const shopConversions = result.conversions.filter(c => c.toId === 12);
		expect(shopConversions.length).toBeGreaterThan(0);
		shopConversions.forEach(c => {
			expect(skills[c.fromId].shop).toBe(0);
		});
	});

	it('produces same conversion count for default data (snapshot test)', () => {
		const result = computesuperpower(defaultSource, defaultFrags, defaultFragp, defaultFragb, defaultTarget);
		// Capture the exact totalConversions from the original algorithm
		// This acts as a regression guard
		expect(typeof result.totalConversions).toBe('number');
		expect(result.totalConversions).toBeGreaterThan(0);
		// Snapshot the exact value for regression detection
		expect(result.totalConversions).toMatchInlineSnapshot(`24`);
	});

	it('handles evil sea skills (bound=2, shop=4) correctly', () => {
		const source = [
			{id:36, level:3, src:[]},  // 烈雨 shop:4, bound:2, lv3: f=40, g=240
			{id:37, level:3, src:[]},  // 冥火 shop:4, bound:2
			{id:38, level:1, src:[]},
			{id:39, level:1, src:[]},
			{id:0, level:1, src:[]},
			{id:1, level:1, src:[]},
		];
		const target = [
			{id:38, level:3},  // 業蓮 shop:4, bound:2 -> needs body from same shop
			{id:39, level:1},
			{id:36, level:1},
			{id:37, level:1},
			{id:0, level:1},
			{id:1, level:1},
		];
		const result = computesuperpower(source, [], 0, 0, target);
		// 烈雨 and 冥火 are same shop as 業蓮, so conversion should be possible
		if (result.conversions.length > 0) {
			result.conversions.forEach(c => {
				if (c.toId === 38) {
					expect(skills[c.fromId].shop).toBe(4); // same shop
				}
			});
		}
	});
});


// ============================================================
// 5. validateUrlData Tests
// ============================================================
describe('validateUrlData', () => {
	it('accepts valid default data', () => {
		const d = {
			source: defaultSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget
		};
		expect(validateUrlData(d)).toBe(true);
	});

	it('rejects null/undefined', () => {
		expect(validateUrlData(null)).toBe(false);
		expect(validateUrlData(undefined)).toBe(false);
	});

	it('rejects non-object', () => {
		expect(validateUrlData("string")).toBe(false);
		expect(validateUrlData(42)).toBe(false);
	});

	it('rejects missing fields', () => {
		expect(validateUrlData({ source: [] })).toBe(false);
		expect(validateUrlData({ source: [], frags: [] })).toBe(false);
	});

	it('rejects wrong source length', () => {
		const d = {
			source: defaultSource.slice(0, 3),
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget
		};
		expect(validateUrlData(d)).toBe(false);
	});

	it('rejects wrong target length', () => {
		const d = {
			source: defaultSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget.slice(0, 2)
		};
		expect(validateUrlData(d)).toBe(false);
	});

	it('rejects negative fragp', () => {
		const d = {
			source: defaultSource,
			frags: defaultFrags,
			fragp: -10,
			fragb: defaultFragb,
			target: defaultTarget
		};
		expect(validateUrlData(d)).toBe(false);
	});

	it('rejects out-of-range skill ID in source', () => {
		const badSource = JSON.parse(JSON.stringify(defaultSource));
		badSource[0].id = 999;
		const d = {
			source: badSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget
		};
		expect(validateUrlData(d)).toBe(false);
	});

	it('rejects negative skill ID', () => {
		const badSource = JSON.parse(JSON.stringify(defaultSource));
		badSource[0].id = -1;
		const d = {
			source: badSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget
		};
		expect(validateUrlData(d)).toBe(false);
	});

	it('rejects out-of-range level in source', () => {
		const badSource = JSON.parse(JSON.stringify(defaultSource));
		badSource[0].level = 99;
		const d = {
			source: badSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget
		};
		expect(validateUrlData(d)).toBe(false);
	});

	it('rejects non-numeric fragment amount', () => {
		const badFrags = [{id: 0, amount: "hacked"}];
		const d = {
			source: defaultSource,
			frags: badFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget
		};
		expect(validateUrlData(d)).toBe(false);
	});

	it('rejects zero fragment amount', () => {
		const badFrags = [{id: 0, amount: 0}];
		const d = {
			source: defaultSource,
			frags: badFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget
		};
		expect(validateUrlData(d)).toBe(false);
	});

	it('rejects target level 0', () => {
		const badTarget = JSON.parse(JSON.stringify(defaultTarget));
		badTarget[0].level = 0;
		const d = {
			source: defaultSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: badTarget
		};
		expect(validateUrlData(d)).toBe(false);
	});

	it('accepts empty frags array', () => {
		const d = {
			source: defaultSource,
			frags: [],
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget
		};
		expect(validateUrlData(d)).toBe(true);
	});

	it('accepts fragp and fragb of zero', () => {
		const d = {
			source: defaultSource,
			frags: defaultFrags,
			fragp: 0,
			fragb: 0,
			target: defaultTarget
		};
		expect(validateUrlData(d)).toBe(true);
	});
});
