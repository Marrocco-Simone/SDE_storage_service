const { bucket_name, credentials, image_base_url } = require("../env_objects");
const { Storage } = require("@google-cloud/storage");

async function getImagesUrls(req, res) {
  try {
    // * Creates a client
    const storage = new Storage({ credentials });

    // * Lists files in the bucket
    const [files] = await storage.bucket(bucket_name).getFiles();

    const urls = {
      urls: files.map((file) => `${image_base_url}${bucket_name}/${file.name}`),
    };

    res.send(urls);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

module.exports = { getImagesUrls };
