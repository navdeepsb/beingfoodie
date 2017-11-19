window.DB_SCHEMAS = window.DB_SCHEMAS || {};

// Define the schema here:
window.DB_SCHEMAS.comment = function() {
    return {
        id: "",
        text: "",
        createdBy: "",
        createdOn: ((function() { return Date.now(); })()),
        lastModifiedOn: ((function() { return Date.now(); })()),
        numUpvotes: 0,
    };
}