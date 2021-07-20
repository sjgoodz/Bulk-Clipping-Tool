//NodeJS Auto Bulk Clipping Tool
//Install request and fs
const request = require('request');
const fs = require('fs');
const imageNames = fs.readdirSync("./images/"); //read the file names of the directory given


//foreach function that goes through every filename and runs the script
  imageNames.forEach((file) => {
    const imgName = "./images/" + file;
    console.log("'" + imgName + "'");
    request.post({
      url: 'https://clippingmagic.com/api/v1/images',
      formData: {
        image: fs.createReadStream(imgName), //fs.createdReadStream(filename goes here)
        format: 'result',
        test: 'false', //watermark
      },
      auth: {
        user: 'username goes here',
        pass: 'password goes here'
      }, //Username and password
      followAllRedirects: true,
      encoding: null
    }, function (error, response, body) { //catch errors
      if (error) {
        console.error('Request failed:', error);
      } else if (!response || response.statusCode != 200) {
        console.error('Error:', response && response.statusCode, body.toString('utf8'));
      } else {
        // Store these if you want to be able to use the Smart Editor
        let imageId = response.caseless.get('x-amz-meta-id');
        let imageSecret = response.caseless.get('x-amz-meta-secret');

        // Save result
        fs.writeFileSync(`clipped-${file}`, body);
      }
    })
  })