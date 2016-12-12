interface Item extends DisplayableObject {
    readonly name: string;
    createSprite(): Widget;
    cartesianPosition: Vector2;
}

class DisplayableObject extends Widget {
    onpickup: () => void = () => { };
    onput: () => void = () => { };
    oninteract: () => void = () => { };
    displayView: Widget;
    pickable = true;
}

class SimpleItem extends DisplayableObject implements Item {
    name: string;
    protected image = new Sprite();
    cartesianPosition = new Vector2(50, 50);

    constructor(texture: Texture, size: Vector2, name: string) {
        super();
        this.image.texture = texture;
        this.image.pivot = new Vector2(0.5, 1);
        this.image.size = size;
        this.addChild(this.image);
        this.name = name;
        this.displayView = new HandItemView(this);
    }

    createSprite(): Widget {
        const sprite = new Sprite(this.image.texture);
        sprite.size = this.image.size.clone();
        return sprite;
    }
}

class CompoundItem extends DisplayableObject implements Item {
    name: string;
    cartesianPosition = new Vector2(50, 50);

    constructor(public parts: SimpleItem[]) {
        super();
        this.name = "";
        for (let item of parts) {
            this.name += `${item.name}-`;
        }
        this.name = this.name.substr(0, this.name.length - 1);
        this.displayView = new HandItemView(this);
    }

    createSprite() : Widget {
        const compound = new Widget();
        let width = 0;
        let height = 0;
        for (let item of this.parts) {
            const sprite = item.createSprite();
            sprite.x = width === 0 ? width : width - 5;
            compound.addChild(sprite);
            width += sprite.width - 5;
            if (sprite.height > height) {
                height = sprite.height;
            }
        }
        compound.size.set(width, height);
        return compound;
    }
}