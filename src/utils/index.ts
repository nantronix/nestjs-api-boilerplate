//export * from './password';
export * from './uuid';
//export * from './cache';
//export * from './redis.cache';
export * from './message-crypto';

const sdk = require('microsoft-cognitiveservices-speech-sdk');
//const { Buffer } = require('buffer');
const { PassThrough } = require('stream');
const fs = require('fs');
/**
 * 指定长度随机字符串
 * 
 * @param length 
 * @returns 
 */
export function createNonceStr (length = 16): string {
  length = length > 32 ? 32 : length;
  let str = '';
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

/**
 * 从error message中截取rid
 * @param errMsg 
 * @returns 
 */
export function parseRid (errMsg: string): string {
  if (typeof errMsg !== 'string') {
    return '';
  }
  const index = errMsg.indexOf('rid:');
  if (index >= 0) {
    return errMsg.substring(index + 5);
  } else {
    return '';
  }
}

export const textToSpeech = async (key, region, text, filename,voice_name)=> {

    // convert callback function to promise
    return new Promise((resolve, reject) => {
        
        const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
        speechConfig.speechSynthesisOutputFormat = 5; // mp3
         speechConfig.speechSynthesisVoiceName = voice_name; 
        
        let audioConfig = null;
        
        if (filename) {
            audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
        }
        
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

        synthesizer.speakTextAsync(
            text,
            result => {
                
                const { audioData } = result;

                synthesizer.close();
                
                if (filename) {
                    
                    // return stream from file
                    const audioFile = fs.createReadStream(filename);
                    resolve(audioFile);
                    
                } else {
                    
                    // return stream from memory
                    const bufferStream = new PassThrough();
                    bufferStream.end(Buffer.from(audioData));
                    resolve(bufferStream);
                }
            },
            error => {
                synthesizer.close();
                reject(error);
            }); 
    });
};
