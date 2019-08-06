/*
    Property class:
    name: string
    value: double
*/


class Property 
{
    constructor() 
    {
        this.name = "";
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

    getProperty()
    {
        return ( "Property name:"+ this.name + " value = " + this.value); 
    }

    quickSetting(name_, value_)
    {
        this.setName(name_);
        this.setValue(value_);
    }

}



class Component {
    constructor() 
    {
        this.name = "";
        this.properties = [];
        this.classification = 0;
    }



    getProperties() // Property* []
    {
        return this.properties;
    }


    getClassification() // int
    {
        return this.classification;
    }


    getName() // string
    {
        return this.name;
    }


    setClassification(type) //void
    {
        this.classification = type;
    }
    

    setName(component_name) //void
    {
        this.name = component_name;
    }

    setProperties(all_properties)
    {
        this.properties = all_properties;
    }


    printComponent()
    {
        console.log("Component name:",this.name,"Classification:",this.classification);
        for(let i = 0; i < this.properties.length; i++)
        {
            console.log(this.properties[i].getProperty());
        }
    }

}


//Test case:
let c = new Component();
let arr = [];
for(let i = 0; i < 5; i++)
{
    var name = "F"+i;
    var value = Math.random();
    let p = new Property();
    p.quickSetting(name,value);
    arr.push(p);
}

c.setName("SMU_001");
c.setClassification(1);
c.setProperties(arr);
c.printComponent();