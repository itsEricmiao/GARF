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
        return ( "Feature: "+ this.name + " value = " + this.value); 
    }

    quickSetting(name_, value_)
    {
        this.setName(name_);
        this.setValue(value_);
    }

}

module.exports = Property;


