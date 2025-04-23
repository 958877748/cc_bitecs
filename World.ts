import System from "./System";

export const CocosNode = bitecs.defineComponent()

@cc._decorator.ccclass
export default class World extends cc.Component {
    private world: bitecs.IWorld
    private systems: System[] = []
    private pipeline: (dt: number) => void;
    entityNodeMap = new Map<number, cc.Node>();
    protected onLoad() {
        this.world = bitecs.createWorld();
        this.systems = this.getComponentsInChildren(System)
        this.systems.forEach(sys => {
            sys.initializeSystem(this)
        })
        this.pipeline = bitecs.pipe(...this.systems.map(sys => sys.onUpdate.bind(sys)))
    }
    protected update(dt: number) {
        this.pipeline(dt)
    }
    getEcsWorld() {
        return this.world
    }
    createEntity(node?: cc.Node) {
        const eid = bitecs.addEntity(this.world)
        if (node) {
            this.entityNodeMap.set(eid, node)
            this.entityAddComponent(eid, CocosNode)
        }
        return eid
    }
    removeEntity(eid: number) {
        bitecs.removeEntity(this.world, eid)
    }
    entityAddComponent(eid: number, component: any) {
        bitecs.addComponent(this.world, component, eid)
    }
    entityRemoveComponent(eid: number, component: any) {
        bitecs.removeComponent(this.world, component, eid)
    }
}