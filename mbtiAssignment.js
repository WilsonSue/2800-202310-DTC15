const { PythonShell } = require('python-shell');
const pythonScriptPath = './PersonalitySort.py'; // Update this if necessary

function updateDocumentsWithMbti(collection) {
  collection.find({}).toArray((err, documents) => {
    if (err) {
      console.error('Error retrieving documents from MongoDB:', err);
      return;
    }

    // Iterate over each document
    documents.forEach((document) => {
      // Prepare input for Python script
      const jobDescription = document.JobDescription;
      const options = {
        mode: 'text',
        pythonPath: 'python3', // Update this if necessary
        pythonOptions: ['-u'], // Enable unbuffered output for Python shell
        scriptPath: pythonScriptPath,
        args: [jobDescription],
      };

      // Execute Python script
      PythonShell.run('PersonalitySort.py', options, (err, results) => {
        if (err) {
          console.error('Error executing Python script:', err);
          return;
        }

        const mbti = results[0]; // Get the MBTI value from Python script output
        // Update the document with the new field
        collection.updateOne(
          { _id: document._id },
          { $set: { mbti: mbti } },
          (err) => {
            if (err) {
              console.error('Error updating document:', err);
            } else {
              console.log('Document updated successfully');
            }
          }
        );
      });
    });
  });
}

module.exports = { updateDocumentsWithMbti };