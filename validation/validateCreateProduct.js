export default function validateCreateProduct(values) {
    let errors = {};

    if (!values.name) {
        errors.name = "The name is mandatory";
    }

    if (!values.company) {
        errors.company = "The company's name is mandatory";
    }

    if (!values.url) {
        errors.url = "The product's url is mandatory";
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
        errors.url = "The URL is not valid";
    }

    if(!values.description) {
        errors.description = "Please add a description"
    }


    return errors;
}