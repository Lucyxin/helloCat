var canvasWidth=window.innerWidth;
var canvasHeight=window.innerHeight;

var canvas=document.getElementById('myCanvas');
var ctx=canvas.getContext('2d');

canvas.width=canvasWidth;
canvas.height=canvasHeight;

//新建一个image对象
var image=new Image();
image.src='hi.jpg';
image.onload=function(){
	image.x = parseInt(canvas.width/2 - image.width/2);
	image.y = 200;
	
	ctx.drawImage(image,0,0,image.width,image.height);
	
	calculate();
	requestAnimationFrame(draw);

}

var particles=[];
function calculate(){
	//只保存100行，100列的像素值
	var cols=90,
		rows=82;
	//设置100行，100列后每个单元的宽高
	var s_width=parseInt(image.width/cols);
	var s_height=parseInt(image.height/rows);
	
	//数组中的位置
	var pos=0;
	//获取到画布上指定位置的全部像素的数据
	var data=ctx.getImageData(0,0,image.width,image.height).data;
	var now = new Date().getTime();  //获取当前时间毫秒值
	//i,j从1开始,循环判断每个单元格的第一个像素R是否满足像素值的条件,
	//若满足就把这个单元格的坐标保存到数组里，用作后续绘制图案用。
	for(var i=1;i<=cols;i++){
		for(var j=1;j<=rows;j++){
			//计算（i,j）在数组中R的坐标值
			pos=[(j*s_height-1)*image.width+(i*s_width-1)]*4;
			//判断R值是否符合要求
			if(data[pos+1]<20||data[pos+1]>110){
					var particle = {
						//x,y值都随机一下
						x: image.x + i*s_width + (Math.random() - 0.5),
						y: image.y + j*s_height + (Math.random() - 0.5),
						flotage: false
					}
					if(data[pos+1] >250 && data[pos+2] >250) {
						particle.fillStyle = 'rgb(255,255,255)';
					}else if(data[pos+1] <5 && data[pos+2] <5){
						particle.fillStyle = 'rgb(0,0,0)';
					}else if(data[pos+1] >225  && data[pos+1] < 240){
						particle.fillStyle = 'rgb(254,231,55)';
					}else if(data[pos+1] >160  && data[pos+1] < 170){
						particle.fillStyle = 'rgb(0,161,236)';
					}else if(data[pos+1] >0  && data[pos+1] < 10){
						particle.fillStyle = 'rgb(218,4,43)';
					}
					if(i%5 == 0 && j%5 == 0) {
					particle.flotage = true;
					//保存开始坐标
					particle.startX = particle.x;
					particle.startY = particle.y;
					//动画执行时间和结束时间
                    particle.startTime = now + Math.random() * 20 * 1000;
                    particle.killTime = now + Math.random() * 35*1000;
                    //x,y方向的移动速度
					particle.speedX = (Math.random() - 0.5)*3;
                    particle.speedY = (Math.random() - 0.5)*3;
				}

			//将符合要求的粒子保存到数组中
			particles.push(particle);
			}
		}

	}
	
}
function draw(){
	//清空画布
	ctx.clearRect(0,0,canvas.width,canvas.height);

	var curr_particle=null;
	var time = new Date().getTime();
	//将保存的粒子绘制到画布上
	for(var i=0;i<particles.length;i++){
		curr_particle=particles[i];
		//开始漂浮
		if(curr_particle.flotage && curr_particle.startTime < time) {
			//改变粒子位置
			curr_particle.x += curr_particle.speedX;
			curr_particle.y += curr_particle.speedY;
		} 
		//结束时间到了
	    if(curr_particle.killTime < time) {
	    	//粒子位置复原
	        curr_particle.x = curr_particle.startX;
	        curr_particle.y = curr_particle.startY;
	        //重新计算开始时间和结束时间
	        curr_particle.startTime = time + parseInt(Math.random()*20)*1000;
	        curr_particle.killTime = time + parseInt(Math.random()*35)*1000;
	    }
		ctx.fillStyle=curr_particle.fillStyle;
		//绘制粒子到画布上
		ctx.fillRect(curr_particle.x,curr_particle.y,1.5,1.5);

	}
	//重复绘制
	requestAnimationFrame(draw);
}
