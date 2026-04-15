(function() {
'use strict';

// ===== Constants =====
var SLOT_COUNT = 6;
var FRAGMENT_UNIT = 40;
var SKILLS_PER_SHOP = 12;

// ===== Game Data =====
// Level data keys: n=name, f=body fragments (本體殘卷), g=other fragments (仙品殘卷),
//                  p=purple scrolls (極品殘卷), b=blue scrolls (上品殘卷)
var shops = ["道蘊商店", "論劍商店", "諸天商會", "宗門寶庫", "百族寶箱"];
var bounds = ["人界", "返虛", "煞海", "合體", "蠱族"];
var types = ["火", "劍", "雷", "百族"];
var colors = ["text-danger", "text-warning", "text-primary", "text-black", "text-tribe-green"];

var levels = [
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

var skills = [
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

// ===== Application State =====
var source, frags, fragp, fragb, target, keep;
var currentSourceIdx;
var sourceOffcanvas, targetOffcanvas, keepOffcanvas;

// Dirty (unsaved changes) tracking per panel
var dirtySource = false, dirtySourceIdx = -1;
var dirtyFrag = false;
var dirtyTarget = false;
var dirtyKeep = false;
var savedFlag = false; // set true right before hide when saving

// Snapshots of panel state when opened (to detect actual changes)
var snapSource = null; // {sl1, sll1, badges}
var snapFrag = null;   // {badges, fragp, fragb}
var snapTarget = null; // [{tl, tll}, ...]
var snapKeep = null;   // [checked ids]

function snapshotSource() {
	var badges = {};
	for (var i = 0; i < skills.length; i++) {
		var v = $('#sr' + i)[0].innerHTML.trim();
		if (v !== '') badges[i] = v;
	}
	return { sl1: $('#sl1')[0].value, sll1: $('#sll1')[0].value, badges: JSON.stringify(badges) };
}
function snapshotFrag() {
	var badges = {};
	for (var i = 0; i < skills.length; i++) {
		var v = $('#sf' + i)[0].innerHTML.trim();
		if (v !== '') badges[i] = v;
	}
	return { badges: JSON.stringify(badges), fragp: $('#fragpcnt')[0].value, fragb: $('#fragbcnt')[0].value };
}
function snapshotTarget() {
	var slots = [];
	for (var i = 0; i < SLOT_COUNT; i++) {
		slots.push($('#tl' + i)[0].value + ':' + $('#tll' + i)[0].value);
	}
	return slots.join(',');
}
function snapshotKeep() {
	var ids = [];
	for (var i = 0; i < skills.length; i++) {
		var cb = document.getElementById('kc' + i);
		if (cb && cb.checked) ids.push(i);
	}
	return ids.join(',');
}
function snapChanged(a, b) {
	if (typeof a === 'string') return a !== b;
	return a.sl1 !== b.sl1 || a.sll1 !== b.sll1 || a.badges !== b.badges ||
		a.fragp !== b.fragp || a.fragb !== b.fragb;
}

// ===== URL Data Validation =====
function validateUrlData(data) {
	if (!data || typeof data !== 'object') return false;
	if (!Array.isArray(data.source) || data.source.length !== SLOT_COUNT) return false;
	if (!Array.isArray(data.frags)) return false;
	if (typeof data.fragp !== 'number' || data.fragp < 0) return false;
	if (typeof data.fragb !== 'number' || data.fragb < 0) return false;
	if (!Array.isArray(data.target) || data.target.length !== SLOT_COUNT) return false;

	for (var i = 0; i < SLOT_COUNT; i++) {
		var s = data.source[i];
		if (!s || typeof s.id !== 'number' || s.id < 0 || s.id >= skills.length) return false;
		var sk = skills[s.id];
		if (typeof s.level !== 'number' || s.level < 0 || s.level >= levels[sk.bound].length) return false;
		if (!Array.isArray(s.src)) return false;
		for (var j = 0; j < s.src.length; j++) {
			var frag = s.src[j];
			if (!frag || typeof frag.id !== 'number' || frag.id < 0 || frag.id >= skills.length) return false;
			if (typeof frag.amount !== 'number' || frag.amount <= 0) return false;
		}
	}

	for (var i = 0; i < data.frags.length; i++) {
		var frag = data.frags[i];
		if (!frag || typeof frag.id !== 'number' || frag.id < 0 || frag.id >= skills.length) return false;
		if (typeof frag.amount !== 'number' || frag.amount <= 0) return false;
	}

	for (var i = 0; i < SLOT_COUNT; i++) {
		var t = data.target[i];
		if (!t || typeof t.id !== 'number' || t.id < 0 || t.id >= skills.length) return false;
		var sk = skills[t.id];
		if (typeof t.level !== 'number' || t.level < 1 || t.level >= levels[sk.bound].length) return false;
	}

	if (data.keep !== undefined) {
		if (!Array.isArray(data.keep)) return false;
		for (var i = 0; i < data.keep.length; i++) {
			if (typeof data.keep[i] !== 'number' || data.keep[i] < 0 || data.keep[i] >= skills.length) return false;
		}
	}

	return true;
}

// ===== State Persistence =====
var STORAGE_KEY = 'snp_save';

function getStateObject() {
	var state = {source: source, frags: frags, fragp: fragp, fragb: fragb, target: target};
	if (keep.length > 0) state.keep = keep;
	return state;
}

function saveToLocalStorage() {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(getStateObject()));
	} catch (e) { /* quota exceeded or private browsing */ }
}

function loadFromLocalStorage() {
	try {
		var raw = localStorage.getItem(STORAGE_KEY);
		if (raw) return JSON.parse(raw);
	} catch (e) { /* corrupted data */ }
	return null;
}

function updatedatadone() {
	var state = getStateObject();
	saveToLocalStorage();
	window.location.href = '?' + encodeURIComponent(JSON.stringify(state));
}

function shareSetup() {
	var state = getStateObject();
	var url = window.location.origin + window.location.pathname + '?' + encodeURIComponent(JSON.stringify(state));
	var ta = document.createElement('textarea');
	ta.value = url;
	ta.setAttribute('readonly', '');
	ta.style.position = 'fixed';
	ta.style.left = '-9999px';
	ta.style.opacity = '0';
	document.body.appendChild(ta);
	ta.focus();
	ta.select();
	var ok = false;
	try { ok = document.execCommand('copy'); } catch (e) { }
	document.body.removeChild(ta);
	if (ok) {
		showShareToast('已複製連結！');
	} else {
		window.prompt('複製此連結分享你的配置：', url);
	}
}

function showShareToast(msg) {
	var el = document.getElementById('shareToast');
	if (!el) return;
	el.textContent = msg;
	el.style.display = 'block';
	el.style.opacity = '1';
	setTimeout(function() {
		el.style.opacity = '0';
		setTimeout(function() { el.style.display = 'none'; }, 300);
	}, 2000);
}

// ===== Data Loading =====
function refreshdata() {
	var data = null;

	// Priority 1: URL params (for shared links)
	try {
		if (window.location.search.length > 1) {
			data = JSON.parse(decodeURIComponent(window.location.search.substring(1)));
		}
	} catch (e) { }

	// Priority 2: localStorage (auto-saved)
	if (data === null) {
		data = loadFromLocalStorage();
	}

	if (data !== null && validateUrlData(data)) {
		source = data.source;
		frags = data.frags;
		fragp = data.fragp;
		fragb = data.fragb;
		target = data.target;
		keep = Array.isArray(data.keep) ? data.keep : [];
	} else {
		source = JSON.parse('[{"id":47,"level":4,"src":[{"id":15,"amount":80},{"id":28,"amount":120},{"id":45,"amount":160}]},{"id":49,"level":7,"src":[{"id":14,"amount":120},{"id":20,"amount":80},{"id":29,"amount":80},{"id":38,"amount":320},{"id":39,"amount":80},{"id":45,"amount":120},{"id":55,"amount":40}]},{"id":50,"level":7,"src":[{"id":14,"amount":400},{"id":28,"amount":40},{"id":31,"amount":360},{"id":53,"amount":40}]},{"id":46,"level":9,"src":[{"id":20,"amount":400},{"id":21,"amount":480},{"id":35,"amount":120},{"id":37,"amount":160},{"id":39,"amount":160},{"id":53,"amount":40}]},{"id":9,"level":12,"src":[{"id":11,"amount":40},{"id":21,"amount":120},{"id":28,"amount":80},{"id":29,"amount":80},{"id":32,"amount":240}]},{"id":11,"level":12,"src":[{"id":28,"amount":80},{"id":31,"amount":480}]}]');
		frags = JSON.parse('[{"id":10,"amount":680},{"id":28,"amount":120},{"id":29,"amount":280},{"id":35,"amount":280},{"id":36,"amount":80},{"id":47,"amount":40}]');
		fragp = 3031;
		fragb = 8650;
		target = JSON.parse('[{"id":47,"level":6},{"id":49,"level":7},{"id":50,"level":9},{"id":46,"level":10},{"id":9,"level":12},{"id":11,"level":12}]');
		keep = [];
	}
}

// ===== Display Name Helper =====
function getSkillDisplayName(sk) {
	var name = sk.name;
	if (sk.bound === 1 || sk.bound === 2) name += " (魔)";
	if (sk.bound === 3 || sk.bound === 4) name += " (蠱)";
	return name;
}

// ===== View: Source Powers Table =====
function refreshsourcepowerview() {
	var totalBody = 0;
	var totalOther = 0;
	var totalPurple = fragp;
	var totalBlue = fragb;

	for (var i = 0; i < SLOT_COUNT; i++) {
		var skill = skills[source[i].id];
		var levelData = levels[skill.bound][source[i].level];

		$('#sname' + i)[0].innerText = skill.name;
		colors.forEach(function(c) { $('#sname' + i).removeClass(c); });
		$('#sname' + i).addClass(colors[skill.type]);

		$('#slevel' + i)[0].innerText = levelData.n;

		var bodyFragCount = levelData.f - FRAGMENT_UNIT;
		$('#ssrc1' + i)[0].innerHTML = bodyFragCount;
		totalBody += bodyFragCount;

		$('#ssrc2' + i)[0].innerHTML = '';
		for (var j = 0; j < source[i].src.length; j++) {
			$('#ssrc2' + i)[0].innerHTML += skills[source[i].src[j].id].name + "(" + source[i].src[j].amount + ") ";
			totalOther += source[i].src[j].amount;
			if ((j + 1) % 3 === 0) {
				$('#ssrc2' + i)[0].innerHTML += "<br/>";
			}
		}

		$('#ssrc3' + i)[0].innerHTML = levelData.p;
		totalPurple += levelData.p;
		$('#ssrc4' + i)[0].innerHTML = levelData.b;
		totalBlue += levelData.b;
	}

	frags.forEach(function(item) { totalOther += item.amount; });

	$('#ssrc28')[0].innerHTML = '';
	frags.forEach(function(item) {
		$('#ssrc28')[0].innerHTML += skills[item.id].name + "(" + item.amount + ") ";
	});

	$('#ssrc38')[0].innerHTML = fragp;
	$('#ssrc48')[0].innerHTML = fragb;
	$('#ssrc17')[0].innerHTML = totalBody;
	$('#ssrc27')[0].innerHTML = totalOther;
	$('#ssrc37')[0].innerHTML = totalPurple;
	$('#ssrc47')[0].innerHTML = totalBlue;
}

// ===== View: Target Powers Table =====
function refreshtargetpowerview() {
	var totalBody = 0;
	var totalOther = 0;
	var totalPurple = 0;
	var totalBlue = 0;

	for (var i = 0; i < SLOT_COUNT; i++) {
		var skill = skills[target[i].id];
		var levelData = levels[skill.bound][target[i].level];

		$('#tname' + i)[0].innerText = skill.name;
		colors.forEach(function(c) { $('#tname' + i).removeClass(c); });
		$('#tname' + i).addClass(colors[skill.type]);

		$('#tlevel' + i)[0].innerText = levelData.n;

		var bodyFragCount = levelData.f - FRAGMENT_UNIT;
		$('#tsrc1' + i)[0].innerText = bodyFragCount;
		totalBody += bodyFragCount;

		$('#tsrc2' + i)[0].innerText = levelData.g;
		totalOther += levelData.g;
		$('#tsrc3' + i)[0].innerText = levelData.p;
		totalPurple += levelData.p;
		$('#tsrc4' + i)[0].innerText = levelData.b;
		totalBlue += levelData.b;
	}

	$('#tsrc17')[0].innerHTML = totalBody;
	$('#tsrc27')[0].innerHTML = totalOther;
	$('#tsrc37')[0].innerHTML = totalPurple;
	$('#tsrc47')[0].innerHTML = totalBlue;
}

// ===== View: Keep Skills Display =====
function refreshkeepview() {
	if (keep.length === 0) {
		$('#keeplist')[0].innerHTML = '無 (點擊設定)';
	} else {
		var names = keep.map(function(id) { return skills[id].name; });
		$('#keeplist')[0].innerHTML = names.join('、') + ' (點擊修改)';
	}
}

// ===== Keep Panel: Build Checkbox Grid =====
function buildKeepSelector() {
	var sortedSkills = JSON.parse(JSON.stringify(skills));
	sortedSkills.sort(function(a, b) {
		if (a.shop === b.shop && a.bound === b.bound && a.type === b.type) return a.id - b.id;
		if (a.shop === b.shop && a.bound === b.bound) return a.type - b.type;
		if (a.shop === b.shop) return a.bound - b.bound;
		return a.shop - b.shop;
	});

	// Build a map of skill ID → total fragment count the user currently owns:
	// source slot body fragments, source slot src fragments, and loose fragments
	var ownedAmounts = new Map();
	for (var i = 0; i < SLOT_COUNT; i++) {
		var bodyAmt = levels[skills[source[i].id].bound][source[i].level].f - FRAGMENT_UNIT;
		ownedAmounts.set(source[i].id, (ownedAmounts.get(source[i].id) || 0) + bodyAmt);
		for (var j = 0; j < source[i].src.length; j++) {
			var srcId = source[i].src[j].id;
			ownedAmounts.set(srcId, (ownedAmounts.get(srcId) || 0) + source[i].src[j].amount);
		}
	}
	for (var i = 0; i < frags.length; i++) {
		ownedAmounts.set(frags[i].id, (ownedAmounts.get(frags[i].id) || 0) + frags[i].amount);
	}
	var ownedSkillIds = new Set(ownedAmounts.keys());

	var html = '<div class="row">';
	for (var i = 0; i < sortedSkills.length; i += SKILLS_PER_SHOP) {
		html += '<div class="col col-md-6 px-2 mx-0 my-1 border align-start" style="min-width:120px; background-color: rgba(255, 255, 255, 0.9);">';
		html += '<h6 class="my-1">' + shops[sortedSkills[i].shop] + '</h6><hr class="divider my-2">';
		for (var j = i; j < Math.min(i + SKILLS_PER_SHOP, sortedSkills.length); j++) {
			var sk = sortedSkills[j];
			var isChecked = keep.indexOf(sk.id) !== -1;
			var isOwned = ownedSkillIds.has(sk.id);
			var disabledAttr = isOwned ? '' : ' disabled';
			var checkedAttr = isChecked ? ' checked' : '';
			var labelStyle = isOwned ? '' : ' style="opacity:0.1"';
			html += '<div class="form-check text-start mb-1">';
			html += '<input class="form-check-input" type="checkbox" id="kc' + sk.id + '" value="' + sk.id + '"' + checkedAttr + disabledAttr + '>';
			var amtTag = isOwned ? ' <span class="keep-amount">(' + ownedAmounts.get(sk.id) + ')</span>' : '';
			html += '<label class="form-check-label ' + colors[sk.type] + '"' + labelStyle + ' for="kc' + sk.id + '">' + sk.name + amtTag + '</label>';
			html += '</div>';
		}
		html += '</div>';
	}
	html += '</div>';
	return html;
}

// ===== Core Computation =====
function computesuperpower() {
	var totalGold = 0;
	var totalPurple = fragp;
	var totalBlue = fragb;

	// Phase 1: Tally all available fragments
	var fragmentMap = new Map();
	for (var i = 0; i < frags.length; i++) {
		if (!fragmentMap.has(frags[i].id)) fragmentMap.set(frags[i].id, 0);
		fragmentMap.set(frags[i].id, fragmentMap.get(frags[i].id) + frags[i].amount);
		totalGold += frags[i].amount;
	}
	for (var i = 0; i < SLOT_COUNT; i++) {
		var skill = skills[source[i].id];
		var levelData = levels[skill.bound][source[i].level];
		if (!fragmentMap.has(skill.id)) fragmentMap.set(skill.id, 0);
		fragmentMap.set(skill.id, fragmentMap.get(skill.id) + levelData.f - FRAGMENT_UNIT);
		totalGold += levelData.f - FRAGMENT_UNIT;
		totalPurple += levelData.p;
		totalBlue += levelData.b;
		for (var j = 0; j < source[i].src.length; j++) {
			var srcFrag = source[i].src[j];
			if (!fragmentMap.has(srcFrag.id)) fragmentMap.set(srcFrag.id, 0);
			fragmentMap.set(srcFrag.id, fragmentMap.get(srcFrag.id) + srcFrag.amount);
			totalGold += srcFrag.amount;
		}
	}

	// Phase 2: Calculate target needs and allocate same-skill body fragments
	var targetNeeds = JSON.parse(JSON.stringify(target));
	targetNeeds.forEach(function(item) {
		var skill = skills[item.id];
		var levelData = levels[skill.bound][item.level];
		item.body = levelData.f - FRAGMENT_UNIT;
		item.frag = levelData.g;
		item.purple = levelData.p;
		item.blue = levelData.b;
		if (fragmentMap.has(item.id)) {
			var used = Math.min(fragmentMap.get(item.id), item.body);
			fragmentMap.set(item.id, fragmentMap.get(item.id) - used);
			item.body -= used;
			totalGold -= used;
		}
	});

	// Phase 3: Convert same-shop fragments to fill remaining body needs
	// Skip fragments whose skill ID is in the keep list (body fragments preserved)
	var keepSet = new Set(keep);
	var conversionParts = [];
	var conversionCount = 0;
	targetNeeds.forEach(function(item) {
		var skill = skills[item.id];
		fragmentMap.forEach(function(amount, fragId) {
			if (item.body === 0) return;
			if (amount > 0 && item.id !== fragId && skills[fragId].shop === skill.shop && !keepSet.has(fragId)) {
				var used = Math.min(item.body, amount);
				conversionParts.push(skills[fragId].name + "轉" + (used / FRAGMENT_UNIT) + "次給" + skills[item.id].name);
				conversionCount += used / FRAGMENT_UNIT;
				fragmentMap.set(fragId, fragmentMap.get(fragId) - used);
				item.body -= used;
				totalGold -= used;
			}
		});
	});
	function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
	var cp = conversionParts.join("，");
	var cc = conversionCount;
	var conversionHtml = '';
	if (cc > 0) {
		conversionHtml = pick([
			"我我我……我算出來了！你、你把" + cp + "……一共" + cc + "次……別、別問我為什麼幫你算，我只是……剛好路過而已！",
			"那、那個……你要轉換" + cc + "次……就是" + cp + "……我我我才沒有偷偷幫你算很久……（別過頭）",
			"嗯……（翻殘卷）你把" + cp + "就好了，總共" + cc + "次……我我我只是順手算的……（小聲）",
			"我、我幫你看了一下……" + cp + "，一共" + cc + "次轉換……才、才不是因為擔心你才算的……（低頭）",
			"好……好像踩到了一塊石頭……（低頭看殘卷）啊！你把" + cp + "就行了，" + cc + "次……才、才不是特意幫你研究的！",
		]) + "<br />";
	} else {
		conversionHtml = pick([
			"咦？不、不用轉換呢……你的殘卷剛剛好……（鬆了口氣）",
			"欸……居然不用轉換？你……你準備得好齊全……（小聲嘟囔）",
			"我我我看了好幾遍……真的不用轉換呢……（鬆了口氣）",
		]) + "<br />";
	}

	// Phase 4: Allocate remaining fragments for generic needs, then purple/blue scrolls
	targetNeeds.forEach(function(item) {
		fragmentMap.forEach(function(amount, fragId) {
			if (item.frag === 0) return;
			if (amount > 0) {
				var used = Math.min(item.frag, amount);
				fragmentMap.set(fragId, fragmentMap.get(fragId) - used);
				item.frag -= used;
				totalGold -= used;
			}
		});
		if (item.purple > 0) {
			var used = Math.min(item.purple, totalPurple);
			item.purple -= used;
			totalPurple -= used;
		}
		if (item.blue > 0) {
			var used = Math.min(item.blue, totalBlue);
			item.blue -= used;
			totalBlue -= used;
		}
	});

	// Phase 5: Build result HTML
	var missingOther = 0;
	var missingPurple = 0;
	var missingBlue = 0;
	var deficitItems = [];
	targetNeeds.forEach(function(item) {
		if (item.body > 0) {
			deficitItems.push(skills[item.id].name + "(" + item.body + ")");
		}
		if (item.frag > 0) missingOther += item.frag;
		if (item.purple > 0) missingPurple += item.purple;
		if (item.blue > 0) missingBlue += item.blue;
	});

	var deficitHtml = '';
	var hasDeficit = deficitItems.length > 0 || missingOther > 0 || missingPurple > 0 || missingBlue > 0;
	if (hasDeficit) {
		var mp = [];
		if (deficitItems.length > 0) mp.push(deficitItems.join("跟"));
		if (missingOther > 0) mp.push("仙品殘卷" + missingOther + "個");
		if (missingPurple > 0) mp.push("極品殘卷" + missingPurple + "個");
		if (missingBlue > 0) mp.push("上品殘卷" + missingBlue + "個");
		var ms = mp.join("、");
		deficitHtml += pick([
			"糟、糟糕……還差" + ms + "……（牙關打顫）不、不過別擔心嘛……慢慢湊就好了，我我我……會在這裡等你的……（小聲）",
			"嗚……差了" + ms + "……（瑟瑟發抖）但、但是沒關係的……剩下的一定能湊齊的……",
			"我我我算了好幾遍……確實還差" + ms + "……（攥緊衣角）你、你別急，慢慢來嘛……我又不會跑掉……",
			"還差" + ms + "呢……（低頭）沒、沒事的……這點缺口很快就能補上的，你、你一定可以的！",
			"唔……" + ms + "還不夠……（牙關打顫）不過……不過你已經準備得很好了！真的！我我我沒有在安慰你……",
		]) + "<br />";
	} else {
		deficitHtml += pick([
			"全、全部夠了！……我我我沒有很開心啦！只是……剛好鬆了口氣而已……",
			"咦……居然全部夠用了……我、我才沒有替你高興呢……（小聲）",
			"剛剛好全部夠了！你、你太厲害了吧……（小聲）我我我只是在陳述事實而已……",
			"全……全部夠了呢……（鬆了口氣）看吧，我就說你可以的……才、才不是因為擔心你才一直在算……",
		]) + "<br />";
	}

	var remainderHtml = '';
	var hasRemainder = totalGold > 0 || totalPurple > 0 || totalBlue > 0;
	if (hasRemainder) {
		var lp = [];
		if (totalGold > 0) {
			var dp = [];
			fragmentMap.forEach(function(amount, fragId) {
				if (amount > 0) dp.push(skills[fragId].name + amount + "個");
			});
			lp.push("仙品殘卷" + totalGold + "個" + (dp.length > 0 ? "（" + dp.join("、") + "）" : ""));
		}
		if (totalPurple > 0) lp.push("極品殘卷" + totalPurple + "個");
		if (totalBlue > 0) lp.push("上品殘卷" + totalBlue + "個");
		var ls = lp.join("、");
		remainderHtml += pick([
			"對了……算完還剩" + ls + "……你、你收好啊！下……下次要算的話……我、我也不是不可以幫你……（別過頭）",
			"嗯……還多出" + ls + "……先存著吧……以、以後說不定用得上……（小聲）",
			"剩下" + ls + "……你、你自己保管好啊……我我我才不會幫你記著呢……（低頭）",
			"啊……還有" + ls + "剩著……留著下次用吧……反、反正我隨時都在……（聲音越來越小）",
		]) + "<br />";
	} else {
		remainderHtml += pick([
			"剛剛好用完了……好像踩到了什麼好運呢……（小聲）",
			"一個都不剩……完、完美……我我我才沒有在心裡歡呼……（攥緊衣角）",
			"全部用完了呢……（鬆了口氣）剛……剛剛好……",
		]) + "<br />";
	}

	// When deficit: lead with what's missing, then conversion plan, then remainder
	// When no deficit: conversion first (or no-conversion), then all-enough, then remainder
	if (hasDeficit) {
		$('#tsum')[0].innerHTML = deficitHtml + "<br />" + conversionHtml + "<br />" + remainderHtml;
	} else {
		$('#tsum')[0].innerHTML = conversionHtml + "<br />" + deficitHtml + "<br />" + remainderHtml;
	}
}

// ===== Click-to-Edit Badge =====
function badgeClickToEdit(spanId, onCommit) {
	var span = document.getElementById(spanId);
	if (!span || span.querySelector('input')) return;
	var oldVal = Number(span.innerHTML) || 0;
	var input = document.createElement('input');
	input.type = 'number';
	input.value = oldVal;
	input.min = 0;
	input.step = FRAGMENT_UNIT;
	input.style.cssText = 'width:60px;font-size:12px;text-align:center;';
	function commit() {
		var raw = Math.max(0, parseInt(input.value, 10) || 0);
		var snapped = Math.round(raw / FRAGMENT_UNIT) * FRAGMENT_UNIT;
		span.innerHTML = snapped ? snapped : '';
		onCommit(snapped, oldVal);
	}
	input.addEventListener('blur', commit);
	input.addEventListener('keydown', function(e) {
		if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
	});
	span.innerHTML = '';
	span.appendChild(input);
	input.focus();
	input.select();
}
window.badgeClickToEdit = badgeClickToEdit;

// ===== Shared UI: Shop Skill Selector Grid =====
function buildShopSelector(fragmentMap, disabledSkillId, minusFn, plusFn, spanPrefix) {
	var sortedSkills = JSON.parse(JSON.stringify(skills));
	sortedSkills.sort(function(a, b) {
		if (a.shop === b.shop && a.bound === b.bound && a.type === b.type) return a.id - b.id;
		if (a.shop === b.shop && a.bound === b.bound) return a.type - b.type;
		if (a.shop === b.shop) return a.bound - b.bound;
		return a.shop - b.shop;
	});

	var html = '<div class="row">';
	for (var i = 0; i < sortedSkills.length; i += SKILLS_PER_SHOP) {
		html += '<div class="col col-md-6 px-2 mx-0 my-1 border align-start" style="min-width:120px; background-color: rgba(255, 255, 255, 0.9);">';
		html += '<h6 class="my-1">' + shops[sortedSkills[i].shop] + ' </h6><hr class="divider my-2">';
		for (var j = i; j < Math.min(i + SKILLS_PER_SHOP, sortedSkills.length); j++) {
			var skillId = sortedSkills[j].id;
			var amount = fragmentMap.has(skillId) ? fragmentMap.get(skillId) : "";
			var isDisabled = (disabledSkillId === skillId);
			var disabledAttr = isDisabled ? " disabled" : "";
			if (isDisabled) {
				amount = levels[skills[disabledSkillId].bound][source[currentSourceIdx].level].f - FRAGMENT_UNIT;
			}
			html += '<p id="src' + skillId + '" class="text-start mb-1">';
			html += '<span class=' + colors[sortedSkills[j].type] + '>' + sortedSkills[j].name + '</span>';
			html += ' <button onclick="' + minusFn + '(' + skillId + ')"' + disabledAttr + '>-</button>';
			html += '<button onclick="' + plusFn + '(' + skillId + ')"' + disabledAttr + '>+</button>';
			var editClick = '';
			var editCursor = '';
			if (!isDisabled) {
				editClick = ' onclick="badgeClickToEdit(\'' + spanPrefix + skillId + '\',' + spanPrefix + 'Edit)"';
				editCursor = 'cursor:pointer;';
			}
			html += ' <span id="' + spanPrefix + skillId + '" class="badge text-bg-secondary" style="' + editCursor + '"' + editClick + '>' + amount + '</span>';
		}
		html += '</div>';
	}
	html += '</div>';
	return html;
}

// ===== Submit Button State =====
function refreshspsrcbtn() {
	$('#ssub').prop('disabled', Number($('#ssrccnt')[0].innerHTML) !== 0);
}

// ===== Dynamic Level Dropdown: Target =====
function refreshtargetlevel(i, id) {
	var oldValue = Number($('#tll' + i)[0].value);
	var skill = skills[id];
	$('#tll' + i)[0].innerHTML = '';
	for (var j = 1; j < levels[skill.bound].length; j++) {
		var isSelected = (j === oldValue);
		if (j === levels[skill.bound].length - 1 && j < oldValue) {
			isSelected = true;
		}
		$('#tll' + i)[0].innerHTML += "<option value='" + j + "'" + (isSelected ? "selected" : "") + ">" + levels[skill.bound][j].n + "</option>";
	}
}

// ===== Dynamic Level Dropdown: Source =====
function refresholdlevel(id) {
	var oldValue = Number($('#sll1')[0].value);
	var skill = skills[id];
	$('#sll1')[0].innerHTML = '';
	for (var j = 1; j < levels[skill.bound].length; j++) {
		var isSelected = (j === oldValue);
		if (j === levels[skill.bound].length - 1 && j < oldValue) {
			isSelected = true;
		}
		$('#sll1')[0].innerHTML += "<option value='" + j + "'" + (isSelected ? "selected" : "") + ">" + levels[skill.bound][j].n + "</option>";
	}
	slonchanged();
}

// ===== Source Power Selection Handlers =====
function sponchanged() {
	var id = $('#sl1')[0].value;
	var lv = $('#sll1')[0].value;
	colors.forEach(function(c) { $('#sl1').removeClass(c); });
	$('#sl1').addClass(colors[skills[id].type]);

	for (var i = 0; i < skills.length; i++) {
		$('#sr' + i)[0].innerHTML = '';
	}
	$('#ssshop button').prop('disabled', false);
	$('#src' + id + ' button').prop('disabled', true);

	refresholdlevel(id);

	$('#sr' + id)[0].innerHTML = levels[skills[id].bound][lv].f - FRAGMENT_UNIT;
	$('#ssrccnt')[0].innerHTML = levels[skills[id].bound][lv].g;
	refreshspsrcbtn();
}

function slonchanged() {
	var id = $('#sl1')[0].value;
	var lv = $('#sll1')[0].value;
	$('#sr' + id)[0].innerHTML = levels[skills[id].bound][lv].f - FRAGMENT_UNIT;
	var total = 0;
	for (var i = 0; i < skills.length; i++) {
		total += Number($('#sr' + i)[0].innerHTML);
	}
	$('#ssrccnt')[0].innerHTML = levels[skills[id].bound][lv].g - (total - (levels[skills[id].bound][lv].f - FRAGMENT_UNIT));
	refreshspsrcbtn();
}

function srEdit(newVal, oldVal) {
	var diff = newVal - oldVal;
	$('#ssrccnt')[0].innerHTML = Number($('#ssrccnt')[0].innerHTML) - diff;
	refreshspsrcbtn();
}

function sronminus(v) {
	var val = Number($('#sr' + v)[0].innerHTML);
	if (val > 0) {
		var newVal = val - FRAGMENT_UNIT;
		$('#sr' + v)[0].innerHTML = newVal || '';
		var sv = Number($('#ssrccnt')[0].innerHTML);
		$('#ssrccnt')[0].innerHTML = sv + FRAGMENT_UNIT;
	}
	refreshspsrcbtn();
}

function sronplus(v) {
	$('#sr' + v)[0].innerHTML = Number($('#sr' + v)[0].innerHTML) + FRAGMENT_UNIT;
	$('#ssrccnt')[0].innerHTML = Number($('#ssrccnt')[0].innerHTML) - FRAGMENT_UNIT;
	refreshspsrcbtn();
}

// ===== Fragment Selection Handlers =====
function sfEdit() {
	// No counter to update for fragment panel
}

function sfonminus(v) {
	var val = Number($('#sf' + v)[0].innerHTML);
	if (val > 0) {
		var newVal = val - FRAGMENT_UNIT;
		$('#sf' + v)[0].innerHTML = newVal || '';
	}
}

function sfonplus(v) {
	$('#sf' + v)[0].innerHTML = Number($('#sf' + v)[0].innerHTML) + FRAGMENT_UNIT;
}

// ===== Target Selection Handler =====
function tponchanged(i) {
	var skillId = Number($('#tl' + i)[0].value);
	colors.forEach(function(c) { $('#tl' + i).removeClass(c); });
	$('#tl' + i).addClass(colors[skills[skillId].type]);
	refreshtargetlevel(i, skillId);
}

// ===== Expose onclick handlers to window =====
window.sponchanged = sponchanged;
window.slonchanged = slonchanged;
window.sronminus = sronminus;
window.sronplus = sronplus;
window.srEdit = srEdit;
window.sfonminus = sfonminus;
window.sfonplus = sfonplus;
window.sfEdit = sfEdit;
window.tponchanged = tponchanged;

// ===== Dirty Indicator =====
function refreshDirtyIndicators() {
	var srcDirty = dirtySource || dirtyFrag || dirtyKeep;
	var srcEl = $('#srcDirty')[0];
	var tgtEl = $('#tgtDirty')[0];
	var srcBtn = $('#srcDiscard')[0];
	var tgtBtn = $('#tgtDiscard')[0];
	if (srcDirty) {
		var parts = [];
		if (dirtySource) parts.push('神通#' + (Number(dirtySourceIdx) + 1));
		if (dirtyFrag) parts.push('殘卷');
		if (dirtyKeep) parts.push('保留');
		srcEl.textContent = ' (未保存: ' + parts.join(', ') + ')';
		srcEl.style.display = 'inline';
		srcBtn.style.display = 'inline';
	} else {
		srcEl.style.display = 'none';
		srcBtn.style.display = 'none';
	}
	tgtEl.style.display = dirtyTarget ? 'inline' : 'none';
	tgtBtn.style.display = dirtyTarget ? 'inline' : 'none';
}

function discardSource() {
	dirtySource = false;
	dirtySourceIdx = -1;
	dirtyFrag = false;
	dirtyKeep = false;
	refreshDirtyIndicators();
}

function discardTarget() {
	dirtyTarget = false;
	refreshDirtyIndicators();
}

window.discardSource = discardSource;
window.discardTarget = discardTarget;

// ===== jQuery Event Bindings =====

// Hidden event listeners — mark dirty if not saved
// NOTE: Bootstrap 5 fires custom events via native dispatchEvent(),
// so we must use addEventListener, not jQuery .on()
document.getElementById('ssel').addEventListener('hidden.bs.offcanvas', function() {
	if (!savedFlag && snapChanged(snapSource, snapshotSource())) {
		dirtySource = true; dirtySourceIdx = currentSourceIdx;
	}
	savedFlag = false;
	refreshDirtyIndicators();
});
document.getElementById('fsel').addEventListener('hidden.bs.offcanvas', function() {
	if (!savedFlag && snapChanged(snapFrag, snapshotFrag())) { dirtyFrag = true; }
	savedFlag = false;
	refreshDirtyIndicators();
});
document.getElementById('tsel').addEventListener('hidden.bs.offcanvas', function() {
	if (!savedFlag && snapChanged(snapTarget, snapshotTarget())) { dirtyTarget = true; }
	savedFlag = false;
	refreshDirtyIndicators();
});
document.getElementById('ksel').addEventListener('hidden.bs.offcanvas', function() {
	if (!savedFlag && snapChanged(snapKeep, snapshotKeep())) { dirtyKeep = true; }
	savedFlag = false;
	refreshDirtyIndicators();
});

// Target table row click — open target selection panel
$('#ttbl > tbody > tr').on('click', function() {
	if (!dirtyTarget) {
		for (var i = 0; i < SLOT_COUNT; i++) {
			$('#tl' + i)[0].innerHTML = '';
			colors.forEach(function(c) { $('#tl' + i).removeClass(c); });
			$('#tl' + i).addClass(colors[skills[target[i].id].type]);
			skills.forEach(function(sk) {
				var isSelected = (target[i].id === sk.id);
				$('#tl' + i)[0].innerHTML += "<option class='" + colors[sk.type] + "' value='" + sk.id + "'" + (isSelected ? "selected" : "") + ">" + getSkillDisplayName(sk) + "</option>";
			});
			$('#tll' + i)[0].innerHTML = '';
			var skill = skills[target[i].id];
			for (var j = 1; j < levels[skill.bound].length; j++) {
				var isSelected = (j === target[i].level);
				$('#tll' + i)[0].innerHTML += "<option value='" + j + "'" + (isSelected ? "selected" : "") + ">" + levels[skill.bound][j].n + "</option>";
			}
		}
	}
	targetOffcanvas = new bootstrap.Offcanvas('#tsel');
	targetOffcanvas.show();
	snapTarget = snapshotTarget();
});

// Target submit
$('#tsub').on('click', function() {
	for (var i = 0; i < SLOT_COUNT; i++) {
		target[i].id = Number($('#tl' + i)[0].value);
		target[i].level = Number($('#tll' + i)[0].value);
	}
	refreshtargetpowerview();
	computesuperpower();
	savedFlag = true;
	dirtyTarget = false;
	targetOffcanvas.hide();
	updatedatadone();
});

// Source table row click — open source selection panel
$('#stbl > tbody > tr').on('click', function() {
	var clickedIdx = String($(this).index());

	if (dirtySource && String(dirtySourceIdx) === String(clickedIdx)) {
		// Same row with unsaved changes — reopen without resetting
	} else {
		currentSourceIdx = clickedIdx;

		$('#sl1')[0].innerHTML = '';
		colors.forEach(function(c) { $('#sl1').removeClass(c); });
		$('#sl1').addClass(colors[skills[source[currentSourceIdx].id].type]);
		skills.forEach(function(sk) {
			var isSelected = (source[currentSourceIdx].id === sk.id);
			$('#sl1')[0].innerHTML += "<option class='" + colors[sk.type] + "' value='" + sk.id + "'" + (isSelected ? "selected" : "") + ">" + getSkillDisplayName(sk) + "</option>";
		});

		$('#sll1')[0].innerHTML = '';
		var skill = skills[source[currentSourceIdx].id];
		for (var j = 1; j < levels[skill.bound].length; j++) {
			var isSelected = (j === source[currentSourceIdx].level);
			$('#sll1')[0].innerHTML += "<option value='" + j + "'" + (isSelected ? "selected" : "") + ">" + levels[skill.bound][j].n + "</option>";
		}

		var srcFragMap = new Map();
		source[currentSourceIdx].src.forEach(function(item) {
			srcFragMap.set(item.id, item.amount);
		});
		$('#ssrccnt')[0].innerText = 0;

		$('#ssshop')[0].innerHTML = buildShopSelector(
			srcFragMap, source[currentSourceIdx].id, 'sronminus', 'sronplus', 'sr'
		);

		dirtySource = false;
		dirtySourceIdx = -1;
	}

	sourceOffcanvas = new bootstrap.Offcanvas('#ssel');
	sourceOffcanvas.show();
	snapSource = snapshotSource();
});

// Source submit
$('#ssub').on('click', function() {
	source[currentSourceIdx].id = Number($('#sl1')[0].value);
	source[currentSourceIdx].level = Number($('#sll1')[0].value);
	source[currentSourceIdx].src = [];
	for (var i = 0; i < skills.length; i++) {
		var cnt = Number($('#sr' + i)[0].innerHTML);
		if (cnt > 0 && source[currentSourceIdx].id !== i) {
			source[currentSourceIdx].src.push({id: i, amount: cnt});
		}
	}
	refreshsourcepowerview();
	computesuperpower();
	savedFlag = true;
	dirtySource = false;
	dirtySourceIdx = -1;
	sourceOffcanvas.hide();
	updatedatadone();
});

// Fragment row click — open fragment selection panel
$('#sfs').on('click', function() {
	if (!dirtyFrag) {
		var fragMap = new Map();
		frags.forEach(function(item) {
			fragMap.set(item.id, item.amount);
		});
		$('#ssrccnt')[0].innerText = 0;

		$('#sfshop')[0].innerHTML = buildShopSelector(
			fragMap, -1, 'sfonminus', 'sfonplus', 'sf'
		);

		$('#fragpcnt')[0].value = fragp;
		$('#fragbcnt')[0].value = fragb;
	}

	sourceOffcanvas = new bootstrap.Offcanvas('#fsel');
	sourceOffcanvas.show();
	snapFrag = snapshotFrag();
});

// Fragment submit
$('#sfsub').on('click', function() {
	frags = [];
	for (var i = 0; i < skills.length; i++) {
		var cnt = Number($('#sf' + i)[0].innerHTML);
		if (cnt > 0) {
			frags.push({id: i, amount: cnt});
		}
	}
	fragb = Number($('#fragbcnt')[0].value);
	fragp = Number($('#fragpcnt')[0].value);
	refreshsourcepowerview();
	computesuperpower();
	savedFlag = true;
	dirtyFrag = false;
	sourceOffcanvas.hide();
	updatedatadone();
});

// Keep row click — open keep selection panel
$('#skp').on('click', function() {
	if (!dirtyKeep) {
		$('#kshop')[0].innerHTML = buildKeepSelector();
	}
	keepOffcanvas = new bootstrap.Offcanvas('#ksel');
	keepOffcanvas.show();
	snapKeep = snapshotKeep();
});

// Keep submit
$('#ksub').on('click', function() {
	keep = [];
	for (var i = 0; i < skills.length; i++) {
		var cb = document.getElementById('kc' + i);
		if (cb && cb.checked) {
			keep.push(i);
		}
	}
	refreshkeepview();
	refreshsourcepowerview();
	computesuperpower();
	savedFlag = true;
	dirtyKeep = false;
	keepOffcanvas.hide();
	updatedatadone();
});

// ===== Initialize =====
function main() {
	refreshdata();
	saveToLocalStorage();
	refreshsourcepowerview();
	refreshtargetpowerview();
	refreshkeepview();
	computesuperpower();
}

main();

})();
