const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: 'dqhj1sukr', api_key: '648126929325225', api_secret: '9VXvdF5lmSNC7P9TQgp-7e4ICUw' });
// cloudinary.config({ cloud_name: "daofedrqe", api_key: "134718912625193", api_secret: "JmfVNL4RpE6UgHRBX8w2ozwM0Fs" });

const UploadCloudList = async (valueImage, folderStorage) => {
    try {
        const uploadPromises = valueImage.map(image =>
            cloudinary.uploader.upload(image, { folder: folderStorage }).catch(err => null)
        );

        const uploadResults = await Promise.all(uploadPromises);
        const uploadImageLists = uploadResults.filter(result => result !== null).map(item => item.secure_url);
        return uploadImageLists;
    } catch (error) {
        throw error
    }
};

export { UploadCloudList }