let isConfigUpdate = false;
let reader = new FileReader();

async function uploadToS3Bucket(stream, credential, cd) {
    try {
        if (!window.AWS) {
            return
        }
        if (!isConfigUpdate) {
            window.AWS.config.update(({ region: credential.region }));
            isConfigUpdate = true;
        }

        let s3 = new window.AWS.S3({
            credentials: new window.AWS.Credentials({
                apiVersion: 'latest',
                accessKeyId: credential.accressKeyId,
                secretAccessKey: credential.secretAccessKey,
                signatureVersion: credential.signatureVersion,
                region: credential.region,
                Bucket: credential.Bucket
            })
        });
        let uploadItem = await s3.upload({
            Bucket: credential.Bucket,
            Key: 'image',// name for the bucket file
            ContentType: document.getElementById("fileToUpload").files[0].type,
            Body: stream
        }).on("httpUploadProgress", function (progress) {
            console.log("progress=>", progress)
            cd(getUploadingProgress(progress.loaded, progress.total));
        }).promise();
        console.log("uploadItem=>", uploadItem)
        return uploadItem;
    }
    catch (error) {
        console.log(error)
    }

}

function getUploadingProgress(uploadSize, totalSize) {
    let uploadProgress = (uploadSize / totalSize) * 100;
    return Number(uploadProgress.toFixed(0));
}

async function uploadMedia() {
    let credentialRequest = {
        accressKeyId: 'AKIAUAPVIIGBWHOEJ7NB',
        secretAccessKey: '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',
        signatureVersion: 'v4',
        region: 'us-east-1',
        Bucket: 'image-upload-squardbucket'
    };
    let mediaStreamRequest = getFile(document.getElementById("fileToUpload").files[0]);
    const [mediaStream] = await Promise.all([
        mediaStreamRequest
    ])
    await uploadToS3Bucket(mediaStream, credentialRequest, (progress) => {
        console.log(progress)
    })
    alert("Image Successfully Uploaded, please check your email for results !");
    window.location.reload();

}

async function getFile(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.onerror = (err) => {
            reject(false);
        };
        reader.readAsArrayBuffer(file);
    });
};


