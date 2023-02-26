const { bucket_name, credentials, image_base_url } = require("../env_objects");
const { Storage } = require("@google-cloud/storage");
const stream = require("stream");

async function storeImage(req, res) {
  try {
    const { title, img_b64 } = req.body;
    const filename = `${title}.jpeg`;

    const storage = new Storage({ credentials });

    // * convert base64 text to a buffer stream
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(img_b64, "base64"));

    // * create the file object
    const file = storage.bucket(bucket_name).file(filename);

    // * stream the buffer inside the file object (aka upload)
    bufferStream
      .pipe(
        file.createWriteStream({
          metadata: {
            contentType: "image/jpeg",
            metadata: {
              custom: "metadata",
            },
          },
          validation: "md5",
        })
      )
      // * if something bad happened
      .on("error", (e) => {
        throw e;
      })
      // * success
      .on("finish", () =>
        res.send({ url: `${image_base_url}${bucket_name}/${filename}` })
      );
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

module.exports = { storeImage };
