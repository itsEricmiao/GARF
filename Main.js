//Test case:


const Property = require('./Property.js')
const Component = require('./Component.js')

let c = new Component();
let arr = [];
for(let i = 0; i < 5; i++)
{
    let name = "F"+i;
    let value = Math.random();
    let p = new Property();
    p.quickSetting(name,value);
    arr.push(p);
}

c.setName("SMU_001");
c.setClassification(1);
c.setProperties(arr);
c.printComponent();