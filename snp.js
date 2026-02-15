	
/******************** Data ********************/
shops = ["道蘊商店", "論劍商店", "諸天商會", "宗門寶庫", "煞海寶箱"];
bounds = ["人界", "魔界", "煞海"];
types = ["火", "劍", "雷", "百族"];
colors = ["text-danger", "text-warning", "text-primary", "text-black"];

levels = [
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
		{n:"天3", f:720, g:560, p:1420, b:3560}], // 人界
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
		{n:"天3", f:1320, g:2240, p:4750, b:11800}], // 魔界
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
		{n:"天3", f:1320, g:3920, p:6200, b:15450}] // 煞海
];

skills = [
	// 人界
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
	// 魔族
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
	// 煞海
	{id:36, name:"烈雨", shop:4, bound:2, type:3},
	{id:37, name:"冥火", shop:4, bound:2, type:3},
	{id:38, name:"業蓮", shop:4, bound:2, type:3},
	{id:39, name:"裂天", shop:4, bound:2, type:3},
];

/******************** Core Compute & Default View ********************/

function updatedatadone() {
	window.location.href = '?' + encodeURIComponent(JSON.stringify({'source':source, 'frags':frags,'fragp':fragp,'fragb':fragb,'target':target}));
}

function refreshdata() {
	d = '';
	try {
		d = JSON.parse(decodeURIComponent(window.location.search.substring(1)));
	} catch (e) {
	}

	if (d.source != undefined && d.frags != undefined && d.fragp != undefined && d.fragb != undefined && d.target != undefined) {
		source = d.source;
		frags = d.frags;
		fragp = d.fragp;
		fragb = d.fragb;
		target = d.target;
	} else {
		source = JSON.parse('[{"id":29,"level":5,"src":[{"id":18,"amount":80},{"id":22,"amount":120},{"id":31,"amount":40},{"id":34,"amount":40},{"id":37,"amount":40}],"sm":{}},{"id":26,"level":5,"src":[{"id":8,"amount":40},{"id":10,"amount":120},{"id":18,"amount":80},{"id":20,"amount":40},{"id":39,"amount":40}]},{"id":28,"level":7,"src":[{"id":0,"amount":80},{"id":8,"amount":40},{"id":10,"amount":240},{"id":15,"amount":40},{"id":19,"amount":40},{"id":20,"amount":40},{"id":21,"amount":40},{"id":30,"amount":40},{"id":31,"amount":40}]},{"id":1,"level":7,"src":[{"id":23,"amount":40},{"id":36,"amount":40},{"id":37,"amount":40}]},{"id":9,"level":10,"src":[{"id":23,"amount":40},{"id":26,"amount":80},{"id":28,"amount":200}]},{"id":11,"level":12,"src":[{"id":2,"amount":40},{"id":19,"amount":160},{"id":27,"amount":40},{"id":31,"amount":80},{"id":37,"amount":80},{"id":38,"amount":40},{"id":39,"amount":120}]}]');
		frags = JSON.parse('[{"id":8,"amount":160},{"id":9,"amount":40},{"id":26,"amount":40},{"id":29,"amount":80},{"id":35,"amount":40}]');
		fragp = 110;
		fragb = 445;
		target = JSON.parse('[{"id":26,"level":6},{"id":34,"level":6},{"id":20,"level":10},{"id":1,"level":6},{"id":32,"level":6},{"id":35,"level":7}]');
/*
		source = [
			{id:29, level:5, src:[
				{id:31, amount: 40},
				{id:18, amount: 80},
				{id:34, amount: 40},
				{id:22, amount: 120},
				{id:37, amount: 40},
			]},
			{id:26, level:5, src:[
				{id:10, amount: 120},
				{id:18, amount: 80},
				{id:20, amount: 40},
				{id:8, amount: 40},
				{id:31, amount: 40},
			]},
			{id:28, level:7, src:[
				{id:0, amount: 80},
				{id:10, amount: 240},
				{id:8, amount: 40},
				{id:31, amount: 40},
				{id:30, amount: 40},
				{id:19, amount: 40},
				{id:18, amount: 40},
				{id:21, amount: 40},
				{id:20, amount: 40},
			]},
			{id:1, level:7, src:[
				{id:19, amount: 40},
				{id:37, amount: 40},
				{id:36, amount: 40}
			]},
			{id:9, level:10, src:[
				{id:26, amount: 120},
				{id:28, amount: 200},
			]},
			{id:11, level:12, src:[
				{id:27, amount: 40},
				{id:15, amount: 40},
				{id:31, amount: 80},
				{id:19, amount: 160},
				{id:37, amount: 80},
				{id:38, amount: 40},
				{id:39, amount: 120},
			]},
		];

		frags = [
			{id:29, amount: 80},
			{id:26, amount: 40},
			{id:8, amount: 160},
			{id:9, amount: 40},
		]
		fragp = 110;
		fragb = 445;

		target = [
			{id:11, level:10},
			{id:26, level:6},
			{id:10, level:10},
			{id:1, level:6} ,
			{id:9, level:11},
			{id:11, level:12},
		]
			*/
	}
}

