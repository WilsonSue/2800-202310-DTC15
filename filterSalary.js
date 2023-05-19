function filterBySalary(jobListings, minSalary, maxSalary) {
  return jobListings.filter(function(jobListing) {
    const minsalaryint = parseInt(jobListing.SalaryEstimate.substring(0, 8).replace(/[^0-9]/g, ''));
    const maxsalaryint = parseInt(jobListing.SalaryEstimate.substring(8).replace(/[^0-9]/g, ''));
    const salaryavg = minsalaryint + maxsalaryint / 2;
    return salaryavg >= minSalary && salaryavg <= maxSalary;
  });
}

module.exports = { filterBySalary };