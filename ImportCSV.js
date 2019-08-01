/*
    Import CSV files and convert to AdjList data structure
    Import using Angular
*/
console.log("This is Import CSV function");
let attendeesArray = [];
let fileUploaded = false;
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
    processData(csv);
}

function errorHandler(event)
{
    if(event.target.error.name == "NotReadableError")
    {
        alert('ERROR: Cannot read file!');
    }
}

//NOTE: Convert to Array for now and will add to AdjList once implemented 
function processData(csv)
{
    let allTextLines = csv.split(/\r\n|\n);
    for (let i = 0; i < allTextLines.length; i++)
    {
        let row = allTextLines[i].split(';');
        let col = []; //empty array for now
        for( j = 0; j < row.length; j++)
        {
            col.push(row[j]);
        }
        attendeesArray.push(col);
    }

}