function refreshsourcepowerview() {
	// load source power
	a = 0, b = 0, c = fragp, d = fragb;
	for (i = 0; i < 6; i++) {
		sk = skills[source[i].id];
		lv = levels[sk.bound][source[i].level];
		$('#sname' + i)[0].innerText = sk.name;
		colors.forEach(function(it) {
			$('#sname' + i).removeClass(it);
		});
		$('#sname' + i).addClass(colors[sk.type]);
		$('#slevel' + i)[0].innerText = lv.n;
		$('#ssrc1' + i)[0].innerHTML = lv.f - 40;
		a += lv.f - 40;
		$('#ssrc2' + i)[0].innerHTML = '';
		for (j = 0; j < source[i].src.length; j++) {
			$('#ssrc2' + i)[0].innerHTML += skills[source[i].src[j].id].name + "(" + source[i].src[j].amount + ") ";
			b += source[i].src[j].amount;
			if ((j + 1) % 3 == 0)
				$('#ssrc2' + i)[0].innerHTML += "<br/>";
		}
		$('#ssrc3' + i)[0].innerHTML = lv.p;
		c += lv.p;
		$('#ssrc4' + i)[0].innerHTML = lv.b;
		d += lv.b;
	}
	frags.forEach(function(it) {
		b += it.amount;
	});
	$('#ssrc28')[0].innerHTML = '';
	frags.forEach(function(i) {
		$('#ssrc28')[0].innerHTML += skills[i.id].name + "(" + i.amount + ") ";
	});
	$('#ssrc38')[0].innerHTML = fragp;
	$('#ssrc48')[0].innerHTML = fragb;
	$('#ssrc17')[0].innerHTML = a;
	$('#ssrc27')[0].innerHTML = b;
	$('#ssrc37')[0].innerHTML = c;
	$('#ssrc47')[0].innerHTML = d;
}

function refreshtargetpowerview() {
	a = b = c = d = 0;
	for (i = 0; i < 6; i++) {
		sk = skills[target[i].id];
		lv = levels[sk.bound][target[i].level];
		$('#tname' + i)[0].innerText = sk.name;
		colors.forEach(function(it) {
			$('#tname' + i).removeClass(it);
		});
		$('#tname' + i).addClass(colors[sk.type]);
		$('#tlevel' + i)[0].innerText = lv.n;
		$('#tsrc1' + i)[0].innerText = lv.f - 40;
		a += lv.f - 40;
		$('#tsrc2' + i)[0].innerText = lv.g;
		b += lv.g;
		$('#tsrc3' + i)[0].innerText = lv.p;
		c += lv.p;
		$('#tsrc4' + i)[0].innerText = lv.b;
		d += lv.b;
	}
	$('#tsrc17')[0].innerHTML = a;
	$('#tsrc27')[0].innerHTML = b;
	$('#tsrc37')[0].innerHTML = c;
	$('#tsrc47')[0].innerHTML = d;
}

