const readline = require('readline');

class Job {
    constructor(start, end, profit) {
        this.start = start;
        this.end = end;
        this.profit = profit;
    }
}

function getMaxProfit(jobs) {
    // Sort the jobs based on their end times in ascending order
  jobs.sort((a, b) => a.endTime - b.endTime);

  // Get the total number of jobs
  const n = jobs.length;

  // Initialize arrays to store dynamic programming values and previous job indices
  const dp = new Array(n).fill(0);
  const prevJob = new Array(n).fill(-1);

  // Perform dynamic programming to calculate the maximum profit for each job
  for (let i = 0; i < n; i++) {
    for (let j = i - 1; j >= 0; j--) {
      // Check if the current job overlaps with the previous job
      if (jobs[j].endTime <= jobs[i].startTime) {
        // Update the dynamic programming value and record the previous job index
        dp[i] = Math.max(dp[i], dp[j]);
        prevJob[i] = j;
        break;
      }
    }
    // Add the profit of the current job to the dynamic programming value
    dp[i] += jobs[i].profit;
  }

  // Find the index of the job with the maximum profit
  const maxProfit = Math.max(...dp);
  const maxProfitIndex = dp.indexOf(maxProfit);

  // Initialize an array to store the indices of selected jobs
  const selectedJobs = [];
  let currentIndex = maxProfitIndex;

  // Reconstruct the selected jobs by tracing back from the job with the maximum profit
  while (currentIndex !== -1) {
    selectedJobs.push(currentIndex);
    currentIndex = prevJob[currentIndex];
  }

  // Calculate the total profit of unselected jobs
  const totalUnselectedProfit = jobs.reduce((total, job, index) => {
    if (!selectedJobs.includes(index)) {
      return total + job.profit;
    }
    return total;
  }, 0);
  const numUnselectedJobs = n - selectedJobs.length;
  return [numUnselectedJobs, totalUnselectedProfit];

}

function questionAsync(rl, query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

async function processInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const n = await questionAsync(rl, 'Enter the number of Jobs: ');

    const jobs = [];
    

    for (let i = 0; i < n; i++) {
        const start = await questionAsync(rl, `Enter job ${i + 1} start time: `);
        const end = await questionAsync(rl, 'Enter end time: ');
        const profit = await questionAsync(rl, 'Enter earnings: ');

        jobs.push(new Job(parseInt(start), parseInt(end), parseInt(profit)));
    }

    rl.close();

    const result = getMaxProfit(jobs);
    console.log(`The number of tasks and earnings available for others:`);
    console.log(`Task: ${result[0]}`);
    console.log(`Earnings: ${result[1]}`);
}
processInput();

