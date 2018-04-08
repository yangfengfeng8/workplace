
COL = 8;
ROW = 8;
MAX = 92;
CONVERT = 100;

var body = document.getElementById("control-main");
var con_table = document.getElementById("control");
var hDebug = document.getElementById("debug"); 
var spinBox = document.getElementById("control_val");
var send = document.getElementById("control_send");
send.onclick = sendData;

body.addEventListener("mouseup", body_mouseup, false);
body.addEventListener("keydown", body_keydown, false);
body.addEventListener("keyup", body_keyup, false);

var mouse_down_flag = 0;
var start =  0;
var leave_obj = {};
var select_model = {};

var th_start = 0;
var th_leave = 0;
var th_mouse_down = 0;
var th_select_model = {};

var ctrl_flag = 0;

(function(){
	addThead();
	for (var i = 0; i < ROW; i++){
		addRow(i);
	}
})();

function addThead(){
	var tr = document.createElement("tr");
	var thead = document.createElement("thead");
	var th = document.createElement("th");
	th.direction = "concer";
	th.addEventListener("mousedown", concer_mousedown, false);
	th.addEventListener("mouseup", concer_mouseup, false);
	tr.appendChild(th);
	for (var i = 0; i < COL; i++){
		var th = document.createElement("th");
		th.innerHTML = "B" + (i + 1);
		th.id = i;
		th.direction = "horizontal";
		th.addEventListener("mousedown", th_mousedown, false);
		th.addEventListener("mouseup", th_mouseup, true);
		th.addEventListener("mouseenter", th_mouseenter, false);
		th.addEventListener("mouseleave", th_mouseleave, false);
		tr.appendChild(th);
	}
	thead.appendChild(tr);
	con_table.appendChild(thead);
}

function addRow(row){
	var tr = document.createElement("tr");
	var th = document.createElement("th");
	th.innerHTML = "A" + (row + 1);
	th.id = row + CONVERT;
	th.direction = "vertical";
	th.addEventListener("mousedown", th_mousedown, false);
	th.addEventListener("mouseup", th_mouseup, true);
	th.addEventListener("mouseenter", th_mouseenter, false);
	th.addEventListener("mouseleave", th_mouseleave, false);
	tr.appendChild(th);
	for (var i = 0; i < COL; i++){
		var td = document.createElement("td");
		td.innerHTML = "" + MAX;
		td.id = "" + (row * COL + i);
		td.addEventListener("mousedown", td_mousedown, false);
		td.addEventListener("mouseup", td_mouseup, true);
		td.addEventListener("mouseenter", td_mouseenter, false);
		td.addEventListener("mouseleave", td_mouseleave, false);
		tr.appendChild(td);
	}
	con_table.appendChild(tr);
}

function get_select_item(element, id){
	var obj = {};
	obj.row = parseInt(id / ROW);
	obj.col = id % COL;
	obj.id = id;
	obj.element = element;
	return obj;
}

function add_select_item(element, id){
	if (select_model[id] != undefined){
		return ;
	}
	element.className = "active";
	select_model[id] = get_select_item(element, id);
}

function del_select_item(id){
	if (select_model[id] == undefined){
		console.log("del select item: "+id);
		return ;
	}
	var element = select_model[id].element;
	element.className = "";
	select_model[id] = undefined;
	delete select_model[id];
}

function clear_select_item(){
	for (id in select_model){
		del_select_item(id);
	}
}

function max(val1, val2){
	return val1 > val2 ? val1 : val2;
}

function min(val1, val2){
	return val1 > val2 ? val2 : val1;
}

function td_mousedown(e){
	if (e.button != 0){
		return ;
	}
	mouse_down_flag = 1;
	if (ctrl_flag == 0){
		clear_select();
		clear_select_item();
	}
	start = parseInt(e.target.id);
	if (ctrl_flag == 0){
		add_select_item(e.target, start);		
	}
	else {
		console.log("class name: "+e.target.className);
		if (e.target.className == ""){
			add_select_item(e.target, start);
		}
		else {
			del_select_item(e.target.id);
		}
	}
}

function td_mouseup(e){
	mouse_down_flag = 0;	
}

function td_mouseenter(e){
	if (mouse_down_flag == 0){
		return ;
	}
	var cur = parseInt(e.target.id);
	var obj = get_select_item(e.target, cur);
		
	var startObj = select_model[start];
	
	if (startObj == undefined){
		return ;
	}
	
	for (var i = min(leave_obj.row, startObj.row); i <= max(startObj.row, leave_obj.row); i++){
		for (var j=min(leave_obj.col, startObj.col); j <= max(startObj.col, leave_obj.col); j++){
			console.log("id: "+(i * COL + j));
			if (i * COL+ j == parseInt(start)){
				continue;
			}
			del_select_item(i * COL + j);
		}
	}
	
	for (var i = min(startObj.row, obj.row); i <= max(obj.row, startObj.row); i++){
		for (var j = min(startObj.col, obj.col); j <= max(obj.col, startObj.col); j++){
			add_select_item(con_table.rows[i + 1].cells[j + 1], i * COL + j);
			console.log(con_table.rows[i + 1].cells[j + 1].id);
		}
	}
}

