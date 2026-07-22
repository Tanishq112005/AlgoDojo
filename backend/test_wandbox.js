const axios = require('axios');
axios.post('https://wandbox.org/api/compile.json', {
  code: '#include <iostream>\nint main() { std::cout << "hello\\n"; return 0; }',
  compiler: 'gcc-head'
}).then(res => console.log(res.data)).catch(err => console.error(err.response?.data || err.message));
