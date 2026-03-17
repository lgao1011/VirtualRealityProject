class Wall{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z; 
    
this.container = document.createElement('a-entity');
        this.container.setAttribute('position', { x: x, y: y, z: z });
        this.container.setAttribute('rotation', { x: 0, y: Math.random() * 360, z: 0 });

        var colors = ['#6E6B66','#7D7A6F','white','#8E8E8E','#666666'];
        var types = ['sphere','box','torus','dodecahedron'];

        var pieces = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < pieces; i++) {
            var t = types[Math.floor(Math.random() * types.length)];
            var el = document.createElement('a-' + t);

            var px = (Math.random() - 0.5) * 4;
            var py = 6 + Math.random() * 12;
            var pz = (Math.random() - 0.5) * 4;
            el.setAttribute('position', { x: px, y: py, z: pz });

            var scale = 0.8 + Math.random() * 2.5;
            el.setAttribute('color', colors[Math.floor(Math.random() * colors.length)]);
            el.setAttribute('shadow', 'receive:true');

            if (t === 'sphere') {
                el.setAttribute('radius', 1.6 * scale);
            } else if (t === 'box') {
                el.setAttribute('depth', 1.2 * scale);
                el.setAttribute('height', 1.6 * scale);
                el.setAttribute('width', 1.6 * scale);
                el.setAttribute('rotation', `${Math.random() * 40} ${Math.random() * 360} ${Math.random() * 40}`);
            } else if (t === 'torus') {
                el.setAttribute('radius', 1.5 * scale);
                el.setAttribute('radius-tubular', 0.4 * scale);
                el.setAttribute('arc', '360');
                el.setAttribute('rotation', `90 ${Math.random() * 360} 0`);
            } else if (t === 'dodecahedron') {
                el.setAttribute('radius', 1.4 * scale);
            }

            this.container.appendChild(el);
        }

        scene.append(this.container);






    }
}