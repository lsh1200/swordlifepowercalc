// Testable extraction of pure data and calculation logic from snp.js
// This file mirrors the exact data and algorithms so tests catch regressions.

const shops = ["道蘊商店", "論劍商店", "諸天商會", "宗門寶庫", "百族寶箱"];
const bounds = ["人界", "返虛", "煞海", "合體", "蠱族"];
const types = ["火", "劍", "雷", "百族"];

const levels = [
	[
		{n:"無" , f:0  , g:0  , p:0   , b:0   },
		{n:"1星", f:40 , g:0  , p:0   , b:0   },
		{n:"2星", f:80 , g:0  , p:0   , b:0   },
		{n:"3星", f:120, g:0  , p:30  , b:100 },
		{n:"玄1", f:160, g:0  , p:90  , b:250 },
		{n:"玄2", f:200, g:40 , p:150 , b:400 },
		{n:"玄3", f:240, g:80 , p:240 , b:620 },
		{n:"地1", f:280, g:120, p:330 , b:840 },
		{n:"地2", f:320, g:160, p:420 , b:1060},
		{n:"地3", f:400, g:240, p:620 , b:1560},
		{n:"天1", f:480, g:320, p:820 , b:2060},
		{n:"天2", f:600, g:440, p:1120, b:2810},
		{n:"天3", f:720, g:560, p:1420, b:3560}],
	[
		{n:"無" , f:0   , g:0   , p:0   , b:0    },
		{n:"1星", f:40  , g:0   , p:0   , b:0    },
		{n:"2星", f:40  , g:80  , p:100 , b:200  },
		{n:"3星", f:40  , g:160 , p:200 , b:400  },
		{n:"玄1", f:80  , g:240 , p:350 , b:750  },
		{n:"玄2", f:160 , g:320 , p:550 , b:1250 },
		{n:"玄3", f:240 , g:440 , p:800 , b:1900 },
		{n:"地1", f:320 , g:600 , p:1150, b:2800 },
		{n:"地2", f:440 , g:800 , p:1650, b:4000 },
		{n:"地3", f:600 , g:1040, p:2250, b:5500 },
		{n:"天1", f:800 , g:1360, p:2950, b:7300 },
		{n:"天2", f:1040, g:1760, p:3750, b:9400 },
		{n:"天3", f:1320, g:2240, p:4750, b:11800}],
	[
		{n:"無" , f:0   , g:0   , p:0   , b:0    },
		{n:"1星", f:40  , g:0   , p:0   , b:0    },
		{n:"2星", f:40  , g:120 , p:100 , b:300  },
		{n:"3星", f:40  , g:240 , p:250 , b:650  },
		{n:"玄1", f:80  , g:400 , p:500 , b:1250 },
		{n:"玄2", f:160 , g:560 , p:800 , b:2050 },
		{n:"玄3", f:240 , g:800 , p:1250, b:3150 },
		{n:"地1", f:320 , g:1120, p:1750, b:4450 },
		{n:"地2", f:440 , g:1520, p:2350, b:6050 },
		{n:"地3", f:600 , g:2000, p:3100, b:7950 },
		{n:"天1", f:800 , g:2560, p:4000, b:10150},
		{n:"天2", f:1040, g:3200, p:5000, b:12650},
		{n:"天3", f:1320, g:3920, p:6200, b:15450}],
	[
		{n:"無" , f:0   , g:0   , p:0   , b:0    },
		{n:"1星", f:40  , g:0   , p:0   , b:0    },
		{n:"2星", f:40  , g:120 , p:100 , b:200  },
		{n:"3星", f:40  , g:240 , p:200 , b:400  },
		{n:"玄1", f:80  , g:360 , p:350 , b:750  },
		{n:"玄2", f:160 , g:480 , p:550 , b:1250 },
		{n:"玄3", f:240 , g:640 , p:800 , b:1900 },
		{n:"地1", f:360 , g:840 , p:1150, b:2800 },
		{n:"地2", f:480 , g:1080, p:1650, b:4000 },
		{n:"地3", f:640 , g:1360, p:2250, b:5500 },
		{n:"天1", f:840 , g:1720, p:2950, b:7300 },
		{n:"天2", f:1080, g:2160, p:3750, b:9400 },
		{n:"天3", f:1360, g:2680, p:4750, b:11800},
		{n:"天4", f:1680, g:3280, p:5750, b:14200},
		{n:"天5", f:2040, g:3960, p:6750, b:16600}],
	[
		{n:"無" , f:0   , g:0   , p:0   , b:0    },
		{n:"1星", f:40  , g:0   , p:0   , b:0    },
		{n:"2星", f:40  , g:160 , p:100 , b:300  },
		{n:"3星", f:40  , g:320 , p:250 , b:650  },
		{n:"玄1", f:80  , g:520 , p:500 , b:1250 },
		{n:"玄2", f:160 , g:720 , p:800 , b:2050 },
		{n:"玄3", f:240 , g:1000, p:1250, b:3150 },
		{n:"地1", f:320 , g:1360, p:1750, b:4450 },
		{n:"地2", f:440 , g:1800, p:2350, b:6050 },
		{n:"地3", f:600 , g:2320, p:3100, b:7950 },
		{n:"天1", f:800 , g:2920, p:4000, b:10150},
		{n:"天2", f:1040, g:3600, p:5000, b:12650},
		{n:"天3", f:1320, g:4360, p:6200, b:15450}]
];

