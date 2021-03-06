var processButtons = processButtons || [];

function setup() {
    var body = document.body;

    var controls1 = document.createElement("div");
    controls1.style.border = "1px solid black";
    controls1.style.padding = "5px";
    controls1.style.marginTop = "5px";
    controls1.style.marginBottom = "5px";
    controls1.style.display = "block";
    controls1.style.width = (512-10) +"px";    // account for padding
	
	var controls2 = document.createElement("div");
    controls2.style.border = "1px solid black";
    controls2.style.padding = "5px";
    controls2.style.marginTop = "5px";
    controls2.style.marginBottom = "5px";
    controls2.style.display = "block";
    controls2.style.width = (512-10) +"px";    // account for padding
	
	var instructions = document.createTextNode("Select a JPEG you would like to edit ");
	controls1.appendChild(instructions);
	
    body.appendChild(controls1);
    body.appendChild(controls2);

    // make a canvas to draw the image into
    var canvas = document.createElement("canvas");
    canvas.width=100;
    canvas.height=100;
    canvas.style.border = "1px solid blue";
    canvas.style.marginTop = "5px";
    canvas.style.marginBottom = "5px";
    body.appendChild(canvas);

    //function to make a button and add it to controls
    function makeButton(name, callback) {
        var button = document.createElement("button");
        button.appendChild(document.createTextNode(name));
        if (callback) {
            button.addEventListener('click', callback, false);
        }
        controls2.appendChild(button);
    }

    // keep an image around - this will be the
    // image that we will play around with
    // note: this is loaded (by the button callback)
    var image = new Image();

    // create a file chooser that will pick the image
    // and load it in
    var fileChooser = document.createElement("input");
    fileChooser.setAttribute("type", "file");
    controls1.appendChild(fileChooser);

    // when a file is chosen, read it in and make it be the image
    fileChooser.addEventListener("change", readImage, false);

    function imageHandler(readerevent)
    {
        //drawImage wants a processing function not an event
        image.onload = function () { drawImage(); };
        image.src = readerevent.target.result;
    }

    function readImage(inputevent)
    {
        var filename = inputevent.target.files[0];
        var fr = new FileReader();
        fr.onload = imageHandler;
        fr.readAsDataURL(filename);
    }

    fileChooser.addEventListener('change', readImage, false);


    // draws the image to the canvas
    function drawImage(process)
    {
        // draw the image
        var context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image,0,0);

        // if there is no image, then don't try to process it
        if (image.width && image.height) {

            // if there is a process to apply, get the image and do stuff to it
            if (process) {
                var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
                var newImageData = process(imagedata);
                // in the event that the new image is a different size, resize the canvas
                canvas.width = newImageData.width;
                canvas.height = newImageData.height;
                context.putImageData(newImageData, 0, 0);
            }
        }
    }

    // for every function on the list, make a button that calls it appropriately
    if (!processButtons.length) {
        alert("No Image Processing Operations Defined!");
    }
    processButtons.forEach(function(f,i) {
        if (typeof f === "function") {
            console.log("name:" + f.name + " idx:" + i);
            var name = f.name || "function " + i;
            makeButton(name, function () {
                drawImage(f);
            });
        } else {
            console.log("Attempt to add a non-function as a button (index "+i+")");
            alert("Attempt to add non-function as Image-Processing Operation");
        }
    });
}
window.onload = setup;