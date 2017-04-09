var game={
	data:null,//保存RN行，CN列的二维数组
	RN:4, CN:4,
	score:0,
	state:1,
	GAMEOVER:0,
	RUNNING:1,
	//强调:
	//1. 每个属性和方法结尾都用逗号分隔
	//2. 方法中使用自己的属性都必须前加this.
	start:function(){
		//重置游戏状态为RUNNING
		this.state=this.RUNNING;
		this.score=0;//将score重置为0
		//初始化RN*CN的二维数组，保存到data属性中
		//创建空数组保存在data属性中
		this.data=[];
		for(var r=0;r<this.RN;r++){
			this.data.push([]);//向data中压入一个空数组
			//c从0开始，到<CN结束
			for(var c=0;c<this.CN;c++){
				this.data[r].push(0);//向data中r行压入一个0
			}
		}//(遍历结束)
		this.randomNum();
		this.randomNum();
		this.updateView();
		//debugger;//F12: 鼠标放到任意关心的变量或属性
		//console.log(this.data.join("\n"));
		//为document绑定键盘按下事件
			//当键盘按下时自动执行该函数
		document.onkeydown=function(e){
			//事件处理函数中: this->.前的对象document
			//bind将this->game
			switch(e.keyCode){//判断e.keyCode
				case 37: //是37: 左移
					this.moveLeft(); break;
				case 38: //是38: 上移
					this.moveUp(); break;
				case 39://是39: 右移
					this.moveRight(); break;
				case 40://是40: 下移
					this.moveDown();
			}
		}.bind(this);
	},
	randomNum:function(){//在一个随机位置生成2或4
		while(true){//反复:
			//在0~RN-1之间取一个随机数r
			var r=Math.floor(Math.random()*this.RN);
			//在0~CN-1之间取一个随机数c
			var c=Math.floor(Math.random()*this.CN);
			if(this.data[r][c]===0){//如果data中r行c列为0
				//设置data中r行c列的值为:		
					//随机生成一个小数,如果<0.5,就赋值2,否则赋值4
				this.data[r][c]=Math.random()<0.5?3:6;
				break;//退出循环
			}
		}
	},
	moveLeft:function(){//左移所有行
		//为data拍照保存在before中
		var before=String(this.data);
		//遍历data中每一行
		for(var r=0;r<this.RN;r++){
			this.moveLeftInRow(r);//调用moveLeftInRow(r)
		}//(遍历结束)
		//为data拍照保存在after中
		var after=String(this.data);
		//如果before不等于after
		if(after!==before){
			this.randomNum();//随机生成一个数
			//如果游戏结束，就修改游戏状态为GAMEOVER
			this.isGAMEOVER()&&
				(this.state=this.GAMEOVER)
			this.updateView();//更新页面
		}
	},
	isGAMEOVER:function(){
		for(var r=0;r<this.RN;r++){//遍历data
			for(var c=0;c<this.CN;c++){
				//如果当前元素是0或
					//c<this.CN-1且当前元素等于右侧元素或
					//r<this.RN-1且当前元素等于下方元素
				if(this.data[r][c]==0||
						c<this.CN-1
						&&this.data[r][c]==this.data[r][c+1]||
						r<this.RN-1
						&&this.data[r][c]==this.data[r+1][c]){	
					return false;//就返回false
				}
			}
		}//(遍历结束)
		return true;//返回true
	},
	moveLeftInRow:function(r){//左移1行
		//c从0开始，遍历data中r行，到<CN-1结束
		for(var c=0;c<this.CN-1;c++){
			//找data中r行c列右侧下一个不为0的位置nextc
			var nextc=this.getNextInRow(r,c);
			//如果nextc是-1，就退出循环
			if(nextc==-1){break;}
			else{//否则
				if(this.data[r][c]==0){//如果r行c列为0
					//将r行nextc列的值赋值给r行c列
					this.data[r][c]=this.data[r][nextc];
					//将r行nextc列的值置为0
					this.data[r][nextc]=0;
					c--;//c留在原地
				}else if(this.data[r][c]
									==this.data[r][nextc]){
			  //否则，如果r行c列等于r行nextc列
					this.data[r][c]*=2;//将r行c列的值*2
					//将r行c列的新值累加到score属性上
					this.score+=this.data[r][c];
					//将r行nextc列的值置为0 
					this.data[r][nextc]=0;
				}
			}
		}
	},
	getNextInRow:function(r,c){
		//找r行c列右侧下一个不为0的位置
		//nextc从c+1开始，到<CN结束
		for(var nextc=c+1;nextc<this.CN;nextc++){
			//如果r行nextc位置不等于0
			if(this.data[r][nextc]!=0){
				return nextc;//返回nextc
			}
		}//(遍历结束)
		return -1;//返回-1
	},
	updateView:function(){
		//将data中的每个元素值更新到页面对应的div上
		for(var r=0;r<this.RN;r++){//遍历data
			for(var c=0;c<this.CN;c++){
				//找到和r行c列位置对应的div
				var div=document.getElementById("c"+r+c);
				//如果data中当前元素的值不等于0
				if(this.data[r][c]!==0){
					//设置div的内容为data中当前元素的值
					div.innerHTML=this.data[r][c];
					//设置div的class为"cell n"+当前元素值
					div.className="cell n"+this.data[r][c];
				}else{//否则
					div.innerHTML="";//清除div的内容
					//设置div的class为"cell"
					div.className="cell";
				}
			}
		}
		//将score属性的值，放入id为score的div中
		document.getElementById("score")
			      .innerHTML=this.score;
		//设置id为gameOver的display为: 
			//如果游戏结束就显示，否则就隐藏
		document.getElementById("gameOver")
			      .style.display=
									this.state===this.GAMEOVER?
																	"block":"none";
		//如果游戏结束,就设置id为final的span的内容为score属性
		this.state===this.GAMEOVER&&(
			document.getElementById("final")
			        .innerHTML=this.score
		);
	},
	moveRight:function(){//右移所有行
		//为data拍照保存在before中
		var before=String(this.data);
		//遍历data中每一行
		for(var r=0;r<this.RN;r++){
			//调用moveRightInRow(r)
			this.moveRightInRow(r);
		}//(遍历结束)
		//为data拍照保存在after中
		var after=String(this.data);
		if(after!==before){//如果before不等于after
			this.randomNum();//随机生成一个数
			//如果游戏结束，就修改游戏状态为GAMEOVER
			this.isGAMEOVER()&&
				(this.state=this.GAMEOVER)
			this.updateView();//更新页面
		}
	},
	moveRightInRow:function(r){//右移第r行
		//c从CN-1开始,反向遍历r行，到>0结束
		for(var c=this.CN-1;c>0;c--){
			//找r行c列前一个不为0的位置prevc
			var prevc=this.getPrevInRow(r,c);
			//如果prevc是-1，就退出循环
			if(prevc==-1){break;}
			else{//否则
				if(this.data[r][c]==0){//如果r行c列是0
					//将r行prevc列的值赋值给r行c列
					this.data[r][c]=this.data[r][prevc];
					//将r行prevc列置为0
					this.data[r][prevc]=0;
					c++;//c留在原地
				}else if(this.data[r][c]
									==this.data[r][prevc]){
				//否则，如果r行c列的值等于r行prevc列的值
					this.data[r][c]*=2;//将r行c列的值*2
					//将r行c列的新值累加到score属性上
					this.score+=this.data[r][c];
					//将r行prevc列的值置为0
					this.data[r][prevc]=0;
				}
			}
		}
	},
	getPrevInRow:function(r,c){
		//查找r行c列左侧前一个不为0的位置
		//prevc从c-1开始，反向遍历，到>=0结束
		for(var prevc=c-1;prevc>=0;prevc--){
			//如果r行prevc列不等于0
			if(this.data[r][prevc]!=0){
				return prevc;//返回prevc
			}
		}//(遍历结束)
		return -1;//返回-1
	},
	moveUp:function(){
		//为data拍照保存在before中
		var before=String(this.data);
		//遍历data中每一列
		for(var c=0;c<this.CN;c++){
			//调用moveUpInCol上移第c列
			this.moveUpInCol(c);
		}
		//为data拍照保存在after中
		var after=String(this.data);
		//如果before不等于after
		if(before!=after){
			this.randomNum();//随机生成数
			//如果游戏结束，就修改游戏状态为GAMEOVER
			this.isGAMEOVER()&&
				(this.state=this.GAMEOVER)
			this.updateView();//更新页面
		}
	},
	moveUpInCol:function(c){
			//r从0开始,到r<RN-1结束，r每次递增1
		for(var r=0;r<this.RN-1;r++){
				//查找r行c列下方下一个不为0的位置nextr
			var nextr=this.getNextInCol(r,c);
				//如果没找到,就退出循环
			if(nextr==-1){break;}
			else{//否则  
					//如果r位置c列的值为0
				if(this.data[r][c]==0){
						//将nextr位置c列的值赋值给r位置
					this.data[r][c]=this.data[nextr][c];
						//将nextr位置c列置为0
					this.data[nextr][c]=0;
					r--;//r留在原地
				}else if(this.data[r][c]
								==this.data[nextr][c]){
				//否则，如果r位置c列的值等于nextr位置的  
					this.data[r][c]*=2;//将r位置c列的值*2
					//将r行c列的新值累加到score属性上
					this.score+=this.data[r][c];
						//将nextr位置c列的值置为0
					this.data[nextr][c]=0;
				}
			}
		}
	},
	getNextInCol:function(r,c){
		r++;//r+1
		//循环，到<RN结束，r每次递增1
		for(;r<this.RN;r++){
			//如果r位置c列不等于0
			if(this.data[r][c]!=0){
				return r;//返回r
			}
		}//(遍历结束)
		return -1//返回-1
	},
	moveDown:function(){
		//为data拍照保存在before中
		var before=String(this.data);
		//遍历data中每一列
		for(var c=0;c<this.CN;c++){
			//调用moveDownInCol下移第c列
			this.moveDownInCol(c);
		}
		//为data拍照保存在after中
		var after=String(this.data);
		//如果before不等于after
		if(before!=after){
			this.randomNum();//随机生成数
			//如果游戏结束，就修改游戏状态为GAMEOVER
			this.isGAMEOVER()&&
				(this.state=this.GAMEOVER)
			this.updateView();//更新页面
		}
	},
	moveDownInCol:function(c){
			//r从RN-1开始，到r>0结束，r每次递减1
		for(var r=this.RN-1;r>0;r--){
				//查找r位置c列上方前一个不为0的位置prevr
			var prevr=this.getPrevInCol(r,c);
				//如果没找到,就退出循环
			if(prevr==-1){break;}
			else{//否则  
					//如果r位置c列的值为0
				if(this.data[r][c]==0){
						//将prevr位置c列的值赋值给r位置
					this.data[r][c]=this.data[prevr][c]
						//将prevr位置c列置为0
					this.data[prevr][c]=0;
					r++;//r留在原地
				}else if(this.data[r][c]
									==this.data[prevr][c]){
				//否则，如果r位置c列的值等于prevr位置的值
					this.data[r][c]*=2;//将r位置c列的值*2
					//将r行c列的新值累加到score属性上
					this.score+=this.data[r][c];
					//将prevr位置c列置为0
					this.data[prevr][c]=0;
				}
			}
		}
	},
	getPrevInCol:function(r,c){
			r--;//r-1
			//循环，r到>=0结束，每次递减1
			for(;r>=0;r--){
				//如果r位置c列不等于0
				if(this.data[r][c]!=0){
					return r;//返回r
				}
			}//(遍历结束)
			return -1;//返回-1
	},
}
game.start();