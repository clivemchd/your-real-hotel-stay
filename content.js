function addAiButtons() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Skip small icons, already processed images, or our own placeholders
    if (img.width < 200 || img.height < 200 || img.dataset.hasAiButton) return;
    
    // Create button
    const btn = document.createElement('button');
    btn.className = 'ai-people-btn';
    btn.style.display = 'none'; // Hidden by default
    btn.style.position = 'fixed';
    btn.style.zIndex = '2147483647'; // Max safe integer
    
    // Wrap text in span for z-index
    const span = document.createElement('span');
    span.innerText = 'Add People (AI)';
    btn.appendChild(span);
    
    // Append to BODY
    document.body.appendChild(btn);
    img.dataset.hasAiButton = 'true';
    
    let hideTimeout;
    let scrollListener;

    const updatePosition = () => {
      const rect = img.getBoundingClientRect();
      
      // Hide if off screen or invisible
      if (
        rect.width < 50 || 
        rect.height < 50 || 
        rect.bottom < 0 || 
        rect.top > window.innerHeight ||
        rect.right < 0 ||
        rect.left > window.innerWidth ||
        window.getComputedStyle(img).display === 'none' ||
        window.getComputedStyle(img).visibility === 'hidden'
      ) {
        btn.style.display = 'none';
        return;
      }

      // Position top-right corner of image
      // Use 'right' property relative to viewport to avoid needing button width
      btn.style.top = (rect.top + 10) + 'px';
      btn.style.right = (window.innerWidth - rect.right + 10) + 'px';
      btn.style.left = 'auto'; 
      btn.style.display = 'block';
    };

    const showButton = () => {
      clearTimeout(hideTimeout);
      updatePosition();
      
      // Add scroll listener to update position if page/modal scrolls while hovering
      if (!scrollListener) {
        scrollListener = () => {
            if (btn.style.display === 'block') updatePosition();
        };
        window.addEventListener('scroll', scrollListener, true);
      }
    };

    const hideButton = () => {
      hideTimeout = setTimeout(() => {
        btn.style.display = 'none';
        // Clean up listener
        if (scrollListener) {
            window.removeEventListener('scroll', scrollListener, true);
            scrollListener = null;
        }
      }, 200);
    };

    // Hover Listeners
    img.addEventListener('mouseenter', showButton);
    img.addEventListener('mouseleave', hideButton);
    
    btn.addEventListener('mouseenter', showButton); // Keep showing if on button
    btn.addEventListener('mouseleave', hideButton);
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Check if we are in "Reset" mode
      if (span.innerText === 'Reset') {
        if (img.dataset.originalSrc) {
          img.src = img.dataset.originalSrc;
        }
        span.innerText = 'Add People (AI)';
        btn.className = 'ai-people-btn'; // Reset classes
        return;
      }

      // Store original source if not already stored
      if (!img.dataset.originalSrc) {
        img.dataset.originalSrc = img.src;
      }
      
      span.innerText = 'Processing...';
      btn.classList.add('processing');
      btn.disabled = true;
      
      try {
        chrome.runtime.sendMessage({
          action: "PROCESS_IMAGE",
          imageUrl: img.dataset.originalSrc // Always use original source
        }, (response) => {
          btn.disabled = false; // Re-enable button
          btn.classList.remove('processing');

          if (chrome.runtime.lastError) {
            if (chrome.runtime.lastError.message && chrome.runtime.lastError.message.includes('Extension context invalidated')) {
               span.innerText = 'Refresh Page';
               btn.classList.add('error');
               alert('Extension updated. Please refresh the page.');
               return;
            }
            
            span.innerText = 'Error';
            btn.classList.add('error');
            console.error(chrome.runtime.lastError);
            return;
          }

          if (response && response.success) {
            img.src = response.newImageUrl;
            img.alt = response.description;
            img.title = response.description;
            
            // Change button to Reset
            span.innerText = 'Reset';
            btn.classList.add('reset');
          } else {
            span.innerText = 'Failed';
            btn.classList.add('error');
            alert("Error: " + (response ? response.error : "Unknown error"));
            setTimeout(() => {
              span.innerText = 'Add People (AI)';
              btn.className = 'ai-people-btn'; // Reset classes
            }, 3000);
          }
        });
      } catch (error) {
        console.error("Extension error:", error);
        btn.disabled = false;
        btn.classList.remove('processing');
        span.innerText = 'Refresh Page';
        btn.classList.add('error');
        alert('Extension updated. Please refresh the page to continue.');
      }
    });
  });
}

// Run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addAiButtons);
} else {
  addAiButtons();
}

// Run periodically to catch lazy loaded images
setInterval(addAiButtons, 2000);
