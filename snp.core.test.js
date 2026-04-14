import { describe, it, expect } from 'vitest';
import {
	shops, bounds, types, levels, skills,
	computesuperpower, computeSourceTotals, computeTargetTotals, validateUrlData
} from './snp.core.js';

// ============================================================
// Default data set (matches snp.js hardcoded defaults — user's v1.3 data)
// ============================================================
const defaultSource = [
	{id:47, level:4, src:[{id:15, amount:80},{id:28, amount:120},{id:45, amount:160}]},
	{id:49, level:7, src:[{id:14, amount:120},{id:20, amount:80},{id:29, amount:80},{id:38, amount:320},{id:39, amount:80},{id:45, amount:120},{id:55, amount:40}]},
	{id:50, level:7, src:[{id:14, amount:400},{id:28, amount:40},{id:31, amount:360},{id:53, amount:40}]},
	{id:46, level:9, src:[{id:20, amount:400},{id:21, amount:480},{id:35, amount:120},{id:37, amount:160},{id:39, amount:160},{id:53, amount:40}]},
	{id:9, level:12, src:[{id:11, amount:40},{id:21, amount:120},{id:28, amount:80},{id:29, amount:80},{id:32, amount:240}]},
	{id:11, level:12, src:[{id:28, amount:80},{id:31, amount:480}]}
];
const defaultFrags = [{id:0, amount:680},{id:28, amount:120},{id:29, amount:280},{id:35, amount:280},{id:36, amount:80},{id:47, amount:40}];
const defaultFragp = 3031;
const defaultFragb = 8650;
const defaultTarget = [{id:47, level:6},{id:49, level:7},{id:50, level:9},{id:46, level:10},{id:9, level:12},{id:11, level:12}];