function computesuperpower() {
	tg = 0;
	tp = fragp;
	tb = fragb;

	strch = '', strlk = '', strrm = '';
	// 1.1. 统计碎片(金)
	sm = new Map();
	for (i = 0; i < frags.length; i++) {
		if (sm.get(frags[i].id) == undefined)
			sm.set(frags[i].id, 0);
		sm.set(frags[i].id, sm.get(frags[i].id) + frags[i].amount);
		tg += frags[i].amount;
	}
	// 1.2. 统计现有神通
	for (i = 0; i < 6; i++) {
		sk = skills[source[i].id];
		lv = levels[sk.bound][source[i].level];
		if (sm.get(sk.id) == undefined)
			sm.set(sk.id, 0);
		sm.set(sk.id, sm.get(sk.id) + lv.f - 40);
		tg += lv.f - 40;
		tp += lv.p;
		tb += lv.b;
		for (j = 0; j < source[i].src.length; j++) {
			if (sm.get(source[i].src[j].id) == undefined)
				sm.set(source[i].src[j].id, 0);
			sm.set(source[i].src[j].id, sm.get(source[i].src[j].id) + source[i].src[j].amount);
			tg += source[i].src[j].amount;
		}
	}
	// 2.1. 估算需要的神通本体
	tmptgt = JSON.parse(JSON.stringify(target));
	
	tmptgt.forEach(function(it) {
		sk = skills[it.id];
		lv = levels[sk.bound][it.level];
		it.body = lv.f - 40;
		it.frag = lv.g;
		it.purple = lv.p;
		it.blue = lv.b;
		if (sm.get(it.id) != undefined) {
			used = Math.min(sm.get(it.id), it.body);
			sm.set(it.id, sm.get(it.id) - used);
			it.body -= used;
			tg -= used;
		}
	});
	// 2.2. 估算神通碎片 (目标神通)
	t = 0;
	tmptgt.forEach(function(it) {
		sk = skills[it.id];
		sm.forEach (function(v, k) {
			if (it.body == 0)
				return;
			if (v > 0 && it.id != k && skills[k].shop == sk.shop) {
				used = Math.min(it.body, v);
				strch += skills[k].name + " x" + (used / 40) + " 轉換 " + skills[it.id].name + "<br />";
				t += used / 40;
				sm.set(k, sm.get(k) - used);
				it.body -= used;
				tg -= used;
			}	
		});
	});
	strch += "共轉換 " + t + " 次<br />";
	// 2.3. 估算神通碎片 (非目标神通)
	tmptgt.forEach(function(it) {
		sk = skills[it.id];
		sm.forEach (function(v, k) {// 懒得优化先用平方复杂度的僕素做法Orz
			if (it.frag == 0)
				return;
			if (v > 0) {
				used = Math.min(it.frag, v);
				sm.set(k, sm.get(k) - used);
				it.frag -= used;
				tg -= used;
			}
		});
		if (it.purple > 0) {
			used = Math.min(it.purple, tp);
			it.purple -= used;
			tp -= used;
		}
		if (it.blue > 0) {
			used = Math.min(it.blue, tb);
			it.blue -= used;
			tb -= used;
		}
	});
	// 3 更新结果
	b = c = d = 0;
	tmptgt.forEach(function(it) {
		if (it.body > 0) {
			strlk += "缺少 " + skills[it.id].name + "(" + it.body + ")<br />";
		}
		if (it.frag > 0)
			b += it.frag;
		if (it.purple > 0)
			c += it.purple;
		if (it.blue > 0)
			d += it.blue;
		console.log(skills[it.id].name, it.body, it.frag, it.purple, it.blue);
	});
	strlk += "缺少仙品殘卷: " + b + "<br />";
	strlk += "缺少極品殘卷: " + c + "<br />";
	strlk += "缺少上品殘卷: " + d + "<br />";
	console.log("================================================");
	strrm += "剩餘仙品殘卷: " + tg + "<br />";
	sm.forEach (function(v, k) {
		if (v > 0) {
			console.log(k, v);
			strrm += " - " + skills[k].name + "(" + v + ")<br/>";
		}
	});
	strrm += "剩餘極品殘卷: " + tp + "<br />";
	strrm += "剩餘上品殘卷:  " + tb + "<br />";
	
	$('#tsum')[0].innerHTML = strch + "<br />" + strlk + "<br />" + strrm;
	
	//$('#tst')[0].value = '?' + encodeURIComponent(JSON.stringify({'source':source, 'frags':frags,'fragp':fragp,'fragb':fragb,'target':target}));
}

