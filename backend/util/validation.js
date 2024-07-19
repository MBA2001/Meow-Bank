
const isEmpty = data => data.trim() === '';

const isEmail = email => {
    const Regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(Regexp)? true : false;
}


exports.checkEmail = (email)=>{
    return isEmail(email);
}

exports.validateLogin = (User) => {
    const errors = {

    };
    if(isEmpty(User.email)) errors.email = 'Must not be empty';
    if(isEmpty(User.password)) errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}


exports.validateSignup = (newUser) => {
    let errors = {
        
    };
    if(isEmpty(newUser.email)) errors.email = 'Must not be empty';
    else if(!isEmail(newUser.email)) errors.email = 'This is not a valid Email address';
    if(isEmpty(newUser.password)) errors.password = 'Must not be empty';
    if(isEmpty(newUser.name)) errors.name = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true:false
    };
}
