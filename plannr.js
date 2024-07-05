let naturalPerson=  [
    {
        "id": "0a374bca-e9a1-4ff6-b745-431400efa7fe",
        "plannerCrmId": "2655bda5-3b0c-445b-9569-76e02280c44c",
        "imageUrl": "https://eu.ui-avatars.com/api/?name=Kimberley+Sare",
        "salutation": "Mrs",
        "first_name": "Kimberley",
        "last_name": "Sare",
        "linkedCRM": "Planner",
        "linkedCRMStatus": "live",
        "role": "joint",
        "groupId": "27864d0f-655f-463a-95c8-0e2ae66cf2aa"
    },
    {
        "id": "cb153dba-ccab-4e5f-8255-3af754dbf2f8",
        "plannerCrmId": "008f1507-0759-44f5-bd2f-22d72106c97a",
        "imageUrl": "https://eu.ui-avatars.com/api/?name=Stephen+Sare",
        "salutation": null,
        "first_name": "Stephen",
        "last_name": "Sare",
        "linkedCRM": "Planner",
        "linkedCRMStatus": "live",
        "role": "joint",
        "groupId": "812d09a3-c459-45c0-8e3f-1eb99e6aefc9"
    },
    {
        "id": "5f856060-aff7-43a0-821c-480229343883",
        "plannerCrmId": "4e21bde4-92b2-4fce-9098-c037e19d7abf",
        "imageUrl": "https://eu.ui-avatars.com/api/?name=Harry+Styles",
        "salutation": "Mr",
        "first_name": "Harry",
        "last_name": "Styles",
        "linkedCRM": "Planner",
        "linkedCRMStatus": "live",
        "role": "joint",
        "groupId": "abf17a5d-d75c-45c1-a510-619087ed0ad1"
    },
    {
        "id": "69b1db8d-b59d-41b0-8d52-1e82f5b4436f",
        "plannerCrmId": "635c41dd-21d3-447f-93e8-89528fc6fe64",
        "imageUrl": "https://eu.ui-avatars.com/api/?name=Melissa+Styles",
        "salutation": "Mrs",
        "first_name": "Melissa",
        "last_name": "Styles",
        "linkedCRM": "Planner",
        "linkedCRMStatus": "live",
        "role": "joint",
        "groupId": "c1c570d2-f061-4a2f-972e-7856565f3039"
    },
    {
        "id": "1e04d5fd-36df-443c-a348-66762a064e9c",
        "plannerCrmId": "0dc47821-6d8d-4416-9d26-f7507008b424",
        "first_name": "Johnny",
        "last_name": "Styles",
        "linkedCRM": "Planner",
        "linkedCRMStatus": "live",
        "role": "individual",
        "groupId": "77f00d34-fa11-460a-addc-829b378b95bf"
    },
    {
        "id": "7cdd7571-a574-4657-8889-8c85499e4cbc",
        "plannerCrmId": "d8776944-85c2-4162-8bd1-42cb8d194774",
        "first_name": "Lilly",
        "last_name": "Sare",
        "linkedCRM": "Planner",
        "linkedCRMStatus": "live",
        "role": "individual",
        "groupId": "3668c9e4-0f4b-4355-9851-cbaaad323dd4"
    }
]
let  artificialPersonData =  [
    {
        "plannerCrmId": "3adc96f2-d0c7-4509-88aa-ab92815b8544",
        "name": "Styles Family Trust 2",
        "typeOfAccount": "trust",
        "linkedNaturalPerson": [
            "4e21bde4-92b2-4fce-9098-c037e19d7abf",
            "635c41dd-21d3-447f-93e8-89528fc6fe64"
        ]
    },
    {
        "plannerCrmId": "de40396b-26fc-46c0-8fe4-b4bdd9bd33e0",
        "name": "The Styles Family Trust",
        "typeOfAccount": "trust",
        "linkedNaturalPerson": [
            "4e21bde4-92b2-4fce-9098-c037e19d7abf",
            "2655bda5-3b0c-445b-9569-76e02280c44c",
            "26599458-6812-4189-86c8-0563d0d289db"
        ]
    },
    {
        "plannerCrmId": "97cccb37-fce9-481c-8e39-c937523a4269",
        "name": "Styles enterprises",
        "typeOfAccount": "business",
        "linkedNaturalPerson": [
            "4e21bde4-92b2-4fce-9098-c037e19d7abf",
            "2655bda5-3b0c-445b-9569-76e02280c44c",
            "26599458-6812-4189-86c8-0563d0d289db"
        ]
    }
]
let relation= [
    {
        "id": "7f7fffdc-13e2-450e-96f2-d1476f1de7e6",
        "naturalPersonFrom": "4e21bde4-92b2-4fce-9098-c037e19d7abf",
        "naturalPersonTo": "635c41dd-21d3-447f-93e8-89528fc6fe64",
        "relationType": "spouse",
        "groupId": "abf17a5d-d75c-45c1-a510-619087ed0ad1"
    },
    {
        "id": "038ffa25-b572-45c3-a4cf-09c3331fbeb6",
        "naturalPersonFrom": "635c41dd-21d3-447f-93e8-89528fc6fe64",
        "naturalPersonTo": "4e21bde4-92b2-4fce-9098-c037e19d7abf",
        "relationType": "spouse",
        "groupId": "c1c570d2-f061-4a2f-972e-7856565f3039"
    },
    {
        "id": "86166f2b-9626-4034-8d86-fdf0883508fa",
        "naturalPersonFrom": "4e21bde4-92b2-4fce-9098-c037e19d7abf",
        "naturalPersonTo": "0dc47821-6d8d-4416-9d26-f7507008b424",
        "relationType": "son"
    },
    {
        "id": "b082b10d-2fdd-4915-ae42-046cf535940c",
        "naturalPersonFrom": "2655bda5-3b0c-445b-9569-76e02280c44c",
        "naturalPersonTo": "d8776944-85c2-4162-8bd1-42cb8d194774",
        "relationType": "child"
    }
]
const fs = require('fs');
(() => {
    for (let index = 0; index < naturalPerson.length; index++) {
       if(!naturalPerson[index].group){
        naturalPerson[index].group = naturalPerson[index].groupId
        let i = relation.findIndex(ele => ele.naturalPersonFrom === naturalPerson[index].plannerCrmId)
            if(i>=0){
                relation[i].group = naturalPerson[index].group;
                let personIndex = naturalPerson.findIndex(e => e.plannerCrmId === relation[i].naturalPersonTo);
                if(personIndex >= 0){
                    naturalPerson[personIndex].group = naturalPerson[index].group;
                }
            }
        artificialPersonData.map((ee) => {
         if(!ee.group){
            if(ee.linkedNaturalPerson.includes(naturalPerson[index].plannerCrmId)){
                ee.group = naturalPerson[index].group
            }
         }
        })   
       }else{
            let i = relation.findIndex(ele => ele.naturalPersonFrom === naturalPerson[index].plannerCrmId)
            if(i>=0){
                relation[i].group = naturalPerson[index].group;
                let personIndex = naturalPerson.findIndex(e => e.plannerCrmId === relation[i].naturalPersonTo);
                if(personIndex >= 0){
                    naturalPerson[personIndex].group = naturalPerson[index].group;
                }
            }
            artificialPersonData.map((ee) => {
                if(!ee.group){
                   if(ee.linkedNaturalPerson.includes(naturalPerson[index].plannerCrmId)){
                       ee.group = naturalPerson[index].group
                   }
                }
               }) 
       } 
    }
    fs.writeFileSync('./test3.json',JSON.stringify(artificialPersonData),(err)=> {
        if(err){
            console.log(err);
        }
    })
})()