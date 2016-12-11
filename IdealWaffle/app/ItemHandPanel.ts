class ItemHandPanel extends Widget {
    private rightHand = new ItemHand(false, "x");
    private leftHand = new ItemHand(true, "z");
    private itemHolder = new WidgetHolder();

    constructor() {
        super();
        this.size.set(440, 100);
        this.pivot = Vector2.half;
        this.rightHand.position.set(this.size.x, this.size.y / 2);
        this.rightHand.tasks.add(this.handMovementTask(this.rightHand, Key.X));
        this.addChild(this.rightHand);
        this.leftHand.position.set(0, this.size.y / 2);
        this.leftHand.tasks.add(this.handMovementTask(this.leftHand, Key.Z));
        this.addChild(this.leftHand);
        this.itemHolder.pivot = Vector2.half;
        this.itemHolder.position = this.size.divide(2);
        this.addChild(this.itemHolder);
    }

    showItem(item: Item) {
        this.itemHolder.content = new HandItemView(item);
    }

    private *handMovementTask(hand: ItemHand, key: Key) {
        const start = hand.position.x;
        const end = this.itemHolder.position.x;
        const speed = 15;
        let destination: number;
        while (true) {
            if (game.input.isKeyPressed(key)) {
                destination = end;
            }
            else {
                destination = start;
            }
            if (hand.x !== destination) {
                const direction = Math.sign(destination - hand.x);
                const offset = direction * speed;
                hand.x += offset;
                if ((direction < 0 && hand.x < destination) || (direction > 0 && hand.x > destination)) {
                    hand.x = destination;
                    if (destination === end && this.itemHolder.content != undefined) {
                        const content = this.itemHolder.content;
                        content.removeFromParent();
                        hand.addChild(content);
                    }
                }
            }
            yield Wait.frame();
        }
    }
}

class HandItemView extends Widget {
    constructor(item: Item) {
        super();
        this.pivot = Vector2.half;
        const sprite = item.createSprite();
        sprite.pivot = Vector2.half;
        sprite.position = this.size.divide(2).add(new Vector2(0, 5));
        this.addChild(sprite);
        const tooltip = new ItemTooltip(item);
        tooltip.position = this.size.divide(2).subtract(new Vector2(0, 35));
        this.addChild(tooltip);
    }

    render(renderer: Renderer): void {
        renderer.save();
        renderer.restore();
        super.render(renderer);
    }
}

class GuiFrame extends NineGrid {
    constructor() {
        super(Texture.fromImage(AssetBundle.gui));
        this.left = 5;
        this.right = 5;
        this.top = 5;
        this.bottom = 5;
    }
}

class ItemTooltip extends GuiFrame {
    private readonly nameLabel = new Label();

    constructor(item: Item) {
        super();
        this.nameLabel.text = item.name;
        this.nameLabel.pivot = Vector2.half;
        this.nameLabel.fontColor = Color.fromComponents(84, 81, 76);
        this.nameLabel.horizontalTextAlignment = TextAlignment.Center;
        this.nameLabel.verticalTextAlignment = TextAlignment.Center;
        this.pivot = Vector2.half;
        this.addChild(this.nameLabel);
    }

    render(renderer: Renderer): void {
        renderer.save();
        const fontSize = 32;
        game.setPixelFont(fontSize);
        const measure = new Vector2(renderer.measureText(this.nameLabel.text), fontSize);
        this.size = measure.add(new Vector2(15, 10));
        this.nameLabel.position = this.size.divide(2).subtract(new Vector2(0, 5));
        super.render(renderer);
        renderer.restore();
    }
}