// ============================================================
// 1. Data Integrity Tests
// ============================================================
describe('Data Integrity', () => {
	it('has correct number of shops', () => {
		expect(shops).toHaveLength(5);
		expect(shops[0]).toBe("道蘊商店");
		expect(shops[4]).toBe("百族寶箱");
	});

	it('has correct number of bounds', () => {
		expect(bounds).toHaveLength(5);
		expect(bounds[0]).toBe("人界");
		expect(bounds[1]).toBe("返虛");
		expect(bounds[2]).toBe("煞海");
		expect(bounds[3]).toBe("合體");
		expect(bounds[4]).toBe("蠱族");
	});

	it('has correct number of types', () => {
		expect(types).toHaveLength(4);
	});

	it('has 5 level tiers', () => {
		expect(levels).toHaveLength(5);
		expect(levels[0]).toHaveLength(13); // 人界: 無~天3
		expect(levels[1]).toHaveLength(13); // 返虛: 無~天3
		expect(levels[2]).toHaveLength(13); // 煞海: 無~天3
		expect(levels[3]).toHaveLength(15); // 合體: 無~天5
		expect(levels[4]).toHaveLength(13); // 蠱族: 無~天3
	});

	it('level 0 is always empty across all tiers', () => {
		for (let i = 0; i < levels.length; i++) {
			expect(levels[i][0]).toEqual({n:"無", f:0, g:0, p:0, b:0});
		}
	});

	it('level costs are monotonically non-decreasing within each tier', () => {
		for (let tier = 0; tier < levels.length; tier++) {
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

	it('has exactly 56 skills', () => {
		expect(skills).toHaveLength(56);
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

	it('返虛 skills (bound=1) use shops 0-3', () => {
		skills.filter(s => s.bound === 1).forEach(sk => {
			expect(sk.shop).toBeLessThanOrEqual(3);
		});
	});

	it('煞海 skills (bound=2) use shop 4', () => {
		skills.filter(s => s.bound === 2).forEach(sk => {
			expect(sk.shop).toBe(4);
		});
	});

	it('合體 skills (bound=3) use shops 0-3', () => {
		skills.filter(s => s.bound === 3).forEach(sk => {
			expect(sk.shop).toBeLessThanOrEqual(3);
		});
	});

	it('蠱族 skills (bound=4) use shop 4', () => {
		skills.filter(s => s.bound === 4).forEach(sk => {
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
		// All source skills are bound=3(合體) except id9(bound=0) and id11(bound=0)
		// id47(破月): bound=3, lv4(玄1): f=80, f-40=40
		// id49(嵐霆): bound=3, lv7(地1): f=360, f-40=320
		// id50(鬥辰): bound=3, lv7(地1): f=360, f-40=320
		// id46(鎮岳): bound=3, lv9(地3): f=640, f-40=600
		// id9(掠影): bound=0, lv12(天3): f=720, f-40=680
		// id11(摧巒): bound=0, lv12(天3): f=720, f-40=680
		// totalBody = 40+320+320+600+680+680 = 2640
		expect(result.totalBody).toBe(2640);
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
		// id47(破月): bound=3, lv6(玄3): f=240, f-40=200
		// id49(嵐霆): bound=3, lv7(地1): f=360, f-40=320
		// id50(鬥辰): bound=3, lv9(地3): f=640, f-40=600
		// id46(鎮岳): bound=3, lv10(天1): f=840, f-40=800
		// id9(掠影): bound=0, lv12(天3): f=720, f-40=680
		// id11(摧巒): bound=0, lv12(天3): f=720, f-40=680
		// totalBody = 200+320+600+800+680+680 = 3280
		expect(result.totalBody).toBe(3280);
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
		expect(result.missingOther).toBeGreaterThan(0);
		expect(result.missingPurple).toBeGreaterThan(0);
		expect(result.missingBlue).toBeGreaterThan(0);
	});

	it('uses same-shop conversion when possible', () => {
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
		const shopConversions = result.conversions.filter(c => c.toId === 12);
		expect(shopConversions.length).toBeGreaterThan(0);
		shopConversions.forEach(c => {
			expect(skills[c.fromId].shop).toBe(0);
		});
	});

	it('handles 合體 skills (bound=3) correctly', () => {
		const source = [
			{id:40, level:5, src:[]},  // 陽隕 shop:0, bound:3, lv5(玄2): f=160, f-40=120
			{id:44, level:5, src:[]},  // 玄峰 shop:0, bound:3
			{id:0, level:1, src:[]},
			{id:1, level:1, src:[]},
			{id:2, level:1, src:[]},
			{id:3, level:1, src:[]},
		];
		const target = [
			{id:48, level:5}, // 天怒 shop:0, bound:3 -> needs body from same shop
			{id:44, level:1},
			{id:0, level:1},
			{id:1, level:1},
			{id:2, level:1},
			{id:3, level:1},
		];
		const result = computesuperpower(source, [], 0, 0, target);
		// 陽隕 and 玄峰 are same shop as 天怒, so conversion should work
		if (result.conversions.length > 0) {
			result.conversions.forEach(c => {
				if (c.toId === 48) {
					expect(skills[c.fromId].shop).toBe(0);
				}
			});
		}
	});

	it('handles 蠱族 skills (bound=4, shop=4) correctly', () => {
		const source = [
			{id:52, level:3, src:[]},  // 幽蝕 shop:4, bound:4
			{id:53, level:3, src:[]},  // 驚蟬 shop:4, bound:4
			{id:54, level:1, src:[]},
			{id:55, level:1, src:[]},
			{id:0, level:1, src:[]},
			{id:1, level:1, src:[]},
		];
		const target = [
			{id:54, level:3},  // 蛻蛇 shop:4, bound:4 -> needs body from same shop
			{id:55, level:1},
			{id:52, level:1},
			{id:53, level:1},
			{id:0, level:1},
			{id:1, level:1},
		];
		const result = computesuperpower(source, [], 0, 0, target);
		if (result.conversions.length > 0) {
			result.conversions.forEach(c => {
				if (c.toId === 54) {
					expect(skills[c.fromId].shop).toBe(4);
				}
			});
		}
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
		if (result.conversions.length > 0) {
			result.conversions.forEach(c => {
				if (c.toId === 38) {
					expect(skills[c.fromId].shop).toBe(4);
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

	it('accepts 合體 skill IDs (40-51)', () => {
		const d = {
			source: [
				{id:40, level:1, src:[]},
				{id:41, level:1, src:[]},
				{id:42, level:1, src:[]},
				{id:43, level:1, src:[]},
				{id:44, level:1, src:[]},
				{id:45, level:1, src:[]},
			],
			frags: [],
			fragp: 0,
			fragb: 0,
			target: [
				{id:46, level:1},
				{id:47, level:1},
				{id:48, level:1},
				{id:49, level:1},
				{id:50, level:1},
				{id:51, level:1},
			]
		};
		expect(validateUrlData(d)).toBe(true);
	});

	it('accepts 蠱族 skill IDs (52-55)', () => {
		const d = {
			source: [
				{id:52, level:1, src:[]},
				{id:53, level:1, src:[]},
				{id:54, level:1, src:[]},
				{id:55, level:1, src:[]},
				{id:0, level:1, src:[]},
				{id:1, level:1, src:[]},
			],
			frags: [],
			fragp: 0,
			fragb: 0,
			target: [
				{id:52, level:1},
				{id:53, level:1},
				{id:54, level:1},
				{id:55, level:1},
				{id:0, level:1},
				{id:1, level:1},
			]
		};
		expect(validateUrlData(d)).toBe(true);
	});

	it('accepts valid keep array', () => {
		const d = {
			source: defaultSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget,
			keep: [47, 9]
		};
		expect(validateUrlData(d)).toBe(true);
	});

	it('accepts empty keep array', () => {
		const d = {
			source: defaultSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget,
			keep: []
		};
		expect(validateUrlData(d)).toBe(true);
	});

	it('accepts data without keep field (optional)', () => {
		const d = {
			source: defaultSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget
		};
		expect(validateUrlData(d)).toBe(true);
	});

	it('rejects keep with out-of-range skill ID', () => {
		const d = {
			source: defaultSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget,
			keep: [999]
		};
		expect(validateUrlData(d)).toBe(false);
	});

	it('rejects keep with negative skill ID', () => {
		const d = {
			source: defaultSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget,
			keep: [-1]
		};
		expect(validateUrlData(d)).toBe(false);
	});

	it('rejects keep with non-number entries', () => {
		const d = {
			source: defaultSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget,
			keep: ["abc"]
		};
		expect(validateUrlData(d)).toBe(false);
	});

	it('rejects keep as non-array', () => {
		const d = {
			source: defaultSource,
			frags: defaultFrags,
			fragp: defaultFragp,
			fragb: defaultFragb,
			target: defaultTarget,
			keep: "not-an-array"
		};
		expect(validateUrlData(d)).toBe(false);
	});
});


// ============================================================
// 6. computesuperpower with keep (Keep Skills Feature)
// ============================================================
describe('computesuperpower with keep', () => {
	it('kept skill body fragments are not converted in same-shop conversion', () => {
		// Setup: 丹朱(id:0, shop:0) and 風捲(id:4, shop:0) both have body fragments
		// Target needs 龜蛇(id:12, shop:0) body fragments via same-shop conversion
		// Keep 丹朱(id:0) — its body fragments should NOT be used for conversion
		const source = [
			{id:0, level:5, src:[]},  // 丹朱 shop:0, lv5: f=200, body=160
			{id:4, level:5, src:[]},  // 風捲 shop:0, lv5: f=200, body=160
			{id:1, level:1, src:[]},
			{id:2, level:1, src:[]},
			{id:3, level:1, src:[]},
			{id:5, level:1, src:[]},
		];
		const target = [
			{id:12, level:5}, // 龜蛇 shop:0, needs 160 body
			{id:4, level:1},
			{id:1, level:1},
			{id:2, level:1},
			{id:3, level:1},
			{id:5, level:1},
		];

		// Without keep: both 丹朱 and 風捲 can be used for conversion
		const resultNoKeep = computesuperpower(source, [], 0, 0, target);
		// With keep=[0]: only 風捲 can be used for conversion
		const resultWithKeep = computesuperpower(source, [], 0, 0, target, [0]);

		// 丹朱 should NOT appear as conversion source when kept
		const keptConversions = resultWithKeep.conversions.filter(c => c.fromId === 0);
		expect(keptConversions).toHaveLength(0);

		// 風捲 should still be used for conversion
		const nonKeptConversions = resultWithKeep.conversions.filter(c => c.fromId === 4);
		expect(nonKeptConversions.length).toBeGreaterThan(0);
	});

	it('kept skill fragments still count towards generic (gold) allocation', () => {
		// Keep a skill — its body fragments should still be available for Phase 4 (generic frag allocation)
		const source = [
			{id:0, level:5, src:[]},  // 丹朱 shop:0, body=160
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

		// With keep=[0], 丹朱 body=160 should still be in remainderGold
		const result = computesuperpower(source, [], 0, 0, target, [0]);
		expect(result.remainderGold).toBeGreaterThanOrEqual(160);
	});

	it('empty keep array behaves same as no keep', () => {
		const resultNoKeep = computesuperpower(defaultSource, defaultFrags, defaultFragp, defaultFragb, defaultTarget);
		const resultEmptyKeep = computesuperpower(defaultSource, defaultFrags, defaultFragp, defaultFragb, defaultTarget, []);

		expect(resultEmptyKeep.totalConversions).toBe(resultNoKeep.totalConversions);
		expect(resultEmptyKeep.missingOther).toBe(resultNoKeep.missingOther);
		expect(resultEmptyKeep.remainderGold).toBe(resultNoKeep.remainderGold);
	});

	it('undefined keep behaves same as no keep', () => {
		const resultNoKeep = computesuperpower(defaultSource, defaultFrags, defaultFragp, defaultFragb, defaultTarget);
		const resultUndef = computesuperpower(defaultSource, defaultFrags, defaultFragp, defaultFragb, defaultTarget, undefined);

		expect(resultUndef.totalConversions).toBe(resultNoKeep.totalConversions);
		expect(resultUndef.remainderGold).toBe(resultNoKeep.remainderGold);
	});
});
