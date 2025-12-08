# Your Real Hotel Stay

"Your Real Hotel Stay" is a Chrome extension that uses advanced Google AI models to realistically add people to empty hotel marketing images. See what the hotel might actually look like with guests!

## Features
- **AI-Powered Image Editing**: Uses Google's Gemini models to seamlessly add people to images.
- **Model Selection**: Choose between "Nano Banana" (`gemini-2.5-flash-image`) and "Nano Banana Pro" (`gemini-3-pro-image-preview`).
- **Custom Prompts**: Customize the instruction given to the AI (e.g., "add happy families", "add business travelers").
- **Simple Interface**: Just hover over any image on a hotel booking site and click "Add People (AI)".

## Supported Browsers
This extension is built with **Manifest V3** and works natively on all Chromium-based browsers:
- **Google Chrome**
- **Microsoft Edge**
- **Brave**
- **Opera**
- **Vivaldi**
- **Arc**

*Note: Firefox and Safari are not currently supported out-of-the-box.*

## Installation

**Watch the video tutorial:** [How to Install (YouTube)](https://www.youtube.com/watch?v=NH5CPm9pyts)

### Option 1: The Easy Way (Download ZIP)
1.  **Download the file**: [Click here to download the extension ZIP file](./zip/your-real-hotel-stay-v1.0.0.zip).
2.  **Unzip the file**: Find the downloaded `your-real-hotel-stay-v1.0.0.zip` on your computer and double-click it to extract it. This will create a folder with the extension files.
3.  **Open Chrome Extensions**: 
    *   Open Google Chrome.
    *   Type `chrome://extensions/` in the address bar and press Enter.
4.  **Enable Developer Mode**: 
    *   Look at the top right corner of the page.
    *   Turn on the switch that says **Developer mode**.
5.  **Load the Extension**:
    *   Click the **Load unpacked** button that appeared in the top left.
    *   Select the folder you just extracted (unzipped).
6.  **Done!** You should now see the "Your Real Hotel Stay" icon in your browser toolbar.

### Installation on Other Browsers

The steps are almost identical, just the address bar URL is different:

*   **Microsoft Edge**:
    1.  Go to `edge://extensions`
    2.  Enable **Developer mode** (toggle in the sidebar or bottom left).
    3.  Click **Load unpacked** and select the extension folder.

*   **Brave**:
    1.  Go to `brave://extensions`
    2.  Enable **Developer mode** (top right).
    3.  Click **Load unpacked**.

*   **Opera**:
    1.  Go to `opera://extensions`
    2.  Enable **Developer mode** (top right).
    3.  Click **Load unpacked**.

*   **Arc**:
    1.  Go to `arc://extensions`
    2.  Enable **Developer mode** (top right).
    3.  Click **Load unpacked**.

### Option 2: For Developers (Git)
1.  Clone this repository:
    ```bash
    git clone https://github.com/yourusername/your-repo-name.git
    ```
2.  Follow steps 3-5 above, selecting the `your-real-hotel-stay` folder.

## Usage
1. Click the extension icon in your browser toolbar.
2. Enter your **Google AI Studio API Key**. (Get one [here](https://aistudio.google.com/app/apikey)).
3. Select your preferred AI Model.
4. (Optional) Customize the AI Prompt.
5. Visit any hotel booking website (e.g., Booking.com, Expedia).
6. Hover over a hotel image and click the **"Add People (AI)"** button.
7. Wait for the magic to happen!

## Disclaimer
This extension is a fun project and is not affiliated with any hotel booking platform or Google. AI-generated images may vary in quality and accuracy.