/******************** Input Processing ********************/

// 选择目标神通画面 - 打开
$('#ttbl > tbody > tr').on('click', function (e) {
	for (i = 0; i < 6; i++) {
		$('#tl' + i)[0].innerHTML = '';
		colors.forEach(function(it) {
			$('#tl' + i).removeClass(it);
		});
		$('#tl' + i).addClass(colors[skills[target[i].id].type]);
		skills.forEach(function(it) {
			sk = skills[it.id];
			issel = target[i].id == sk.id;
			name = sk.name + (sk.bound ? " (魔)" : "");		
			$('#tl' + i)[0].innerHTML += "<option class='" + colors[sk.type] + "' value='" + it.id + "'" + (issel ? "selected" : "") + ">" + name + "</option>";
		});
		$('#tll' + i)[0].innerHTML = '';
		sk = skills[target[i].id];
		for (j = 1; j < levels[sk.bound].length; j++) {
			lv = levels[sk.bound][source[i].level];
			issel = j == target[i].level;
			$('#tll' + i)[0].innerHTML += "<option value='" + j + "'" + (issel ? "selected" : "") + ">" + levels[sk.bound][j].n + "</option>";
		}
	}
	bsOffcanvas = new bootstrap.Offcanvas('#tsel');
	bsOffcanvas.show();
});

// 选择目标神通画面 - 完成
$('#tsub').on('click', function(e) {
	for (i = 0; i < 6; i++) {
		target[i].id = Number($('#tl' + i)[0].value);
		target[i].level = Number($('#tll' + i)[0].value);
	}
	refreshtargetpowerview();
	computesuperpower();
	bsOffcanvas.hide();
	updatedatadone();
});

// 选择目標神通画面 - 選擇改變
function tponchanged(i) {
	j = Number($('#tl' + i)[0].value);
	colors.forEach(function(it) {
		$('#tl' + i).removeClass(it);
	});
	$('#tl' + i).addClass(colors[skills[j].type]);
}

