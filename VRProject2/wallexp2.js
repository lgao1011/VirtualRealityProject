class Wall2{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z; 
    
this.container = document.createElement('a-entity');
        this.container.setAttribute('position', { x: x, y: y, z: z });
        this.container.setAttribute('rotation', { x: 0, y: Math.random() * 360, z: 0 });

        var colors = ['#7F7F7F','#6E6E6E','#5E5E5E','#8A8A8A'];
        var types = ['sphere','box','dodecahedron','torus'];

        var pieces = 2 + Math.floor(Math.random() * 4);
        var layerCount = 3; 
        var layerSpacing = 3; 
        for (let i = 0; i < pieces; i++) {

            var px = (Math.random() - 0.5) * 5;
            var basePy = 8 + Math.random() * 16;
            var pz = (Math.random() - 0.5) * 5;

          
            for (let layer = 0; layer < layerCount; layer++) {
                var t = types[Math.floor(Math.random() * types.length)];
                var el = document.createElement('a-' + t);

                var py = basePy + layer * layerSpacing;
                el.setAttribute('position', { x: px, y: py, z: pz });

                var scale = 1 + Math.random() * 3; 
                el.setAttribute('color', colors[Math.floor(Math.random() * colors.length)]);
                el.setAttribute('shadow', 'receive:true');

                if (t === 'sphere') {
                    el.setAttribute('radius', 2 * scale);
                } else if (t === 'box') {
                    el.setAttribute('depth', 1.8 * scale);
                    el.setAttribute('height', 5.2 * scale);
                    el.setAttribute('width', 2 * scale);
                    el.setAttribute('rotation', `${Math.random() * 60} ${Math.random() * 360} ${Math.random() * 60}`);
                } else if (t === 'torus') {
                    el.setAttribute('radius', 2 * scale);
                    el.setAttribute('radius-tubular', 0.6 * scale);
                    el.setAttribute('arc', '360');
                    el.setAttribute('rotation', `90 ${Math.random() * 360} 0`);
                } else if (t === 'dodecahedron') {
                    el.setAttribute('radius', 3.8 * scale);
                }

                this.container.appendChild(el);
            }
        }

        if (Math.random() < 0.25) {
            var stal = document.createElement('a-cylinder');
            stal.setAttribute('height', 6 + Math.random() * 6);
            stal.setAttribute('radius', 0.2 + Math.random() * 0.8);
            stal.setAttribute('position', { x: (Math.random() - 0.5) * 3, y: 14, z: (Math.random() - 0.5) * 3 });
            stal.setAttribute('rotation', { x: 180, y: 0, z: 0 });
            stal.setAttribute('color', '#6B6B6B');
            this.container.appendChild(stal);
        }

        scene.append(this.container);






    }
}