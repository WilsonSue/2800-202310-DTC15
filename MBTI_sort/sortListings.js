// Function to sort a list of job listings by percentage in descending order
function sortJobListingsByPercentage(jobListings) {
  jobListings.sort(function (a, b) {
    return b.percent - a.percent;
  });

  return jobListings;
}

// Main function that takes a list of jobs with associated MBTI types, and a personality type,
// then sorts them based on priority order for the given personality type
function sort_priority_order(jobs_with_mbti, personality) {
  const sorted_list = [];

  // Initialize an object to categorize jobs by MBTI type
  const mbti_types = {
    INFP: [],
    ESTJ: [],
    INTJ: [],
    ENFP: [],
    ISFP: [],
    ENTJ: [],
    ISTP: [],
    ENFJ: [],
    ESFP: [],
    ISTJ: [],
    INFJ: [],
    ESTP: [],
    ESFJ: [],
    ENTP: [],
    ISFJ: [],
    INTP: [],
  };

  // Define the priority order for each MBTI type
  const priority_order = {
    // Define priority order for each type...
    // Note: omitted for brevity
  };

  // Group jobs by their associated MBTI type
  for (const job of jobs_with_mbti) {
    mbti_types[job.mbti].push(job);
  }

  // Apply adjustments to job percentages based on MBTI type's position in priority order
  for (const mbti of Object.keys(mbti_types)) {
    var index = Object.keys(mbti_types).indexOf(mbti);
    for (const job of mbti_types[mbti]) {
      // Apply the desired percentage adjustments...
      // Note: omitted for brevity
    }
  }

  // Sort each group of jobs by percentage
  for (const mbti of Object.keys(mbti_types)) {
    mbti_types[mbti] = sortJobListingsByPercentage(mbti_types[mbti]);
  }

  // Compile the sorted list based on the priority order for the given personality type
  for (const mbti of priority_order[personality]) {
    sorted_list.push(...mbti_types[mbti]);
  }

  // Log the job title, MBTI type, and percentage for each job in the sorted list
  for (const job of sorted_list) {
    console.log(job.JobTitle, job.mbti, job.percent);
  }

  // Return the final sorted list
  return sorted_list;
}

// Export the main sorting function
module.exports = sort_priority_order;
