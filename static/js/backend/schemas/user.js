window.DB_SCHEMAS = window.DB_SCHEMAS || {};

// Define the schema here:
window.DB_SCHEMAS.user = function() {
    return {
        username: "",
        password: "",
        email: "",
        displayPicUrl: "/static/img/user-placeholder.png",
        createdOn: ((function() { return Date.now(); })()),
        lastModifiedOn: ((function() { return Date.now(); })()),
        recipes: {}
    };
}