import { AUTO, Display, Game } from "phaser3";
import { box2d, initBox2D } from "./init-box2d.js";
import DebugDrawer from "./debug-drawer.js";

const config = {
    type: AUTO,
    parent: "phaser-example",
    width: 300,
    height: 300,
    scene: { create, update }
};

const game = new Game(config);

async function create() {
    await initBox2D();
    const {
        b2_dynamicBody,
        b2BodyDef,
        b2CircleShape,
        b2PolygonShape,
        b2Vec2,
        b2World
    } = box2d;

    this.world = new b2World();
    const gravity = new b2Vec2(0, 9.8);
    this.world.SetGravity(gravity);
    this.pixelsPerMeter = 30;

    this.graphics = this.add.graphics();
    this.debugDrawer = new DebugDrawer(this.graphics, this.pixelsPerMeter);
    this.world.SetDebugDraw(this.debugDrawer.instance);

    // Ground
    const groundBodyDef = new b2BodyDef();
    groundBodyDef.set_position(new b2Vec2(150 / this.pixelsPerMeter, 270 / this.pixelsPerMeter));
    const groundBody = this.world.CreateBody(groundBodyDef);
    const groundShape = new b2PolygonShape();
    groundShape.SetAsBox(130 / this.pixelsPerMeter, 20 / this.pixelsPerMeter);
    groundBody.CreateFixture(groundShape, 0);

    // Box
    const boxBodyDef = new b2BodyDef();
    boxBodyDef.set_position(new b2Vec2(100 / this.pixelsPerMeter, 30 / this.pixelsPerMeter));
    boxBodyDef.angle = 30 * Math.PI / 180;
    boxBodyDef.type = b2_dynamicBody;
    const boxBody = this.world.CreateBody(boxBodyDef);
    const boxShape = new b2PolygonShape();
    boxShape.SetAsBox(30 / this.pixelsPerMeter, 30 / this.pixelsPerMeter);
    boxBody.CreateFixture(boxShape, 1);

    // Circle
    const circleBodyDef = new b2BodyDef();
    circleBodyDef.type = b2_dynamicBody;
    circleBodyDef.position = new b2Vec2(200 / this.pixelsPerMeter, 50 / this.pixelsPerMeter);
    const circleRigidBody = this.world.CreateBody(circleBodyDef);
    const circleShape = new b2CircleShape();
    circleShape.m_radius = 20 / this.pixelsPerMeter;
    const circleFixture = circleRigidBody.CreateFixture(circleShape, 1);
    circleFixture.SetRestitution(0.5);

    // Platform
    const platformBodyDef = new b2BodyDef();
    platformBodyDef.set_position(new b2Vec2(220 / this.pixelsPerMeter,
        200 / this.pixelsPerMeter));
    platformBodyDef.angle = -20 * Math.PI / 180;
    const platformBody = this.world.CreateBody(platformBodyDef);
    const platformShape = new b2PolygonShape();
    platformShape.SetAsBox(50 / this.pixelsPerMeter, 5 / this.pixelsPerMeter);
    platformBody.CreateFixture(platformShape, 0);

    this.currentTime = 0;
    this.dt = 0;
    this.lastTime = Date.now();
}

function update() {
    if (!this.world) {
        return;
    }

    this.currentTime = Date.now();
    this.dt = (this.currentTime - this.lastTime) / 1000;
    this.lastTime = this.currentTime;

    this.world.Step(this.dt, 3, 2);
    this.world.DebugDraw();
    this.debugDrawer.clear();
}
