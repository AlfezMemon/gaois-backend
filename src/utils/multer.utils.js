import multer from 'multer';

let storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    }
});

let storag2 = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    }
});

let singleUpload = multer({ storage: storag2 })
let multipleUpload = multer({ storage: storage }).array('files');

export default {
    multipleUpload: multipleUpload,
    singleUpload: singleUpload
};