const skills = [
	{id:0, name:"丹朱", shop:0, bound:0, type:0},
	{id:1, name:"熾炎", shop:1, bound:0, type:0},
	{id:2, name:"流螢", shop:2, bound:0, type:0},
	{id:3, name:"隕火", shop:3, bound:0, type:0},
	{id:4, name:"風捲", shop:0, bound:0, type:0},
	{id:5, name:"焰羽", shop:1, bound:0, type:0},
	{id:6, name:"炎舞", shop:2, bound:0, type:0},
	{id:7, name:"三味", shop:3, bound:0, type:0},
	{id:8, name:"折花", shop:0, bound:0, type:1},
	{id:9, name:"掠影", shop:1, bound:0, type:1},
	{id:10, name:"決雲", shop:2, bound:0, type:1},
	{id:11, name:"摧巒", shop:3, bound:0, type:1},
	{id:12, name:"龜蛇", shop:0, bound:0, type:1},
	{id:13, name:"鬥影", shop:1, bound:0, type:1},
	{id:14, name:"六曜", shop:2, bound:0, type:1},
	{id:15, name:"星移", shop:3, bound:0, type:1},
	{id:16, name:"雲籙", shop:0, bound:0, type:2},
	{id:17, name:"天鼓", shop:1, bound:0, type:2},
	{id:18, name:"驅雷", shop:2, bound:0, type:2},
	{id:19, name:"青索", shop:3, bound:0, type:2},
	{id:20, name:"天罡", shop:0, bound:0, type:2},
	{id:21, name:"驚蟄", shop:1, bound:0, type:2},
	{id:22, name:"虎鳴", shop:2, bound:0, type:2},
	{id:23, name:"龍吟", shop:3, bound:0, type:2},
	{id:24, name:"劫焰", shop:0, bound:1, type:0},
	{id:25, name:"衡陽", shop:1, bound:1, type:0},
	{id:26, name:"業火", shop:2, bound:1, type:0},
	{id:27, name:"攬星", shop:3, bound:1, type:0},
	{id:28, name:"斷塵", shop:0, bound:1, type:1},
	{id:29, name:"分光", shop:1, bound:1, type:1},
	{id:30, name:"橫秋", shop:2, bound:1, type:1},
	{id:31, name:"霜寒", shop:3, bound:1, type:1},
	{id:32, name:"霄鳴", shop:0, bound:1, type:2},
	{id:33, name:"垂光", shop:1, bound:1, type:2},
	{id:34, name:"黃龍", shop:2, bound:1, type:2},
	{id:35, name:"青蛇", shop:3, bound:1, type:2},
	{id:36, name:"烈雨", shop:4, bound:2, type:3},
	{id:37, name:"冥火", shop:4, bound:2, type:3},
	{id:38, name:"業蓮", shop:4, bound:2, type:3},
	{id:39, name:"裂天", shop:4, bound:2, type:3},
	{id:40, name:"陽隕", shop:0, bound:3, type:0},
	{id:41, name:"巡日", shop:1, bound:3, type:0},
	{id:42, name:"炎爆", shop:2, bound:3, type:0},
	{id:43, name:"星燎", shop:3, bound:3, type:0},
	{id:44, name:"玄峰", shop:0, bound:3, type:1},
	{id:45, name:"貫日", shop:1, bound:3, type:1},
	{id:46, name:"鎮岳", shop:2, bound:3, type:1},
	{id:47, name:"破月", shop:3, bound:3, type:1},
	{id:48, name:"天怒", shop:0, bound:3, type:2},
	{id:49, name:"嵐霆", shop:1, bound:3, type:2},
	{id:50, name:"鬥辰", shop:2, bound:3, type:2},
	{id:51, name:"崩雲", shop:3, bound:3, type:2},
	{id:52, name:"幽蝕", shop:4, bound:4, type:4},
	{id:53, name:"驚蟬", shop:4, bound:4, type:4},
	{id:54, name:"蛻蛇", shop:4, bound:4, type:4},
	{id:55, name:"祭律", shop:4, bound:4, type:4}
];

