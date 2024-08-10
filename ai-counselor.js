const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const readline = require('readline');

// Function to write to JSON
function writeJson(newData, filename = 'CoursePlan.json') {
    const coursePlan = JSON.parse(newData);
    fs.writeFileSync(filename, JSON.stringify(coursePlan, null, 4));
}

async function main() {
    const configuration = new Configuration({
        apiKey: "sk-proj-s7w3GUq3G6EiHZWM4oghT3BlbkFJgIksLxDpcdlAhIUw7Q3n"
    });
    const openai = new OpenAIApi(configuration);

    // Test series of classes
    // This list will eventually be derived from the ASSIST input
    // This is a test list using UC Berkley EECS to test.
    const classes = [
        "math 1a", "math 1c", "phys 4b", "math 1d", "math 1b", "math 2a", "math 1b", 
        "math 2b", "phys 4a", "phys 4c", "phys 4d", "engr 37", "cis 22a", "cis 22b", 
        "cis 22c", "math 22", "ewrt 1a", "ewrt 2"
    ];

    // Get input from the user using readline
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const communityCollege = await new Promise(resolve => {
        rl.question("Enter the community college you will be transferring from: ", resolve);
    });

    const desiredCollege = await new Promise(resolve => {
        rl.question("Enter your desired college: ", resolve);
    });

    const major = await new Promise(resolve => {
        rl.question("Enter the major you want to apply for: ", resolve);
    });

    rl.close();

    const promptTemplate = `
    Given a list of required classes, a community college, and a major delimited by \`\`\`, derive an 
    educational course plan for transferring as soon as possible. Verify that the courses are transferable, and 
    check to see if any are missing. If courses are missing, make sure to incorporate them. 

    Emphasize the verification of satisfying the pre-requisite class for each course. Make sure that each class 
    has met its pre-requisite class prior to the current term before adding it. For example, at De Anza College,
    PHYS 4A must be taken the term before PHYS 4B and MATH 1D must be before taking MATH 2A or 2B.

    Make sure to include specific general education courses as well that are not in the class lists, 
    but are transferable to the given school. Mention which area that the general education course falls under.
    Follow the IGETC for the school, however, take the major into account. Meaning that if the major at the specific school
    has a shorter agreement rather than IGETC, follow that instead, however, specify that is being done. An example of this
    is how the College of Engineering at UC Berkley does not accept IGETC as completetion of their breadth plan. Another example
    is how UCLA does not require IGETC to be completed for their College of Engineering.

    Aim for 4 classes per term, but include no more than two major courses per term while general education courses 
    are still available. If classes are difficult, then do 3 classes in that term (that class and two others).
    Make sure that the general education courses that are not included in the class list but are still 
    required to take are included as well. Optimize the schedule to transfer as fast as possible. 

    Formulate the output to be a JavaScript object that uses the term that classes will be taken in, such as 1st Year Fall, 
    1st Year Winter, etc. as the key, and the list of the specific classes that would be taken during that time as the value.
    If an exception is done, add it as a another object, with key "Exception" and the value a string that explains why the 
    exception was made. Otherwise, no need for the "Exception" key and value. 

    Start the output with an open bracket, and end the output with a closed bracket, as if it is a JavaScript object. Do not delimit 
    the output. Do not include anything else in the output because it will be used to form a JavaScript object, and that cannot be done 
    with excessive output. 

    Community College: '''${communityCollege}'''
    Desired College: '''${desiredCollege}'''
    Major: '''${major}'''
    List of Classes: '''${classes.join(", ")}''' 
    `;

    const response = await openai.createChatCompletion({
        model: "gpt-4o",
        messages: [{ role: "system", content: "You are an educational planner." }, 
                   { role: "user", content: promptTemplate }]
    });

    const coursePlanAsStr = response.data.choices[0].message.content;
    writeJson(coursePlanAsStr);
}

main().catch(console.error);