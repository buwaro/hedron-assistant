global.__addondirHedronRoll = __addonsdir + "/" + "hedron-assistant"

const path = require('path');
const GoogleAssistant = require('google-assistant');

const config = {
  auth: {
    keyFilePath: __addondirHedronRoll + "/" + "api_key.json",
    // where you want the tokens to be saved
    // will create the directory if not already there
    savedTokensPath: __addondirHedronRoll + "/" + "tokens.json",
  },
  // this param is optional, but all options will be shown
  conversation: {
    audio: {
      encodingIn: 'LINEAR16', // supported are LINEAR16 / FLAC (defaults to LINEAR16)
      sampleRateIn: 16000, // supported rates are between 16000-24000 (defaults to 16000)
      encodingOut: 'LINEAR16', // supported are LINEAR16 / MP3 / OPUS_IN_OGG (defaults to LINEAR16)
      sampleRateOut: 24000, // supported are 16000 / 24000 (defaults to 24000)
    },
    lang: 'en-US', // language code for input/output (defaults to en-US)
    // deviceModelId: 'xxxxxxxx', // use if you've gone through the Device Registration process
    // deviceId: 'xxxxxx', // use if you've gone through the Device Registration process
    deviceLocation: {
      coordinates: { // set the latitude and longitude of the device (set to brussels)
        latitude: 50.85045,
        longitude: 4.34878,
      },
    },
    textQuery: 'What time is it?', // if this is set, audio input is ignored
    isNew: true, // set this to true if you want to force a new conversation and ignore the old state
  },
}

module.exports = (bot) => {
  console.log("loaded")
  bot.hears(/@hedron/i, (ctx) => {
    console.log("bot hears")

    // filter out the bot name
    const question = ctx.message.text.replace("@hedron", "")

    // The assistant doesn't work if it's not initialized inside the bot.hears callback
    const assistant = new GoogleAssistant(config.auth);
    assistant
      .on('ready', () => {
        console.log("telegramInput")
        // start the conversation
        config.conversation.textQuery = question;
        // assistant.start(config.conversation, startConversation);
        assistant.start(config.conversation);
      })
      .on("started", (conversation) => {
        console.log("started")
        conversation
          .on('response', (text) => {
            console.log("response")
            // do stuff with the text that the assistant said back
            ctx.reply(text)
          })
      })
      .on('error', (error) => {
        console.log('Assistant Error:', error)
      })
  })
}
