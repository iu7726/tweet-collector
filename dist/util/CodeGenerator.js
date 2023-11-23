"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeGenerator = exports.codeTimestampGenerator = void 0;
const codeTimestampGenerator = () => {
    const uuid = 'xxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
        return v.toString(16);
    });
    return `${Date.now().toString()}_${uuid}`;
};
exports.codeTimestampGenerator = codeTimestampGenerator;
const codeGenerator = () => {
    const uuid = 'xxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
        return v.toString(16);
    });
    return uuid;
};
exports.codeGenerator = codeGenerator;
