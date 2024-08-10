//import OpenAI from "openai";

//THIS IS CURRENTLY NOT WORKING
//ONCE I GET IT WORKING IN PYTHON I WILL CONVERT IT JS
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "sk-proj-s7w3GUq3G6EiHZWM4oghT3BlbkFJgIksLxDpcdlAhIUw7Q3n",
});
const openai = new OpenAIApi(configuration);

async function getCompletion(prompt, model = "gpt-4o", temperature = 0) {
  const messages = [{ role: "user", content: prompt }];
  const response = await openai.createChatCompletion({
    model: model,
    messages: messages,
    temperature: temperature,
  });
  return response.data.choices[0].message.content;
}

const classes = [
  "math 1a", "math 1c", "phys 4b", "math 1d", "math 1b", "math 2a", "math 1b", 
  "math 2b", "phys 4a", "phys 4c", "phys 4d", "engr 37", "cis 22a", "cis 22b", "cis 22c", 
  "math 22", "ewrt 1a", "ewrt 2"
];

const communityCollege = "De Anza College";
const desiredCollege = "UC Berkley";
const major = "Electrical Engineering and Computer Science";

const prompt = `
  Given a list of required classes, a community college, and a major delimited by ''', derive an 
  educational course plan for transferring as soon as possible. Include general education courses
  as well that may not be in the class lists, but are transferable to the given school.

  Make sure that each class has met its pre-requisite class before adding it.

  Try to include no more than two major courses per quarter/semester (depending on the school)
  while general education courses are still available. 
  
  Community College: ''' ${communityCollege} '''
  Desired College: ''' ${desiredCollege} '''
  Major: '''${major}'''
  List of Classes: '''${classes}''' 
`;

getCompletion(prompt).then(response => {
  console.log(response);
}).catch(err => {
  console.error(err);
});