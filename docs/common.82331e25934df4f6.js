"use strict";(self.webpackChunkangular_portfolio=self.webpackChunkangular_portfolio||[]).push([[592],{6762:(h,s,i)=>{i.d(s,{p:()=>o});var n=i(1142);class o extends PIXI.AnimatedSprite{constructor(){super(...arguments),this.frame=this.currentFrame,this.timeSinceAnimation=0,this.velocity=new n.W(0,0)}updateAnimation(t,e,r){const a=1/e;this.timeSinceAnimation+=(t/=1e3)*r,this.timeSinceAnimation>=a&&(this.timeSinceAnimation=0,this.nextFrame())}nextFrame(){this.frame++,this.frame%=this.totalFrames,this.gotoAndStop(this.frame)}getAngle(){return this.convertAngle(this.angle)}setAngle(t){this.angle=this.convertAngle(t)}convertAngle(t){return(t=90-t%360)<0&&(t+=360),t}setAngleFromVelocity(){this.angle=this.velocity.angle+90}addVelocity(t){const e=this.velocity.addVector2D(t);this.velocity=e}getPosition(){return new n.W(this.x,this.y)}setPosition(t){this.position.set(t.x,t.y)}get movementSpeed(){return this.velocity.magnitude}}}}]);