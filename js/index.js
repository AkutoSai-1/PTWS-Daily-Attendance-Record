document.addEventListener("DOMContentLoaded", () => {
  const plusBtn = document.getElementById("plus");
  const tbody = document.querySelector("tbody");
  const downloadBtn = document.getElementById("downloadBtn");

  function fillEmptyDates() {
    const todayStr = new Date().toLocaleDateString("en-GB");
    document.querySelectorAll(".date-cell").forEach((cell) => {
      if (!cell.innerText.trim()) {
        cell.innerText = todayStr;
      }
    });
  }

  fillEmptyDates();

  plusBtn.onclick = () => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td contenteditable="true" class="first-name"></td>
      <td contenteditable="true" class="surname"></td>
      <td>
        <select class="student-class" name="student_class">
          <option value="">Select Class</option>
          <option value="Form 1">Form 1</option>
          <option value="Form 2">Form 2</option>
          <option value="Form 3">Form 3</option>
          <option value="Form 4">Form 4</option>
          <option value="Form 5">Form 5</option>
          <option value="Lower 6">Lower 6</option>
          <option value="Upper 6">Upper 6</option>
        </select>
      </td>
      <td>
        <select class="student-gender" name="student_gender">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </td>
      <td class="date-cell">${new Date().toLocaleDateString("en-GB")}</td>
      <td><input type="checkbox" class="checkbox" /></td>
      <td>
        <button class="trash">
          <i class="fa fa-trash-o"></i>
        </button>
      </td>
    `;

    tbody.appendChild(row);

    
    if (typeof bindRowListeners === "function") {
      bindRowListeners(row);
    }

    if (typeof saveAttendanceTable === "function") saveAttendanceTable();
  };

  document.addEventListener("click", (e) => {
    const trashBtn = e.target.closest(".trash");

    if (trashBtn && trashBtn.closest("tr")) {
      trashBtn.closest("tr").remove();
      if (typeof saveAttendanceTable === "function") saveAttendanceTable();
    }
  });

  document.querySelectorAll(".secure-email").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const user = this.getAttribute("data-user");
      const domain = this.getAttribute("data-domain");

      window.location.href = "mailto:" + user + "@" + domain;
    });
  });

  if (downloadBtn) {
    downloadBtn.onclick = () => {
      const rows = document.querySelectorAll("tbody tr");
      if (rows.length === 0) {
        alert("The attendance table is empty!");
        return;
      }

      let reportText = "PRINCES TOWN WEST SECONDARY SCHOOL\n";
      reportText += "DAILY ATTENDANCE REPORT\n";
      reportText +=
        "Generated: " + new Date().toLocaleDateString("en-GB") + "\n";
      reportText += "========================================\n\n";

      rows.forEach((row, index) => {
        const firstName =
          row.querySelector(".first-name")?.innerText.trim() || "N/A";
        const surname =
          row.querySelector(".surname")?.innerText.trim() || "N/A";
        const studentClass =
          row.querySelector(".student-class")?.value || "N/A";
        const studentGender =
          row.querySelector(".student-gender")?.value || "N/A";
        const isPresent = row.querySelector(".checkbox")?.checked
          ? "PRESENT"
          : "ABSENT";

        reportText += `${index + 1}. [Class: ${studentClass}] [Gender: ${studentGender}] ${surname}, ${firstName} -- [${isPresent}]\n`;
      });

      const blob = new Blob([reportText], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download =
        "Attendance_Report_" + new Date().toISOString().slice(0, 10) + ".txt";
      link.click();
    };
  }
});
