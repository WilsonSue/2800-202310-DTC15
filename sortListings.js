const { spawn } = require('child_process');

const pythonScriptPath = './PersonalitySort.py'; // Update this if necessary

async function runPythonScript(jobs_with_mbti, personality) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [pythonScriptPath, jobs_with_mbti, personality], { stdio: 'pipe' });

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

async function sortListings(jobs_with_mbti, personality) {
  const result = await runPythonScript(jobs_with_mbti, personality);
  const sortedListings = JSON.parse(result);
  return sortedListings;
}

module.exports = { sortListings };