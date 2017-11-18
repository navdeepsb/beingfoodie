window.DB_SCHEMAS = window.DB_SCHEMAS || {};

// Define the schema here:
window.DB_SCHEMAS.user = function() {
    return {
        _key: "",
        username: "",
        password: "",
        email: "",
        displayPicUrl: "/static/img/user-placeholder.png",
        recipes: {}
    };
}