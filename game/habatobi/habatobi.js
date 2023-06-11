
var inter1=0;
var joutai=1;

var speed=10;
var gage="";

var ground=80;

var pos_x=40, pos_y=ground;
var degree=21;
var omega=3;

var pi = Math.PI/180;

var vx=0, vy=0;

function Action1(){
	switch(joutai){
	case 0: break;
	case 1: joutai=2; clearInterval(inter1);
			inter1=setInterval('SpeedBar();',10); break;
	case 2: break;
	case 3: joutai=4; TakeOff(); break;
	case 4: break;
	default:joutai=0; break;
	}
	return;
}

function Action2(){
	switch(joutai){
	case 0: Reset(); break;
	case 1: break;
	case 2: joutai=3;  speed/=4;
			clearInterval(inter1);
			inter1=setInterval('Dash();',50); break;
	case 3: break;
	case 4: joutai=0;
			vx=speed; vy=-speed*Math.sin(degree*2*pi);
			clearInterval(inter1);
			inter1=setInterval('Jump();',50); break;
	default:joutai=0; break;
	}
	return;
}

function Reset(){
	joutai=1; clearInterval(inter1);
	speed=20;
	gage="";
	pos_x=40; pos_y=ground;
	degree=21; omega=3;
	if(document.layers){
		document.layers["lay0"].moveTo(pos_x,pos_y);
		document.layers["lay0"].visibility='show';
		for(i=0;i<3;i++)
			document.layers["angle"+i].visibility='hide';
	}else if((document.getElementById) && (!document.all)){
		document.getElementById("lay0").style.left = pos_x;
		document.getElementById("lay0").style.top = pos_y;
		document.getElementById("lay0").style.visibility='visible';
		for(i=0;i<3;i++)
			document.getElementById("angle"+i).style.visibility='hidden';
	}else if(document.all){
		document.all("lay0").style.pixelLeft = pos_x;
		document.all("lay0").style.pixelTop = pos_y;
		document.all("lay0").style.visibility='visible';
		for(i=0;i<3;i++)
			document.all("angle"+i).style.visibility='hidden';
	}
	SpeedBar();
	return;
}

function SpeedBar(){
	if(speed>=80){
		speed=20;
		gage="";
	}
	if(document.layers){
		document["bar1"].document.open("text/html");
		document["bar1"].document.write(gage);
		document["bar1"].document.close();
	}else if((document.getElementById) && (!document.all)){
		document.getElementById("bar1").innerHTML = gage;
	}else if(document.all){
		window["bar1"].innerText = gage;
	}
	speed++;
	gage+="|";
	return;
}

function Dash(){
	pos_x+=speed;
	if(document.layers){
		document.layers["lay0"].moveTo(pos_x,pos_y);
	}else if((document.getElementById) && (!document.all)){
		document.getElementById("lay0").style.left = pos_x;
		document.getElementById("lay0").style.top = pos_y;
	}else if(document.all){
		document.all("lay0").style.pixelLeft = pos_x;
		document.all("lay0").style.pixelTop = pos_y;
	}

	if(joutai==3 && pos_x>220){
		pos_x=220;
		joutai=5;
		Finish();
	}else if(pos_x>700){
		if(document.layers){
			document.layers["lay0"].visibility='hide';
			document.layers["lay0"].moveTo(0,0);
		}else if((document.getElementById) && (!document.all)){
			document.getElementById("lay0").style.visibility='hidden';
			document.getElementById("lay0").style.left = 0;
			document.getElementById("lay0").style.top = 0;
		}else if(document.all){
			document.all("lay0").style.visibility='hidden';
			document.all("lay0").style.pixelLeft = 0;
			document.all("lay0").style.pixelTop = 0;
		}
	clearInterval(inter1);
	}
	return;
}

function TakeOff(){
	if(document.layers){
		for(i=0;i<3;i++)
			document.layers["angle"+i].visibility='show';
	}else if((document.getElementById) && (!document.all)){
		for(i=0;i<3;i++)
			document.getElementById("angle"+i).style.visibility='visible';
	}else if(document.all){
		for(i=0;i<3;i++)
			document.all("angle"+i).style.visibility='visible';
	}
	clearInterval(inter1);
	inter1=setInterval('Angle();',30);
	return;
}

function Angle(){
var i;

var rx = 16*Math.cos(degree*pi);
var ry = 16*Math.sin(degree*pi);

	degree+=omega;
	if(document.layers){
		for(i=0;i<3;i++)
		document.layers["angle"+i].moveTo(rx*i+pos_x+50,-ry*i+pos_y+40);
	}else if((document.getElementById) && (!document.all)){
		for(i=0;i<3;i++){
			document.getElementById("angle"+i).style.left = rx*i+pos_x+40;
			document.getElementById("angle"+i).style.top = -ry*i+pos_y+50;
		}
	}else if(document.all){
		for(i=0;i<3;i++){
			document.all("angle"+i).style.pixelLeft = rx*i+pos_x+40;
			document.all("angle"+i).style.pixelTop = -ry*i+pos_y+50;
		}
	}
	if(degree<=21 || degree>=69) omega=-omega;
	return;
}

function Jump(){
	pos_x+=vx;
	pos_y+=vy;
	if(document.layers){
		document.layers["lay0"].moveTo(pos_x,pos_y);
	}else if((document.getElementById) && (!document.all)){
			document.getElementById("lay0").style.left = pos_x;
			document.getElementById("lay0").style.top = pos_y;
	}else if(document.all){
			document.all("lay0").style.pixelLeft = pos_x;
			document.all("lay0").style.pixelTop = pos_y;
	}
	if(pos_y>=ground) Finish();
	vy+=2;
	return;
}

function Finish(){

	var dist=Math.floor((pos_x-220)/2);
	pos_y=ground;
	if(dist<0) dist=0;
	
	if(document.layers){
		document.layers["point"].moveTo(pos_x+30,pos_y+50);
		document.layers["point"].visibility='show';
		document["distance"].document.open("text/html");
		document["distance"].document.write(dist/25);
		document["distance"].document.close();
	}else if((document.getElementById) && (!document.all)){
		document.getElementById("point").style.left = pos_x+30;
		document.getElementById("point").style.top = pos_y+50;
		document.getElementById("point").style.visibility='visible';
		document.getElementById("distance").innerHTML = dist/25;
	}else if(document.all){
		document.all("point").style.pixelLeft = pos_x+30;
		document.all("point").style.pixelTop = pos_y+50;
		document.all("point").style.visibility='visible';
		window["distance"].innerText = dist/25;
	}
	clearInterval(inter1);
	inter1 = setInterval('Dash();',50);
}

