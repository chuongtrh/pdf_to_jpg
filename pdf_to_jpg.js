const path = require('path');
const fs = require('fs');
const PDFImage = require('pdf-image').PDFImage;

const inputFolder = "/input/";
const outputFolder = "/output/";


function runConvert() {

    fs.readdir(path.join(__dirname, inputFolder), function (err, files) {
        if (err) {
            console.log(err);
        } else {
            var tempFiles = files.filter(file => {
                return file.includes('.pdf');
            });

            var taskList = [];
            tempFiles.forEach(file => {
                var pdfImage = new PDFImage(path.join(__dirname, inputFolder, file), {
                    outputDirectory: path.join(__dirname, outputFolder),
                    graphicsMagick: true,
                    convertExtension: 'jpg',
                    convertOptions: {
                        "-background": "white"
                    }
                });
                pdfImage.numberOfPages()
                    .then(function (numberOfPages) {
                        //console.log('numberOfPages', numberOfPages);
                        for (var i = 0; i < numberOfPages; i++) {
                            taskList.push(new Promise((resolve, reject) => {
                                pdfImage.convertPage(i)
                                    .then(function (imagePath) {
                                        console.log(imagePath);
                                        resolve();
                                    })
                                    .catch(err => {
                                        reject(err);
                                    })

                            }));
                        }
                    });
            });

            Promise.all(taskList)
                .then(result => {
                    console.log('DONE!');
                })
                .catch(err => {
                    console.log(err);
                })
        }
    });
}

runConvert();