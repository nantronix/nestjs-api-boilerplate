const https = require('https');

const fs = require('fs');

  

const API_ENDPOINT = 'https://api.exh.ai/animations/v1/generate_lipsync';


const API_KEY = "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImppYW5iby56aHVAZ21haWwuY29tIn0.G6hHLkjujg73eilOFXLigQIwMnyTH0lzrT7O2mi-1SQJBYP3u7yFj2F7EauuTYF7jl29mRXw_mKjYOCmYDHr3Q";

  

const headers = {

  'Authorization':`Bearer ${API_KEY}`,

};

  

const body = {

     "bot_response": "欢迎汉卿大哥,和珅是我朝廷的一位重要官员,他非常聪明能干,在政治和经济方面都有很高的造诣,我非常欣赏他的才能和能力,因此一直重用他,并让他担任过多个重要职务,我们之间的关系也非常密切,可以说是一种深厚的师徒之情。然而,后来和珅却因为自己的贪婪和腐败行为,而受到了朝廷的弹劾和谴责,我也开始对他失去了信任和支持",   
  "azure_voice": "zh-CN-YunzeNeural",
  'animation_pipeline': 'high_speed',

  'idle_url': 'https://ugc-idle.s3-us-west-2.amazonaws.com/6109fb547e62061dbb9ec7c15c314fa1.mp4'

};

  

const req = https.request(API_ENDPOINT, {

  method: 'POST',

  headers,

  body: JSON.stringify(body),

}, (res) => {

  const file = fs.createWriteStream('./lipsync_video.mp4');

  res.pipe(file);

});
