class Stick{
    constructor(d){
        this.dmg = d;
        let camera = document.querySelector("a-camera");
        this.obj = document.createElement("a-entity");
        
        let stickBase = document.createElement("a-cylinder");
        stickBase.setAttribute("color", "black");
        stickBase.setAttribute("position", "3 0 -4");
        stickBase.setAttribute("height", "5");
        stickBase.setAttribute("radius", ".5");
        this.obj.append(stickBase);
        camera.append("this.obj");

    }
}