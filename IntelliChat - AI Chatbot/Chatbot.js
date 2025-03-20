const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;//user write msg
const API_KEY = "AIzaSyBS4-WFBL4JazwfSYLa30aGf7yjo9kU2_s";
const API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// create new massage
const createMassageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("massage", ...classes);
  div.innerHTML = content;
  return div;
};

// Typing Effect
const showTypingEffect = (text, textElement, incomingMassageDiv) => {
  const words = text.split(" ");
  let currentWordIndex = 0;
  const typingInterval = setInterval(() => {
    textElement.innerText +=
      (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex++];//take words one by one
    incomingMassageDiv.querySelector(".icon").classList.add("hide");
    if (currentWordIndex === words.length) {//if sentance is done then remove loading effect
      clearInterval(typingInterval);
      incomingMassageDiv.querySelector(".icon").classList.remove("hide");
    }
    chatList.scrollTo(0, chatList.scrollHeight);
  }, 75);
};

// API Configaration
const generateAPIResponse = async (incomingMassageDiv) => {
  const textElement = incomingMassageDiv.querySelector(".text");
  try {
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: userMessage,//send user's msg to api and give ans to text
              },
            ],
          },
        ],
      }),
    });
    const data = await response.json();//convert api response to js object
    if (!response.ok) throw new Error(data.error.massage);

    const APIResponse = data?.candidates[0].content.parts[0].text//smoothly access api genereted text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/^\s*[-*]\s+/gm, "\n"); // Replace bullets with a new line
    showTypingEffect(APIResponse, textElement, incomingMassageDiv);
  } catch (error) {
    console.log(error);
    textElement.innerText = error.massage;
    textElement.classList.add("error");
  } finally {
    incomingMassageDiv.classList.remove("load");
  }
};

// Loading Animation
const showLoadingAnimation = () => {
  const html = `<div class="massage-contant">
                <img src="images/Intellichat.png" alt="Intellichat image" class="avtar">
                <p class="text"></p>
                <div class="loading">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                </div>
            </div>
                <span onclick="copyMessage(this)" class="icon material-symbols-rounded">
                content_copy
            </span> `;
  const incomingMassageDiv = createMassageElement(html, "incoming", "load");//create a loading effect div
  chatList.appendChild(incomingMassageDiv);//add this div in chatlist

  chatList.scrollTo(0, chatList.scrollHeight);
  generateAPIResponse(incomingMassageDiv);//called api
};

// Copy MSG in Clipboard
const copyMessage = (copyIcon) => {
  const massageText = copyIcon.parentElement.querySelector(".text").innerText;

  navigator.clipboard.writeText(massageText);
  copyIcon.innerText = "done";
  setTimeout(() => (copyIcon.innerText = "content_copy"), 1000);
};

// Sending Outgoing Msg
const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim();//user add text
  if (!userMessage) {
    return; 
  }
  const html = ` <div class="massage-contant">
                <img src="images/user.jpg" alt="User image" class="avtar">
                <p class="text"></p>
            </div>`;
  const outgoingMassageDiv = createMassageElement(html, "outgoing");//create response div
  outgoingMassageDiv.querySelector(".text").innerText = userMessage;
  chatList.appendChild(outgoingMassageDiv);//display user's msg

  typingForm.reset();
  chatList.scrollTo(0, chatList.scrollHeight);
  document.body.classList.add("hide-header");
  setTimeout(showLoadingAnimation, 500);
};

typingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleOutgoingChat();
});