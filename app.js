"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const restify = require("restify");
// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});
// Create adapter
const adapter = new botbuilder_1.BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// Add state middleware
const storage = new botbuilder_1.MemoryStorage();
const convoState = new botbuilder_1.ConversationState(storage);
const userState = new botbuilder_1.UserState(storage);
// Add conversation state middleware
const conversationState = new botbuilder_1.ConversationState(new botbuilder_1.MemoryStorage());
adapter.use(conversationState);
const foo = (n) => {
    console.log(n);
};
// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        const state = conversationState.get(context);
        if (context.activity.type === 'conversationUpdate' && context.activity.membersAdded[0].name !== 'Bot') {
            return context.sendActivity('Welcome to the number guessing game! Guess a number from 1-20.');
        }
        if (context.activity.type === 'message') {
            const randNum = state.randNum === undefined ? state.randNum = Math.floor(Math.random() * 20 + 1) : state.randNum = state.randNum;
            const count = state.count === undefined ? state.count = 1 : ++state.count;
            if (parseInt(context.activity.text) < randNum) {
                yield context.sendActivity(`the number is higher`);
            }
            else if (parseInt(context.activity.text) > randNum) {
                yield context.sendActivity(`the number is lower`);
            }
            else {
                yield context.sendActivity(`You are correct!`);
                yield context.sendActivity(`You found the right answer in ${count} tries!`);
                yield context.sendActivity('Welcome to the number guessing game! Guess a number from 1-20.');
                state.randNum = Math.floor(Math.random() * 20 + 1);
                state.count = 0;
            }
        }
    }));
});
