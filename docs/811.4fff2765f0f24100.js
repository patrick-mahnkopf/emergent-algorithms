"use strict";(self.webpackChunkangular_portfolio=self.webpackChunkangular_portfolio||[]).push([[811],{7811:(T,a,l)=>{l.r(a),l.d(a,{BoidsComponent:()=>b});var d=l(2862),u=l(3336),c=l(3791);class m extends u.p{constructor(n,i,t){super(t),this.bottomUiService=n,this.demoCanvas=i,this.width=48,this.height=48,this.anchor.set(.5,.5),this.init()}get maxSpeed(){return this.bottomUiService.getMaxSpeed()}get movementSpeed(){return this.maxSpeed/8}init(){this.initPosition(),this.initVelocity(),this.initAngle()}initPosition(){const n=new c.W(d.d.getRandomIntInclusive(this.width/2,this.demoCanvas.width-this.width/2),d.d.getRandomIntInclusive(this.height/2,this.demoCanvas.height-this.height/2));this.setPosition(n)}initVelocity(){this.velocity=new c.W(d.d.getRandomIntInclusive(-this.maxSpeed,this.maxSpeed),d.d.getRandomIntInclusive(-this.maxSpeed,this.maxSpeed))}initAngle(){this.setAngle(d.d.getRandomIntInclusive(0,360))}move(n){this.updatePosition(n),this.updateAnimation(n,10,this.movementSpeed),this.setAngleFromVelocity()}updatePosition(n){const t=this.velocity.normalized.multiplyByScalar(this.movementSpeed).multiplyByScalar(n);this.velocity=this.velocity.addVector2D(t).clampMagnitude(this.maxSpeed);const o=this.getPosition().addVector2D(this.velocity);this.setPosition(o)}birdInVisionRange(n){const i=this.getPosition(),t=n.getPosition();return i.distanceTo(t)<this.bottomUiService.getVisualRange()}birdTooClose(n){return this.getPosition().distanceTo(n.getPosition())<20}}var e=l(2096),h=l(2668),g=l(1497),p=l(8362),v=l(4889);const Z=PIXI.Loader.shared;let b=(()=>{class r{constructor(i,t,o,s){this.demoCanvas=i,this.boidRulesService=t,this.bottomUiService=o,this.assetManager=s,this.BIRD_COUNT=350,this.birds=[]}init(){this.createBirds(),this.boidRulesService.init(this.birds),this.bottomUiService.initSliders()}createBirds(){const i=this.assetManager.boidSprites;for(let t=0;t<this.BIRD_COUNT;t++){const o=d.d.getRandomInt(0,i.length),s=new m(this.bottomUiService,this.demoCanvas,i[o]);this.birds.push(s),this.demoCanvas.addChildToStage(s)}}update(i){this.boidRulesService.update(i)}unloadResources(){Z.reset()}onResetClicked(){this.resetBirds()}resetBirds(){this.birds.forEach(i=>{i.init()})}onSliderClicked(i){this.bottomUiService.onSliderClicked(i)}toggleFullscreen(){this.demoCanvas.toggleFullscreen()}onTouch(i){}}return r.\u0275fac=function(i){return new(i||r)(e.Y36(h.B),e.Y36(g.g),e.Y36(p.K),e.Y36(v.me))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-boids"]],decls:46,vars:0,consts:[["id","bottom-ui-wrapper",1,"bottom-ui-wrapper"],[1,"sm-visible-block","sm:w-auto"],["id","reset-button",1,"reset-button",3,"click"],["id","bottom-ui-slider-wrapper",1,"bottom-ui-slider-wrapper"],[1,"slider-wrapper"],["for","coherence",1,"slider-label"],["type","range","min","0","max","100","value","50","name","coherence","id","coherence-slider",1,"slider",3,"input"],["for","separation",1,"slider-label"],["type","range","min","0","max","100","value","50","name","separation","id","separation-slider",1,"slider",3,"input"],["for","alignment",1,"slider-label"],["type","range","min","0","max","100","value","50","name","alignment","id","alignment-slider",1,"slider",3,"input"],["for","visualRange",1,"slider-label"],["type","range","min","1","max","100","value","50","name","visualRange","id","visualRange-slider",1,"slider",3,"input"],["for","maxSpeed",1,"slider-label"],["type","range","min","1","max","100","value","50","name","maxSpeed","id","maxSpeed-slider",1,"slider",3,"click"],[1,"relative"],["id","invisible-reset-button"],[1,"reset-button"],[1,"fullscreen-toggle","sm-visible-block","sm:absolute","sm:right-0","sm:bottom-0"],[1,"icon-link","cursor-pointer",3,"click"],["xmlns","http://www.w3.org/2000/svg","width","36","height","36","viewBox","0 0 24 24","aria-labelledby","boids-fullscreen-toggle-title",1,"fill-demo-ui"],["id","boids-fullscreen-toggle-title"],["d","M24 9h-2v-7h-7v-2h9v9zm-9 15v-2h7v-7h2v9h-9zm-15-9h2v7h7v2h-9v-9zm9-15v2h-7v7h-2v-9h9z"],["id","bottom-buttons",1,"mx-4","mt-8","flex","sm:hidden","justify-between"],[1,"sm-hidden-block"],[1,"fullscreen-toggle","my-auto"],["xmlns","http://www.w3.org/2000/svg","width","36","height","36","viewBox","0 0 24 24","aria-labelledby","boids-fullscreen-toggle-title2",1,"fill-demo-ui"],["id","boids-fullscreen-toggle-title2"],["id","color-holder",1,"hidden","bg-demo-ui","text-gray-600"]],template:function(i,t){1&i&&(e.TgZ(0,"div",0),e.TgZ(1,"div",1),e.TgZ(2,"button",2),e.NdJ("click",function(){return t.onResetClicked()}),e._uU(3,"Reset"),e.qZA(),e.qZA(),e.TgZ(4,"div",3),e.TgZ(5,"div",4),e.TgZ(6,"label",5),e._uU(7,"Coherence"),e.qZA(),e.TgZ(8,"input",6),e.NdJ("input",function(s){return t.onSliderClicked(s)}),e.qZA(),e.qZA(),e.TgZ(9,"div",4),e.TgZ(10,"label",7),e._uU(11,"Separation"),e.qZA(),e.TgZ(12,"input",8),e.NdJ("input",function(s){return t.onSliderClicked(s)}),e.qZA(),e.qZA(),e.TgZ(13,"div",4),e.TgZ(14,"label",9),e._uU(15,"Alignment"),e.qZA(),e.TgZ(16,"input",10),e.NdJ("input",function(s){return t.onSliderClicked(s)}),e.qZA(),e.qZA(),e.TgZ(17,"div",4),e.TgZ(18,"label",11),e._uU(19,"Visual range"),e.qZA(),e.TgZ(20,"input",12),e.NdJ("input",function(s){return t.onSliderClicked(s)}),e.qZA(),e.qZA(),e.TgZ(21,"div",4),e.TgZ(22,"label",13),e._uU(23,"Max Speed"),e.qZA(),e.TgZ(24,"input",14),e.NdJ("click",function(s){return t.onSliderClicked(s)}),e.qZA(),e.qZA(),e.qZA(),e.TgZ(25,"div",15),e.TgZ(26,"div",16),e.TgZ(27,"button",17),e._uU(28,"Reset"),e.qZA(),e.qZA(),e.TgZ(29,"div",18),e.TgZ(30,"a",19),e.NdJ("click",function(){return t.toggleFullscreen()}),e.O4$(),e.TgZ(31,"svg",20),e.TgZ(32,"title",21),e._uU(33,"A button to toggle the full screen mode of this simulation "),e.qZA(),e._UZ(34,"path",22),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.kcU(),e.TgZ(35,"div",23),e.TgZ(36,"div",24),e.TgZ(37,"button",2),e.NdJ("click",function(){return t.onResetClicked()}),e._uU(38,"Reset"),e.qZA(),e.qZA(),e.TgZ(39,"div",25),e.TgZ(40,"a",19),e.NdJ("click",function(){return t.toggleFullscreen()}),e.O4$(),e.TgZ(41,"svg",26),e.TgZ(42,"title",27),e._uU(43,"A button to toggle the full screen mode of this simulation "),e.qZA(),e._UZ(44,"path",22),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.kcU(),e._UZ(45,"div",28),e.qZA())},styles:[""]}),r})()}}]);