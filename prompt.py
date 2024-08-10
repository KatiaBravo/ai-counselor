from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
import json

# Function to write to json
def write_json(new_data, filename='CoursePlan.json'):
    with open(filename, 'w') as file:
        course_plan = json.loads(new_data)
        json.dump(course_plan, file, indent=4)

def main():
    chat = ChatOpenAI(model = "gpt-4o", temperature=0.4,  openai_api_key = "sk-proj-s7w3GUq3G6EiHZWM4oghT3BlbkFJgIksLxDpcdlAhIUw7Q3n")

    # Test series of classes
    # This list will eventually be derived from the ASSIST input
    # This is a test list using UC Berkley EECS to test.
    classes = ["math 1a", "math 1c", "phys 4b", "math 1d", "math 1b", "math 2a", "math 1b", 
        "math 2b", "phys 4a", "phys 4c", "phys 4d", "engr 37", "cis 22a", "cis 22b", "cis 22c", 
        "math 22", "ewrt 1a", "ewrt 2"]

    # This input will come from a chatbot once front-end gets implemented.
    communityCollege = input("Enter the community college you will be transferring from: ")
    desiredCollege = input("Enter your desired college: ")
    major = input("Enter the major you want to apply for: ")

    #Still need to work on importing PDFs
    #pdf = "DeAnzaIGETC.pdf"

    prompt_template = """
    Given a list of required classes, a community college, and a major delimited by ```, derive an 
    educational course plan for transferring as soon as possible. Verify that the courses are transferable, and 
    check to see if any are missing. If courses are missing, make sure to incorporate them. 

    Emphasize the verification of satisfying the pre-requisite classfor each course. Make sure that each class 
    has met its pre-requisite class prior to the current term before adding it. For example, at De Anza College,
    PHYS 4A must be taken the term before PHYS 4B and MATH 1D must be before taking MATH 2A or 2B.

    Make sure to include specific general education courses as well that are not be in the class lists, 
    but are transferable to the given school. Mention which area that the general education course falls under.
    Follow the IGETC for the school, however, take the major into account. Meaning that if the major at the specific school
    has a shorter agreement rather than IGETC, follow that instead, however, specify that is being done. An example of this
    is how the College of Engineering at UC Berkley does not accept IGETC as completetion of their breadth plan. Another example
    is how UCLA does not require IGETC to be completed for their College of Engineering.

    Aim for 4 classes per term, but include no more than two major courses per term while general education courses 
    are still available. If classes are difficult, then do 3 classes in that term (that class and two others).
    Make sure that the general education courses that are not included in the class list but are still 
    required to take are included as well. Optimize the schedule to transfer as fast as possible. 

    Formulate the output to be a python dictionary that uses the term that classes will be taken in, such as 1st Year Fall, 
    1st Year Winter, etc. as the key, and the list of the specific classes that would be taken during that time as the value.
    If an exception is done, add it as a another JSON object, with key "Exception" and the value a string that explains why the 
    exception was made. Otherwise, no need for the "Exception" key and value. 

    Start the output with an open bracket, and end the output with a closed bracket, as if it is a python dictionary. Do not delimite 
    the output.Do not include anything else in the output because it will be used to form a python dictionary, and that can not be done 
    with excessive output. 

    Community College: '''{communityCollege}'''
    Desired College: '''{desiredCollege}'''
    Major: '''{major}'''
    List of Classes: '''{classes}''' 
    """

    prompt = ChatPromptTemplate.from_template(template=prompt_template)
    messages = prompt.format_messages(communityCollege=communityCollege, 
                                desiredCollege=desiredCollege,
                                major = major,
                                classes = classes)
    response = chat.invoke(messages)
    course_plan_as_str = response.content

    write_json(course_plan_as_str)

if __name__ == "__main__":
    main()



