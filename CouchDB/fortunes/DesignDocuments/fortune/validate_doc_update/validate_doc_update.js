var validate_doc_update = function(newDoc, oldDoc, userCtx) {
        function require(field, message) {
            message = message || "Document must have a " + field;
            if (!newDoc[field]) throw({forbidden : message});
        };
        function unchanged(field) {
            if (oldDoc && toJSON(oldDoc[field]) != toJSON(newDoc[field])) {
            	throw( {forbidden : "Can't change the field " + field + " on update."} );
            }
        };
        
        if (newDoc.type == "fortune") {
            require("body");
            require("random_id");
            require("created_at");
            unchanged("random_id");
            unchanged("created_at");
        }
    };