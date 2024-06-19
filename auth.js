const axios = require('axios');

const authenticate = async (clientID, clientSecret) => {
  try {
    const response = await axios.post('http://20.244.56.144/test/auth', {
      companyName: 'Parul University',
      clientID,
      clientSecret,
      ownerName: 'Aditya Bhamare',
      ownerEmail: '210306105205@paruluniversity.ac.in',
      rollNo: '210306105205'
    });

    console.log('Authentication Successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Authentication Failed:', error.response ? error.response.data : error.message);
  }
};

// Replace with your actual clientID and clientSecret obtained from the registration step
const clientID = 'ba6d14c2-e954-45f3-b7ea-dd83edc520cf';
const clientSecret = 'HQjxzorJMtzgwubQ';

authenticate(clientID, clientSecret);
