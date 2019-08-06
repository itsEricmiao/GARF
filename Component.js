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


}