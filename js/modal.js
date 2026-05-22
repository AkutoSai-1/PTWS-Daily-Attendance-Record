document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("policyModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.querySelector(".close-btn");
  const helpBtn = document.getElementById("helpBtn");

  
  document
    .querySelectorAll("footer nav a:not(.secure-email)")
    .forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetUrl = this.getAttribute("href");

        fetch(targetUrl)
          .then((response) => response.text())
          .then((htmlString) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, "text/html");
            const policyContent = doc.querySelector(".terms-container");

            if (policyContent) {
              const backBtn = policyContent.querySelector(".back-btn");
              if (backBtn) backBtn.remove();

              modalBody.innerHTML = policyContent.innerHTML;
              modal.style.display = "block";
            }
          })
          .catch((err) => console.error("Error loading policy popup:", err));
      });
    });

  if (helpBtn) {
    helpBtn.onclick = () => {
      modalBody.innerHTML = `
        <h2>Attendance System Guide</h2>
        <h3>How to use the roster:</h3>
        <p><strong>1. Add Students:</strong> Click the blue <strong>[+]</strong> button on the right to append a brand new record row to the end of your session table sheet.</p>
        <p><strong>2. Export Records:</strong> Click the green <strong>Download</strong> icon button next to the plus sign to download a permanent text report file of your active table to your device.</p>
        <p><strong>3. Modify Identity Fields:</strong> Click directly into any blank <strong>FirstName</strong> or <strong>SurName</strong> cell to instantly start typing names using your keyboard.</p>
        <p><strong>4. Record Status:</strong> Click the attendance checkbox item within a row to toggle a student's marking state between absent and present.</p>
        <p><strong>5. Single Deletion:</strong> Click a row's red trash bin icon button <strong>once</strong> to instantly remove that single row entry from your dataset.</p>
        <h3>💡 Automation Rules</h3>
        <p>The layout completely auto-saves your progress whenever you type, toggle checkboxes, or modify rows. For data security protocols, your local storage file will automatically expire and wipe out cleanly at exactly <strong>2:45 PM daily</strong>.</p>
      `;
      modal.style.display = "block";
    };
  }

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };
});
