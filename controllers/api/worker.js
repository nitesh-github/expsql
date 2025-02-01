const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { User } = require("../../models");

const { filePath, imageName } = workerData;

const processCsvFile = async () => {
  const results = [];

  try {
    // Wrap the CSV processing into a promise
    const fileProcessingPromise = new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath).pipe(csv());

      stream.on("data", (data) => {
        let newdata = { name: data.Name, email: data.Email };
        // Perform upsert operation
        User.upsert(newdata).catch(err => {
          console.error('Error performing upsert:', err);
        });
        results.push(data);
      });

      stream.on("end", () => {
        // Handle file deletion after the CSV is fully processed
        const oldImagePath = path.join(process.cwd(), 'public/uploads/', imageName);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error('Error deleting old file:', err);
            } else {
              console.log('Old file deleted successfully');
            }
          });
        }
        resolve(results); // Resolve after processing is complete
      });

      stream.on("error", (err) => {
        reject(new Error(`Error in CSV processing: ${err.message}`));
      });
    });

    const processedData = await fileProcessingPromise;

    // After processing is done, send back success message
    parentPort.postMessage({ status: 'success', data: processedData, testmsg: "testing" });

  } catch (error) {
    console.error('Error processing file:', error);
    parentPort.postMessage({ status: 'error', message: error.message });
  }
};
// const processCsvFile = async () => {
//   const results = [];

//   try {
//     const fileProcessingPromise = new Promise((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (data) => {
//         let newdata = { name: data.Name, email: data.Email };
//         // Perform upsert operation
//         User.upsert(newdata);
//         results.push(data)
//       })
//       .on("end", () => {
//         //const imageName = req.file?.filename;
//         const oldImagePath = path.join(process.cwd(), 'public/uploads/', imageName);
//         if (fs.existsSync(oldImagePath)) {
//           fs.unlink(oldImagePath, (err) => {
//             if (err) {
//               console.error('Error deleting old file:', err);
//             } else {
//               console.log('Old file deleted successfully');
//             }
//           });
//         }
//         resolve(results);
//       });

//     });

//     const processedData = await fileProcessingPromise;
//     // After processing is done, send back success message
//     parentPort.postMessage({ status: 'success', data: processedData, "testmsg":"testing" });


//   } catch (error) {
//     console.error('Error processing file:', error);
//     parentPort.postMessage({ status: 'error', message: error.message });
//   }
// };

// Call the function to start processing
processCsvFile();
