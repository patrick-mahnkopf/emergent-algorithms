"use strict";(self.webpackChunkangular_portfolio=self.webpackChunkangular_portfolio||[]).push([[989],{7989:(U,F,g)=>{g.r(F),g.d(F,{AntsComponent:()=>O});var w=g(1142),_=g(4520);class A{constructor(i,t){this.demoCanvas=i,this.worldManager=t,this._cells=[],this._cellLength=16,this.pheromoneMax=1e3,this.DEFAULT_DECAY_RATE=.001,this.DEFAULT_DIFFUSION_RATE=.002,this.decayRate=this.DEFAULT_DECAY_RATE,this.diffusionRate=this.DEFAULT_DIFFUSION_RATE,this.initCells()}init(){window.addEventListener("resize",()=>{this.onResize()})}onResize(){setTimeout(()=>this.resizeGrid(),10)}resizeGrid(){const i=[],t=this._cells.length,e=this._cells[0].length;for(let s=0;s<this.height;s++){i[s]=[];for(let o=0;o<this.width;o++)if(s<t&&o<e)i[s][o]=this._cells[s][o];else{const r=this.getCellPosition(s,o);i[s][o]=new y(s,o,r)}}this.overwriteCells(i)}reset(){this.initCells(),this.canvas.clear()}initCells(){for(let i=0;i<this.height;i++){this._cells[i]=[];for(let t=0;t<this.width;t++){const e=this.getCellPosition(i,t);this._cells[i][t]=new y(i,t,e)}}}addToCanvas(){this.canvas=new _.TC,this.canvas.position.set(0,0),this.canvas.width=this.canvasWidth,this.canvas.height=this.canvasHeight,this.demoCanvas.addChildToStage(this.canvas)}get width(){return Math.round(this.canvasWidth/this._cellLength)}get height(){return Math.round(this.canvasHeight/this._cellLength)}get canvasWidth(){return this.demoCanvas.width}get canvasHeight(){return this.demoCanvas.height}get cellLength(){return this._cellLength}get cells(){return this._cells}getCell(i){let t=Math.round(i.x/this._cellLength);t<0&&(t=0),t>=this.width&&(t=this.width-1);let e=Math.round(i.y/this._cellLength);return e<0&&(e=0),e>=this.height&&(e=this.height-1),this._cells[e][t]}getCellPosition(i,t){return new w.W(t*this._cellLength,i*this._cellLength)}overwriteCells(i){this._cells=i}decayPheromones(){const i=this.cells.length,t=this.cells[0].length;for(let e=0;e<i;e++)for(let s=0;s<t;s++){const o=this.cells[e][s];if(!this.worldManager.isOnFood(o.position)&&!this.worldManager.isOnNest(o.position))for(const r in l){const d=this.cells[e][s].getPheromone(l[r])*(1-this.decayRate);this.cells[e][s].setPheromone(l[r],d)}}}diffusePheromones(){const i=this.cells,t=new A(this.demoCanvas,this.worldManager),e=Math.min(i.length,t.cells.length),s=Math.min(i[0].length,t.cells[0].length);for(let o=0;o<e;o++)for(let r=0;r<s;r++){const d=r-1>=0,M=o-1>=0,u=r+1<s,m=o+1<e,c=t._cells[o][r];if(u){const a=t._cells[o][r+1],T=i[o][r];if(c.addOtherCellsPheromones(i[o][r+1]),a.addOtherCellsPheromones(T),M){const f=i[o-1][r+1],C=i[o-1][r];c.addOtherCellsPheromones(f),a.addOtherCellsPheromones(C),a.addOtherCellsPheromones(f)}if(m){const f=i[o+1][r+1],C=i[o+1][r];c.addOtherCellsPheromones(f),a.addOtherCellsPheromones(C),a.addOtherCellsPheromones(f)}}if(!d&&m){const a=t._cells[o+1][r],T=i[o][r];if(c.addOtherCellsPheromones(i[o+1][r]),a.addOtherCellsPheromones(T),u){const C=i[o+1][r+1];a.addOtherCellsPheromones(i[o][r+1]),a.addOtherCellsPheromones(C)}}const p=1-this.diffusionRate;for(const a in l){let v=i[o][r].getPheromone(l[a])*p;v+=t._cells[o][r].getPheromone(l[a])*this.diffusionRate/8,t._cells[o][r].setPheromone(l[a],v)}}this.overwriteCells(t._cells)}drawPheromones(){const i=this.cells.length,t=this.cells[0].length;this.canvas.clear();for(let e=0;e<i;e++)for(let s=0;s<t;s++)this.drawPheromone(e,s,65280,this._cells[e][s].getPheromone(l.Nest)),this.drawPheromone(e,s,255,this._cells[e][s].getPheromone(l.Food))}drawPheromone(i,t,e,s){if(0==s)return;const o=(s=Math.min(s,this.pheromoneMax))/this.pheromoneMax*.5,r=this.getCellPosition(i,t);this.canvas.beginFill(e,o),this.canvas.drawRect(r.x,r.y,this._cellLength/2,this._cellLength/2),this.canvas.endFill()}getFrontalCells(i,t){const e=[],s=this.cells,o=i.row,r=i.col,u=o-1>=0,m=o+1<this.cells.length,c=r-1>=0,p=r+1<this.cells[0].length;switch(t){case 0:if(!u||!m||!p)return;e.push(s[o-1][r+1]),e.push(s[o][r+1]),e.push(s[o+1][r+1]);break;case 45:if(!u||!p)return;e.push(s[o-1][r]),e.push(s[o-1][r+1]),e.push(s[o][r+1]);break;case 90:if(!u||!c||!p)return;e.push(s[o-1][r-1]),e.push(s[o-1][r]),e.push(s[o-1][r+1]);break;case 135:if(!u||!c)return;e.push(s[o][r-1]),e.push(s[o-1][r-1]),e.push(s[o-1][r]);break;case 180:if(!u||!m||!c)return;e.push(s[o+1][r-1]),e.push(s[o][r-1]),e.push(s[o-1][r-1]);break;case 225:if(!m||!c)return;e.push(s[o+1][r]),e.push(s[o+1][r-1]),e.push(s[o][r-1]);break;case 270:if(!m||!c||!p)return;e.push(s[o+1][r+1]),e.push(s[o+1][r]),e.push(s[o+1][r-1]);break;case 315:if(!m||!p)return;e.push(s[o][r+1]),e.push(s[o+1][r+1]),e.push(s[o+1][r])}return e}getNeighborCells(i){const t=[];for(let e=-1;e<=1;e++)for(let s=-1;s<=1;s++){const o=i.row+e,r=i.col+s;o<0||o>=this.height||r<0||r>=this.width||0==e&&0==s||t.push(this.worldManager.grid.cells[o][r])}return t}}var l=(()=>{return(h=l||(l={})).Food="Food",h.Nest="Nest",l;var h})();class y{constructor(i,t,e){this.pheromones=new Map([[l.Food,0],[l.Nest,0]]),this._row=i,this._col=t,this._position=e}get row(){return this._row}get col(){return this._col}get position(){return this._position}getPheromone(i){return this.pheromones.get(i)}setPheromone(i,t){this.pheromones.set(i,t<.05?0:t)}addPheromone(i,t){this.setPheromone(i,this.pheromones.get(i)+t)}addOtherCellsPheromones(i){for(const t in l)this.addPheromone(l[t],i.getPheromone(l[t]))}}var n=g(2096),b=g(4097);class Z extends PIXI.Graphics{constructor(i,t,e,s){super(),this.beginFill(s),this.drawCircle(0,0,e),this.endFill(),this.position.set(i,t),this.circle=new PIXI.Circle(i,t,e)}containsVector2D(i){return this.circle.contains(i.x,i.y)}getPosition(){return new w.W(this.x,this.y)}setPosition(i){this.position.set(i.x,i.y)}get radius(){return this.circle.radius}set radius(i){this.circle.radius=i}}PIXI;let S=(()=>{class h{constructor(t){this.demoCanvas=t,this.timeSincePheromoneUpdate=0,this.diffusePheromonesDelay=250}init(){this.initGrid(),this.initLocations(),window.addEventListener("resize",()=>{this.onResize()})}initGrid(){this.grid=new A(this.demoCanvas,this),this.grid.init(),this.grid.addToCanvas()}initNest(t,e,s){this.nest=new Z(t,e,s,52224),this.demoCanvas.addChildToStage(this.nest)}initFood(t,e,s){this.food=new Z(t,e,s,204),this.demoCanvas.addChildToStage(this.food)}onResize(){setTimeout(()=>this.initLocations(),10)}initLocations(){const t=Math.min(this.demoCanvas.width,this.demoCanvas.height),e=.2*t,s=.1*t;this.demoCanvas.removeChildFromStage(this.nest),this.initNest(e,e,s),this.demoCanvas.removeChildFromStage(this.food),this.initFood(this.demoCanvas.width-e,this.demoCanvas.height-e,s)}update(t){null!=this.previousUpdateTimeStamp?(this.timeSincePheromoneUpdate+=t-this.previousUpdateTimeStamp,this.timeSincePheromoneUpdate>=this.diffusePheromonesDelay&&(this.timeSincePheromoneUpdate=0,this.grid.decayPheromones(),this.grid.diffusePheromones(),this.grid.drawPheromones())):this.previousUpdateTimeStamp=t}isOnFood(t){return this.food.containsVector2D(t)}isOnNest(t){return this.nest.containsVector2D(t)}onSliderClicked(t){const e=t.target,o=+e.value/100;switch(e.id){case"decay-slider":this.grid.decayRate=2*this.grid.DEFAULT_DECAY_RATE*o,this.grid.decayRate>1&&(this.grid.decayRate=1);break;case"diffusion-slider":this.grid.diffusionRate=2*this.grid.DEFAULT_DIFFUSION_RATE*o,this.grid.diffusionRate>1&&(this.grid.diffusionRate=1)}}reset(){this.grid.reset()}}return h.\u0275fac=function(t){return new(t||h)(n.LFG(b.B))},h.\u0275prov=n.Yz7({token:h,factory:h.\u0275fac,providedIn:"root"}),h})();var P=g(2862),D=g(6762);class R extends D.p{constructor(i,t){super(i),this.hasFood=!1,this.timeSincePheromoneDrop=0,this.dropPheromoneDelay=125,this.maxSpeed=1,this.width=48,this.height=48,this.anchor.set(.5,.5),this.worldManager=t,this.init()}init(){this.initPosition(),this.initAngle(),this.initVelocity(),this.hasFood=!1,this.desiredDirection=this.velocity}initPosition(){const i=this.worldManager.nest;this.setPosition(new w.W(P.d.getRandomIntInclusive(i.x-i.radius+this.width/2,i.x+i.radius-this.width/2),P.d.getRandomIntInclusive(i.y-i.radius+this.height/2,i.y+i.radius-this.height/2)))}initAngle(){this.setAngle(P.d.getRandomIntInclusive(0,360))}initVelocity(){const i=this.getAngle()*_.ZX,t=Math.cos(i)*this.maxSpeed,e=Math.sin(i)*this.maxSpeed;this.velocity=new w.W(t,e)}move(i){this.targetPheromones(),this.update(i),this.keepWithinBounds();const t=this.getPosition().addVector2D(this.velocity);this.setPosition(t),this.updateAnimation(i,2400,this.movementSpeed),this.setAngleFromVelocity(),this.dropPheromones(i)}targetPheromones(){if(this.hasFood){const i=this.worldManager.isOnFood(this.getPosition());this.updateTargetDirection(i,l.Nest)}else{const i=this.worldManager.isOnNest(this.getPosition());this.updateTargetDirection(i,l.Food)}}updateTargetDirection(i,t){const e=this.worldManager.grid.getCell(this.getPosition());let s=null;if(!i){const o=this.worldManager.grid.getFrontalCells(e,this.getClosestHeading());null!=o&&(s=this.getCellWithHighestPheromone(o,t))}if(null==s){const o=this.worldManager.grid.getNeighborCells(e);s=this.getCellWithHighestPheromone(o,t)}null!=s&&s.getPheromone(t)>0&&(this.desiredDirection=s.position.subtractVector2D(this.getPosition()))}getClosestHeading(){const i=this.getAngle();let t=0;for(let e=0;e<360;e+=45)Math.abs(e-i)<=Math.abs(t-i)&&(t=e);return t}getCellWithHighestPheromone(i,t){let e;return i.forEach(s=>{(null==e||s.getPheromone(l[t])>e.getPheromone(l[t]))&&(e=s)}),e}update(i){i/=1e3,this.hasFood||(this.desiredDirection=this.desiredDirection.addVector2D(P.d.randomInsideUnitCircle.multiplyByScalar(.1)).normalized);const r=this.desiredDirection.multiplyByScalar(this.maxSpeed).subtractVector2D(this.velocity).multiplyByScalar(2).clampMagnitude(2);this.velocity=this.velocity.addVector2D(r.multiplyByScalar(i)).clampMagnitude(this.maxSpeed)}keepWithinBounds(){const t=this.maxSpeed,e=this.getPosition(),o=window.innerWidth-0,d=window.innerHeight-0;e.x<0?this.desiredDirection.x=t:e.x>o&&(this.desiredDirection.x=-t),e.y<0?this.desiredDirection.y=t:e.y>d&&(this.desiredDirection.y=-t)}dropPheromones(i){if(!this.hasFood&&this.worldManager.isOnFood(this.getPosition())&&(this.hasFood=!0),this.hasFood&&this.worldManager.isOnNest(this.getPosition())&&(this.hasFood=!1),this.timeSincePheromoneDrop+=i,this.timeSincePheromoneDrop>=this.dropPheromoneDelay)if(this.timeSincePheromoneDrop=0,this.hasFood){const t=this.worldManager.isOnFood(this.getPosition());this.dropPheromone(t,l.Food)}else{const t=this.worldManager.isOnNest(this.getPosition());this.dropPheromone(t,l.Nest)}}dropPheromone(i,t){const e=this.worldManager.grid.getCell(this.getPosition());let s=0;if(i)s=this.worldManager.grid.pheromoneMax;else{const o=this.worldManager.grid.getNeighborCells(e);let r=0;o.forEach(d=>{d.getPheromone(t)>r&&(r=d.getPheromone(t))}),s=.98*r-e.getPheromone(t)}s>0&&e.addPheromone(t,s)}}var N=g(9760);let x=(()=>{class h{constructor(t,e,s){this.assetManager=t,this.demoCanvas=e,this.worldManager=s,this.ANT_COUNT=100,this.ants=[]}createAnts(){const t=this.assetManager.antSprite;this.ants=[];for(let e=0;e<this.ANT_COUNT;e++){const s=new R(t,this.worldManager);this.ants.push(s),this.demoCanvas.addChildToStage(s)}}update(t){if(null!=this.previousTimeStamp){const e=t-this.previousTimeStamp;this.ants.forEach(s=>{s.move(e),s.dropPheromones(e)})}this.previousTimeStamp=t}reset(){this.ants.forEach(t=>{t.init()})}}return h.\u0275fac=function(t){return new(t||h)(n.LFG(N.me),n.LFG(b.B),n.LFG(S))},h.\u0275prov=n.Yz7({token:h,factory:h.\u0275fac,providedIn:"root"}),h})();const k=PIXI.Loader.shared;let O=(()=>{class h{constructor(t,e,s){this.demoCanvas=t,this.worldManager=e,this.antManager=s}init(){this.initWorldManager(),this.initAntManager()}initWorldManager(){this.worldManager.init()}initAntManager(){this.antManager.createAnts()}update(t){this.worldManager.update(t),this.antManager.update(t)}unloadResources(){k.reset()}onResetClicked(){this.antManager.reset(),this.worldManager.reset()}onSliderClicked(t){this.worldManager.onSliderClicked(t)}toggleFullscreen(){this.demoCanvas.toggleFullscreen()}onTouch(t){const e=this.worldManager.grid;e.getCell(new w.W(t.offsetX,t.offsetY)).setPheromone(l.Food,e.pheromoneMax)}}return h.\u0275fac=function(t){return new(t||h)(n.Y36(b.B),n.Y36(S),n.Y36(x))},h.\u0275cmp=n.Xpm({type:h,selectors:[["app-ants"]],decls:34,vars:0,consts:[["id","bottom-ui-wrapper",1,"bottom-ui-wrapper"],[1,"sm-visible-block","sm:w-auto"],["id","reset-button",1,"reset-button",3,"click"],["id","bottom-ui-slider-wrapper",1,"bottom-ui-slider-wrapper"],[1,"slider-wrapper"],["for","decay",1,"slider-label"],["type","range","min","0","max","100","value","50","name","decay","id","decay-slider",1,"slider",3,"input"],["for","diffusion",1,"slider-label"],["type","range","min","0","max","100","value","50","name","diffusion","id","diffusion-slider",1,"slider",3,"input"],[1,"relative"],["id","invisible-reset-button"],[1,"reset-button"],[1,"fullscreen-toggle","sm-visible-block","sm:absolute","sm:right-0","sm:bottom-0"],[1,"icon-link","cursor-pointer",3,"click"],["xmlns","http://www.w3.org/2000/svg","width","36","height","36","viewBox","0 0 24 24","aria-labelledby","ants-fullscreen-toggle-title",1,"fill-demo-ui"],["id","ants-fullscreen-toggle-title"],["d","M24 9h-2v-7h-7v-2h9v9zm-9 15v-2h7v-7h2v9h-9zm-15-9h2v7h7v2h-9v-9zm9-15v2h-7v7h-2v-9h9z"],["id","bottom-buttons",1,"mx-4","mt-8","flex","sm:hidden","justify-between"],[1,"sm-hidden-block"],[1,"fullscreen-toggle","my-auto"],["xmlns","http://www.w3.org/2000/svg","width","36","height","36","viewBox","0 0 24 24","aria-labelledby","ants-fullscreen-toggle-title2",1,"fill-demo-ui"],["id","ants-fullscreen-toggle-title2"],["id","color-holder",1,"hidden","bg-demo-ui","text-gray-600"]],template:function(t,e){1&t&&(n.TgZ(0,"div",0),n.TgZ(1,"div",1),n.TgZ(2,"button",2),n.NdJ("click",function(){return e.onResetClicked()}),n._uU(3,"Reset"),n.qZA(),n.qZA(),n.TgZ(4,"div",3),n.TgZ(5,"div",4),n.TgZ(6,"label",5),n._uU(7,"Decay"),n.qZA(),n.TgZ(8,"input",6),n.NdJ("input",function(o){return e.onSliderClicked(o)}),n.qZA(),n.qZA(),n.TgZ(9,"div",4),n.TgZ(10,"label",7),n._uU(11,"Diffusion"),n.qZA(),n.TgZ(12,"input",8),n.NdJ("input",function(o){return e.onSliderClicked(o)}),n.qZA(),n.qZA(),n.qZA(),n.TgZ(13,"div",9),n.TgZ(14,"div",10),n.TgZ(15,"button",11),n._uU(16,"Reset"),n.qZA(),n.qZA(),n.TgZ(17,"div",12),n.TgZ(18,"a",13),n.NdJ("click",function(){return e.toggleFullscreen()}),n.O4$(),n.TgZ(19,"svg",14),n.TgZ(20,"title",15),n._uU(21,"A button to toggle the full screen mode of this simulation "),n.qZA(),n._UZ(22,"path",16),n.qZA(),n.qZA(),n.qZA(),n.qZA(),n.kcU(),n.TgZ(23,"div",17),n.TgZ(24,"div",18),n.TgZ(25,"button",2),n.NdJ("click",function(){return e.onResetClicked()}),n._uU(26,"Reset"),n.qZA(),n.qZA(),n.TgZ(27,"div",19),n.TgZ(28,"a",13),n.NdJ("click",function(){return e.toggleFullscreen()}),n.O4$(),n.TgZ(29,"svg",20),n.TgZ(30,"title",21),n._uU(31,"A button to toggle the full screen mode of this simulation "),n.qZA(),n._UZ(32,"path",16),n.qZA(),n.qZA(),n.qZA(),n.qZA(),n.kcU(),n._UZ(33,"div",22),n.qZA())},styles:[""]}),h})()}}]);