export default function validateCreateAccount(values) {
    let errors = {};

    if (!values.name) {
        errors.name = "The name is mandatory";
    }

    if (!values.email) {
        errors.email = "The email is necessary";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "No valid email"
    }

    if (!values.password) {
        errors.password = 'The password is mandatory'
    } else if (values.password.length < 6) {
        errors.password = 'The password length must be 6'
    }

    return errors;
}