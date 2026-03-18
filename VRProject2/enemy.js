class basicEnemy {
    constructor(x, y, z, h) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.enemyHealth = h;
        this.maxHealth = h;

        this.isDead = false;
        this.hasEnded = false;
        this.isDying = false;
        this.deathTimer = 0;

        // movement
        this.velocityX = 0;
        this.velocityZ = 0;
        this.friction = 0.9;
        this.speed = 0.08;
        this.bounds = 500;

        this.aggroRange = 25;
        this.stopRange = 3;
        this.flySpeed = 0.067;

        this.respawnTime = 30000; 

        // separation (NEW)
        this.separationRange = 5;
        this.separationForce = 0.1;

        // combat state
        this.isAttacking = false;
        this.canBeParried = false;
        this.attackCooldown = 0;

        this.obj = document.createElement("a-entity");
        this.obj.setAttribute("position", { x, y, z });
        this.obj.setAttribute("clickable", "");
        scene.append(this.obj);

        let body = document.createElement("a-box");
        body.setAttribute("height", "2");
        body.setAttribute("width", "1.5");
        body.setAttribute("depth", "1");
        body.setAttribute("color", "#aa0000");
        body.setAttribute("position", "0 1 0");
        this.obj.append(body);

        this.body = body;

        let head = document.createElement("a-sphere");
        head.setAttribute("radius", "0.6");
        head.setAttribute("color", "#ff4444");
        head.setAttribute("position", "0 2.5 0");
        this.obj.append(head);

        let leftArm = document.createElement("a-box");
        leftArm.setAttribute("height", "1.5");
        leftArm.setAttribute("width", "0.4");
        leftArm.setAttribute("depth", "0.4");
        leftArm.setAttribute("color", "#880000");
        leftArm.setAttribute("position", "-1 1.3 0");
        this.obj.append(leftArm);

        let rightArm = document.createElement("a-box");
        rightArm.setAttribute("height", "1.5");
        rightArm.setAttribute("width", "0.4");
        rightArm.setAttribute("depth", "0.4");
        rightArm.setAttribute("color", "#880000");
        rightArm.setAttribute("position", "1 1.3 0");
        this.obj.append(rightArm);

                // LEFT WING
        let leftWing = document.createElement("a-plane");
        leftWing.setAttribute("width", "2");
        leftWing.setAttribute("height", "1");
        leftWing.setAttribute("color", "#550000");
        leftWing.setAttribute("position", "-1.5 1.5 0");
        leftWing.setAttribute("rotation", "0 0 30");
        this.obj.append(leftWing);

        // RIGHT WING
        let rightWing = document.createElement("a-plane");
        rightWing.setAttribute("width", "2");
        rightWing.setAttribute("height", "1");
        rightWing.setAttribute("color", "#550000");
        rightWing.setAttribute("position", "1.5 1.5 0");
        rightWing.setAttribute("rotation", "0 0 -30");
        this.obj.append(rightWing);

        let leftLeg = document.createElement("a-box");
        leftLeg.setAttribute("height", "1.5");
        leftLeg.setAttribute("width", "0.5");
        leftLeg.setAttribute("depth", "0.5");
        leftLeg.setAttribute("color", "#550000");
        leftLeg.setAttribute("position", "-0.4 0 0");
        this.obj.append(leftLeg);

        let rightLeg = document.createElement("a-box");
        rightLeg.setAttribute("height", "1.5");
        rightLeg.setAttribute("width", "0.5");
        rightLeg.setAttribute("depth", "0.5");
        rightLeg.setAttribute("color", "#550000");
        rightLeg.setAttribute("position", "0.4 0 0");
        this.obj.append(rightLeg);

        this.healthBar = document.createElement("a-plane");
        this.healthBar.setAttribute("width", "2");
        this.healthBar.setAttribute("height", "0.25");
        this.healthBar.setAttribute("color", "green");
        this.healthBar.setAttribute("position", { x, y: y + 2.5, z });
        scene.append(this.healthBar);

        this.obj.addEventListener("click", () => {
            if (this.isDead) return;
            if (distance(camera, this.obj) < 15) {
                this.takeDamage(weaponDamage);
            }
        });

        window.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() === "e") {
                if (!this.canBeParried || this.isDead || this.isDying) return;

                if (distance(camera, this.obj) < 5) {
                    this.attemptParry();
                }
            }
        });
    }

    update() {
        if (this.isDead) return;

        this.handleMovement();
        this.separate(); // NEW

        let pos = this.obj.object3D.position;

        pos.x += this.velocityX;
        pos.z += this.velocityZ;

        this.velocityX *= this.friction;
        this.velocityZ *= this.friction;

        pos.x = Math.max(-this.bounds, Math.min(this.bounds, pos.x));
        pos.z = Math.max(-this.bounds, Math.min(this.bounds, pos.z));

        this.obj.object3D.lookAt(camera.object3D.position);

        let camPos = camera.object3D.position;

        this.healthBar.object3D.position.set(pos.x, pos.y + 3.5, pos.z);
        this.healthBar.object3D.lookAt(camPos.x, camPos.y, camPos.z);

        if (this.isDying) {
            this.deathTimer--;
            if (this.deathTimer <= 0) this.isDead = true;
        }

        if (this.attackCooldown > 0) this.attackCooldown--;
        else if (!this.isAttacking && distance(camera, this.obj) < 5) {
            this.attack();
        }
    }

    handleMovement() {
        let pos = this.obj.object3D.position;
        let camPos = camera.object3D.position;

        let dx = camPos.x - pos.x;
        let dy = camPos.y - pos.y;
        let dz = camPos.z - pos.z;

        let dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist < this.aggroRange && dist > this.stopRange) {

            dx /= dist;
            dy /= dist;
            dz /= dist;

            this.velocityX += dx * this.flySpeed;
            this.velocityZ += dz * this.flySpeed;

            pos.y += dy * this.flySpeed * 2;

        } else if (dist >= this.aggroRange) {

            this.randomMovement();

        }
    }

    // SEPARATION SYSTEM (NEW)
    separate() {

        let pos = this.obj.object3D.position;

        for (let other of basicEs) {

            if (other === this || other.isDead) continue;

            let otherPos = other.obj.object3D.position;

            let dx = pos.x - otherPos.x;
            let dz = pos.z - otherPos.z;

            let dist = Math.sqrt(dx*dx + dz*dz);

            if (dist > 0 && dist < this.separationRange) {

                dx /= dist;
                dz /= dist;

                this.velocityX += dx * this.separationForce;
                this.velocityZ += dz * this.separationForce;
            }
        }
    }

    randomMovement() {
        if (Math.random() < 0.02) {
            this.velocityX = (Math.random() - 0.5) * this.speed;
            this.velocityZ = (Math.random() - 0.5) * this.speed;
        }
    }

    takeDamage(amount) {
        if (this.isDead) return;

        this.enemyHealth -= amount;

        this.flashRed();
        this.updateHealthBar();

        if (!this.isDying) this.applyKnockback(0.5);

        if (this.enemyHealth <= 0 && !this.isDying) this.startDeath();
    }

    updateHealthBar() {
        let percent = Math.max(this.enemyHealth / this.maxHealth, 0);

        this.healthBar.setAttribute("scale", {
            x: percent,
            y: 1,
            z: 1
        });
    }

    applyKnockback(force) {
        if (this.isDead) return;

        let pos = this.obj.object3D.position;
        let camPos = camera.object3D.position;

        let dx = pos.x - camPos.x;
        let dz = pos.z - camPos.z;

        let len = Math.sqrt(dx * dx + dz * dz);
        if (len === 0) return;

        dx /= len;
        dz /= len;

        this.velocityX += dx * force;
        this.velocityZ += dz * force;
    }

    flashRed() {
        this.body.setAttribute("color", "white");

        setTimeout(() => {
            if (!this.isDead)
                this.body.setAttribute("color", "#aa0000");
        }, 100);
    }

    startDeath() {
        this.isDying = true;

        this.applyKnockback(2);

        this.obj.setAttribute("animation__spin", {
            property: "rotation",
            to: "0 720 0",
            dur: 600,
            easing: "easeOutQuad"
        });

        this.body.setAttribute("animation__fade", {
            property: "material.opacity",
            to: 0,
            dur: 600
        });

        this.body.setAttribute("material", "transparent:true");

        this.deathTimer = 40;

        setTimeout(() => {
            this.respawn();
        }, this.respawnTime);


    }

    respawn() {

        // Reset stats
        this.enemyHealth = this.maxHealth;
        this.isDead = false;
        this.isDying = false;
        this.hasEnded = false;
        this.attackCooldown = 0;

        // Reset visuals
        this.obj.setAttribute("visible", "true");
        this.body.setAttribute("color", "#aa0000");
        this.body.setAttribute("material", "opacity:1; transparent:true");

        this.healthBar.setAttribute("visible", "true");
        this.updateHealthBar();

        // Reset position slightly (optional but recommended)
        this.velocityX = 0;
        this.velocityZ = 0;
    }

    attack() {
        this.isAttacking = true;
        this.canBeParried = true;

        this.body.setAttribute("color", "yellow");

        setTimeout(() => {

            // 💥 DAMAGE PLAYER IF CLOSE
            if (distance(camera, this.obj) < 5) {
                damagePlayer(10);
            }

            this.canBeParried = false;
            this.isAttacking = false;

            this.body.setAttribute("color", "#aa0000");

            this.attackCooldown = 120;
        }, 500);
    }

    attemptParry() {
        console.log("PARRY SUCCESS!");

        this.applyKnockback(3);

        this.body.setAttribute("color", "blue");

        setTimeout(() => {
            if (!this.isDead)
                this.body.setAttribute("color", "#aa0000");
        }, 200);

        this.canBeParried = false;
        this.isAttacking = false;

        this.attackCooldown = 120;
    }

    ended() {
        if (this.isDead && !this.hasEnded) {

            this.hasEnded = true;

            // 👇 ONLY count in cave
            if (caveMode) {
                enemiesKilled++;
                updateKillCounter();
            }

            this.obj.setAttribute("visible", "false");
            this.healthBar.setAttribute("visible", "false");
        }
    }
}