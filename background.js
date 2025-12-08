import { GoogleGenerativeAI } from './generative-ai.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PROCESS_IMAGE") {
    processImage(request.imageUrl).then(sendResponse);
    return true; // Keep channel open for async response
  }
});

async function processImage(imageUrl) {
  try {
    const data = await chrome.storage.local.get(['googleApiKey', 'customPrompt', 'selectedModel']);
    const apiKey = data.googleApiKey;
    const customPrompt = data.customPrompt || "Edit this image to make it look like there are happy people enjoying the hotel. Return the result as a generated image.";
    const selectedModel = data.selectedModel || "gemini-2.5-flash-image";

    if (!apiKey) {
      return { success: false, error: "Please set your API Key in the extension popup." };
    }

    // 1. Fetch the image to convert to base64
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const base64Data = await blobToBase64(blob);
    
    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
    const base64Content = base64Data.split(',')[1];
    const mimeType = blob.type;

    // 2. Initialize Google AI SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use the requested model
    const model = genAI.getGenerativeModel({ model: selectedModel });

    // 3. Generate Content
    const result = await model.generateContent([
      customPrompt,
      {
        inlineData: {
          data: base64Content,
          mimeType: mimeType
        }
      }
    ]);

    const responseData = await result.response;
    
    // Note: The SDK structure for image generation responses might vary slightly 
    // depending on if it's text-only or multimodal return.
    // We check for candidates similar to the REST API.
    
    // The SDK helper `text()` gets text, but for images we need to inspect the candidates directly.
    // However, the SDK object might not expose the raw candidates easily in all versions.
    // Let's try to access the underlying response object.
    
    const candidates = responseData.candidates;
    
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      
      // Look for an image part
      const imagePart = parts.find(part => part.inlineData);
      
      if (imagePart) {
        const generatedBase64 = imagePart.inlineData.data;
        const generatedMimeType = imagePart.inlineData.mimeType;
        const dataUrl = `data:${generatedMimeType};base64,${generatedBase64}`;
        
        return {
          success: true,
          newImageUrl: dataUrl,
          description: "AI Generated Image with People"
        };
      }
      
      // Fallback if it only returned text
      const textPart = parts.find(part => part.text);
      if (textPart) {
         console.log("AI returned text instead of image:", textPart.text);
         return { 
            success: true, 
            newImageUrl: "https://placehold.co/600x400/png?text=AI+Returned+Text+Only",
            description: textPart.text
         };
      }
    }

    throw new Error("No content returned from AI");

  } catch (error) {
    console.error("Error processing image:", error);
    return { success: false, error: error.message };
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
