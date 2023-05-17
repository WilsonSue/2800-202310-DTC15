const { spawn } = require('child_process');

const pythonScriptPath = './PersonalitySort.py'; // Update this if necessary

async function runPythonScript(jobDescription) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [pythonScriptPath, jobDescription], { stdio: 'pipe' });

    let output = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(`Python script process exited with code ${code}`);
      }
    });
  });
}

async function updateMBTI(collection, jobDescription, document) {
  try {
    const scriptResults = await runPythonScript(jobDescription);
    const mbti = scriptResults; // Get the MBTI value from Python script output
    // Update the document with the new field
    console.log('Updating document with MBTI:', mbti);
    await collection.updateOne(
      { _id: document._id },
      { $set: { mbti: mbti } }
    );
    console.log('Document updated successfully');
  } catch (err) {
    console.error('Error updating document:', err);
  }
}

async function updateDocumentsWithMbti(collection) {
  const documents = await collection.find({}).toArray();

  // Iterate over each document in the collection
  for (const document of documents) {
    // Prepare input for Python script
    const jobDescription = document.JobDescription;
    // Execute Python script
    await updateMBTI(collection, jobDescription, document);
  }

  console.log('All documents updated.');
}

module.exports = { updateDocumentsWithMbti };