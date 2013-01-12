var validate_doc_update = function(newDoc, oldDoc, userCtx) {
        function require(field, message) {
            message = message || "Document must have a " + field;
            if (!newDoc[field]) throw({forbidden : message});
        };
        function unchanged(field) {
            if (oldDoc && toJSON(oldDoc[field]) != toJSON(newDoc[field])) {
            }
        };
        
        if (newDoc.type == "fortune") {
            require("body");
            require("sequence_id");
            require("created_at");
            unchanged("sequence_id");
            unchanged("created_at");
        }
    };