// 选择现有神通画面 - 打开
$('#stbl > tbody > tr').on('click', function (e) {
	oid = e.target.id;
	idx = oid[oid.length - 1];
	$('#sl1')[0].innerHTML = '';
	colors.forEach(function(it) {
		$('#sl1').removeClass(it);
	});
	$('#sl1').addClass(colors[skills[source[idx].id].type]);
	skills.forEach(function(it) {
		sk = skills[it.id];
		issel = source[idx].id == sk.id;
		name = sk.name + (sk.bound ? " (魔)" : "");		
		$('#sl1')[0].innerHTML += "<option class='" + colors[sk.type] + "' value='" + it.id + "'" + (issel ? "selected" : "") + ">" + name + "</option>";
	});
	$('#sll1')[0].innerHTML = '';
	sk = skills[source[idx].id];
	for (j = 1; j < levels[sk.bound].length; j++) {
		lv = levels[sk.bound][source[idx].level];
		issel = j == source[idx].level;
		$('#sll1')[0].innerHTML += "<option value='" + j + "'" + (issel ? "selected" : "") + ">" + levels[sk.bound][j].n + "</option>";
	}
	sm = new Map();
	source[idx].src.forEach(function(it) {
		sm.set(it.id, it.amount);
	});
	$('#ssrccnt')[0].innerText = 0;

	// 显示现有神通材料选择画面
	sks = tmptgt = JSON.parse(JSON.stringify(skills));
	sks.sort(function(a, b) {
		if (a.shop == b.shop && a.bound == b.bound && a.type == b.type)
			return a.id - b.id;
		if (a.shop == b.shop && a.bound == b.bound)
			return a.type - b.type;
		if (a.shop == b.shop)
			return a.bound - b.bound;
		return a.shop - b.shop;
	});
	strhtml = '<div class="row">';
	for (i = 0; i < sks.length; i+=9) {
		strhtml += '<div class="col col-md-6 px-2 mx-0 my-1 border align-start" style="min-width:120px; background-color: rgba(255, 255, 255, 0.9);"><h6 class="my-1">' + shops[sks[i].shop] + ' ' + '</h6><hr class="divider my-2">';
		for (j = i; j < Math.min(i + 9, sks.length); j++) {
			amount = sm.get(sks[j].id) == undefined ? "" : sm.get(sks[j].id);
			isdis = source[idx].id == sks[j].id ? " disabled" : "";
			if (isdis)
				amount = levels[skills[source[idx].id].bound][source[idx].level].f - 40;
			strhtml += '<p id="src' + sks[j].id + '" class="text-start mb-1"><span class=' + colors[sks[j].type] + '>' + sks[j].name + '</span>';
			strhtml += ' <button onclick="sronminus(' +  + sks[j].id + ')"' + isdis + '>-</button><button onclick="sronplus(' +  + sks[j].id + ')"' + isdis + '>+</button>';
			strhtml += ' <span id="sr' + sks[j].id + '" class="badge text-bg-secondary">' + amount + '</span>';
		}
		strhtml += '</div>';
	}
	strhtml += '</div>';
	$('#ssshop')[0].innerHTML = strhtml;

	// 最后打开画面
	bsOffcanvas0 = new bootstrap.Offcanvas('#ssel');
	bsOffcanvas0.show();
});

// 更新送出按钮 (选择现有神通画面)
function refreshspsrcbtn() {
	$('#ssub').prop('disabled', Number($('#ssrccnt')[0].innerHTML) != 0);
}

// 选择现有神通画面 - 改變选择
function sponchanged() {
	// 修改顏色
	id = $('#sl1')[0].value;
	lv = $('#sll1')[0].value;
	colors.forEach(function(it) {
		$('#sl1').removeClass(it);
	});
	console.log(colors[skills[id].type]);
	$('#sl1').addClass(colors[skills[id].type]);
	// 清除材料
	for (i = 0; i < 40; i++)
		$('#sr' + i)[0].innerHTML = '';
	// 禁用启用本体选择
	$('#ssshop button').prop('disabled', false);
	$('#src' + id + ' button').prop('disabled', true);
	// 更新本体, 剩余数量
	$('#sr' + id)[0].innerHTML = levels[skills[id].bound][lv].f - 40;
	$('#ssrccnt')[0].innerHTML = levels[skills[id].bound][lv].g;
	
	refreshspsrcbtn();
}
// 选择现有神通画面 - 选择等级
function slonchanged() {
	id = $('#sl1')[0].value;
	lv = $('#sll1')[0].value;
	// 更新本体数量
	$('#sr' + id)[0].innerHTML = levels[skills[id].bound][lv].f - 40;
	// 更新剩余数量
	a = 0;
	for (i = 0; i < 40; i++)
		a += new Number($('#sr' + i)[0].innerHTML);	
	$('#ssrccnt')[0].innerHTML = levels[skills[id].bound][lv].g - (a - (levels[skills[id].bound][lv].f - 40));

	refreshspsrcbtn();
}

// 选择现有神通画面 - 减少碎片
function sronminus(v) {
	val = Number($('#sr' + v)[0].innerHTML);
	if (val > 0) {
		$('#sr' + v)[0].innerHTML = val - 40; 
		sv = Number($('#ssrccnt')[0].innerHTML);
		$('#ssrccnt')[0].innerHTML = sv + 40;
	}
	
	refreshspsrcbtn();
}

