var binpacking = {
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

    initialize : function() {
        this.handleFileReader();
        $("#run_button").click(this.run);
    },

    run : function() {

    }
};


$( document ).ready(function() {
    binpacking.initialize();
});