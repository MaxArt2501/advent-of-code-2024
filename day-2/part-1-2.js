const reports = input.split('\n').map(line => line.split(' ').map(Number));

const isSafe = report => {
  const diffs = report.slice(1).map((num, index) => num - report[index]);
  // Check if the signs of the differences are all the same
  const sameSign = new Set(diffs.map(diff => Math.sign(diff))).size === 1;
  // And also check if all the differences are within 3
  return sameSign && diffs.every(diff => Math.abs(diff) <= 3);
};

console.log(reports.filter(isSafe).length);

// If a report is not safe, then we try to remove a level and see if it becomes safe
const isReportSafe = report => isSafe(report) || report.some((_, index) => isSafe(report.toSpliced(index, 1)));

console.log(reports.filter(isReportSafe).length);