// 选择现有神通画面 - 新增碎片
function sronplus(v) {
	$('#sr' + v)[0].innerHTML = Number($('#sr' + v)[0].innerHTML) + 40; 
	$('#ssrccnt')[0].innerHTML = Number($('#ssrccnt')[0].innerHTML) - 40;
	
	refreshspsrcbtn();
}

// 选择现有神通画面 - 完成
$('#ssub').on('click', function(e) {
	source[idx].id = Number($('#sl1')[0].value);
	source[idx].level = Number($('#sll1')[0].value);
	source[idx].src = [];
	for (i = 0; i < 40; i++) {
		cnt = Number($('#sr' + i)[0].innerHTML);
		if (cnt > 0 && source[idx].id != i)
			source[idx].src.push({id:i, amount:cnt});
	}

	refreshsourcepowerview();
	computesuperpower();
	bsOffcanvas0.hide();
	updatedatadone();
});

//////////////////////////////////////////////

// 选择现有碎片画面 - 打开
$('#sfs').on('click', function (e) {
	sm = new Map();
	frags.forEach(function(it) {
		sm.set(it.id, it.amount);
	});
	$('#ssrccnt')[0].innerText = 0;

	// 显示现有神通材料选择画面
	sks = tmptgt = JSON.parse(JSON.stringify(skills));
	sks.sort(function(a, b) {
		if (a.shop == b.shop && a.bound == b.bound && a.type == b.type)
			return a.id - b.id;
		if (a.shop == b.shop && a.bound == b.bound)
			return a.type - b.type;
		if (a.shop == b.shop)
			return a.bound - b.bound;
		return a.shop - b.shop;
	});
	strhtml = '<div class="row">';
	for (i = 0; i < sks.length; i+=9) {
		strhtml += '<div class="col col-md-6 px-2 mx-0 my-1 border align-start" style="min-width:120px; background-color: rgba(255, 255, 255, 0.9);"><h6 class="my-1">' + shops[sks[i].shop] + ' ' + '</h6><hr class="divider my-2">';
		for (j = i; j < Math.min(i + 9, sks.length); j++) {
			amount = sm.get(sks[j].id) == undefined ? "" : sm.get(sks[j].id);
			strhtml += '<p id="src' + sks[j].id + '" class="text-start mb-1"><span class=' + colors[sks[j].type] + '>' + sks[j].name + '</span>';
			strhtml += ' <button onclick="sfonminus(' +  + sks[j].id + ')">-</button><button onclick="sfonplus(' +  + sks[j].id + ')">+</button>';
			strhtml += ' <span id="sf' + sks[j].id + '" class="badge text-bg-secondary">' + amount + '</span>';
		}
		strhtml += '</div>';
	}
	strhtml += '</div>';
	$('#sfshop')[0].innerHTML = strhtml;

	$('#fragpcnt')[0].value = fragp;
	$('#fragbcnt')[0].value = fragb;
	
	// 最后打开画面
	bsOffcanvas0 = new bootstrap.Offcanvas('#fsel');
	bsOffcanvas0.show();
});

// 选择现有碎片画面 - 减少碎片
function sfonminus(v) {
	val = Number($('#sf' + v)[0].innerHTML);
	if (val > 0)
		$('#sf' + v)[0].innerHTML = val - 40; 
}

// 选择现有碎片画面 - 新增碎片
function sfonplus(v) {
	$('#sf' + v)[0].innerHTML = Number($('#sf' + v)[0].innerHTML) + 40; 
}

// 选择现有碎片画面 - 完成
$('#sfsub').on('click', function(e) {
	frags = [];
	for (i = 0; i < 40; i++) {
		cnt = Number($('#sf' + i)[0].innerHTML);
		if (cnt > 0)
			frags.push({id:i, amount:cnt});
	}
	
	fragb = Number($('#fragbcnt')[0].value);
	fragp = Number($('#fragpcnt')[0].value);

	refreshsourcepowerview();
	computesuperpower();
	bsOffcanvas0.hide();
	updatedatadone();
});

function main() {	
	refreshdata();
	refreshsourcepowerview();
	refreshtargetpowerview();
	computesuperpower();
}

main();
