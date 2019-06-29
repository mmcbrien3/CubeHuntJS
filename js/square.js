class square {
    constructor(r){
        this.rect = r;
    }
    
    place(position, ctx) {
        this.rect.x = position.x
        this.rect.y = position.y
        ctx.beginPath();
        ctx.fillStyle = this.rect.color;
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        ctx.closePath();
    }
    
    returnPos() {
        return {x: this.rect.x, y: this.rect.y};
    }
    
    returnColor() {
        return this.rect.color;
    }
    
    returnRect() {
        return this.rect;
    }
}


class playerSquare extends square {

    constructor(r) {
        super(r);  
    }
    
    move(position) {
        this.rect.x = position.x;
        this.rect.y = position.y;
    }
}