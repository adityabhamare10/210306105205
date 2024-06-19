const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;
const windowSize = 10;
const numbersCache = [];
const baseURL = 'http://20.244.56.144/test'; 

const clientID = 'ba6d14c2-e954-45f3-b7ea-dd83edc520cf';
const clientSecret = 'HQjxzorJMtzgwubQ';
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4Nzc2NDc1LCJpYXQiOjE3MTg3NzYxNzUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImJhNmQxNGMyLWU5NTQtNDVmMy1iN2VhLWRkODNlZGM1MjBjZiIsInN1YiI6IjIxMDMwNjEwNTIwNUBwYXJ1bHVuaXZlcnNpdHkuYWMuaW4ifSwiY29tcGFueU5hbWUiOiJQYXJ1bCBVbml2ZXJzaXR5IiwiY2xpZW50SUQiOiJiYTZkMTRjMi1lOTU0LTQ1ZjMtYjdlYS1kZDgzZWRjNTIwY2YiLCJjbGllbnRTZWNyZXQiOiJIUWp4em9ySk10emd3dWJRIiwib3duZXJOYW1lIjoiQWRpdHlhIEJoYW1hcmUiLCJvd25lckVtYWlsIjoiMjEwMzA2MTA1MjA1QHBhcnVsdW5pdmVyc2l0eS5hYy5pbiIsInJvbGxObyI6IjIxMDMwNjEwNTIwNSJ9.cR9MF49FteOyNKO-l-uBBtcc_HKRj_wIjHLaQWknD_0';

app.use(express.json());

const fetchNumbers = async (type) => {
  const apiMap = {
    'p': '/primes',
    'f': '/fibo',
    'e': '/even',
    'r': '/rand'
  };

  const url = `${baseURL}${apiMap[type]}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data.numbers;
  } catch (error) {
    console.error(`Error fetching ${type} numbers:`, error.message);
    return [];
  }
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

app.get('/numbers/:numberid', async (req, res) => {
  const numberId = req.params.numberid;
  const validIds = ['p', 'f', 'e', 'r'];

  if (!validIds.includes(numberId)) {
    return res.status(400).send('Invalid number ID');
  }

  try {
    const newNumbers = await fetchNumbers(numberId);
    const windowPrevState = [...numbersCache];

    newNumbers.forEach(num => {
      if (!numbersCache.includes(num)) {
        if (numbersCache.length < windowSize) {
          numbersCache.push(num);
        } else {
          numbersCache.shift();
          numbersCache.push(num);
        }
      }
    });

    const windowCurrState = [...numbersCache];
    const avg = calculateAverage(numbersCache);

    res.json({
      windowPrevState,
      windowCurrState,
      numbers: newNumbers,
      avg: avg.toFixed(2)
    });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
