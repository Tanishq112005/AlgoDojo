const axios = require('axios');
axios.post('https://wandbox.org/api/compile.json', {
  code: '#include <iostream>\n#include <string>\nint main() { std::string s; std::cin >> s; std::cout << "hello " << s << "\\n"; return 0; }',
  compiler: 'gcc-head',
  stdin: 'world'
}).then(res => console.log(res.data)).catch(err => console.error(err.response?.data || err.message));
