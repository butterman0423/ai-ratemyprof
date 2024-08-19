# Setup the Virtual Environment
In your terminal, enter this current directory: `rag-vdb`.
Then execute `python -m venv venv`.

**Ensure that python is installed on your system.**

## Regarding VSCode
If you have the Python Environment extension, create the virutal environment in the [Setup Virtual Environment Page](#setup-the-virtual-environment) then link the interpreter.
The environment's interpreter path is `./venv/Scripts/python.exe`. Lastly, create a new terminal and it should use the created virtual environment.

Otherwise, run your virtual environment using Powershell and executing the script inside `./venv/Scripts/activate`.

The following sections assume that your terminal is currently running/using the virtual environment.

# Install Dependencies
Dependency Stack
- python-dotenv 
- pinecone-client
- google-generativeai

Do `pip install python-dotenv pinecone-client google-generativeai`.

# Run setup.py
Run your virtual environment using Powershell and executing the script inside `./venv/Scripts/activate`.
Afterwards, type `python setup.py`. Once the process terminates, type `exit` to leave the virtual environment.

# References
https://medium.com/@billzhangsc/building-a-rag-powered-ai-assistant-the-rate-my-professor-project-19b8a999313a