console.log("This is the Property class");
class Property 
{
    constructor() 
    {
        this.name = [];
        this.value = 0.0;
    }

    setName(data_name)
    {
        this.name = data_name;
    } 


    getName()
    {
        return this.name;
    }


    setValue(data_value)
    {
        this.value = data_value;
    }


    getValue()
    {
        return this.value;
    }

    printProperty()
    {
        console.log( "Property name:"+ this.name + " value:" + this.value);

    }

}


let x = new Property();
x.setName("Feature 1");
x.setValue(0.11343134);
x.printProperty();