var Bin = function(w, h) {
    this.width = w;
    this.height = h;
};

var Piece = function(w, h) {
    this.width = w;
    this.height = h;
};


var BinPackingApp = {
    binW : 0,
    binH : 0,
    pieces : Array(),

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

        fileReader.onload = function(file) {
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
        this.pieces = Array();
    },

    initialize : function() {
        var self = this;

        this.handleFileReader();
        $("#run_button").click(function(){
            self.run();
        });
    },

    run : function() {
        this.readInput();
    }
};


$( document ).ready(function() {
    BinPackingApp.initialize();
});