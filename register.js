const axios = require('axios');

const registerCompany = async () => {
  try {
    const response = await axios.post('http://20.244.56.144/test/register', {
      companyName: 'Parul University',
      ownerName: 'Aditya Bhamare',
      rollNo: '210306105205',
      ownerEmail: '210306105205@paruluniversity.ac.in',
      accessCode: 'QeYQhl'
    });

    console.log('Registration Successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration Failed:', error.response ? error.response.data : error.message);
  }
};

registerCompany();
