window.DB_SCHEMAS = window.DB_SCHEMAS || {};

// Define the schema here:
window.DB_SCHEMAS.recipe = function() {
    return {
        id: "",
        name: "",
        description: "",
        type: "",
        culturalOrigin: "",
        ingredients: "",
        createdBy: "",
        createdOn: ((function() { return Date.now(); })()),
        lastModifiedOn: ((function() { return Date.now(); })()),
        displayPicUrl: "/static/img/recipe-placeholder.png",
        numUpvotes: 0,
        comments: {}
    };
}