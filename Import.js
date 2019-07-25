/*
    Import CSV files and convert to AdjList data structure
    Import using Angular
*/
console.log("This is Import function");

function handleFiles(files)
{
    if(window.fileReader)
    {
        getAsText(files[0]);
        fileUploaded = true;
    } else 
    {
        alert ("File reader not supported");
    }
}

function getAsText(fileToRead)
{
    let reader = new FileReader();

    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler (event)
{
    let csv = event.target.result;
}


