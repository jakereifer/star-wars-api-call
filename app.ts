import { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState, BotState } from 'botbuilder';
import * as restify from 'restify';
import { STATUS_CODES } from 'http';

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

// Add state middleware
const storage = new MemoryStorage();
const convoState = new ConversationState(storage);
const userState = new UserState(storage);

// Define conversation state shape
interface GameState {
    count: number;
    randNum: number;
    playAgain: boolean;
}

// Add conversation state middleware
const conversationState = new ConversationState<GameState>(new MemoryStorage());
adapter.use(conversationState);

const foo = (n:number) => {
    console.log(n);
}

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, async (context) => {
        const state = conversationState.get(context);
        if (context.activity.type === 'conversationUpdate' && context.activity.membersAdded[0].name !== 'Bot') {
            return context.sendActivity('Welcome to the number guessing game! Guess a number from 1-20.');
        }
        if (context.activity.type === 'message') {
            const randNum = state.randNum === undefined ? state.randNum = Math.floor(Math.random()*20+1) : state.randNum = state.randNum;
            const count = state.count === undefined ? state.count = 1 : ++state.count;
            if (parseInt(context.activity.text) < randNum) {
                await context.sendActivity(`the number is higher`);
            }
            else if (parseInt(context.activity.text) > randNum) {
                await context.sendActivity(`the number is lower`);
            }
            else {
                await context.sendActivity(`You are correct!`);
                await context.sendActivity(`You found the right answer in ${count} tries!`);
                await context.sendActivity('Welcome to the number guessing game! Guess a number from 1-20.');
                state.randNum = Math.floor(Math.random()*20+1);
                state.count = 0;
            }
        }
    });
});