/**
 * Pure computation of superpower conversion/deficit/remainder.
 * Mirrors the logic of computesuperpower() in snp.js exactly,
 * but returns structured data instead of writing to DOM.
 *
 * @param {Array} source - 6 current skills with id, level, src[]
 * @param {Array} frags - loose fragments [{id, amount}]
 * @param {number} fragp - purple scroll count
 * @param {number} fragb - blue scroll count
 * @param {Array} target - 6 target skills with id, level
 * @param {Array} [keep] - skill IDs whose body fragments should not be converted in same-shop conversion
 * @returns {{ conversions, totalConversions, deficits, missingOther, missingPurple, missingBlue, remainderGold, remainderPurple, remainderBlue, remainderDetails }}
 */
function computesuperpower(source, frags, fragp, fragb, target, keep) {
	const keepSet = new Set(Array.isArray(keep) ? keep : []);
	let tg = 0;
	let tp = fragp;
	let tb = fragb;

	// 1.1 Tally loose fragments
	const sm = new Map();
	for (let i = 0; i < frags.length; i++) {
		if (!sm.has(frags[i].id))
			sm.set(frags[i].id, 0);
		sm.set(frags[i].id, sm.get(frags[i].id) + frags[i].amount);
		tg += frags[i].amount;
	}
	// 1.2 Tally current skills' resources
	for (let i = 0; i < 6; i++) {
		const sk = skills[source[i].id];
		const lv = levels[sk.bound][source[i].level];
		if (!sm.has(sk.id))
			sm.set(sk.id, 0);
		sm.set(sk.id, sm.get(sk.id) + lv.f - 40);
		tg += lv.f - 40;
		tp += lv.p;
		tb += lv.b;
		for (let j = 0; j < source[i].src.length; j++) {
			if (!sm.has(source[i].src[j].id))
				sm.set(source[i].src[j].id, 0);
			sm.set(source[i].src[j].id, sm.get(source[i].src[j].id) + source[i].src[j].amount);
			tg += source[i].src[j].amount;
		}
	}

	// 2.1 Allocate body fragments from same-skill matches
	const tmptgt = JSON.parse(JSON.stringify(target));
	tmptgt.forEach(function(it) {
		const sk = skills[it.id];
		const lv = levels[sk.bound][it.level];
		it.body = lv.f - 40;
		it.frag = lv.g;
		it.purple = lv.p;
		it.blue = lv.b;
		if (sm.has(it.id)) {
			const used = Math.min(sm.get(it.id), it.body);
			sm.set(it.id, sm.get(it.id) - used);
			it.body -= used;
			tg -= used;
		}
	});

	// 2.2 Convert same-shop fragments to fill body needs
	const conversions = [];
	let totalConversions = 0;
	tmptgt.forEach(function(it) {
		const sk = skills[it.id];
		sm.forEach(function(v, k) {
			if (it.body === 0) return;
			if (v > 0 && it.id !== k && skills[k].shop === sk.shop && !keepSet.has(k)) {
				const used = Math.min(it.body, v);
				conversions.push({
					fromId: k,
					fromName: skills[k].name,
					toId: it.id,
					toName: skills[it.id].name,
					amount: used,
					times: used / 40
				});
				totalConversions += used / 40;
				sm.set(k, sm.get(k) - used);
				it.body -= used;
				tg -= used;
			}
		});
	});

	// 2.3 Allocate remaining fragments (any skill) to fill frag needs
	tmptgt.forEach(function(it) {
		sm.forEach(function(v, k) {
			if (it.frag === 0) return;
			if (v > 0) {
				const used = Math.min(it.frag, v);
				sm.set(k, sm.get(k) - used);
				it.frag -= used;
				tg -= used;
			}
		});
		if (it.purple > 0) {
			const used = Math.min(it.purple, tp);
			it.purple -= used;
			tp -= used;
		}
		if (it.blue > 0) {
			const used = Math.min(it.blue, tb);
			it.blue -= used;
			tb -= used;
		}
	});

	// 3 Collect results
	const deficits = [];
	let missingOther = 0;
	let missingPurple = 0;
	let missingBlue = 0;
	tmptgt.forEach(function(it) {
		if (it.body > 0) {
			deficits.push({ id: it.id, name: skills[it.id].name, amount: it.body });
		}
		if (it.frag > 0) missingOther += it.frag;
		if (it.purple > 0) missingPurple += it.purple;
		if (it.blue > 0) missingBlue += it.blue;
	});

	const remainderDetails = [];
	sm.forEach(function(v, k) {
		if (v > 0) {
			remainderDetails.push({ id: k, name: skills[k].name, amount: v });
		}
	});

	return {
		conversions,
		totalConversions,
		deficits,
		missingOther,
		missingPurple,
		missingBlue,
		remainderGold: tg,
		remainderPurple: tp,
		remainderBlue: tb,
		remainderDetails
	};
}

