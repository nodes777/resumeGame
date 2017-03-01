//var canvas = document.getElementById("mainCanvas"); // points to the on-screen, original HTML canvas element
//var ctx = canvas.getContext('2d'); // the drawing context of the on-screen canvas element
var osCanvas = document.createElement("oscanvas"); // creates a new off-screen canvas element
var osContext = osCanvas.getContext('2d'); //the drawing context of the off-screen canvas element
osCanvas.width = canvas.width; // match the off-screen canvas dimensions with that of #mainCanvas
osCanvas.height = canvas.height;


var mapRendered = false;
function drawMapOnce(){
    if( mapRendered === false ){ // create and save the title image
        mapCache = document.createElement('canvas');
        mapCache.width = osCanvas.width;
        mapCache.height = osCanvas.height;
       renderMap(ctx);
    }

    osContext.drawImage( mapCache, 0, 0 );
    mapRendered = true;
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
        mapRendered = true;
    }