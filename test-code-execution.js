// Test script for code execution with Judge0 CE API
// Replace 'your-rapidapi-key-here' with your actual API key

const axios = require('axios');

const JUDGE0_API_KEY = 'your-rapidapi-key-here'; // Replace with your actual key
const JUDGE0_BASE_URL = 'https://judge0-ce.p.rapidapi.com';

async function testCodeExecution() {
  try {
    console.log('Testing code execution...');
    
    const code = `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // Should output [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Should output [1, 2]
console.log(twoSum([3, 3], 6)); // Should output [0, 1]`;

    // Submit code for compilation
    const submitResponse = await axios.post(`${JUDGE0_BASE_URL}/submissions`, {
      source_code: code,
      language_id: 63, // JavaScript (Node.js)
      stdin: '',
      expected_output: '',
      cpu_time_limit: 5,
      memory_limit: 512000,
      enable_network: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    });

    const submissionToken = submitResponse.data.token;
    console.log('Submission token:', submissionToken);

    // Poll for results
    let result;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

      const statusResponse = await axios.get(`${JUDGE0_BASE_URL}/submissions/${submissionToken}`, {
        headers: {
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });

      result = statusResponse.data;
      
      if (result.status.id > 2) { // Status > 2 means processing is complete
        break;
      }
      
      attempts++;
      console.log(`Attempt ${attempts}: Status ${result.status.id}`);
    }

    // Process the result
    const statusMessages = {
      1: 'In Queue',
      2: 'Processing',
      3: 'Accepted',
      4: 'Wrong Answer',
      5: 'Time Limit Exceeded',
      6: 'Compilation Error',
      7: 'Runtime Error (SIGSEGV)',
      8: 'Runtime Error (SIGXFSZ)',
      9: 'Runtime Error (SIGFPE)',
      10: 'Runtime Error (SIGABRT)',
      11: 'Runtime Error (NZEC)',
      12: 'Runtime Error (Other)',
      13: 'Internal Error',
      14: 'Exec Format Error'
    };

    console.log('\n=== Code Execution Result ===');
    console.log('Status:', statusMessages[result.status.id] || 'Unknown Status');
    console.log('Success:', result.status.id === 3);
    console.log('Time:', result.time || 0, 'ms');
    console.log('Memory:', result.memory || 0, 'KB');
    
    if (result.stdout) {
      console.log('\nOutput:');
      console.log(result.stdout);
    }
    
    if (result.stderr) {
      console.log('\nError:');
      console.log(result.stderr);
    }
    
    if (result.compile_output) {
      console.log('\nCompilation Output:');
      console.log(result.compile_output);
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testCodeExecution(); 