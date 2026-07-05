export const validateSignup = ({ firstName, userName, email, password, contactNumber }) => {
    const errors = [];

    if (!firstName) errors.push("First name is required");
    else if (!/^[A-Za-z]+$/.test(firstName)) errors.push("First name should contain only letters");

    if (!userName) errors.push("User name is required");
    else if (!/^[a-zA-Z0-9_]+$/.test(userName)) errors.push("Username can only contain letters, numbers, and underscores");

    if (!email) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Please enter a valid email address");

    if (!password) errors.push("Password is required");
    else {
        if (password !== password.trim()) errors.push("Password should not start or end with spaces");
        if (password.length < 6) errors.push("Password must be at least 6 characters");
    }

    if (contactNumber && !/^[0-9]{10}$/.test(contactNumber)) {
        errors.push("Contact number must be exactly 10 digits");
    }

    return errors;
};