const { Error } = require('mongoose');
const validator = require('validator');

const validate = (data)=>{
     const mandatoryField = ['firstName',"emailId",'password'];
     const IsAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k));
     //Ye line check kar rahi hai ki mandatoryField ke andar diye gaye saare required fields data ke andar present hain ya nahi.
     if(!IsAllowed){
        throw new Error("Some field missing"); 
     }
     if(!validator.isEmail(data.emailId))
        throw new Error("inavlid email");
    if(!validator.isStrongPassword(data.password))
        throw new Error("weak password");
}

module.exports = validate;