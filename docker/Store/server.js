const express = require('express')
const app = express();
const fileUpload = require('express-fileupload');
const ipfsAPI = require('ipfs-api')
const ipfs = ipfsAPI({host: '0.0.0.0', port: '5001', protocol: 'http'})

let limit_in_bytes = 1024 * 100;

app.use(fileUpload({
    saveFileNames: true,
    preserveExtension: true
}));

app.post('/set', function (req, res) {
    // Check the file is under 100k
    if (!req.files) {
        return res.send({success: false, error: 'No files were selected to upload in field \'file\''});
    }
    if(req.files.file.data.length > limit_in_bytes) {
        return res.json({success: false, error: `The field 'file' cannot be more than ${limit_in_bytes / 1024}kb in size`});
    }
    
    ipfs.files.add([{
        path: req.files.file.name,
        content: req.files.file.data
    }], (err, resp) => {
        if(err) 
            return res.send({success: false, error: 'Unable to save file', err});
        pinHash(resp[0].hash);
        res.send({success: true, file: {
            path: resp[0].path,
            hash: resp[0].hash,
            size: resp[0].size
        }});
    })
    
})

app.get('/get/:hash', function (req, res) {
    var hash = req.params.hash;
    ipfs.files.get(hash, function (err, stream) {
        stream.on('data', (file) => {
            file.content.pipe(res);
        });
    });
});

const PORT = 9000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);