function td_mouseleave(e){
	if (mouse_down_flag == 0){
		return ;
	}
	var cur = parseInt(e.target.id);
	leave_obj = get_select_item(e.target, cur);	
}

function select_row(element, row){
	for (var i=0; i < COL; i++){
		add_select_item(con_table.rows[row + 1].cells[i + 1], row * COL + i);
	}
	element.className = "active";
	th_select_model[row + CONVERT] = element;
}

function select_col(element, col){
	for (var i=0; i < ROW; i++){
		add_select_item(con_table.rows[i + 1].cells[col + 1], i * COL + col);
	}
	element.className = "active";
	th_select_model[col] = element;
}

function cancel_select_row(element, row){
	for (var i=0; i < COL; i++){
		del_select_item(row * COL + i);
	}
	element.className = "";
	delete th_select_model[row + CONVERT];
}

function cancel_select_col(element, col){
	for (var i=0; i < ROW; i++){
		del_select_item(i * COL + col);
	}
	element.className = "";
	delete th_select_model[col];
}

function clear_select(){
	for (x in th_select_model){
		if (x >= CONVERT){
			cancel_select_row(con_table.rows[x - CONVERT + 1].cells[0], x - CONVERT);
		}
		else {
			cancel_select_col(con_table.rows[0].cells[parseInt(x) + 1], parseInt(x));
		}
	}
}

function th_mousedown(e){
	if (e.button != 0){
		return ;
	}
	if (ctrl_flag == 0){
		clear_select();
		clear_select_item();		
	}
	
	th_mouse_down = 1;
	var obj =  e.target;
	th_start = parseInt(obj.id);
	if (th_start >= CONVERT){
		if (ctrl_flag == 0){
			select_row(obj, th_start - CONVERT);	
		}
		else {
			console.log("class name: "+e.target.className);
			if (e.target.className == ""){
				select_row(obj, th_start - CONVERT);
			}
			else {
				cancel_select_row(obj, th_start - CONVERT);
			}
		}
	}
	else {
		if (ctrl_flag == 0){
			select_col(obj, th_start);	
		}
		else {
			console.log("class name: "+e.target.className);
			if (e.target.className == ""){
				select_col(obj, th_start);
			}
			else {
				cancel_select_col(obj, th_start);
			}
		}
	}
}

function th_mouseup(e){
	th_mouse_down = 0;	
	mouse_down_flag = 0;
}

function th_mouseenter(e){
	if (th_mouse_down == 0){
		return ;
	}
	var id = parseInt(e.target.id);
	if ((th_start < CONVERT && id < CONVERT) || (th_start >= CONVERT && id >= CONVERT)){
		if (th_start < CONVERT){
			for (var i = min(th_leave, id); i <= max(th_leave, id); i++){
				cancel_select_col(con_table.rows[0].cells[i + 1], i);
			}
			
			for (var i = min(th_start, id); i <= max(th_start, id); i++){
				select_col(con_table.rows[0].cells[i + 1], i);
			}
		}
		else {
			for (var i = min(th_leave, id); i <= max(th_leave, id); i++){
				cancel_select_row(con_table.rows[i + 1 - CONVERT].cells[0], i - CONVERT);
			}
			
			for (var i = min(th_start, id); i <= max(th_start, id); i++){
				select_row(con_table.rows[i + 1 - CONVERT].cells[0], i - CONVERT);
			}
		}
	}
}

function th_mouseleave(e){
	if (th_mouse_down == 0){
		return ;
	}
	var id = parseInt(e.target.id);
	
	if ((th_start < CONVERT && id < CONVERT) || (th_start >= CONVERT && id >= CONVERT)){
		th_leave = id;
	}
}

function concer_mousedown(e){
	if (e.button != 0){
		return ;
	}
	e.target.className = "active";
}

function concer_mouseup(e){
	if (e.button != 0){
		return ;
	}
	for (var i = 0; i < COL; i++){
		con_table.rows[0].cells[i + 1].className = "active";
		th_select_model[i] = con_table.rows[0].cells[i + 1];
	}
	for (var i  = 0; i < ROW; i++){
		select_row(con_table.rows[i + 1].cells[0], i);
	}
	e.target.className = "";
}

function body_mouseup(e){
	if (e.button != 0){
		return false;
	}
	th_mouse_down = 0;	
	mouse_down_flag = 0;
	
	if (e.target.id == "control_send"){
		return false;
	}
	
	var x;
	for (x in select_model);
	
	if (select_model[x] == undefined){
		return ;
	}
	
	spinBox.value = select_model[x].element.innerHTML;
	spinBox.focus();
	spinBox.select();
}

function body_keydown(e){
	console.log(e.keyCode);
	if (e.keyCode == 17){	//ctrl pressed;
		ctrl_flag = 1;
	}
}

function body_keyup(e){
	if (e.keyCode == 17){
		ctrl_flag = 0;
	}
	if (e.keyCode == 13){
		sendData();
	}
}

function sendData(){
	console.log("send");
	if (parseInt(spinBox.value) > 127){
			spinBox.value = 127;
		}
		for (var x in select_model){
			select_model[x].element.innerHTML = spinBox.value;
		}
		
		spinBox.focus();
		spinBox.select();
		
		//send data;
}


