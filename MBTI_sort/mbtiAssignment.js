const { spawn } = require('child_process');

const pythonScriptPath = './MBTI_sort/PersonalityAssign.py'; // Update this if necessary

async function runPythonScript(jobDescription) {
  return new Promise((resolve, reject) => {
    // Spawn a child process running the Python script
    const pythonProcess = spawn('python3', [pythonScriptPath, jobDescription], { stdio: 'pipe' });

    // Collect data from script output
    let output = '';

    // Collect data from script output
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Reject promise if script writes to stderr
    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });

    // Resolve promise when script exits
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
    const mbti = scriptResults.substring(0, 4); // Get the MBTI value from Python script output
    const percent = parseFloat(scriptResults.substring(4));// Get the percent value from Python script output

    // Update the document with the new field
    console.log('Updating document with MBTI:', mbti);
    await collection.updateOne(
      { _id: document._id },
      { $set: { 
        mbti: mbti,
        percent: percent 
      } }
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