/**
 * Compute source power totals (mirrors refreshsourcepowerview).
 * @returns {{ totalBody, totalOther, totalPurple, totalBlue }}
 */
function computeSourceTotals(source, frags, fragp, fragb) {
	let totalBody = 0;
	let totalOther = 0;
	let totalPurple = fragp;
	let totalBlue = fragb;
	for (let i = 0; i < 6; i++) {
		const sk = skills[source[i].id];
		const lv = levels[sk.bound][source[i].level];
		totalBody += lv.f - 40;
		for (let j = 0; j < source[i].src.length; j++) {
			totalOther += source[i].src[j].amount;
		}
		totalPurple += lv.p;
		totalBlue += lv.b;
	}
	frags.forEach(function(it) {
		totalOther += it.amount;
	});
	return { totalBody, totalOther, totalPurple, totalBlue };
}

/**
 * Compute target power totals (mirrors refreshtargetpowerview).
 * @returns {{ totalBody, totalOther, totalPurple, totalBlue }}
 */
function computeTargetTotals(target) {
	let totalBody = 0;
	let totalOther = 0;
	let totalPurple = 0;
	let totalBlue = 0;
	for (let i = 0; i < 6; i++) {
		const sk = skills[target[i].id];
		const lv = levels[sk.bound][target[i].level];
		totalBody += lv.f - 40;
		totalOther += lv.g;
		totalPurple += lv.p;
		totalBlue += lv.b;
	}
	return { totalBody, totalOther, totalPurple, totalBlue };
}

/**
 * Validate URL-parsed data structure.
 * @returns {boolean}
 */
function validateUrlData(d) {
	if (!d || typeof d !== 'object') return false;
	if (!Array.isArray(d.source) || d.source.length !== 6) return false;
	if (!Array.isArray(d.frags)) return false;
	if (typeof d.fragp !== 'number' || d.fragp < 0) return false;
	if (typeof d.fragb !== 'number' || d.fragb < 0) return false;
	if (!Array.isArray(d.target) || d.target.length !== 6) return false;

	for (let i = 0; i < 6; i++) {
		const s = d.source[i];
		if (!s || typeof s.id !== 'number' || s.id < 0 || s.id >= skills.length) return false;
		const sk = skills[s.id];
		if (typeof s.level !== 'number' || s.level < 0 || s.level >= levels[sk.bound].length) return false;
		if (!Array.isArray(s.src)) return false;
		for (let j = 0; j < s.src.length; j++) {
			const frag = s.src[j];
			if (!frag || typeof frag.id !== 'number' || frag.id < 0 || frag.id >= skills.length) return false;
			if (typeof frag.amount !== 'number' || frag.amount <= 0) return false;
		}
	}

	for (let i = 0; i < d.frags.length; i++) {
		const frag = d.frags[i];
		if (!frag || typeof frag.id !== 'number' || frag.id < 0 || frag.id >= skills.length) return false;
		if (typeof frag.amount !== 'number' || frag.amount <= 0) return false;
	}

	for (let i = 0; i < 6; i++) {
		const t = d.target[i];
		if (!t || typeof t.id !== 'number' || t.id < 0 || t.id >= skills.length) return false;
		const sk = skills[t.id];
		if (typeof t.level !== 'number' || t.level < 1 || t.level >= levels[sk.bound].length) return false;
	}

	if (d.keep !== undefined) {
		if (!Array.isArray(d.keep)) return false;
		for (let i = 0; i < d.keep.length; i++) {
			if (typeof d.keep[i] !== 'number' || d.keep[i] < 0 || d.keep[i] >= skills.length) return false;
		}
	}

	return true;
}

export {
	shops,
	bounds,
	types,
	levels,
	skills,
	computesuperpower,
	computeSourceTotals,
	computeTargetTotals,
	validateUrlData
};
