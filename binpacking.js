var Settings = {
    cellSize: 25,
    margin: 10
};

var Layer = function(w, h, y) {
    this.width = w;
    this.height = h;
    this.availableW = w;
    this.posY = y;
};

Layer.prototype.insertPiece = function(piece) {
    var self = this;
    if(piece.height > this.height || piece.width > this.availableW) {
        return false;
    }


    var pos = {
        x: self.width - self.availableW,
        y: self.posY
    };
    this.availableW -= piece.width;
    return pos;
};

var Bin = function(w, h) {
    this.width = w;
    this.height = h;
    this.availableH = h;
    this.layers = [];

    this.gBin = $("<div>").addClass("bin").css({
        display: "inline-block",
        position: "relative",
        width: Settings.cellSize * w,
        height: Settings.cellSize * h,
        border: "1px solid black",
        margin: Settings.cellSize *.25
    }).appendTo($("#output"));
};

Bin.prototype.displayPiece = function(piece, x, y) {
    var color = "#" + String("000000" + (Math.floor(Math.random() * parseInt("FFFFFF", 16))).toString(16)).slice(-6);
    var gPiece = $("<div>").addClass("piece").css({
        position: "absolute",
        left: Settings.cellSize * x,
        bottom: Settings.cellSize * y,
        width: Settings.cellSize * piece.width,
        height: Settings.cellSize * piece.height,
        background: color,
        "box-shadow": "inset 0 0 0 1px rgba(0,0,0,0.3)"

    }).appendTo(this.gBin);
};

Bin.prototype.createLayer = function(h) {
    if(h > this.availableH) {
        return false;
    }

    var posY = 0;
    if(this.layers.length >= 1) {
        var prevLayer = this.layers[this.layers.length - 1];
        posY = parseInt(prevLayer.posY) + parseInt(prevLayer.height);
    }
    var layer = new Layer(this.width, h, posY);
    this.layers.push(layer);
    this.availableH -= h;

    return layer;
};

Bin.prototype.insertPiece = function(piece) {
    if(piece.width > this.width || piece.height > this.height) {
        throw "Error: A piece is bigger than the bins";
    }

    var inserted = false;
    for(var i = 0; i < this.layers.length; ++i) {
        var pos = this.layers[i].insertPiece(piece);
        if(pos) {
            this.displayPiece(piece, pos.x, pos.y);
            inserted = true;
            break;
        }
    }

    if(!inserted) {
        var layer = this.createLayer(piece.height);
        if (layer) {
            inserted = this.insertPiece(piece);
        }
    }

    return inserted;
};

var Piece = function(w, h) {
    this.width = w;
    this.height = h;
};


var BinPackingApp = {
    binW : 0,
    binH : 0,
    bins : [],
    pieces : [],
    output : null,

    handleFileReader : function() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            $("#file_input").on("change", this.readFile);
        } else {
            //alert('The File APIs are not fully supported in this browser.');
            $("#file_input").hide().after("<p>File Reader isn't supported by your navigator</p>");
        }
    },

    readFile : function(event) {
        var file = event.target;

        var fileReader = new FileReader();

        fileReader.onload = function() {
            $("#input").val(fileReader.result);
        };

        fileReader.readAsText(file.files[0]);
    },

    readInput : function() {
        var input = $("#input").val();
        var lines = input.split("\n");
        if(lines.length < 2) {
            this.wrongInput();
            return;
        }

        // Bin Size
        var binSize = lines[0].split("x");
        if(binSize.length != 2) {
            this.wrongInput();
            return;
        }

        this.binW = parseInt(binSize[0]);
        this.binH = parseInt(binSize[1]);


        // Pieces
        var pieces = lines[1].split(",");
        for(var i = 0; i < pieces.length; ++i) {
            var pieceSize = pieces[i].split("x");
            if(pieceSize.length != 2) {
                this.wrongInput();
                return;
            }

            this.pieces.push(new Piece(parseInt(pieceSize[0]), parseInt(pieceSize[1])));
        }
    },

    wrongInput : function() {
        // TODO
        alert("Wrong Input");
    },

    clearData : function() {
        this.binW = 0;
        this.binH = 0;
        this.bins = [];
        this.pieces = [];
        this.output.html("");
    },

    sortPieces : function() {
        this.pieces.sort(function(p1, p2) {
            return p2.height - p1.height;
        });
    },

    createBin : function() {
        var bin = new Bin(this.binW, this.binH);
        this.bins.push(bin);
        return bin;
    },

    insertPiece : function(piece) {
        var inserted = false;
        for(var i = 0; i < this.bins.length; ++i) {
            inserted = this.bins[i].insertPiece(piece);
            if(inserted) {
                break;
            }
        }

        if(!inserted) {
            var bin = this.createBin();
            inserted = bin.insertPiece(piece);
        }
    },

    insertPieces : function() {
        try {
            if (this.bins.length < 1) {
                this.createBin();
            }

            for (var i = 0; i < this.pieces.length; ++i) {
                this.insertPiece(this.pieces[i]);
            }
        } catch(err) {
            this.clearData();
            alert(err);
        }
    },

    initialize : function() {
        var self = this;

        this.handleFileReader();
        $("#run_button").click(function(){
            self.run();
        });

        this.output = $("#output");
    },

    run : function() {
        this.clearData();
        this.readInput();
        this.sortPieces();
        this.insertPieces();
    }
};


$( document ).ready(function() {
    BinPackingApp.initialize();
});