function sortJobListingsByPercentage(jobListings) {
  jobListings.sort(function(a, b) {
    return b.percent - a.percent;
  });

  return jobListings;
}

function sort_priority_order(jobs_with_mbti, personality) {
  const sorted_list = [];
  // Object to store job listings based on MBTI types
  const mbti_types = {
    "INFP": [], "ESTJ": [], "INTJ": [], "ENFP": [], "ISFP": [], "ENTJ": [], "ISTP": [], "ENFJ": [],
    "ESFP": [], "ISTJ": [], "INFJ": [], "ESTP": [], "ESFJ": [], "ENTP": [], "ISFJ": [], "INTP": []
  };

  // Object to define priority order of MBTI types
  const priority_order = {
    "INTJ": ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP",
             "ISFP", "ESTP", "ESFP"],
    "INTP": ["INTP", "INTJ", "ENTP", "ENTJ", "INFP", "INFJ", "ENFP", "ENFJ", "ISTP", "ISFP", "ESTP", "ESFP", "ISTJ",
             "ISFJ", "ESTJ", "ESFJ"],
    "ENTJ": ["ENTJ", "INTJ", "ENTP", "INTP", "ENFJ", "INFJ", "ESTJ", "ISTJ", "ESTP", "ISTP", "ESFJ", "ISFJ", "ESFP",
             "ISFP", "ENFP", "INFP"],
    "ENTP": ["ENTP", "INTP", "ENTJ", "INTJ", "ENFP", "INFP", "ENFJ", "INFJ", "ESTP", "ISTP", "ESTJ", "ISTJ", "ESFP",
             "ISFP", "ESFJ", "ISFJ"],
    "INFJ": ["INFJ", "INTJ", "INFP", "INTP", "ENFJ", "ENTJ", "ENFP", "ENTP", "ISFJ", "ISTJ", "ESFJ", "ESTJ", "ISFP",
             "ISTP", "ESFP", "ESTP"],
    "INFP": ["INFP", "INFJ", "INTP", "INTJ", "ENFP", "ENFJ", "ENTP", "ENTJ", "ISFP", "ISFJ", "ISTP", "ISTJ", "ESFP",
             "ESFJ", "ESTP", "ESTJ"],
    "ENFJ": ["ENFJ", "INFJ", "ENFP", "INFP", "ENTJ", "INTJ", "ENTP", "INTP", "ESFJ", "ISFJ", "ESFP", "ISFP", "ESTJ",
             "ISTJ", "ESTP", "ISTP"],
    "ENFP": ["ENFP", "INFP", "ENFJ", "INFJ", "ENTP", "INTP", "ENTJ", "INTJ", "ESFP", "ISFP", "ESFJ", "ISFJ", "ESTP",
             "ISTP", "ESTJ", "ISTJ"],
    "ISTJ": ["ISTJ", "ESTJ", "ISFJ", "ESFJ", "ISTP", "ESTP", "ISFP", "ESFP", "INTJ", "ENTJ", "INFJ", "ENFJ", "INTP",
             "ENTP", "INFP", "ENFP"],
    "ISFJ": ["ISFJ", "ESFJ", "ISTJ", "ESTJ", "ISFP", "ESFP", "ISTP", "ESTP", "INFJ", "ENFJ", "INFP", "ENFP", "INTP",
             "ENTP", "INTJ", "ENTJ"],
    "ESTJ": ["ESTJ", "ISTJ", "ENTJ", "INTJ", "ESTP", "ISTP", "ENFJ", "INFJ", "ESFJ", "ISFJ", "ENTP", "INTP", "ENFP",
             "INFP", "ESFP", "ISFP"],
    "ESFJ": ["ESFJ", "ISFJ", "ESTJ", "ISTJ", "ESFP", "ISFP", "ESTP", "ISTP", "ENFJ", "INFJ", "ENFP", "INFP", "ENTJ",
             "INTJ", "ENTP", "INTP"],
    "ISTP": ["ISTP", "ESTP", "INTP", "ENTP", "ISTJ", "ESTJ", "ISFP", "ESFP", "INTJ", "ENTJ", "INFJ", "ENFJ", "INFP",
             "ENFP", "ISFJ", "ESFJ"],
    "ISFP": ["ISFP", "ESFP", "INFP", "ENFP", "ISFJ", "ESFJ", "ISTP", "ESTP", "INFJ", "ENFJ", "INTJ", "ENTJ", "ISTJ",
             "ESTJ", "INTP", "ENTP"],
    "ESTP": ["ESTP", "ISTP", "ESFP", "ISFP", "ESTJ", "ISTJ", "ENTP", "INTP", "ENFP", "INFP", "ENTJ", "INTJ", "ESFJ",
             "ISFJ", "ENFJ", "INFJ"],
    "ESFP": ["ESFP", "ISFP", "ENFP", "INFP", "ESTP", "ISTP", "ESFJ", "ISFJ", "ESTJ", "ISTJ", "ENFJ", "INFJ", "ENTP",
             "INTP", "ENTJ", "INTJ"]
  };

  // Group job listings based on MBTI type
  for (const job of jobs_with_mbti) {
    mbti_types[job.mbti].push(job);
  }

  // Adjust job percentage based on the index of MBTI type
  for (const mbti of Object.keys(mbti_types)) {
    var index = Object.keys(mbti_types).indexOf(mbti);
    for (const job of mbti_types[mbti]) {
      if (index >= 1 && index <= 3) {
        job.percent = (job.percent - 5).toFixed(2);
      }
      if (index >= 4 && index <= 7) {
        job.percent = (job.percent - 10).toFixed(2);
      }
      if (index >= 8 && index <= 11) {
        job.percent = (job.percent - 20).toFixed(2);
      }
      if (index >= 12 && index <= 15) {
        job.percent = (job.percent - 30).toFixed(2);
      }
    }
  }

  // Sort job listings by percentage for each MBTI type
  for (const mbti of Object.keys(mbti_types)) {
    mbti_types[mbti] = sortJobListingsByPercentage(mbti_types[mbti]);
  }

  // Create a sorted list based on priority order of MBTI types
  for (const mbti of priority_order[personality]) {
    sorted_list.push(...mbti_types[mbti]);
  }

  // Log the sorted job listings to the console
  for (const job of sorted_list) {
    console.log(job.JobTitle, job.mbti, job.percent);
  }

  return sorted_list;
}

module.exports = sort_priority_order;