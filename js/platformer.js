var platformer = function() { // module pattern

    //-------------------------------------------------------------------------
    // POLYFILLS
    //-------------------------------------------------------------------------

    if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
        window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
    }

    //-------------------------------------------------------------------------
    // UTILITIES
    //-------------------------------------------------------------------------

    function timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    function bound(x, min, max) {
        return Math.max(min, Math.min(max, x));
    }

    function get(url, onsuccess) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if ((request.readyState == 4) && (request.status == 200))
                onsuccess(request);
        };
        request.open("GET", url, true);
        request.send();
    }

    function overlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(((x1 + w1 - 1) < x2) ||
            ((x2 + w2 - 1) < x1) ||
            ((y1 + h1 - 1) < y2) ||
            ((y2 + h2 - 1) < y1));
    }

    //-------------------------------------------------------------------------
    // GAME CONSTANTS AND VARIABLES
    //-------------------------------------------------------------------------

    var MAP = {
            tw: 64,
            th: 48
        },
        TILE = 32,
        METER = TILE,
        GRAVITY = 9.8 * 6, // default (exagerated) gravity
        MAXDX = 15, // default max horizontal speed (15 tiles per second)
        MAXDY = 60, // default max vertical speed   (60 tiles per second)
        ACCEL = 1 / 2, // default take 1/2 second to reach maxdx (horizontal acceleration)
        FRICTION = 1 / 6, // default take 1/6 second to stop from maxdx (horizontal friction)
        IMPULSE = 1500, // default player jump impulse
        COLOR = {
            BLACK: '#111111',
            YELLOW: '#fffd98',
            GREEN: '#40a000',
            LIGHTGREEN: '#80e000',
            BROWN: '#c06000',
            DARKBROWN: '#602000',
            BLUE: '#0006FF',
            GOLD: 'gold'
        },
        COLORS = [COLOR.YELLOW, COLOR.GREEN, COLOR.BLACK, COLOR.BROWN, COLOR.DARKBROWN],
        KEY = {
            SPACE: 32,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        };

    var fps = 60,
        step = 1 / fps,
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width = MAP.tw * TILE,
        height = canvas.height = MAP.th * TILE,
        player = {},
        platforms = [],
        cells = [];

    var t2p = function(t) {
            return t * TILE;
        },
        p2t = function(p) {
            return Math.floor(p / TILE);
        },
        cell = function(x, y) {
            return tcell(p2t(x), p2t(y));
        },
        tcell = function(tx, ty) {
            return cells[tx + (ty * MAP.tw)];
        };

    var balls = [];

    var coords = {};
    var offsets = $('#canvas').offset();
    var top = offsets.top;
    var left = offsets.left;

    //-------------------------------------------------------------------------
    // TAYLOR FUNCs
    //-------------------------------------------------------------------------.
    canvas.addEventListener('click', function(event) {
        var x = event.pageX - left,
            y = event.pageY - top;
        coords.x = x;
        coords.y = y;
        var lastClicked = 4;
        for (var i = 0; i < platforms.length; i++) {
            if (coords.y > platforms[i].clickY && coords.y < platforms[i].clickY + platforms[i].clickHeight && coords.x > platforms[i].clickX && coords.x < platforms[i].clickX + platforms[i].clickWidth) {
                $("#" + platforms[i].id).fadeIn("slow");
                platforms[i].clicked = true;
                platforms[lastClicked].clicked = false;
                lastClicked = i;
            } else {
                $("#" + platforms[i].id).fadeOut("slow");
                platforms[i].clicked = false;
            }
        }
    });
    //-------------------------------------------------------------------------
    // Explosion on ???
    //-------------------------------------------------------------------------.
    function Ball(x, y) {
        this.x = x;
        this.y = y;
        this.x_speed = Math.floor((Math.random() * 10) + 1);
        this.y_speed = Math.floor((Math.random() * 10) + 1);
        this.radius = 5;
    }
    /* Create Ball methods*/
    Ball.prototype.render = function() {
        /*Put "pen" down on canvas*/
        ctx.beginPath();
        /*Draw an arc starting at the x and y, using the radius, and the angle in radians, Counter Clockwise is false*/
        ctx.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
        ctx.fillStyle = "white";
        ctx.fill();
    };

    function renderBalls() {
        for (var i = 0; i < balls.length; i++) {
            balls[i].render();
        }
    }

    function updateBalls() {
        for (var i = 0; i < balls.length; i++) {
            balls[i].x += balls[i].x_speed;
            balls[i].y += balls[i].y_speed;

            if (balls[i].x > width || balls[i].y > height) {
                balls.splice(i, 1);
            }
        }
    }

    function spawnBalls() {
        if (balls.length < 100) {
            var ball = new Ball(100, 200);
            balls.push(ball);
        }
    }
    //-------------------------------------------------------------------------
    // UPDATE LOOP
    //-------------------------------------------------------------------------

    function onkey(ev, key, down) {
        switch (key) {
            case KEY.LEFT:
                player.left = down;
                ev.preventDefault();
                return false;
            case KEY.RIGHT:
                player.right = down;
                ev.preventDefault();
                return false;
            case KEY.SPACE:
                player.jump = down;
                ev.preventDefault();
                return false;
        }
    }

    function update(dt) {
        updatePlayer(dt);
        updateBalls();
    }

    function updatePlayer(dt) {
        updateEntity(player, dt);
    }

    function updateEntity(entity, dt) {
        var wasleft = entity.dx < 0,
            wasright = entity.dx > 0,
            falling = entity.falling,
            friction = entity.friction * (falling ? 0.5 : 1),
            accel = entity.accel * (falling ? 0.5 : 1);

        entity.ddx = 0;
        entity.ddy = entity.gravity;

        if (entity.left)
            entity.ddx = entity.ddx - accel;
        else if (wasleft)
            entity.ddx = entity.ddx + friction;

        if (entity.right)
            entity.ddx = entity.ddx + accel;
        else if (wasright)
            entity.ddx = entity.ddx - friction;

        if (entity.jump && !entity.jumping && !falling) {
            entity.ddy = entity.ddy - entity.impulse; // an instant big force impulse
            entity.jumping = true;
        }

        entity.x = entity.x + (dt * entity.dx);
        entity.y = entity.y + (dt * entity.dy);
        entity.dx = bound(entity.dx + (dt * entity.ddx), -entity.maxdx, entity.maxdx);
        entity.dy = bound(entity.dy + (dt * entity.ddy), -entity.maxdy, entity.maxdy);

        if ((wasleft && (entity.dx > 0)) ||
            (wasright && (entity.dx < 0))) {
            entity.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
        }

        var tx = p2t(entity.x),
            ty = p2t(entity.y),
            nx = entity.x % TILE,
            ny = entity.y % TILE,
            cell = tcell(tx, ty),
            cellright = tcell(tx + 1, ty),
            celldown = tcell(tx, ty + 1),
            celldiag = tcell(tx + 1, ty + 1);

        if (entity.dy > 0) {
            if ((celldown && !cell) ||
                (celldiag && !cellright && nx)) {
                entity.y = t2p(ty);
                entity.dy = 0;
                entity.falling = false;
                entity.jumping = false;
                ny = 0;
            }
        } else if (entity.dy < 0) {
            if ((cell && !celldown) ||
                (cellright && !celldiag && nx)) {
                entity.y = t2p(ty + 1);
                entity.dy = 0;
                cell = celldown;
                cellright = celldiag;
                ny = 0;
            }
        }

        if (entity.dx > 0) {
            if ((cellright && !cell) ||
                (celldiag && !celldown && ny)) {
                entity.x = t2p(tx);
                entity.dx = 0;
            }
        } else if (entity.dx < 0) {
            if ((cell && !cellright) ||
                (celldown && !celldiag && ny)) {
                entity.x = t2p(tx + 1);
                entity.dx = 0;
            }
        }


        entity.falling = !(celldown || (nx && celldiag));

        /*Fade in for overlap or click*/
        for (n = 0; n < platforms.length; n++) {
            if (overlap(entity.x, entity.y, TILE, TILE, platforms[n].start.x, platforms[n].start.y, platforms[n].width, platforms[n].height)) {
                $("#" + platforms[n].id).fadeIn("slow");
                if (n == 4) {
                    /*If you stand on the ??? platform*/
                    spawnBalls();
                }
            }
            if (!overlap(entity.x, entity.y, TILE, TILE, platforms[n].start.x, platforms[n].start.y, platforms[n].width, platforms[n].height) && platforms[n].clicked == false) {
                $("#" + platforms[n].id).fadeOut("slow");
            }
            if (!overlap(entity.x, entity.y, TILE, TILE, platforms[n].start.x, platforms[n].start.y, platforms[n].width, platforms[n].height) && platforms[n].clicked == true) {
                $("#" + platforms[n].id).fadeIn("slow");
            }
        }

    }

    //-------------------------------------------------------------------------
    // RENDERING
    //-------------------------------------------------------------------------

    function render(ctx, frame, dt) {
        ctx.clearRect(0, 0, width, height);
        renderMap(ctx);
        renderHeadlines(platforms);
        renderPlayer(ctx, dt);
        renderBalls();
    }

    function renderMap(ctx) {
        var x, y, cell;
        for (y = 0; y < MAP.th; y++) {
            for (x = 0; x < MAP.tw; x++) {
                cell = tcell(x, y);
                if (cell) {
                    ctx.fillStyle = COLORS[cell - 1];
                    ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                }
            }
        }
    }

    function renderPlayer(ctx, dt) {
        ctx.fillStyle = COLOR.BLUE;
        ctx.fillRect(player.x + (player.dx * dt), player.y + (player.dy * dt), TILE, TILE);
    }

    function renderHeadlines(plats) {
        for (n = 0; n < plats.length; n++) {
            ctx.font = "40px Titillium Web";
            ctx.fillStyle = COLOR.YELLOW;
            ctx.fillText(plats[n].display, plats[n].start.x, plats[n].start.y + plats[n].height - 20);
        }
    }
    //-------------------------------------------------------------------------
    // LOAD THE MAP
    //-------------------------------------------------------------------------
    var w = window.innerWidth;
    var h = window.innerHeight;
    //console.log("screen width: " + w + " screen height: " + h);

    function setup(map) {
        var data = map.layers[0].data,
            objects = map.layers[1].objects,
            n, obj, entity;

        for (n = 0; n < objects.length; n++) {
            obj = objects[n];
            entity = setupEntity(obj);
            switch (obj.type) {
                case "player":
                    player = entity;
                    break;
                case "platform":
                    platforms.push(entity);
                    break;
            }
        }

        cells = data;
        /*Scale the x, y and width and height of the platforms for clicking X and Y*/
        var xsRatio = (2048 / 512);
        var smRatio = (2048 / 640);
        var mdRatio = (2048 / 768);
        var lgRatio = (2048 / 896);
        var xlRatio = (2048 / 1024);
        for (var j = 0; j < platforms.length; j++) {
            if (j === 4) {
                /*skip the ??? platform, I don't want people to be able to click it*/
                platforms[j].clickX = null;
                platforms[j].clickY = null;
                platforms[j].clickWidth = null;
                platforms[j].clickHeight = null;
                continue;
            }
            if (w <= 839 || h <= 529) {
                platforms[j].clickX = platforms[j].x / xsRatio;
                platforms[j].clickY = platforms[j].y / xsRatio;
                platforms[j].clickWidth = platforms[j].width / xsRatio;
                platforms[j].clickHeight = platforms[j].height / xsRatio;
            } else if (w <= 967 || h <= 625) {
                platforms[j].clickX = platforms[j].x / smRatio;
                platforms[j].clickY = platforms[j].y / smRatio;
                platforms[j].clickWidth = platforms[j].width / smRatio;
                platforms[j].clickHeight = platforms[j].height / smRatio;
            } else if (w <= 1095 || h <= 721) {
                platforms[j].clickX = platforms[j].x / mdRatio;
                platforms[j].clickY = platforms[j].y / mdRatio;
                platforms[j].clickWidth = platforms[j].width / mdRatio;
                platforms[j].clickHeight = platforms[j].height / mdRatio;
            } else if (w <= 1223 || h <= 817) {
                platforms[j].clickX = platforms[j].x / lgRatio;
                platforms[j].clickY = platforms[j].y / lgRatio;
                platforms[j].clickWidth = platforms[j].width / lgRatio;
                platforms[j].clickHeight = platforms[j].height / lgRatio;
            } else if (w > 1223 || h > 817) {
                platforms[j].clickX = platforms[j].x / xlRatio;
                platforms[j].clickY = platforms[j].y / xlRatio;
                platforms[j].clickWidth = platforms[j].width / xlRatio;
                platforms[j].clickHeight = platforms[j].height / xlRatio;
            } else {

            }
            /*platforms[j].clickX = platforms[j].x/(2048/768);
            platforms[j].clickY = platforms[j].y/(1536/576);
            platforms[j].clickWidth = platforms[j].width/(1536/576);
            platforms[j].clickHeight = platforms[j].height/(1536/576);*/
        }
    }

    function setupEntity(obj) {
        var entity = {};
        entity.name = obj.name.charAt(0).toUpperCase() + obj.name.slice(1);
        entity.display = obj.properties.display;
        entity.id = obj.properties.id;
        entity.clicked = false;
        entity.x = obj.x;
        entity.y = obj.y;
        entity.width = obj.width;
        entity.height = obj.height;
        entity.dx = 0;
        entity.dy = 0;
        entity.gravity = METER * (obj.properties.gravity || GRAVITY);
        entity.maxdx = METER * (obj.properties.maxdx || MAXDX);
        entity.maxdy = METER * (obj.properties.maxdy || MAXDY);
        entity.impulse = METER * (obj.properties.impulse || IMPULSE);
        entity.accel = entity.maxdx / (obj.properties.accel || ACCEL);
        entity.friction = entity.maxdx / (obj.properties.friction || FRICTION);
        entity.player = obj.type == "player";
        entity.left = obj.properties.left;
        entity.right = obj.properties.right;
        entity.start = {
            x: obj.x,
            y: obj.y
        };
        return entity;
    }

    //-------------------------------------------------------------------------
    // THE GAME LOOP
    //-------------------------------------------------------------------------

    var counter = 0,
        dt = 0,
        now,
        last = timestamp(),
        fpsmeter = new FPSMeter({
            decimals: 0,
            graph: true,
            theme: 'dark',
            left: '5px'
        });

    function frame() {
        fpsmeter.tickStart();
        now = timestamp();
        dt = dt + Math.min(1, (now - last) / 1000);
        while (dt > step) {
            dt = dt - step;
            update(step);
        }
        render(ctx, counter, dt);
        last = now;
        counter++;
        fpsmeter.tick();
        requestAnimationFrame(frame, canvas);
    }

    document.addEventListener('keydown', function(ev) {
        return onkey(ev, ev.keyCode, true);
    }, false);
    document.addEventListener('keyup', function(ev) {
        return onkey(ev, ev.keyCode, false);
    }, false);

    /*AJAX call for map, when it's ready start the first frame*/
    get("js/taylorMap.json", function(req) {
        setup(JSON.parse(req.responseText));
        frame();
        console.log(player);
        touchFile(player);
    });
};
platformer();
