window.DB_SCHEMAS = window.DB_SCHEMAS || {};

// Define the schema here:
window.DB_SCHEMAS.recipe = function() {
    return {
        name: "",
        author: "",
        createdOn: ((function() { return Date.now(); })()),
        lastModifiedOn: ((function() { return Date.now(); })()),
        displayPicUrl: "/static/img/recipe-placeholder.png",
        numUpvoted: 0,
        numDownvotes: 0,
        ingredients: "",
        comments: {}
    };
}