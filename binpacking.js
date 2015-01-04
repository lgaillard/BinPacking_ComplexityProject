var Settings = {
    cellSize: 25,
    margin: 10
};

var Bin = function(w, h) {
    this.width = w;
    this.height = h;
    this.availableH = h;
    this.layers = [];

    this.gBin = $("<div>").addClass("bin").css({
        position: "relative",
        width: Settings.cellSize * w,
        height: Settings.cellSize * h,
        border: "1px solid black",
        margin: Settings.cellSize
    }).appendTo($("#output"));
    this.insertPiece(new Piece(2,1), 0, 0);
};

Bin.prototype.insertPiece = function(piece, x, y) {
    if(piece.width > this.width || piece.height > this.height) {
        //TODO:
        alert("Error: A piece is bigger than the bins");
        return;
    }

    var color = "#" + String("000000" + (Math.floor(Math.random() * parseInt("FFFFFF", 16))).toString(16)).slice(-6);
    var gPiece = $("<div>").addClass("piece").css({
        position: "absolute",
        left: Settings.cellSize * x,
        bottom: Settings.cellSize * y,
        width: Settings.cellSize * piece.width,
        height: Settings.cellSize * piece.height,
        background: color,
        "box-shadow": "inset 0 0 0 1px rgba(0,0,0,0.2)"

    }).appendTo(this.gBin);
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

        this.binW = binSize[0];
        this.binH = binSize[1];


        // Pieces
        var pieces = lines[1].split(",");
        for(var i = 0; i < pieces.length; ++i) {
            var pieceSize = pieces[i].split("x");
            if(pieceSize.length != 2) {
                this.wrongInput();
                return;
            }

            this.pieces.push(new Piece(pieceSize[0], pieceSize[1]));
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
    },

    sortPieces : function() {
        this.pieces.sort(function(p1, p2) {
            return p2.height - p1.height;
        });
    },

    insertPieces : function() {
        if(this.bins.length < 1) {
            this.bins.push(new Bin(this.binW, this.binH));
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