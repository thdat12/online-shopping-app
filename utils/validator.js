module.exports.validatorRegister = (firstName, lastName, email, phone, password, confirmPassword) => {
  const errors = {}
  if (firstName.trim() === '') {
    errors.username = 'Username can not be empty'
  }
  if (lastName.trim() === '') {
    errors.username = 'Username can not be empty'
  }
  if (email.trim() === '') {
    errors.email = 'Email can not be empty'
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    if (!email.match(regEx)) {
      errors.email = 'Email must be valid email adress'
    }
  }
  if (phone.length < 10) {
    errors.phone = 'Phone Number must be at least 10 number'
  }
  if (password.trim() === '') {
    errors.password = 'Password can not be empty'
  }
  if (password !== confirmPassword) {
    errors.password = 'Passwords are not match'
  }

  return {
    errors,
    valid: Object.keys(errors) < 1
  }
}

module.exports.validatorLogin = (email, password) => {
  const errors = {}
  if (email.trim() === '') {
    errors.email = 'Email can not be empty'
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    if (!email.match(regEx)) {
      errors.email = 'Email must be valid email adress'
    };
  };
  if (password.trim() === '') {
    errors.password = 'Password can not be empty'
  };
  return {
    errors,
    valid: Object.keys(errors) < 1
  }
}

module.exports.validatorUploadProduct = (title, price, quantity) => {
  const errors = {}
  if(title.trim() === ''){
    errors.title = 'Title can not be empty'
  }
  if(price <= 0){
    errors.price = 'Price is not negative'
  }
  if(quantity <=0){
    errors.quantity = 'Quantity must be greater than 0'
  }
  return {
    errors,
    valid: Object.keys(errors) < 1
  }
}