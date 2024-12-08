
  // Stop words to filter out
  const stopWords = [
    "define", "is", "what", "for", "if", "differentiate", "between", "find", "its", "about", "information",
    "little", "please", "which", "when", "to", "are", "the", "we", "so", "a", "hence", "why", "?", "pairs",
    "how", "be", "tell", "me", "can", "never", "would", "who", "than", "calculate", "evaluate", "divide",
    "multiply", "cut", "add", "addition", "subtract", "of", "it's", "it", "meaning", "definition", "give",
    "many", "could", "explain", "something", "some", "about", "i", "have", "one", "two", "three", "four",
    "five", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "had", "and", "hard", "bro", "result", "answer",
    "big", "small", "very", "no", "yes", "ask", "full-form", "full", "form", "there", "detail", "details", "an", "where"
  ];

  // Predefined commands
  const commands = [
    { "command": "hello", "response": "Hello! How can I assist you today?" },
    { "command": "how are you", "response": "I'm doing great! Thanks for asking." },
    { "command": "what is tarch ai", "response": "Tarch AI is your intelligent assistant designed to simplify tasks and enhance productivity." },
    { "command": "tell me a joke", "response": "Why don't skeletons fight each other? They don't have the guts!" },
    { "command": "who created you", "response": "I was created by a team of developers working on Tarch AI." },
    { "command": "help", "response": "You can ask me about a variety of topics. Try asking 'what is Tarch AI' or 'tell me a joke'." },
    { "command": "time", "response": "The current time is " + new Date().toLocaleTimeString() },
    { "command": "date", "response": "Today's date is " + new Date().toLocaleDateString() }
  ];

  // Image folder and files
  const imageFolder = 'images/';
  const images = [
    'cat.jpg', 'burger.jpg', 'dog.jpg', 'flower.jpg', 'car.jpg', 'fries.jpg',
    'hot_dog.jpg', 'human.jpg', 'chicken.jpg', 'manchurian.jpg', 'rice.jpg',
    'sandwich.jpg', 'lion.jpg', 'noodles.jpg'
  ];

  // Function to toggle theme
  function toggleTheme() {
    const body = document.body;
    const toggleCircle = document.querySelector(".toggle-circle");
    body.classList.toggle("light-theme");
    body.classList.toggle("dark-theme");
    const currentTheme = body.classList.contains("light-theme") ? "Light" : "Dark";
    document.querySelector(".sidebar .setting:nth-child(2)").textContent = "Theme: " + currentTheme;
    toggleCircle.style.transform = body.classList.contains("light-theme") ? "translateX(25px)" : "translateX(0)";
  }

  // Function to send a message
  function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim().toLowerCase();
    if (userInput) {
      addMessage(userInput, "user");
      processCommand(userInput);
      document.getElementById("user-input").value = "";
    }
  }

  // Function to add a message to the chat window
  function addMessage(message, sender) {
    const messageContainer = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "ai-message");
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  // Function to preprocess user queries
  function preprocessQuery(query) {
    return query
      .split(" ")
      .filter(word => !stopWords.includes(word))
      .join(" ");
  }

  // Function to check if the input is a math expression
  function isMathExpression(input) {
    return /^[\d+\-*/().\s]+$/.test(input);
  }

  // Function to evaluate math expressions
  function evaluateMathExpression(expression) {
    try {
      const result = eval(expression);
      addMessage(The answer is ${result}, "ai");
    } catch (error) {
      addMessage("Error evaluating the math expression.", "ai");
    }
  }

  // Function to process commands
  function processCommand(command) {
    const preprocessedCommand = preprocessQuery(command);

    // Check if it's a math expression
    if (isMathExpression(preprocessedCommand)) {
      evaluateMathExpression(preprocessedCommand);
      return;
    }

    // Check for image generation command
    if (preprocessedCommand.includes("generate")) {
      const keywords = preprocessedCommand.split(" ").filter(word => word !== "generate");
      generateImage(keywords);
      return;
    }

    // Check predefined commands
    const cmd = commands.find(c => c.command === preprocessedCommand);
    if (cmd) {
      addMessage(cmd.response, "ai");
    } else {
      fetchFromAPIs(preprocessedCommand || command); // Use original query if all words are filtered
    }
  }

  // Function to generate an image based on keywords
  function generateImage(keywords) {
    const foundImage = images.find(image => 
      keywords.some(keyword => image.includes(keyword))
    );

    if (foundImage) {
      addMessage('Here is the generated image:', "ai");
      const imgElement = document.createElement("img");
      imgElement.src = ${imageFolder}${foundImage};
      imgElement.alt = "Generated Image";
      imgElement.style.width = "450px";
      imgElement.style.height = "450px";
      imgElement.style.margin = "10px auto";
      imgElement.style.border = "2px solid #ddd";
      imgElement.style.borderRadius = "10px";
      imgElement.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      imgElement.style.display = "block";
      document.getElementById("chat-messages").appendChild(imgElement);
    } else {
      addMessage("No matching image found.", "ai");
    }
  }

  // Function to fetch information from APIs
  async function fetchFromAPIs(query) {
    try {
      const fullResponse = await Promise.all([fetchDuckDuckGo(query), fetchWikipedia(query)]);
      const combinedResponse = fullResponse.filter(Boolean).join(" ");

      if (combinedResponse) {
        addMessage(combinedResponse, "ai");
      } else {
        await fetchWordByWord(query);
      }
    } catch (error) {
      addMessage("Error fetching information from APIs.", "ai");
    }
  }

  // Function to fetch information word by word
  async function fetchWordByWord(query) {
    const words = query.split(" ");
    let finalResponse = "";

    for (const word of words) {
      const wordResponses = await Promise.all([fetchDuckDuckGo(word), fetchWikipedia(word)]);
      const combinedWordResponse = wordResponses.filter(Boolean).join(" ");
      if (combinedWordResponse) {
        finalResponse += combinedWordResponse + " ";
      }
    }

    if (finalResponse.trim()) {
      addMessage(finalResponse.trim(), "ai");
    } else {
      addMessage("Sorry, I couldn't find any information on that.", "ai");
    }
  }

  // Function to fetch information from Wikipedia
  async function fetchWikipedia(query) {
    const url = https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)};
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.extract || null;
    } catch {
      return null;
    }
  }

  // Function to fetch information from DuckDuckGo
  async function fetchDuckDuckGo(query) {
    const url = https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.AbstractText || null;
    } catch {
      return null;
    }
  }

