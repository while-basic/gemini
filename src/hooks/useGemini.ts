import { GoogleGenerativeAI } from "@google/generative-ai";

// System prompt template for Gemini request
const GEMINI_SYSTEM_PROMPT = `
  - Narrate the picture of the human as if it is a nature documentary by David Attenborough.
  - Make it snarky and funny. 
  - Don't repeat yourself. 
  - Make it short. 
  - If I do anything remotely interesting, make a big deal about it!  
  - the user is dictating with his or her camera on.
  - Do not mention that there are a sequence of pictures. 

----- USER PROMPT BELOW -----

{{USER_PROMPT}}
`;

/**
 * Make a request to the Gemini API for generating content based on text and images.
 *
 * @param {string} text - The user's text prompt.
 * @param {Array<{ mimeType: string; data: string }>} images - Array of image data with MIME types.
 * @param {React.Dispatch<React.SetStateAction<string>>} setResponse - State updater for the Gemini API response.
 * @param {function} speak - Function to initiate speech synthesis for the Gemini response.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsLoading - State updater for loading status.
 * @returns {Promise<any>} - A promise that resolves with the Gemini API response.
 */
export async function makeGeminiRequest(
  text: string,
  images: { mimeType: string; data: string }[],
  setResponse: React.Dispatch<React.SetStateAction<string>>,
  speak: (message: string) => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<any> {
  // Initialize the Google Generative AI with the Gemini API key
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

  // Get the Generative Model for Gemini
  const model = genAI.getGenerativeModel({
    model: import.meta.env.VITE_GEMINI_MODEL,
  });

  // Check if there are no images and no text
  if (images.length === 0 && !text) return null;

  try {
    // Generate content stream with system and user prompts
    const result = await model.generateContentStream([
      GEMINI_SYSTEM_PROMPT.replace("{{USER_PROMPT}}", text),
      ...images.map((image) => ({
        inlineData: image,
      })),
    ]);

    // Extract and process the response
    const response = result.response;
    const content = (await response).text();
    // Initiate speech synthesis for the Gemini response
    speak(content);
    // Update state with the Gemini response
    setResponse(content);
    // Set loading status to false
    setIsLoading(false);
    return response;
  } catch (error) {
    setResponse("Something went wrong");
    speak("Something went wrong");
    setIsLoading(false);
    console.error(error);
    // Propagate the error
    throw error;
  }
}
