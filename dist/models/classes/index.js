"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModel = exports.ModelManager = void 0;
class ModelManager {
    constructor(connection) {
    }
}
exports.ModelManager = ModelManager;
let modelManager;
const useModel = (connection) => {
    if (modelManager == undefined) {
        modelManager = new ModelManager(connection);
    }
    return modelManager;
};
exports.useModel = useModel;
