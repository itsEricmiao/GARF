/*
    Property class:
    name: string
    value: double
*/
const Property = require('./Property.js')
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

module.exports = Component;